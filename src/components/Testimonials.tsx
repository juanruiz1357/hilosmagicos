import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sofía Martínez",
    text: "Me encanta mi pulsera de amatista. Se nota que está hecha con mucho amor y la energía que transmite es increíble.",
    rating: 5,
    date: "Hace 2 semanas"
  },
  {
    name: "Mateo Rodríguez",
    text: "Pedí una personalizada para mi novia y quedó fascinada. El detalle del empaque también es mágico.",
    rating: 5,
    date: "Hace 1 mes"
  },
  {
    name: "Valentina López",
    text: "Las pulseras de los 7 nudos son mis favoritas. Son resistentes y el color rojo es vibrante. ¡Recomendadísimo!",
    rating: 4.9,
    date: "Hace 3 semanas"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl font-light text-olive mb-4"
          >
            Experiencias Mágicas
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-olive/60 max-w-2xl mx-auto"
          >
            Lo que dicen quienes ya llevan un pedacito de nuestra magia consigo.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-cream/50 p-10 rounded-[40px] border border-olive/5 relative group hover:bg-white hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute -top-6 left-10 w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Quote size={24} />
              </div>
              
              <div className="flex items-center gap-1 text-gold mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(testimonial.rating) ? "currentColor" : "none"} />
                ))}
                <span className="text-xs font-medium ml-2 text-olive/40">{testimonial.rating}</span>
              </div>
              
              <p className="text-lg text-olive/80 mb-8 font-light italic leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex justify-between items-center pt-6 border-t border-olive/10">
                <h4 className="font-serif text-xl font-medium text-olive">{testimonial.name}</h4>
                <span className="text-xs text-olive/40 uppercase tracking-widest">{testimonial.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
