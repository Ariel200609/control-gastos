import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, PiggyBank } from 'lucide-react';
import type { Ahorro } from '../types';

interface Props {
  ahorroAEditar?: Ahorro | null;
  onGuardar: (ahorro: Partial<Ahorro>) => void;
  onCancelar: () => void;
}

export const NuevoAhorroForm = ({ ahorroAEditar, onGuardar, onCancelar }: Props) => {
  const [titulo, setTitulo] = useState(ahorroAEditar?.titulo || '');
  const [monto, setMonto] = useState(ahorroAEditar?.monto?.toString() || '');
  const [fecha, setFecha] = useState(ahorroAEditar?.fecha || new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !monto) return;
    onGuardar({ id: ahorroAEditar?.id, titulo, monto: Number(monto), fecha });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <motion.div initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-blue-500/10 dark:bg-blue-900/20">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-2 rounded-xl"><PiggyBank size={24} strokeWidth={2.5} /></div>
            <h2 className="text-xl font-black text-blue-600 dark:text-blue-400">{ahorroAEditar ? 'Editar Ahorro' : 'Separar Ahorro'}</h2>
          </div>
          <button onClick={onCancelar} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><X size={20} strokeWidth={3} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">¿Para qué es este ahorro?</label>
            <input type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Viaje, Fondo de Emergencia..." className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-colors text-gray-800 dark:text-gray-200" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Monto ($)</label>
              {/* ACÁ ESTÁ EL INPUTMODE MÁGICO */}
              <input type="number" inputMode="decimal" required min="0" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-colors text-gray-800 dark:text-gray-200" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha</label>
              <input type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-colors text-gray-800 dark:text-gray-200" />
            </div>
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-black p-4 rounded-2xl mt-4 transition-colors shadow-lg shadow-blue-500/30">
            <Save size={20} />{ahorroAEditar ? 'Guardar Cambios' : 'Guardar en la Bóveda'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};