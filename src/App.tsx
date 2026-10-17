/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Client, Vehicle, TabType } from './types';
import { 
  getStoredClients, 
  saveStoredClients, 
  getStoredVehicles, 
  saveStoredVehicles,
  resetToDefaults 
} from './utils/storage';
import { extractAlerts } from './utils/dateUtils';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AlertsScreen } from './components/AlertsScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { VehicleDetailsScreen } from './components/VehicleDetailsScreen';
import { ClientsListScreen } from './components/ClientsListScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { EditClientModal, EditVehicleModal } from './components/Modals';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('london_fleet_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('london_fleet_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('london_fleet_theme', 'light');
    }
  }, [isDarkMode]);

  // Tab state (defaults to 'alerts' as in KivyMD)
  const [currentTab, setCurrentTab] = useState<TabType>('alerts');

  // Database state
  const [clients, setClients] = useState<Client[]>(() => getStoredClients());
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getStoredVehicles());

  // Edit / Delete modals state
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveStoredClients(clients);
  }, [clients]);

  useEffect(() => {
    saveStoredVehicles(vehicles);
  }, [vehicles]);

  // Computed alerts
  const alerts = useMemo(() => {
    return extractAlerts(vehicles, clients);
  }, [vehicles, clients]);

  // Critical alerts count (0-3 days, exactly matching KivyMD)
  const urgentAlertsCount = useMemo(() => {
    return alerts.filter(a => a.daysRemaining >= 0 && a.daysRemaining <= 3).length;
  }, [alerts]);

  // Handlers
  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados de demonstração da frota London para Todos?')) {
      const defaults = resetToDefaults();
      setClients(defaults.clients);
      setVehicles(defaults.vehicles);
    }
  };

  const handleSaveRegistration = (
    clientData: Omit<Client, 'id' | 'createdAt'>,
    vehicleData: Omit<Vehicle, 'id' | 'client_id' | 'createdAt'>
  ): { success: boolean; error?: string } => {
    try {
      const clientId = `c_${Date.now()}`;
      const vehicleId = `v_${Date.now()}`;

      const newClient: Client = {
        ...clientData,
        id: clientId,
        createdAt: new Date().toISOString(),
      };

      const newVehicle: Vehicle = {
        ...vehicleData,
        id: vehicleId,
        client_id: clientId,
        createdAt: new Date().toISOString(),
      };

      setClients(prev => [newClient, ...prev]);
      setVehicles(prev => [newVehicle, ...prev]);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erro inesperado ao salvar.' };
    }
  };

  const handleSaveClient = (updated: Client) => {
    setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
  };

  const confirmDeleteClient = () => {
    if (!clientToDelete) return;
    setClients(prev => prev.filter(c => c.id !== clientToDelete.id));
    // Also unlink vehicle client_id
    setVehicles(prev => prev.map(v => v.client_id === clientToDelete.id ? { ...v, client_id: '' } : v));
    setClientToDelete(null);
  };

  const handleSaveVehicle = (updated: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === updated.id ? updated : v));
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
  };

  const confirmDeleteVehicle = () => {
    if (!vehicleToDelete) return;
    setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
    setVehicleToDelete(null);
  };

  const existingPlates = useMemo(() => {
    return vehicles.map(v => v.plate.toUpperCase());
  }, [vehicles]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors pb-20 md:pb-10">
      
      {/* Top Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        urgentAlertsCount={urgentAlertsCount}
        onResetData={handleResetData}
      />

      {/* Navigation */}
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        urgentAlertsCount={urgentAlertsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'alerts' && (
          <AlertsScreen
            alerts={alerts}
            clients={clients}
            vehicles={vehicles}
            onOpenVehicleEdit={(v) => setEditingVehicle(v)}
            onOpenClientEdit={(c) => setEditingClient(c)}
          />
        )}

        {currentTab === 'register' && (
          <RegistrationScreen
            clients={clients}
            vehicles={vehicles}
            onSaveRegistration={handleSaveRegistration}
            onNavigateToAlerts={() => setCurrentTab('alerts')}
          />
        )}

        {currentTab === 'vehicles' && (
          <VehicleDetailsScreen
            vehicles={vehicles}
            clients={clients}
            onEditVehicle={(v) => setEditingVehicle(v)}
            onDeleteVehicle={handleDeleteVehicle}
            onNavigateToRegister={() => setCurrentTab('register')}
          />
        )}

        {currentTab === 'clients' && (
          <ClientsListScreen
            clients={clients}
            vehicles={vehicles}
            onEditClient={(c) => setEditingClient(c)}
            onDeleteClient={handleDeleteClient}
            onNavigateToRegister={() => setCurrentTab('register')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardScreen
            vehicles={vehicles}
            clients={clients}
            alerts={alerts}
            onNavigateTab={setCurrentTab}
            onOpenVehicleEdit={(v) => setEditingVehicle(v)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>London para Todos · Sistema de Gestão de Frota e Vencimentos Legais</span>
          <span className="font-plate text-[11px] bg-amber-400/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
            MOT · ROAD TAX · SEGURO · ALUGUEL
          </span>
        </div>
      </footer>

      {/* Edit Client Modal */}
      <EditClientModal
        client={editingClient}
        isOpen={Boolean(editingClient)}
        onClose={() => setEditingClient(null)}
        onSave={handleSaveClient}
        onDelete={(c) => {
          handleDeleteClient(c);
          setEditingClient(null);
        }}
      />

      {/* Edit Vehicle Modal */}
      <EditVehicleModal
        vehicle={editingVehicle}
        clients={clients}
        existingPlates={existingPlates}
        isOpen={Boolean(editingVehicle)}
        onClose={() => setEditingVehicle(null)}
        onSave={handleSaveVehicle}
        onDelete={(v) => {
          handleDeleteVehicle(v);
          setEditingVehicle(null);
        }}
      />

      {/* Confirm Delete Client Dialog */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Excluir Cliente?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Tem certeza que deseja remover <strong>{clientToDelete.name}</strong>? Os veículos vinculados ficarão sem motorista atribuído.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setClientToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors uppercase"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteClient}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors uppercase shadow-xs"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Vehicle Dialog */}
      {vehicleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Excluir Veículo?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Tem certeza que deseja remover a van com placa <strong className="font-plate text-slate-900 dark:text-white">{vehicleToDelete.plate}</strong> ({vehicleToDelete.model})? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setVehicleToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors uppercase"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteVehicle}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors uppercase shadow-xs"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
