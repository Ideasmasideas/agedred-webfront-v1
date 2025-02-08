import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { login } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryDni, setRecoveryDni] = useState('');
  const [errors, setErrors] = useState({
    dni: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {
      dni: '',
      password: '',
    };
    let isValid = true;

    if (!dni.trim()) {
      newErrors.dni = 'Debe introducir el DNI';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Debe introducir la contraseña';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const resultAction = await dispatch(login({ dni, password })).unwrap();
      if (resultAction.user) {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error || 'Credenciales inválidas');
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryDni.trim()) {
      toast.error('Debe introducir el DNI');
      return;
    }
    toast.success('Si el DNI existe en el sistema, recibirás un correo con las instrucciones');
    setShowRecovery(false);
    setRecoveryDni('');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("https://app.agefred.es/assets/images/bg-login.webp")' }}
    >
      <Card className="w-[400px] bg-white/95 backdrop-blur-sm">
        <CardHeader className="flex justify-center pb-2">
          <img 
            src="https://app.agefred.es/assets/images/agefred-logo-50-positivo.png" 
            alt="Agefred Logo" 
            className="h-12 object-contain"
          />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value);
                  if (errors.dni) setErrors({ ...errors, dni: '' });
                }}
                className={errors.dni ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.dni && (
                <p className="text-sm text-red-500">{errors.dni}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={errors.password ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
            <div className="text-center">
              <Button
                variant="link"
                type="button"
                onClick={() => setShowRecovery(true)}
                className="text-sm text-muted-foreground hover:text-primary"
                disabled={loading}
              >
                ¿Has olvidado tu contraseña?
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showRecovery} onOpenChange={setShowRecovery}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recuperar contraseña</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRecoverySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recoveryDni">DNI</Label>
              <Input
                id="recoveryDni"
                value={recoveryDni}
                onChange={(e) => setRecoveryDni(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowRecovery(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Enviar instrucciones
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}