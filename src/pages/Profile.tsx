import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Heart, Star, MapPin, Phone, Mail, Calendar, LogOut, Edit3, Settings } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export default function Profile() {
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserOrders()
  }, [])

  const fetchUserOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Could not fetch your orders')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Could not sign out')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="cultural-heading text-2xl mb-4">Please sign in to view your profile</h1>
          <Link to="/login" className="warm-button">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const userName = user.name || 'Food Lover'
  const userEmail = user.email
  const userPhone = user.phone || 'Not provided'
  const userAddress = user.address
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="cultural-heading text-3xl">
              Your <span className="text-terracotta-600">Profile</span>
            </h1>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 border border-terracotta-300 text-terracotta-700 rounded-lg hover:bg-terracotta-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="kitchen-card p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-terracotta-400 to-saffron-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="font-serif text-warmbrown-800 font-bold text-xl mb-2">{userName}</h2>
                <p className="text-warmbrown-600 mb-4">{userEmail}</p>
                
                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2 text-sm text-warmbrown-600">
                    <Phone className="w-4 h-4" />
                    <span>{userPhone}</span>
                  </div>
                  {userAddress && (
                    <div className="flex items-center space-x-2 text-sm text-warmbrown-600">
                      <MapPin className="w-4 h-4" />
                      <span>{userAddress.city}, {userAddress.state}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-warmbrown-600">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {memberSince}</span>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <Link to="/edit-profile" className="warm-button w-full flex items-center justify-center space-x-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Link>
                  <button className="flex items-center justify-center space-x-2 w-full px-4 py-3 border-2 border-terracotta-300 text-terracotta-700 rounded-lg hover:bg-terracotta-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats and Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="kitchen-card p-6 text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-terracotta-600">{orders.length}</div>
                  <div className="text-sm text-warmbrown-600">Orders Placed</div>
                </div>
                <div className="kitchen-card p-6 text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-saffron-600">0</div>
                  <div className="text-sm text-warmbrown-600">Reviews Written</div>
                </div>
                <div className="kitchen-card p-6 text-center">
                  <MapPin className="w-8 h-8 text-deepgreen-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-deepgreen-600">0</div>
                  <div className="text-sm text-warmbrown-600">Favorite Kitchens</div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="kitchen-card p-6">
                <h3 className="cultural-subheading mb-4">Recent Orders</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-terracotta-200 border-t-terracotta-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-warmbrown-600">Loading your orders...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="flex items-center space-x-4 p-4 bg-terracotta-50 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-br from-terracotta-200 to-saffron-200 rounded-kitchen flex items-center justify-center">
                          <Heart className="w-6 h-6 text-terracotta-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-warmbrown-800">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-warmbrown-600">
                            ₹{order.total_amount} • {order.status} • {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-16 h-16 text-warmbrown-300 mx-auto mb-4" />
                    <p className="text-warmbrown-600 mb-4">No orders yet</p>
                    <Link to="/discover" className="warm-button">
                      Discover Kitchens
                    </Link>
                  </div>
                )}
              </div>

              {/* Favorite Kitchens */}
              <div className="kitchen-card p-6">
                <h3 className="cultural-subheading mb-4">Your Favorite Kitchens</h3>
                <div className="text-center py-8">
                  <Heart className="w-16 h-16 text-warmbrown-300 mx-auto mb-4" />
                  <p className="text-warmbrown-600 mb-4">No favorite kitchens yet</p>
                  <Link to="/discover" className="warm-button">
                    Discover Kitchens
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}