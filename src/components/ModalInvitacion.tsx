import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  nombreHogar: string;
}

export const ModalInvitacion = ({ isOpen, onClose, nombreHogar }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center border dark:border-gray-800">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sincronizar Familia</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              Para que tu familia vea y cargue gastos en esta misma cuenta, deciles que al registrarse en la app escriban <b>exactamente</b> este nombre de hogar:
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6 border border-gray-200 dark:border-gray-700">
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-wider select-all">{nombreHogar}</p>
            </div>

            <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
              ¡Entendido!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};