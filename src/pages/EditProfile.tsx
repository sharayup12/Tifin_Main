import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Phone, MapPin, Mail, Save, X } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { updateUserProfile } from '../lib/supabase'
import { toast } from 'sonner'

export default function EditProfile() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || ''
        }
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name')
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
      setLoading(true)
      const { error } = await updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      })
      
      if (error) throw error
      
      toast.success('Profile updated successfully! 🎉')
      navigate('/profile')
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Could not update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="cultural-heading text-2xl mb-4">Please sign in to edit your profile</h1>
          <Link to="/login" className="warm-button">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-terracotta-50 to-saffron-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link
            to="/profile"
            className="flex items-center space-x-2 text-warmbrown-600 hover:text-terracotta-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </Link>

          {/* Edit Profile Card */}
          <div className="bg-white rounded-kitchen shadow-food-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-terracotta-500 to-saffron-500 rounded-kitchen flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="cultural-heading text-2xl mb-2">Edit Your Profile</h1>
              <p className="cultural-body text-warmbrown-600">
                Update your information to help us serve you better
              </p>
            </div>

            {/* Edit Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="cultural-subheading text-lg font-semibold text-warmbrown-800">Personal Information</h2>
                
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
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h2 className="cultural-subheading text-lg font-semibold text-warmbrown-800">Address Information</h2>
                
                <div>
                  <label htmlFor="address.street" className="block text-sm font-medium text-warmbrown-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
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

                <div className="grid md:grid-cols-2 gap-4">
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

                <div>
                  <label htmlFor="address.zipCode" className="block text-sm font-medium text-warmbrown-700 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    required
                    className="cultural-input w-full px-4 py-3"
                    placeholder="110051"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <Link
                  to="/profile"
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border-2 border-warmbrown-300 text-warmbrown-700 rounded-lg hover:bg-warmbrown-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 warm-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}