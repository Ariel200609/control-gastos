import { motion } from 'framer-motion';

const CATEGORIAS = ['Todos', 'Servicios', 'Vivienda', 'Comida', 'Transporte', 'Salud', 'Ocio', 'Otros'];

export const FiltroCategorias = ({ filtro, setFiltro }: { filtro: string, setFiltro: (c: string) => void }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
      {CATEGORIAS.map(cat => (
        <motion.button // <-- ACÁ CAMBIAMOS A motion.button
          key={cat}
          whileTap={{ scale: 0.95 }} // <-- Y LE AGREGAMOS LA ANIMACIÓN AL TOCAR
          onClick={() => setFiltro(cat)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filtro === cat 
            ? 'bg-eco-bosque text-white shadow-md' 
            : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700'
          }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  );
};