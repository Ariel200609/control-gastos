import { Download, ListFilter, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardResumen } from './DashboardResumen';
import { GastoCard } from './GastoCard';
import { IngresoCard } from './IngresoCard';
import { FiltroCategorias } from './FiltroCategorias';
import { ItemDeslizable } from './ItemDeslizable'; // 🔥 ACÁ ESTÁ EL NUEVO SUPERPODER
import type { Gasto, Ingreso } from '../types';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Stagger animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } }
};

export const PantallaInicio = ({
  vistaActual, pestañaPrincipal, setPestañaPrincipal,
  mesFiltro, setMesFiltro, anioFiltro, setAnioFiltro, anioActual,
  categoriaActiva, setCategoriaActiva, busqueda, setBusqueda, filtroEstado, setFiltroEstado, exportarAExcel,
  totales, limitePresupuesto, onEditPresupuesto, onAbrirBoveda,
  setMostrarMenuOrden, vistaCompacta,
  gastosFiltrados, toggleGasto, setGastoABorrar, setGastoAEditar, setMostrarFormulario,
  ingresosFiltrados, setIngresoAEditar, setMostrarFormularioIngreso, setIngresoABorrar
}: any) => {

  return (
    <>
      {/* 1. FILTROS (Solo visibles en la pestaña Historial) */}
      {vistaActual === 'historial' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 mb-6"
        >
          <div className="flex gap-2">
            <select value={mesFiltro} onChange={(e) => setMesFiltro(Number(e.target.value))} className="flex-1 glass-card shadow-premium rounded-2xl p-3 font-bold outline-none focus:ring-2 focus:ring-eco-bosque/20 dark:text-gray-200">
              {MESES.map((mes, i) => <option key={mes} value={i + 1}>{mes}</option>)}
            </select>
            <select value={anioFiltro} onChange={(e) => setAnioFiltro(Number(e.target.value))} className="w-28 glass-card shadow-premium rounded-2xl p-3 font-bold outline-none focus:ring-2 focus:ring-eco-bosque/20 dark:text-gray-200">
              {[anioActual - 1, anioActual, anioActual + 1].map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          
          {pestañaPrincipal === 'gastos' && (
            <>
              <FiltroCategorias filtro={categoriaActiva} setFiltro={setCategoriaActiva} />
              <div className="flex gap-2">
                <input type="text" placeholder="🔍 Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="flex-1 glass-card shadow-premium rounded-2xl p-3 outline-none focus:ring-2 focus:ring-eco-bosque/20 focus:border-eco-bosque dark:text-gray-200 dark:placeholder-gray-500" />
                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as 'todos' | 'pagado' | 'pendiente')} className="glass-card shadow-premium rounded-2xl p-3 font-bold outline-none focus:ring-2 focus:ring-eco-bosque/20 dark:text-gray-200">
                  <option value="todos">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                </select>
                <button onClick={exportarAExcel} className="p-3 bg-eco-bosque/10 dark:bg-eco-menta/10 text-eco-bosque dark:text-eco-menta rounded-2xl transition-all hover:bg-eco-bosque/20 hover:scale-105 active:scale-95">
                  <Download size={20} />
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* 2. DASHBOARD PRINCIPAL */}
      <DashboardResumen 
        totalPendiente={totales.totalPendiente} 
        totalMensual={totales.totalMensual} 
        totalPagado={totales.totalPagado} 
        totalIngresos={totales.totalIngresosMes} 
        totalAhorros={totales.totalAhorrosMes} 
        totalAhorrosGlobal={totales.totalAhorrosGlobal}
        saldoBilletera={totales.saldoBilletera}
        limitePresupuesto={limitePresupuesto} 
        onEditPresupuesto={onEditPresupuesto} 
        onAbrirBoveda={onAbrirBoveda} 
        variantes={{}} 
      />

      {/* 3. PESTAÑAS Y LISTAS */}
      <main>
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex gap-5">
            <button
              onClick={() => setPestañaPrincipal('gastos')}
              className={`text-lg font-black font-display transition-all duration-300 ${
                pestañaPrincipal === 'gastos' 
                  ? 'text-eco-texto dark:text-gray-200 border-b-[3px] border-eco-bosque dark:border-eco-menta pb-1' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              Gastos
            </button>
            <button
              onClick={() => setPestañaPrincipal('ingresos')}
              className={`text-lg font-black font-display transition-all duration-300 ${
                pestañaPrincipal === 'ingresos' 
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-[3px] border-emerald-500 pb-1' 
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

        <motion.div 
          className="flex flex-col gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${pestañaPrincipal}-${mesFiltro}-${anioFiltro}`}
        >
          <AnimatePresence mode="popLayout">
            {pestañaPrincipal === 'gastos' ? (
              gastosFiltrados.length === 0 ? (
                <motion.div 
                  key="empty-gastos"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 text-gray-400 font-bold border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center gap-3"
                >
                  <Leaf size={32} className="text-gray-300 dark:text-gray-700" />
                  <span>No hay gastos en este mes</span>
                </motion.div>
              ) : (
                gastosFiltrados.map((g: Gasto) => (
                  <motion.div key={g.id} variants={itemVariants}>
                    <ItemDeslizable 
                      onBorrar={() => setGastoABorrar(g.id)} 
                      onCompletar={() => toggleGasto(g.id)}
                    >
                      <GastoCard 
                        gasto={g} 
                        onToggle={() => toggleGasto(g.id)} 
                        onDelete={() => setGastoABorrar(g.id)} 
                        onEdit={() => { setGastoAEditar(g); setMostrarFormulario(true); }} 
                        compacto={vistaCompacta} 
                      />
                    </ItemDeslizable>
                  </motion.div>
                ))
              )
            ) : (
              ingresosFiltrados.length === 0 ? (
                <motion.div 
                  key="empty-ingresos"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 text-gray-400 font-bold border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center gap-3"
                >
                  <Leaf size={32} className="text-gray-300 dark:text-gray-700" />
                  <span>Aún no hay ingresos</span>
                </motion.div>
              ) : (
                ingresosFiltrados.map((i: Ingreso) => (
                  <motion.div key={i.id} variants={itemVariants}>
                    <ItemDeslizable 
                      onBorrar={() => setIngresoABorrar(i.id)}
                    >
                      <IngresoCard 
                        ingreso={i} 
                        onEdit={() => { setIngresoAEditar(i); setMostrarFormularioIngreso(true); }} 
                        onDelete={() => setIngresoABorrar(i.id)} 
                      />
                    </ItemDeslizable>
                  </motion.div>
                ))
              )
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </>
  );
};