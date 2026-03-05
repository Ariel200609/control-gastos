export type Categoria = 'Servicios' | 'Impuestos' | 'Supermercado' | 'Vivienda' | 'Otros';
export type EstadoGasto = 'pendiente' | 'pagado';

export interface Gasto {
    id: string;
    titulo: string;
    monto: number;
    categoria: Categoria;
    fechaVencimiento: string; // <-- Lo cambiamos a string
    estado: EstadoGasto;
    fechaPago?: string;       // <-- Lo cambiamos a string
}