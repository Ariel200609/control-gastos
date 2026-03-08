import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Receipt, TrendingUp, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const SuperAdmin = () => {
  const [stats, setStats] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  const cargarMetricas = async () => {
    setCargando(true);
    try {
      // Llamamos a la función secreta que creamos en SQL
      const { data, error } = await supabase.rpc('get_admin_stats');
      
      if (error) throw error;
      if (data) setStats(data);
    } catch (error: any) {
      toast.error('Acceso Denegado o error de conexión');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMetricas();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      
      <div className="bg-gray-900 rounded-[32px] p-6 shadow-2xl border border-gray-800 mb-6 text-white relative overflow-hidden">
        {/* Decoración de fondo */}
        <ShieldAlert size={120} className="absolute -right-6 -top-6 text-gray-800 opacity-30" />
        
        <div className="relative z-10 flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-2">
              <ShieldAlert size={24} className="text-blue-400" /> SuperAdmin
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">Centro de Comando</p>
          </div>
          <button onClick={cargarMetricas} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
            <RefreshCw size={18} className={cargando ? "animate-spin text-blue-400" : "text-gray-400"} />
          </button>
        </div>

        {cargando ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse flex gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full delay-75"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full delay-150"></div>
            </div>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-4">
            
            <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700 backdrop-blur-sm col-span-2">
              <p className="text-xs text-blue-400 font-bold mb-1 flex items-center gap-1 uppercase tracking-wider"><Users size={14}/> Cuentas Activas</p>
              <p className="text-4xl font-black">{stats.usuarios_totales}</p>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700 backdrop-blur-sm">
              <p className="text-[10px] text-red-400 font-bold mb-1 flex items-center gap-1 uppercase tracking-wider"><Receipt size={14}/> Gastos Creados</p>
              <p className="text-2xl font-black">{stats.gastos_registrados}</p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700 backdrop-blur-sm">
              <p className="text-[10px] text-emerald-400 font-bold mb-1 flex items-center gap-1 uppercase tracking-wider"><TrendingUp size={14}/> Ingresos Creados</p>
              <p className="text-2xl font-black">{stats.ingresos_registrados}</p>
            </div>

          </div>
        ) : (
          <p className="text-center text-red-400 text-sm py-4">No autorizado.</p>
        )}
      </div>

    </motion.div>
  );
};