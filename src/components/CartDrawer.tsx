import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../App';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    totalPrice, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-olive/40 backdrop-blur-sm z-[60]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-olive/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold/10 rounded-xl text-gold">
                    <ShoppingBag size={20} />
                  </div>
                  <h2 className="font-serif text-2xl text-olive">Tu Carrito</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-olive/5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-6 bg-cream rounded-full text-olive/20">
                      <ShoppingBag size={64} />
                    </div>
                    <div>
                      <p className="text-xl font-serif text-olive">Tu carrito está vacío</p>
                      <p className="text-olive/60">¡Explora nuestra colección y encuentra algo especial!</p>
                    </div>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="px-8 py-3 bg-gold text-white rounded-xl font-medium"
                    >
                      Ver Colección
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 group"
                    >
                      <div className="w-24 h-32 bg-cream rounded-2xl overflow-hidden shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-olive line-clamp-1">{item.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-olive/20 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-sm text-olive/60">{item.category}</p>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 bg-cream rounded-lg p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-white rounded-md transition-colors text-olive"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={item.quantity >= item.stock}
                              className="p-1 hover:bg-white rounded-md transition-colors text-olive disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-semibold text-olive">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 bg-cream/50 border-t border-olive/5 space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-olive/60">Total</span>
                    <span className="font-serif text-2xl text-olive font-semibold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-4 bg-gold text-white rounded-2xl font-medium shadow-xl shadow-gold/20 flex items-center justify-center gap-2 group hover:bg-gold/90 transition-all"
                  >
                    Finalizar Compra
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-center text-xs text-olive/40">
                    Envío gratuito en pedidos superiores a $50
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={items}
        total={totalPrice}
      />
    </>
  );
}
