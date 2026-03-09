import { motion } from "framer-motion";
import { Check, Edit3, Trash2, Circle, Repeat } from "lucide-react";
import type { Gasto } from "../types";

interface Props {
  gasto: Gasto;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  compacto?: boolean;
}

export const GastoCard = ({
  gasto,
  onToggle,
  onDelete,
  onEdit,
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white dark:bg-gray-900 border ${estaPagado ? "border-gray-100 dark:border-gray-800 opacity-60" : "border-gray-200 dark:border-gray-700 shadow-sm"} rounded-2xl flex items-center justify-between transition-all ${compacto ? "p-2" : "p-4"}`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={onToggle}
          className={`shrink-0 flex items-center justify-center rounded-xl transition-colors ${
            compacto ? "w-10 h-10" : "w-12 h-12"
          } ${
            estaPagado
              ? "bg-eco-menta/20 text-eco-bosque dark:text-eco-menta"
              : "bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
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
              className={`${compacto ? "text-sm" : "text-base"} font-black text-gray-800 dark:text-gray-100 truncate ${estaPagado ? "line-through decoration-2 decoration-gray-300 dark:decoration-gray-600" : ""}`}
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
              <span className={`bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold rounded-md shrink-0 ${compacto ? "text-[8px] px-1 py-0.5" : "text-[10px] px-1.5 py-0.5"}`}>
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
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-500" 
                  : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              }`}
            >
              {estaPagado ? `Pagado el ${fechaFormateada}` : `Vence el ${fechaFormateada}`}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col items-end shrink-0 ml-2 ${compacto ? "gap-0" : "gap-2"}`}
      >
        <span
          className={`${compacto ? "text-sm" : "text-lg"} font-black ${estaPagado ? "text-gray-400" : "text-eco-texto dark:text-white"}`}
        >
          ${gasto.monto.toLocaleString("es-AR")}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className={`text-gray-400 hover:text-blue-500 transition-colors ${compacto ? "p-1" : "p-1.5"}`}
          >
            <Edit3 size={compacto ? 14 : 16} />
          </button>
          <button
            onClick={onDelete}
            className={`text-gray-400 hover:text-red-500 transition-colors ${compacto ? "p-1" : "p-1.5"}`}
          >
            <Trash2 size={compacto ? 14 : 16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};