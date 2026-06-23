import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Leaf } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreHogar, setNombreHogar] = useState(''); 
  const [cargando, setCargando] = useState(false);
  const [esRegistro, setEsRegistro] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      if (esRegistro) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { hogar: nombreHogar || 'Familiar' } }
        });
        if (error) throw error;
        toast.success('¡Registro exitoso! Ya podés iniciar sesión.', { duration: 4000 });
        setEsRegistro(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      toast.error(error.message || 'Hubo un error con la autenticación');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-bosque via-[#2d6a4f] to-[#1B4332] flex flex-col justify-center items-center p-4 selection:bg-eco-menta/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 -left-20 w-60 h-60 bg-eco-menta/10 rounded-full blur-3xl animate-breathing"></div>
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-breathing" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 right-10 w-32 h-32 bg-eco-menta/5 rounded-full blur-2xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo section above card */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl border border-white/20"
          >
            <Leaf size={36} className="text-eco-menta" />
          </motion.div>
          <h1 className="text-3xl font-black text-white font-display tracking-tight">EcoHogar</h1>
          <p className="text-eco-menta/80 font-medium mt-1 text-sm">
            Tu economía familiar, organizada
          </p>
        </div>

        {/* Glass card form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white font-display">
              {esRegistro ? 'Crear Cuenta' : 'Bienvenido'}
            </h2>
            <p className="text-white/60 text-sm mt-1">
              {esRegistro ? 'Registrate para empezar' : 'Ingresá a tu panel'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            {esRegistro && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-white/70 mb-1.5">Nombre de tu Hogar</label>
                <input type="text" placeholder="Ej: Montoya..." className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl p-3.5 outline-none focus:border-eco-menta focus:ring-2 focus:ring-eco-menta/20 transition-all font-medium backdrop-blur-sm" value={nombreHogar} onChange={(e) => setNombreHogar(e.target.value)} required={esRegistro} />
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Correo Electrónico</label>
              <input type="email" placeholder="ejemplo@correo.com" className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl p-3.5 outline-none focus:border-eco-menta focus:ring-2 focus:ring-eco-menta/20 transition-all font-medium backdrop-blur-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Contraseña</label>
              <input type="password" placeholder="••••••••" className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl p-3.5 outline-none focus:border-eco-menta focus:ring-2 focus:ring-eco-menta/20 transition-all font-medium backdrop-blur-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" disabled={cargando} className="w-full mt-2 py-3.5 rounded-xl font-bold text-eco-bosque bg-eco-menta hover:bg-eco-menta/90 transition-all shadow-lg shadow-eco-menta/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] font-display text-base">
              {cargando ? 'Procesando...' : (esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button type="button" onClick={() => setEsRegistro(!esRegistro)} className="text-sm font-medium text-eco-menta/80 hover:text-eco-menta transition-colors">
              {esRegistro ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate gratis'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};