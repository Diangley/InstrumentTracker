import React from 'react';
import { Building, User, Calendar, DollarSign, Tag, Edit, Trash2 } from 'lucide-react';
import { Instrument } from '../types';
import { formatDate, formatCurrency, getStatusColor, getStatusText, getPriorityColor, getPriorityText, isInstrumentExpiringSoon } from '../utils/formatters';
import { instrumentTypes } from '../data/mockData';
import StatusIcon from './StatusIcon';

interface InstrumentCardProps {
  instrument: Instrument;
  onClick: (instrument: Instrument) => void;
  onEdit?: (instrument: Instrument) => void;
  onDelete?: (instrument: Instrument) => void;
}

const InstrumentCard: React.FC<InstrumentCardProps> = ({ instrument, onClick, onEdit, onDelete }) => {
  const isExpiringSoon = isInstrumentExpiringSoon(instrument.dueDate);
  const type = instrumentTypes.find(t => t.id === instrument.typeId);
  
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1" onClick={() => onClick(instrument)}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {instrument.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{instrument.description}</p>
        </div>
        <div className="flex items-center gap-2 ml-4" onClick={() => onClick(instrument)}>
          <StatusIcon status={instrument.status} />
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(instrument.status)}`}>
            {getStatusText(instrument.status)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 mb-4">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(instrument);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Editar instrumento"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(instrument);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Excluir instrumento"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Details */}
      <div className="space-y-3 mb-4" onClick={() => onClick(instrument)}>
        <div className="flex items-center text-sm text-gray-600">
          <Building className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{instrument.entities.map(e => e.name).join(', ')}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{instrument.responsibles.map(r => r.name).join(', ')}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>
            <strong>Enviado:</strong> {formatDate(instrument.sentDate)}
          </span>
        </div>
      </div>

      {/* Value and Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4" onClick={() => onClick(instrument)}>
        {instrument.value && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="font-medium">{formatCurrency(instrument.value)}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>
            <strong>Vence:</strong> {formatDate(instrument.dueDate)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100" onClick={() => onClick(instrument)}>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(instrument.priority)}`}>
            {getPriorityText(instrument.priority)}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
            {type?.name || 'Tipo não definido'}
          </span>
        </div>
        
        {isExpiringSoon && (
          <div className="flex items-center text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
            <Calendar className="w-3 h-3 mr-1" />
            Vence em breve
          </div>
        )}
      </div>

      {/* Tags */}
      {instrument.tags && instrument.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1" onClick={() => onClick(instrument)}>
          {instrument.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-50 text-gray-600">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
          {instrument.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-50 text-gray-600">
              +{instrument.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default InstrumentCard;
