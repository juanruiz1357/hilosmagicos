import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, Star, Edit3, Plus, ShieldAlert } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, Product, handleFirestoreError, OperationType } from '../firebase';
import { useAuth, useCart } from '../App';
import ProductModal from './ProductModal';

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
      setError(null);
    }, (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, 'products');
      } catch (e: any) {
        console.error("Firestore error:", e);
        setError("No tienes permisos para ver los productos o hubo un error de conexión.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleOpenModal = () => handleAdd();
    window.addEventListener('open-product-modal', handleOpenModal);
    return () => window.removeEventListener('open-product-modal', handleOpenModal);
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <section id="coleccion" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-5xl font-light text-olive mb-4"
            >
              Nuestra Colección
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-olive/60 max-w-2xl"
            >
              Cada pieza es única, tejida a mano con materiales de alta calidad y cargada de buenas vibras.
            </motion.p>
          </div>
          
          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleAdd}
              className="flex items-center gap-2 px-8 py-4 bg-gold text-white rounded-2xl font-medium shadow-xl hover:bg-gold/90 transition-all"
            >
              <Plus size={20} />
              Añadir Producto
            </motion.button>
          )}
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-center gap-4 text-red-600"
          >
            <ShieldAlert size={24} className="shrink-0" />
            <div>
              <p className="font-medium">Error de Acceso</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center bg-cream rounded-[40px] border-2 border-dashed border-olive/10">
              <p className="text-olive/60 mb-6">Aún no hay productos en la colección.</p>
              {isAdmin && (
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-white rounded-2xl font-medium shadow-xl hover:bg-gold/90 transition-all"
                >
                  <Plus size={20} />
                  Crear Primer Producto
                </button>
              )}
            </div>
          )}
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] bg-cream mb-6">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-olive/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {isAdmin && (
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-3 bg-gold text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <Edit3 size={18} />
                    </button>
                  )}
                  <button className="p-3 bg-white/80 backdrop-blur-md rounded-full text-olive hover:bg-white transition-colors shadow-lg">
                    <Heart size={18} />
                  </button>
                  <button 
                    onClick={() => addToCart(product)}
                    className="p-3 bg-white/80 backdrop-blur-md rounded-full text-olive hover:bg-white transition-colors shadow-lg"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className="w-full py-4 bg-olive text-white rounded-2xl font-medium shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-widest text-gold font-semibold block">
                      {product.category}
                    </span>
                    {product.stock <= 0 && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">
                        Agotado
                      </span>
                    )}
                    {product.stock > 0 && product.stock <= 3 && (
                      <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase">
                        ¡Últimas {product.stock}!
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-medium text-olive">{product.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-olive">${product.price.toFixed(2)}</span>
                  <div className="flex items-center gap-1 text-gold mt-1">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-medium">{product.rating || 5.0}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </section>
  );
}
