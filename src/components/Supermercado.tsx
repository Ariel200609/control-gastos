import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface Props {
  onCompraTerminada: (monto: number, detalles: string) => void;
}

export const Supermercado = ({ onCompraTerminada }: Props) => {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [nuevoArticulo, setNuevoArticulo] = useState('');
  const [cargando, setCargando] = useState(true);
  
  // NUEVOS ESTADOS PARA REEMPLAZAR LA ALERTA FEA
  const [mostrarModal, setMostrarModal] = useState(false);
  const [montoInput, setMontoInput] = useState('');

  useEffect(() => { fetchArticulos(); }, []);

  const fetchArticulos = async () => {
    const { data } = await supabase.from('lista_compras').select('*').order('nombre');
    if (data) setArticulos(data);
    setCargando(false);
  };

  const agregar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoArticulo.trim()) return;
    const nombre = nuevoArticulo.trim();
    setNuevoArticulo('');

    const { data, error } = await supabase.from('lista_compras').insert([{ nombre }]).select();
    if (!error && data) setArticulos([...articulos, data[0]]);
  };

  const toggle = async (id: string, comprado: boolean) => {
    setArticulos(arts => arts.map(a => a.id === id ? { ...a, comprado: !comprado } : a));
    await supabase.from('lista_compras').update({ comprado: !comprado }).eq('id', id);
  };

  const eliminar = async (id: string) => {
    setArticulos(arts => arts.filter(a => a.id !== id));
    await supabase.from('lista_compras').delete().eq('id', id);
  };

  // En vez del "prompt", ahora abrimos nuestro modal hermoso
  const abrirModalPago = () => {
    if (articulos.length === 0) return toast.error('La lista está vacía');
    setMontoInput('');
    setMostrarModal(true);
  };

  // Esta función se ejecuta cuando le das "Confirmar" adentro de nuestro modal
  const confirmarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    const monto = Number(montoInput);
    if (isNaN(monto) || monto <= 0) return toast.error('Monto inválido');

    // Armamos el ticket para el historial
    const comprados = articulos.filter(a => a.comprado).map(a => a.nombre).join(', ');
    const faltantes = articulos.filter(a => !a.comprado).map(a => a.nombre).join(', ');
    
    let detalles = 'Ticket: ';
    if (comprados) detalles += comprados + '. ';
    if (faltantes) detalles += '(Faltó: ' + faltantes + ')';

    // Vaciamos la lista actual
    const ids = articulos.map(a => a.id);
    await supabase.from('lista_compras').delete().in('id', ids);

    setMostrarModal(false);
    onCompraTerminada(monto, detalles);
  };

  if (cargando) return <p className="text-center text-gray-500 mt-10 animate-pulse">Cargando changuito...</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
        <form onSubmit={agregar} className="flex gap-2 mb-6">
          <input type="text" value={nuevoArticulo} onChange={(e) => setNuevoArticulo(e.target.value)} placeholder="Ej: Yerba, Tomates..." className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:border-blue-500 dark:text-white transition-all" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl font-bold transition-all shadow-md">+</button>
        </form>

        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {articulos.map(art => (
              <motion.div key={art.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, scale: 0.9 }} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${art.comprado ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggle(art.id, art.comprado)}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${art.comprado ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-500'}`}>
                    {art.comprado && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`font-medium transition-all ${art.comprado ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'}`}>{art.nombre}</span>
                </div>
                <button onClick={() => eliminar(art.id)} className="text-gray-300 hover:text-red-500 p-2">🗑️</button>
              </motion.div>
            ))}
          </AnimatePresence>
          {articulos.length === 0 && <p className="text-center text-sm text-gray-400 py-4">Agregá cosas para no olvidarte.</p>}
        </div>
      </div>

      {articulos.length > 0 && (
        <motion.button initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={abrirModalPago} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-lg flex justify-center items-center gap-2">
          <span>💳</span> Pagar y Registrar Gasto
        </motion.button>
      )}

      {/* --- EL NUEVO MODAL PREMIUM --- */}
      <AnimatePresence>
        {mostrarModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center border dark:border-gray-800">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🛒</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Total del ticket</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">¿Cuánto pagaste en la caja?</p>
              
              <form onSubmit={confirmarPago}>
                <input 
                  type="number" 
                  placeholder="Ej: 45000" 
                  value={montoInput}
                  onChange={(e) => setMontoInput(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500 mb-6 text-center text-2xl font-black" 
                  autoFocus
                  required 
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setMostrarModal(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30">Confirmar</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ------------------------------ */}

    </motion.div>
  );
};