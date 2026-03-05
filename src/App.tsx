import { useState } from 'react';
import { gastosIniciales } from './data/mockGastos';
import { GastoCard } from './components/GastoCard';
import type { Gasto } from './types';

function App() {
  const [gastos, setGastos] = useState<Gasto[]>(gastosIniciales);

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

  // --- LÓGICA DE CÁLCULO ---
  const totalMensual = gastos.reduce((total, gasto) => total + gasto.monto, 0);
  
  const totalPagado = gastos
    .filter(gasto => gasto.estado === 'pagado')
    .reduce((total, gasto) => total + gasto.monto, 0);
    
  const totalPendiente = totalMensual - totalPagado;

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans selection:bg-blue-200">
      <div className="max-w-md mx-auto pt-6 pb-12">
        
        <header className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Economía Hogar</h1>
            <p className="text-gray-500 font-medium mt-1">Marzo 2026</p>
          </div>
        </header>

        {/* --- NUEVO DASHBOARD RESUMEN --- */}
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
    </div>
  );
}

export default App;