import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, X } from 'lucide-react';
import type { Ingreso } from '../types';

interface Props {
  ingresoAEditar?: Ingreso | null;
  onGuardar: (ingreso: Partial<Ingreso>) => void;
  onCancelar: () => void;
}

export const NuevoIngresoForm = ({ ingresoAEditar, onGuardar, onCancelar }: Props) => {
  const [titulo, setTitulo] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  // Si nos pasan un ingreso para editar, rellenamos los campos
  useEffect(() => {
    if (ingresoAEditar) {
      setTitulo(ingresoAEditar.titulo);
      setMonto(ingresoAEditar.monto.toString());
      setFecha(ingresoAEditar.fecha);
    }
  }, [ingresoAEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !monto) return;
    onGuardar({ titulo, monto: Number(monto), fecha });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="bg-green-500 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-xl font-black">{ingresoAEditar ? 'Editar Ingreso' : 'Nuevo Ingreso'}</h2>
          </div>
          <button onClick={onCancelar} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Descripción del ingreso</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Sueldo, Venta de bici..." className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-green-500 rounded-2xl p-4 font-bold text-gray-800 dark:text-gray-100 outline-none transition-all" required />
          </div>

          <div className="flex gap-4">
            <div className="flex-[2]">
              <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Monto</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">$</span>
                <input type="number" inputMode="decimal" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-green-500 rounded-2xl p-4 pl-8 font-black text-gray-800 dark:text-gray-100 outline-none transition-all" required min="0" step="0.01" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Fecha</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-green-500 rounded-2xl p-4 font-bold text-gray-800 dark:text-gray-100 outline-none transition-all" required />
            </div>
          </div>

          <button type="submit" className="w-full bg-green-500 text-white font-black text-lg p-4 rounded-2xl mt-2 hover:bg-green-600 active:scale-[0.98] transition-all shadow-lg shadow-green-500/30">
            {ingresoAEditar ? 'Guardar Cambios' : 'Registrar Ingreso'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};