import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Package, Star, Heart } from 'lucide-react'

export default function Orders() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="cultural-heading text-3xl mb-8 text-center">
            Your <span className="text-terracotta-600">Orders</span>
          </h1>

          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-terracotta-200 to-saffron-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-terracotta-600" />
            </div>
            <h2 className="cultural-subheading text-xl mb-4">No Orders Yet</h2>
            <p className="cultural-body text-warmbrown-600 mb-8 max-w-md mx-auto">
              Your order history is waiting to be filled with delicious home-cooked meals. Start exploring our kitchens and place your first order!
            </p>
            <Link to="/discover" className="warm-button">
              Discover Kitchens
            </Link>
          </div>

          {/* Sample Order History (for demo) */}
          <div className="mt-12">
            <h2 className="cultural-subheading text-xl mb-6">Sample Order History</h2>
            <div className="space-y-4">
              <div className="kitchen-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-warmbrown-800 font-semibold">Maa ki Rasoi</h3>
                    <p className="text-sm text-warmbrown-600">Order #TF001 • 2 items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-terracotta-600">₹250</p>
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      <Clock className="w-3 h-3 mr-1" />
                      Delivered
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">5.0</span>
                  </div>
                  <button className="text-terracotta-600 hover:text-terracotta-800 text-sm font-medium">
                    Reorder
                  </button>
                  <button className="text-warmbrown-600 hover:text-warmbrown-800 text-sm font-medium">
                    Leave Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}