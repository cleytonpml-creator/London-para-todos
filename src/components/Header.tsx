import React from 'react';
import { Truck, Moon, Sun, ShieldAlert, RotateCcw } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  urgentAlertsCount: number;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  urgentAlertsCount,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-teal-800 dark:bg-slate-900 text-white shadow-md border-b border-teal-700/50 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shadow-inner">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                London para Todos
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider bg-teal-900/80 text-teal-200 border border-teal-600/40 px-2 py-0.5 rounded">
                Gestão de Frota
              </span>
            </div>
            <p className="text-xs text-teal-100/80 dark:text-slate-400 hidden xs:block">
              Controle de Veículos, Clientes e Alertas
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Urgent alert counter if any */}
          {urgentAlertsCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-semibold animate-pulse">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{urgentAlertsCount} {urgentAlertsCount === 1 ? 'alerta' : 'alertas'}</span>
            </div>
          )}

          {/* Reset Demo Data button */}
          <button
            onClick={onResetData}
            title="Restaurar dados de demonstração"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-teal-100 hover:text-white bg-teal-900/60 hover:bg-teal-900 dark:bg-slate-800 dark:hover:bg-slate-700 border border-teal-700/60 dark:border-slate-700 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Dados Demo</span>
          </button>

          {/* Theme switch from Python MDSwitch */}
          <div className="flex items-center gap-2 pl-2 border-l border-teal-700 dark:border-slate-800">
            <span className="text-xs text-teal-100/80 dark:text-slate-400 hidden sm:inline">
              {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
            </span>
            <button
              onClick={onToggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-teal-800 dark:focus:ring-offset-slate-900 ${
                isDarkMode ? 'bg-amber-500' : 'bg-teal-950/60'
              }`}
              role="switch"
              aria-checked={isDarkMode}
              aria-label="Alternar tema escuro"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform flex items-center justify-center text-[10px] text-slate-800 ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              >
                {isDarkMode ? <Moon className="w-2.5 h-2.5 text-amber-600" /> : <Sun className="w-2.5 h-2.5 text-amber-500" />}
              </span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
