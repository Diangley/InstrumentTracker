import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Building, User } from 'lucide-react';
import { Instrument, InstrumentFormData, Entity, Responsible } from '../types';
import { entities as availableEntities, responsibles as availableResponsibles, instrumentTypes } from '../data/mockData';

interface InstrumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instrument: InstrumentFormData) => void;
  instrument?: Instrument;
}

const InstrumentForm: React.FC<InstrumentFormProps> = ({ isOpen, onClose, onSave, instrument }) => {
  const [formData, setFormData] = useState<InstrumentFormData>({
    title: '',
    description: '',
    entities: [],
    responsibles: [],
    dueDate: '',
    priority: 'medium',
    typeId: '',
    value: undefined,
    tags: []
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (instrument) {
      setFormData({
        title: instrument.title,
        description: instrument.description || '',
        entities: instrument.entities,
        responsibles: instrument.responsibles,
        dueDate: instrument.dueDate.split('T')[0],
        priority: instrument.priority,
        typeId: instrument.typeId,
        value: instrument.value,
        tags: instrument.tags || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        entities: [],
        responsibles: [],
        dueDate: '',
        priority: 'medium',
        typeId: '',
        value: undefined,
        tags: []
      });
    }
  }, [instrument, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addEntity = (entityId: string) => {
    const entity = availableEntities.find(e => e.id === entityId);
    if (entity && !formData.entities.find(e => e.id === entityId)) {
      setFormData({
        ...formData,
        entities: [...formData.entities, entity]
      });
    }
  };

  const removeEntity = (entityId: string) => {
    setFormData({
      ...formData,
      entities: formData.entities.filter(e => e.id !== entityId)
    });
  };

  const addResponsible = (responsibleId: string) => {
    const responsible = availableResponsibles.find(r => r.id === responsibleId);
    if (responsible && !formData.responsibles.find(r => r.id === responsibleId)) {
      setFormData({
        ...formData,
        responsibles: [...formData.responsibles, { ...responsible, signatureStatus: 'pending' }]
      });
    }
  };

  const removeResponsible = (responsibleId: string) => {
    setFormData({
      ...formData,
      responsibles: formData.responsibles.filter(r => r.id !== responsibleId)
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {instrument ? 'Editar Instrumento' : 'Novo Instrumento'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Instrumento *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Instrumento *
              </label>
              <select
                required
                value={formData.typeId}
                onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecionar tipo...</option>
                {instrumentTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Entities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Building className="w-4 h-4 mr-2" />
              Empresa/Entidade/Regional *
            </label>
            <div className="space-y-3">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addEntity(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecionar entidade...</option>
                {availableEntities
                  .filter(e => !formData.entities.find(fe => fe.id === e.id))
                  .map(entity => (
                    <option key={entity.id} value={entity.id}>
                      {entity.name}
                    </option>
                  ))}
              </select>
              
              {formData.entities.map(entity => (
                <div key={entity.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{entity.name}</p>
                    {entity.cnpj && <p className="text-sm text-gray-600">CNPJ: {entity.cnpj}</p>}
                    {entity.address && <p className="text-sm text-gray-600">{entity.address}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntity(entity.id)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Responsáveis *
            </label>
            <div className="space-y-3">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addResponsible(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecionar responsável...</option>
                {availableResponsibles
                  .filter(r => !formData.responsibles.find(fr => fr.id === r.id))
                  .map(responsible => (
                    <option key={responsible.id} value={responsible.id}>
                      {responsible.name} {responsible.department && `- ${responsible.department}`}
                    </option>
                  ))}
              </select>
              
              {formData.responsibles.map(responsible => (
                <div key={responsible.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{responsible.name}</p>
                    {responsible.email && <p className="text-sm text-gray-600">{responsible.email}</p>}
                    {responsible.department && <p className="text-sm text-gray-600">Depto: {responsible.department}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeResponsible(responsible.id)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Vencimento *
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.value || ''}
                onChange={(e) => setFormData({ ...formData, value: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite uma tag e pressione Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {instrument ? 'Salvar Alterações' : 'Criar Instrumento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstrumentForm;
