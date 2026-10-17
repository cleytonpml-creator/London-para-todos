import React from 'react';
import { 
  Car, 
  Users, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  PoundSterling, 
  ShieldCheck, 
  ArrowUpRight,
  Flame,
  FileSpreadsheet
} from 'lucide-react';
import { AlertItem, Client, Vehicle, TabType } from '../types';
import { formatDateBr } from '../utils/dateUtils';
import { exportVehiclesToExcel } from '../utils/storage';

interface DashboardScreenProps {
  vehicles: Vehicle[];
  clients: Client[];
  alerts: AlertItem[];
  onNavigateTab: (tab: TabType) => void;
  onOpenVehicleEdit: (vehicle: Vehicle) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  vehicles,
  clients,
  alerts,
  onNavigateTab,
  onOpenVehicleEdit,
}) => {
  const criticalAlerts = alerts.filter(a => a.daysRemaining >= 0 && a.daysRemaining <= 3);
  const expiredAlerts = alerts.filter(a => a.daysRemaining < 0);
  const upcomingWeek = alerts.filter(a => a.daysRemaining > 3 && a.daysRemaining <= 7);

  // Total weekly rental revenue
  const totalWeeklyRental = vehicles.reduce((sum, v) => sum + (v.rentalRate || 0), 0);

  // Compliance counts
  const totalChecks = vehicles.length * 4; // 4 checks per vehicle
  const nonCompliantChecks = criticalAlerts.length + expiredAlerts.length;
  const complianceRate = totalChecks > 0 ? Math.round(((totalChecks - nonCompliantChecks) / totalChecks) * 100) : 100;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-700/60 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-3 border border-teal-600/40">
            Painel Executivo
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            London para Todos
          </h2>
          <p className="text-teal-100/90 text-sm sm:text-base mt-2 leading-relaxed">
            Visão consolidada da operação, status legal de revisões MOT, taxas de circulação (Road Tax), apólices de seguro e vencimento de aluguéis.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('alerts')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-xs"
            >
              <Flame className="w-4 h-4" />
              <span>Ver Alertas Críticos ({criticalAlerts.length})</span>
            </button>
            <button
              onClick={() => exportVehiclesToExcel(vehicles, clients)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-900/80 hover:bg-teal-900 text-white text-xs font-semibold border border-teal-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar Excel (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Frota */}
        <div 
          onClick={() => onNavigateTab('vehicles')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-teal-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Frota Ativa</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{vehicles.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">veículos cadastrados</span>
          </div>
        </div>

        {/* Clientes */}
        <div 
          onClick={() => onNavigateTab('clients')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-teal-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Clientes & Motoristas</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{clients.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">motoristas ativos</span>
          </div>
        </div>

        {/* Alertas Críticos (0-3 dias) */}
        <div 
          onClick={() => onNavigateTab('alerts')}
          className="bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800/80 rounded-xl p-5 shadow-xs hover:border-amber-500 transition-all cursor-pointer bg-amber-50/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400">Alertas Urgentes (0-3d)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-950 dark:text-amber-300">{criticalAlerts.length}</span>
            <span className="text-xs text-amber-800/80 dark:text-amber-400">prazos imediatos</span>
          </div>
        </div>

        {/* Receita Semanal Estimada */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Receita de Aluguel</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <PoundSterling className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">£{totalWeeklyRental.toLocaleString()}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ semana</span>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Critical Items + Legal Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Immediate Action Items (0-3 days) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Vencimentos Imediatos (Regra 0 a 3 Dias)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('alerts')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>Ver todos</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {criticalAlerts.length === 0 ? (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              Nenhum documento com vencimento para hoje ou nos próximos 3 dias!
            </div>
          ) : (
            <div className="space-y-2.5">
              {criticalAlerts.map(alert => {
                const vehicle = vehicles.find(v => v.id === alert.vehicleId);
                return (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg border border-amber-300 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-plate bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold">
                        {alert.plate}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {alert.docName} {alert.daysRemaining === 0 ? 'vence HOJE!' : `vence em ${alert.daysRemaining} dias`}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {alert.model} · {alert.clientName}
                        </div>
                      </div>
                    </div>

                    {vehicle && (
                      <button
                        onClick={() => onOpenVehicleEdit(vehicle)}
                        className="px-2.5 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white font-semibold text-[11px] whitespace-nowrap shadow-xs"
                      >
                        Renovar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Compliance & Quick Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Índice de Conformidade
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Documentos Válidos:</span>
              <span className="font-bold text-teal-700 dark:text-teal-400">{complianceRate}%</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${complianceRate}%` }}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Vencidos:</span>
                <span className="font-bold text-rose-600">{expiredAlerts.length}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Vencendo em até 3 dias:</span>
                <span className="font-bold text-amber-600">{criticalAlerts.length}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Vencendo nos próximos 7 dias:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{upcomingWeek.length}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onNavigateTab('register')}
                className="w-full py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wide transition-colors shadow-xs"
              >
                Cadastrar Nova Van
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
