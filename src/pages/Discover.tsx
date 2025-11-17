import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Search, Filter, Clock, Star } from 'lucide-react'
import KitchenCard from '../components/KitchenCard'
import { Kitchen, getNearbyKitchens } from '../lib/supabase'
import { toast } from 'sonner'

export default function Discover() {
  const [kitchens, setKitchens] = React.useState<Kitchen[]>([])
  const [loading, setLoading] = React.useState(true)
  const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCuisine, setSelectedCuisine] = React.useState('')
  const [selectedMealType, setSelectedMealType] = React.useState('')

  const cuisines = ['North Indian', 'South Indian', 'Punjabi', 'Gujarati', 'Bengali', 'Maharashtrian', 'Rajasthani']
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'All Day']

  React.useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude })
          loadKitchens(latitude, longitude)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to Delhi
          setLocation({ lat: 28.6139, lng: 77.2090 })
          loadKitchens(28.6139, 77.2090)
        }
      )
    } else {
      // Fallback to Delhi
      setLocation({ lat: 28.6139, lng: 77.2090 })
      loadKitchens(28.6139, 77.2090)
    }
  }, [])

  const loadKitchens = async (lat: number, lng: number) => {
    setLoading(true)
    try {
      const { data, error } = await getNearbyKitchens(lat, lng, 15000) // 15km radius
      if (error) throw error
      
      setKitchens(data || [])
      toast.success(`Found ${data?.length || 0} delicious kitchens near you! 🍽️`)
    } catch (error) {
      console.error('Error loading kitchens:', error)
      toast.error('Could not load kitchens. Please try again.')
      // Set sample data for demo
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
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredKitchens = kitchens.filter(kitchen => {
    const matchesSearch = kitchen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         kitchen.cuisine_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         kitchen.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCuisine = !selectedCuisine || kitchen.cuisine_type === selectedCuisine
    
    return matchesSearch && matchesCuisine
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-food-card border-b border-terracotta-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="cultural-heading mb-4">
              Discover <span className="text-terracotta-600">Kitchens</span>
            </h1>
            <p className="cultural-subheading text-warmbrown-600 max-w-2xl mx-auto">
              Find the perfect home kitchen that speaks to your heart and satisfies your cravings
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terracotta-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search kitchens, cuisines, or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="cultural-input w-full pl-10 pr-4 py-3"
                />
              </div>
              
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="cultural-input px-4 py-3"
              >
                <option value="">All Cuisines</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
              
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="cultural-input px-4 py-3"
              >
                <option value="">All Meals</option>
                {mealTypes.map(meal => (
                  <option key={meal} value={meal}>{meal}</option>
                ))}
              </select>
            </div>

            {/* Location Info */}
            {location && (
              <div className="flex items-center justify-center space-x-2 text-warmbrown-600">
                <MapPin className="w-4 h-4 text-terracotta-500" />
                <span className="text-sm">
                  Showing kitchens near your location ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kitchens Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
          <>
            {filteredKitchens.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="cultural-subheading mb-2">No kitchens found</h3>
                <p className="cultural-body mb-6">
                  Try adjusting your search criteria or explore all available kitchens.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCuisine('')
                    setSelectedMealType('')
                  }}
                  className="warm-button"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKitchens.map((kitchen) => (
                  <KitchenCard key={kitchen.id} kitchen={kitchen} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}