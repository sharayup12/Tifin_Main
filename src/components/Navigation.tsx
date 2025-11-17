import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, MapPin, User, ShoppingCart, Home, Search, LogOut } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useOrderStore } from '../stores/orderStore'
import { toast } from 'sonner'

const Navigation: React.FC = () => {
  const location = useLocation()
  const { user, signOut } = useAuthStore()
  const { getCartItemCount } = useOrderStore()
  
  const cartItemCount = getCartItemCount()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-food-card border-b border-terracotta-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-terracotta-500 to-saffron-500 rounded-kitchen flex items-center justify-center">
              <Heart className="w-5 h-5 text-white animate-heart-beat" />
            </div>
            <div>
              <h1 className="font-serif text-warmbrown-800 font-bold text-lg">Tiffin Finder</h1>
              <p className="text-xs text-warmbrown-600 font-light">Kitchens of Your Neighborhood</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/') 
                  ? 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200' 
                  : 'text-warmbrown-600 hover:text-terracotta-600 hover:bg-terracotta-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link 
              to="/discover" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/discover') 
                  ? 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200' 
                  : 'text-warmbrown-600 hover:text-terracotta-600 hover:bg-terracotta-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="font-medium">Discover</span>
            </Link>
            
            {user && (
              <Link 
                to="/orders" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  isActive('/orders') 
                    ? 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200' 
                    : 'text-warmbrown-600 hover:text-terracotta-600 hover:bg-terracotta-50'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="font-medium">My Orders</span>
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link 
              to="/cart" 
              className={`relative p-2 rounded-lg transition-all ${
                isActive('/cart') 
                  ? 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200' 
                  : 'text-warmbrown-600 hover:text-terracotta-600 hover:bg-terracotta-50'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-saffron-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-gentle-float">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/profile" 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    isActive('/profile') 
                      ? 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200' 
                      : 'text-warmbrown-600 hover:text-terracotta-600 hover:bg-terracotta-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium hidden lg:inline">{user.name || 'Profile'}</span>
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await signOut()
                      toast.success('Signed out successfully')
                    } catch (error) {
                      console.error('Sign out error:', error)
                      toast.error('Could not sign out')
                    }
                  }}
                  className="flex items-center space-x-1 text-warmbrown-600 hover:text-red-600 px-2 py-1 rounded text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="text-warmbrown-600 hover:text-terracotta-600 px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="warm-button text-sm"
                >
                  Join Family
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex justify-around">
            <Link 
              to="/" 
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                isActive('/') 
                  ? 'bg-terracotta-50 text-terracotta-700' 
                  : 'text-warmbrown-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Link>
            
            <Link 
              to="/discover" 
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                isActive('/discover') 
                  ? 'bg-terracotta-50 text-terracotta-700' 
                  : 'text-warmbrown-600'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="text-xs">Discover</span>
            </Link>
            
            {user && (
              <Link 
                to="/orders" 
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                  isActive('/orders') 
                    ? 'bg-terracotta-50 text-terracotta-700' 
                    : 'text-warmbrown-600'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span className="text-xs">Orders</span>
              </Link>
            )}
            
            <Link 
              to="/cart" 
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all relative ${
                isActive('/cart') 
                  ? 'bg-terracotta-50 text-terracotta-700' 
                  : 'text-warmbrown-600'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-saffron-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <Link 
              to={user ? "/profile" : "/login"} 
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                isActive('/profile') || isActive('/login') 
                  ? 'bg-terracotta-50 text-terracotta-700' 
                  : 'text-warmbrown-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">{user ? 'Profile' : 'Sign In'}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation