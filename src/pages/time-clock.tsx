import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format, differenceInMinutes, parse, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Play, Square, Clock, Plus } from 'lucide-react';

interface TimeEntry {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  isActive: boolean;
}

export function TimeClockPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
  });

  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);

  const calculateDuration = (start: string, end: string): number => {
    const startDate = parse(start, 'HH:mm', new Date());
    const endDate = parse(end, 'HH:mm', new Date());
    return differenceInMinutes(endDate, startDate);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateDailyTotal = (entries: TimeEntry[]): string => {
    const totalMinutes = entries.reduce((total, entry) => {
      if (entry.duration) {
        return total + entry.duration;
      }
      return total;
    }, 0);
    return formatDuration(totalMinutes);
  };

  const handleClockIn = () => {
    if (activeEntry) {
      toast.error('Ya tienes un registro activo');
      return;
    }

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      userId: user?.id || '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: format(new Date(), 'HH:mm'),
      endTime: null,
      duration: null,
      isActive: true,
    };

    setEntries([...entries, newEntry]);
    setActiveEntry(newEntry);
    toast.success('Fichaje iniciado');
  };

  const handleClockOut = () => {
    if (!activeEntry) return;

    const endTime = format(new Date(), 'HH:mm');
    const duration = calculateDuration(activeEntry.startTime, endTime);

    const updatedEntries = entries.map((entry) =>
      entry.id === activeEntry.id
        ? {
            ...entry,
            endTime,
            duration,
            isActive: false,
          }
        : entry
    );

    setEntries(updatedEntries);
    setActiveEntry(null);
    toast.success('Fichaje finalizado');
  };

  const handleManualEntry = () => {
    const { date, startTime, endTime } = manualEntry;

    if (!date || !startTime || !endTime) {
      toast.error('Por favor, complete todos los campos');
      return;
    }

    const startDate = parse(startTime, 'HH:mm', new Date());
    const endDate = parse(endTime, 'HH:mm', new Date());

    if (!isValid(startDate) || !isValid(endDate)) {
      toast.error('Formato de hora inválido');
      return;
    }

    const duration = calculateDuration(startTime, endTime);
    if (duration < 0) {
      toast.error('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      userId: user?.id || '',
      date,
      startTime,
      endTime,
      duration,
      isActive: false,
    };

    setEntries([...entries, newEntry]);
    setShowManualEntry(false);
    setManualEntry({
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '',
      endTime: '',
    });
    toast.success('Registro manual añadido');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Control de Fichaje</h2>
        <div className="flex gap-2">
          <Dialog open={showManualEntry} onOpenChange={setShowManualEntry}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Registro Manual
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Registro Manual</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={manualEntry.date}
                      onChange={(e) =>
                        setManualEntry({ ...manualEntry, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Hora de Inicio</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={manualEntry.startTime}
                      onChange={(e) =>
                        setManualEntry({ ...manualEntry, startTime: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Hora de Fin</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={manualEntry.endTime}
                      onChange={(e) =>
                        setManualEntry({ ...manualEntry, endTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleManualEntry} className="w-full">
                  Guardar Registro
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {activeEntry ? (
            <Button onClick={handleClockOut} variant="destructive">
              <Square className="mr-2 h-4 w-4" />
              Terminar
            </Button>
          ) : (
            <Button onClick={handleClockIn}>
              <Play className="mr-2 h-4 w-4" />
              Comenzar
            </Button>
          )}
        </div>
      </div>

      {activeEntry && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Fichaje Activo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">
                Inicio: {format(parse(activeEntry.startTime, 'HH:mm', new Date()), 'HH:mm')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(entriesByDate)
          .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
          .map(([date, dayEntries]) => (
            <Card key={date}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {format(new Date(date), 'EEEE, d MMMM yyyy', { locale: es })}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Total: {calculateDailyTotal(dayEntries)}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Inicio</TableHead>
                      <TableHead>Fin</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dayEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.startTime}</TableCell>
                        <TableCell>{entry.endTime || '--:--'}</TableCell>
                        <TableCell>
                          {entry.duration ? formatDuration(entry.duration) : '--:--'}
                        </TableCell>
                        <TableCell>
                          {entry.isActive ? (
                            <span className="text-green-600 font-medium">Activo</span>
                          ) : (
                            <span className="text-muted-foreground">Completado</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}