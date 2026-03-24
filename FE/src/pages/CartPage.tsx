import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/home';
import { CartItemCard, CartSummary, mockCartItems, type CartItem } from '@/components/cart';

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);

  const handleQuantityChange = (id: number, quantity: number) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    // Navigate to checkout page (to be implemented)
    alert('Proceeding to checkout...');
  };

  const handleContinueShopping = () => {
    navigate('/store');
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalSavings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Fixed Backgrounds */}
      <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

      <Navbar />

      {/* Main Content */}
      <section className="relative py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/store"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                  Shopping{' '}
                  <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Cart
                  </span>
                </h1>
                <p className="text-slate-400">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>

              {totalSavings > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-sm text-green-400 font-medium">
                      Total Savings
                    </div>
                    <div className="text-xl font-bold text-green-400">
                      ${totalSavings.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Empty Cart State */}
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                  <ShoppingCart className="w-12 h-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
                <p className="text-slate-400 mb-6">
                  Looks like you haven't added any games yet. Start exploring our store!
                </p>
                <button
                  onClick={handleContinueShopping}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all font-medium shadow-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Browse Store</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div key={item.id} layout>
                        <CartItemCard
                          item={item}
                          onQuantityChange={handleQuantityChange}
                          onRemove={handleRemoveItem}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Continue Shopping Button - Mobile */}
                <button
                  onClick={handleContinueShopping}
                  className="lg:hidden w-full mt-6 py-3 px-6 rounded-xl border border-white/20 hover:bg-white/5 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </button>
              </div>

              {/* Order Summary - Sticky on Desktop */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24">
                  <CartSummary
                    subtotal={subtotal}
                    itemCount={itemCount}
                    onCheckout={handleCheckout}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recommended Products Section */}
          {cartItems.length > 0 && (
            <div className="mt-16">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">You might also like</h2>
                    <p className="text-slate-400">Based on items in your cart</p>
                  </div>
                  <Link
                    to="/store"
                    className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                  >
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-[3/4] rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                    >
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
