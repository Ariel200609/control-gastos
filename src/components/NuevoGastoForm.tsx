import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Repeat } from 'lucide-react';
import type { Gasto, Categoria } from '../types';

interface Props {
  onGuardar: (gasto: Gasto) => void;
  onCancelar: () => void;
  gastoAEditar?: Gasto | null;
}

const CATEGORIAS: Categoria[] = ['Servicios', 'Impuestos', 'Supermercado', 'Vivienda', 'Otros'];

export const NuevoGastoForm = ({ onGuardar, onCancelar, gastoAEditar }: Props) => {
  const [titulo, setTitulo] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('Servicios');
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date().toISOString().split('T')[0]);
  const [esFijo, setEsFijo] = useState(false); // NUEVO ESTADO

  useEffect(() => {
    if (gastoAEditar) {
      setTitulo(gastoAEditar.titulo);
      setMonto(gastoAEditar.monto.toString());
      setCategoria(gastoAEditar.categoria);
      setFechaVencimiento(gastoAEditar.fechaVencimiento);
      setEsFijo(gastoAEditar.es_fijo || false);
    }
  }, [gastoAEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !monto || !categoria || !fechaVencimiento) return;
    
    onGuardar({
      id: gastoAEditar ? gastoAEditar.id : crypto.randomUUID(),
      titulo,
      monto: Number(monto),
      categoria,
      fechaVencimiento,
      estado: gastoAEditar ? gastoAEditar.estado : 'pendiente',
      es_fijo: esFijo // LO ENVIAMOS AL CEREBRO
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 p-0 sm:p-4">
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 pb-12 sm:pb-6 shadow-2xl border dark:border-gray-800">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-eco-texto dark:text-white">
            {gastoAEditar ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h2>
          <button onClick={onCancelar} className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 pl-1">¿Qué hay que pagar?</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Luz, Internet, Expensas..." className="w-full bg-eco-fondo dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-eco-texto dark:text-white rounded-[16px] p-4 outline-none focus:border-eco-bosque font-medium transition-all" required autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 pl-1">Monto ($)</label>
              <input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" className="w-full bg-eco-fondo dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-eco-texto dark:text-white rounded-[16px] p-4 outline-none focus:border-eco-bosque font-black text-lg transition-all" required min="1" step="any" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 pl-1">Vencimiento</label>
              <input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} className="w-full bg-eco-fondo dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-eco-texto dark:text-white rounded-[16px] p-4 outline-none focus:border-eco-bosque font-medium transition-all" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 pl-1">Categoría</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIAS.map(cat => (
                <button key={cat} type="button" onClick={() => setCategoria(cat)} className={`py-3 px-2 rounded-xl text-[11px] font-bold transition-all border ${categoria === cat ? 'bg-eco-bosque text-white border-eco-bosque shadow-md' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* INTERRUPTOR DE GASTO FIJO */}
          <div className="flex items-center justify-between bg-eco-bosque/5 dark:bg-eco-menta/5 border border-eco-bosque/20 dark:border-eco-menta/20 p-4 rounded-[16px] mt-2 cursor-pointer" onClick={() => setEsFijo(!esFijo)}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${esFijo ? 'bg-eco-bosque text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                <Repeat size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-eco-texto dark:text-gray-200 text-sm">Gasto Mensual Fijo</p>
                <p className="text-[10px] text-gray-500 font-medium">Se recordará todos los meses</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${esFijo ? 'bg-eco-bosque' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <motion.div layout className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm ${esFijo ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </div>

          <button type="submit" className="w-full mt-2 bg-eco-bosque text-white font-black py-4 rounded-[16px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-2">
            <Save size={24} strokeWidth={2.5} /> {gastoAEditar ? 'Guardar Cambios' : 'Agregar Gasto'}
          </button>
        </form>

      </motion.div>
    </div>
  );
};