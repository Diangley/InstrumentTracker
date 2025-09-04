import React from 'react';
import { FileText, CheckCircle, Clock, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { Instrument } from '../types';
import { isInstrumentExpired, isInstrumentExpiringSoon } from '../utils/formatters';

interface DashboardMetricsProps {
  instruments: Instrument[];
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ instruments }) => {
  const totalInstruments = instruments.length;
  const signedInstruments = instruments.filter(i => i.status === 'signed').length;
  const pendingInstruments = instruments.filter(i => i.status === 'pending').length;
  const expiredInstruments = instruments.filter(i => isInstrumentExpired(i.dueDate)).length;
  const expiringSoonInstruments = instruments.filter(i => isInstrumentExpiringSoon(i.dueDate)).length;
  
  const onTimePercentage = totalInstruments > 0 
    ? Math.round((signedInstruments / totalInstruments) * 100) 
    : 0;

  const metrics = [
    {
      title: 'Total de Instrumentos',
      value: totalInstruments,
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Instrumentos Assinados',
      value: signedInstruments,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pendentes',
      value: pendingInstruments,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Vencidos',
      value: expiredInstruments,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Taxa de Conclusão',
      value: `${onTimePercentage}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Vencem em 7 dias',
      value: expiringSoonInstruments,
      icon: Calendar,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className={`${metric.bgColor} rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className={`text-2xl font-bold ${metric.textColor}`}>{metric.value}</p>
              </div>
              <div className={`${metric.color} p-3 rounded-full`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
