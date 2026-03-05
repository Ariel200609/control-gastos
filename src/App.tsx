import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { GastoCard } from './components/GastoCard';
import { NuevoGastoForm } from './components/NuevoGastoForm';
import { Login } from './components/login';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Gasto } from './types';

// Array de meses para el filtro
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [gastoABorrar, setGastoABorrar] = useState<string | null>(null);

  // --- NUEVOS ESTADOS PARA LA APP MÓVIL ---
  const [vistaActual, setVistaActual] = useState<'inicio' | 'historial'>('inicio');
  const [mesFiltro, setMesFiltro] = useState(new Date().getMonth() + 1); // 1 a 12
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchGastos();
  }, [session]);

  const fetchGastos = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase.from('gastos').select('*').order('fechaVencimiento', { ascending: true });
      if (error) throw error;
      if (data) setGastos(data as Gasto[]);
    } catch (error) {
      toast.error('Error al cargar los gastos');
    } finally {
      setCargando(false);
    }
  };

  const agregarNuevoGasto = async (nuevoGasto: Gasto) => {
    try {
      const { data, error } = await supabase.from('gastos').insert([{
        titulo: nuevoGasto.titulo, monto: nuevoGasto.monto, categoria: nuevoGasto.categoria,
        fechaVencimiento: nuevoGasto.fechaVencimiento, estado: 'pendiente'
      }]).select();

      if (error) throw error;
      if (data) {
        setGastos([...gastos, data[0] as Gasto]);
        setMostrarFormulario(false);
        toast.success('Gasto guardado con éxito');
      }
    } catch (error) {
      toast.error('Hubo un error al guardar el gasto.');
    }
  };

  const toggleGasto = async (id: string) => {
    const gastoActual = gastos.find(g => g.id === id);
    if (!gastoActual) return;
    const nuevoEstado = gastoActual.estado === 'pendiente' ? 'pagado' : 'pendiente';
    setGastos(gastosActuales => gastosActuales.map(g => g.id === id ? { ...g, estado: nuevoEstado } : g));
    try {
      const { error } = await supabase.from('gastos').update({ estado: nuevoEstado }).eq('id', id);
      if (error) throw error;
      toast.success(nuevoEstado === 'pagado' ? '¡Pagado!' : 'Pendiente', { icon: nuevoEstado === 'pagado' ? '✅' : '⏳' });
    } catch (error) {
      toast.error('Error al actualizar');
      fetchGastos();
    }
  };

  const confirmarEliminacion = async () => {
    if (!gastoABorrar) return;
    const id = gastoABorrar;
    setGastoABorrar(null);
    setGastos(gastosActuales => gastosActuales.filter(g => g.id !== id));
    try {
      const { error } = await supabase.from('gastos').delete().eq('id', id);
      if (error) throw error;
      toast.success('Gasto eliminado', { icon: '🗑️' });
    } catch (error) {
      toast.error('Error al eliminar');
      fetchGastos();
    }
  };

  const handleCerrarSesion = async () => await supabase.auth.signOut();

  // --- LÓGICA DE FILTRADO ---
  // Filtramos los gastos según la pestaña actual
  const mesActual = new Date().getMonth() + 1;
  const anioActual = new Date().getFullYear();

  const gastosDelMes = gastos.filter(g => {
    const [year, month] = g.fechaVencimiento.split('-');
    // Si estamos en 'inicio', mostramos el mes actual. Si estamos en 'historial', usamos los filtros.
    if (vistaActual === 'inicio') {
      return parseInt(month) === mesActual && parseInt(year) === anioActual;
    } else {
      return parseInt(month) === mesFiltro && parseInt(year) === anioFiltro;
    }
  });

  const totalMensual = gastosDelMes.reduce((total, gasto) => total + gasto.monto, 0);
  const totalPagado = gastosDelMes.filter(g => g.estado === 'pagado').reduce((total, gasto) => total + gasto.monto, 0);
  const totalPendiente = totalMensual - totalPagado;

  // --- VARIANTES DE ANIMACIÓN ---
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  if (!session) return <Login />;
  if (cargando) return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center"><p className="text-gray-500 font-bold animate-pulse">Cargando tu panel...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 transition-colors duration-300">
      <Toaster position="top-center" />

      {/* Contenedor principal con padding bottom para que no tape la barra de navegación */}
      <div className="max-w-md mx-auto pt-6 px-4 pb-32">
        
        <header className="mb-6 flex justify-between items-start">
          <div>
            <p className="text-blue-600 dark:text-blue-400 font-bold tracking-wide uppercase text-xs mb-1">
              {vistaActual === 'inicio' ? 'Resumen del Mes' : 'Historial de Gastos'}
            </p>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {vistaActual === 'inicio' ? `Hogar ${session.user.user_metadata?.hogar || ''}` : 'Tu Archivo'}
            </h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              {isDarkMode ? '🌞' : '🌙'}
            </button>
            <button onClick={handleCerrarSesion} className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-all">
              Salir
            </button>
          </div>
        </header>

        <motion.div variants={containerVariants} initial="hidden" animate="show" key={vistaActual}>
          
          {/* SI ESTAMOS EN HISTORIAL: MOSTRAR LOS FILTROS */}
          {vistaActual === 'historial' && (
            <motion.div variants={itemVariants} className="flex gap-2 mb-6">
              <select 
                value={mesFiltro} 
                onChange={(e) => setMesFiltro(Number(e.target.value))}
                className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500 transition-colors shadow-sm"
              >
                {MESES.map((mes, index) => (
                  <option key={mes} value={index + 1}>{mes}</option>
                ))}
              </select>
              <select 
                value={anioFiltro} 
                onChange={(e) => setAnioFiltro(Number(e.target.value))}
                className="w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl p-3 outline-none focus:border-blue-500 transition-colors shadow-sm"
              >
                {[anioActual - 1, anioActual, anioActual + 1].map(anio => (
                  <option key={anio} value={anio}>{anio}</option>
                ))}
              </select>
            </motion.div>
          )}

          {/* DASHBOARD DE NUMEROS (Se adapta al mes seleccionado) */}
          <motion.section variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8 transition-colors duration-300">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Pendiente de Pago</h2>
              <p className="text-4xl font-black text-gray-900 dark:text-white">${totalPendiente.toLocaleString('es-AR')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Presupuesto</p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">${totalMensual.toLocaleString('es-AR')}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-900/30">
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Pagado</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-500">${totalPagado.toLocaleString('es-AR')}</p>
              </div>
            </div>
          </motion.section>

          {/* LISTA DE GASTOS */}
          <motion.main variants={itemVariants}>
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Obligaciones del mes</h2>
              <span className="text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-full">{gastosDelMes.length}</span>
            </div>
            
            <div className="flex flex-col gap-2">
              {gastosDelMes.length === 0 ? (
                <div className="text-center mt-8 p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                  <p className="text-gray-400 dark:text-gray-500 font-medium mb-2">No hay gastos para este período.</p>
                  <p className="text-4xl">🍃</p>
                </div>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {gastosDelMes.map((gasto) => (
                    <GastoCard key={gasto.id} gasto={gasto} onToggle={() => toggleGasto(gasto.id)} onDelete={() => setGastoABorrar(gasto.id)} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.main>
        </motion.div>
      </div>

      {/* BOTÓN FLOTANTE (+) REPOSICIONADO MÁS ARRIBA */}
      <motion.button 
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }} 
        onClick={() => setMostrarFormulario(true)} 
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center text-3xl pb-1 hover:bg-blue-700 hover:scale-105 transition-all z-40 active:scale-95"
      >
        +
      </motion.button>

      {/* --- BARRA DE NAVEGACIÓN INFERIOR TIPO APP --- */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-30">
        <nav className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex justify-around items-center p-2 pb-6 sm:pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-none">
          <button 
            onClick={() => setVistaActual('inicio')}
            className={`flex flex-col items-center p-2 w-20 transition-colors ${vistaActual === 'inicio' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'}`}
          >
            <span className="text-2xl mb-1">🏠</span>
            <span className="text-[10px] font-bold tracking-wide">INICIO</span>
          </button>
          
          <button 
            onClick={() => setVistaActual('historial')}
            className={`flex flex-col items-center p-2 w-20 transition-colors ${vistaActual === 'historial' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'}`}
          >
            <span className="text-2xl mb-1">📅</span>
            <span className="text-[10px] font-bold tracking-wide">HISTORIAL</span>
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {mostrarFormulario && <NuevoGastoForm onGuardar={agregarNuevoGasto} onCancelar={() => setMostrarFormulario(false)} />}
        {gastoABorrar && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center border dark:border-gray-800">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🗑️</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¿Eliminar gasto?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button onClick={() => setGastoABorrar(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
                <button onClick={confirmarEliminacion} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-md shadow-red-500/30">Eliminar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;