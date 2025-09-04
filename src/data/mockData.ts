import { Instrument, Responsible, Entity, InstrumentType, InstrumentMovement } from '../types';
import { Notification, UserProfile } from '../types';

export const responsibles: Responsible[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@empresa.com',
    phone: '(11) 99999-0001',
    department: 'Jurídico'
  },
  {
    id: '2',
    name: 'Carlos Santos',
    email: 'carlos.santos@empresa.com',
    phone: '(11) 99999-0002',
    department: 'Comercial'
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    phone: '(11) 99999-0003',
    department: 'Operações'
  }
];

export const entities: Entity[] = [
  {
    id: '1',
    name: 'TechCorp Ltda',
    cnpj: '12.345.678/0001-90',
    address: 'São Paulo, SP'
  },
  {
    id: '2',
    name: 'Indústria Brasil S.A.',
    cnpj: '98.765.432/0001-10',
    address: 'Rio de Janeiro, RJ'
  },
  {
    id: '3',
    name: 'Comercial Norte Ltda',
    cnpj: '11.222.333/0001-44',
    address: 'Brasília, DF'
  },
  {
    id: '4',
    name: 'Regional Sudeste',
    address: 'São Paulo, SP'
  },
  {
    id: '5',
    name: 'Regional Nordeste',
    address: 'Salvador, BA'
  }
];

export const instrumentTypes: InstrumentType[] = [
  {
    id: '1',
    name: 'Contrato de Fornecimento',
    description: 'Contratos para fornecimento de produtos ou serviços'
  },
  {
    id: '2',
    name: 'Acordo de Parceria',
    description: 'Acordos de parceria comercial ou estratégica'
  },
  {
    id: '3',
    name: 'Contrato de Prestação de Serviços',
    description: 'Contratos para prestação de serviços especializados'
  },
  {
    id: '4',
    name: 'Contrato de Licenciamento',
    description: 'Contratos de licenciamento de software ou tecnologia'
  }
];

const movements: InstrumentMovement[] = [
  {
    id: '1',
    instrumentId: '1',
    status: 'pending',
    description: 'Instrumento criado e enviado para análise',
    date: '2024-01-10T10:00:00Z',
    userId: '1',
    userName: 'Sistema'
  },
  {
    id: '2',
    instrumentId: '1',
    status: 'in_progress',
    description: 'Instrumento em análise jurídica',
    date: '2024-01-12T14:30:00Z',
    userId: '1',
    userName: 'Ana Silva'
  },
  {
    id: '3',
    instrumentId: '1',
    status: 'signed',
    description: 'Instrumento assinado por todas as partes',
    date: '2024-01-15T16:45:00Z',
    userId: '1',
    userName: 'Ana Silva'
  }
];

export const instruments: Instrument[] = [
  {
    id: '1',
    title: 'Instrumento de Fornecimento de Software',
    description: 'Desenvolvimento e manutenção de sistema ERP',
    entities: [{ ...entities[0] }],
    responsibles: [{ ...responsibles[0], signatureStatus: 'signed', signatureDate: '2024-01-15T16:45:00Z' }],
    status: 'signed',
    sentDate: '2024-01-10T10:00:00Z',
    signDate: '2024-01-15T16:45:00Z',
    dueDate: '2024-01-20T23:59:59Z',
    priority: 'high',
    typeId: '1',
    value: 150000,
    movements: movements.filter(m => m.instrumentId === '1'),
    tags: ['software', 'erp', 'tecnologia']
  },
  {
    id: '2',
    title: 'Acordo de Parceria Comercial',
    description: 'Parceria para distribuição de produtos',
    entities: [{ ...entities[1] }],
    responsibles: [{ ...responsibles[1], signatureStatus: 'pending' }],
    status: 'in_progress',
    sentDate: '2024-01-05T09:00:00Z',
    dueDate: '2025-01-30T23:59:59Z',
    priority: 'medium',
    typeId: '2',
    value: 250000,
    movements: [
      {
        id: '4',
        instrumentId: '2',
        status: 'pending',
        description: 'Instrumento enviado para empresa parceira',
        date: '2024-01-05T09:00:00Z',
        userId: '2',
        userName: 'Carlos Santos'
      },
      {
        id: '5',
        instrumentId: '2',
        status: 'in_progress',
        description: 'Em análise pelo departamento comercial',
        date: '2024-01-08T11:20:00Z',
        userId: '2',
        userName: 'Carlos Santos'
      }
    ],
    tags: ['parceria', 'distribuição', 'comercial']
  },
  {
    id: '3',
    title: 'Instrumento de Prestação de Serviços',
    description: 'Serviços de manutenção industrial',
    entities: [{ ...entities[2] }],
    responsibles: [{ ...responsibles[2], signatureStatus: 'pending' }],
    status: 'pending',
    sentDate: '2024-01-20T08:30:00Z',
    dueDate: '2025-01-25T23:59:59Z',
    priority: 'high',
    typeId: '3',
    value: 80000,
    movements: [
      {
        id: '6',
        instrumentId: '3',
        status: 'pending',
        description: 'Instrumento criado e aguardando envio',
        date: '2024-01-20T08:30:00Z',
        userId: '3',
        userName: 'Maria Oliveira'
      }
    ],
    tags: ['serviços', 'manutenção', 'industrial']
  },
  {
    id: '4',
    title: 'Instrumento de Licenciamento',
    description: 'Licença de uso de software especializado',
    entities: [{ ...entities[0] }],
    responsibles: [{ ...responsibles[0], signatureStatus: 'pending' }],
    status: 'expired',
    sentDate: '2024-01-01T10:00:00Z',
    dueDate: '2024-01-15T23:59:59Z',
    priority: 'low',
    typeId: '4',
    value: 45000,
    movements: [
      {
        id: '7',
        instrumentId: '4',
        status: 'pending',
        description: 'Instrumento enviado para análise',
        date: '2024-01-01T10:00:00Z',
        userId: '1',
        userName: 'Ana Silva'
      }
    ],
    tags: ['licença', 'software', 'especializado']
  }
];

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'Instrumento vencendo em breve',
    message: 'O instrumento "Prestação de Serviços" vence em 2 dias',
    type: 'warning',
    date: new Date().toISOString(),
    read: false,
    instrumentId: '3'
  },
  {
    id: '2',
    title: 'Novo instrumento assinado',
    message: 'Instrumento "Fornecimento de Software" foi totalmente assinado',
    type: 'success',
    date: new Date(Date.now() - 86400000).toISOString(),
    read: false,
    instrumentId: '1'
  },
  {
    id: '3',
    title: 'Instrumento vencido',
    message: 'O instrumento "Licenciamento" está vencido há 10 dias',
    type: 'error',
    date: new Date(Date.now() - 172800000).toISOString(),
    read: true,
    instrumentId: '4'
  }
];

export const currentUser: UserProfile = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@empresa.com',
  role: 'admin'
};
