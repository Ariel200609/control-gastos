import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Download, TrendingUp, TrendingDown } from 'lucide-react';

// Componentes modulares
import { Login } from './components/Auth';
import { Header } from './components/Header';
import { DashboardResumen } from './components/DashboardResumen';
import { GastoCard } from './components/GastoCard';
import { NuevoGastoForm } from './components/NuevoGastoForm';
import { NuevoIngresoForm } from './components/NuevoIngresoForm';
import { Supermercado } from './components/Supermercado';
import { NavegacionInferior } from './components/NavegacionInferior';
import { MenuLateral } from './components/MenuLateral';
import { ModalEliminar } from './components/ModalEliminar';
import { Graficos } from './components/Graficos';
import { ModalInvitacion } from './components/ModalInvitacion';
import { ModalPresupuesto } from './components/ModalPresupuesto';
import { Notas } from './components/Notas';
import { FiltroCategorias } from './components/FiltroCategorias';

import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Gasto, Ingreso } from './types';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function App() {
  const [session, setSession] = useState<Session | null>(null);
  
  // Estados de Datos
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados de UI
  const [vistaActual, setVistaActual] = useState<'inicio' | 'historial' | 'super' | 'graficos' | 'notas'>('inicio');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioIngreso, setMostrarFormularioIngreso] = useState(false);
  const [menuFabAbierto, setMenuFabAbierto] = useState(false);
  
  const [gastoABorrar, setGastoABorrar] = useState<string | null>(null);
  const [gastoAEditar, setGastoAEditar] = useState<Gasto | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarInvitacion, setMostrarInvitacion] = useState(false);
  
  const [mostrarModalPresupuesto, setMostrarModalPresupuesto] = useState(false);
  const [limitePresupuesto, setLimitePresupuesto] = useState(() => {
    const saved = localStorage.getItem('ecoHogar_presupuesto');
    return saved ? Number(saved) : 0;
  });
  
  // Estados de Filtros
  const [mesFiltro, setMesFiltro] = useState(new Date().getMonth() + 1);
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pagado' | 'pendiente'>('todos');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = window.localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // --- LÓGICA DE CLONACIÓN DE GASTOS FIJOS ---
  const verificarYClonarGastosFijos = async (gastosCargados: Gasto[]) => {
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = ahora.getFullYear();
    const gastosFijos = gastosCargados.filter(g => g.es_fijo);

    const fijosParaClonar = gastosFijos.filter(fijo => {
      const yaExisteEsteMes = gastosCargados.some(g => 
        g.titulo === fijo.titulo && 
        new Date(g.fechaVencimiento).getMonth() + 1 === mesActual &&
        new Date(g.fechaVencimiento).getFullYear() === anioActual
      );
      return !yaExisteEsteMes;
    });

    if (fijosParaClonar.length > 0) {
      const nuevosGastos = fijosParaClonar.map(f => ({
        titulo: f.titulo, monto: f.monto, categoria: f.categoria,
        es_fijo: true, estado: 'pendiente',
        fechaVencimiento: `${anioActual}-${String(mesActual).padStart(2, '0')}-${f.fechaVencimiento.split('-')[2]}`
      }));
      const { data, error } = await supabase.from('gastos').insert(nuevosGastos).select();
      if (error) console.error("Error al clonar gastos fijos:", error);
      if (!error && data) {
        setGastos(prev => [...prev, ...(data as Gasto[])]);
        toast.success(`Se automatizaron ${data.length} gastos fijos 🔁`);
      }
    }
  };

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

  useEffect(() => {
    if (!session) return;

    fetchData(); // Carga inicial
    
    // --- MAGIA EN TIEMPO REAL (WEBSOCKETS) ---
    const canalSuscripcion = supabase
      .channel('eco-hogar-cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gastos' }, () => {
        fetchData(); // Si alguien toca los gastos, recargamos en silencio
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ingresos' }, () => {
        fetchData(); // Si alguien toca los ingresos, recargamos en silencio
      })
      .subscribe();

    // Lógica de Shortcuts (URL params)
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'nuevo-gasto') setMostrarFormulario(true);
    if (params.get('action') === 'super') setVistaActual('super');

    // Limpieza al desmontar
    return () => {
      supabase.removeChannel(canalSuscripcion);
    };
  }, [session]);

  const fetchData = async () => {
    try {
      setCargando(true);
      const [gastosRes, ingresosRes] = await Promise.all([
        supabase.from('gastos').select('*').order('fechaVencimiento', { ascending: true }),
        supabase.from('ingresos').select('*').order('fecha', { ascending: true })
      ]);

      if (gastosRes.error) throw gastosRes.error;
      if (ingresosRes.error) throw ingresosRes.error;

      if (gastosRes.data) {
        setGastos(gastosRes.data as Gasto[]);
        verificarYClonarGastosFijos(gastosRes.data as Gasto[]);
      }
      if (ingresosRes.data) {
        setIngresos(ingresosRes.data as Ingreso[]);
      }
    } catch (error) { 
      console.error("Error en fetchData:", error);
      toast.error('Error al cargar datos'); 
    } finally { 
      setCargando(false); 
    }
  };

  const guardarGasto = async (gastoGuardado: Gasto) => {
    try {
      if (gastoAEditar) {
        const { error } = await supabase.from('gastos').update({
          titulo: gastoGuardado.titulo, monto: gastoGuardado.monto,
          categoria: gastoGuardado.categoria, fechaVencimiento: gastoGuardado.fechaVencimiento,
          es_fijo: gastoGuardado.es_fijo
        }).eq('id', gastoAEditar.id);
        if (error) throw error;
        // No hace falta actualizar el estado local manualmente si el realtime funciona rápido, 
        // pero lo dejamos para que la UI se sienta instantánea
        setGastos(gastos.map(g => g.id === gastoAEditar.id ? { ...g, ...gastoGuardado } : g));
        toast.success('Gasto actualizado');
      } else {
        const { error } = await supabase.from('gastos').insert([{
          titulo: gastoGuardado.titulo, monto: gastoGuardado.monto, categoria: gastoGuardado.categoria,
          fechaVencimiento: gastoGuardado.fechaVencimiento, estado: 'pendiente', es_fijo: gastoGuardado.es_fijo
        }]);
        if (error) throw error;
        toast.success('Gasto guardado');
      }
      setMostrarFormulario(false);
      setGastoAEditar(null);
    } catch (error) { 
      console.error("Error en guardarGasto:", error);
      toast.error('Error al guardar'); 
    }
  };

  const guardarIngreso = async (ingresoData: Partial<Ingreso>) => {
    try {
      const { error } = await supabase.from('ingresos').insert([ingresoData]);
      if (error) throw error;
      toast.success('Ingreso registrado 💰'); 
      setMostrarFormularioIngreso(false);
    } catch (error) {
      console.error("Error al guardar ingreso:", error);
      toast.error('Error al guardar ingreso');
    }
  };

  const handleCompraTerminada = async (monto: number, detalles: string) => {
    const fechaHoy = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('gastos').insert([{
      titulo: 'Compra de Supermercado', monto: monto, categoria: 'Supermercado',
      fechaVencimiento: fechaHoy, estado: 'pagado', detalles: detalles
    }]);
    if (error) console.error("Error al registrar compra del super:", error);
    else { setVistaActual('inicio'); toast.success('¡Compra registrada!'); }
  };

  const toggleGasto = async (id: string) => {
    const gasto = gastos.find(g => g.id === id);
    if (!gasto) return;
    const nuevo = gasto.estado === 'pendiente' ? 'pagado' : 'pendiente';
    setGastos(actuales => actuales.map(g => g.id === id ? { ...g, estado: nuevo } : g)); // Optimistic update
    const { error } = await supabase.from('gastos').update({ estado: nuevo }).eq('id', id);
    if (error) console.error("Error al cambiar estado:", error);
  };

  const confirmarEliminacion = async () => {
    if (!gastoABorrar) return;
    const id = gastoABorrar;
    setGastoABorrar(null);
    setGastos(actuales => actuales.filter(g => g.id !== id)); // Optimistic update
    const { error } = await supabase.from('gastos').delete().eq('id', id);
    if (error) console.error("Error al eliminar:", error);
    else toast.success('Eliminado');
  };

  // --- LÓGICA DE FILTRADO ---
  const mesActual = new Date().getMonth() + 1;
  const anioActual = new Date().getFullYear();
  
  const gastosFiltrados = gastos.filter(g => {
    const [year, month] = g.fechaVencimiento.split('-');
    const coincideFecha = (vistaActual === 'inicio' || vistaActual === 'graficos')
      ? parseInt(month) === mesActual && parseInt(year) === anioActual
      : parseInt(month) === mesFiltro && parseInt(year) === anioFiltro;
    
    if (!coincideFecha) return false;
    if (vistaActual === 'historial') {
      if (filtroEstado !== 'todos' && g.estado !== filtroEstado) return false;
      if (categoriaActiva !== 'Todos' && g.categoria !== categoriaActiva) return false;
      if (busqueda.trim() && !g.titulo.toLowerCase().includes(busqueda.toLowerCase())) return false;
    }
    return true;
  });

  const ingresosFiltrados = ingresos.filter(i => {
    const [year, month] = i.fecha.split('-');
    const coincideFecha = (vistaActual === 'inicio' || vistaActual === 'graficos')
      ? parseInt(month) === mesActual && parseInt(year) === anioActual
      : parseInt(month) === mesFiltro && parseInt(year) === anioFiltro;
    return coincideFecha;
  });

  const totalMensual = gastosFiltrados.reduce((total, gasto) => total + gasto.monto, 0);
  const totalPagado = gastosFiltrados.filter(g => g.estado === 'pagado').reduce((total, gasto) => total + gasto.monto, 0);
  const totalPendiente = totalMensual - totalPagado;
  
  const totalIngresos = ingresosFiltrados.reduce((total, ingreso) => total + ingreso.monto, 0);

  const exportarAExcel = () => {
    let csvContent = "Fecha Vencimiento,Título,Categoría,Monto,Estado,Detalles\n";
    gastosFiltrados.forEach(g => {
      csvContent += `${g.fechaVencimiento},"${g.titulo}",${g.categoria},${g.monto},${g.estado},"${g.detalles || ''}"\n`;
    });
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `EcoHogar_Gastos_${MESES[mesFiltro-1]}.csv`;
    link.click();
    toast.success('Exportado 📊');
  };

  if (!session) return <Login />;
  if (cargando && gastos.length === 0) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">Cargando EcoHogar...</div>;

  return (
    <div className="min-h-screen p-4 pt-[env(safe-area-inset-top)] font-sans selection:bg-eco-menta/30 transition-colors duration-300 bg-eco-fondo dark:bg-gray-950">
      <Toaster position="top-center" />

      <div className="max-w-md mx-auto pt-2 pb-32">
        <Header vistaActual={vistaActual} session={session} onOpenMenu={() => setMenuAbierto(true)} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={vistaActual}>
          {vistaActual === 'super' && <Supermercado onCompraTerminada={handleCompraTerminada} />}
          {vistaActual === 'graficos' && <Graficos gastos={gastos} ingresos={ingresos} mesActual={mesActual} anioActual={anioActual} />}
          {vistaActual === 'notas' && <Notas />}

          {(vistaActual === 'inicio' || vistaActual === 'historial') && (
            <>
              {vistaActual === 'historial' && (
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex gap-2">
                    <select value={mesFiltro} onChange={(e) => setMesFiltro(Number(e.target.value))} className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 font-bold outline-none">
                      {MESES.map((mes, i) => <option key={mes} value={i + 1}>{mes}</option>)}
                    </select>
                    <select value={anioFiltro} onChange={(e) => setAnioFiltro(Number(e.target.value))} className="w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 font-bold outline-none">
                      {[anioActual - 1, anioActual, anioActual + 1].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  
                  <FiltroCategorias filtro={categoriaActiva} setFiltro={setCategoriaActiva} />

                  <div className="flex gap-2">
                    <input type="text" placeholder="🔍 Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 outline-none focus:border-eco-bosque" />
                    <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as 'todos' | 'pagado' | 'pendiente')} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 font-bold outline-none">
                      <option value="todos">Todos</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="pagado">Pagado</option>
                    </select>
                    <button onClick={exportarAExcel} className="p-3 bg-eco-bosque/10 dark:bg-eco-menta/10 text-eco-bosque dark:text-eco-menta rounded-2xl transition-colors hover:bg-eco-bosque/20">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              )}

              <DashboardResumen 
                totalPendiente={totalPendiente} 
                totalMensual={totalMensual} 
                totalPagado={totalPagado} 
                totalIngresos={totalIngresos} 
                limitePresupuesto={limitePresupuesto} 
                onEditPresupuesto={() => setMostrarModalPresupuesto(true)} 
                variantes={{}} 
              />

              <main>
                <h2 className="text-lg font-black text-eco-texto dark:text-gray-200 mb-4 px-1">Obligaciones</h2>
                <div className="flex flex-col gap-3">
                  {gastosFiltrados.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 font-bold border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">No hay gastos 🍃</div>
                  ) : (
                    gastosFiltrados.map(g => (
                      <GastoCard key={g.id} gasto={g} onToggle={() => toggleGasto(g.id)} onDelete={() => setGastoABorrar(g.id)} onEdit={() => { setGastoAEditar(g); setMostrarFormulario(true); }} />
                    ))
                  )}
                </div>
              </main>
            </>
          )}
        </motion.div>
      </div>

      {(vistaActual === 'inicio' || vistaActual === 'historial') && (
        <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3">
          <AnimatePresence>
            {menuFabAbierto && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.9 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                className="flex flex-col gap-3"
              >
                <button 
                  onClick={() => { setMostrarFormularioIngreso(true); setMenuFabAbierto(false); }} 
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 pr-4 rounded-full shadow-lg hover:scale-105 transition-all border border-gray-100 dark:border-gray-700"
                >
                  <div className="bg-green-100 text-green-600 p-2 rounded-full"><TrendingUp size={20} /></div>
                  <span className="font-bold text-sm text-gray-700 dark:text-gray-200">Ingreso</span>
                </button>
                <button 
                  onClick={() => { setGastoAEditar(null); setMostrarFormulario(true); setMenuFabAbierto(false); }} 
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 pr-4 rounded-full shadow-lg hover:scale-105 transition-all border border-gray-100 dark:border-gray-700"
                >
                  <div className="bg-red-100 text-red-500 p-2 rounded-full"><TrendingDown size={20} /></div>
                  <span className="font-bold text-sm text-gray-700 dark:text-gray-200">Gasto</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setMenuFabAbierto(!menuFabAbierto)} 
            className="w-14 h-14 bg-gradient-to-tr from-eco-bosque to-[#40916c] text-white rounded-full shadow-[0_8px_25px_rgba(45,106,79,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={32} className={`transition-transform duration-300 ${menuFabAbierto ? 'rotate-45' : ''}`} />
          </button>
        </div>
      )}
      
      <AnimatePresence>
        {menuFabAbierto && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={() => setMenuFabAbierto(false)}
            className="fixed inset-0 bg-black/20 z-30" 
          />
        )}
      </AnimatePresence>

      <NavegacionInferior vistaActual={vistaActual} setVistaActual={setVistaActual} />
      
      {session && <MenuLateral abierto={menuAbierto} onClose={() => setMenuAbierto(false)} session={session} onCerrarSesion={() => supabase.auth.signOut()} onAbrirGraficos={() => setVistaActual('graficos')} onAbrirInvitacion={() => setMostrarInvitacion(true)} />}

      <ModalInvitacion isOpen={mostrarInvitacion} onClose={() => setMostrarInvitacion(false)} nombreHogar={session?.user.user_metadata?.hogar || ''} />
      <ModalPresupuesto isOpen={mostrarModalPresupuesto} onClose={() => setMostrarModalPresupuesto(false)} limiteActual={limitePresupuesto} onSave={(l) => { setLimitePresupuesto(l); localStorage.setItem('ecoHogar_presupuesto', l.toString()); setMostrarModalPresupuesto(false); }} />
      
      <AnimatePresence>
        {mostrarFormulario && <NuevoGastoForm gastoAEditar={gastoAEditar} onGuardar={guardarGasto} onCancelar={() => { setMostrarFormulario(false); setGastoAEditar(null); }} />}
        
        {mostrarFormularioIngreso && <NuevoIngresoForm onGuardar={guardarIngreso} onCancelar={() => setMostrarFormularioIngreso(false)} />}
      </AnimatePresence>
      
      <ModalEliminar isOpen={gastoABorrar !== null} onClose={() => setGastoABorrar(null)} onConfirm={confirmarEliminacion} />
    </div>
  );
}

export default App;