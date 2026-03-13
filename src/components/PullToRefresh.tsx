import { useState, useRef, type ReactNode} from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  onRefresh: () => Promise<void>;
}

export const PullToRefresh = ({ children, onRefresh }: Props) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Solo activamos si el usuario está arriba de todo en la pantalla
    if (window.scrollY <= 0) {
      startY.current = e.touches[0].clientY;
    } else {
      startY.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === 0 || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    // Si está tirando para abajo...
    if (distance > 0) {
      // Frenamos un poco la velocidad para que se sienta pesado como una banda elástica
      setPullDistance(Math.min(distance * 0.4, 100));
    }
  };

  const handleTouchEnd = async () => {
    // Si tiró lo suficiente para abajo, disparamos la recarga
    if (pullDistance >= 60 && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    // Soltamos la banda elástica
    setPullDistance(0);
    startY.current = 0;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-screen"
    >
      {/* El circulito de recarga al estilo Android/Mercado Pago */}
      <motion.div
        animate={{
          y: isRefreshing ? 60 : pullDistance,
          opacity: pullDistance > 10 || isRefreshing ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed top-0 left-0 w-full flex justify-center z-50 pointer-events-none"
        style={{ top: '-40px' }} 
      >
        <div className="bg-white dark:bg-gray-800 rounded-full p-2.5 shadow-lg border border-gray-100 dark:border-gray-700">
          <RefreshCw
            size={20}
            className={`text-eco-bosque dark:text-eco-menta ${isRefreshing ? 'animate-spin' : ''}`}
            style={{ transform: `rotate(${pullDistance * 4}deg)` }}
          />
        </div>
      </motion.div>

      {children}
    </div>
  );
};