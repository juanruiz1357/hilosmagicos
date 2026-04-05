import { motion } from 'motion/react';

const colors = [
  { color: "Rojo", meaning: "Protección contra envidias y malas energías. Fuerza y pasión.", hex: "#DC2626" },
  { color: "Azul", meaning: "Paz, tranquilidad y comunicación fluida. Sabiduría.", hex: "#2563EB" },
  { color: "Verde", meaning: "Salud, esperanza y equilibrio con la naturaleza.", hex: "#16A34A" },
  { color: "Amarillo", meaning: "Abundancia, alegría y éxito en nuevos proyectos.", hex: "#EAB308" },
  { color: "Violeta", meaning: "Transmutación, espiritualidad y cambio positivo.", hex: "#9333EA" },
  { color: "Rosa", meaning: "Amor propio, ternura y armonía en las relaciones.", hex: "#DB2777" },
];

export default function MeaningSection() {
  return (
    <section id="significado" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl font-light text-olive mb-4"
          >
            El Significado de los Colores
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-olive/60 max-w-2xl mx-auto"
          >
            Cada hilo que elegimos tiene un propósito. Descubre qué energía quieres llevar contigo hoy.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {colors.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group text-center"
            >
              <div 
                className="w-20 h-20 mx-auto rounded-full mb-4 shadow-inner border-4 border-white transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: item.hex }}
              />
              <h4 className="font-serif text-lg font-medium text-olive mb-2">{item.color}</h4>
              <p className="text-xs text-olive/60 leading-tight">{item.meaning}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
