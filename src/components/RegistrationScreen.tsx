import React, { useState } from 'react';
import { 
  User, 
  Car, 
  FileUp, 
  Calendar, 
  Check, 
  AlertCircle, 
  Trash2, 
  Eye, 
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Tag
} from 'lucide-react';
import { Client, Vehicle } from '../types';
import { validateEmail, validatePhone } from '../utils/storage';
import { parseDate } from '../utils/dateUtils';

interface RegistrationScreenProps {
  clients: Client[];
  vehicles: Vehicle[];
  onSaveRegistration: (clientData: Omit<Client, 'id' | 'createdAt'>, vehicleData: Omit<Vehicle, 'id' | 'client_id' | 'createdAt'>) => { success: boolean; error?: string };
  onNavigateToAlerts: () => void;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  clients,
  vehicles,
  onSaveRegistration,
  onNavigateToAlerts,
}) => {
  // Client fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [idCardFile, setIdCardFile] = useState<{ name: string; url?: string } | null>(null);
  const [licenseFile, setLicenseFile] = useState<{ name: string; url?: string } | null>(null);

  // Vehicle fields
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');
  const [motExpiry, setMotExpiry] = useState('');
  const [taxExpiry, setTaxExpiry] = useState('');
  const [insExpiry, setInsExpiry] = useState('');
  const [rentExpiry, setRentExpiry] = useState('');
  const [rentalRate, setRentalRate] = useState<string>('250');
  const [notes, setNotes] = useState('');

  // Dialog / Error states
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  // File handler for ID/Passport
  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setIdCardFile({ name: file.name, url });
    }
  };

  // File handler for Driving License
  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLicenseFile({ name: file.name, url });
    }
  };

  const validateDateFormat = (dateStr: string, fieldName: string): boolean => {
    if (!dateStr.trim()) return true;
    const parsed = parseDate(dateStr);
    if (!parsed) {
      setDialogError(`Data ${fieldName} inválida. Use o formato YYYY-MM-DD.`);
      return false;
    }
    return true;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDialogError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanPlate = plate.trim().toUpperCase();
    const cleanModel = model.trim();

    // 1. Mandatory validation
    if (!cleanPlate) {
      setDialogError('Placa do veículo é obrigatória.');
      return;
    }

    if (!cleanModel) {
      setDialogError('Modelo do veículo é obrigatório.');
      return;
    }

    if (!cleanName) {
      setDialogError('Nome do cliente é obrigatório.');
      return;
    }

    // 2. Email format validation (KivyMD rule)
    if (cleanEmail && !validateEmail(cleanEmail)) {
      setDialogError('E-mail inválido.');
      return;
    }

    // 3. Phone format validation (KivyMD rule)
    if (cleanPhone && !validatePhone(cleanPhone)) {
      setDialogError('Telefone inválido.');
      return;
    }

    // 4. Duplicate plate check (KivyMD rule)
    const existing = vehicles.find(v => v.plate.toUpperCase() === cleanPlate);
    if (existing) {
      setDialogError('Já existe um veículo cadastrado com essa placa.');
      return;
    }

    // 5. Date validation checks
    if (!validateDateFormat(motExpiry, 'MOT')) return;
    if (!validateDateFormat(taxExpiry, 'Tax')) return;
    if (!validateDateFormat(insExpiry, 'Seguro')) return;
    if (!validateDateFormat(rentExpiry, 'Aluguel')) return;

    // Execute save
    const result = onSaveRegistration(
      {
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        address: address.trim(),
        idCardName: idCardFile?.name,
        licenseName: licenseFile?.name,
        idCardDataUrl: idCardFile?.url,
        licenseDataUrl: licenseFile?.url,
      },
      {
        model: cleanModel,
        plate: cleanPlate,
        mot_expiry: motExpiry,
        tax_expiry: taxExpiry,
        insurance_expiry: insExpiry,
        rent_expiry: rentExpiry,
        rentalRate: rentalRate ? Number(rentalRate) : undefined,
        notes: notes.trim(),
      }
    );

    if (result.success) {
      setSuccessToast(true);
      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setIdCardFile(null);
      setLicenseFile(null);
      setModel('');
      setPlate('');
      setMotExpiry('');
      setTaxExpiry('');
      setInsExpiry('');
      setRentExpiry('');
      setNotes('');

      setTimeout(() => {
        setSuccessToast(false);
        onNavigateToAlerts();
      }, 1200);
    } else {
      setDialogError(result.error || 'Erro ao realizar cadastro.');
    }
  };

  // Helper quick model picker
  const popularModels = [
    'Ford Transit Custom 2.0 EcoBlue',
    'Mercedes-Benz Sprinter 314 CDI',
    'Vauxhall Vivaro 2900 1.5 Turbo D',
    'Renault Master 2.3 dCi 135',
    'Citroën Relay 35 L3H2 Enterprise'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Cadastro de Cliente e Veículo
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Insira os dados do motorista/cliente e do veículo para ativar o monitoramento de prazos legais.
        </p>
      </div>

      {/* Validation Error Dialog / Alert (Mirroring KivyMD MDDialog) */}
      {dialogError && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/80 rounded-xl p-4 flex items-start justify-between gap-3 animate-shake">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Erro de Validação
              </h4>
              <p className="text-sm text-rose-700 dark:text-rose-300 mt-0.5">
                {dialogError}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDialogError(null)}
            className="text-xs font-semibold px-2 py-1 rounded bg-rose-200/60 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 hover:bg-rose-300"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Success Notification */}
      {successToast && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 rounded-xl p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Cadastro realizado com sucesso!
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Redirecionando para tela de alertas...
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: DADOS PESSOAIS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Dados Pessoais do Cliente / Motorista
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Nome Completo */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nome Completo <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Alberto Silva"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-teal-600 focus:ring-1 focus:ring-teal-600 text-sm"
              />
            </div>

            {/* Telefone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Telefone</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +44 7911 123456 ou 11 99999-9999"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-teal-600 focus:ring-1 focus:ring-teal-600 text-sm"
              />
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>E-mail</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: carlos.silva@email.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-teal-600 focus:ring-1 focus:ring-teal-600 text-sm"
              />
            </div>

            {/* Endereço */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Endereço Completo</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: 42 Camden High Street, London NW1 7JE"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-teal-600 focus:ring-1 focus:ring-teal-600 text-sm"
              />
            </div>
          </div>

          {/* Anexos (Buttons from KivyMD: btn_attach_id, btn_attach_license) */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Anexar Identidade/Passaporte */}
            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-3.5 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Identidade / Passaporte
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {idCardFile ? `Arquivo: ${idCardFile.name}` : 'PDF ou foto do documento'}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-teal-600 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors">
                  <FileUp className="w-3.5 h-3.5" />
                  <span>{idCardFile ? 'Identidade Anexada ✓' : 'Anexar Identidade/Passaporte'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleIdUpload}
                    className="hidden"
                  />
                </label>
                {idCardFile && (
                  <button
                    type="button"
                    onClick={() => setIdCardFile(null)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded"
                    title="Remover anexo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Anexar Carteira de Motorista */}
            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-3.5 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Carteira de Motorista (DVLA / CNH)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {licenseFile ? `Arquivo: ${licenseFile.name}` : 'Habilitação britânica ou estrangeira'}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-teal-600 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors">
                  <FileUp className="w-3.5 h-3.5" />
                  <span>{licenseFile ? 'Habilitação Anexada ✓' : 'Anexar Carteira de Motorista'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleLicenseUpload}
                    className="hidden"
                  />
                </label>
                {licenseFile && (
                  <button
                    type="button"
                    onClick={() => setLicenseFile(null)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded"
                    title="Remover anexo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: DADOS DO VEÍCULO */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Car className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Dados do Veículo e Vencimentos Legais
            </h3>
          </div>

          {/* Quick presets for models */}
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">
              Modelos comuns de vans (clique para preencher):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularModels.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Modelo do Veículo */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Modelo do Veículo <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ex: Ford Transit Custom 2.0"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-teal-600 focus:ring-1 focus:ring-teal-600 text-sm"
              />
            </div>

            {/* Placa */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Placa (Registration / Plate) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="Ex: LD71 XYZ"
                  className="font-plate uppercase tracking-wider w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-amber-50/50 dark:bg-amber-950/20 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-teal-600 focus:ring-1 focus:ring-teal-600 text-sm font-bold"
                />
              </div>
            </div>

            {/* Vencimento MOT (YYYY-MM-DD) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Vencimento MOT</span>
                <span className="text-[11px] text-slate-400 font-normal">YYYY-MM-DD</span>
              </label>
              <input
                type="date"
                value={motExpiry}
                onChange={(e) => setMotExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-teal-600 text-sm"
              />
            </div>

            {/* Vencimento Tax (YYYY-MM-DD) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Vencimento Road Tax</span>
                <span className="text-[11px] text-slate-400 font-normal">YYYY-MM-DD</span>
              </label>
              <input
                type="date"
                value={taxExpiry}
                onChange={(e) => setTaxExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-teal-600 text-sm"
              />
            </div>

            {/* Vencimento Seguro (YYYY-MM-DD) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Vencimento Seguro</span>
                <span className="text-[11px] text-slate-400 font-normal">YYYY-MM-DD</span>
              </label>
              <input
                type="date"
                value={insExpiry}
                onChange={(e) => setInsExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-teal-600 text-sm"
              />
            </div>

            {/* Vencimento Aluguel (YYYY-MM-DD) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Vencimento Aluguel</span>
                <span className="text-[11px] text-slate-400 font-normal">YYYY-MM-DD</span>
              </label>
              <input
                type="date"
                value={rentExpiry}
                onChange={(e) => setRentExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-teal-600 text-sm"
              />
            </div>

            {/* Valor Semanal do Aluguel (£) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Valor Semanal do Aluguel (£)
              </label>
              <input
                type="number"
                value={rentalRate}
                onChange={(e) => setRentalRate(e.target.value)}
                placeholder="Ex: 250"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-teal-600 text-sm"
              />
            </div>

            {/* Observações */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Observações do Veículo
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Pneus trocados em Março, rastreador ativo"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-teal-600 text-sm"
              />
            </div>

          </div>
        </div>

        {/* Submit Button (SALVAR CADASTRO) */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold tracking-wide shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-sm uppercase"
          >
            SALVAR CADASTRO
          </button>
        </div>

      </form>
    </div>
  );
};
