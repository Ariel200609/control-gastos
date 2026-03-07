import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Download } from 'lucide-react';

import { Login } from './components/Auth';
import { Header } from './components/Header';
import { DashboardResumen } from './components/DashboardResumen';
import { GastoCard } from './components/GastoCard';
import { NuevoGastoForm } from './components/NuevoGastoForm';
import { Supermercado } from './components/Supermercado';
import { NavegacionInferior } from './components/NavegacionInferior';
import { MenuLateral } from './components/MenuLateral';
import { ModalEliminar } from './components/ModalEliminar';
import { Graficos } from './components/Graficos';
import { ModalInvitacion } from './components/ModalInvitacion';
import { ModalPresupuesto } from './components/ModalPresupuesto';
import { Notas } from './components/Notas'; // NUEVO

import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Gasto } from './types';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Agregamos 'notas' a las vistas posibles
  const [vistaActual, setVistaActual] = useState<'inicio' | 'historial' | 'super' | 'graficos' | 'notas'>('inicio');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [gastoABorrar, setGastoABorrar] = useState<string | null>(null);
  const [gastoAEditar, setGastoAEditar] = useState<Gasto | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarInvitacion, setMostrarInvitacion] = useState(false);
  
  const [mostrarModalPresupuesto, setMostrarModalPresupuesto] = useState(false);
  const [limitePresupuesto, setLimitePresupuesto] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecoHogar_presupuesto');
      return saved ? Number(saved) : 0;
    }
    return 0;
  });
  
  const [mesFiltro, setMesFiltro] = useState(new Date().getMonth() + 1);
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pagado' | 'pendiente'>('todos');
  const [busqueda, setBusqueda] = useState('');

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
    if (isDarkMode) { root.classList.add('dark'); localStorage.setItem('theme', 'dark'); } 
    else { root.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [isDarkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) fetchGastos(); }, [session]);

  const fetchGastos = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase.from('gastos').select('*').order('fechaVencimiento', { ascending: true });
      if (error) throw error;
      if (data) setGastos(data as Gasto[]);
    } catch (error) { toast.error('Error al cargar'); } finally { setCargando(false); }
  };

  const guardarGasto = async (gastoGuardado: Gasto) => {
    try {
      if (gastoAEditar) {
        const { error } = await supabase.from('gastos').update({
          titulo: gastoGuardado.titulo,
          monto: gastoGuardado.monto,
          categoria: gastoGuardado.categoria,
          fechaVencimiento: gastoGuardado.fechaVencimiento,
          es_fijo: gastoGuardado.es_fijo
        }).eq('id', gastoAEditar.id);
        
        if (error) throw error;
        setGastos(gastos.map(g => g.id === gastoAEditar.id ? { ...g, ...gastoGuardado } : g));
        toast.success('Gasto actualizado');
      } else {
        const { data, error } = await supabase.from('gastos').insert([{
          titulo: gastoGuardado.titulo, 
          monto: gastoGuardado.monto, 
          categoria: gastoGuardado.categoria,
          fechaVencimiento: gastoGuardado.fechaVencimiento, 
          estado: 'pendiente',
          es_fijo: gastoGuardado.es_fijo
        }]).select();
        
        if (error) throw error;
        if (data) { setGastos([...gastos, data[0] as Gasto]); toast.success('Gasto guardado'); }
      }
      setMostrarFormulario(false);
      setGastoAEditar(null);
    } catch (error) { toast.error('Error al guardar'); }
  };

  const handleCompraTerminada = async (monto: number, detalles: string) => {
    const fechaHoy = new Date().toISOString().split('T')[0];
    try {
      const { data, error } = await supabase.from('gastos').insert([{
        titulo: 'Compra de Supermercado', monto: monto, categoria: 'Supermercado',
        fechaVencimiento: fechaHoy, estado: 'pagado', detalles: detalles
      }]).select();
      if (error) throw error;
      if (data) { setGastos([...gastos, data[0] as Gasto]); setVistaActual('inicio'); toast.success('¡Compra registrada!'); }
    } catch (error) { toast.error('Error al guardar el ticket'); }
  };

  const toggleGasto = async (id: string) => {
    const gasto = gastos.find(g => g.id === id);
    if (!gasto) return;
    const nuevo = gasto.estado === 'pendiente' ? 'pagado' : 'pendiente';
    setGastos(actuales => actuales.map(g => g.id === id ? { ...g, estado: nuevo } : g));
    await supabase.from('gastos').update({ estado: nuevo }).eq('id', id);
  };

  const confirmarEliminacion = async () => {
    if (!gastoABorrar) return;
    const id = gastoABorrar;
    setGastoABorrar(null);
    setGastos(actuales => actuales.filter(g => g.id !== id));
    await supabase.from('gastos').delete().eq('id', id);
    toast.success('Eliminado');
  };

  const guardarPresupuesto = (nuevoLimite: number) => {
    setLimitePresupuesto(nuevoLimite);
    localStorage.setItem('ecoHogar_presupuesto', nuevoLimite.toString());
    setMostrarModalPresupuesto(false);
    toast.success('Presupuesto actualizado 🎯');
  };

  const mesActual = new Date().getMonth() + 1;
  const anioActual = new Date().getFullYear();
  
  const gastosDelMes = gastos.filter(g => {
    const [year, month] = g.fechaVencimiento.split('-');
    const coincideFecha = vistaActual === 'inicio' || vistaActual === 'graficos'
      ? parseInt(month) === mesActual && parseInt(year) === anioActual
      : parseInt(month) === mesFiltro && parseInt(year) === anioFiltro;
    
    if (!coincideFecha) return false;
    if (vistaActual === 'historial') {
      if (filtroEstado !== 'todos' && g.estado !== filtroEstado) return false;
      if (busqueda.trim() && !g.titulo.toLowerCase().includes(busqueda.toLowerCase())) return false;
    }
    return true;
  });

  const totalMensual = gastosDelMes.reduce((total, gasto) => total + gasto.monto, 0);
  const totalPagado = gastosDelMes.filter(g => g.estado === 'pagado').reduce((total, gasto) => total + gasto.monto, 0);
  const totalPendiente = totalMensual - totalPagado;

  const exportarAExcel = () => {
    if (gastosDelMes.length === 0) { toast.error('No hay gastos para exportar este mes'); return; }
    let csvContent = "Fecha Vencimiento,Título,Categoría,Monto,Estado,Detalles\n";
    gastosDelMes.forEach(gasto => {
      const titulo = `"${gasto.titulo.replace(/"/g, '""')}"`;
      const detalles = gasto.detalles ? `"${gasto.detalles.replace(/"/g, '""')}"` : '""';
      const estado = gasto.estado === 'pagado' ? 'Pagado' : 'Pendiente';
      csvContent += `${gasto.fechaVencimiento},${titulo},${gasto.categoria},${gasto.monto},${estado},${detalles}\n`;
    });
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `EcoHogar_${MESES[mesFiltro-1]}_${anioFiltro}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('¡Archivo Excel descargado! 📊');
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  if (!session) return <Login />;
  if (cargando) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500 animate-pulse font-bold">Cargando...</p></div>;

  return (
    <div className="min-h-screen p-4 pt-[env(safe-area-inset-top)] font-sans selection:bg-eco-menta/30 transition-colors duration-300">
      <Toaster position="top-center" />

      <div className="max-w-md mx-auto pt-2 pb-32">
        <Header vistaActual={vistaActual === 'graficos' ? 'inicio' : vistaActual} session={session} onOpenMenu={() => setMenuAbierto(true)} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />

        <motion.div variants={containerVariants} initial="hidden" animate="show" key={vistaActual}>
          {vistaActual === 'super' && <Supermercado onCompraTerminada={handleCompraTerminada} />}
          {vistaActual === 'graficos' && <Graficos gastos={gastos} mesActual={mesActual} anioActual={anioActual} />}
          
          {/* RENDERIZADO DE NOTAS */}
          {vistaActual === 'notas' && <Notas />}

          {(vistaActual === 'inicio' || vistaActual === 'historial') && (
            <>
              {vistaActual === 'historial' && (
                <motion.div variants={itemVariants} className="flex flex-col gap-3 mb-6">
                  <div className="flex gap-2">
                    <select value={mesFiltro} onChange={(e) => setMesFiltro(Number(e.target.value))} className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-eco-texto dark:text-white rounded-[16px] p-3 shadow-sm font-bold outline-none">
                      {MESES.map((mes, index) => <option key={mes} value={index + 1}>{mes}</option>)}
                    </select>
                    <select value={anioFiltro} onChange={(e) => setAnioFiltro(Number(e.target.value))} className="w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-eco-texto dark:text-white rounded-[16px] p-3 shadow-sm font-bold outline-none">
                      {[anioActual - 1, anioActual, anioActual + 1].map(anio => <option key={anio} value={anio}>{anio}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="🔍 Buscar gasto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-eco-texto dark:text-white rounded-[16px] p-3 shadow-sm font-medium outline-none focus:border-eco-bosque" />
                    <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as any)} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-eco-texto dark:text-white rounded-[16px] p-3 shadow-sm font-bold outline-none focus:border-eco-bosque">
                      <option value="todos">Todos</option><option value="pendiente">Pendientes</option><option value="pagado">Pagados</option>
                    </select>
                  </div>
                  <div className="flex justify-end mt-1">
                    <button onClick={exportarAExcel} className="flex items-center gap-2 text-sm font-bold text-eco-bosque dark:text-eco-menta bg-eco-bosque/10 dark:bg-eco-menta/10 px-4 py-2.5 rounded-[12px] hover:bg-eco-bosque/20 dark:hover:bg-eco-menta/20 transition-colors">
                      <Download size={18} strokeWidth={2.5} /> Descargar Mes
                    </button>
                  </div>
                </motion.div>
              )}

              <DashboardResumen 
                totalPendiente={totalPendiente} 
                totalMensual={totalMensual} 
                totalPagado={totalPagado} 
                limitePresupuesto={limitePresupuesto} 
                onEditPresupuesto={() => setMostrarModalPresupuesto(true)}
                variantes={itemVariants} 
              />

              <motion.main variants={itemVariants}>
                <div className="flex justify-between items-center mb-4 px-1">
                  <h2 className="text-lg font-black text-eco-texto dark:text-gray-200">Obligaciones</h2>
                  <span className="text-sm font-bold text-gray-500 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">{gastosDelMes.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {gastosDelMes.length === 0 ? (
                    <div className="text-center mt-8 p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[24px]">
                      <p className="text-gray-400 font-bold mb-2">No se encontraron gastos.</p><p className="text-4xl">🍃</p>
                    </div>
                  ) : (
                    <AnimatePresence mode='popLayout'>
                      {gastosDelMes.map((gasto) => (
                        <GastoCard 
                          key={gasto.id} 
                          gasto={gasto} 
                          onToggle={() => toggleGasto(gasto.id)} 
                          onDelete={() => setGastoABorrar(gasto.id)}
                          onEdit={() => { setGastoAEditar(gasto); setMostrarFormulario(true); }}
                        />
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </motion.main>
            </>
          )}
        </motion.div>
      </div>

      {(vistaActual === 'inicio' || vistaActual === 'historial') && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }} onClick={() => { setGastoAEditar(null); setMostrarFormulario(true); }} className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-tr from-eco-bosque to-[#40916c] text-white rounded-full shadow-[0_8px_25px_rgba(45,106,79,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40">
          <Plus size={32} strokeWidth={2.5} />
        </motion.button>
      )}

      <NavegacionInferior vistaActual={vistaActual} setVistaActual={setVistaActual} />

      {session && <MenuLateral abierto={menuAbierto} onClose={() => setMenuAbierto(false)} session={session} onCerrarSesion={async () => await supabase.auth.signOut()} onAbrirGraficos={() => setVistaActual('graficos')} onAbrirInvitacion={() => setMostrarInvitacion(true)} />}

      <ModalInvitacion isOpen={mostrarInvitacion} onClose={() => setMostrarInvitacion(false)} nombreHogar={session?.user.user_metadata?.hogar || 'Error'} />

      <ModalPresupuesto isOpen={mostrarModalPresupuesto} onClose={() => setMostrarModalPresupuesto(false)} limiteActual={limitePresupuesto} onSave={guardarPresupuesto} />

      <AnimatePresence>
        {mostrarFormulario && (
          <NuevoGastoForm 
            gastoAEditar={gastoAEditar}
            onGuardar={guardarGasto} 
            onCancelar={() => { setMostrarFormulario(false); setGastoAEditar(null); }} 
          />
        )}
      </AnimatePresence>

      <ModalEliminar isOpen={gastoABorrar !== null} onClose={() => setGastoABorrar(null)} onConfirm={confirmarEliminacion} />
    </div>
  );
}

export default App;