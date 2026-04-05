import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Trash2, Camera, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { Product, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';

interface ProductModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      stock: 0,
      rating: 5.0
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setError(null);
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("No se pudo acceder a la cámara. Asegúrate de dar permisos.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 with compression
        const imageData = canvas.toDataURL('image/jpeg', 0.7);
        setFormData({ ...formData, image: imageData });
        stopCamera();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (product?.id) {
        // Update
        const productRef = doc(db, 'products', product.id);
        try {
          await updateDoc(productRef, { ...formData });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `products/${product.id}`);
        }
      } else {
        // Create
        const newProductRef = doc(collection(db, 'products'));
        try {
          await setDoc(newProductRef, {
            ...formData,
            id: newProductRef.id,
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `products/${newProductRef.id}`);
        }
      }
      onClose();
    } catch (err: any) {
      console.error("Error saving product:", err);
      try {
        const errInfo = JSON.parse(err.message);
        setError(`Error de permisos: ${errInfo.error}. Verifica que seas administrador.`);
      } catch {
        setError("Ocurrió un error al guardar el producto. Por favor intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!product?.id) return;
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'products', product.id));
      onClose();
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `products/${product.id}`);
      } catch (e: any) {
        const errInfo = JSON.parse(e.message);
        setError(`Error al eliminar: ${errInfo.error}`);
      }
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-olive/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden my-8"
          >
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center p-8 text-center"
                >
                  <div className="max-w-xs">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Trash2 size={32} />
                    </div>
                    <h3 className="text-xl font-serif text-olive mb-2">¿Eliminar Producto?</h3>
                    <p className="text-sm text-olive/60 mb-8">Esta acción no se puede deshacer. El producto desaparecerá del catálogo.</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-3 bg-cream text-olive rounded-xl font-medium"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium shadow-lg shadow-red-500/20"
                      >
                        {loading ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-3xl text-olive">
                  {product ? 'Editar Producto' : 'Añadir Producto'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-olive/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm"
                >
                  <AlertCircle size={20} className="shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-olive/50 uppercase tracking-widest mb-2">Nombre</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-gold transition-all"
                        placeholder="Nombre de la pulsera"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-olive/50 uppercase tracking-widest mb-2">Categoría</label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-6 py-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-gold transition-all"
                        placeholder="Ej: Espiritual, Amor..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-olive/50 uppercase tracking-widest mb-2">Precio ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                          className="w-full px-6 py-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-gold transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-olive/50 uppercase tracking-widest mb-2">Stock</label>
                        <input
                          type="number"
                          required
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                          className="w-full px-6 py-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-gold transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-semibold text-olive/50 uppercase tracking-widest">Imagen del Producto</label>
                        <button
                          type="button"
                          onClick={isCameraActive ? stopCamera : startCamera}
                          className={`text-xs font-bold flex items-center gap-1 transition-colors ${isCameraActive ? 'text-red-500' : 'text-gold'}`}
                        >
                          {isCameraActive ? <X size={14} /> : <Camera size={14} />}
                          {isCameraActive ? 'Cancelar Cámara' : 'Usar Cámara'}
                        </button>
                      </div>

                      {isCameraActive ? (
                        <div className="relative aspect-square bg-black rounded-2xl overflow-hidden shadow-inner">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                            <button
                              type="button"
                              onClick={capturePhoto}
                              className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
                            >
                              <div className="w-10 h-10 border-2 border-olive rounded-full" />
                            </button>
                          </div>
                          <canvas ref={canvasRef} className="hidden" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative">
                            <input
                              type="url"
                              required
                              value={formData.image}
                              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                              className="w-full px-6 py-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-gold transition-all pl-12"
                              placeholder="URL de la imagen o capturada..."
                            />
                            <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-olive/30" size={20} />
                          </div>
                          {formData.image && (
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream group">
                              <img 
                                src={formData.image} 
                                alt="Vista previa" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white text-xs font-medium">Imagen seleccionada</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {cameraError && (
                        <p className="mt-2 text-xs text-red-500 font-medium">{cameraError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-olive/50 uppercase tracking-widest mb-2">Descripción</label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-6 py-4 bg-cream rounded-2xl border-none focus:ring-2 focus:ring-gold transition-all resize-none"
                        placeholder="Detalles de la pieza..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {product && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={loading}
                      className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                    >
                      <Trash2 size={24} />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading || isCameraActive}
                    className="flex-grow py-4 bg-olive text-white rounded-2xl font-medium shadow-xl hover:bg-olive/90 disabled:bg-olive/50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
