import { Menu, Sun, Moon } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';

interface Props {
  vistaActual: 'inicio' | 'historial' | 'super' | 'graficos' | 'notas' | 'admin';
  session: Session;
  onOpenMenu: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return { text: 'Buenas noches', emoji: '🌙' };
  if (hour < 12) return { text: 'Buenos días', emoji: '☀️' };
  if (hour < 19) return { text: 'Buenas tardes', emoji: '🌤️' };
  return { text: 'Buenas noches', emoji: '🌙' };
};

const getViewLabel = (vistaActual: string) => {
  switch(vistaActual) {
    case 'inicio': return 'Resumen del Mes';
    case 'historial': return 'Tu Archivo';
    case 'super': return 'De Compras';
    case 'graficos': return 'Estadísticas';
    case 'notas': return 'Organización';
    default: return '';
  }
};

const getViewTitle = (vistaActual: string, session: Session) => {
  switch(vistaActual) {
    case 'inicio': return `Hogar ${session.user.user_metadata?.hogar || ''}`;
    case 'super': return 'Lista de Super';
    case 'graficos': return 'Gráficos';
    case 'notas': return 'Notas';
    default: return 'Historial';
  }
};

export const Header = ({ vistaActual, session, onOpenMenu, isDarkMode, onToggleTheme }: Props) => {
  const greeting = getGreeting();
  
  return (
    <header className="mb-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMenu} className="p-2.5 -ml-2 text-eco-texto dark:text-gray-300 hover:bg-eco-bosque/10 dark:hover:bg-eco-menta/10 rounded-xl transition-all active:scale-95">
          <Menu size={26} strokeWidth={2.5} />
        </button>
        <div>
          <p className="text-eco-bosque dark:text-eco-menta font-bold tracking-wide uppercase text-[10px] mb-0.5 leading-none flex items-center gap-1">
            {vistaActual === 'inicio' ? (
              <>{greeting.emoji} {greeting.text}</>
            ) : (
              getViewLabel(vistaActual)
            )}
          </p>
          <h1 className="text-2xl font-extrabold font-display text-eco-texto dark:text-white leading-none">
            {getViewTitle(vistaActual, session)}
          </h1>
        </div>
      </div>
      <button 
        onClick={onToggleTheme} 
        className="p-2.5 text-eco-texto dark:text-eco-menta glass-card shadow-premium rounded-xl hover:shadow-premium-hover hover:scale-105 active:scale-95 transition-all"
      >
        {isDarkMode ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
      </button>
    </header>
  );
};