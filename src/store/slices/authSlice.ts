import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '@/types/user';
import api from '@/lib/axios';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface LoginResponse {
  status: string;
  data: {
    id: number;
    dni: string;
    name: string;
    phone: string;
    level: string | null;
    number: string | null;
    job: string | null;
    department: string | null;
    dischargeDate: string | null;
    responsable: string | null;
    gdpr: string;
    contract: string | null;
    image: string | null;
    role: string;
    status: string;
    employRoleId: number | null;
    conceptRolId: number;
    file: string | null;
    created_at: string | null;
    updated_at: string;
    managerId: number | null;
    pwd: string;
    block: string | null;
    fcm: string | null;
    logInfo: string | null;
    email: string;
    bajaDate: string | null;
    profilePicture: string | null;
  };
  condition: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { dni: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<LoginResponse>('/login-employ', credentials);
      
      if (response.data.status !== 'Success') {
        return rejectWithValue('Credenciales inválidas');
      }

      const userData = response.data.data;
      
      // Transform the API response into our User type
      const user: User = {
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email,
        dni: userData.dni,
        role: (userData.role.toLowerCase() as User['role']) || 'trabajador',
        department: userData.department || '',
        status: userData.status,
        image: userData.profilePicture || userData.image,
        phone: userData.phone,
        plrRole: 'mantenimiento', // Default value since it's not in the API response
        conceptVisibility: 'oficina', // Default value since it's not in the API response
      };
      
      return { user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        'Error al iniciar sesión. Por favor, verifica tus credenciales.'
      );
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;