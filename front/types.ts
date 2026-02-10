
export enum VehicleStatus {
  AVAILABLE = 'Disponível',
  RESERVED = 'Reservado',
  SOLD = 'Vendido',
  INACTIVE = 'Inativo'
}

export enum ClientType {
  PF = 'Pessoa Física',
  PJ = 'Pessoa Jurídica'
}

export enum PaymentMethod {
  CASH = 'À vista',
  FINANCING = 'Financiamento',
  CONSORTIUM = 'Consórcio',
  CARD = 'Cartão',
  PIX = 'Pix',
  BOLETO = 'Boleto',
  OTHER = 'Outro'
}

export interface Vehicle {
  id: string;
  plate: string;
  renavam?: string;
  chassis?: string;
  brand: string;
  model: string;
  version: string;
  yearFab: number;
  yearModel: number;
  color: string;
  fuel: string;
  gear: string;
  km: number;
  salePrice: number;
  costPrice?: number;
  status: VehicleStatus;
  observations: string;
  createdAt: string;
}

export interface Client {
  id: string;
  type: ClientType;
  name: string;
  cpfCnpj: string;
  rgIe?: string;
  phone: string;
  email: string;
  address: {
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  observations: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  clientId: string;
  vehicleId: string;
  saleDate: string;
  listPrice: number;
  discountValue: number;
  finalValue: number;
  paymentMethod: PaymentMethod;
  downPayment?: number;
  installmentsCount?: number;
  installmentsValue?: number;
  observations: string;
  sellerId: string;
  createdAt: string;
}

export type UserRole = 'ADMIN' | 'SELLER';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}
