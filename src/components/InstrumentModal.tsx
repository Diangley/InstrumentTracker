import React from 'react';
import { X, Building, User, Calendar, DollarSign, Tag, Clock, FileText, Download } from 'lucide-react';
import { Instrument } from '../types';
import { formatDate, formatDateTime, formatCurrency, getStatusColor, getStatusText, getPriorityColor, getPriorityText } from '../utils/formatters';
import { instrumentTypes } from '../data/mockData';
import StatusIcon from './StatusIcon';
import SignatureStatusManager from './SignatureStatusManager';
import { exportDetailedToPDF } from '../utils/exportUtils';

interface InstrumentModalProps {
  instrument: Instrument;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSignature?: (
    instrumentId: string,
    responsibleId: string,
    status: 'pending' | 'signed',
    signatureDate?: string
  ) => void;
}

const InstrumentModal: React.FC<InstrumentModalProps> = ({ instrument, isOpen, onClose, onUpdateSignature }) => {
  if (!isOpen) return null;

  const type = instrumentTypes.find(t => t.id === instrument.typeId);

  const handleUpdateSignature = (
    responsibleId: string,
    status: 'pending' | 'signed',
    signatureDate?: string
  ) => {
    if (onUpdateSignature) {
      onUpdateSignature(instrument.id, responsibleId, status, signatureDate);
    }
  };

  const handleExportPDF = () => {
    exportDetailedToPDF(instrument);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <StatusIcon status={instrument.status} className="w-6 h-6" />
            <h2 className="text-2xl font-bold text-gray-900">{instrument.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-4 mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(instrument.status)}`}>
              {getStatusText(instrument.status)}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${getPriorityColor(instrument.priority)}`}>
              Prioridade: {getPriorityText(instrument.priority)}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-600">
              {type?.name || 'Tipo não definido'}
            </span>
          </div>

          {/* Description */}
          {instrument.description && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-600 leading-relaxed">{instrument.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Entity Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Entidades
              </h3>
              <div className="space-y-2">
                {instrument.entities.map(entity => (
                  <div key={entity.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                    <p className="text-gray-900 font-medium">{entity.name}</p>
                    {entity.cnpj && (
                      <p className="text-gray-600 text-sm">CNPJ: {entity.cnpj}</p>
                    )}
                    {entity.address && (
                      <p className="text-gray-600 text-sm">{entity.address}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Responsible Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Responsáveis
              </h3>
              <div className="space-y-2">
                {instrument.responsibles.map(responsible => (
                  <div key={responsible.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                    <p className="text-gray-900 font-medium">{responsible.name}</p>
                    {responsible.email && <p className="text-gray-600 text-sm">{responsible.email}</p>}
                    {responsible.phone && (
                      <p className="text-gray-600 text-sm">{responsible.phone}</p>
                    )}
                    {responsible.department && (
                      <p className="text-gray-600 text-sm">Depto: {responsible.department}</p>
                    )}
                    <p className={`text-sm font-medium ${responsible.signatureStatus === 'signed' ? 'text-green-600' : 'text-red-600'}`}>
                      {responsible.signatureStatus === 'signed' ? 'Assinado' : 'Pendente'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial and Dates */}
            <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Informações Financeiras e Datas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {instrument.value && (
                  <div>
                    <p className="text-sm text-gray-600">Valor</p>
                    <p className="text-gray-900 font-medium">{formatCurrency(instrument.value)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Data de Envio</p>
                  <p className="text-gray-900 font-medium">{formatDate(instrument.sentDate)}</p>
                </div>
                {instrument.signDate && (
                  <div>
                    <p className="text-sm text-gray-600">Data de Assinatura</p>
                    <p className="text-gray-900 font-medium">{formatDate(instrument.signDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Data de Vencimento</p>
                  <p className="text-gray-900 font-medium">{formatDate(instrument.dueDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Status Manager */}
          {onUpdateSignature && (
            <div className="mb-6">
              <SignatureStatusManager
                instrument={instrument}
                onUpdateSignature={handleUpdateSignature}
              />
            </div>
          )}

          {/* Tags */}
          {instrument.tags && instrument.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {instrument.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-blue-50 text-blue-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Histórico de Movimentações
            </h3>
            <div className="space-y-4">
              {instrument.movements.map((movement, index) => (
                <div key={movement.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex-shrink-0">
                    <StatusIcon status={movement.status} className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(movement.status)}`}>
                        {getStatusText(movement.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDateTime(movement.date)}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-1">{movement.description}</p>
                    <p className="text-sm text-gray-500">Por: {movement.userName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentModal;
