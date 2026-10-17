import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Save, Trash2, Calendar, User, Car } from 'lucide-react';
import { Client, Vehicle } from '../types';
import { validateEmail, validatePhone } from '../utils/storage';
import { parseDate } from '../utils/dateUtils';

// -------------------------------------------------------------
// EDIT CLIENT MODAL (Replicating KivyMD open_edit_dialog for Client)
// -------------------------------------------------------------
interface EditClientModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedClient: Client) => void;
  onDelete: (client: Client) => void;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({
  client,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (client) {
      setName(client.name || '');
      setPhone(client.phone || '');
      setEmail(client.email || '');
      setAddress(client.address || '');
      setError(null);
    }
  }, [client]);

  if (!isOpen || !client) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nome é obrigatório.');
      return;
    }
    if (email.trim() && !validateEmail(email.trim())) {
      setError('E-mail inválido.');
      return;
    }
    if (phone.trim() && !validatePhone(phone.trim())) {
      setError('Telefone inválido.');
      return;
    }

    onSave({
      ...client,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Editar Cliente
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Telefone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Endereço
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-600"
            />
          </div>

          {/* Dialog Action Buttons: EXCLUIR, CANCELAR, SALVAR (Exact match to KivyMD buttons) */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                onDelete(client);
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors uppercase"
            >
              EXCLUIR
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors uppercase"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors uppercase shadow-xs"
              >
                SALVAR
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};


// -------------------------------------------------------------
// EDIT VEHICLE MODAL (Replicating KivyMD open_edit_dialog for Vehicle)
// -------------------------------------------------------------
interface EditVehicleModalProps {
  vehicle: Vehicle | null;
  clients: Client[];
  existingPlates: string[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedVehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  vehicle,
  clients,
  existingPlates,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');
  const [motExpiry, setMotExpiry] = useState('');
  const [taxExpiry, setTaxExpiry] = useState('');
  const [insExpiry, setInsExpiry] = useState('');
  const [rentExpiry, setRentExpiry] = useState('');
  const [clientId, setClientId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (vehicle) {
      setModel(vehicle.model || '');
      setPlate(vehicle.plate || '');
      setMotExpiry(vehicle.mot_expiry || '');
      setTaxExpiry(vehicle.tax_expiry || '');
      setInsExpiry(vehicle.insurance_expiry || '');
      setRentExpiry(vehicle.rent_expiry || '');
      setClientId(vehicle.client_id || '');
      setNotes(vehicle.notes || '');
      setError(null);
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPlate = plate.trim().toUpperCase();
    const cleanModel = model.trim();

    if (!cleanPlate) {
      setError('Placa é obrigatória.');
      return;
    }
    if (!cleanModel) {
      setError('Modelo é obrigatório.');
      return;
    }

    // Check if plate changed and duplicate
    if (cleanPlate !== vehicle.plate && existingPlates.includes(cleanPlate)) {
      setError('Já existe um veículo cadastrado com essa placa.');
      return;
    }

    // Date validation
    if (motExpiry && !parseDate(motExpiry)) {
      setError('Formato de data inválido para MOT. Use YYYY-MM-DD.');
      return;
    }
    if (taxExpiry && !parseDate(taxExpiry)) {
      setError('Formato de data inválido para Tax. Use YYYY-MM-DD.');
      return;
    }
    if (insExpiry && !parseDate(insExpiry)) {
      setError('Formato de data inválido para Seguro. Use YYYY-MM-DD.');
      return;
    }
    if (rentExpiry && !parseDate(rentExpiry)) {
      setError('Formato de data inválido para Aluguel. Use YYYY-MM-DD.');
      return;
    }

    onSave({
      ...vehicle,
      model: cleanModel,
      plate: cleanPlate,
      mot_expiry: motExpiry,
      tax_expiry: taxExpiry,
      insurance_expiry: insExpiry,
      rent_expiry: rentExpiry,
      client_id: clientId,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Editar Veículo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Modelo */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Modelo do Veículo
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-600"
              />
            </div>

            {/* Placa */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Placa
              </label>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                className="font-plate uppercase font-bold w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-amber-50/50 dark:bg-amber-950/20 text-slate-900 dark:text-white text-sm focus:outline-teal-600"
              />
            </div>

            {/* Motorista Vinculado */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Cliente / Motorista
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-600"
              >
                <option value="">Não vinculado</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Vencimento MOT */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Vencimento MOT (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={motExpiry}
                onChange={(e) => setMotExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-600"
              />
            </div>

            {/* Vencimento Tax */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Vencimento Tax (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={taxExpiry}
                onChange={(e) => setTaxExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-600"
              />
            </div>

            {/* Vencimento Seguro */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Vencimento Seguro (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={insExpiry}
                onChange={(e) => setInsExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-600"
              />
            </div>

            {/* Vencimento Aluguel */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Vencimento Aluguel (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={rentExpiry}
                onChange={(e) => setRentExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-600"
              />
            </div>

            {/* Observações */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Observações
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-600"
              />
            </div>

          </div>

          {/* Dialog Action Buttons: EXCLUIR, CANCELAR, SALVAR (Exact match to KivyMD buttons) */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                onDelete(vehicle);
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors uppercase"
            >
              EXCLUIR
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors uppercase"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors uppercase shadow-xs"
              >
                SALVAR
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
