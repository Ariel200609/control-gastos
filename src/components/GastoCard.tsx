import { motion } from 'framer-motion';
import { 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Circle, 
  Repeat, 
  AlertCircle, 
  Clock 
} from 'lucide-react';
import type { Gasto } from '../types';

interface Props {
  gasto: Gasto;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export const GastoCard = ({ gasto, onToggle, onDelete, onEdit }: Props) => {
  const isPagado = gasto.estado === 'pagado';
  const hoy = new Date().toISOString().split('T')[0];

  // Lógica de Urgencias Visuales
  const esVencido = !isPagado && gasto.fechaVencimiento < hoy;
  const venceHoy = !isPagado && gasto.fechaVencimiento === hoy;

  // Formateo de fecha para mostrar (ej: 15 mar)
  const [year, month, day] = gasto.fechaVencimiento.split('-');
  const fechaFormateada = `${parseInt(day)} ${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('es', { month: 'short' })}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden bg-white dark:bg-gray-900 rounded-[20px] p-4 flex items-center gap-4 border transition-all shadow-sm ${
        isPagado 
          ? 'opacity-60 border-gray-100 dark:border-gray-800' 
          : esVencido 
            ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)] bg-red-50/10' 
            : venceHoy 
              ? 'border-orange-500/50 bg-orange-50/10' 
              : 'border-gray-100 dark:border-gray-800'
      }`}
    >
      {/* Etiqueta de Urgencia (Badge) */}
      {(esVencido || venceHoy) && (
        <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter shadow-sm z-10 ${
          esVencido ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
        }`}>
          {esVencido ? <AlertCircle size={10} strokeWidth={3} /> : <Clock size={10} strokeWidth={3} />}
          {esVencido ? 'Vencido' : 'Vence Hoy'}
        </div>
      )}

      {/* Botón de Check / Estado */}
      <button 
        onClick={onToggle} 
        className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
          isPagado 
            ? 'bg-eco-menta/20 text-eco-bosque dark:text-eco-menta' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {isPagado ? <CheckCircle2 size={28} strokeWidth={2.5} /> : <Circle size={28} strokeWidth={2} />}
      </button>

      {/* Contenido Principal */}
      <div className="flex-1 min-w-0 py-1">
        <h3 className={`font-bold text-[17px] truncate transition-colors flex items-center gap-2 ${
          isPagado 
            ? 'text-gray-500 line-through decoration-2' 
            : esVencido 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-eco-texto dark:text-gray-100'
        }`}>
          {gasto.titulo}
          
          {/* Indicador de Gasto Fijo Animado */}
          {gasto.es_fijo && (
            <motion.div 
              initial={{ rotate: -180, opacity: 0 }} 
              animate={{ rotate: 0, opacity: 1 }} 
              className="text-blue-500 bg-blue-50 dark:bg-blue-900/30 p-1 rounded-md shadow-sm"
              title="Gasto Mensual Fijo"
            >
              <Repeat size={12} strokeWidth={3} />
            </motion.div>
          )}
        </h3>

        <div className="flex items-center gap-2 mt-1 text-xs">
          <span className="text-gray-500 font-medium uppercase tracking-tight">{gasto.categoria}</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className={`px-2 py-0.5 rounded-md font-bold ${
            isPagado 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' 
              : esVencido 
                ? 'bg-red-500 text-white shadow-sm' 
                : venceHoy
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          }`}>
            {isPagado ? `Pagado el ${fechaFormateada}` : esVencido ? `Venció el ${fechaFormateada}` : `Vence el ${fechaFormateada}`}
          </span>
        </div>

        {gasto.detalles && (
          <div className="mt-2 text-[11px] leading-snug text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50 italic">
            {gasto.detalles}
          </div>
        )}
      </div>

      {/* Monto y Acciones */}
      <div className="flex flex-col items-end gap-2 pl-2">
        <span className={`font-black text-lg transition-colors ${
          isPagado ? 'text-gray-400' : esVencido ? 'text-red-600' : 'text-eco-texto dark:text-white'
        }`}>
          ${gasto.monto.toLocaleString('es-AR')}
        </span>
        <div className="flex gap-1">
          {!isPagado && (
            <button 
              onClick={onEdit} 
              className="p-2 text-gray-300 hover:text-blue-500 transition-colors"
              aria-label="Editar gasto"
            >
              <Edit2 size={18} strokeWidth={2.5} />
            </button>
          )}
          <button 
            onClick={onDelete} 
            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
            aria-label="Eliminar gasto"
          >
            <Trash2 size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};