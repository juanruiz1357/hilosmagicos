import { motion } from 'motion/react';
import { Sparkles, Heart, ShieldCheck, Zap } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="text-gold" />,
    title: "Diseño Único",
    description: "Cada pulsera es una pieza irrepetible, diseñada con amor y atención al detalle."
  },
  {
    icon: <Heart className="text-gold" />,
    title: "Hecho a Mano",
    description: "Tejemos cada hilo con intención, creando conexiones reales en cada nudo."
  },
  {
    icon: <ShieldCheck className="text-gold" />,
    title: "Calidad Premium",
    description: "Utilizamos hilos de alta resistencia y piedras naturales seleccionadas."
  },
  {
    icon: <Zap className="text-gold" />,
    title: "Energía Positiva",
    description: "Nuestras piezas están cargadas de buenas vibras para acompañarte siempre."
  }
];

export default function About() {
  return (
    <section id="nosotros" className="py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 aspect-square rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/about-us/800/800" 
                alt="Nuestra historia" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-olive/10 rounded-full blur-3xl" />
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 p-8 bg-white rounded-3xl shadow-xl z-20 border border-olive/5"
            >
              <p className="font-serif text-3xl font-light text-olive italic">"Hilos que unen almas"</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm uppercase tracking-[0.2em] font-semibold text-gold mb-4 block">Nuestra Esencia</span>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-olive mb-8 leading-tight">
              Creando magia en cada <span className="italic">nudo</span>
            </h2>
            <p className="text-lg text-olive/70 mb-12 leading-relaxed">
              En Hilos Mágicos, creemos que una pulsera es más que un accesorio. Es un recordatorio de tus intenciones, un amuleto de protección y un símbolo de las conexiones que valoras.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col gap-4"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-olive/5">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-medium text-olive mb-2">{feature.title}</h4>
                    <p className="text-sm text-olive/60 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
