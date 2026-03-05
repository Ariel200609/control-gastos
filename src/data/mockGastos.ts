import type { Gasto } from '../types';

export const gastosIniciales: Gasto[] = [
  {
    id: '1',
    titulo: 'Luz (EDES)',
    monto: 25500,
    categoria: 'Servicios',
    fechaVencimiento: new Date(2026, 2, 10), // 10 de Marzo de 2026
    estado: 'pendiente'
  },
  {
    id: '2',
    titulo: 'Gas (Camuzzi)',
    monto: 18000,
    categoria: 'Servicios',
    fechaVencimiento: new Date(2026, 2, 12),
    estado: 'pagado',
    fechaPago: new Date(2026, 2, 2)
  },
  {
    id: '3',
    titulo: 'Supermercado',
    monto: 85000,
    categoria: 'Supermercado',
    fechaVencimiento: new Date(2026, 2, 15),
    estado: 'pendiente'
  }
];