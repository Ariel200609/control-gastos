import { motion } from 'framer-motion';
import { Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react';
import type { Gasto } from '../types';
import { Repeat } from 'lucide-react';

interface Props {
  gasto: Gasto;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void; // NUEVO: Función para editar
}

export const GastoCard = ({ gasto, onToggle, onDelete, onEdit }: Props) => {
  const isPagado = gasto.estado === 'pagado';

  const [year, month, day] = gasto.fechaVencimiento.split('-');
  const fechaFormateada = `${parseInt(day)} ${new Date(parseInt(year), parseInt(month)-1).toLocaleString('es', { month: 'short' })}`;
  
  const esVencido = !isPagado && new Date(gasto.fechaVencimiento) < new Date(new Date().setHours(0,0,0,0));

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }} className={`relative overflow-hidden bg-white dark:bg-gray-900 rounded-[20px] p-4 flex items-center gap-4 border transition-all shadow-sm ${isPagado ? 'opacity-60 border-gray-100 dark:border-gray-800' : esVencido ? 'border-eco-alerta/30 dark:border-eco-alerta/20 bg-orange-50/30 dark:bg-orange-900/10' : 'border-gray-100 dark:border-gray-800'}`}>
      
      <button onClick={onToggle} className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isPagado ? 'bg-eco-menta/20 text-eco-bosque dark:text-eco-menta' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
        {isPagado ? <CheckCircle2 size={28} strokeWidth={2.5} /> : <Circle size={28} strokeWidth={2} />}
      </button>

      <div className="flex-1 min-w-0 py-1">
        <h3 className={`font-bold text-[17px] truncate transition-colors flex items-center gap-2 ${isPagado ? 'text-gray-500 line-through decoration-2' : esVencido ? 'text-eco-alerta' : 'text-eco-texto dark:text-gray-100'}`}>
          {gasto.titulo}
          {gasto.es_fijo && <span title="Gasto Fijo Mensual"><Repeat size={14} className="text-blue-500" /></span>}
        </h3>
        
        <div className="flex items-center gap-2 mt-1 text-xs">
          <span className="text-gray-500 font-medium">{gasto.categoria}</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className={`px-2 py-0.5 rounded-md font-bold ${isPagado ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' : esVencido ? 'bg-eco-alerta text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
            {isPagado ? `Pagado el ${fechaFormateada}` : esVencido ? `¡Vencido el ${fechaFormateada}!` : `Vence el ${fechaFormateada}`}
          </span>
        </div>
        {gasto.detalles && (
          <div className="mt-2 text-[11px] leading-snug text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50">
            {gasto.detalles}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 pl-2">
        <span className={`font-black text-lg transition-colors ${isPagado ? 'text-gray-400' : 'text-eco-texto dark:text-white'}`}>
          ${gasto.monto.toLocaleString('es-AR')}
        </span>
        <div className="flex gap-1">
          {/* Botón de Editar */}
          {!isPagado && (
            <button onClick={onEdit} className="p-2 text-gray-300 hover:text-blue-500 transition-colors">
              <Edit2 size={18} strokeWidth={2.5} />
            </button>
          )}
          {/* Botón de Borrar */}
          <button onClick={onDelete} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
            <Trash2 size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};