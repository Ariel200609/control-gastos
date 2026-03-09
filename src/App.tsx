import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Download, TrendingUp, TrendingDown, PiggyBank, ListFilter } from 'lucide-react';

// COMPONENTES MODULARES
import { Login } from './components/Auth';
import { Header } from './components/Header';
import { DashboardResumen } from './components/DashboardResumen';
import { GastoCard } from './components/GastoCard';
import { IngresoCard } from './components/IngresoCard';
import { NuevoGastoForm } from './components/NuevoGastoForm';
import { NuevoIngresoForm } from './components/NuevoIngresoForm';
import { NuevoAhorroForm } from './components/NuevoAhorroForm';
import { ModalBoveda } from './components/ModalBoveda';
import { Supermercado } from './components/Supermercado';
import { NavegacionInferior } from './components/NavegacionInferior';
import { MenuLateral } from './components/MenuLateral';
import { ModalEliminar } from './components/ModalEliminar';
import { Graficos } from './components/Graficos';
import { ModalInvitacion } from './components/ModalInvitacion';
import { ModalPresupuesto } from './components/ModalPresupuesto';
import { Notas } from './components/Notas';
import { FiltroCategorias } from './components/FiltroCategorias';
import { SuperAdmin } from './components/SuperAdmin';
import { AjustesCategorias } from './components/AjustesCategorias';
import { MenuOrdenamiento, type TipoOrden } from './components/MenuOrdenamiento';

// LÓGICA EXTRACTADA
import { supabase } from './lib/supabase';
import { useFinanzas } from './hooks/useFinanzas';
import { useFiltros } from './hooks/useFiltros'; 
import type { Session } from '@supabase/supabase-js';
import type { Gasto, Ahorro, Ingreso } from './types'; // <-- Aseguramos que Ingreso esté acá

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function App() {
  const [session, setSession] = useState<Session | null>(null);

  // ESTADO DE LA PESTAÑA PRINCIPAL
  const [pestañaPrincipal, setPestañaPrincipal] = useState<'gastos' | 'ingresos'>('gastos');

  const [vistaActual, setVistaActual] = useState<'inicio' | 'historial' | 'super' | 'graficos' | 'notas' | 'admin'>('inicio');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioIngreso, setMostrarFormularioIngreso] = useState(false);
  const [mostrarFormularioAhorro, setMostrarFormularioAhorro] = useState(false);
  const [mostrarBoveda, setMostrarBoveda] = useState(false);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [mostrarMenuOrden, setMostrarMenuOrden] = useState(false);
  const [menuFabAbierto, setMenuFabAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarInvitacion, setMostrarInvitacion] = useState(false);
  const [mostrarModalPresupuesto, setMostrarModalPresupuesto] = useState(false);
  
  const [gastoABorrar, setGastoABorrar] = useState<string | null>(null);
  const [gastoAEditar, setGastoAEditar] = useState<Gasto | null>(null);
  const [ahorroAEditar, setAhorroAEditar] = useState<Ahorro | null>(null);

  const [limitePresupuesto, setLimitePresupuesto] = useState(() => {
    return Number(localStorage.getItem('ecoHogar_presupuesto') || 0);
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.localStorage.getItem('theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const { gastos, ingresos, categorias, ahorros, cargando, guardarGasto, guardarIngreso, guardarAhorro, eliminarAhorro, toggleGasto, eliminarGasto, setCategorias } = useFinanzas(session);
  
  const { 
    mesFiltro, setMesFiltro, anioFiltro, setAnioFiltro, filtroEstado, setFiltroEstado, 
    categoriaActiva, setCategoriaActiva, busqueda, setBusqueda, ordenGastos, setOrdenGastos, 
    vistaCompacta, setVistaCompacta, gastosFiltrados, ingresosFiltrados, mesActual, anioActual, totales 
  } = useFiltros(gastos, ingresos, ahorros, vistaActual);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) { root.classList.add('dark'); localStorage.setItem('theme', 'dark'); } 
    else { root.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [isDarkMode]);

  const handleGuardarGasto = async (gastoData: any) => {
    if (await guardarGasto(gastoData, gastoAEditar)) { setMostrarFormulario(false); setGastoAEditar(null); }
  };

  const handleGuardarAhorro = async (ahorroData: any) => {
    if (await guardarAhorro(ahorroData, ahorroAEditar)) { setMostrarFormularioAhorro(false); setAhorroAEditar(null); }
  };

  const handleGuardarIngreso = async (ingresoData: any) => {
    if (await guardarIngreso(ingresoData)) {
      setMostrarFormularioIngreso(false);
      setPestañaPrincipal('ingresos');
    }
  };

  const confirmarEliminacion = async () => {
    if (gastoABorrar) { await eliminarGasto(gastoABorrar); setGastoABorrar(null); }
  };

  const handleCompraTerminada = async (monto: number, detalles: string) => {
    await supabase.from('gastos').insert([{
      titulo: 'Compra de Supermercado', monto, categoria: 'Supermercado',
      fechaVencimiento: new Date().toISOString().split('T')[0], estado: 'pagado', detalles,
      user_id: session?.user.id
    }]);
    setVistaActual('inicio');
    setPestañaPrincipal('gastos');
    toast.success('¡Compra registrada!');
  };

  const exportarAExcel = () => {
    let csvContent = "Fecha Vencimiento,Título,Categoría,Monto,Estado,Detalles\n";
    gastosFiltrados.forEach(g => {
      csvContent += `${g.fechaVencimiento},"${g.titulo}",${g.categoria},${g.monto},${g.estado},"${g.detalles || ''}"\n`;
    });
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
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
          {vistaActual === 'admin' && <SuperAdmin />}

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
                  
                  {pestañaPrincipal === 'gastos' && (
                    <>
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
                    </>
                  )}
                </div>
              )}

              <DashboardResumen 
                totalPendiente={totales.totalPendiente} 
                totalMensual={totales.totalMensual} 
                totalPagado={totales.totalPagado} 
                totalIngresos={totales.totalIngresosMes} 
                totalAhorros={totales.totalAhorrosMes} 
                totalAhorrosGlobal={totales.totalAhorrosGlobal}
                saldoBilletera={totales.saldoBilletera}
                limitePresupuesto={limitePresupuesto} 
                onEditPresupuesto={() => setMostrarModalPresupuesto(true)} 
                onAbrirBoveda={() => setMostrarBoveda(true)} 
                variantes={{}} 
              />

              <main>
                <div className="flex justify-between items-center mb-4 px-1">
                  <div className="flex gap-5">
                    <button
                      onClick={() => setPestañaPrincipal('gastos')}
                      className={`text-lg font-black transition-all duration-300 ${
                        pestañaPrincipal === 'gastos' 
                          ? 'text-eco-texto dark:text-gray-200 border-b-[3px] border-eco-bosque dark:border-eco-menta pb-1' 
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      Gastos
                    </button>
                    <button
                      onClick={() => setPestañaPrincipal('ingresos')}
                      className={`text-lg font-black transition-all duration-300 ${
                        pestañaPrincipal === 'ingresos' 
                          ? 'text-green-600 dark:text-green-400 border-b-[3px] border-green-500 pb-1' 
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      Ingresos
                    </button>
                  </div>

                  {pestañaPrincipal === 'gastos' && (
                    <button onClick={() => setMostrarMenuOrden(true)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-eco-bosque dark:hover:text-eco-menta transition-colors">
                      <span>Ordenar</span>
                      <ListFilter size={16} />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {pestañaPrincipal === 'gastos' ? (
                    gastosFiltrados.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 font-bold border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">No hay gastos en este mes 🍃</div>
                    ) : (
                      gastosFiltrados.map(g => (
                        <GastoCard key={g.id} gasto={g} onToggle={() => toggleGasto(g.id)} onDelete={() => setGastoABorrar(g.id)} onEdit={() => { setGastoAEditar(g); setMostrarFormulario(true); }} compacto={vistaCompacta} />
                      ))
                    )
                  ) : (
                    ingresosFiltrados.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 font-bold border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">Aún no hay ingresos 📈</div>
                    ) : (
                      ingresosFiltrados.map((i: Ingreso) => (
                        <IngresoCard key={i.id} ingreso={i} />
                      ))
                    )
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
              <motion.div initial={{ opacity: 0, y: 15, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.9 }} className="flex flex-col gap-3">
                <button onClick={() => { setAhorroAEditar(null); setMostrarFormularioAhorro(true); setMenuFabAbierto(false); }} className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 pr-4 rounded-full shadow-lg hover:scale-105 transition-all border border-gray-100 dark:border-gray-700">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full"><PiggyBank size={20} /></div>
                  <span className="font-bold text-sm text-gray-700 dark:text-gray-200">Ahorro</span>
                </button>
                <button onClick={() => { setMostrarFormularioIngreso(true); setMenuFabAbierto(false); }} className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 pr-4 rounded-full shadow-lg hover:scale-105 transition-all border border-gray-100 dark:border-gray-700">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full"><TrendingUp size={20} /></div>
                  <span className="font-bold text-sm text-gray-700 dark:text-gray-200">Ingreso</span>
                </button>
                <button onClick={() => { setGastoAEditar(null); setMostrarFormulario(true); setMenuFabAbierto(false); }} className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 pr-4 rounded-full shadow-lg hover:scale-105 transition-all border border-gray-100 dark:border-gray-700">
                  <div className="bg-red-100 text-red-500 p-2 rounded-full"><TrendingDown size={20} /></div>
                  <span className="font-bold text-sm text-gray-700 dark:text-gray-200">Gasto</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setMenuFabAbierto(!menuFabAbierto)} className="w-14 h-14 bg-gradient-to-tr from-eco-bosque to-[#40916c] text-white rounded-full shadow-[0_8px_25px_rgba(45,106,79,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
            <Plus size={32} className={`transition-transform duration-300 ${menuFabAbierto ? 'rotate-45' : ''}`} />
          </button>
        </div>
      )}
      
      <AnimatePresence>{menuFabAbierto && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuFabAbierto(false)} className="fixed inset-0 bg-black/20 z-30" />}</AnimatePresence>

      <NavegacionInferior vistaActual={vistaActual} setVistaActual={setVistaActual} />
      
      {session && <MenuLateral abierto={menuAbierto} onClose={() => setMenuAbierto(false)} session={session} onCerrarSesion={() => supabase.auth.signOut()} onAbrirGraficos={() => setVistaActual('graficos')} onAbrirAdmin={() => setVistaActual('admin')} onAbrirInvitacion={() => setMostrarInvitacion(true)} onAbrirCategorias={() => setMostrarCategorias(true)} />}

      <AnimatePresence>
        {mostrarCategorias && <AjustesCategorias categorias={categorias} setCategorias={setCategorias} onClose={() => setMostrarCategorias(false)} />}
        {mostrarMenuOrden && <MenuOrdenamiento ordenActual={ordenGastos as TipoOrden} setOrden={(o) => setOrdenGastos(o)} vistaCompacta={vistaCompacta} setVistaCompacta={setVistaCompacta} onClose={() => setMostrarMenuOrden(false)} />}
        {mostrarBoveda && <ModalBoveda ahorros={ahorros} onClose={() => setMostrarBoveda(false)} onEdit={(a) => { setAhorroAEditar(a); setMostrarBoveda(false); setMostrarFormularioAhorro(true); }} onDelete={eliminarAhorro} />}
      </AnimatePresence>

      <ModalInvitacion isOpen={mostrarInvitacion} onClose={() => setMostrarInvitacion(false)} nombreHogar={session?.user.user_metadata?.hogar || ''} />
      <ModalPresupuesto isOpen={mostrarModalPresupuesto} onClose={() => setMostrarModalPresupuesto(false)} limiteActual={limitePresupuesto} onSave={(l) => { setLimitePresupuesto(l); localStorage.setItem('ecoHogar_presupuesto', l.toString()); setMostrarModalPresupuesto(false); }} />
      
      <AnimatePresence>
        {mostrarFormulario && <NuevoGastoForm gastoAEditar={gastoAEditar} categorias={categorias} onGuardar={handleGuardarGasto} onCancelar={() => { setMostrarFormulario(false); setGastoAEditar(null); }} />}
        {mostrarFormularioIngreso && <NuevoIngresoForm onGuardar={handleGuardarIngreso} onCancelar={() => setMostrarFormularioIngreso(false)} />}
        {mostrarFormularioAhorro && <NuevoAhorroForm ahorroAEditar={ahorroAEditar} onGuardar={handleGuardarAhorro} onCancelar={() => { setMostrarFormularioAhorro(false); setAhorroAEditar(null); }} />}
      </AnimatePresence>
      
      <ModalEliminar isOpen={gastoABorrar !== null} onClose={() => setGastoABorrar(null)} onConfirm={confirmarEliminacion} />
    </div>
  );
}

export default App;