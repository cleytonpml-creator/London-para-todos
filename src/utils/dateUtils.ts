import { AlertItem, ExpiryType, Vehicle, Client } from '../types';

export function parseDate(dateStr: string): Date | null {
  if (!dateStr || !dateStr.trim()) return null;
  const parts = dateStr.trim().split('-');
  if (parts.length !== 3) return null;
  const [year, month, day] = parts.map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  const d = new Date(year, month - 1, day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDateBr(dateStr: string): string {
  if (!dateStr) return '-';
  const d = parseDate(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString('pt-BR');
}

export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getRelativeDays(dateStr: string): number | null {
  const target = parseDate(dateStr);
  if (!target) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getUrgency(days: number): 'expired' | 'today' | 'urgent_1_3' | 'upcoming_30' | 'ok' {
  if (days < 0) return 'expired';
  if (days === 0) return 'today';
  if (days <= 3) return 'urgent_1_3';
  if (days <= 30) return 'upcoming_30';
  return 'ok';
}

export function extractAlerts(vehicles: Vehicle[], clients: Client[]): AlertItem[] {
  const alerts: AlertItem[] = [];
  const clientMap = new Map(clients.map(c => [c.id, c]));

  const fields: { key: keyof Vehicle; type: ExpiryType; name: string }[] = [
    { key: 'mot_expiry', type: 'mot', name: 'MOT' },
    { key: 'tax_expiry', type: 'tax', name: 'Tax' },
    { key: 'insurance_expiry', type: 'ins', name: 'Seguro' },
    { key: 'rent_expiry', type: 'rent', name: 'Aluguel' },
  ];

  vehicles.forEach(vehicle => {
    const client = clientMap.get(vehicle.client_id) || {
      id: '',
      name: 'Cliente Não Vinculado',
      phone: '',
      email: '',
      address: '',
      createdAt: ''
    };

    fields.forEach(({ key, type, name }) => {
      const dateVal = vehicle[key] as string;
      if (dateVal && dateVal.trim()) {
        const days = getRelativeDays(dateVal);
        if (days !== null) {
          const urgency = getUrgency(days);
          alerts.push({
            id: `${vehicle.id}-${type}`,
            vehicleId: vehicle.id,
            plate: vehicle.plate,
            model: vehicle.model,
            clientId: client.id,
            clientName: client.name,
            clientPhone: client.phone,
            clientEmail: client.email,
            docType: type,
            docName: name,
            expiryDate: dateVal,
            daysRemaining: days,
            urgency,
          });
        }
      }
    });
  });

  // Sort by daysRemaining ascending (most urgent first)
  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
