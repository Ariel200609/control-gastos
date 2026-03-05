import { createClient } from '@supabase/supabase-js';

// Vite nos permite leer las variables secretas usando import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Creamos y exportamos la conexión para usarla en toda la app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);