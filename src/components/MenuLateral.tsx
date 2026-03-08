import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, PieChart as PieIcon, UserPlus, ShieldAlert , Tag } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';

interface Props {
  abierto: boolean;
  onClose: () => void;
  session: Session;
  onCerrarSesion: () => void;
  onAbrirGraficos: () => void;
  onAbrirInvitacion: () => void;
  onAbrirAdmin: () => void; 
  onAbrirCategorias: () => void;
}

export const MenuLateral = ({ 
  abierto, onClose, session, onCerrarSesion, 
  onAbrirGraficos, onAbrirInvitacion, onAbrirAdmin, onAbrirCategorias // <-- SUMALA ACÁ
}: Props) => {

  const userEmail = session.user.email;
  const userName = session.user.user_metadata?.nombre || userEmail?.split('@')[0];

  return (
    <AnimatePresence>
      {abierto && (
        <>
          {/* Fondo oscuro */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Menú */}
          <motion.div 
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 left-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 p-6 flex flex-col border-r border-gray-100 dark:border-gray-800"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-black text-eco-texto dark:text-white">Hola,</h2>
                <p className="text-eco-bosque font-bold">{userName}</p>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <button onClick={() => { onAbrirGraficos(); onClose(); }} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 p-2 rounded-xl">
                  <PieIcon size={20} />
                </div>
                Estadísticas
              </button>

              <button onClick={() => { onAbrirCategorias(); onClose(); }} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 p-2 rounded-xl">
                <Tag size={20} />
                </div>
                    Mis Etiquetas
              </button>
            
              <button onClick={() => { onAbrirInvitacion(); onClose(); }} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 p-2 rounded-xl">
                  <UserPlus size={20} />
                </div>
                Invitar Familia
              </button>

              {/* 3. BOTÓN SECRETO SUPERADMIN */}
              {userEmail === 'arielmontoya200609@gmail.com' && (
                <button onClick={() => { onAbrirAdmin(); onClose(); }} className="mt-4 flex items-center gap-4 p-4 rounded-2xl bg-gray-900 dark:bg-black text-white font-bold transition-colors text-left shadow-lg border border-gray-800">
                  <div className="bg-gray-800 text-blue-400 p-2 rounded-xl">
                    <ShieldAlert size={20} />
                  </div>
                  Panel SuperAdmin
                </button>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
              <button onClick={onCerrarSesion} className="flex items-center justify-center gap-2 w-full p-4 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-colors">
                <LogOut size={20} /> Cerrar Sesión
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};