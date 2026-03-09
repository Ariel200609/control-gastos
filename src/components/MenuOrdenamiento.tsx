import { motion } from 'framer-motion';
import { X, Check, List, LayoutList } from 'lucide-react';

export type TipoOrden = 'fecha-asc' | 'fecha-desc' | 'monto-desc' | 'monto-asc' | 'fijos';

interface Props {
  ordenActual: TipoOrden;
  setOrden: (orden: TipoOrden) => void;
  vistaCompacta: boolean; // <-- NUEVO
  setVistaCompacta: (compacta: boolean) => void; // <-- NUEVO
  onClose: () => void;
}

const OPCIONES: { id: TipoOrden; label: string; }[] = [
  { id: 'fecha-asc', label: 'Vencimiento: Más próximos' },
  { id: 'fecha-desc', label: 'Vencimiento: Más lejanos' },
  { id: 'monto-desc', label: 'Monto: Mayor a menor' },
  { id: 'monto-asc', label: 'Monto: Menor a mayor' },
  { id: 'fijos', label: 'Gastos Fijos primero' },
];

export const MenuOrdenamiento = ({ ordenActual, setOrden, vistaCompacta, setVistaCompacta, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white dark:bg-[#121212] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] shadow-2xl relative z-10 overflow-hidden flex flex-col pb-4"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Clasificar por</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><X size={24} /></button>
        </div>

        <div className="flex flex-col p-2">
          {OPCIONES.map((opcion) => {
            const activo = ordenActual === opcion.id;
            return (
              <button key={opcion.id} onClick={() => { setOrden(opcion.id); onClose(); }} className={`flex items-center justify-between p-4 px-6 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${activo ? 'text-eco-bosque dark:text-eco-menta' : 'text-gray-700 dark:text-gray-300'}`}>
                <span className={`text-base ${activo ? 'font-bold' : 'font-medium'}`}>{opcion.label}</span>
                {activo && <Check size={20} strokeWidth={3} />}
              </button>
            );
          })}
        </div>

        {/* SECCIÓN VISTA COMPACTA */}
        <div className="mt-2 pt-4 border-t border-gray-100 dark:border-gray-800 px-6">
          <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3">Ver en modo</h3>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setVistaCompacta(false)} 
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl font-bold transition-all ${!vistaCompacta ? 'bg-gray-100 dark:bg-gray-800 text-eco-bosque dark:text-eco-menta' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
             >
                <LayoutList size={18} /> Normal
             </button>
             <button 
                onClick={() => setVistaCompacta(true)} 
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl font-bold transition-all ${vistaCompacta ? 'bg-gray-100 dark:bg-gray-800 text-eco-bosque dark:text-eco-menta' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
             >
                <List size={18} /> Compacto
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};