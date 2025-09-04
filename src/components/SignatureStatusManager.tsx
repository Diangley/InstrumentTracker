import React from 'react';
import { CheckCircle, Clock, User } from 'lucide-react';
import { Instrument } from '../types';
import { formatDate } from '../utils/formatters';

interface SignatureStatusManagerProps {
  instrument: Instrument;
  onUpdateSignature: (
    responsibleId: string,
    status: 'pending' | 'signed',
    signatureDate?: string
  ) => void;
}

const SignatureStatusManager: React.FC<SignatureStatusManagerProps> = ({
  instrument,
  onUpdateSignature
}) => {
  const handleStatusChange = (
    responsibleId: string,
    status: 'pending' | 'signed'
  ) => {
    const signatureDate = status === 'signed' ? new Date().toISOString() : undefined;
    onUpdateSignature(responsibleId, status, signatureDate);
  };

  const StatusButton = ({ 
    status, 
    onToggle 
  }: { 
    status: 'pending' | 'signed' | undefined;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
        status === 'signed'
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-red-100 text-red-800 hover:bg-red-200'
      }`}
    >
      {status === 'signed' ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <Clock className="w-4 h-4" />
      )}
      {status === 'signed' ? 'Assinado' : 'Pendente'}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Responsibles */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Status de Assinatura - Responsáveis
        </h3>
        <div className="space-y-3">
          {instrument.responsibles.map(responsible => (
            <div key={responsible.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{responsible.name}</p>
                {responsible.email && <p className="text-sm text-gray-600">{responsible.email}</p>}
                {responsible.department && <p className="text-sm text-gray-600">Depto: {responsible.department}</p>}
                {responsible.signatureDate && (
                  <p className="text-sm text-green-600">
                    Assinado em: {formatDate(responsible.signatureDate)}
                  </p>
                )}
              </div>
              <StatusButton
                status={responsible.signatureStatus}
                onToggle={() => handleStatusChange(
                  responsible.id,
                  responsible.signatureStatus === 'signed' ? 'pending' : 'signed'
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignatureStatusManager;
