import { motion } from 'framer-motion';
import { X, Edit3, Trash2, PiggyBank } from 'lucide-react';
import type { Ahorro } from '../types';

interface Props {
  ahorros: Ahorro[];
  onClose: () => void;
  onEdit: (ahorro: Ahorro) => void;
  onDelete: (id: string) => void;
}

export const ModalBoveda = ({ ahorros, onClose, onEdit, onDelete }: Props) => {
  const total = ahorros.reduce((acc, a) => acc + a.monto, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><PiggyBank size={24} /></div>
            <div>
              <h2 className="text-xl font-black text-blue-600 dark:text-blue-400">Mi Bóveda</h2>
              <p className="text-xs font-bold text-blue-400">Total: ${total.toLocaleString('es-AR')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
          {ahorros.length === 0 ? (
            <p className="text-center text-sm font-bold text-gray-400 py-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">La bóveda está vacía.</p>
          ) : (
            ahorros.map(a => (
              <div key={a.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200">{a.titulo}</p>
                  <p className="text-xs text-gray-500 font-medium">{a.fecha}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-black text-blue-600 dark:text-blue-400">${a.monto.toLocaleString('es-AR')}</p>
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(a)} className="text-gray-400 hover:text-blue-500 transition-colors"><Edit3 size={18} /></button>
                    <button onClick={() => onDelete(a.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};