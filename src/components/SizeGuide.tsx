import { motion } from 'motion/react';
import { Ruler, Info } from 'lucide-react';

export default function SizeGuide() {
  const sizes = [
    { label: "Pequeña (S)", range: "14 - 15 cm", description: "Ideal para muñecas delgadas." },
    { label: "Mediana (M)", range: "16 - 17 cm", description: "El tamaño más común para adultos." },
    { label: "Grande (L)", range: "18 - 19 cm", description: "Para muñecas más robustas." },
    { label: "Extra Grande (XL)", range: "20 - 21 cm", description: "Para un ajuste más holgado." },
  ];

  return (
    <section id="tallas" className="py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm uppercase tracking-[0.2em] font-semibold text-gold mb-4 block">Ajuste Perfecto</span>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-olive mb-8 leading-tight">
              Encuentra tu <span className="italic">talla ideal</span>
            </h2>
            <p className="text-lg text-olive/70 mb-12 leading-relaxed">
              Queremos que tu pulsera se sienta como una segunda piel. Sigue nuestra guía para elegir el tamaño que mejor se adapte a ti.
            </p>

            <div className="space-y-6">
              {sizes.map((size, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-olive/5"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
                    <Ruler size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-medium text-olive mb-1">{size.label}</h4>
                    <p className="text-sm text-olive/60">{size.range} — {size.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-olive/5">
              <div className="flex items-center gap-4 mb-8 text-gold">
                <Info size={32} />
                <h3 className="font-serif text-3xl font-light text-olive">¿Cómo medir?</h3>
              </div>
              <ol className="space-y-6 list-decimal list-inside text-olive/70 text-lg leading-relaxed">
                <li>Usa una cinta métrica flexible o un hilo.</li>
                <li>Rodea tu muñeca justo debajo del hueso.</li>
                <li>No aprietes demasiado, deja que la cinta deslice suavemente.</li>
                <li>Si usaste un hilo, mídelo con una regla plana.</li>
                <li>Añade 1 cm si prefieres un ajuste más suelto.</li>
              </ol>
              <div className="mt-12 p-6 bg-olive/5 rounded-2xl border border-olive/10">
                <p className="text-sm italic text-olive/60">
                  * Nuestras pulseras de hilo suelen ser ajustables, pero conocer tu medida nos ayuda a personalizar mejor el diseño.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
