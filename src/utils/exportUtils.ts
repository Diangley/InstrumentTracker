import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Instrument } from '../types';
import { formatDate, formatCurrency } from './formatters';

export const exportToPDF = (instruments: Instrument[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Relatório de Instrumentos Contratuais', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Gerado em: ${formatDate(new Date())}`, 20, 30);
  doc.text(`Total de instrumentos: ${instruments.length}`, 20, 40);
  
  // Table data
  const tableData = instruments.map(instrument => [
    instrument.title,
    instrument.type,
    instrument.entities.join(', '),
    instrument.responsibles.map(r => r.name).join(', '),
    instrument.status,
    formatDate(instrument.sentDate),
    instrument.dueDate ? formatDate(instrument.dueDate) : 'N/A',
    instrument.value ? formatCurrency(instrument.value) : 'N/A'
  ]);
  
  autoTable(doc, {
    head: [['Título', 'Tipo', 'Entidades', 'Responsáveis', 'Status', 'Envio', 'Vencimento', 'Valor']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  
  doc.save('relatorio-instrumentos.pdf');
};

export const exportToExcel = (instruments: Instrument[]) => {
  const worksheetData = instruments.map(instrument => ({
    'Título': instrument.title,
    'Tipo': instrument.type,
    'Descrição': instrument.description,
    'Entidades': instrument.entities.join(', '),
    'Responsáveis': instrument.responsibles.map(r => r.name).join(', '),
    'Status': instrument.status,
    'Prioridade': instrument.priority,
    'Data de Envio': formatDate(instrument.sentDate),
    'Data de Vencimento': instrument.dueDate ? formatDate(instrument.dueDate) : '',
    'Valor': instrument.value ? formatCurrency(instrument.value) : '',
    'Tags': instrument.tags.join(', '),
    'Criado em': formatDate(instrument.createdAt),
    'Atualizado em': formatDate(instrument.updatedAt)
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  
  // Auto-size columns
  const colWidths = Object.keys(worksheetData[0] || {}).map(key => ({
    wch: Math.max(key.length, 15)
  }));
  worksheet['!cols'] = colWidths;
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Instrumentos');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(blob, 'relatorio-instrumentos.xlsx');
};

export const exportDetailedToPDF = (instrument: Instrument) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text('Detalhes do Instrumento', 20, 20);
  
  // Basic info
  let yPos = 40;
  doc.setFontSize(12);
  
  const addLine = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 60, yPos);
    yPos += 10;
  };
  
  addLine('Título', instrument.title);
  addLine('Tipo', instrument.type);
  addLine('Status', instrument.status);
  addLine('Prioridade', instrument.priority);
  addLine('Data de Envio', formatDate(instrument.sentDate));
  addLine('Data de Vencimento', instrument.dueDate ? formatDate(instrument.dueDate) : 'N/A');
  addLine('Valor', instrument.value ? formatCurrency(instrument.value) : 'N/A');
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Descrição:', 20, yPos);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  const splitDescription = doc.splitTextToSize(instrument.description, 170);
  doc.text(splitDescription, 20, yPos);
  yPos += splitDescription.length * 5 + 10;
  
  // Entities
  doc.setFont('helvetica', 'bold');
  doc.text('Entidades:', 20, yPos);
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  instrument.entities.forEach(entity => {
    doc.text(`• ${entity}`, 25, yPos);
    yPos += 7;
  });
  
  yPos += 5;
  
  // Responsibles with signatures
  doc.setFont('helvetica', 'bold');
  doc.text('Responsáveis e Status de Assinatura:', 20, yPos);
  yPos += 10;
  
  const responsibleData = instrument.responsibles.map(responsible => [
    responsible.name,
    responsible.position,
    responsible.email || 'N/A',
    responsible.signatureStatus || 'Pendente'
  ]);
  
  autoTable(doc, {
    head: [['Nome', 'Cargo', 'Email', 'Status Assinatura']],
    body: responsibleData,
    startY: yPos,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 20;
  
  // Movement history
  if (instrument.movements && instrument.movements.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Histórico de Movimentações:', 20, yPos);
    yPos += 10;
    
    const movementData = instrument.movements.map(movement => [
      formatDate(movement.date),
      movement.action,
      movement.user,
      movement.description || ''
    ]);
    
    autoTable(doc, {
      head: [['Data', 'Ação', 'Usuário', 'Descrição']],
      body: movementData,
      startY: yPos,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [34, 197, 94] }
    });
  }
  
  doc.save(`instrumento-${instrument.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
};
