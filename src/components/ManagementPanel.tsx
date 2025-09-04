import React, { useState } from 'react';
import { Building, User, FileText, Plus, Edit, Trash2, X } from 'lucide-react';
import { entities as initialEntities, responsibles as initialResponsibles, instrumentTypes as initialInstrumentTypes } from '../data/mockData';
import { Entity, Responsible, InstrumentType } from '../types';

interface ManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManagementPanel: React.FC<ManagementPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'entities' | 'responsibles' | 'types'>('entities');
  const [entities, setEntities] = useState<Entity[]>(initialEntities);
  const [responsibles, setResponsibles] = useState<Responsible[]>(initialResponsibles);
  const [instrumentTypes, setInstrumentTypes] = useState<InstrumentType[]>(initialInstrumentTypes);
  
  // Form states
  const [showEntityForm, setShowEntityForm] = useState(false);
  const [showResponsibleForm, setShowResponsibleForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);
  
  // Edit states
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [editingResponsible, setEditingResponsible] = useState<Responsible | null>(null);
  const [editingType, setEditingType] = useState<InstrumentType | null>(null);

  // Form data states
  const [entityForm, setEntityForm] = useState({ name: '', cnpj: '', address: '' });
  const [responsibleForm, setResponsibleForm] = useState({ name: '', email: '', phone: '', department: '' });
  const [typeForm, setTypeForm] = useState({ name: '', description: '' });

  if (!isOpen) return null;

  const resetForms = () => {
    setEntityForm({ name: '', cnpj: '', address: '' });
    setResponsibleForm({ name: '', email: '', phone: '', department: '' });
    setTypeForm({ name: '', description: '' });
    setEditingEntity(null);
    setEditingResponsible(null);
    setEditingType(null);
  };

  const handleEditEntity = (entity: Entity) => {
    setEditingEntity(entity);
    setEntityForm({
      name: entity.name,
      cnpj: entity.cnpj || '',
      address: entity.address || ''
    });
    setShowEntityForm(true);
  };

  const handleEditResponsible = (responsible: Responsible) => {
    setEditingResponsible(responsible);
    setResponsibleForm({
      name: responsible.name,
      email: responsible.email || '',
      phone: responsible.phone || '',
      department: responsible.department || ''
    });
    setShowResponsibleForm(true);
  };

  const handleEditType = (type: InstrumentType) => {
    setEditingType(type);
    setTypeForm({
      name: type.name,
      description: type.description || ''
    });
    setShowTypeForm(true);
  };

  const handleSaveEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntity) {
      setEntities(entities.map(e => 
        e.id === editingEntity.id 
          ? { ...e, ...entityForm }
          : e
      ));
    } else {
      const newEntity: Entity = {
        id: Date.now().toString(),
        ...entityForm
      };
      setEntities([...entities, newEntity]);
    }
    setShowEntityForm(false);
    resetForms();
  };

  const handleSaveResponsible = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResponsible) {
      setResponsibles(responsibles.map(r => 
        r.id === editingResponsible.id 
          ? { ...r, ...responsibleForm }
          : r
      ));
    } else {
      const newResponsible: Responsible = {
        id: Date.now().toString(),
        ...responsibleForm
      };
      setResponsibles([...responsibles, newResponsible]);
    }
    setShowResponsibleForm(false);
    resetForms();
  };

  const handleSaveType = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      setInstrumentTypes(instrumentTypes.map(t => 
        t.id === editingType.id 
          ? { ...t, ...typeForm }
          : t
      ));
    } else {
      const newType: InstrumentType = {
        id: Date.now().toString(),
        ...typeForm
      };
      setInstrumentTypes([...instrumentTypes, newType]);
    }
    setShowTypeForm(false);
    resetForms();
  };

  const handleDeleteEntity = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta entidade?')) {
      setEntities(entities.filter(e => e.id !== id));
    }
  };

  const handleDeleteResponsible = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este responsável?')) {
      setResponsibles(responsibles.filter(r => r.id !== id));
    }
  };

  const handleDeleteType = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo de instrumento?')) {
      setInstrumentTypes(instrumentTypes.filter(t => t.id !== id));
    }
  };

  const tabs = [
    { id: 'entities', label: 'Entidades', icon: Building, count: entities.length },
    { id: 'responsibles', label: 'Responsáveis', icon: User, count: responsibles.length },
    { id: 'types', label: 'Tipos de Instrumentos', icon: FileText, count: instrumentTypes.length }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Cadastros</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Entities Tab */}
          {activeTab === 'entities' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Entidades Cadastradas</h3>
                <button
                  onClick={() => {
                    resetForms();
                    setShowEntityForm(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Nova Entidade
                </button>
              </div>

              {showEntityForm && (
                <form onSubmit={handleSaveEntity} className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">
                    {editingEntity ? 'Editar Entidade' : 'Nova Entidade'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                      <input
                        type="text"
                        required
                        value={entityForm.name}
                        onChange={(e) => setEntityForm({ ...entityForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                      <input
                        type="text"
                        value={entityForm.cnpj}
                        onChange={(e) => setEntityForm({ ...entityForm, cnpj: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                      <input
                        type="text"
                        value={entityForm.address}
                        onChange={(e) => setEntityForm({ ...entityForm, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEntityForm(false);
                        resetForms();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {editingEntity ? 'Salvar' : 'Criar'}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {entities.map(entity => (
                  <div key={entity.id} className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{entity.name}</p>
                      {entity.cnpj && <p className="text-sm text-gray-600">CNPJ: {entity.cnpj}</p>}
                      {entity.address && <p className="text-sm text-gray-600">{entity.address}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditEntity(entity)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntity(entity.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responsibles Tab */}
          {activeTab === 'responsibles' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Responsáveis Cadastrados</h3>
                <button
                  onClick={() => {
                    resetForms();
                    setShowResponsibleForm(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Novo Responsável
                </button>
              </div>

              {showResponsibleForm && (
                <form onSubmit={handleSaveResponsible} className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">
                    {editingResponsible ? 'Editar Responsável' : 'Novo Responsável'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                      <input
                        type="text"
                        required
                        value={responsibleForm.name}
                        onChange={(e) => setResponsibleForm({ ...responsibleForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={responsibleForm.email}
                        onChange={(e) => setResponsibleForm({ ...responsibleForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                      <input
                        type="text"
                        value={responsibleForm.phone}
                        onChange={(e) => setResponsibleForm({ ...responsibleForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                      <input
                        type="text"
                        value={responsibleForm.department}
                        onChange={(e) => setResponsibleForm({ ...responsibleForm, department: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowResponsibleForm(false);
                        resetForms();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {editingResponsible ? 'Salvar' : 'Criar'}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {responsibles.map(responsible => (
                  <div key={responsible.id} className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{responsible.name}</p>
                      {responsible.email && <p className="text-sm text-gray-600">{responsible.email}</p>}
                      {responsible.phone && <p className="text-sm text-gray-600">{responsible.phone}</p>}
                      {responsible.department && <p className="text-sm text-gray-600">Depto: {responsible.department}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditResponsible(responsible)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteResponsible(responsible.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instrument Types Tab */}
          {activeTab === 'types' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Tipos de Instrumentos</h3>
                <button
                  onClick={() => {
                    resetForms();
                    setShowTypeForm(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Novo Tipo
                </button>
              </div>

              {showTypeForm && (
                <form onSubmit={handleSaveType} className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">
                    {editingType ? 'Editar Tipo' : 'Novo Tipo'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                      <input
                        type="text"
                        required
                        value={typeForm.name}
                        onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Contrato de Fornecimento"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                      <textarea
                        value={typeForm.description}
                        onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descrição do tipo de instrumento"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTypeForm(false);
                        resetForms();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {editingType ? 'Salvar' : 'Criar'}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {instrumentTypes.map(type => (
                  <div key={type.id} className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{type.name}</p>
                      {type.description && <p className="text-sm text-gray-600">{type.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditType(type)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteType(type.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagementPanel;
