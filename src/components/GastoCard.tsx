import { memo } from "react";
import { motion } from "framer-motion";
import { Check, Edit3, Trash2, Circle, Repeat, Copy } from "lucide-react";
import type { Gasto } from "../types";

interface Props {
  gasto: Gasto;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onDuplicate?: () => void;
  compacto?: boolean;
}

export const GastoCard = memo(({
  gasto,
  onToggle,
  onDelete,
  onEdit,
  onDuplicate,
  compacto = false,
}: Props) => {
  const estaPagado = gasto.estado === "pagado";

  const formatFecha = (fechaStr: string) => {
    const [year, month, day] = fechaStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  const fechaFormateada = formatFecha(gasto.fechaVencimiento);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className={`glass-card shadow-premium rounded-2xl flex items-center justify-between transition-all duration-200 hover:shadow-premium-hover hover:-translate-y-0.5 border-l-accent ${
        estaPagado 
          ? "border-l-eco-menta/60 opacity-65" 
          : "border-l-eco-alerta"
      } ${compacto ? "p-2.5" : "p-4"}`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={onToggle}
          className={`shrink-0 flex items-center justify-center rounded-xl transition-all duration-200 ${
            compacto ? "w-10 h-10" : "w-12 h-12"
          } ${
            estaPagado
              ? "bg-eco-menta/20 text-eco-bosque dark:text-eco-menta scale-95"
              : "bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-eco-menta/10 hover:text-eco-bosque dark:hover:bg-eco-menta/10 dark:hover:text-eco-menta"
          }`}
        >
          {estaPagado ? (
            <Check size={compacto ? 20 : 24} strokeWidth={3} />
          ) : (
            <Circle size={compacto ? 20 : 24} strokeWidth={2.5} />
          )}
        </button>

        <div className="flex flex-col truncate">
          <div className="flex items-center gap-2">
            <h3
              className={`${compacto ? "text-sm" : "text-base"} font-black text-gray-800 dark:text-gray-100 truncate font-display ${estaPagado ? "line-through decoration-2 decoration-gray-300 dark:decoration-gray-600" : ""}`}
            >
              {gasto.titulo}
            </h3>
            
            {/* ÍCONO GASTO FIJO */}
            {gasto.es_fijo && (
              <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-500 p-0.5 rounded-md flex shrink-0">
                <Repeat size={12} strokeWidth={3} />
              </div>
            )}

            {/* PASTILLA DE CUOTAS */}
            {gasto.cuotas_totales && gasto.cuotas_totales > 1 && (
              <span className={`bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold rounded-lg shrink-0 ${compacto ? "text-[8px] px-1 py-0.5" : "text-[10px] px-1.5 py-0.5"}`}>
                Cuota {gasto.cuota_actual}/{gasto.cuotas_totales}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            {!compacto && (
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                {gasto.categoria}
              </span>
            )}
            {!compacto && (
              <span className="text-gray-300 dark:text-gray-700">•</span>
            )}
            
            <span
              className={`font-bold ${compacto ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"} rounded-full ${
                estaPagado 
                  ? "bg-eco-menta/10 text-eco-bosque dark:text-eco-menta" 
                  : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
              }`}
            >
              {estaPagado ? `Pagado el ${fechaFormateada}` : `Vence el ${fechaFormateada}`}
            </span>

            {gasto.created_by_name && (
              <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 shrink-0" title={`Cargado por ${gasto.created_by_name}`}>
                <span className="w-3.5 h-3.5 bg-gradient-to-br from-eco-bosque to-eco-menta text-white rounded-full flex items-center justify-center text-[7px] font-black">{gasto.created_by_name.charAt(0).toUpperCase()}</span>
                {!compacto && <span className="truncate max-w-[60px]">{gasto.created_by_name.split(' ')[0]}</span>}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col items-end shrink-0 ml-2 ${compacto ? "gap-0" : "gap-2"}`}
      >
        <span
          className={`${compacto ? "text-sm" : "text-lg"} font-black font-display ${estaPagado ? "text-gray-400" : "text-eco-texto dark:text-white"}`}
        >
          ${gasto.monto.toLocaleString("es-AR")}
        </span>

        <div className="flex items-center gap-1">
          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className={`text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all ${compacto ? "p-1" : "p-1.5"}`}
              title="Duplicar"
            >
              <Copy size={compacto ? 14 : 16} />
            </button>
          )}
          <button
            onClick={onEdit}
            className={`text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all ${compacto ? "p-1" : "p-1.5"}`}
          >
            <Edit3 size={compacto ? 14 : 16} />
          </button>
          <button
            onClick={onDelete}
            className={`text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all ${compacto ? "p-1" : "p-1.5"}`}
          >
            <Trash2 size={compacto ? 14 : 16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
});