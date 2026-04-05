import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Loader2, Phone, MapPin, User } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment } from 'firebase/firestore';
import { useCart, CartItem } from '../App';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
}

export default function CheckoutModal({ isOpen, onClose, items, total }: CheckoutModalProps) {
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const batch = writeBatch(db);
      const ordersRef = collection(db, 'orders');
      const newOrderRef = doc(ordersRef);

      const orderData = {
        id: newOrderRef.id,
        userId: auth.currentUser?.uid || 'guest',
        userEmail: auth.currentUser?.email || 'guest@hilosmagicos.com',
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        notes: formData.notes,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: total,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      // Add order to batch
      batch.set(newOrderRef, orderData);

      // Update stock for each item in batch
      items.forEach(item => {
        const productRef = doc(db, 'products', item.id);
        batch.update(productRef, {
          stock: increment(-item.quantity)
        });
      });

      // Commit the batch
      await batch.commit();
      
      setSuccess(true);
      clearCart();
      
      // Optional: Redirect to WhatsApp with order summary
      const message = `¡Hola Hilos Mágicos! He realizado un pedido:\n\n` +
        `Cliente: ${formData.name}\n` +
        `Total: $${total.toFixed(2)}\n` +
        `Productos: ${items.map(i => `${i.name} (x${i.quantity})`).join(', ')}`;
      
      setTimeout(() => {
        const encodedMessage = encodeURIComponent(message);
        // Updated WhatsApp number: +54 9 2966 65-3044
        window.open(`https://wa.me/5492966653044?text=${encodedMessage}`, '_blank');
      }, 2000);

    } catch (error) {
      console.error("Error creating order:", error);
      try {
        handleFirestoreError(error, OperationType.CREATE, 'orders');
      } catch (e) {
        alert("Hubo un error al procesar tu pedido. Por favor intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-olive/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-[40px] p-12 text-center max-w-md w-full shadow-2xl"
            >
              <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="font-serif text-3xl text-olive mb-4">¡Pedido Recibido!</h2>
              <p className="text-olive/60 mb-8 leading-relaxed">
                Gracias por confiar en Hilos Mágicos. Hemos recibido tu pedido y te contactaremos pronto para coordinar el envío.
              </p>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-olive text-white rounded-2xl font-medium hover:bg-olive/90 transition-all"
              >
                Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-olive/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="relative bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden my-8"
          >
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="font-serif text-3xl text-olive">Finalizar Compra</h2>
                  <p className="text-sm text-olive/40 mt-1">Completa tus datos para el envío</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-olive/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-olive/50 uppercase tracking-widest mb-2">Nombre Completo</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-12 py-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-gold transition-all"
                        placeholder="Tu nombre..."
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-olive/30" size={20} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-olive/50 uppercase tracking-widest mb-2">Teléfono / WhatsApp</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-12 py-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-gold transition-all"
                        placeholder="+54 9..."
                      />
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-olive/30" size={20} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-olive/50 uppercase tracking-widest mb-2">Dirección de Envío</label>
                    <div className="relative">
                      <textarea
                        required
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-12 py-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-gold transition-all resize-none"
                        placeholder="Calle, número, ciudad..."
                      />
                      <MapPin className="absolute left-4 top-6 text-olive/30" size={20} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-olive/50 uppercase tracking-widest mb-2">Notas adicionales (Opcional)</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-6 py-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-gold transition-all resize-none"
                      placeholder="Color preferido, horario de entrega..."
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-center mb-6 px-2">
                    <span className="text-olive/60">Total a pagar</span>
                    <span className="text-2xl font-serif font-bold text-olive">${total.toFixed(2)}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-gold text-white rounded-2xl font-medium shadow-xl shadow-gold/20 flex items-center justify-center gap-3 hover:bg-gold/90 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                    {loading ? 'Procesando...' : 'Confirmar Pedido'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
