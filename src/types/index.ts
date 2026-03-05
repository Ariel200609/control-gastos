// Definimos las categorías básicas para organizar los gastos
export type Categoria = 'Servicios' | 'Impuestos' | 'Supermercado' | 'Vivienda' | 'Otros';

// Definimos los estados posibles de un gasto
export type EstadoGasto = 'pendiente' | 'pagado';

// Este es el "molde" principal de un Gasto
export interface Gasto {
  id: string;              // Un identificador único (ej: "1234-abcd")s
  titulo: string;          // El nombre del gasto (ej: "Luz Edes", "Gas Camuzzi")
  monto: number;           // Cuánto cuesta
  categoria: Categoria;    // Para después poder hacer gráficos (ej: "Servicios")
  fechaVencimiento: Date;  // Cuándo vence
  estado: EstadoGasto;     // Si ya se pagó o no
  fechaPago?: Date;        // Cuándo se pagó (el "?" significa que es opcional, porque si está pendiente, no hay fecha de pago)
}