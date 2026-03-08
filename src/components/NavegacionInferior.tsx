import { Home, ShoppingCart, CalendarDays, ListTodo } from 'lucide-react';

interface Props {
  vistaActual: 'inicio' | 'historial' | 'super' | 'graficos' | 'notas' | 'admin';
  setVistaActual: (v: 'inicio' | 'historial' | 'super' | 'graficos' | 'notas' | 'admin') => void;
}

export const NavegacionInferior = ({ vistaActual, setVistaActual }: Props) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-30">
      <nav className="w-full max-w-md bg-eco-fondo/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex justify-around items-center p-2 pb-6 sm:pb-4">
        
        <button onClick={() => setVistaActual('inicio')} className={`flex flex-col items-center p-2 flex-1 transition-colors ${vistaActual === 'inicio' ? 'text-eco-bosque dark:text-eco-menta' : 'text-gray-400'}`}>
          <Home className="mb-1" size={24} strokeWidth={vistaActual === 'inicio' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">INICIO</span>
        </button>
        
        <button onClick={() => setVistaActual('super')} className={`flex flex-col items-center p-2 flex-1 transition-colors ${vistaActual === 'super' ? 'text-eco-bosque dark:text-eco-menta' : 'text-gray-400'}`}>
          <ShoppingCart className="mb-1" size={24} strokeWidth={vistaActual === 'super' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">SÚPER</span>
        </button>
        
        {/* NUEVO BOTÓN DE NOTAS */}
        <button onClick={() => setVistaActual('notas')} className={`flex flex-col items-center p-2 flex-1 transition-colors ${vistaActual === 'notas' ? 'text-blue-500' : 'text-gray-400'}`}>
          <ListTodo className="mb-1" size={24} strokeWidth={vistaActual === 'notas' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">TAREAS</span>
        </button>
        
        <button onClick={() => setVistaActual('historial')} className={`flex flex-col items-center p-2 flex-1 transition-colors ${vistaActual === 'historial' ? 'text-eco-bosque dark:text-eco-menta' : 'text-gray-400'}`}>
          <CalendarDays className="mb-1" size={24} strokeWidth={vistaActual === 'historial' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">HISTORIAL</span>
        </button>

      </nav>
    </div>
  );
};