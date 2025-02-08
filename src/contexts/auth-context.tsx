import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'responsable' | 'trabajador';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dni: string;
}

interface AuthContextType {
  user: User | null;
  login: (dni: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (dni: string, password: string) => {
    // TODO: Implement actual authentication
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      dni,
      role: 'admin',
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};