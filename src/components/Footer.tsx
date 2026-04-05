import { motion } from 'motion/react';
import { Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-olive text-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <h2 className="font-serif text-3xl font-bold tracking-tight mb-6">Hilos Mágicos</h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              Tejiendo sueños y conectando almas a través de la artesanía. Cada nudo es una intención, cada pulsera es una historia.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://www.instagram.com/hilosmagicos_rg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="mailto:hola@hilosmagicos.com" 
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl font-medium mb-6">Explora</h4>
            <ul className="space-y-4 text-white/70">
              <li><a href="#inicio" className="hover:text-gold transition-colors">Inicio</a></li>
              <li><a href="#coleccion" className="hover:text-gold transition-colors">Colección</a></li>
              <li><a href="#nosotros" className="hover:text-gold transition-colors">Nosotros</a></li>
              <li><a href="#contacto" className="hover:text-gold transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-medium mb-6">Contacto</h4>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold" />
                <span>+54 9 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold" />
                <span>hola@hilosmagicos.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-gold" />
                <span>Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-medium mb-6">Newsletter</h4>
            <p className="text-white/70 mb-6 text-sm">Suscríbete para recibir noticias sobre nuevas colecciones y promos mágicas.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="px-4 py-3 bg-white/10 rounded-xl border border-white/10 focus:outline-none focus:border-gold transition-colors placeholder:text-white/30"
              />
              <button className="px-4 py-3 bg-gold text-white rounded-xl font-medium hover:bg-gold/90 transition-colors">
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/50 text-sm">
          <p>© 2026 Hilos Mágicos. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            Hecho con <Heart size={14} className="text-gold fill-gold" /> por Hilos Mágicos
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
