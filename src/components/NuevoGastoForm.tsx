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
    // Animamos el fondo oscuro
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-end sm:items-center z-50"
    >
      {/* Animamos la cajita blanca con efecto rebote */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Agregar nuevo gasto</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">¿Qué hay que pagar?</label>
            <input 
              type="text" 
              placeholder="Ej: Internet, Seguro auto..."
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
              <input 
                type="number" 
                placeholder="Ej: 15000"
                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
              <input 
                type="date" 
                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select 
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
            >
              <option value="Servicios">Servicios</option>
              <option value="Impuestos">Impuestos</option>
              <option value="Supermercado">Supermercado</option>
              <option value="Vivienda">Vivienda</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onCancelar} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-black transition-colors shadow-md">
              Guardar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};