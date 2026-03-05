import { useState } from 'react';
import type { Categoria, Gasto } from '../types';

interface Props {
  onGuardar: (nuevoGasto: Gasto) => void;
  onCancelar: () => void;
}

export const NuevoGastoForm = ({ onGuardar, onCancelar }: Props) => {
  // Estados para guardar lo que el usuario escribe en el formulario
  const [titulo, setTitulo] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('Servicios');

  // Función que se ejecuta al tocar "Guardar"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    if (!titulo || !monto) return; // Validación simple

    // Armamos el objeto Gasto nuevo
    const nuevo: Gasto = {
      id: crypto.randomUUID(), // Esto genera un ID único automático
      titulo: titulo,
      monto: Number(monto),
      categoria: categoria,
      fechaVencimiento: new Date(), // Por ahora le ponemos la fecha de hoy
      estado: 'pendiente'
    };

    onGuardar(nuevo);
  };

  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-end sm:items-center z-50">
      {/* Contenedor blanco del formulario */}
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-fade-in-up">
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
            <button 
              type="button" 
              onClick={onCancelar}
              className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-black transition-colors shadow-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};