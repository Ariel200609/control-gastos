import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import type { Gasto, Categoria } from '../types';

interface Props {
  gastoAEditar?: Gasto | null;
  categorias: Categoria[]; 
  onGuardar: (gasto: Gasto) => void;
  onCancelar: () => void;
}

const CATEGORIAS_POR_DEFECTO = [
  'Supermercado', 'Servicios', 'Vivienda', 
  'Comida', 'Transporte', 'Salud', 'Ocio', 'Otros'
];

export const NuevoGastoForm = ({ gastoAEditar, categorias, onGuardar, onCancelar }: Props) => {
  const [titulo, setTitulo] = useState(gastoAEditar?.titulo || '');
  const [monto, setMonto] = useState(gastoAEditar?.monto?.toString() || '');
  
  // Fusionamos sin duplicar
  const categoriasCombinadas = Array.from(
    new Set([...CATEGORIAS_POR_DEFECTO, ...categorias.map(c => c.nombre)])
  );

  const [categoria, setCategoria] = useState(gastoAEditar?.categoria || categoriasCombinadas[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState(gastoAEditar?.fechaVencimiento || new Date().toISOString().split('T')[0]);
  const [esFijo, setEsFijo] = useState(gastoAEditar?.es_fijo || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !monto || !categoria) return;

    onGuardar({
      id: gastoAEditar?.id || Date.now().toString(),
      titulo,
      monto: Number(monto),
      categoria,
      fechaVencimiento,
      estado: gastoAEditar?.estado || 'pendiente',
      es_fijo: esFijo
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h2 className="text-xl font-black text-eco-texto dark:text-white">
            {gastoAEditar ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h2>
          <button onClick={onCancelar} className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Título</label>
              <input type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Luz, Supermercado..." className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 font-bold outline-none focus:border-red-500 transition-colors text-gray-800 dark:text-gray-200" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Monto ($)</label>
                <input type="number" required min="0" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 font-bold outline-none focus:border-red-500 transition-colors text-gray-800 dark:text-gray-200" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fecha</label>
                <input type="date" required value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 font-bold outline-none focus:border-red-500 transition-colors text-gray-800 dark:text-gray-200" />
              </div>
            </div>

            {/* VOLVIERON LOS CUADRADITOS LINDOS */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Etiqueta</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {categoriasCombinadas.map(nombreCat => (
                  <button
                    key={nombreCat}
                    type="button"
                    onClick={() => setCategoria(nombreCat)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                      categoria === nombreCat
                        ? 'bg-red-500 text-white border-red-500 shadow-md scale-105'
                        : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {nombreCat}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors mt-2">
              <input type="checkbox" checked={esFijo} onChange={(e) => setEsFijo(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500" />
              <div>
                <p className="font-bold text-gray-700 dark:text-gray-200 text-sm">Gasto Fijo Mensual</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Se repetirá automáticamente cada mes</p>
              </div>
            </label>

            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-black p-4 rounded-2xl transition-colors shadow-lg shadow-red-500/30 shrink-0">
              <Save size={20} />
              {gastoAEditar ? 'Guardar Cambios' : 'Registrar Gasto'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};