import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, TrendingUp } from 'lucide-react';
import type { Ingreso } from '../types';

interface Props {
  onGuardar: (ingreso: Partial<Ingreso>) => void;
  onCancelar: () => void;
}

const CATEGORIAS = ['Quincena', 'Avance de Obra', 'Sueldo', 'Ventas', 'Changas', 'Otros'];

export const NuevoIngresoForm = ({ onGuardar, onCancelar }: Props) => {
  const [titulo, setTitulo] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('Quincena');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !monto || !categoria || !fecha) return;
    
    onGuardar({
      titulo,
      monto: Number(monto),
      categoria,
      fecha,
      cobrado: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 p-0 sm:p-4">
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 pb-12 sm:pb-6 shadow-2xl border dark:border-gray-800">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-green-600 flex items-center gap-2">
            <TrendingUp strokeWidth={3} /> Ingreso de Dinero
          </h2>
          <button onClick={onCancelar} className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 pl-1">¿Qué se cobró?</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Pago de cliente, Certificado..." className="w-full bg-green-50/50 dark:bg-gray-800 border border-green-200 dark:border-gray-700 text-eco-texto dark:text-white rounded-[16px] p-4 outline-none focus:border-green-500 font-medium transition-all" required autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 pl-1">Monto ($)</label>
              <input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" className="w-full bg-green-50/50 dark:bg-gray-800 border border-green-200 dark:border-gray-700 text-green-700 dark:text-green-400 rounded-[16px] p-4 outline-none focus:border-green-500 font-black text-lg transition-all" required min="1" step="any" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 pl-1">Fecha</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full bg-green-50/50 dark:bg-gray-800 border border-green-200 dark:border-gray-700 text-eco-texto dark:text-white rounded-[16px] p-4 outline-none focus:border-green-500 font-medium transition-all" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 pl-1">Categoría</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map(cat => (
                <button key={cat} type="button" onClick={() => setCategoria(cat)} className={`py-2 px-3 rounded-xl text-[11px] font-bold transition-all border ${categoria === cat ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full mt-2 bg-green-600 text-white font-black py-4 rounded-[16px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-2">
            <Save size={24} strokeWidth={2.5} /> Guardar Ingreso
          </button>
        </form>

      </motion.div>
    </div>
  );
};