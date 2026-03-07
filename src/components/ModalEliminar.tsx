import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalEliminar = ({ isOpen, onClose, onConfirm }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center border dark:border-gray-800">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🗑️</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¿Eliminar gasto?</h3>
            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300">Cancelar</button>
              <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500">Eliminar</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};