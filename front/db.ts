
import { Vehicle, Client, Sale, VehicleStatus, ClientType, User } from './types';

const STORAGE_KEY = 'automanager_data';
const SESSION_KEY = 'automanager_session';

interface AppData {
  vehicles: Vehicle[];
  clients: Client[];
  sales: Sale[];
  users: User[];
}

const initialData: AppData = {
  vehicles: [
    {
      id: '1',
      plate: 'ABC-1234',
      brand: 'Toyota',
      model: 'Corolla',
      version: 'XEI 2.0',
      yearFab: 2022,
      yearModel: 2023,
      color: 'Prata',
      fuel: 'Flex',
      gear: 'Automático',
      km: 15000,
      salePrice: 125000,
      costPrice: 110000,
      status: VehicleStatus.AVAILABLE,
      observations: 'Único dono, todas as revisões na concessionária.',
      createdAt: new Date().toISOString()
    }
  ],
  clients: [
    {
      id: 'c1',
      type: ClientType.PF,
      name: 'João Silva',
      cpfCnpj: '123.456.789-00',
      phone: '(11) 98888-7777',
      email: 'joao@email.com',
      address: {
        cep: '01001-000',
        street: 'Praça da Sé',
        number: '10',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP'
      },
      observations: 'Cliente preferencial.',
      createdAt: new Date().toISOString()
    }
  ],
  sales: [],
  users: [
    {
      id: 'u1',
      name: 'Admin Principal',
      email: 'admin@admin.com',
      password: 'admin',
      role: 'ADMIN'
    }
  ]
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initialData;
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getCurrentSession = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

export const setCurrentSession = (user: User | null) => {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};
