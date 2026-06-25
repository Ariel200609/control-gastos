import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bar, XAxis, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import type { Gasto, Ingreso } from '../types';

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

interface Props {
  gastos: Gasto[];
  ingresos: Ingreso[];
  mesActual: number;
  anioActual: number;
}

export const ResumenAnual = ({ gastos, ingresos, mesActual, anioActual }: Props) => {
  const datosUltimos6Meses = useMemo(() => {
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      let mes = mesActual - i;
      let anio = anioActual;
      if (mes <= 0) { mes += 12; anio -= 1; }

      const gastosDelMes = gastos
        .filter(g => {
          const [y, m] = g.fechaVencimiento.split('-');
          return parseInt(m, 10) === mes && parseInt(y, 10) === anio;
        })
        .reduce((t, g) => t + g.monto, 0);

      const ingresosDelMes = ingresos
        .filter(ing => {
          const [y, m] = ing.fecha.split('-');
          return parseInt(m, 10) === mes && parseInt(y, 10) === anio;
        })
        .reduce((t, ing) => t + ing.monto, 0);

      meses.push({
        name: MESES_CORTOS[mes - 1],
        gastos: gastosDelMes,
        ingresos: ingresosDelMes,
        balance: ingresosDelMes - gastosDelMes,
      });
    }
    return meses;
  }, [gastos, ingresos, mesActual, anioActual]);

  const mesMasCaro = useMemo(() => {
    if (datosUltimos6Meses.every(m => m.gastos === 0)) return null;
    return datosUltimos6Meses.reduce((max, m) => m.gastos > max.gastos ? m : max, datosUltimos6Meses[0]);
  }, [datosUltimos6Meses]);

  const mesMasBarato = useMemo(() => {
    const conGastos = datosUltimos6Meses.filter(m => m.gastos > 0);
    if (conGastos.length === 0) return null;
    return conGastos.reduce((min, m) => m.gastos < min.gastos ? m : min, conGastos[0]);
  }, [datosUltimos6Meses]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card shadow-premium p-3 rounded-xl text-xs">
          <p className="font-bold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="font-bold" style={{ color: p.color }}>
              {p.name === 'gastos' ? 'Gastos' : 'Ingresos'}: ${p.value.toLocaleString('es-AR')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <div className="glass-card shadow-premium rounded-[24px] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-500 rounded-xl flex items-center justify-center">
            <Calendar size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-lg font-black font-display text-eco-texto dark:text-white leading-tight">Últimos 6 Meses</h2>
            <p className="text-xs text-gray-400 font-medium">Tendencia de gastos e ingresos</p>
          </div>
        </div>

        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={datosUltimos6Meses} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="gastos" fill="#ef4444" radius={[6, 6, 6, 6]} barSize={24} opacity={0.85} name="gastos" />
              <Bar dataKey="ingresos" fill="#10b981" radius={[6, 6, 6, 6]} barSize={24} opacity={0.85} name="ingresos" />
              <Line dataKey="balance" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1' }} strokeDasharray="5 5" name="balance" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Stats highlights */}
        {(mesMasCaro || mesMasBarato) && (
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            {mesMasCaro && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <TrendingUp size={14} className="text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Mes más caro</p>
                  <p className="text-sm font-black text-gray-700 dark:text-gray-200">{mesMasCaro.name}</p>
                </div>
              </div>
            )}
            {mesMasBarato && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <TrendingDown size={14} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Mes más barato</p>
                  <p className="text-sm font-black text-gray-700 dark:text-gray-200">{mesMasBarato.name}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
