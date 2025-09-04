export interface Responsible {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department?: string;
  signatureStatus?: 'pending' | 'signed';
  signatureDate?: string;
}

export interface Entity {
  id: string;
  name: string;
  cnpj?: string;
  address?: string;
}

export interface InstrumentType {
  id: string;
  name: string;
  description?: string;
}

export interface InstrumentMovement {
  id: string;
  instrumentId: string;
  status: InstrumentStatus;
  description: string;
  date: string;
  userId: string;
  userName: string;
}

export type InstrumentStatus = 'pending' | 'in_progress' | 'signed' | 'expired';

export interface Instrument {
  id: string;
  title: string;
  description?: string;
  entities: Entity[];
  responsibles: Responsible[];
  status: InstrumentStatus;
  sentDate: string;
  signDate?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  typeId: string;
  value?: number;
  movements: InstrumentMovement[];
  attachments?: string[];
  tags?: string[];
}

export interface FilterOptions {
  status?: InstrumentStatus[];
  entity?: string[];
  responsible?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface DashboardMetrics {
  totalInstruments: number;
  signedInstruments: number;
  pendingInstruments: number;
  expiredInstruments: number;
  onTimePercentage: number;
  avgProcessingTime: number;
}

export interface InstrumentFormData {
  title: string;
  description: string;
  entities: Entity[];
  responsibles: Responsible[];
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  typeId: string;
  value?: number;
  tags: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  date: string;
  read: boolean;
  instrumentId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'analyst' | 'auditor';
  avatar?: string;
}
