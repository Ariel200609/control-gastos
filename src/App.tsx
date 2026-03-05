import { useState } from 'react';
import { gastosIniciales } from './data/mockGastos';
import { GastoCard } from './components/GastoCard';
import { NuevoGastoForm } from './components/NuevoGastoForm'; // <-- Importamos el formulario
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Gasto } from './types';

function App() {
  const [gastos, setGastos] = useLocalStorage<Gasto[]>('gastos-app-v1', gastosIniciales);
  // Estado para controlar si mostramos o no el formulario
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const toggleGasto = (id: string) => {
    setGastos(gastosActuales => 
      gastosActuales.map(gasto => {
        if (gasto.id === id) {
          const nuevoEstado = gasto.estado === 'pendiente' ? 'pagado' : 'pendiente';
          return { ...gasto, estado: nuevoEstado };
        }
        return gasto;
      })
    );
  };

  // Función que recibe el gasto nuevo desde el formulario y lo suma a la lista
  const agregarNuevoGasto = (nuevoGasto: Gasto) => {
    setGastos(gastosActuales => [...gastosActuales, nuevoGasto]);
    setMostrarFormulario(false); // Cerramos el modal después de guardar
  };

  const totalMensual = gastos.reduce((total, gasto) => total + gasto.monto, 0);
  const totalPagado = gastos
    .filter(gasto => gasto.estado === 'pagado')
    .reduce((total, gasto) => total + gasto.monto, 0);
  const totalPendiente = totalMensual - totalPagado;

  return (
    // Agregamos "relative" acá para que el botón flotante se posicione bien
    <div className="min-h-screen bg-gray-50 p-4 font-sans selection:bg-blue-200 relative pb-24">
      <div className="max-w-md mx-auto pt-6">
        
        <header className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Economía Hogar</h1>
            <p className="text-gray-500 font-medium mt-1">Marzo 2026</p>
          </div>
        </header>

        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Pendiente de Pago
            </h2>
            <p className="text-4xl font-black text-gray-900">
              ${totalPendiente.toLocaleString('es-AR')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1">Presupuesto Mes</p>
              <p className="text-lg font-bold text-gray-800">
                ${totalMensual.toLocaleString('es-AR')}
              </p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-xl border border-green-100">
              <p className="text-xs text-green-600 font-medium mb-1">Ya Pagado</p>
              <p className="text-lg font-bold text-green-700">
                ${totalPagado.toLocaleString('es-AR')}
              </p>
            </div>
          </div>
        </section>

        <main>
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-lg font-bold text-gray-800">Tus obligaciones</h2>
            <span className="text-sm font-medium text-gray-400 bg-gray-200 px-2 py-1 rounded-full">
              {gastos.length}
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            {gastos.map((gasto) => (
              <GastoCard 
                key={gasto.id} 
                gasto={gasto} 
                onToggle={() => toggleGasto(gasto.id)} 
              />
            ))}
          </div>
        </main>
        
      </div>

      {/* --- BOTÓN FLOTANTE --- */}
      <button 
        onClick={() => setMostrarFormulario(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center text-3xl pb-1 hover:bg-blue-700 hover:scale-105 transition-all z-40 active:scale-95"
      >
        +
      </button>

      {/* --- MODAL DEL FORMULARIO --- */}
      {mostrarFormulario && (
        <NuevoGastoForm 
          onGuardar={agregarNuevoGasto} 
          onCancelar={() => setMostrarFormulario(false)} 
        />
      )}

    </div>
  );
}

export default App;