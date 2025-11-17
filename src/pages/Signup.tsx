import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Heart, ArrowLeft, Phone, MapPin, User } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { toast } from 'sonner'

export default function Signup() {
  const navigate = useNavigate()
  const { signUp, loading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Comprehensive form validation
    if (!formData.name.trim()) {
      toast.error('Please enter your full name')
      return
    }
    
    if (!formData.email.trim()) {
      toast.error('Please enter your email address')
      return
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    
    // Phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(formData.phone.replace(/[^\d]/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }
    
    if (!formData.password.trim()) {
      toast.error('Please enter a password')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    
    // Address validation
    if (!formData.address.street.trim() || !formData.address.city.trim() || 
        !formData.address.state.trim() || !formData.address.zipCode.trim()) {
      toast.error('Please complete your address information')
      return
    }
    
    // ZIP code validation
    const zipRegex = /^\d{6}$/
    if (!zipRegex.test(formData.address.zipCode)) {
      toast.error('Please enter a valid 6-digit PIN code')
      return
    }

    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        role: 'food_seeker'
      })
      
      toast.success('Welcome to our family! 🎉 Please check your email to verify your account.')
      navigate('/')
    } catch (error) {
      console.error('Signup error:', error)
      // Error is already handled in the store
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-terracotta-50 to-saffron-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-warmbrown-600 hover:text-terracotta-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Signup Card */}
        <div className="bg-white rounded-kitchen shadow-food-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-terracotta-500 to-saffron-500 rounded-kitchen flex items-center justify-center">
                <Heart className="w-8 h-8 text-white animate-heart-beat" />
              </div>
            </div>
            <h1 className="cultural-heading text-2xl mb-2">Join Our Family!</h1>
            <p className="cultural-body text-warmbrown-600">
              Become part of our community and discover the warmth of home-cooked meals
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-warmbrown-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="cultural-input w-full px-4 py-3"
                  placeholder="Your full name"
                />
              </div>

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
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-warmbrown-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="cultural-input w-full px-4 py-3"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label htmlFor="address.zipCode" className="block text-sm font-medium text-warmbrown-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="address.zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  required
                  className="cultural-input w-full px-4 py-3"
                  placeholder="110001"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address.street" className="block text-sm font-medium text-warmbrown-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                required
                className="cultural-input w-full px-4 py-3"
                placeholder="123, Gali No. 5, Krishna Nagar"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-warmbrown-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  required
                  className="cultural-input w-full px-4 py-3"
                  placeholder="Delhi"
                />
              </div>

              <div>
                <label htmlFor="address.state" className="block text-sm font-medium text-warmbrown-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  required
                  className="cultural-input w-full px-4 py-3"
                  placeholder="Delhi"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
                    placeholder="Create a strong password"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-warmbrown-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="cultural-input w-full px-4 py-3 pr-12"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warmbrown-400 hover:text-warmbrown-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="warm-button w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Join Our Family'
              )}
            </button>
          </form>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-warmbrown-500">
              By joining, you agree to our{' '}
              <Link to="/terms" className="text-terracotta-600 hover:text-terracotta-800">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-terracotta-600 hover:text-terracotta-800">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-warmbrown-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-terracotta-600 hover:text-terracotta-800 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Cultural Quote */}
        <div className="mt-8 text-center">
          <p className="cultural-quote text-center text-terracotta-600">
            Every new member adds more love to our kitchen family
          </p>
        </div>
      </div>
    </div>
  )
}