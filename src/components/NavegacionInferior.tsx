import { Home, ShoppingCart, CalendarDays, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  vistaActual: 'inicio' | 'historial' | 'super' | 'graficos' | 'notas' | 'admin';
  setVistaActual: (v: 'inicio' | 'historial' | 'super' | 'graficos' | 'notas' | 'admin') => void;
  urgentCount?: number;
}

const tabs = [
  { id: 'inicio' as const, label: 'INICIO', icon: Home },
  { id: 'super' as const, label: 'SÚPER', icon: ShoppingCart },
  { id: 'notas' as const, label: 'TAREAS', icon: ListTodo },
  { id: 'historial' as const, label: 'HISTORIAL', icon: CalendarDays },
];

export const NavegacionInferior = ({ vistaActual, setVistaActual, urgentCount = 0 }: Props) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-30">
      <nav className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 flex justify-around items-center p-2 pb-6 sm:pb-4">
        
        {tabs.map((tab) => {
          const isActive = vistaActual === tab.id;
          const Icon = tab.icon;
          const isNotas = tab.id === 'notas';
          
          return (
            <button
              key={tab.id}
              onClick={() => setVistaActual(tab.id)}
              className={`relative flex flex-col items-center p-2 flex-1 transition-all duration-200 ${
                isActive 
                  ? isNotas 
                    ? 'text-blue-500' 
                    : 'text-eco-bosque dark:text-eco-menta' 
                  : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              <div className="relative">
                <Icon 
                  className="mb-1 transition-transform duration-200" 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 1.8} 
                  style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)' }}
                />
                {tab.id === 'inicio' && urgentCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm">
                    {urgentCount > 9 ? '9+' : urgentCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold transition-all duration-200 ${isActive ? 'tracking-wider' : ''}`}>
                {tab.label}
              </span>
              {/* Pill indicator */}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className={`absolute -bottom-0.5 w-5 h-[3px] rounded-full ${isNotas ? 'bg-blue-500' : 'bg-eco-bosque dark:bg-eco-menta'}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}

      </nav>
    </div>
  );
};