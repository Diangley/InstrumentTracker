import React, { useState, useEffect } from "react";
import { Contract } from "@/entities/Contract";
import { ContractHistory } from "@/entities/ContractHistory";
import { Assignment } from "@/entities/Assignment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  FileCheck, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Users,
  Plus,
  ArrowRight
} from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

import StatsCard from "../components/dashboard/StatsCard";
import PriorityInstruments from "../components/dashboard/PriorityInstruments";
import StatusChart from "../components/dashboard/StatusChart";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function Dashboard() {
  const [instruments, setInstruments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [instrumentsData, assignmentsData, historyData] = await Promise.all([
        Contract.list("-created_date"),
        Assignment.list(),
        ContractHistory.list("-action_date", 20)
      ]);
      setInstruments(instrumentsData);
      setAssignments(assignmentsData);
      setHistory(historyData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const getAggregatedInstruments = () => {
    return instruments.map(instrument => ({
      ...instrument,
      assignments: assignments.filter(a => a.contract_id === instrument.id),
    }));
  };

  const aggregatedInstruments = getAggregatedInstruments();

  const stats = {
    total: aggregatedInstruments.length,
    signed: aggregatedInstruments.filter(c => c.overall_status === 'signed').length,
    inProgress: aggregatedInstruments.filter(c => c.overall_status === 'in_progress').length,
    pending: aggregatedInstruments.filter(c => c.overall_status === 'pending').length,
    overdue: aggregatedInstruments.filter(c => c.overall_status === 'overdue').length
  };

  const dueSoon = aggregatedInstruments.filter(instrument => {
    if (!instrument.due_date || instrument.overall_status === 'signed') return false;
    const dueDate = new Date(instrument.due_date);
    const today = new Date();
    const sevenDaysFromNow = addDays(today, 7);
    return isAfter(dueDate, today) && isBefore(dueDate, sevenDaysFromNow);
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header com ação rápida */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Visão Geral dos Instrumentos</h2>
          <p className="text-slate-600">Acompanhe o status de todas as assinaturas</p>
        </div>
        <Link to={createPageUrl("NewInstrument")}>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Novo Instrumento
          </Button>
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Instrumentos"
          value={stats.total}
          icon={FileCheck}
          color="blue"
        />
        <StatsCard
          title="Assinados"
          value={stats.signed}
          icon={FileCheck}
          color="green"
          percentage={stats.total ? (stats.signed / stats.total * 100) : 0}
        />
        <StatsCard
          title="Em Andamento"
          value={stats.inProgress}
          icon={Clock}
          color="amber"
          percentage={stats.total ? (stats.inProgress / stats.total * 100) : 0}
        />
        <StatsCard
          title="Vencendo em 7 dias"
          value={dueSoon.length}
          icon={AlertTriangle}
          color="red"
          urgent={dueSoon.length > 0}
        />
      </div>

      {/* Seção Principal */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Instrumentos Prioritários */}
        <div className="lg:col-span-2">
          <PriorityInstruments 
            instruments={aggregatedInstruments}
            dueSoon={dueSoon}
            isLoading={isLoading}
          />
        </div>

        {/* Sidebar com métricas e atividades */}
        <div className="space-y-6">
          <StatusChart instruments={aggregatedInstruments} isLoading={isLoading} />
          <RecentActivity history={history} isLoading={isLoading} />
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to={createPageUrl("Instruments") + "?filter=overdue"}>
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <span>Ver Vencidos</span>
                <Badge variant="destructive">{stats.overdue}</Badge>
              </Button>
            </Link>
            
            <Link to={createPageUrl("Instruments") + "?filter=due_soon"}>
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                <Clock className="w-6 h-6 text-amber-500" />
                <span>Vencendo em 7 dias</span>
                <Badge variant="secondary">{dueSoon.length}</Badge>
              </Button>
            </Link>

            <Link to={createPageUrl("Reports")}>
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                <span>Ver Relatórios</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
