export interface User {
  id: string;
  name: string;
  email: string;
  dni: string;
  role: UserRole;
  department: string;
  status: string;
  image?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  startDate?: string;
  endDate?: string;
  plrRole: 'visita-obra' | 'mantenimiento' | 'obra';
  conceptVisibility: 'oficina' | 'mantenimiento' | 'obras';
}

export type UserRole = 'admin' | 'responsable' | 'trabajador';

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
}