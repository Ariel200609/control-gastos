import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  limiteActual: number;
  onSave: (nuevoLimite: number) => void;
}

export const ModalPresupuesto = ({ isOpen, onClose, limiteActual, onSave }: Props) => {
  const [monto, setMonto] = useState(limiteActual > 0 ? limiteActual.toString() : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(Number(monto));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-[32px] p-8 max-w-xs w-full shadow-2xl text-center border dark:border-gray-800">
            
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target size={32} strokeWidth={2} />
            </div>
            
            <h3 className="text-xl font-black text-eco-texto dark:text-white mb-2">Presupuesto Máximo</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-medium leading-tight">
              ¿Cuánto es lo máximo que querés gastar en total este mes?
            </p>
            
            <form onSubmit={handleSubmit}>
              <input type="number" placeholder="Ej: 300000" value={monto} onChange={(e) => setMonto(e.target.value)} className="w-full bg-eco-fondo dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-eco-texto dark:text-white rounded-[16px] p-4 outline-none focus:border-blue-500 mb-6 text-center text-2xl font-black" autoFocus min="0" />
              
              <div className="flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-4 rounded-[16px] font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-4 rounded-[16px] font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">Guardar</button>
              </div>
            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};