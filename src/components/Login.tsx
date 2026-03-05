import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // NUEVO: Estado para el nombre de la familia
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
        // CAMBIO: Alerta linda de éxito
        toast.success('¡Registro exitoso! Ya podés iniciar sesión.', { duration: 4000 });
        setEsRegistro(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      // CAMBIO: Alerta linda de error
      toast.error(error.message || 'Hubo un error con la autenticación');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 selection:bg-blue-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <span className="text-3xl text-white">💰</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Economía Hogar</h1>
          <p className="text-gray-500 font-medium mt-1">
            {esRegistro ? 'Creá tu cuenta familiar' : 'Ingresá a tu panel'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          
          {/* Este campo SOLO aparece si está en modo Registro */}
          {esRegistro && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de tu Hogar / Familia</label>
              <input 
                type="text" 
                placeholder="Ej: Montoya, Los Perez, etc."
                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                value={nombreHogar}
                onChange={(e) => setNombreHogar(e.target.value)}
                required={esRegistro} // Solo es obligatorio si se está registrando
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tu Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com"
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full mt-2 py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-black transition-colors shadow-md disabled:bg-gray-400"
          >
            {cargando ? 'Procesando...' : (esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => setEsRegistro(!esRegistro)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {esRegistro 
              ? '¿Ya tenés cuenta? Iniciá sesión' 
              : '¿No tenés cuenta? Registrate gratis'}
          </button>
        </div>

      </div>
    </div>
  );
};