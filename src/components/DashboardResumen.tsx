import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Edit3,
  PiggyBank,
  Sparkles,
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
      <div className="bg-gradient-to-br from-eco-bosque via-[#2d6a4f] to-[#1B4332] text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 bg-white/10 w-40 h-40 rounded-full blur-2xl animate-breathing"></div>
        <div className="absolute -left-6 -bottom-10 bg-eco-menta/10 w-32 h-32 rounded-full blur-2xl animate-breathing" style={{ animationDelay: '2s' }}></div>
        <div className="absolute right-12 bottom-4 bg-white/5 w-20 h-20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-md">
            <Wallet size={16} className="text-eco-menta" />
            <span className="text-xs font-bold tracking-wider uppercase text-gray-100">
              Billetera Total
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
            <Sparkles size={12} className="text-eco-menta" />
            <span className="text-[10px] font-bold text-eco-menta">Global</span>
          </div>
        </div>
        <p className="text-4xl font-black mt-3 relative z-10 tracking-tight font-display">
          $
          {saldoBilletera.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className="text-xs text-green-200/70 mt-1.5 relative z-10 font-medium">
          Ingresos − Gastos − Bóveda
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* INGRESOS DEL MES */}
        <div className="glass-card shadow-premium rounded-3xl p-4 transition-all duration-200 hover:shadow-premium-hover group">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/20 p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              <TrendingUp size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Ingresos
            </span>
          </div>
          <p className="text-lg font-black text-gray-800 dark:text-gray-100 font-display">
            ${totalIngresos.toLocaleString("es-AR")}
          </p>
        </div>

        {/* GASTOS DEL MES */}
        <div className="glass-card shadow-premium rounded-3xl p-4 transition-all duration-200 hover:shadow-premium-hover group">
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <div className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/20 p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              <TrendingDown size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Gastos
            </span>
          </div>
          <p className="text-lg font-black text-gray-800 dark:text-gray-100 font-display">
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
        className="glass-card shadow-premium rounded-3xl p-5 flex justify-between items-center relative overflow-hidden cursor-pointer hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200 border-l-accent border-l-blue-400"
      >
        <PiggyBank
          size={80}
          className="absolute -right-4 -bottom-4 text-blue-500 opacity-[0.07]"
        />
        <div className="absolute right-16 top-2 w-16 h-16 bg-blue-400/5 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-2">
            <PiggyBank size={16} /> Fondo de Ahorro
          </p>
          <p className="text-2xl font-black font-display text-blue-700 dark:text-blue-300 mt-1">
            ${totalAhorrosGlobal.toLocaleString("es-AR")}
          </p>
        </div>
        <div className="relative z-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 p-2 rounded-xl">
          <Sparkles size={18} />
        </div>
      </div>

      {/* LÍMITE DE PRESUPUESTO */}
      <div className="glass-card shadow-premium rounded-3xl p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Límite de Gastos
          </p>
          <button
            onClick={onEditPresupuesto}
            className="text-gray-400 hover:text-eco-bosque hover:bg-eco-bosque/10 p-1.5 rounded-lg transition-all"
          >
            <Edit3 size={16} />
          </button>
        </div>
        {limitePresupuesto > 0 ? (
          <>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3.5 mb-2 overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(porcentajeUso, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full relative ${porcentajeUso > 90 ? "bg-gradient-to-r from-red-400 to-red-500" : porcentajeUso > 75 ? "bg-gradient-to-r from-amber-400 to-yellow-500" : "bg-gradient-to-r from-eco-menta to-emerald-400"}`}
              >
                {/* Glow effect on the bar */}
                <div className="absolute right-0 top-0 w-4 h-full bg-white/30 rounded-full blur-sm animate-progress-glow"></div>
              </motion.div>
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
            className="w-full py-2.5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-400 hover:text-eco-bosque hover:border-eco-bosque hover:bg-eco-bosque/5 transition-all"
          >
            + Establecer Límite
          </button>
        )}
      </div>
    </motion.div>
  );
};