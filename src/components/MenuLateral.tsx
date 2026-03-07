import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, PieChart, Users, LogOut } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';

interface Props {
  abierto: boolean;
  onClose: () => void;
  session: Session;
  onCerrarSesion: () => void;
  onAbrirGraficos: () => void;
  onAbrirInvitacion: () => void;
}

export const MenuLateral = ({ abierto, onClose, session, onCerrarSesion, onAbrirGraficos, onAbrirInvitacion }: Props) => {
  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs bg-eco-fondo dark:bg-gray-950 z-50 shadow-2xl flex flex-col pt-[env(safe-area-inset-top)]">
            
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-800">
              <div className="w-16 h-16 bg-eco-bosque/10 dark:bg-eco-menta/10 text-eco-bosque dark:text-eco-menta rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <UserCircle size={40} strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-black text-eco-texto dark:text-white">Hogar {session.user.user_metadata?.hogar || ''}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
              <button onClick={() => { onAbrirGraficos(); onClose(); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-900 text-left text-eco-texto dark:text-gray-300 transition-colors font-bold shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                <PieChart className="text-eco-bosque dark:text-eco-menta" size={24} /> Gráficos del Mes
              </button>
              <button onClick={() => { onAbrirInvitacion(); onClose(); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-900 text-left text-eco-texto dark:text-gray-300 transition-colors font-bold shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                <Users className="text-eco-bosque dark:text-eco-menta" size={24} /> Invitar Familia
              </button>
            </div>

            <div className="p-4 border-t border-gray-200/50 dark:border-gray-800">
              <button onClick={onCerrarSesion} className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                <LogOut size={20} /> Cerrar Sesión
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};