export type Categoria = 'Servicios' | 'Impuestos' | 'Supermercado' | 'Vivienda' | 'Otros';
export type EstadoGasto = 'pendiente' | 'pagado';
export type TipoNota = 'dia' | 'semana' | 'mes';

export interface Gasto {
    id: string;
    titulo: string;
    monto: number;
    categoria: Categoria;
    fechaVencimiento: string; 
    estado: EstadoGasto;
    fechaPago?: string;       
    detalles?: string;
    es_fijo?: boolean;
}


export interface Nota {
    id: string;
    texto: string;
    tipo: TipoNota;
    completada: boolean;
    created_at?: string;
}

export interface Ingreso {
    id: string;
    titulo: string;
    monto: number;
    fecha: string;
    categoria: string;
    cobrado: boolean;
}