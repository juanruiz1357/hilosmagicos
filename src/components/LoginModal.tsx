import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, User, Loader2 } from 'lucide-react';
import { useAdmin } from '../App';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Artificial delay for feel
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        onClose();
      } else {
        setError('Usuario o contraseña incorrectos');
      }
      setLoading(false);
    }, 800);
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
            className="absolute inset-0 bg-olive/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[40px] w-full max-w-sm shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="font-serif text-3xl text-olive">Admin</h2>
                  <p className="text-sm text-olive/40 mt-1">Acceso restringido</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-olive/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-olive/50 uppercase tracking-widest mb-2">Usuario</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-12 py-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-gold transition-all"
                        placeholder="rocio"
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-olive/30" size={18} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-olive/50 uppercase tracking-widest mb-2">Contraseña</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-12 py-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-gold transition-all"
                        placeholder="••••••••"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-olive/30" size={18} />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 font-medium text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-olive text-white rounded-2xl font-medium shadow-xl hover:bg-olive/90 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Entrar'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
