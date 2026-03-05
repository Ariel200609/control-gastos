import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Categoria, Gasto } from '../types';

interface Props {
  onGuardar: (nuevoGasto: Gasto) => void;
  onCancelar: () => void;
}

export const NuevoGastoForm = ({ onGuardar, onCancelar }: Props) => {
  const [titulo, setTitulo] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('Servicios');
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !monto) return;

    const nuevo: Gasto = {
      id: crypto.randomUUID(),
      titulo,
      monto: Number(monto),
      categoria,
      fechaVencimiento,
      estado: 'pendiente'
    };
    onGuardar(nuevo);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center z-50"
    >
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border dark:border-gray-800"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Agregar nuevo gasto</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">¿Qué hay que pagar?</label>
            <input type="text" placeholder="Ej: Internet..." className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto ($)</label>
              <input type="number" placeholder="Ej: 15000" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" value={monto} onChange={(e) => setMonto(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vencimiento</label>
              <input type="date" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all [color-scheme:light] dark:[color-scheme:dark]" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
            <select className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
              <option value="Servicios">Servicios</option>
              <option value="Impuestos">Impuestos</option>
              <option value="Supermercado">Supermercado</option>
              <option value="Vivienda">Vivienda</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onCancelar} className="flex-1 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors shadow-md">Guardar</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};