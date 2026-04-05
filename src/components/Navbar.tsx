import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Instagram, Menu, X, User, LogOut, Shield, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signInWithGoogle, logout } from '../firebase';
import { useAuth, useCart } from '../App';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, isAdmin } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-4' : 'bg-cream/80 backdrop-blur-md py-6 border-b border-olive/10'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-2xl font-bold tracking-tight text-olive"
            >
              Hilos Mágicos
            </motion.h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-sm font-medium hover:text-gold transition-colors">Inicio</a>
            <a href="#coleccion" className="text-sm font-medium hover:text-gold transition-colors">Colección</a>
            <a href="#significado" className="text-sm font-medium hover:text-gold transition-colors">Significado</a>
            <a href="#tallas" className="text-sm font-medium hover:text-gold transition-colors">Tallas</a>
            <a href="#nosotros" className="text-sm font-medium hover:text-gold transition-colors">Nosotros</a>
          </div>

          <div className="flex items-center space-x-4">
            <a 
              href="https://www.instagram.com/hilosmagicos_rg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-olive/5 rounded-full transition-colors"
            >
              <Instagram size={20} />
            </a>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-olive/5 rounded-full transition-colors relative"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 h-4 w-4 bg-gold text-white text-[10px] flex items-center justify-center rounded-full"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <>
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('open-product-modal'))}
                      className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-white bg-gold px-3 py-1.5 rounded-full shadow-lg hover:scale-105 transition-transform"
                    >
                      <Plus size={14} />
                      <span className="hidden xs:inline">Nuevo</span>
                    </button>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gold bg-gold/10 px-2 py-1 rounded-full border border-gold/20">
                      <Shield size={12} />
                      Admin
                    </div>
                  </>
                )}
                <div className="relative group">
                  <button className="w-8 h-8 rounded-full overflow-hidden border border-olive/10">
                    <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-full h-full object-cover" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-olive/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2">
                    <div className="px-4 py-2 border-b border-olive/5 mb-2">
                      <p className="text-xs font-semibold text-olive truncate">{user.displayName}</p>
                      <p className="text-[10px] text-olive/50 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-4 py-2 bg-olive text-white rounded-full text-sm font-medium hover:bg-olive/90 transition-all"
              >
                <User size={16} />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}

            <button 
              className="md:hidden p-2 hover:bg-olive/5 rounded-full transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream border-b border-olive/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <a href="#inicio" className="block text-lg font-serif" onClick={() => setIsOpen(false)}>Inicio</a>
              <a href="#coleccion" className="block text-lg font-serif" onClick={() => setIsOpen(false)}>Colección</a>
              <a href="#significado" className="block text-lg font-serif" onClick={() => setIsOpen(false)}>Significado</a>
              <a href="#tallas" className="block text-lg font-serif" onClick={() => setIsOpen(false)}>Tallas</a>
              <a href="#nosotros" className="block text-lg font-serif" onClick={() => setIsOpen(false)}>Nosotros</a>
              {!user && (
                <button 
                  onClick={() => { signInWithGoogle(); setIsOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold text-white rounded-2xl text-sm font-medium"
                >
                  <User size={18} />
                  Iniciar Sesión con Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
