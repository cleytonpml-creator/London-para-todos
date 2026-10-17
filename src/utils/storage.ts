import * as XLSX from 'xlsx';
import { Client, Vehicle } from '../types';

const CLIENTS_STORAGE_KEY = 'london_fleet_clients_v1';
const VEHICLES_STORAGE_KEY = 'london_fleet_vehicles_v1';

// Helper to get formatted relative date
function getRelativeDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Carlos Alberto Silva',
    phone: '+44 7911 123456',
    email: 'carlos.silva@translog.co.uk',
    address: '42 Camden High Street, London NW1 7JE',
    idCardName: 'passaporte_carlos_silva.pdf',
    licenseName: 'cnh_uk_carlos_silva.jpg',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c2',
    name: 'Mariana Duarte Ramos',
    phone: '+44 7700 900123',
    email: 'mariana.ramos@expressfleet.uk',
    address: '18 Commercial Road, Tower Hamlets, London E1 1LD',
    idCardName: 'id_mariana_ramos.pdf',
    licenseName: 'driving_licence_mariana.png',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c3',
    name: 'João Pedro Carvalho',
    phone: '+44 7820 445566',
    email: 'jp.carvalho@londoncourier.co.uk',
    address: '88 Brixton Road, Lambeth, London SW9 6BE',
    idCardName: 'passport_joao_carvalho.pdf',
    licenseName: 'dvla_licence_joao.jpg',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c4',
    name: 'Patrícia Souza Lima',
    phone: '+44 7450 889900',
    email: 'patricia.lima@fastdelivery.co.uk',
    address: '15 Goldhawk Road, Shepherd\'s Bush, London W12 8QQ',
    idCardName: 'identidade_patricia.pdf',
    licenseName: 'uk_license_patricia.pdf',
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    model: 'Ford Transit Custom 2.0 EcoBlue L2H1',
    plate: 'LD71 XYZ',
    mot_expiry: getRelativeDate(0), // Today!
    tax_expiry: getRelativeDate(180),
    insurance_expiry: getRelativeDate(15),
    rent_expiry: getRelativeDate(1), // Tomorrow (1 day)
    client_id: 'c1',
    rentalRate: 240,
    notes: 'Van para entregas rápidas na região Central e Norte de Londres.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'v2',
    model: 'Mercedes-Benz Sprinter 314 CDI High Roof',
    plate: 'LO22 FGH',
    mot_expiry: getRelativeDate(3), // In 3 days (Urgent)
    tax_expiry: getRelativeDate(2), // In 2 days (Urgent)
    insurance_expiry: getRelativeDate(90),
    rent_expiry: getRelativeDate(7),
    client_id: 'c2',
    rentalRate: 310,
    notes: 'Veículo com prateleiras instaladas e câmera de ré 360.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'v3',
    model: 'Vauxhall Vivaro 2900 1.5 Turbo D Dynamic',
    plate: 'VA20 KLN',
    mot_expiry: getRelativeDate(-2), // Expired 2 days ago
    tax_expiry: getRelativeDate(120),
    insurance_expiry: getRelativeDate(0), // Today!
    rent_expiry: getRelativeDate(14),
    client_id: 'c3',
    rentalRate: 220,
    notes: 'Utilizado em serviços postais e e-commerce.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'v4',
    model: 'Renault Master 2.3 dCi 135 Business Panel Van',
    plate: 'BW69 TRP',
    mot_expiry: getRelativeDate(45),
    tax_expiry: getRelativeDate(60),
    insurance_expiry: getRelativeDate(75),
    rent_expiry: getRelativeDate(2), // In 2 days (Urgent)
    client_id: 'c4',
    rentalRate: 280,
    notes: 'Capacidade de carga estendida para fretes pesados.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'v5',
    model: 'Citroën Relay 35 L3H2 Enterprise BlueHDi',
    plate: 'EU21 ZBR',
    mot_expiry: getRelativeDate(12),
    tax_expiry: getRelativeDate(25),
    insurance_expiry: getRelativeDate(110),
    rent_expiry: getRelativeDate(30),
    client_id: 'c1',
    rentalRate: 275,
    notes: 'Veículo reserva com rastreador GPS ativo.',
    createdAt: new Date().toISOString(),
  }
];

export function getStoredClients(): Client[] {
  try {
    const raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(DEFAULT_CLIENTS));
      return DEFAULT_CLIENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading clients from storage:', err);
    return DEFAULT_CLIENTS;
  }
}

export function saveStoredClients(clients: Client[]): void {
  try {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  } catch (err) {
    console.error('Error saving clients:', err);
  }
}

export function getStoredVehicles(): Vehicle[] {
  try {
    const raw = localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(DEFAULT_VEHICLES));
      return DEFAULT_VEHICLES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading vehicles from storage:', err);
    return DEFAULT_VEHICLES;
  }
}

export function saveStoredVehicles(vehicles: Vehicle[]): void {
  try {
    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
  } catch (err) {
    console.error('Error saving vehicles:', err);
  }
}

export function resetToDefaults(): { clients: Client[]; vehicles: Vehicle[] } {
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(DEFAULT_CLIENTS));
  localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(DEFAULT_VEHICLES));
  return { clients: DEFAULT_CLIENTS, vehicles: DEFAULT_VEHICLES };
}

export function validateEmail(email: string): boolean {
  if (!email || !email.trim()) return true; // Optional in form
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  if (!phone || !phone.trim()) return true; // Optional in form
  const pattern = /^\+?(\d{1,3})?[-.\s]?(\d{1,4})?[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;
  return pattern.test(phone.trim());
}

export function exportVehiclesToExcel(vehicles: Vehicle[], clients: Client[]): void {
  const clientMap = new Map(clients.map(c => [c.id, c]));

  const rows = vehicles.map(v => {
    const client = clientMap.get(v.client_id);
    return {
      'ID Veículo': v.id,
      'Modelo': v.model,
      'Placa': v.plate,
      'Cliente Responsável': client?.name || 'Não vinculado',
      'Telefone Cliente': client?.phone || '-',
      'E-mail Cliente': client?.email || '-',
      'Endereço Cliente': client?.address || '-',
      'Vencimento MOT': v.mot_expiry || '-',
      'Vencimento Road Tax': v.tax_expiry || '-',
      'Vencimento Seguro': v.insurance_expiry || '-',
      'Vencimento Aluguel': v.rent_expiry || '-',
      'Valor Semanal (£)': v.rentalRate ? `£${v.rentalRate}` : '-',
      'Observações': v.notes || '',
      'Data de Cadastro': v.createdAt ? new Date(v.createdAt).toLocaleDateString('pt-BR') : '-'
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-fit column widths
  const colWidths = [
    { wch: 12 }, // ID
    { wch: 35 }, // Modelo
    { wch: 14 }, // Placa
    { wch: 25 }, // Cliente
    { wch: 18 }, // Telefone
    { wch: 28 }, // Email
    { wch: 35 }, // Endereço
    { wch: 16 }, // MOT
    { wch: 16 }, // Tax
    { wch: 16 }, // Seguro
    { wch: 16 }, // Aluguel
    { wch: 16 }, // Valor
    { wch: 35 }, // Notas
    { wch: 16 }, // Data
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Frota de Veículos');

  // Generate Excel file and trigger browser download
  XLSX.writeFile(workbook, 'frota_veiculos.xlsx');
}
