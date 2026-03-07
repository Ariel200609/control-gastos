import { motion } from 'framer-motion';
import { PresupuestoProgressBar } from './PresupuestoProgressBar';

interface Props {
  totalPendiente: number;
  totalMensual: number;
  totalPagado: number;
  limitePresupuesto: number;
  onEditPresupuesto: () => void;
  variantes: any;
}

export const DashboardResumen = ({ totalPendiente, totalMensual, totalPagado, limitePresupuesto, onEditPresupuesto, variantes }: Props) => {
  return (
    <motion.section variants={variantes} className="mb-8">
      <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100/50 dark:border-gray-800 transition-all">
        
        <div className="mb-6">
          <h2 className="text-xs font-bold text-eco-bosque dark:text-eco-menta uppercase tracking-wider mb-1">
            Pendiente de Pago
          </h2>
          <p className={`text-5xl font-black tracking-tight ${totalPendiente > 0 ? 'text-eco-alerta' : 'text-eco-texto dark:text-white'}`}>
            ${totalPendiente.toLocaleString('es-AR')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-eco-fondo dark:bg-gray-800/50 p-4 rounded-[16px] border border-gray-100 dark:border-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">Total Gastos</p>
            <p className="text-xl font-extrabold text-eco-texto dark:text-gray-200">
              ${totalMensual.toLocaleString('es-AR')}
            </p>
          </div>
          
          <div className="bg-[#74C69D]/10 dark:bg-[#74C69D]/5 p-4 rounded-[16px] border border-[#74C69D]/20">
            <p className="text-xs text-eco-bosque dark:text-eco-menta font-bold mb-1">Pagado</p>
            <p className="text-xl font-extrabold text-eco-bosque dark:text-eco-menta">
              ${totalPagado.toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        {/* ACÁ ENCHUFAMOS LA BARRA NUEVA */}
        <PresupuestoProgressBar 
          totalGastado={totalMensual} 
          limite={limitePresupuesto} 
          onEdit={onEditPresupuesto} 
        />

      </div>
    </motion.section>
  );
};