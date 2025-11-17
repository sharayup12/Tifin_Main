import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Clock } from 'lucide-react'
import { useOrderStore } from '../stores/orderStore'
import { formatCurrency } from '../stores/orderStore'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useOrderStore()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-terracotta-200 to-saffron-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-terracotta-600" />
          </div>
          <h1 className="cultural-heading text-2xl mb-4">Your Cart is Empty</h1>
          <p className="cultural-body text-warmbrown-600 mb-8 max-w-md">
            Your cart is waiting to be filled with delicious home-cooked meals. Explore our kitchens and add some love to your cart!
          </p>
          <Link to="/discover" className="warm-button">
            Discover Kitchens
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="cultural-heading text-3xl mb-8 text-center">
            Your <span className="text-terracotta-600">Cart</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.menuItem.id} className="kitchen-card p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.menuItem.image_url || 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}
                      alt={item.menuItem.name}
                      className="w-20 h-20 rounded-kitchen object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-serif text-warmbrown-800 font-semibold text-lg">
                        {item.menuItem.name}
                      </h3>
                      <p className="text-warmbrown-600 text-sm mb-2">
                        {item.menuItem.description}
                      </p>
                      <p className="text-terracotta-600 font-bold">
                        {formatCurrency(item.menuItem.price)}
                      </p>
                      {item.specialInstructions && (
                        <p className="text-xs text-warmbrown-500 mt-2">
                          <span className="font-medium">Special instructions:</span> {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-600 hover:bg-terracotta-200 transition-colors flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-600 hover:bg-terracotta-200 transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.menuItem.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="kitchen-card p-6 sticky top-4">
                <h2 className="cultural-subheading mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-warmbrown-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-warmbrown-600">
                    <span>Delivery Fee</span>
                    <span>{formatCurrency(30)}</span>
                  </div>
                  <div className="flex justify-between text-warmbrown-600">
                    <span>Tax</span>
                    <span>{formatCurrency(getCartTotal() * 0.05)}</span>
                  </div>
                  <hr className="border-terracotta-200" />
                  <div className="flex justify-between font-bold text-warmbrown-800 text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(getCartTotal() + 30 + (getCartTotal() * 0.05))}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-warmbrown-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Preferred Delivery Time
                  </label>
                  <select className="cultural-input w-full px-4 py-2">
                    <option>ASAP (30-45 min)</option>
                    <option>Lunch (12:00-13:00)</option>
                    <option>Dinner (19:00-20:00)</option>
                    <option>Custom time</option>
                  </select>
                </div>

                <Link to="/checkout" className="warm-button w-full mb-4">
                  Proceed to Checkout
                </Link>

                <Link to="/discover" className="block text-center text-terracotta-600 hover:text-terracotta-800 text-sm">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}