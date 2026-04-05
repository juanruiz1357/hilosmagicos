/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, collection, query, getDocs, setDoc } from 'firebase/firestore';
import { auth, db, UserProfile, handleFirestoreError, OperationType, Product } from './firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import MeaningSection from './components/MeaningSection';
import SizeGuide from './components/SizeGuide';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { motion, AnimatePresence } from 'motion/react';

// Auth Context
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

// Cart Context
export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
});

export const useCart = () => useContext(CartContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user profile from Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setProfile(userSnap.data() as UserProfile);
          }
        } catch (error) {
          try {
            handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
          } catch (e) {
            console.error("Auth profile fetch error:", e);
          }
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = profile?.role === 'admin' || user?.email?.toLowerCase() === 'juanruiz.jr181005@gmail.com';

  // Cart Actions
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("Lo sentimos, este producto está agotado.");
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Solo hay ${product.stock} unidades disponibles de este producto.`);
          return prev;
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty > item.stock) {
          alert(`Solo hay ${item.stock} unidades disponibles.`);
          return item;
        }
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    const seedProducts = async () => {
      const q = query(collection(db, 'products'));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        const initialProducts = [
          { name: "Pulsera Amatista", price: 15.00, category: "Espiritual", image: "https://picsum.photos/seed/bracelet-1/600/800", stock: 10, description: "Pulsera de amatista natural para la paz interior." },
          { name: "Hilos de la Suerte", price: 12.00, category: "Protección", image: "https://picsum.photos/seed/bracelet-2/600/800", stock: 15, description: "Hilos rojos trenzados para la buena fortuna." },
          { name: "Brazalete Cuarzo Rosa", price: 18.00, category: "Amor", image: "https://picsum.photos/seed/bracelet-3/600/800", stock: 8, description: "Cuarzo rosa para atraer el amor y la armonía." }
        ];
        for (const p of initialProducts) {
          const ref = doc(collection(db, 'products'));
          await setDoc(ref, { ...p, id: ref.id });
        }
      }
    };
    if (isAdmin) seedProducts();
  }, [isAdmin]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin }}>
      <CartContext.Provider value={{ 
        items: cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        totalItems, 
        totalPrice,
        isCartOpen,
        setIsCartOpen
      }}>
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col selection:bg-gold/30 selection:text-olive"
          >
            <Navbar />
            <main className="flex-grow">
              <Hero />
              <ProductGrid />
              <MeaningSection />
              <SizeGuide />
              <About />
              <Testimonials />
            </main>
            <Footer />
            <CartDrawer />
          </motion.div>
        </AnimatePresence>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}
