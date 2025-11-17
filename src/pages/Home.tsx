import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import KitchenCard from '../components/KitchenCard'
import { getNearbyKitchens, Kitchen } from '../lib/supabase'
import { toast } from 'sonner'

export default function Home() {
  const navigate = useNavigate()
  const [kitchens, setKitchens] = useState<Kitchen[]>([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Load initial kitchens with default location (Delhi)
    loadKitchens(28.6139, 77.2090)
  }, [])

  const loadKitchens = async (lat: number, lng: number) => {
    setLoading(true)
    try {
      const { data, error } = await getNearbyKitchens(lat, lng, 10000) // 10km radius
      if (error) throw error
      
      setKitchens(data || [])
      toast.success('Found delicious kitchens near you! 🍽️')
    } catch (error) {
      console.error('Error loading kitchens:', error)
      toast.error('Could not load kitchens. Please try again.')
      // Set some sample data for demo
      setKitchens([
        {
          id: '1',
          user_id: '1',
          name: 'Maa ki Rasoi',
          owner_name: 'Sunita Sharma',
          story: 'I started cooking for my family 20 years ago, and now I want to share the same love and warmth with my neighborhood.',
          cuisine_type: 'North Indian',
          description: 'Authentic North Indian home cooking with love and traditional recipes passed down through generations.',
          phone: '+91 98765 43210',
          email: 'sunita@maakirasoi.com',
          address: {
            street: '123 Gali No. 5, Krishna Nagar',
            city: 'Delhi',
            state: 'Delhi',
            zipCode: '110051',
            coordinates: { lat: 28.6139, lng: 77.2090 }
          },
          is_active: true,
          status: 'approved',
          opening_time: '08:00:00',
          closing_time: '20:00:00',
          rating: 4.8,
          review_count: 24,
          cover_image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          gallery_images: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: '2',
          name: 'Dadi ki Rasoi',
          owner_name: 'Kamla Devi',
          story: 'My grandmother taught me the secrets of traditional cooking. Every dish carries her blessings and wisdom.',
          cuisine_type: 'Punjabi',
          description: 'Traditional Punjabi cuisine with authentic flavors and homestyle preparation.',
          phone: '+91 98765 43211',
          email: 'kamla@dadikirasoi.com',
          address: {
            street: '456 Chandni Chowk',
            city: 'Delhi',
            state: 'Delhi',
            zipCode: '110006',
            coordinates: { lat: 28.6562, lng: 77.2310 }
          },
          is_active: true,
          status: 'approved',
          opening_time: '07:00:00',
          closing_time: '21:00:00',
          rating: 4.6,
          review_count: 18,
          cover_image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          gallery_images: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleLocationDetected = (lat: number, lng: number) => {
    setLocation({ lat, lng })
    loadKitchens(lat, lng)
    navigate('/discover')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero onLocationDetected={handleLocationDetected} />

      {/* Featured Kitchens Section */}
      <section className="py-16 bg-gradient-to-b from-cream-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="cultural-heading mb-4">
              Featured <span className="text-terracotta-600">Kitchens</span>
            </h2>
            <p className="cultural-subheading text-warmbrown-600 max-w-2xl mx-auto">
              Discover the most loved home kitchens in your neighborhood, each with their own unique story and flavors
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="kitchen-card animate-pulse">
                  <div className="h-48 bg-terracotta-100 rounded-t-kitchen"></div>
                  <div className="p-5">
                    <div className="h-6 bg-terracotta-100 rounded mb-3"></div>
                    <div className="h-4 bg-terracotta-100 rounded mb-2"></div>
                    <div className="h-4 bg-terracotta-100 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-terracotta-100 rounded w-16"></div>
                      <div className="h-4 bg-terracotta-100 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kitchens.map((kitchen) => (
                <KitchenCard key={kitchen.id} kitchen={kitchen} />
              ))}
            </div>
          )}

          {!loading && kitchens.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="cultural-subheading mb-2">No kitchens found nearby</h3>
              <p className="cultural-body mb-6">
                We're expanding to more neighborhoods. Check back soon or browse all available kitchens.
              </p>
              <button 
                onClick={() => navigate('/discover')}
                className="warm-button"
              >
                Browse All Kitchens
              </button>
            </div>
          )}

          {kitchens.length > 0 && (
            <div className="text-center mt-12">
              <button 
                onClick={() => navigate('/discover')}
                className="warm-button px-8 py-4"
              >
                View All Kitchens
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="cultural-heading mb-4">
              How It <span className="text-terracotta-600">Works</span>
            </h2>
            <p className="cultural-subheading text-warmbrown-600 max-w-2xl mx-auto">
              From discovering kitchens to enjoying home-cooked meals, it's simple and heartwarming
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-terracotta-400 to-saffron-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-food-card">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="cultural-subheading mb-3">Discover Kitchens</h3>
              <p className="cultural-body">
                Explore home kitchens in your neighborhood, read their stories, and find the perfect match for your taste.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-saffron-400 to-deepgreen-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-food-card">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="cultural-subheading mb-3">Place Your Order</h3>
              <p className="cultural-body">
                Choose from daily menus, add special instructions, and schedule delivery time that works for you.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-deepgreen-400 to-terracotta-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-food-card">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="cultural-subheading mb-3">Enjoy & Share</h3>
              <p className="cultural-body">
                Receive your home-cooked meal with love, enjoy every bite, and share your experience with the community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}