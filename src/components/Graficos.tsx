import { motion } from 'framer-motion';
import type { Gasto } from '../types';

interface Props {
  gastos: Gasto[];
  mesActual: number;
  anioActual: number;
}

export const Graficos = ({ gastos, mesActual, anioActual }: Props) => {
  // Filtramos solo lo del mes actual
  const gastosDelMes = gastos.filter(g => {
    const [year, month] = g.fechaVencimiento.split('-');
    return parseInt(month) === mesActual && parseInt(year) === anioActual;
  });

  const total = gastosDelMes.reduce((acc, g) => acc + g.monto, 0);

  // Agrupamos la plata por cada categoría
  const porCategoria = gastosDelMes.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
    return acc;
  }, {} as Record<string, number>);

  // Le damos un color lindo a cada categoría
  const colores: Record<string, string> = {
    'Supermercado': 'bg-blue-500',
    'Servicios': 'bg-purple-500',
    'Impuestos': 'bg-red-500',
    'Vivienda': 'bg-orange-500',
    'Otros': 'bg-green-500'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-10">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Distribución de Gastos</h2>
        
        {total === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay gastos este mes para analizar. 🍃</p>
        ) : (
          <div className="flex flex-col gap-5">
            {Object.entries(porCategoria).sort((a, b) => b[1] - a[1]).map(([cat, monto]) => {
              const porcentaje = Math.round((monto / total) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{cat}</span>
                    <span className="text-gray-500 font-medium">{porcentaje}% (${monto.toLocaleString('es-AR')})</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${porcentaje}%` }} 
                      transition={{ duration: 1, ease: "easeOut", type: "spring" }}
                      className={`h-full rounded-full ${colores[cat] || 'bg-gray-500'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};