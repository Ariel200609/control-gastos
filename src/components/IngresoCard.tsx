import { motion } from "framer-motion";
import { TrendingUp, Calendar, Edit2, Trash2 } from "lucide-react";
import type { Ingreso } from "../types";

interface Props {
  ingreso: Ingreso;
  onEdit: () => void;
  onDelete: () => void;
}

export const IngresoCard = ({ ingreso, onEdit, onDelete }: Props) => {
  const formatFecha = (fechaStr: string) => {
    const [year, month, day] = fechaStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-gray-900 border border-green-100 dark:border-green-900/30 shadow-sm rounded-2xl p-4 flex items-center justify-between group"
    >
      <div className="flex items-center gap-4 overflow-hidden flex-1">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center">
          <TrendingUp size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col truncate">
          <h3 className="text-base font-black text-gray-800 dark:text-gray-100 truncate">
            {ingreso.titulo}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-gray-400 dark:text-gray-500">
            <Calendar size={12} />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {formatFecha(ingreso.fecha)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
        <span className="text-lg font-black text-green-600 dark:text-green-400">
          +${ingreso.monto.toLocaleString("es-AR")}
        </span>
        <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};