import React, { useState } from 'react';
import { 
  Car, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  Calendar, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  Plus,
  ShieldCheck
} from 'lucide-react';
import { Client, Vehicle } from '../types';
import { formatDateBr, getRelativeDays, getUrgency } from '../utils/dateUtils';
import { exportVehiclesToExcel } from '../utils/storage';

interface VehicleDetailsScreenProps {
  vehicles: Vehicle[];
  clients: Client[];
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicle: Vehicle) => void;
  onNavigateToRegister: () => void;
}

export const VehicleDetailsScreen: React.FC<VehicleDetailsScreenProps> = ({
  vehicles,
  clients,
  onEditVehicle,
  onDeleteVehicle,
  onNavigateToRegister,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exportNotice, setExportNotice] = useState(false);

  const clientMap = new Map(clients.map(c => [c.id, c]));

  const filteredVehicles = vehicles.filter(v => {
    const term = searchTerm.toLowerCase();
    const client = clientMap.get(v.client_id);
    return (
      v.plate.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term) ||
      (client && client.name.toLowerCase().includes(term))
    );
  });

  const handleExportExcel = () => {
    exportVehiclesToExcel(vehicles, clients);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const renderStatusBadge = (label: string, dateStr: string) => {
    if (!dateStr) {
      return (
        <span className="text-[11px] text-slate-400">
          {label}: Não informada
        </span>
      );
    }
    const days = getRelativeDays(dateStr);
    if (days === null) return null;
    const urgency = getUrgency(days);

    let badgeClass = 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    let statusText = `${formatDateBr(dateStr)}`;

    if (urgency === 'expired') {
      badgeClass = 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 font-bold';
      statusText = `Vencido (${formatDateBr(dateStr)})`;
    } else if (urgency === 'today') {
      badgeClass = 'text-amber-900 dark:text-amber-200 bg-amber-400 text-slate-950 border-amber-500 font-bold animate-pulse';
      statusText = `Hoje! (${formatDateBr(dateStr)})`;
    } else if (urgency === 'urgent_1_3') {
      badgeClass = 'text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 font-semibold';
      statusText = `Em ${days}d (${formatDateBr(dateStr)})`;
    } else if (urgency === 'upcoming_30') {
      badgeClass = 'text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800';
      statusText = `Em ${days}d`;
    }

    return (
      <div className={`px-2 py-1 rounded text-xs border flex items-center justify-between gap-2 ${badgeClass}`}>
        <span className="font-semibold">{label}:</span>
        <span>{statusText}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Search & Export (Matches KivyMD VehicleDetailsScreen) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Frota de Veículos
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Controle detalhado de placas, revisões MOT, impostos, seguros e contratos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Button from KivyMD: btn_export "EXPORTAR PARA EXCEL" */}
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>EXPORTAR PARA EXCEL</span>
            </button>

            <button
              onClick={onNavigateToRegister}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Van</span>
            </button>
          </div>
        </div>

        {/* Export Notification */}
        {exportNotice && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Planilha <strong>frota_veiculos.xlsx</strong> gerada e baixada com sucesso!</span>
          </div>
        )}

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por placa, modelo ou motorista..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-teal-600 text-sm"
          />
        </div>
      </div>

      {/* Vehicle Cards / ThreeLineListItem equivalent */}
      <div className="space-y-4">
        {filteredVehicles.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
            <Car className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Nenhum veículo encontrado
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Verifique o termo de busca ou cadastre uma nova van na frota.
            </p>
          </div>
        ) : (
          filteredVehicles.map((vehicle) => {
            const client = clientMap.get(vehicle.client_id);

            return (
              <div
                key={vehicle.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-teal-500/50 dark:hover:border-teal-600/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left: Model, Plate, Client */}
                <div className="space-y-2 flex-1">
                  
                  {/* Model & Plate */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-plate bg-amber-400 text-slate-950 px-2.5 py-1 rounded text-sm font-bold border border-amber-500 shadow-xs">
                      {vehicle.plate}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {vehicle.model}
                    </h3>
                    {vehicle.rentalRate && (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                        £{vehicle.rentalRate} / semana
                      </span>
                    )}
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Motorista / Locatário:</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {client?.name || 'Cliente Não Vinculado'}
                    </strong>
                    {client?.phone && <span className="text-slate-400">({client.phone})</span>}
                  </div>

                  {/* Notes if any */}
                  {vehicle.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      "{vehicle.notes}"
                    </p>
                  )}

                  {/* Status Badges for 4 Legal Pillars: MOT, Tax, Insurance, Rent */}
                  <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {renderStatusBadge('MOT', vehicle.mot_expiry)}
                    {renderStatusBadge('Road Tax', vehicle.tax_expiry)}
                    {renderStatusBadge('Seguro', vehicle.insurance_expiry)}
                    {renderStatusBadge('Aluguel', vehicle.rent_expiry)}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 self-end lg:self-center">
                  <button
                    onClick={() => onEditVehicle(vehicle)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors shadow-xs"
                    title="Editar Veículo"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => onDeleteVehicle(vehicle)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Excluir Veículo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
