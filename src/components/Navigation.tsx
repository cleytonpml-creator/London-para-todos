import React from 'react';
import { Bell, UserPlus, Car, Users, LayoutDashboard } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  urgentAlertsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  urgentAlertsCount,
}) => {
  const tabs = [
    {
      id: 'alerts' as TabType,
      label: 'Alertas',
      icon: Bell,
      badge: urgentAlertsCount > 0 ? urgentAlertsCount : null,
      urgentBadge: true,
    },
    {
      id: 'register' as TabType,
      label: 'Novo Cadastro',
      icon: UserPlus,
    },
    {
      id: 'vehicles' as TabType,
      label: 'Frota de Veículos',
      icon: Car,
    },
    {
      id: 'clients' as TabType,
      label: 'Clientes',
      icon: Users,
    },
    {
      id: 'dashboard' as TabType,
      label: 'Visão Geral',
      icon: LayoutDashboard,
    },
  ];

  return (
    <>
      {/* Desktop / Tablet Sub-header Navigation Bar */}
      <nav aria-label="Navegação principal" className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto py-2 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap focus-visible:outline-teal-600 ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700 dark:text-teal-300' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== null && tab.badge !== undefined && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 text-[11px] font-bold rounded-full ${
                        tab.urgentBadge
                          ? 'bg-amber-500 text-slate-900 animate-pulse'
                          : 'bg-teal-700 text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Mirroring KivyMD MDBottomNavigation) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg safe-bottom">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={`mobile-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
                  isActive
                    ? 'text-teal-700 dark:text-teal-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {tab.badge !== null && tab.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2 px-1 text-[10px] leading-tight font-bold rounded-full bg-amber-500 text-slate-900">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
