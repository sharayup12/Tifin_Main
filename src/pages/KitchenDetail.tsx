import React from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ArrowLeft, Star, Clock, Phone, MapPin, Heart, Calendar, Users, Mail } from 'lucide-react'
import { Kitchen, getKitchenById } from '../lib/supabase'
import { toast } from 'sonner'

export default function KitchenDetail() {
  const { id } = useParams<{ id: string }>()
  const [kitchen, setKitchen] = React.useState<Kitchen | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (id) {
      loadKitchen()
    }
  }, [id])

  const loadKitchen = async () => {
    try {
      const { data, error } = await getKitchenById(id!)
      if (error) throw error
      setKitchen(data)
    } catch (error) {
      console.error('Error loading kitchen:', error)
      toast.error('Could not load kitchen details.')
      // Set sample data for demo
      setKitchen({
        id: id || '1',
        user_id: '1',
        name: 'Maa ki Rasoi',
        owner_name: 'Sunita Sharma',
        story: 'I started cooking for my family 20 years ago, and now I want to share the same love and warmth with my neighborhood. Every dish is prepared with the same care I give my own children.',
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
        cover_image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        gallery_images: [
          'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1556909114-44a4d9dd7323?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-terracotta-200 border-t-terracotta-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-warmbrown-600">Loading kitchen details...</p>
        </div>
      </div>
    )
  }

  if (!kitchen) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="cultural-heading text-2xl mb-4">Kitchen not found</h1>
          <Link to="/discover" className="warm-button">
            Discover Kitchens
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={kitchen.cover_image}
          alt={kitchen.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <div className="absolute top-4 left-4">
          <Link
            to="/discover"
            className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-warmbrown-700 hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discover</span>
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Open
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {kitchen.opening_time} - {kitchen.closing_time}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2 font-serif">{kitchen.name}</h1>
          <p className="text-lg opacity-90">By {kitchen.owner_name}</p>
          
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold">{kitchen.rating}</span>
              <span className="opacity-75">({kitchen.review_count} reviews)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="bg-saffron-500 text-white px-2 py-1 rounded text-xs font-medium">
                {kitchen.cuisine_type}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Story Section */}
              <div className="kitchen-card p-6">
                <h2 className="cultural-subheading mb-4">Our Story</h2>
                <p className="cultural-body leading-relaxed mb-4">
                  {kitchen.story}
                </p>
                <p className="cultural-body leading-relaxed">
                  {kitchen.description}
                </p>
              </div>

              {/* Gallery */}
              {kitchen.gallery_images.length > 0 && (
                <div className="kitchen-card p-6">
                  <h2 className="cultural-subheading mb-4">Food Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {kitchen.gallery_images.map((image, index) => (
                      <div key={index} className="food-photo-frame overflow-hidden">
                        <img
                          src={image}
                          alt={`${kitchen.name} dish ${index + 1}`}
                          className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="kitchen-card p-6">
                <h2 className="cultural-subheading mb-4">What Our Customers Say</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-terracotta-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <span className="font-medium text-warmbrown-800">Anita Sharma</span>
                    </div>
                    <p className="text-warmbrown-600 text-sm">
                      "The food tastes exactly like my grandmother used to make. Sunita puts so much love into every dish!"
                    </p>
                  </div>
                  
                  <div className="p-4 bg-saffron-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>
                      <span className="font-medium text-warmbrown-800">Rajesh Kumar</span>
                    </div>
                    <p className="text-warmbrown-600 text-sm">
                      "Authentic flavors and generous portions. Highly recommend the Rajma Chawal!"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="kitchen-card p-6">
                <h3 className="cultural-subheading mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-terracotta-500" />
                    <span className="text-warmbrown-700">{kitchen.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-terracotta-500" />
                    <span className="text-warmbrown-700">{kitchen.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-terracotta-500" />
                    <span className="text-warmbrown-700">
                      {kitchen.address.street}, {kitchen.address.city}, {kitchen.address.state} - {kitchen.address.zipCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="kitchen-card p-6">
                <h3 className="cultural-subheading mb-4">Operating Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-warmbrown-600">Monday - Sunday</span>
                    <span className="font-medium text-warmbrown-800">
                      {kitchen.opening_time} - {kitchen.closing_time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="warm-button w-full">
                  View Menu & Order
                </button>
                <button className="flex items-center justify-center space-x-2 w-full px-4 py-3 border-2 border-terracotta-300 text-terracotta-700 rounded-lg hover:bg-terracotta-50 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>Add to Favorites</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}