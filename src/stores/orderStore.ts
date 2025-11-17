import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Order, OrderItem, MenuItem } from '../lib/supabase'

interface CartItem {
  menuItem: MenuItem
  quantity: number
  specialInstructions?: string
}

interface OrderState {
  cart: CartItem[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
  
  // Cart actions
  addToCart: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void
  removeFromCart: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  updateSpecialInstructions: (menuItemId: string, instructions: string) => void
  clearCart: () => void
  
  // Order actions
  setCurrentOrder: (order: Order) => void
  clearCurrentOrder: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Cart utilities
  getCartTotal: () => number
  getCartItemCount: () => number
  getCartKitchenId: () => string | null
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      cart: [],
      currentOrder: null,
      loading: false,
      error: null,

      addToCart: (menuItem: MenuItem, quantity: number = 1, specialInstructions?: string) => {
        const { cart } = get()
        const existingItem = cart.find(item => item.menuItem.id === menuItem.id)
        
        if (existingItem) {
          // Update quantity if item already exists
          set({
            cart: cart.map(item =>
              item.menuItem.id === menuItem.id
                ? { ...item, quantity: item.quantity + quantity, specialInstructions }
                : item
            )
          })
        } else {
          // Add new item
          set({
            cart: [...cart, { menuItem, quantity, specialInstructions }]
          })
        }
      },

      removeFromCart: (menuItemId: string) => {
        const { cart } = get()
        set({
          cart: cart.filter(item => item.menuItem.id !== menuItemId)
        })
      },

      updateQuantity: (menuItemId: string, quantity: number) => {
        const { cart } = get()
        if (quantity <= 0) {
          get().removeFromCart(menuItemId)
          return
        }
        
        set({
          cart: cart.map(item =>
            item.menuItem.id === menuItemId
              ? { ...item, quantity }
              : item
          )
        })
      },

      updateSpecialInstructions: (menuItemId: string, instructions: string) => {
        const { cart } = get()
        set({
          cart: cart.map(item =>
            item.menuItem.id === menuItemId
              ? { ...item, specialInstructions: instructions }
              : item
          )
        })
      },

      clearCart: () => set({ cart: [] }),

      setCurrentOrder: (order: Order) => set({ currentOrder: order }),
      clearCurrentOrder: () => set({ currentOrder: null }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),

      getCartTotal: () => {
        const { cart } = get()
        return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0)
      },

      getCartItemCount: () => {
        const { cart } = get()
        return cart.reduce((count, item) => count + item.quantity, 0)
      },

      getCartKitchenId: () => {
        const { cart } = get()
        if (cart.length === 0) return null
        return cart[0].menuItem.kitchen_id
      }
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({ 
        cart: state.cart,
        currentOrder: state.currentOrder
      })
    }
  )
)

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Helper function to format order status
export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Order Placed',
    'confirmed': 'Order Confirmed',
    'preparing': 'Being Prepared',
    'ready': 'Ready for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  }
  return statusMap[status] || status
}

// Helper function to get status color
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'pending': 'text-yellow-600 bg-yellow-50',
    'confirmed': 'text-blue-600 bg-blue-50',
    'preparing': 'text-orange-600 bg-orange-50',
    'ready': 'text-purple-600 bg-purple-50',
    'delivered': 'text-green-600 bg-green-50',
    'cancelled': 'text-red-600 bg-red-50'
  }
  return colorMap[status] || 'text-gray-600 bg-gray-50'
}