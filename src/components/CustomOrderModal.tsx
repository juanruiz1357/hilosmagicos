import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles } from 'lucide-react';

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomOrderModal({ isOpen, onClose }: CustomOrderModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    braceletType: 'hilo',
    colors: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Success step
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-olive/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-cream rounded-[40px] shadow-2xl overflow-hidden border border-white/20"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-olive/5 rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="p-8 md:p-12">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="w-16 h-16 bg-gold/10 rounded-3xl flex items-center justify-center mb-6">
                    <Sparkles className="text-gold" size={32} />
                  </div>
                  <h2 className="font-serif text-3xl font-light text-olive mb-4">Tu Pulsera Mágica</h2>
                  <p className="text-olive/60 mb-8">Cuéntanos qué tienes en mente y nosotros lo tejeremos para ti.</p>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => setStep(2)}
                      className="w-full py-5 bg-olive text-white rounded-2xl font-medium hover:bg-olive/90 transition-all flex items-center justify-center gap-2"
                    >
                      Empezar Pedido
                    </button>
                    <button 
                      onClick={onClose}
                      className="w-full py-5 bg-transparent border border-olive/20 text-olive rounded-2xl font-medium hover:bg-olive/5 transition-all"
                    >
                      Quizás luego
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <h2 className="font-serif text-2xl font-light text-olive mb-6">Detalles del Pedido</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-olive/50 font-semibold mb-2">Nombre</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-4 bg-white rounded-xl border border-olive/10 focus:outline-none focus:border-gold transition-colors"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-olive/50 font-semibold mb-2">Email</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-4 bg-white rounded-xl border border-olive/10 focus:outline-none focus:border-gold transition-colors"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-olive/50 font-semibold mb-2">Colores e Ideas</label>
                      <textarea 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-4 bg-white rounded-xl border border-olive/10 focus:outline-none focus:border-gold transition-colors min-h-[120px]"
                        placeholder="Describe los colores, piedras o el significado que buscas..."
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-gold text-white rounded-2xl font-medium hover:bg-gold/90 transition-all flex items-center justify-center gap-2"
                  >
                    Enviar Pedido <Send size={18} />
                  </button>
                </motion.form>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={40} />
                  </div>
                  <h2 className="font-serif text-3xl font-light text-olive mb-4">¡Pedido Enviado!</h2>
                  <p className="text-olive/60 mb-8">Hemos recibido tu solicitud mágica. Nos pondremos en contacto contigo muy pronto para concretar los detalles.</p>
                  <button 
                    onClick={onClose}
                    className="w-full py-5 bg-olive text-white rounded-2xl font-medium hover:bg-olive/90 transition-all"
                  >
                    Cerrar
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
