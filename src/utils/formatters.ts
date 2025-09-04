export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
};

export const formatDateTime = (date: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const getStatusColor = (status: string): string => {
  const colors = {
    signed: 'text-green-600 bg-green-50 border-green-200',
    in_progress: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    pending: 'text-red-600 bg-red-50 border-red-200',
    expired: 'text-red-700 bg-red-100 border-red-300'
  };
  return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const getStatusText = (status: string): string => {
  const texts = {
    signed: 'Assinado',
    in_progress: 'Em Andamento',
    pending: 'Pendente',
    expired: 'Vencido'
  };
  return texts[status as keyof typeof texts] || status;
};

export const getPriorityColor = (priority: string): string => {
  const colors = {
    high: 'text-red-600 bg-red-50',
    medium: 'text-yellow-600 bg-yellow-50',
    low: 'text-green-600 bg-green-50'
  };
  return colors[priority as keyof typeof colors] || 'text-gray-600 bg-gray-50';
};

export const getPriorityText = (priority: string): string => {
  const texts = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa'
  };
  return texts[priority as keyof typeof texts] || priority;
};

export const isInstrumentExpiringSoon = (dueDate: string, days: number = 7): boolean => {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays > 0;
};

export const isInstrumentExpired = (dueDate: string): boolean => {
  const due = new Date(dueDate);
  const today = new Date();
  return due < today;
};
