import { motion } from 'framer-motion';
import type { Gasto } from '../types';

interface Props {
  gasto: Gasto;
  onToggle: () => void;
  onDelete: () => void;
}

export const GastoCard = ({ gasto, onToggle, onDelete }: Props) => {
  const isPendiente = gasto.estado === 'pendiente';
  
  const hoy = new Date().toISOString().split('T')[0];
  const estaVencido = isPendiente && gasto.fechaVencimiento < hoy;

  const formatearFecha = (fechaString: string) => {
    const [year, month, day] = fechaString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(date);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: -20 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onToggle}
      className={`p-4 rounded-2xl shadow-sm border flex justify-between items-center mb-1 transition-colors duration-300 cursor-pointer relative group ${
        isPendiente 
          ? (estaVencido 
              ? 'bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30' 
              : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800') 
          : 'bg-gray-50 dark:bg-gray-950 border-green-200 dark:border-green-900/50 opacity-80'
      }`}
    >
      <div className="flex-1">
        <h3 className={`font-bold text-lg transition-colors ${
          isPendiente 
            ? (estaVencido ? 'text-red-900 dark:text-red-400' : 'text-gray-800 dark:text-gray-200') 
            : 'text-gray-500 dark:text-gray-600 line-through'
        }`}>
          {gasto.titulo}
        </h3>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">{gasto.categoria}</span>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
            isPendiente 
              ? (estaVencido ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400') 
              : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}>
            📅 {estaVencido ? '¡Vencido el ' : 'Vence el '} {formatearFecha(gasto.fechaVencimiento)}
          </span>
        </div>
      </div>
      
      <div className="text-right flex flex-col items-end mr-10">
        <p className={`font-extrabold text-xl mb-1 transition-colors ${
          isPendiente ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-600'
        }`}>
          ${gasto.monto.toLocaleString('es-AR')}
        </p>
        
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
          isPendiente 
            ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' 
            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500'
        }`}>
          {isPendiente ? 'Pendiente' : 'Pagado'}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-3 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 z-10"
        title="Eliminar gasto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    </motion.div>
  );
};