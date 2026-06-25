import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import type { Gasto } from '../types';

interface Props {
  gastosProximos: Gasto[];
  onVerGasto: (gasto: Gasto) => void;
}

export const AlertaVencimientos = ({ gastosProximos, onVerGasto }: Props) => {
  const [cerrado, setCerrado] = useState(false);
  
  if (gastosProximos.length === 0 || cerrado) return null;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const clasificar = (fechaStr: string) => {
    const [y, m, d] = fechaStr.split('-');
    const fecha = new Date(Number(y), Number(m) - 1, Number(d));
    fecha.setHours(0, 0, 0, 0);
    const diff = fecha.getTime() - hoy.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (dias < 0) return 'vencido';
    if (dias === 0) return 'hoy';
    return 'manana';
  };

  const vencidos = gastosProximos.filter(g => clasificar(g.fechaVencimiento) === 'vencido');
  const deHoy = gastosProximos.filter(g => clasificar(g.fechaVencimiento) === 'hoy');
  const deManana = gastosProximos.filter(g => clasificar(g.fechaVencimiento) === 'manana');

  const totalUrgente = vencidos.length + deHoy.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className="mb-4 overflow-hidden"
      >
        <div className={`rounded-2xl p-4 border relative ${
          totalUrgente > 0
            ? 'bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/20 border-red-200/50 dark:border-red-800/30'
            : 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200/50 dark:border-amber-800/30'
        }`}>
          <button 
            onClick={() => setCerrado(true)} 
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full transition-colors"
          >
            <X size={14} />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1.5 rounded-lg ${totalUrgente > 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-500'}`}>
              <AlertTriangle size={16} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {totalUrgente > 0 ? '⚠️ Atención urgente' : '📅 Próximos vencimientos'}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {vencidos.map(g => (
              <button key={g.id} onClick={() => onVerGasto(g)} className="flex items-center justify-between w-full text-left p-2 rounded-xl bg-red-100/50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-bold text-red-500 bg-red-200/50 dark:bg-red-900/40 px-1.5 py-0.5 rounded shrink-0">VENCIDO</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{g.titulo}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-sm font-black text-red-600 dark:text-red-400">${g.monto.toLocaleString('es-AR')}</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
              </button>
            ))}

            {deHoy.map(g => (
              <button key={g.id} onClick={() => onVerGasto(g)} className="flex items-center justify-between w-full text-left p-2 rounded-xl bg-amber-100/50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-200/50 dark:bg-amber-900/40 px-1.5 py-0.5 rounded shrink-0">HOY</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{g.titulo}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400">${g.monto.toLocaleString('es-AR')}</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
              </button>
            ))}

            {deManana.map(g => (
              <button key={g.id} onClick={() => onVerGasto(g)} className="flex items-center justify-between w-full text-left p-2 rounded-xl bg-yellow-50/50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <Clock size={12} className="text-yellow-600 shrink-0" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{g.titulo}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400">${g.monto.toLocaleString('es-AR')}</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
