import { motion } from 'framer-motion';
import { PresupuestoProgressBar } from './PresupuestoProgressBar';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface Props {
  totalPendiente: number;
  totalMensual: number; // Esto son los gastos
  totalPagado: number;
  totalIngresos: number; // NUEVA PROP
  limitePresupuesto: number;
  onEditPresupuesto: () => void;
  variantes: any;
}

export const DashboardResumen = ({ totalPendiente, totalMensual, totalIngresos, limitePresupuesto, onEditPresupuesto, variantes }: Props) => {
  // Calculamos el saldo real a favor
  const saldo = totalIngresos - totalMensual;
  
  return (
    <motion.section variants={variantes} className="mb-8">
      <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 dark:border-gray-800 transition-all">
        
        {/* SALDO PRINCIPAL A FAVOR */}
        <div className="mb-6 bg-gradient-to-tr from-eco-bosque to-[#40916c] rounded-[20px] p-5 text-white shadow-lg shadow-eco-bosque/30 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xs font-bold uppercase tracking-wider opacity-90 flex items-center gap-2 mb-1">
              <Wallet size={16} /> Saldo Disponible del Mes
            </h2>
            <p className="text-4xl font-black tracking-tight">
              ${saldo.toLocaleString('es-AR')}
            </p>
          </div>
          {/* Decoración de fondo */}
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Wallet size={100} />
          </div>
        </div>

        {/* COMPARATIVA INGRESOS VS GASTOS */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-[16px] border border-green-100 dark:border-green-900/30">
            <p className="text-xs text-green-600 dark:text-green-400 font-bold mb-1 flex items-center gap-1"><TrendingUp size={14}/> Ingresos</p>
            <p className="text-xl font-extrabold text-green-700 dark:text-green-300">
              ${totalIngresos.toLocaleString('es-AR')}
            </p>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-[16px] border border-red-100 dark:border-red-900/30">
            <p className="text-xs text-red-600 dark:text-red-400 font-bold mb-1 flex items-center gap-1"><TrendingDown size={14}/> Gastos</p>
            <p className="text-xl font-extrabold text-red-700 dark:text-red-300">
              ${totalMensual.toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        <PresupuestoProgressBar 
          totalGastado={totalMensual} 
          limite={limitePresupuesto} 
          onEdit={onEditPresupuesto} 
        />
        
        {/* Aviso de pendientes */}
        {totalPendiente > 0 && (
          <p className="text-xs text-center font-bold text-gray-500 dark:text-gray-400 mt-4">
            Tenés <span className="text-red-500">${totalPendiente.toLocaleString('es-AR')}</span> en deudas pendientes.
          </p>
        )}

      </div>
    </motion.section>
  );
};