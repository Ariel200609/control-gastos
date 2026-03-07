import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, Circle, ListTodo } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Nota, TipoNota } from '../types';

export const Notas = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [nuevaNota, setNuevaNota] = useState('');
  const [filtroActivo, setFiltroActivo] = useState<TipoNota>('dia');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchNotas();
  }, []);

  const fetchNotas = async () => {
    const { data, error } = await supabase.from('notas').select('*').order('created_at', { ascending: false });
    if (!error && data) setNotas(data as Nota[]);
    setCargando(false);
  };

  const agregarNota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaNota.trim()) return;
    
    const texto = nuevaNota.trim();
    setNuevaNota('');

    const { data, error } = await supabase.from('notas').insert([{ 
      texto, 
      tipo: filtroActivo,
      completada: false 
    }]).select();

    if (!error && data) {
      setNotas([data[0] as Nota, ...notas]);
    } else {
      toast.error('Error al guardar la nota');
    }
  };

  const toggleNota = async (id: string, completada: boolean) => {
    setNotas(actuales => actuales.map(n => n.id === id ? { ...n, completada: !completada } : n));
    await supabase.from('notas').update({ completada: !completada }).eq('id', id);
  };

  const borrarNota = async (id: string) => {
    setNotas(actuales => actuales.filter(n => n.id !== id));
    await supabase.from('notas').delete().eq('id', id);
  };

  const notasFiltradas = notas.filter(n => n.tipo === filtroActivo);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-10">
      
      {/* PESTAÑAS (TABS) */}
      <div className="flex bg-gray-200/50 dark:bg-gray-800/50 p-1 rounded-2xl mb-6">
        {(['dia', 'semana', 'mes'] as TipoNota[]).map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltroActivo(tipo)}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${filtroActivo === tipo ? 'bg-white dark:bg-gray-900 text-eco-bosque dark:text-eco-menta shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {tipo === 'dia' ? 'Para Hoy' : tipo === 'semana' ? 'Esta Semana' : 'Este Mes'}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100/50 dark:border-gray-800 mb-6">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center">
            <ListTodo size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-lg font-black text-eco-texto dark:text-white leading-tight">Tareas y Metas</h2>
            <p className="text-xs text-gray-400 font-medium">Que no se te pase nada por alto</p>
          </div>
        </div>

        {/* INPUT PARA AGREGAR */}
        <form onSubmit={agregarNota} className="flex gap-2 mb-6">
          <input type="text" value={nuevaNota} onChange={(e) => setNuevaNota(e.target.value)} placeholder={`Agregar a ${filtroActivo === 'dia' ? 'hoy' : filtroActivo === 'semana' ? 'la semana' : 'el mes'}...`} className="flex-1 bg-eco-fondo dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[16px] p-3 outline-none focus:border-blue-500 dark:text-white font-medium transition-all text-sm" />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-[16px] transition-all shadow-md flex items-center justify-center">
            <Plus size={20} strokeWidth={3} />
          </button>
        </form>

        {/* LISTA DE NOTAS */}
        {cargando ? (
          <p className="text-center text-gray-400 py-4 text-sm font-bold animate-pulse">Cargando notas...</p>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence mode='popLayout'>
              {notasFiltradas.length === 0 ? (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm font-bold text-gray-400 py-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                  Todo al día. No hay tareas pendientes. ☕
                </motion.p>
              ) : (
                notasFiltradas.map(nota => (
                  <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={nota.id} className={`flex items-center justify-between p-3 rounded-[16px] border transition-all ${nota.completada ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'}`}>
                    
                    <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleNota(nota.id, nota.completada)}>
                      <button className={`flex-shrink-0 transition-colors ${nota.completada ? 'text-eco-menta' : 'text-gray-300 dark:text-gray-600'}`}>
                        {nota.completada ? <Check size={22} strokeWidth={3} /> : <Circle size={22} strokeWidth={2.5} />}
                      </button>
                      <span className={`font-semibold text-sm transition-all ${nota.completada ? 'text-gray-400 line-through decoration-2' : 'text-eco-texto dark:text-gray-200'}`}>
                        {nota.texto}
                      </span>
                    </div>

                    <button onClick={() => borrarNota(nota.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                      <Trash2 size={18} />
                    </button>

                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};