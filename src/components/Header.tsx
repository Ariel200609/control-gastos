import { Menu, Sun, Moon } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';

interface Props {
  vistaActual: 'inicio' | 'historial' | 'super' | 'graficos' | 'notas';
  session: Session;
  onOpenMenu: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header = ({ vistaActual, session, onOpenMenu, isDarkMode, onToggleTheme }: Props) => {
  return (
    <header className="mb-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMenu} className="p-2 -ml-2 text-eco-texto dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-all">
          <Menu size={28} strokeWidth={2.5} />
        </button>
        <div>
          <p className="text-eco-bosque dark:text-eco-menta font-bold tracking-wide uppercase text-[10px] mb-0.5 leading-none">
            {vistaActual === 'inicio' && 'Resumen del Mes'}
            {vistaActual === 'historial' && 'Tu Archivo'}
            {vistaActual === 'super' && 'De Compras'}
            {vistaActual === 'graficos' && 'Estadísticas'}
            {vistaActual === 'notas' && 'Organización'} 
          </p>
          <h1 className="text-2xl font-extrabold text-eco-texto dark:text-white leading-none">
            {vistaActual === 'inicio' ? `Hogar ${session.user.user_metadata?.hogar || ''}` : vistaActual === 'super' ? 'Lista de Super' : vistaActual === 'graficos' ? 'Gráficos' : vistaActual === 'notas' ? 'Notas' : 'Historial'}
          </h1>
        </div>
      </div>
      <button onClick={onToggleTheme} className="p-2 text-eco-texto dark:text-eco-menta bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl">
        {isDarkMode ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
      </button>
    </header>
  );
};