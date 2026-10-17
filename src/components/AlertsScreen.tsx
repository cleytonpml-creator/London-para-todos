import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  Car, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MessageSquare, 
  Mail, 
  ExternalLink,
  Filter,
  Flame,
  ArrowRight
} from 'lucide-react';
import { AlertItem, Client, Vehicle } from '../types';
import { formatDateBr } from '../utils/dateUtils';

interface AlertsScreenProps {
  alerts: AlertItem[];
  clients: Client[];
  vehicles: Vehicle[];
  onOpenVehicleEdit: (vehicle: Vehicle) => void;
  onOpenClientEdit: (client: Client) => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts,
  clients,
  vehicles,
  onOpenVehicleEdit,
  onOpenClientEdit,
}) => {
  const [filterType, setFilterType] = useState<'critical' | 'expired' | 'upcoming' | 'all'>('critical');
  const [docFilter, setDocFilter] = useState<'all' | 'mot' | 'tax' | 'ins' | 'rent'>('all');

  // Filter alerts based on selection
  const filteredAlerts = alerts.filter(alert => {
    // Document type filter
    if (docFilter !== 'all' && alert.docType !== docFilter) {
      return false;
    }

    // Urgency filter
    if (filterType === 'critical') {
      // 0, 1, 2, 3 days (Exact match to KivyMD rule)
      return alert.daysRemaining >= 0 && alert.daysRemaining <= 3;
    }
    if (filterType === 'expired') {
      return alert.daysRemaining < 0;
    }
    if (filterType === 'upcoming') {
      return alert.daysRemaining > 3 && alert.daysRemaining <= 30;
    }
    return true;
  });

  const criticalCount = alerts.filter(a => a.daysRemaining >= 0 && a.daysRemaining <= 3).length;
  const expiredCount = alerts.filter(a => a.daysRemaining < 0).length;
  const upcomingCount = alerts.filter(a => a.daysRemaining > 3 && a.daysRemaining <= 30).length;

  const handleSendWhatsApp = (alert: AlertItem) => {
    let cleanPhone = alert.clientPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      alert.clientPhone = '447911123456';
      cleanPhone = '447911123456';
    }
    const daysMsg = alert.daysRemaining === 0 
      ? 'VENCE HOJE' 
      : alert.daysRemaining < 0 
        ? `venceu há ${Math.abs(alert.daysRemaining)} dias`
        : `vence em ${alert.daysRemaining} dias (${formatDateBr(alert.expiryDate)})`;
    
    const message = encodeURIComponent(
      `Olá ${alert.clientName}, aviso da equipe London para Todos:\n` +
      `O documento ${alert.docName} do seu veículo ${alert.model} (Placa: ${alert.plate}) ${daysMsg}.\n` +
      `Por favor entre em contato para regularização.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleSendEmail = (alert: AlertItem) => {
    if (!alert.clientEmail) return;
    const subject = encodeURIComponent(`Aviso de Vencimento de ${alert.docName} - Placa ${alert.plate}`);
    const body = encodeURIComponent(
      `Olá ${alert.clientName},\n\n` +
      `Informamos que o ${alert.docName} da van ${alert.model} (Placa: ${alert.plate}) ` +
      `${alert.daysRemaining === 0 ? 'vence HOJE' : `vence em ${alert.daysRemaining} dias (${formatDateBr(alert.expiryDate)})`}.\n\n` +
      `Atenciosamente,\nLondon para Todos`
    );
    window.location.href = `mailto:${alert.clientEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      {/* Title & Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Alertas de Vencimento
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                KivyMD Core Logic
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Monitoramento automático de MOT, Road Tax, Seguro e Aluguel da frota.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300/40">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">{criticalCount}</span> Críticos (0-3 dias)
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-300/40">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span className="font-semibold">{expiredCount}</span> Vencidos
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Urgency Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
            <button
              onClick={() => setFilterType('critical')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterType === 'critical'
                  ? 'bg-amber-500 text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Vencendo em 0-3 dias ({criticalCount})</span>
            </button>
            <button
              onClick={() => setFilterType('expired')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterType === 'expired'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>Vencidos ({expiredCount})</span>
            </button>
            <button
              onClick={() => setFilterType('upcoming')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterType === 'upcoming'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>30 dias ({upcomingCount})</span>
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>Todos ({alerts.length})</span>
            </button>
          </div>

          {/* Doc Type Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Tipo:</span>
            <select
              value={docFilter}
              onChange={(e) => setDocFilter(e.target.value as any)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-teal-600"
            >
              <option value="all">Todos os documentos</option>
              <option value="mot">MOT</option>
              <option value="tax">Road Tax</option>
              <option value="ins">Seguro</option>
              <option value="rent">Aluguel</option>
            </select>
          </div>

        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Nenhum alerta pendente nessa categoria
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Todos os prazos de MOT, Road Tax, Seguro e Aluguel atendem aos filtros selecionados.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const vehicle = vehicles.find(v => v.id === alert.vehicleId);
            const client = clients.find(c => c.id === alert.clientId);
            
            // Format identical to KivyMD:
            // "MOT vence em {delta} dias" if delta > 0 else "MOT vence hoje!"
            let primaryText = '';
            let cardBg = '';
            let badgeBg = '';

            if (alert.daysRemaining === 0) {
              primaryText = `${alert.docName} vence hoje!`;
              cardBg = 'border-amber-400/80 bg-amber-50/50 dark:bg-amber-950/20';
              badgeBg = 'bg-amber-500 text-slate-900 font-bold';
            } else if (alert.daysRemaining > 0 && alert.daysRemaining <= 3) {
              primaryText = `${alert.docName} vence em ${alert.daysRemaining} ${alert.daysRemaining === 1 ? 'dia' : 'dias'}`;
              cardBg = 'border-amber-300 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/15';
              badgeBg = 'bg-amber-400 dark:bg-amber-600 text-slate-900 dark:text-white font-semibold';
            } else if (alert.daysRemaining < 0) {
              primaryText = `${alert.docName} VENCIDO há ${Math.abs(alert.daysRemaining)} ${Math.abs(alert.daysRemaining) === 1 ? 'dia' : 'dias'}`;
              cardBg = 'border-rose-400/80 bg-rose-50/40 dark:bg-rose-950/25';
              badgeBg = 'bg-rose-600 text-white font-bold';
            } else {
              primaryText = `${alert.docName} vence em ${alert.daysRemaining} dias`;
              cardBg = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900';
              badgeBg = 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
            }

            return (
              <div
                key={alert.id}
                className={`border rounded-xl p-4 sm:p-5 transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardBg}`}
              >
                {/* Left info - TwoLineListItem from KivyMD */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-md uppercase tracking-wide ${badgeBg}`}>
                      {alert.docName}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {primaryText}
                    </h3>
                  </div>

                  {/* Secondary text: Van {vehicle.plate} - {vehicle.model} */}
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-plate bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-xs font-bold border border-amber-500">
                      {alert.plate}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {alert.model}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">·</span>
                    <span className="text-slate-600 dark:text-slate-400 text-xs">
                      Vencimento: <strong className="text-slate-800 dark:text-slate-200">{formatDateBr(alert.expiryDate)}</strong>
                    </span>
                  </div>

                  {/* Client line */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 pt-0.5">
                    <span>Responsável: <strong className="text-slate-700 dark:text-slate-300">{alert.clientName}</strong></span>
                    {alert.clientPhone && <span>· Tel: {alert.clientPhone}</span>}
                    {alert.clientEmail && <span>· E-mail: {alert.clientEmail}</span>}
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800">
                  {/* WhatsApp */}
                  {alert.clientPhone && (
                    <button
                      onClick={() => handleSendWhatsApp(alert)}
                      title="Enviar lembrete via WhatsApp"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  )}

                  {/* Email */}
                  {alert.clientEmail && (
                    <button
                      onClick={() => handleSendEmail(alert)}
                      title="Enviar lembrete por E-mail"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">E-mail</span>
                    </button>
                  )}

                  {/* Edit Vehicle / Update Expiry */}
                  {vehicle && (
                    <button
                      onClick={() => onOpenVehicleEdit(vehicle)}
                      title="Atualizar datas do veículo"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Renovar Data</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
