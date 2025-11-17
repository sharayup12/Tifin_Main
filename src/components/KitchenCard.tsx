import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Star, Phone, Heart } from 'lucide-react'
import { Kitchen } from '../lib/supabase'
import { formatCurrency } from '../stores/orderStore'

interface KitchenCardProps {
  kitchen: Kitchen
  onFavorite?: (kitchenId: string) => void
  isFavorite?: boolean
}

const KitchenCard: React.FC<KitchenCardProps> = ({ kitchen, onFavorite, isFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavorite?.(kitchen.id)
  }

  const isOpenNow = () => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const [openHour, openMinute] = kitchen.opening_time.split(':').map(Number)
    const [closeHour, closeMinute] = kitchen.closing_time.split(':').map(Number)
    const openTime = openHour * 60 + openMinute
    const closeTime = closeHour * 60 + closeMinute
    
    return currentTime >= openTime && currentTime <= closeTime
  }

  return (
    <Link to={`/kitchen/${kitchen.id}`} className="block">
      <div className="kitchen-card group cursor-pointer">
        {/* Image Section */}
        <div className="relative overflow-hidden rounded-t-kitchen">
          <img
            src={kitchen.cover_image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
            alt={kitchen.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay with kitchen info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm font-medium mb-2 line-clamp-2">{kitchen.story}</p>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{kitchen.opening_time} - {kitchen.closing_time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{kitchen.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 z-10"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'text-red-500 fill-current' : 'text-warmbrown-400 hover:text-red-500'
              }`}
            />
          </button>

          {/* Open/Closed Status */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isOpenNow() 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {isOpenNow() ? 'Open' : 'Closed'}
            </span>
          </div>

          {/* Rating Badge */}
          {kitchen.rating > 0 && (
            <div className="absolute top-3 left-16">
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-warmbrown-700">{kitchen.rating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Kitchen Name and Owner */}
          <div className="mb-3">
            <h3 className="font-serif text-warmbrown-800 font-bold text-lg mb-1 group-hover:text-terracotta-600 transition-colors">
              {kitchen.name}
            </h3>
            <p className="text-sm text-warmbrown-600">
              By <span className="font-medium">{kitchen.owner_name}</span>
            </p>
          </div>

          {/* Cuisine Type */}
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 bg-saffron-100 text-saffron-800 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-saffron-500 rounded-full mr-2"></div>
              {kitchen.cuisine_type}
            </span>
          </div>

          {/* Description */}
          <p className="text-warmbrown-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {kitchen.description}
          </p>

          {/* Location */}
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-4 h-4 text-terracotta-500" />
            <span className="text-sm text-warmbrown-600 truncate">
              {kitchen.address.city}, {kitchen.address.state}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-terracotta-100">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-warmbrown-700">{kitchen.rating}</span>
              </div>
              {kitchen.review_count > 0 && (
                <span className="text-xs text-warmbrown-500">({kitchen.review_count})</span>
              )}
            </div>
            
            <div className="text-right">
              <p className="text-xs text-warmbrown-500 mb-1">Starting from</p>
              <p className="font-bold text-terracotta-600">{formatCurrency(80)}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default KitchenCard