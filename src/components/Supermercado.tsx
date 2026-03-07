import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, ShoppingCart, Check, CreditCard } from 'lucide-react';

interface Props {
  onCompraTerminada: (monto: number, detalles: string) => void;
}

export const Supermercado = ({ onCompraTerminada }: Props) => {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [nuevoArticulo, setNuevoArticulo] = useState('');
  const [cargando, setCargando] = useState(true);
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

  const abrirModalPago = () => {
    if (articulos.length === 0) return toast.error('La lista está vacía');
    setMontoInput('');
    setMostrarModal(true);
  };

  const confirmarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    const monto = Number(montoInput);
    if (isNaN(monto) || monto <= 0) return toast.error('Monto inválido');

    const comprados = articulos.filter(a => a.comprado).map(a => a.nombre).join(', ');
    const faltantes = articulos.filter(a => !a.comprado).map(a => a.nombre).join(', ');
    let detalles = 'Ticket: ';
    if (comprados) detalles += comprados + '. ';
    if (faltantes) detalles += '(Faltó: ' + faltantes + ')';

    const ids = articulos.map(a => a.id);
    await supabase.from('lista_compras').delete().in('id', ids);

    setMostrarModal(false);
    onCompraTerminada(monto, detalles);
  };

  if (cargando) return <p className="text-center text-gray-500 mt-10 animate-pulse font-bold">Cargando changuito...</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100/50 dark:border-gray-800 mb-6 transition-all">
        <form onSubmit={agregar} className="flex gap-2 mb-6">
          <input type="text" value={nuevoArticulo} onChange={(e) => setNuevoArticulo(e.target.value)} placeholder="Ej: Yerba, Tomates..." className="flex-1 bg-eco-fondo dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[16px] p-4 outline-none focus:border-eco-bosque dark:text-white font-medium transition-all" />
          <button type="submit" className="bg-eco-bosque hover:bg-[#1B4332] dark:bg-eco-menta dark:hover:bg-[#52B788] text-white dark:text-eco-texto px-5 rounded-[16px] transition-all shadow-md flex items-center justify-center">
            <Plus size={24} strokeWidth={3} />
          </button>
        </form>

        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {articulos.map(art => (
              <motion.div key={art.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, scale: 0.9 }} className={`flex items-center justify-between p-3 rounded-[16px] border transition-all ${art.comprado ? 'bg-[#74C69D]/10 dark:bg-[#74C69D]/5 border-[#74C69D]/30' : 'bg-eco-fondo dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50'}`}>
                <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggle(art.id, art.comprado)}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${art.comprado ? 'bg-eco-menta border-eco-menta text-eco-texto' : 'border-gray-300 dark:border-gray-500'}`}>
                    {art.comprado && <Check size={14} strokeWidth={4} />}
                  </div>
                  <span className={`font-bold transition-all ${art.comprado ? 'text-gray-400 dark:text-gray-500 line-through decoration-2' : 'text-eco-texto dark:text-gray-200'}`}>{art.nombre}</span>
                </div>
                <button onClick={() => eliminar(art.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {articulos.length === 0 && <p className="text-center text-sm font-bold text-gray-400 py-4">Agregá cosas para no olvidarte.</p>}
        </div>
      </div>

      {articulos.length > 0 && (
        <motion.button initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={abrirModalPago} className="w-full bg-eco-texto dark:bg-white text-white dark:text-eco-texto font-black py-4 rounded-[20px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-lg flex justify-center items-center gap-3">
          <CreditCard size={24} /> Pagar y Registrar Gasto
        </motion.button>
      )}

      {/* MODAL DE PAGO */}
      <AnimatePresence>
        {mostrarModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-[32px] p-8 max-w-xs w-full shadow-2xl text-center border dark:border-gray-800">
              <div className="w-20 h-20 bg-eco-bosque/10 dark:bg-eco-menta/10 text-eco-bosque dark:text-eco-menta rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart size={40} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-black text-eco-texto dark:text-white mb-2">Total del ticket</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-medium">¿Cuánto pagaste en la caja?</p>
              
              <form onSubmit={confirmarPago}>
                <input type="number" placeholder="Ej: 45000" value={montoInput} onChange={(e) => setMontoInput(e.target.value)} className="w-full bg-eco-fondo dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-eco-texto dark:text-white rounded-[16px] p-4 outline-none focus:border-eco-bosque mb-6 text-center text-3xl font-black" autoFocus required min="1" />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setMostrarModal(false)} className="flex-1 py-4 rounded-[16px] font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 rounded-[16px] font-bold text-white bg-eco-bosque hover:bg-[#1B4332] transition-colors shadow-md">Confirmar</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};