import { useState, useEffect, useMemo } from 'react';
import type { Gasto, Ingreso, Ahorro } from '../types';

export const useFiltros = (gastos: Gasto[], ingresos: Ingreso[], ahorros: Ahorro[], vistaActual: string) => {
  // 1. ESTADOS DE INTERFAZ
  const [mesFiltro, setMesFiltro] = useState(new Date().getMonth() + 1);
  const [anioFiltro, setAnioFiltro] = useState(new Date().getFullYear());
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pagado' | 'pendiente'>('todos');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const [ordenGastos, setOrdenGastos] = useState<'fecha-asc' | 'fecha-desc' | 'monto-asc' | 'monto-desc' | 'fijos'>(() => {
    return (localStorage.getItem('ecoHogar_ordenGastos') as any) || 'fecha-asc';
  });

  const [vistaCompacta, setVistaCompacta] = useState(() => {
    return localStorage.getItem('ecoHogar_compacto') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('ecoHogar_ordenGastos', ordenGastos);
    localStorage.setItem('ecoHogar_compacto', vistaCompacta.toString());
  }, [ordenGastos, vistaCompacta]);

  const mesActual = new Date().getMonth() + 1;
  const anioActual = new Date().getFullYear();

  const coincidenciaDeMes = (fechaStr: string) => {
    const [year, month] = fechaStr.split('-');
    return (vistaActual === 'inicio' || vistaActual === 'graficos')
      ? parseInt(month, 10) === mesActual && parseInt(year, 10) === anioActual
      : parseInt(month, 10) === mesFiltro && parseInt(year, 10) === anioFiltro;
  };

  // 2. USEMEMO: Filtros de las listas (solo recalcula si cambian los datos o el filtro)
  const gastosFiltrados = useMemo(() => {
    return gastos
      .filter(g => {
        if (!coincidenciaDeMes(g.fechaVencimiento)) return false;
        if (vistaActual === 'historial') {
          if (filtroEstado !== 'todos' && g.estado !== filtroEstado) return false;
          if (categoriaActiva !== 'Todos' && g.categoria !== categoriaActiva) return false;
          if (busqueda.trim() && !g.titulo.toLowerCase().includes(busqueda.toLowerCase())) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (ordenGastos === 'fecha-asc') return new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime();
        if (ordenGastos === 'fecha-desc') return new Date(b.fechaVencimiento).getTime() - new Date(a.fechaVencimiento).getTime();
        if (ordenGastos === 'monto-desc') return b.monto - a.monto;
        if (ordenGastos === 'monto-asc') return a.monto - b.monto;
        if (ordenGastos === 'fijos') {
          if (a.es_fijo === b.es_fijo) return new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime();
          return a.es_fijo ? -1 : 1;
        }
        return 0;
      });
  }, [gastos, vistaActual, mesFiltro, anioFiltro, filtroEstado, categoriaActiva, busqueda, ordenGastos]);

  const ingresosFiltrados = useMemo(() => ingresos.filter(i => coincidenciaDeMes(i.fecha)), [ingresos, vistaActual, mesFiltro, anioFiltro]);
  const ahorrosFiltrados = useMemo(() => ahorros.filter(a => coincidenciaDeMes(a.fecha)), [ahorros, vistaActual, mesFiltro, anioFiltro]);

  // 3. MATEMÁTICA CON MEMORIA CACHÉ (Incluye lógica de cuotas futuras)
  const totales = useMemo(() => {
    // Totales del mes en curso (o el filtrado)
    const totalMensual = gastosFiltrados.reduce((total, gasto) => total + gasto.monto, 0);
    const totalPagado = gastosFiltrados.filter(g => g.estado === 'pagado').reduce((total, gasto) => total + gasto.monto, 0);
    const totalPendiente = totalMensual - totalPagado;
    const totalIngresosMes = ingresosFiltrados.reduce((total, ingreso) => total + ingreso.monto, 0);
    const totalAhorrosMes = ahorrosFiltrados.reduce((total, ahorro) => total + ahorro.monto, 0);
    
    // Totales Históricos
    const totalAhorrosGlobal = ahorros.reduce((total, ahorro) => total + ahorro.monto, 0);
    const totalIngresosGlobal = ingresos.reduce((total, ingreso) => total + ingreso.monto, 0);
    
    // LÓGICA DE BILLETERA INTELIGENTE: Ignora cuotas futuras pendientes
    const totalGastosGlobal = gastos.reduce((total, gasto) => {
      const [yearStr, monthStr] = gasto.fechaVencimiento.split('-');
      const gastoYear = Number(yearStr);
      const gastoMonth = Number(monthStr);

      // Si ya lo pagaste, se resta siempre (la plata ya no la tenés)
      if (gasto.estado === 'pagado') {
        return total + (gasto.monto || 0);
      }

      // Si está pendiente, solo lo restamos si vence este mes o en un mes anterior
      if (gastoYear < anioActual || (gastoYear === anioActual && gastoMonth <= mesActual)) {
        return total + (gasto.monto || 0);
      }
      
      // Si es una cuota a futuro, NO la restamos hoy
      return total;
    }, 0);

    const saldoBilletera = totalIngresosGlobal - totalGastosGlobal - totalAhorrosGlobal;

    // Comparación vs. mes anterior
    const mesAnteriorNum = mesActual === 1 ? 12 : mesActual - 1;
    const anioMesAnterior = mesActual === 1 ? anioActual - 1 : anioActual;
    const totalMesAnterior = gastos
      .filter(g => {
        const [y, m] = g.fechaVencimiento.split('-');
        return parseInt(m, 10) === mesAnteriorNum && parseInt(y, 10) === anioMesAnterior;
      })
      .reduce((t, g) => t + g.monto, 0);

    const variacionMensual = totalMesAnterior > 0 
      ? Math.round(((totalMensual - totalMesAnterior) / totalMesAnterior) * 100) 
      : 0;

    return {
      totalMensual, totalPagado, totalPendiente, totalIngresosMes, totalAhorrosMes,
      totalAhorrosGlobal, saldoBilletera, totalMesAnterior, variacionMensual
    };
  }, [gastosFiltrados, ingresosFiltrados, ahorrosFiltrados, ahorros, ingresos, gastos, mesActual, anioActual]);

  // 4. GASTOS PRÓXIMOS A VENCER (para alertas)
  const gastosProximos = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    const pasadoManana = new Date(hoy);
    pasadoManana.setDate(pasadoManana.getDate() + 2);

    return gastos
      .filter(g => {
        if (g.estado === 'pagado') return false;
        const [y, m, d] = g.fechaVencimiento.split('-');
        const fechaVenc = new Date(Number(y), Number(m) - 1, Number(d));
        fechaVenc.setHours(0, 0, 0, 0);
        // Vencidos, vence hoy, o vence mañana
        return fechaVenc.getTime() <= pasadoManana.getTime();
      })
      .sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime());
  }, [gastos]);

  return {
    mesFiltro, setMesFiltro, anioFiltro, setAnioFiltro,
    filtroEstado, setFiltroEstado, categoriaActiva, setCategoriaActiva,
    busqueda, setBusqueda, ordenGastos, setOrdenGastos,
    vistaCompacta, setVistaCompacta,
    gastosFiltrados, 
    ingresosFiltrados,
    ahorrosFiltrados,
    gastosProximos,
    mesActual, anioActual, totales
  };
};