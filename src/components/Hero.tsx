import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import CustomOrderModal from './CustomOrderModal';

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-olive/10" />
        <img 
          src="https://picsum.photos/seed/bracelet-hero/1920/1080?blur=4" 
          alt="Artesanía de pulseras" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/40 backdrop-blur-xl p-12 md:p-20 rounded-[40px] border border-white/40 shadow-2xl"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block text-sm uppercase tracking-[0.2em] font-semibold text-olive/70 mb-6"
          >
            Hecho a mano con intención
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-serif text-6xl md:text-8xl font-light tracking-tight text-olive leading-tight mb-8"
          >
            Hilos que cuentan <br />
            <span className="italic font-medium text-gold">historias mágicas</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-xl mx-auto text-lg text-olive/80 mb-10 font-light leading-relaxed"
          >
            Descubre nuestra colección de pulseras artesanales diseñadas para conectar con tu esencia y elevar tu energía.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href="#coleccion" 
              className="px-10 py-5 bg-olive text-white rounded-full font-medium hover:bg-olive/90 transition-all flex items-center gap-2 group"
            >
              Ver Colección
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-5 bg-transparent border border-olive text-olive rounded-full font-medium hover:bg-olive/5 transition-all"
            >
              Pedido Personalizado
            </button>
          </motion.div>
        </motion.div>
      </div>

      <CustomOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Decorative elements */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -left-20 w-80 h-80 border border-gold/20 rounded-full pointer-events-none"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -right-20 w-96 h-96 border border-olive/10 rounded-full pointer-events-none"
      />
    </section>
  );
}
