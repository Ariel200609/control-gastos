import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieIcon, TrendingUp } from 'lucide-react';
import type { Gasto, Ingreso } from '../types'; // <-- 1. Importamos Ingreso

interface Props {
  gastos: Gasto[];
  ingresos?: Ingreso[]; // <-- 2. Le avisamos a TS que ahora recibimos ingresos
  mesActual: number;
  anioActual: number;
}

const COLORES_CATEGORIAS = {
  'Supermercado': '#10b981', 
  'Servicios': '#3b82f6',    
  'Vivienda': '#8b5cf6',     
  'Comida': '#f59e0b',       
  'Transporte': '#64748b',   
  'Salud': '#ef4444',        
  'Ocio': '#ec4899',         
  'Otros': '#94a3b8'         
};

export const Graficos = ({ gastos, ingresos = [], mesActual, anioActual }: Props) => {
  const gastosDelMes = gastos.filter(g => {
    const [year, month] = g.fechaVencimiento.split('-');
    return parseInt(month) === mesActual && parseInt(year) === anioActual;
  });

  const ingresosDelMes = ingresos.filter(i => {
    const [year, month] = i.fecha.split('-');
    return parseInt(month) === mesActual && parseInt(year) === anioActual;
  });

  const gastosPorCategoria = gastosDelMes.reduce((acc, gasto) => {
    acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.monto;
    return acc;
  }, {} as Record<string, number>);

  const datosTorta = Object.keys(gastosPorCategoria)
    .map(key => ({
      name: key,
      value: gastosPorCategoria[key]
    }))
    .sort((a, b) => b.value - a.value);

  const totalGastos = gastosDelMes.reduce((sum, g) => sum + g.monto, 0);
  const totalIngresos = ingresosDelMes.reduce((sum, i) => sum + i.monto, 0);
  
  const datosBalance = [
    { name: 'Ingresos', monto: totalIngresos, fill: '#10b981' }, 
    { name: 'Gastos', monto: totalGastos, fill: '#ef4444' }      
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="font-bold text-gray-700 dark:text-gray-200 mb-1">{payload[0].name}</p>
          <p className="text-lg font-black" style={{ color: payload[0].payload.fill || payload[0].color }}>
            ${payload[0].value.toLocaleString('es-AR')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-10">
      
      {/* SECCIÓN 1: BALANCE GENERAL */}
      <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-lg font-black text-eco-texto dark:text-white leading-tight">Balance Mensual</h2>
            <p className="text-xs text-gray-400 font-medium">Ingresos vs Gastos</p>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosBalance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="monto" radius={[8, 8, 8, 8]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECCIÓN 2: DISTRIBUCIÓN DE GASTOS */}
      <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-xl flex items-center justify-center">
            <PieIcon size={20} strokeWidth={2.5} /> {/* <-- Bug del ícono arreglado acá */}
          </div>
          <div>
            <h2 className="text-lg font-black text-eco-texto dark:text-white leading-tight">Distribución</h2>
            <p className="text-xs text-gray-400 font-medium">¿En qué se va la plata?</p>
          </div>
        </div>

        {datosTorta.length === 0 ? (
          <p className="text-center text-gray-400 font-bold py-10">No hay gastos registrados este mes.</p>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosTorta}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {datosTorta.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORES_CATEGORIAS[entry.name as keyof typeof COLORES_CATEGORIAS] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </motion.div>
  );
};