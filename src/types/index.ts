export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  idCardName?: string;
  licenseName?: string;
  idCardDataUrl?: string;
  licenseDataUrl?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  mot_expiry: string; // YYYY-MM-DD
  tax_expiry: string; // YYYY-MM-DD
  insurance_expiry: string; // YYYY-MM-DD
  rent_expiry: string; // YYYY-MM-DD
  client_id: string;
  rentalRate?: number;
  notes?: string;
  createdAt: string;
}

export type ExpiryType = 'mot' | 'tax' | 'ins' | 'rent';

export interface AlertItem {
  id: string;
  vehicleId: string;
  plate: string;
  model: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  docType: ExpiryType;
  docName: string; // MOT, Road Tax, Seguro, Aluguel
  expiryDate: string; // YYYY-MM-DD
  daysRemaining: number;
  urgency: 'expired' | 'today' | 'urgent_1_3' | 'upcoming_30' | 'ok';
}

export type TabType = 'alerts' | 'register' | 'vehicles' | 'clients' | 'dashboard';
