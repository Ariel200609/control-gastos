import { motion } from 'framer-motion';
import { Target, AlertTriangle } from 'lucide-react';

interface Props {
  totalGastado: number;
  limite: number;
  onEdit: () => void;
}

export const PresupuestoProgressBar = ({ totalGastado, limite, onEdit }: Props) => {
  if (limite === 0) {
    return (
      <button onClick={onEdit} className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-[16px] border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-bold">
        <Target size={18} /> Definir Presupuesto Mensual
      </button>
    );
  }

  const porcentaje = Math.min((totalGastado / limite) * 100, 100);
  const superado = totalGastado > limite;

  // Lógica de colores según qué tan cerca del límite estemos
  let colorBarra = 'bg-eco-menta';
  let colorTexto = 'text-eco-bosque dark:text-eco-menta';
  
  if (porcentaje >= 100) { colorBarra = 'bg-red-500'; colorTexto = 'text-red-500'; } 
  else if (porcentaje >= 85) { colorBarra = 'bg-eco-alerta'; colorTexto = 'text-eco-alerta'; }

  return (
    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800/50">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Límite Mensual</p>
          <div className="flex items-center gap-2">
            <span className={`font-black ${colorTexto}`}>
              ${totalGastado.toLocaleString('es-AR')} <span className="text-gray-400 text-sm font-medium">/ ${limite.toLocaleString('es-AR')}</span>
            </span>
          </div>
        </div>
        <button onClick={onEdit} className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-[10px] hover:bg-blue-100 transition-colors">
          Editar
        </button>
      </div>

      {/* La barra de progreso animada */}
      <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner relative">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${porcentaje}%` }} 
          transition={{ duration: 1, type: "spring" }}
          className={`h-full rounded-full ${colorBarra}`}
        />
      </div>

      {/* Alerta si nos pasamos */}
      {superado && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-red-500 mt-2 flex items-center gap-1">
          <AlertTriangle size={14} /> ¡Atención! Superaste tu límite mensual por ${(totalGastado - limite).toLocaleString('es-AR')}.
        </motion.p>
      )}
    </div>
  );
};