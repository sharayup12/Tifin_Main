import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Heart, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { toast } from 'sonner'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, loading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validation
    if (!formData.email.trim()) {
      toast.error('Please enter your email address')
      return
    }
    
    if (!formData.password.trim()) {
      toast.error('Please enter your password')
      return
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    try {
      await signIn(formData.email, formData.password)
      toast.success('Welcome back! 🎉')
      navigate('/')
    } catch (error) {
      // Error is already handled in the store
      console.error('Login error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-terracotta-50 to-saffron-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-warmbrown-600 hover:text-terracotta-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-kitchen shadow-food-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-terracotta-500 to-saffron-500 rounded-kitchen flex items-center justify-center">
                <Heart className="w-8 h-8 text-white animate-heart-beat" />
              </div>
            </div>
            <h1 className="cultural-heading text-2xl mb-2">Welcome Back!</h1>
            <p className="cultural-body text-warmbrown-600">
              Sign in to discover kitchens that feel like home
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-warmbrown-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="cultural-input w-full px-4 py-3"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-warmbrown-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="cultural-input w-full px-4 py-3 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warmbrown-400 hover:text-warmbrown-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-terracotta-200 text-terracotta-600 focus:ring-terracotta-500"
                />
                <span className="ml-2 text-sm text-warmbrown-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-terracotta-600 hover:text-terracotta-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="warm-button w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-terracotta-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-warmbrown-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-terracotta-200 rounded-lg hover:bg-terracotta-50 transition-colors">
              <span className="text-sm text-warmbrown-700">Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-terracotta-200 rounded-lg hover:bg-terracotta-50 transition-colors">
              <span className="text-sm text-warmbrown-700">Phone</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-warmbrown-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-terracotta-600 hover:text-terracotta-800 font-medium transition-colors"
              >
                Join our family
              </Link>
            </p>
          </div>
        </div>

        {/* Cultural Quote */}
        <div className="mt-8 text-center">
          <p className="cultural-quote text-center text-terracotta-600">
            Every meal is a story waiting to be shared
          </p>
        </div>
      </div>
    </div>
  )
}