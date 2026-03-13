import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import type { Gasto, Ingreso, Categoria, Ahorro } from '../types';

export const useFinanzas = (session: any) => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [ahorros, setAhorros] = useState<Ahorro[]>([]);
  const [cargando, setCargando] = useState(true);

  const userId = session?.user?.id;

  const verificarYClonarGastosFijos = async (gastosCargados: Gasto[]) => {
    if (!userId) return;
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = ahora.getFullYear();
    const gastosFijos = gastosCargados.filter(g => g.es_fijo);

    const fijosParaClonar = gastosFijos.filter(fijo => {
      const [fijoYear, fijoMonth] = fijo.fechaVencimiento.split('-');
      const esDelMesActual = parseInt(fijoMonth, 10) === mesActual && parseInt(fijoYear, 10) === anioActual;
      if (esDelMesActual) return false;

      const yaExisteEsteMes = gastosCargados.some(g => {
        if (g.titulo !== fijo.titulo) return false;
        const [yearStr, monthStr] = g.fechaVencimiento.split('-');
        return parseInt(monthStr, 10) === mesActual && parseInt(yearStr, 10) === anioActual;
      });
      return !yaExisteEsteMes;
    });

    if (fijosParaClonar.length > 0) {
      const unicosParaClonar = fijosParaClonar.filter((v, i, a) => a.findIndex(t => (t.titulo === v.titulo)) === i);
      const nuevosGastos = unicosParaClonar.map(f => ({
        titulo: f.titulo,
        monto: f.monto,
        categoria: f.categoria,
        es_fijo: true,
        estado: 'pendiente',
        fechaVencimiento: `${anioActual}-${String(mesActual).padStart(2, '0')}-${f.fechaVencimiento.split('-')[2]}`,
        user_id: userId
      }));

      const { data, error } = await supabase.from('gastos').insert(nuevosGastos).select();
      if (!error && data) {
        setGastos(prev => [...prev, ...(data as Gasto[])]);
        toast.success(`Se automatizaron ${data.length} gastos fijos 🔁`);
      }
    }
  };

  const fetchData = async () => {
    if (!userId) return;
    try {
      setCargando(true);
      const [gastosRes, ingresosRes, categoriasRes, ahorrosRes] = await Promise.all([
        supabase.from('gastos').select('*').eq('user_id', userId).order('fechaVencimiento', { ascending: true }),
        supabase.from('ingresos').select('*').eq('user_id', userId).order('fecha', { ascending: true }),
        supabase.from('categorias').select('*').order('nombre', { ascending: true }),
        supabase.from('ahorros').select('*').eq('user_id', userId).order('fecha', { ascending: true }) 
      ]);

      if (gastosRes.data) {
        setGastos(gastosRes.data as Gasto[]);
        verificarYClonarGastosFijos(gastosRes.data as Gasto[]);
      }
      if (ingresosRes.data) setIngresos(ingresosRes.data as Ingreso[]);
      if (categoriasRes.data) setCategorias(categoriasRes.data as Categoria[]);
      if (ahorrosRes.data) setAhorros(ahorrosRes.data as Ahorro[]);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchData();
    const canalSuscripcion = supabase
      .channel('eco-hogar-cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gastos' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ingresos' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ahorros' }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(canalSuscripcion); };
  }, [userId]);

  const guardarGasto = async (gastoGuardado: any, gastoAEditar: Gasto | null) => {
    if (!userId) return false;
    try {
      if (!gastoAEditar && gastoGuardado.cuotas_totales && gastoGuardado.cuotas_totales > 1) {
        const nuevosGastos = [];
        const [year, month, day] = gastoGuardado.fechaVencimiento.split('-');
        for (let i = 0; i < gastoGuardado.cuotas_totales; i++) {
          const date = new Date(Number(year), Number(month) - 1 + i, Number(day));
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, '0');
          const d = String(date.getDate()).padStart(2, '0');
          nuevosGastos.push({
            titulo: gastoGuardado.titulo, monto: gastoGuardado.monto, categoria: gastoGuardado.categoria,
            fechaVencimiento: `${y}-${m}-${d}`, estado: 'pendiente', es_fijo: false,
            cuota_actual: i + 1, cuotas_totales: gastoGuardado.cuotas_totales, user_id: userId
          });
        }
        await supabase.from('gastos').insert(nuevosGastos);
        toast.success(`Se generaron ${gastoGuardado.cuotas_totales} cuotas 💳`);
      } else if (gastoAEditar) {
        await supabase.from('gastos').update({
          titulo: gastoGuardado.titulo, monto: gastoGuardado.monto,
          categoria: gastoGuardado.categoria, fechaVencimiento: gastoGuardado.fechaVencimiento, es_fijo: gastoGuardado.es_fijo
        }).eq('id', gastoAEditar.id);
        toast.success('Gasto actualizado');
      } else {
        await supabase.from('gastos').insert([{
          titulo: gastoGuardado.titulo, monto: gastoGuardado.monto, categoria: gastoGuardado.categoria,
          fechaVencimiento: gastoGuardado.fechaVencimiento, estado: 'pendiente', es_fijo: gastoGuardado.es_fijo, user_id: userId
        }]);
        toast.success('Gasto guardado');
      }
      fetchData();
      return true;
    } catch (error) { toast.error('Error al guardar'); return false; }
  };

  // 🔥 ACÁ ESTÁ LA MAGIA NUEVA PARA INGRESOS 🔥
  const guardarIngreso = async (ingresoData: Partial<Ingreso>, ingresoAEditar: Ingreso | null = null) => {
    if (!userId) return false;
    try {
      const nuevoIngreso = {
        titulo: ingresoData.titulo,
        monto: Number(ingresoData.monto),
        fecha: ingresoData.fecha || new Date().toISOString().split('T')[0]
      };

      if (ingresoAEditar) {
        const { error } = await supabase.from('ingresos').update(nuevoIngreso).eq('id', ingresoAEditar.id);
        if (error) throw error;
        toast.success('Ingreso actualizado ✏️');
      } else {
        const { error } = await supabase.from('ingresos').insert([{ ...nuevoIngreso, user_id: userId }]);
        if (error) throw error;
        toast.success('Ingreso registrado 💰');
      }
      await fetchData(); 
      return true;
    } catch (error: any) {
      toast.error(`Fallo al guardar: ${error.message}`);
      return false;
    }
  };

  const eliminarIngreso = async (id: string) => {
    try {
      setIngresos(actuales => actuales.filter(i => i.id !== id));
      await supabase.from('ingresos').delete().eq('id', id);
      toast.success('Ingreso eliminado');
      fetchData(); 
    } catch (error) { toast.error('Error al eliminar'); }
  };

  const guardarAhorro = async (ahorroGuardado: Partial<Ahorro>, ahorroAEditar: Ahorro | null) => {
    if (!userId) return false;
    try {
      if (ahorroAEditar) {
        const { error } = await supabase.from('ahorros').update({
          titulo: ahorroGuardado.titulo, monto: Number(ahorroGuardado.monto), fecha: ahorroGuardado.fecha
        }).eq('id', ahorroAEditar.id);
        if (error) throw error;
        toast.success('Ahorro actualizado');
      } else {
        const nuevoAhorro = {
          titulo: ahorroGuardado.titulo, monto: Number(ahorroGuardado.monto),
          fecha: ahorroGuardado.fecha || new Date().toISOString().split('T')[0], user_id: userId
        };
        const { error } = await supabase.from('ahorros').insert([nuevoAhorro]);
        if (error) throw error;
        toast.success('Ahorro guardado en la bóveda 🏦');
      }
      await fetchData(); 
      return true;
    } catch (error: any) { toast.error(`Fallo al guardar: ${error.message}`); return false; }
  };

  const eliminarAhorro = async (id: string) => {
    try { setAhorros(actuales => actuales.filter(a => a.id !== id)); await supabase.from('ahorros').delete().eq('id', id); toast.success('Ahorro retirado de la bóveda 💸'); fetchData(); } catch (error) { toast.error('Error al retirar'); }
  };

  const toggleGasto = async (id: string) => {
    const gasto = gastos.find(g => g.id === id);
    if (!gasto) return;
    const nuevo = gasto.estado === 'pendiente' ? 'pagado' : 'pendiente';
    setGastos(actuales => actuales.map(g => g.id === id ? { ...g, estado: nuevo } : g));
    await supabase.from('gastos').update({ estado: nuevo }).eq('id', id);
    fetchData(); 
  };

  const eliminarGasto = async (id: string) => {
    try { setGastos(actuales => actuales.filter(g => g.id !== id)); await supabase.from('gastos').delete().eq('id', id); toast.success('Eliminado'); fetchData(); } catch (error) { toast.error('Error al eliminar'); }
  };

  return {
    gastos, ingresos, categorias, ahorros, cargando,
    guardarGasto, guardarIngreso, eliminarIngreso, guardarAhorro, eliminarAhorro, toggleGasto, eliminarGasto, setCategorias, fetchData
  };
};