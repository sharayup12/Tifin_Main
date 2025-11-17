import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, MapPin, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface HeroProps {
  onLocationDetected?: (lat: number, lng: number) => void
}

const Hero: React.FC<HeroProps> = ({ onLocationDetected }) => {
  const handleGetStarted = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          onLocationDetected?.(latitude, longitude)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to manual location selection
        }
      )
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream-50 via-terracotta-50 to-saffron-50 min-h-screen flex items-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-saffron-200 to-terracotta-200 rounded-full opacity-20 animate-gentle-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-terracotta-200 to-deepgreen-200 rounded-full opacity-15 animate-gentle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-deepgreen-200 to-saffron-200 rounded-full opacity-25 animate-gentle-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-saffron-100 text-saffron-800 rounded-full text-sm font-medium mb-4">
                <Heart className="w-4 h-4 mr-2 animate-heart-beat" />
                Made with Love, Just Like Home
              </span>
            </div>

            <h1 className="cultural-heading mb-6 !text-4xl lg:!text-6xl leading-tight">
              Discover <span className="text-terracotta-600">Kitchens</span> of Your Neighborhood
            </h1>

            <p className="cultural-body text-lg mb-8 max-w-2xl">
              Every meal tells a story. Connect with passionate home cooks who pour their heart into every dish. 
              From grandma's secret recipes to modern fusion creations, find the perfect meal that feels like home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button
                onClick={handleGetStarted}
                className="warm-button text-lg px-8 py-4 flex items-center justify-center space-x-2"
              >
                <span>Find My Kitchen</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <Link
                to="/discover"
                className="px-8 py-4 border-2 border-terracotta-300 text-terracotta-700 rounded-lg font-medium hover:bg-terracotta-50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <MapPin className="w-5 h-5" />
                <span>Browse All Kitchens</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-food-card">
                <div className="text-2xl font-bold text-terracotta-600">500+</div>
                <div className="text-sm text-warmbrown-600">Home Kitchens</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-food-card">
                <div className="text-2xl font-bold text-saffron-600">1000+</div>
                <div className="text-sm text-warmbrown-600">Happy Customers</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-food-card">
                <div className="flex items-center justify-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <div className="text-2xl font-bold text-deepgreen-600">4.8</div>
                </div>
                <div className="text-sm text-warmbrown-600">Average Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Main food image */}
              <div className="food-photo-frame overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Delicious home-cooked meal"
                  className="w-full h-80 object-cover"
                />
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-kitchen p-4 shadow-food-card animate-gentle-float">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-terracotta-500 rounded-full animate-steam-rise"></div>
                  <span className="text-sm font-medium text-warmbrown-700">Fresh & Hot</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-kitchen p-4 shadow-food-card animate-gentle-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500 fill-current animate-heart-beat" />
                  <span className="text-sm font-medium text-warmbrown-700">Made with Love</span>
                </div>
              </div>

              {/* Decorative spices */}
              <div className="absolute top-1/2 -right-8 flex flex-col space-y-2">
                <div className="w-4 h-4 bg-saffron-500 rounded-full spice-icon animate-spice-sprinkle"></div>
                <div className="w-3 h-3 bg-terracotta-500 rounded-full spice-icon animate-spice-sprinkle" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-deepgreen-500 rounded-full spice-icon animate-spice-sprinkle" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-8 text-center">
              <p className="cultural-quote text-center">
                From our kitchen to your heart
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero