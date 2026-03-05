import type { Gasto } from '../types';

interface Props {
  gasto: Gasto;
  onToggle: () => void; // Agregamos la función que viene desde App.tsx
}

export const GastoCard = ({ gasto, onToggle }: Props) => {
  const isPendiente = gasto.estado === 'pendiente';

  return (
    // Le agregamos un cursor-pointer y el evento onClick a toda la tarjeta
    <div 
      onClick={onToggle}
      className={`p-4 rounded-2xl shadow-sm border flex justify-between items-center mb-3 transition-all cursor-pointer hover:shadow-md ${
        isPendiente ? 'bg-white border-gray-100' : 'bg-gray-50 border-green-200 opacity-80'
      }`}
    >
      <div>
        <h3 className={`font-bold text-lg ${isPendiente ? 'text-gray-800' : 'text-gray-500 line-through'}`}>
          {gasto.titulo}
        </h3>
        <p className="text-sm text-gray-400 font-medium">{gasto.categoria}</p>
      </div>
      
      <div className="text-right flex flex-col items-end">
        <p className={`font-extrabold text-xl mb-1 ${isPendiente ? 'text-gray-900' : 'text-gray-500'}`}>
          ${gasto.monto.toLocaleString('es-AR')}
        </p>
        
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          isPendiente 
            ? 'bg-red-100 text-red-600' 
            : 'bg-green-100 text-green-600'
        }`}>
          {isPendiente ? 'Pendiente' : 'Pagado'}
        </span>
      </div>
    </div>
  );
};