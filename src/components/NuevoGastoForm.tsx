import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Type, Repeat, CreditCard } from 'lucide-react';
import type { Gasto, Categoria } from '../types';

interface Props {
  gastos: Gasto[];
  gastoAEditar?: Gasto | null;
  categorias: Categoria[];
  onGuardar: (gasto: any) => void;
  onCancelar: () => void;
}

// Categorías de salvavidas por si la base de datos está vacía
const CATEGORIAS_DEFAULT = ['Supermercado', 'Servicios', 'Transporte', 'Ocio', 'Salud', 'Hogar', 'Educación', 'Otros'];

export const NuevoGastoForm = ({ gastoAEditar, categorias, onGuardar, onCancelar }: Props) => {
  
  // Si tenemos categorías en la DB las usamos, sino usamos las de por defecto
  const listaCategorias = categorias.length > 0 ? categorias.map(c => c.nombre) : CATEGORIAS_DEFAULT;

  const [titulo, setTitulo] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState(listaCategorias[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date().toISOString().split('T')[0]);
  
  const [esFijo, setEsFijo] = useState(false);
  const [enCuotas, setEnCuotas] = useState(false);
  const [cuotasTotales, setCuotasTotales] = useState(1);

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
    if (!titulo || !monto || !categoria) return;

    onGuardar({
      titulo,
      monto: Number(monto),
      categoria,
      fechaVencimiento,
      es_fijo: esFijo,
      cuotas_totales: enCuotas ? Number(cuotasTotales) : 1
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white dark:bg-[#121212] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>

        <div className="flex justify-between items-center p-6 pt-3 sm:pt-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <h2 className="text-xl font-black font-display text-gray-800 dark:text-gray-100">
            {gastoAEditar ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h2>
          <button onClick={onCancelar} className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-all hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-90">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="gasto-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* TÍTULO */}
            <div>
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-2 block">¿Qué pagaste?</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Type size={18} /></div>
                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Luz, Internet, Súper..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-eco-bosque/20 focus:border-eco-bosque transition-all font-medium" required />
              </div>
            </div>

            {/* MONTO Y VENCIMIENTO */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-2 block">Monto</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><DollarSign size={18} /></div>
                  <input type="number" inputMode="decimal" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" step="0.01" min="0" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl pl-9 pr-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-eco-bosque/20 focus:border-eco-bosque transition-all font-black font-display text-lg" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-2 block">Vencimiento</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Calendar size={16} /></div>
                  <input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl pl-9 pr-3 py-3.5 focus:outline-none focus:ring-2 focus:ring-eco-bosque/20 focus:border-eco-bosque transition-all font-medium" required />
                </div>
              </div>
            </div>

            {/* LOS CUADRADITOS DE CATEGORÍA (Grilla de 3 columnas) */}
            <div>
              <label className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-2 block">Categoría</label>
              <div className="grid grid-cols-3 gap-2">
                {listaCategorias.map((catNombre, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCategoria(catNombre)}
                    className={`py-2.5 px-1 rounded-xl text-[11px] font-bold border-2 transition-all truncate ${
                      categoria === catNombre
                        ? 'bg-eco-bosque text-white border-eco-bosque shadow-md shadow-eco-bosque/20 scale-[1.02]'
                        : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {catNombre}
                  </button>
                ))}
              </div>
            </div>

            {/* ZONA DE SWITCHES: FIJO vs CUOTAS */}
            {!gastoAEditar && (
              <div className="mt-2 glass-card shadow-premium rounded-2xl p-4 flex flex-col gap-4">
                
                {/* GASTO FIJO */}
                <label className={`flex items-center justify-between cursor-pointer ${enCuotas ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-all ${esFijo ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 scale-105' : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                      <Repeat size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">Gasto Fijo Mensual</span>
                      <span className="text-[10px] text-gray-500">Se clona automáticamente cada mes</span>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${esFijo ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${esFijo ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                  <input type="checkbox" checked={esFijo} onChange={(e) => setEsFijo(e.target.checked)} className="hidden" />
                </label>

                {/* CUOTAS */}
                <label className={`flex items-center justify-between cursor-pointer pt-4 border-t border-gray-200 dark:border-gray-800 ${esFijo ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-all ${enCuotas ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400 scale-105' : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">Pago en Cuotas</span>
                      <span className="text-[10px] text-gray-500">Genera varios meses a la vez</span>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${enCuotas ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${enCuotas ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                  <input type="checkbox" checked={enCuotas} onChange={(e) => setEnCuotas(e.target.checked)} className="hidden" />
                </label>

                {/* INPUT DE CANTIDAD DE CUOTAS */}
                <AnimatePresence>
                  {enCuotas && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-2 flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Cantidad de cuotas:</span>
                        <input type="number" min="2" max="36" value={cuotasTotales} onChange={(e) => setCuotasTotales(Number(e.target.value))} className="w-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-center font-bold font-display outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </div>
            )}
            
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#121212]">
          <button type="submit" form="gasto-form" className="w-full bg-gradient-to-r from-eco-bosque to-[#40916c] hover:from-[#40916c] hover:to-eco-bosque text-white font-black font-display py-4 rounded-2xl transition-all shadow-lg shadow-eco-bosque/20 flex items-center justify-center gap-2 active:scale-[0.98]">
            {gastoAEditar ? 'Guardar Cambios' : enCuotas ? `Generar ${cuotasTotales} Cuotas` : 'Guardar Gasto'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};