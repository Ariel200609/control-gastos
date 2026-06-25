import { memo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, Edit2, Trash2 } from "lucide-react";
import type { Ingreso } from "../types";

interface Props {
  ingreso: Ingreso;
  onEdit: () => void;
  onDelete: () => void;
}

export const IngresoCard = memo(({ ingreso, onEdit, onDelete }: Props) => {
  const formatFecha = (fechaStr: string) => {
    const [year, month, day] = fechaStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="glass-card shadow-premium rounded-2xl p-4 flex items-center justify-between group border-l-accent border-l-emerald-400 transition-all duration-200 hover:shadow-premium-hover hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-4 overflow-hidden flex-1">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 dark:from-green-900/30 dark:to-emerald-900/20 text-emerald-500 flex items-center justify-center shadow-sm">
          <TrendingUp size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col truncate">
          <h3 className="text-base font-black text-gray-800 dark:text-gray-100 truncate font-display">
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
        <span className="text-lg font-black font-display text-emerald-600 dark:text-emerald-400">
          +${ingreso.monto.toLocaleString("es-AR")}
        </span>
        <div className="flex gap-1">
          <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
});