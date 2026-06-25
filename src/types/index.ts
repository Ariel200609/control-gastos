export type EstadoGasto = 'pendiente' | 'pagado';
export type TipoNota = 'dia' | 'semana' | 'mes';

// 1. Nueva interfaz para la tabla dinámica de la base de datos
export interface Categoria {
    id: string;
    user_id?: string;
    nombre: string;
    color: string;
}

export interface Gasto {
    id: string;
    titulo: string;
    monto: number;
    categoria: string;
    fechaVencimiento: string; 
    estado: EstadoGasto;
    fechaPago?: string;       
    detalles?: string;
    es_fijo?: boolean;
    cuota_actual?: number;
    cuotas_totales?: number;
    created_by_name?: string;
    created_by_avatar?: string;
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

export interface Ahorro {
    id: string;
    titulo: string;
    monto: number;
    fecha: string;
}