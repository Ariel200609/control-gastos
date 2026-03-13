import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

// COMPONENTES MODULARES
import { Login } from './components/Auth';
import { Header } from './components/Header';
import { PantallaInicio } from './components/PantallaInicio'; 
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
import { SuperAdmin } from './components/SuperAdmin';
import { AjustesCategorias } from './components/AjustesCategorias';
import { MenuOrdenamiento, type TipoOrden } from './components/MenuOrdenamiento';
import { PullToRefresh } from './components/PullToRefresh';
import { SkeletonLoader } from './components/SkeletonLoader'; // <-- ACÁ ESTÁ EL NUEVO

// LÓGICA EXTRACTADA
import { supabase } from './lib/supabase';
import { useFinanzas } from './hooks/useFinanzas';
import { useFiltros } from './hooks/useFiltros'; 
import type { Session } from '@supabase/supabase-js';
import type { Gasto, Ahorro, Ingreso } from './types';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function App() {
  const [session, setSession] = useState<Session | null>(null);
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
  const [ingresoABorrar, setIngresoABorrar] = useState<string | null>(null);
  const [gastoAEditar, setGastoAEditar] = useState<Gasto | null>(null);
  const [ingresoAEditar, setIngresoAEditar] = useState<Ingreso | null>(null);
  const [ahorroAEditar, setAhorroAEditar] = useState<Ahorro | null>(null);

  const [limitePresupuesto, setLimitePresupuesto] = useState(() => Number(localStorage.getItem('ecoHogar_presupuesto') || 0));
  const [isDarkMode, setIsDarkMode] = useState(() => window.localStorage.getItem('theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches);

  const { gastos, ingresos, categorias, ahorros, cargando, guardarGasto, guardarIngreso, eliminarIngreso, guardarAhorro, eliminarAhorro, toggleGasto, eliminarGasto, setCategorias, fetchData } = useFinanzas(session);
  const { mesFiltro, setMesFiltro, anioFiltro, setAnioFiltro, filtroEstado, setFiltroEstado, categoriaActiva, setCategoriaActiva, busqueda, setBusqueda, ordenGastos, setOrdenGastos, vistaCompacta, setVistaCompacta, gastosFiltrados, ingresosFiltrados, mesActual, anioActual, totales } = useFiltros(gastos, ingresos, ahorros, vistaActual);

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

  const exportarAExcel = () => {
    let csvContent = "Fecha Vencimiento,Título,Categoría,Monto,Estado,Detalles\n";
    gastosFiltrados.forEach(g => { csvContent += `${g.fechaVencimiento},"${g.titulo}",${g.categoria},${g.monto},${g.estado},"${g.detalles || ''}"\n`; });
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `EcoHogar_Gastos_${MESES[mesFiltro-1]}.csv`; link.click();
    toast.success('Exportado 📊');
  };

  if (!session) return <Login />;
  
  // 🔥 ACÁ REEMPLAZAMOS EL TEXTO FEO POR EL SKELETON 🔥
  if (cargando && gastos.length === 0) return <SkeletonLoader />;

  return (
    <div className="min-h-screen p-4 pt-[env(safe-area-inset-top)] font-sans selection:bg-eco-menta/30 transition-colors duration-300 bg-eco-fondo dark:bg-gray-950">
      <Toaster position="top-center" />
      
      <PullToRefresh onRefresh={async () => { await fetchData(); }}>
        <div className="max-w-md mx-auto pt-2 pb-32">
          <Header vistaActual={vistaActual} session={session} onOpenMenu={() => setMenuAbierto(true)} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={vistaActual}>
            {vistaActual === 'super' && <Supermercado onCompraTerminada={() => {}} />}
            {vistaActual === 'graficos' && <Graficos gastos={gastos} ingresos={ingresos} mesActual={mesActual} anioActual={anioActual} />}
            {vistaActual === 'notas' && <Notas />}
            {vistaActual === 'admin' && <SuperAdmin />}

            {(vistaActual === 'inicio' || vistaActual === 'historial') && (
              <PantallaInicio
                vistaActual={vistaActual} pestañaPrincipal={pestañaPrincipal} setPestañaPrincipal={setPestañaPrincipal}
                mesFiltro={mesFiltro} setMesFiltro={setMesFiltro} anioFiltro={anioFiltro} setAnioFiltro={setAnioFiltro} anioActual={anioActual}
                categoriaActiva={categoriaActiva} setCategoriaActiva={setCategoriaActiva} busqueda={busqueda} setBusqueda={setBusqueda} filtroEstado={filtroEstado} setFiltroEstado={setFiltroEstado} exportarAExcel={exportarAExcel}
                totales={totales} limitePresupuesto={limitePresupuesto} onEditPresupuesto={() => setMostrarModalPresupuesto(true)} onAbrirBoveda={() => setMostrarBoveda(true)}
                setMostrarMenuOrden={setMostrarMenuOrden} vistaCompacta={vistaCompacta}
                gastosFiltrados={gastosFiltrados} toggleGasto={toggleGasto} setGastoABorrar={setGastoABorrar} setGastoAEditar={setGastoAEditar} setMostrarFormulario={setMostrarFormulario}
                ingresosFiltrados={ingresosFiltrados} setIngresoAEditar={setIngresoAEditar} setMostrarFormularioIngreso={setMostrarFormularioIngreso} setIngresoABorrar={setIngresoABorrar}
              />
            )}
          </motion.div>
        </div>
      </PullToRefresh>

      {/* BOTÓN FLOTANTE Y MENÚS INFERIORES */}
      {(vistaActual === 'inicio' || vistaActual === 'historial') && (
        <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3">
          <AnimatePresence>
            {menuFabAbierto && (
              <motion.div initial={{ opacity: 0, y: 15, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.9 }} className="flex flex-col gap-3">
                <button onClick={() => { setAhorroAEditar(null); setMostrarFormularioAhorro(true); setMenuFabAbierto(false); }} className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 pr-4 rounded-full shadow-lg hover:scale-105 transition-all border border-gray-100 dark:border-gray-700"><div className="bg-blue-100 text-blue-600 p-2 rounded-full"><PiggyBank size={20} /></div><span className="font-bold text-sm text-gray-700 dark:text-gray-200">Ahorro</span></button>
                <button onClick={() => { setIngresoAEditar(null); setMostrarFormularioIngreso(true); setMenuFabAbierto(false); }} className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 pr-4 rounded-full shadow-lg hover:scale-105 transition-all border border-gray-100 dark:border-gray-700"><div className="bg-green-100 text-green-600 p-2 rounded-full"><TrendingUp size={20} /></div><span className="font-bold text-sm text-gray-700 dark:text-gray-200">Ingreso</span></button>
                <button onClick={() => { setGastoAEditar(null); setMostrarFormulario(true); setMenuFabAbierto(false); }} className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 pr-4 rounded-full shadow-lg hover:scale-105 transition-all border border-gray-100 dark:border-gray-700"><div className="bg-red-100 text-red-500 p-2 rounded-full"><TrendingDown size={20} /></div><span className="font-bold text-sm text-gray-700 dark:text-gray-200">Gasto</span></button>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setMenuFabAbierto(!menuFabAbierto)} className="w-14 h-14 bg-gradient-to-tr from-eco-bosque to-[#40916c] text-white rounded-full shadow-[0_8px_25px_rgba(45,106,79,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"><Plus size={32} className={`transition-transform duration-300 ${menuFabAbierto ? 'rotate-45' : ''}`} /></button>
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
        {mostrarFormularioIngreso && <NuevoIngresoForm ingresoAEditar={ingresoAEditar} onGuardar={(data) => guardarIngreso(data, ingresoAEditar).then(success => { if(success) { setMostrarFormularioIngreso(false); setIngresoAEditar(null); setPestañaPrincipal('ingresos'); }})} onCancelar={() => { setMostrarFormularioIngreso(false); setIngresoAEditar(null); }} />}
        {mostrarFormularioAhorro && <NuevoAhorroForm ahorroAEditar={ahorroAEditar} onGuardar={handleGuardarAhorro} onCancelar={() => { setMostrarFormularioAhorro(false); setAhorroAEditar(null); }} />}
      </AnimatePresence>
      <ModalEliminar isOpen={gastoABorrar !== null || ingresoABorrar !== null} onClose={() => { setGastoABorrar(null); setIngresoABorrar(null); }} onConfirm={async () => { if (gastoABorrar) { await eliminarGasto(gastoABorrar); setGastoABorrar(null); } if (ingresoABorrar) { await eliminarIngreso(ingresoABorrar); setIngresoABorrar(null); } }} />
    </div>
  );
}

export default App;