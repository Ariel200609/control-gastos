import { Download, ListFilter } from 'lucide-react';
import { DashboardResumen } from './DashboardResumen';
import { GastoCard } from './GastoCard';
import { IngresoCard } from './IngresoCard';
import { FiltroCategorias } from './FiltroCategorias';
import { ItemDeslizable } from './ItemDeslizable'; // 🔥 ACÁ ESTÁ EL NUEVO SUPERPODER
import type { Gasto, Ingreso } from '../types';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

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
              gastosFiltrados.map((g: Gasto) => (
                // 🔥 ENVOLVEMOS EL GASTO PARA PODER DESLIZARLO
                <ItemDeslizable 
                  key={g.id} 
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
              ))
            )
          ) : (
            ingresosFiltrados.length === 0 ? (
              <div className="text-center py-10 text-gray-400 font-bold border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">Aún no hay ingresos 📈</div>
            ) : (
              ingresosFiltrados.map((i: Ingreso) => (
                // 🔥 ENVOLVEMOS EL INGRESO TAMBIÉN (Solo borrar hacia la izquierda)
                <ItemDeslizable 
                  key={i.id} 
                  onBorrar={() => setIngresoABorrar(i.id)}
                >
                  <IngresoCard 
                    ingreso={i} 
                    onEdit={() => { setIngresoAEditar(i); setMostrarFormularioIngreso(true); }} 
                    onDelete={() => setIngresoABorrar(i.id)} 
                  />
                </ItemDeslizable>
              ))
            )
          )}
        </div>
      </main>
    </>
  );
};