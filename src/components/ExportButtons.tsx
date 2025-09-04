import React from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Instrument } from '../types';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

interface ExportButtonsProps {
  instruments: Instrument[];
  title?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ instruments, title = 'Relatório de Instrumentos' }) => {
  const handleExportPDF = () => {
    exportToPDF(instruments, title);
  };

  const handleExportExcel = () => {
    exportToExcel(instruments, title);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 mr-2">Exportar:</span>
      <button
        onClick={handleExportPDF}
        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
      >
        <FileText className="w-4 h-4" />
        PDF
      </button>
      <button
        onClick={handleExportExcel}
        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Excel
      </button>
    </div>
  );
};

export default ExportButtons;
