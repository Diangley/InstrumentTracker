import React, { useState, useEffect } from "react";
import { Contract } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Calendar,
  Building2, // Icon for regional or total
  User, // Icon for responsible
  DollarSign, // Icon for contract value
  CheckCircle, // For signed contracts
  Hourglass, // For pending contracts
  AlertTriangle, // For overdue contracts
  Loader2 // For loading state of export
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ContractList from "../components/contracts/ContractList";
import ContractFilters from "../components/contracts/ContractFilters";

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false); // New state for export loading
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    regional: "all",
    priority: "all",
    responsible: "all",
    instrumentType: "all" // New filter for dynamic instrument types
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadContracts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contracts, searchTerm, filters]);

  const loadContracts = async () => {
    setIsLoading(true);
    try {
      // Assuming 'Contract.list' fetches contracts with 'responsible' as an array and 'instrument_type'
      const data = await Contract.list("-created_date");
      setContracts(data);
    } catch (error) {
      console.error("Erro ao carregar contratos:", error);
    }
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...contracts];

    // Filtro por busca
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(contract => 
        contract.title?.toLowerCase().includes(lowerSearchTerm) ||
        contract.company?.toLowerCase().includes(lowerSearchTerm) ||
        contract.contract_number?.toLowerCase().includes(lowerSearchTerm) ||
        // Check if any responsible in the array includes the search term
        (Array.isArray(contract.responsible) && contract.responsible.some(r => r.toLowerCase().includes(lowerSearchTerm))) ||
        (!Array.isArray(contract.responsible) && typeof contract.responsible === 'string' && contract.responsible.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Filtros específicos
    if (filters.status !== "all") {
      filtered = filtered.filter(contract => contract.status === filters.status);
    }
    
    if (filters.regional !== "all") {
      filtered = filtered.filter(contract => contract.regional === filters.regional);
    }
    
    if (filters.priority !== "all") {
      filtered = filtered.filter(contract => contract.priority === filters.priority);
    }
    
    if (filters.responsible !== "all") {
      const lowerFilterResponsible = filters.responsible.toLowerCase();
      filtered = filtered.filter(contract => 
        // Check if any responsible in the array matches the filter value
        (Array.isArray(contract.responsible) && contract.responsible.some(r => r.toLowerCase() === lowerFilterResponsible)) ||
        // Handle case where responsible might still be a single string for legacy data or simple filters
        (!Array.isArray(contract.responsible) && typeof contract.responsible === 'string' && contract.responsible.toLowerCase() === lowerFilterResponsible)
      );
    }

    // New filter for instrument type
    if (filters.instrumentType !== "all") {
      filtered = filtered.filter(contract => contract.instrument_type === filters.instrumentType);
    }

    setFilteredContracts(filtered);
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      // Prepare data for export
      const exportData = filteredContracts.map(contract => ({
        'Número': contract.contract_number || '',
        'Título': contract.title || '',
        'Empresa': contract.company || '',
        'Regional': contract.regional || '',
        // Handle responsible as an array, joining with comma, or as a string
        'Responsável': Array.isArray(contract.responsible) ? contract.responsible.join(', ') : contract.responsible || '',
        'Status': contract.status || '',
        'Tipo de Instrumento': contract.instrument_type || '', // New field
        'Data de Envio': contract.send_date || '',
        'Data de Assinatura': contract.signature_date || '',
        'Data de Vencimento': contract.due_date || '',
        'Valor': contract.contract_value || 0,
        'Prioridade': contract.priority || ''
      }));

      // Convert to CSV
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Basic CSV escape: wrap in double quotes if it contains comma or double quote
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'contratos.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("Erro ao exportar contratos:", error);
      // Optionally show a toast notification for error
    } finally {
      setIsExporting(false);
    }
  };

  // Quick statistics for filtered contracts
  const stats = {
    total: filteredContracts.length,
    signed: filteredContracts.filter(c => c.status === 'signed').length,
    pending: filteredContracts.filter(c => c.status === 'pending').length,
    overdue: filteredContracts.filter(c => c.status === 'overdue').length,
    totalValue: filteredContracts.reduce((sum, c) => sum + (c.contract_value || 0), 0)
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Contratos</h2>
          <p className="text-slate-600">
            {stats.total} contratos encontrados
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={exportToExcel}
            disabled={filteredContracts.length === 0 || isExporting}
          >
            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {isExporting ? "Exportando..." : "Exportar"}
          </Button>
          <Link to={createPageUrl("NewContract")}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Contrato
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
            <div className="text-sm text-slate-600">Total</div>
          </div>
          <Calendar className="w-8 h-8 text-slate-400" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-emerald-600">{stats.signed}</div>
            <div className="text-sm text-slate-600">Assinados</div>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-600">{stats.pending}</div>
            <div className="text-sm text-slate-600">Pendentes</div>
          </div>
          <Hourglass className="w-8 h-8 text-slate-400" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-slate-600">Atrasados</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-blue-600">
              {/* Format total value for display (e.g., R$ 123.4K) */}
              R$ {new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(stats.totalValue / 1000)}K
            </div>
            <div className="text-sm text-slate-600">Valor Total</div>
          </div>
          <DollarSign className="w-8 h-8 text-blue-400" />
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por título, empresa, número, responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
              {Object.values(filters).some(f => f !== "all") && (
                <Badge variant="secondary" className="ml-1">
                  {Object.values(filters).filter(f => f !== "all").length}
                </Badge>
              )}
            </Button>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent className="pt-0 border-t">
            {/* ContractFilters component will need to be updated internally to support 'instrumentType' filter */}
            <ContractFilters 
              filters={filters} 
              onFiltersChange={setFilters}
              contracts={contracts} // Pass contracts to allow dynamic options generation within filters
            />
          </CardContent>
        )}
      </Card>

      {/* Contracts List */}
      <ContractList 
        contracts={filteredContracts} 
        isLoading={isLoading}
        onContractUpdate={loadContracts} // Callback to refresh contracts after an update
      />
    </div>
  );
}
