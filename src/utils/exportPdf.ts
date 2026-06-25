import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Gasto } from '../types';

export const exportarAPdf = (gastos: Gasto[], nombreMes: string) => {
  const doc = new jsPDF();

  // Encabezado
  doc.setFontSize(20);
  doc.setTextColor(45, 106, 79); // eco-bosque
  doc.text(`Reporte de Gastos — ${nombreMes}`, 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado el ${new Date().toLocaleDateString('es-AR')}`, 14, 28);

  const total = gastos.reduce((sum, g) => sum + g.monto, 0);
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Total del período: $${total.toLocaleString('es-AR')}`, 14, 38);

  // Tabla
  const tableData = gastos.map(g => [
    g.fechaVencimiento,
    g.titulo,
    g.categoria,
    `$${g.monto.toLocaleString('es-AR')}`,
    g.estado.toUpperCase()
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Fecha', 'Título', 'Categoría', 'Monto', 'Estado']],
    body: tableData,
    headStyles: { fillColor: [45, 106, 79], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 246] },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  doc.save(`EcoHogar_Reporte_${nombreMes}.pdf`);
};
