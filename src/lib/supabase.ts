import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// User types
export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: 'food_seeker' | 'home_kitchen' | 'admin'
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  created_at: string
  updated_at: string
}

// Kitchen types
export interface Kitchen {
  id: string
  user_id: string
  name: string
  owner_name: string
  story: string
  cuisine_type: string
  description: string
  phone: string
  email: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  is_active: boolean
  status: 'pending' | 'approved' | 'rejected'
  opening_time: string
  closing_time: string
  rating: number
  review_count: number
  cover_image: string
  gallery_images: string[]
  created_at: string
  updated_at: string
}

// Menu Item types
export interface MenuItem {
  id: string
  kitchen_id: string
  name: string
  description: string
  price: number
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage'
  is_available: boolean
  dietary_info: {
    is_veg: boolean
    is_vegan: boolean
    is_gluten_free: boolean
    is_spicy: boolean
    allergens: string[]
  }
  image_url: string
  preparation_time: number // in minutes
  created_at: string
  updated_at: string
}

// Order types
export interface Order {
  id: string
  user_id: string
  kitchen_id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  total_amount: number
  delivery_address: {
    street: string
    city: string
    state: string
    zipCode: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  scheduled_time: string
  delivery_time: string
  special_instructions: string
  payment_status: 'pending' | 'paid' | 'failed'
  payment_method: 'cod' | 'online'
  created_at: string
  updated_at: string
}

// Order Item types
export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  price: number
  special_instructions: string
  created_at: string
}

// Review types
export interface Review {
  id: string
  user_id: string
  kitchen_id: string
  order_id: string
  rating: number // 1-5
  comment: string
  photos: string[]
  created_at: string
  updated_at: string
}

// Auth functions
export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const updateUserProfile = async (updates: Partial<User>) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  })
  return { data, error }
}

// Kitchen functions
export const getNearbyKitchens = async (lat: number, lng: number, radius: number = 5000) => {
  const { data, error } = await supabase
    .from('kitchens')
    .select(`
      *,
      menu_items:kitchen_id(*),
      reviews:kitchen_id(rating)
    `)
    .eq('is_active', true)
    .eq('status', 'approved')
    .order('rating', { ascending: false })
  
  // Filter by distance (client-side for now, can be optimized with PostGIS later)
  if (data) {
    const filteredKitchens = data.filter(kitchen => {
      const distance = calculateDistance(lat, lng, kitchen.address.coordinates.lat, kitchen.address.coordinates.lng)
      return distance <= radius
    })
    return { data: filteredKitchens, error }
  }
  
  return { data, error }
}

export const getKitchenById = async (kitchenId: string) => {
  const { data, error } = await supabase
    .from('kitchens')
    .select(`
      *,
      menu_items(*),
      reviews(*, user:users(name))
    `)
    .eq('id', kitchenId)
    .single()
  
  return { data, error }
}

// Order functions
export const createOrder = async (orderData: Partial<Order>, items: Partial<OrderItem>[]) => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()
  
  if (orderError) return { data: null, error: orderError }
  
  // Add order items
  const orderItems = items.map(item => ({
    ...item,
    order_id: order.id
  }))
  
  const { data: orderItemsData, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select()
  
  if (itemsError) {
    // Rollback order if items fail
    await supabase.from('orders').delete().eq('id', order.id)
    return { data: null, error: itemsError }
  }
  
  return { data: { order, items: orderItemsData }, error: null }
}

export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      kitchen:kitchens(name, cover_image),
      order_items(*, menu_item:menu_items(name, image_url))
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// Review functions
export const createReview = async (reviewData: Partial<Review>) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(reviewData)
    .select()
    .single()
  
  if (data) {
    // Update kitchen rating
    await updateKitchenRating(data.kitchen_id)
  }
  
  return { data, error }
}

// Helper functions
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c // Distance in meters
}

const updateKitchenRating = async (kitchenId: string) => {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('kitchen_id', kitchenId)
  
  if (reviews && reviews.length > 0) {
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    
    await supabase
      .from('kitchens')
      .update({ 
        rating: Math.round(avgRating * 10) / 10,
        review_count: reviews.length
      })
      .eq('id', kitchenId)
  }
}

// Real-time subscriptions
export const subscribeToOrderUpdates = (orderId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`order:${orderId}`)
    .on('postgres_changes', 
      { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
      callback
    )
    .subscribe()
}

export const subscribeToKitchenOrders = (kitchenId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`kitchen:${kitchenId}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders', filter: `kitchen_id=eq.${kitchenId}` },
      callback
    )
    .subscribe()
}