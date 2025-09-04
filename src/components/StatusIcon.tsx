import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { InstrumentStatus } from '../types';

interface StatusIconProps {
  status: InstrumentStatus;
  className?: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, className = "w-5 h-5" }) => {
  switch (status) {
    case 'signed':
      return <CheckCircle className={`${className} text-green-600`} />;
    case 'in_progress':
      return <Clock className={`${className} text-yellow-600`} />;
    case 'pending':
      return <AlertCircle className={`${className} text-red-600`} />;
    case 'expired':
      return <XCircle className={`${className} text-red-700`} />;
    default:
      return <AlertCircle className={`${className} text-gray-600`} />;
  }
};

export default StatusIcon;
