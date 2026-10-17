import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Edit, 
  Trash2, 
  Car, 
  MessageSquare,
  Plus,
  ExternalLink
} from 'lucide-react';
import { Client, Vehicle } from '../types';

interface ClientsListScreenProps {
  clients: Client[];
  vehicles: Vehicle[];
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onNavigateToRegister: () => void;
}

export const ClientsListScreen: React.FC<ClientsListScreenProps> = ({
  clients,
  vehicles,
  onEditClient,
  onDeleteClient,
  onNavigateToRegister,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter clients by name, matching KivyMD filter_clients logic
  const filteredClients = clients.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.phone && c.phone.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.address && c.address.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Search & Add */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Clientes Cadastrados
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {clients.length} {clients.length === 1 ? 'cliente registrado' : 'clientes registrados'} no sistema.
            </p>
          </div>

          <button
            onClick={onNavigateToRegister}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Cliente / Veículo</span>
          </button>
        </div>

        {/* Search Field (Matches KivyMD hint_text="Buscar cliente por nome...") */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente por nome, telefone ou e-mail..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-teal-600 text-sm"
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-3">
        {filteredClients.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
            <User className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Nenhum cliente encontrado
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tente outro termo na busca ou cadastre um novo cliente.
            </p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const clientVehicles = vehicles.filter(v => v.client_id === client.id);

            return (
              <div
                key={client.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs hover:border-teal-500/50 dark:hover:border-teal-600/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Client Info (TwoLineListItem + Details) */}
                <div className="space-y-2 flex-1">
                  
                  {/* Name */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {client.name}
                    </h3>
                    {clientVehicles.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        <span>{clientVehicles.length} {clientVehicles.length === 1 ? 'van' : 'vans'}</span>
                      </span>
                    )}
                  </div>

                  {/* Secondary Text: Tel & Email */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {client.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.phone}</span>
                      </span>
                    )}
                    {client.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.email}</span>
                      </span>
                    )}
                  </div>

                  {/* Address */}
                  {client.address && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}

                  {/* Attached Documents Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    {client.idCardName ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                        <FileText className="w-3 h-3" />
                        <span>Passaporte/ID: {client.idCardName}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Sem passaporte anexado</span>
                    )}

                    {client.licenseName ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                        <FileText className="w-3 h-3" />
                        <span>CNH: {client.licenseName}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Sem CNH anexada</span>
                    )}
                  </div>

                  {/* Assigned vehicles preview */}
                  {clientVehicles.length > 0 && (
                    <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-slate-400 font-medium">Veículos:</span>
                      {clientVehicles.map(v => (
                        <span key={v.id} className="font-plate bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[11px] font-bold">
                          {v.plate} ({v.model.split(' ')[0]})
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  {client.phone && (
                    <a
                      href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      title="Conversar no WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => onEditClient(client)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
                    title="Editar Cliente"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => onDeleteClient(client)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Excluir Cliente"
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
