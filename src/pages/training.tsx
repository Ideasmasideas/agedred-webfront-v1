import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Users, Euro } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for trainings
const trainings = [
  {
    id: '1',
    name: 'Riesgos Laborales',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    description: 'Formación completa sobre prevención de riesgos laborales, incluyendo identificación de peligros, evaluación de riesgos, medidas preventivas, normativa vigente, y protocolos de actuación en caso de emergencia. El curso aborda aspectos ergonómicos, riesgos psicosociales, y uso adecuado de equipos de protección individual.',
    totalCost: 2500,
    individualCost: 250,
    participants: 10,
  },
  {
    id: '2',
    name: 'Seguridad Industrial',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    description: 'Programa especializado en seguridad industrial que cubre protocolos de seguridad en entornos industriales, manejo de maquinaria, sustancias peligrosas, y sistemas de prevención de accidentes. Incluye prácticas de primeros auxilios, planes de evacuación, y gestión de situaciones de emergencia en entornos industriales.',
    totalCost: 3000,
    individualCost: 300,
    participants: 8,
  },
  {
    id: '3',
    name: 'Formaciones',
    startDate: '2024-05-01',
    endDate: '2024-05-03',
    description: 'Gestión y desarrollo de programas formativos internos, metodologías de enseñanza y evaluación del aprendizaje.',
    totalCost: 1500,
    individualCost: 150,
    participants: 12,
  },
];

// Mock data for employees
const employees = [
  { id: '1', name: 'Sarah Wilson', department: 'Ingeniería' },
  { id: '2', name: 'Michael Chen', department: 'Producto' },
  { id: '3', name: 'Emily Rodriguez', department: 'Diseño' },
];

interface TrainingDetailsProps {
  training: typeof trainings[0];
  onClose: () => void;
}

function TrainingDetails({ training, onClose }: TrainingDetailsProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleAssignEmployees = () => {
    toast.success(`${selectedEmployees.length} empleados asignados a ${training.name}`);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">{training.name}</h3>
        <div className="text-sm text-muted-foreground">
          {format(new Date(training.startDate), 'PP', { locale: es })} - {format(new Date(training.endDate), 'PP', { locale: es })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coste Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Euro className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{training.totalCost}€</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coste Individual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Euro className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{training.individualCost}€</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{training.participants}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{training.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asignar Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Departamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => handleEmployeeToggle(employee.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleAssignEmployees}>
                Asignar Empleados Seleccionados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function TrainingPage() {
  const [selectedTraining, setSelectedTraining] = useState<typeof trainings[0] | null>(null);
  const [showNewTraining, setShowNewTraining] = useState(false);
  const [newTraining, setNewTraining] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    totalCost: '',
    individualCost: '',
  });

  const handleCreateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Formación creada con éxito');
    setShowNewTraining(false);
    setNewTraining({
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      totalCost: '',
      individualCost: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Formaciones</h2>
        <Dialog open={showNewTraining} onOpenChange={setShowNewTraining}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Formación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Formación</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTraining} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={newTraining.name}
                  onChange={(e) => setNewTraining({ ...newTraining, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newTraining.startDate}
                    onChange={(e) => setNewTraining({ ...newTraining, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newTraining.endDate}
                    onChange={(e) => setNewTraining({ ...newTraining, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newTraining.description}
                  onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="totalCost">Coste Total (€)</Label>
                  <Input
                    id="totalCost"
                    type="number"
                    value={newTraining.totalCost}
                    onChange={(e) => setNewTraining({ ...newTraining, totalCost: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="individualCost">Coste Individual (€)</Label>
                  <Input
                    id="individualCost"
                    type="number"
                    value={newTraining.individualCost}
                    onChange={(e) => setNewTraining({ ...newTraining, individualCost: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewTraining(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Formación</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!selectedTraining} onOpenChange={() => setSelectedTraining(null)}>
        <DialogContent className="sm:max-w-[900px]">
          {selectedTraining && (
            <TrainingDetails
              training={selectedTraining}
              onClose={() => setSelectedTraining(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Fin</TableHead>
              <TableHead>Coste Total</TableHead>
              <TableHead>Coste Individual</TableHead>
              <TableHead>Participantes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainings.map((training) => (
              <TableRow
                key={training.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedTraining(training)}
              >
                <TableCell className="font-medium">{training.name}</TableCell>
                <TableCell>{format(new Date(training.startDate), 'PP', { locale: es })}</TableCell>
                <TableCell>{format(new Date(training.endDate), 'PP', { locale: es })}</TableCell>
                <TableCell>{training.totalCost}€</TableCell>
                <TableCell>{training.individualCost}€</TableCell>
                <TableCell>{training.participants}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}