import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Edit3,
  PiggyBank,
} from "lucide-react";

interface Props {
  totalPendiente: number;
  totalMensual: number;
  totalPagado: number;
  totalIngresos: number;
  totalAhorros: number;
  limitePresupuesto: number;
  onEditPresupuesto: () => void;
  onAbrirBoveda: () => void;
  variantes: any;
  totalAhorrosGlobal: number;
  saldoBilletera: number; // <-- Nueva prop para el saldo histórico total
}

export const DashboardResumen = ({
  totalPendiente,
  totalMensual,
  totalPagado,
  totalIngresos,
  limitePresupuesto,
  onEditPresupuesto,
  onAbrirBoveda,
  variantes,
  totalAhorrosGlobal,
  saldoBilletera, // <-- Lo recibimos acá
}: Props) => {
  const porcentajeUso =
    limitePresupuesto > 0 ? (totalMensual / limitePresupuesto) * 100 : 0;

  return (
    <motion.div variants={variantes} className="mb-6 flex flex-col gap-4">
      {/* TARJETA PRINCIPAL: BILLETERA HISTÓRICA GLOBAL */}
      <div className="bg-gradient-to-br from-eco-bosque to-[#2d6a4f] text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -top-6 bg-white/10 w-32 h-32 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-md">
            <Wallet size={16} className="text-eco-menta" />
            <span className="text-xs font-bold tracking-wider uppercase text-gray-100">
              Billetera Total
            </span>
          </div>
        </div>
        <p className="text-4xl font-black mt-2 relative z-10 tracking-tight">
          $
          {saldoBilletera.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className="text-xs text-green-200 mt-1 relative z-10 opacity-80">
          (Todos los Ingresos - Todos los Gastos - Bóveda)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg">
              <TrendingUp size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Ingresos del Mes
            </span>
          </div>
          <p className="text-lg font-black text-gray-800 dark:text-gray-100">
            ${totalIngresos.toLocaleString("es-AR")}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-lg">
              <TrendingDown size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Gastos del Mes
            </span>
          </div>
          <p className="text-lg font-black text-gray-800 dark:text-gray-100">
            ${totalMensual.toLocaleString("es-AR")}
          </p>
          <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
              <span>Pagado:</span>
              <span>${totalPagado.toLocaleString("es-AR")}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-red-400">
              <span>Pendiente:</span>
              <span>${totalPendiente.toLocaleString("es-AR")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BÓVEDA GLOBAL */}
      <div
        onClick={onAbrirBoveda}
        className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-5 shadow-sm flex justify-between items-center relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
      >
        <PiggyBank
          size={80}
          className="absolute -right-4 -bottom-4 text-blue-500 opacity-10"
        />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-2">
            <PiggyBank size={16} /> Fondo de Ahorro
          </p>
          <p className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">
            ${totalAhorrosGlobal.toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Límite de Gastos
          </p>
          <button
            onClick={onEditPresupuesto}
            className="text-gray-400 hover:text-eco-bosque transition-colors"
          >
            <Edit3 size={16} />
          </button>
        </div>
        {limitePresupuesto > 0 ? (
          <>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(porcentajeUso, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${porcentajeUso > 90 ? "bg-red-500" : porcentajeUso > 75 ? "bg-yellow-500" : "bg-eco-menta"}`}
              />
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-500">
                ${totalMensual.toLocaleString("es-AR")}
              </span>
              <span
                className={
                  porcentajeUso > 90 ? "text-red-500" : "text-gray-400"
                }
              >
                ${limitePresupuesto.toLocaleString("es-AR")}
              </span>
            </div>
          </>
        ) : (
          <button
            onClick={onEditPresupuesto}
            className="w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-400 hover:text-eco-bosque hover:border-eco-bosque transition-colors"
          >
            + Establecer Límite
          </button>
        )}
      </div>
    </motion.div>
  );
};