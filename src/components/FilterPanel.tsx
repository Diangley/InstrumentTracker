import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { FilterOptions, InstrumentStatus } from '../types';
import { getStatusText } from '../utils/formatters';
import { entities, responsibles } from '../data/mockData';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions: InstrumentStatus[] = ['pending', 'in_progress', 'signed', 'expired'];

  const handleStatusChange = (status: InstrumentStatus, checked: boolean) => {
    const currentStatuses = filters.status || [];
    const newStatuses = checked 
      ? [...currentStatuses, status]
      : currentStatuses.filter(s => s !== status);
    
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const handleEntityChange = (entityId: string, checked: boolean) => {
    const currentEntities = filters.entity || [];
    const newEntities = checked 
      ? [...currentEntities, entityId]
      : currentEntities.filter(e => e !== entityId);
    
    onFiltersChange({ ...filters, entity: newEntities });
  };

  const handleResponsibleChange = (responsibleId: string, checked: boolean) => {
    const currentResponsibles = filters.responsible || [];
    const newResponsibles = checked 
      ? [...currentResponsibles, responsibleId]
      : currentResponsibles.filter(r => r !== responsibleId);
    
    onFiltersChange({ ...filters, responsible: newResponsibles });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.status?.length || filters.entity?.length || 
    filters.responsible?.length || filters.search;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por instrumento, entidade, responsável..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <Filter className="w-4 h-4" />
          Filtros
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            Limpar
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          {/* Status Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Status</h4>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.status?.includes(status) || false}
                    onChange={(e) => handleStatusChange(status, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{getStatusText(status)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Entity Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Entidade</h4>
            <div className="space-y-2">
              {entities.map((entity) => (
                <label key={entity.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.entity?.includes(entity.id) || false}
                    onChange={(e) => handleEntityChange(entity.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 truncate">{entity.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Responsible Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Responsável</h4>
            <div className="space-y-2">
              {responsibles.map((responsible) => (
                <label key={responsible.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.responsible?.includes(responsible.id) || false}
                    onChange={(e) => handleResponsibleChange(responsible.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 truncate">{responsible.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
