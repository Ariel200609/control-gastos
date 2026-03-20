import { motion, useAnimation } from 'framer-motion';
import { Trash2, CheckCircle } from 'lucide-react';
import { vibrar } from '../utils/haptics';

interface Props {
  children: React.ReactNode;
  onBorrar: () => void;
  onCompletar?: () => void; // Opcional, porque a los ingresos capaz no los marcás como "pagados"
}

export const ItemDeslizable = ({ children, onBorrar, onCompletar }: Props) => {
  const controls = useAnimation();

  const handleDragEnd = async (_event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Deslizar hacia la izquierda (Borrar)
    if (offset < -100 || velocity < -500) {
      vibrar([30, 50, 30]); // Vibración de alerta triple
      await controls.start({ x: -1000, transition: { duration: 0.2 } });
      onBorrar();
      // Volvemos a ponerlo en 0 invisible por si la lista se actualiza
      controls.set({ x: 0 }); 
    }
    // Deslizar hacia la derecha (Completar/Pagar)
    else if (onCompletar && (offset > 100 || velocity > 500)) {
      vibrar(40); // Vibración de éxito
      await controls.start({ x: 1000, transition: { duration: 0.2 } });
      onCompletar();
      controls.set({ x: 0 });
    }
    // Si no llegó al límite, vuelve a su lugar como un resorte magnético
    else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl mb-3">
      {/* FONDOS (Lo que se ve abajo al deslizar) */}
      <div className="absolute inset-0 flex justify-between items-center px-6 rounded-2xl bg-gray-100 dark:bg-gray-800/50">
        {/* Fondo Verde (Izquierda) */}
        <div className={`flex items-center gap-2 font-bold ${onCompletar ? 'text-green-500' : 'opacity-0'}`}>
          <CheckCircle size={24} /> <span className="text-sm">Pagado</span>
        </div>
        
        {/* Fondo Rojo (Derecha) */}
        <div className="flex items-center gap-2 font-bold text-red-500">
          <span className="text-sm">Borrar</span> <Trash2 size={24} />
        </div>
      </div>

      {/* EL ELEMENTO ARRIBA (La tarjeta del gasto real) */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative z-10 w-full cursor-grab active:cursor-grabbing"
        // Bloqueamos el drag horizontal si el usuario está scrolleando la página para abajo
        dragDirectionLock
        onDirectionLock={(axis) => {
          if (axis === 'y') controls.stop();
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};