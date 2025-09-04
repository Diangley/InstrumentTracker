import React from 'react';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import { Instrument } from '../types';
import { isInstrumentExpiringSoon, isInstrumentExpired, formatDate } from '../utils/formatters';
import InstrumentCard from './InstrumentCard';

interface PriorityTodayProps {
  instruments: Instrument[];
  onInstrumentClick: (instrument: Instrument) => void;
}

const PriorityToday: React.FC<PriorityTodayProps> = ({ instruments, onInstrumentClick }) => {
  const expiredInstruments = instruments.filter(i => isInstrumentExpired(i.dueDate));
  const expiringSoonInstruments = instruments.filter(i => isInstrumentExpiringSoon(i.dueDate));
  const highPriorityPending = instruments.filter(i => i.priority === 'high' && i.status === 'pending');

  const priorityInstruments = [
    ...expiredInstruments.map(i => ({ ...i, priorityReason: 'Vencido' })),
    ...expiringSoonInstruments.map(i => ({ ...i, priorityReason: 'Vence em breve' })),
    ...highPriorityPending.map(i => ({ ...i, priorityReason: 'Alta prioridade' }))
  ];

  // Remove duplicates
  const uniquePriorityInstruments = priorityInstruments.filter((instrument, index, self) =>
    index === self.findIndex(i => i.id === instrument.id)
  );

  if (uniquePriorityInstruments.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-500 p-2 rounded-full">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-green-800">Prioridades do Dia</h2>
        </div>
        <p className="text-green-700">Nenhum instrumento requer atenção urgente hoje! 🎉</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-orange-500 p-2 rounded-full">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Prioridades do Dia</h2>
        <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {uniquePriorityInstruments.length}
        </span>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
        <p className="text-orange-800 text-sm">
          Instrumentos que precisam de atenção imediata: vencidos, vencendo em breve ou de alta prioridade.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {uniquePriorityInstruments.map((instrument) => (
          <div key={instrument.id} className="relative">
            <div className="absolute -top-2 -right-2 z-10">
              <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {instrument.priorityReason}
              </span>
            </div>
            <InstrumentCard
              instrument={instrument}
              onClick={onInstrumentClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityToday;
