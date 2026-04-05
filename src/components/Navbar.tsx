import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Instagram, Menu, X, User, LogOut, Shield, Plus, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAdmin, useCart } from '../App';
import LoginModal from './LoginModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAdmin, logout } = useAdmin();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
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
              <a href="#inicio" className="text-sm font-medium hover:text-gold transition-colors text-olive/80">Inicio</a>
              <a href="#coleccion" className="text-sm font-medium hover:text-gold transition-colors text-olive/80">Colección</a>
              <a href="#significado" className="text-sm font-medium hover:text-gold transition-colors text-olive/80">Significado</a>
              <a href="#tallas" className="text-sm font-medium hover:text-gold transition-colors text-olive/80">Tallas</a>
              <a href="#nosotros" className="text-sm font-medium hover:text-gold transition-colors text-olive/80">Nosotros</a>
            </div>

            <div className="flex items-center space-x-4">
              <a 
                href="https://www.instagram.com/hilosmagicos_rg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-olive/5 rounded-full transition-colors text-olive/60 hover:text-gold"
              >
                <Instagram size={20} />
              </a>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-olive/5 rounded-full transition-colors relative text-olive/60 hover:text-gold"
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

              {isAdmin ? (
                <div className="flex items-center gap-3">
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
                  <button 
                    onClick={logout}
                    className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                    title="Cerrar Sesión Admin"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-olive/40 hover:text-gold transition-all text-sm font-medium"
                >
                  <Lock size={16} />
                  <span className="hidden sm:inline">Admin</span>
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
                <a href="#inicio" className="block text-lg font-serif text-olive" onClick={() => setIsOpen(false)}>Inicio</a>
                <a href="#coleccion" className="block text-lg font-serif text-olive" onClick={() => setIsOpen(false)}>Colección</a>
                <a href="#significado" className="block text-lg font-serif text-olive" onClick={() => setIsOpen(false)}>Significado</a>
                <a href="#tallas" className="block text-lg font-serif text-olive" onClick={() => setIsOpen(false)}>Tallas</a>
                <a href="#nosotros" className="block text-lg font-serif text-olive" onClick={() => setIsOpen(false)}>Nosotros</a>
                {!isAdmin && (
                  <button 
                    onClick={() => { setIsLoginOpen(true); setIsOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold text-white rounded-2xl text-sm font-medium"
                  >
                    <Lock size={18} />
                    Acceso Admin
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
