import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Tag, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Categoria } from '../types';

interface Props {
  categorias: Categoria[];
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
  onClose: () => void;
}

// Una paleta de colores vibrantes para que los gráficos queden hermosos
const COLORES_PREDEFINIDOS = [
  '#ef4444', // Rojo
  '#f97316', // Naranja
  '#eab308', // Amarillo
  '#22c55e', // Verde
  '#14b8a6', // Teal
  '#3b82f6', // Azul
  '#8b5cf6', // Violeta
  '#ec4899', // Rosa
  '#64748b', // Gris
];

export const AjustesCategorias = ({ categorias, setCategorias, onClose }: Props) => {
  const [nuevaCat, setNuevaCat] = useState('');
  const [colorSeleccionado, setColorSeleccionado] = useState(COLORES_PREDEFINIDOS[0]);
  const [guardando, setGuardando] = useState(false);

  const agregarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaCat.trim()) return;

    // Validación: Evitamos que cree dos etiquetas con el mismo nombre
    if (categorias.some(c => c.nombre.toLowerCase() === nuevaCat.trim().toLowerCase())) {
      toast.error('Esta etiqueta ya existe');
      return;
    }

    setGuardando(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuario no autenticado');

      const nuevaCategoriaData = {
        user_id: userData.user.id,
        nombre: nuevaCat.trim(),
        color: colorSeleccionado
      };

      const { data, error } = await supabase.from('categorias').insert([nuevaCategoriaData]).select();
      if (error) throw error;

      if (data) {
        // Actualizamos la lista local y la ordenamos alfabéticamente
        setCategorias(prev => [...prev, data[0] as Categoria].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        setNuevaCat('');
        toast.success('Etiqueta creada 🏷️');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar etiqueta');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarCategoria = async (id: string, nombre: string) => {
    // Actualización optimista (la borramos de la pantalla al instante)
    const anteriores = [...categorias];
    setCategorias(categorias.filter(c => c.id !== id));
    
    try {
      const { error } = await supabase.from('categorias').delete().eq('id', id);
      if (error) throw error;
      toast.success(`${nombre} eliminada`);
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar. Reintentá.');
      setCategorias(anteriores); // Si falla en la base de datos, la volvemos a mostrar
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 p-2 rounded-xl">
              <Tag size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-eco-texto dark:text-white">Etiquetas</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Formulario Nueva Categoría */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
          <form onSubmit={agregarCategoria} className="flex flex-col gap-4">
            <input 
              type="text" 
              value={nuevaCat} 
              onChange={(e) => setNuevaCat(e.target.value)} 
              placeholder="Ej: Materiales, Ferretería..." 
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-colors"
              maxLength={20}
            />
            
            <div className="flex items-center gap-2 justify-between">
              <div className="flex gap-2 flex-wrap flex-1">
                {COLORES_PREDEFINIDOS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setColorSeleccionado(color)}
                    className={`w-8 h-8 rounded-full transition-transform ${colorSeleccionado === color ? 'scale-125 ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900 ring-blue-500' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <button 
                type="submit" 
                disabled={guardando || !nuevaCat.trim()}
                className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white p-3 rounded-2xl transition-colors shadow-lg shadow-blue-500/30"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Categorías */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tus etiquetas personalizadas</p>
          
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {categorias.length === 0 ? (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm font-bold text-gray-400 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                  Todavía no creaste ninguna etiqueta.
                </motion.p>
              ) : (
                categorias.map(cat => (
                  <motion.div 
                    key={cat.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-bold text-gray-700 dark:text-gray-200">{cat.nombre}</span>
                    </div>
                    <button 
                      onClick={() => eliminarCategoria(cat.id, cat.nombre)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </motion.div>
    </div>
  );
};