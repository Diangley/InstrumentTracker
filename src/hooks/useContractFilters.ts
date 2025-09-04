import { useMemo } from 'react';
import { Instrument, FilterOptions } from '../types';

export const useInstrumentFilters = (instruments: Instrument[], filters: FilterOptions) => {
  return useMemo(() => {
    return instruments.filter(instrument => {
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(instrument.status)) {
          return false;
        }
      }

      // Entity filter
      if (filters.entity && filters.entity.length > 0) {
        if (!instrument.entities.some(entity => filters.entity!.includes(entity.id))) {
          return false;
        }
      }

      // Responsible filter
      if (filters.responsible && filters.responsible.length > 0) {
        if (!instrument.responsibles.some(responsible => filters.responsible!.includes(responsible.id))) {
          return false;
        }
      }

      // Search filter
      if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase().trim();
        const searchableText = [
          instrument.title,
          instrument.description || '',
          ...instrument.entities.map(e => e.name),
          ...instrument.responsibles.map(r => r.name),
          ...(instrument.tags || [])
        ].join(' ').toLowerCase();

        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }, [instruments, filters]);
};
