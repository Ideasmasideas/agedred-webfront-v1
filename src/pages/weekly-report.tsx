import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface WeeklyReport {
  id: string;
  startDate: Date;
  endDate: Date;
  entries: ReportEntry[];
  status?: string;
}

interface ReportEntry {
  id: string;
  project: string;
  task: string;
  concept: string;
  hours: number[];
}

const mockProjects = [
  { id: '15338MTB', name: 'Mantenimiento clima oficinas' },
  { id: '16045MTB', name: 'Mantenimiento Hotel FAIRMONT REY JUAN CARLOS I' },
];

const mockTasks = [
  { id: '2024-MANT', name: 'Mantenimiento clima oficinas' },
  { id: '112', name: 'Formación' },
];

const mockConcepts = [
  { id: 'HE', name: 'Nº Horas Extras' },
  { id: 'KM', name: 'Km. Vehículo propio (Exentos)' },
];

export function WeeklyReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reportData = location.state;

  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);

  useEffect(() => {
    if (reportData) {
      const { reportId, startDate, endDate, status } = reportData;
      if (reportId) {
        // If we have a reportId, we're editing an existing report
        setSelectedReport({
          id: reportId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status,
          entries: [{
            id: Date.now().toString(),
            project: '',
            task: '',
            concept: '',
            hours: [0, 0, 0, 0, 0, 0, 0],
          }],
        });
      } else {
        // If we don't have a reportId, we're creating a new report
        createNewWeeklyReport(new Date(startDate));
      }
    }
  }, [reportData]);

  const weekDays = selectedReport 
    ? eachDayOfInterval({ start: selectedReport.startDate, end: selectedReport.endDate })
    : [];

  const createNewWeeklyReport = (date: Date) => {
    const startDate = startOfWeek(date, { locale: es });
    const endDate = endOfWeek(date, { locale: es });
    const newReport: WeeklyReport = {
      id: Date.now().toString(),
      startDate,
      endDate,
      entries: [{
        id: Date.now().toString(),
        project: '',
        task: '',
        concept: '',
        hours: [0, 0, 0, 0, 0, 0, 0],
      }],
    };
    setReports([...reports, newReport]);
    setSelectedReport(newReport);
  };

  const addNewLine = () => {
    if (!selectedReport) return;

    const newEntry: ReportEntry = {
      id: Date.now().toString(),
      project: '',
      task: '',
      concept: '',
      hours: [0, 0, 0, 0, 0, 0, 0],
    };

    setSelectedReport({
      ...selectedReport,
      entries: [...selectedReport.entries, newEntry],
    });
  };

  const updateEntry = (entryId: string, field: keyof ReportEntry, value: any) => {
    if (!selectedReport) return;

    setSelectedReport({
      ...selectedReport,
      entries: selectedReport.entries.map(entry =>
        entry.id === entryId
          ? { ...entry, [field]: value }
          : entry
      ),
    });
  };

  const updateHours = (entryId: string, dayIndex: number, value: number) => {
    if (!selectedReport) return;

    setSelectedReport({
      ...selectedReport,
      entries: selectedReport.entries.map(entry =>
        entry.id === entryId
          ? {
              ...entry,
              hours: entry.hours.map((h, i) => i === dayIndex ? value : h),
            }
          : entry
      ),
    });
  };

  const removeLine = (entryId: string) => {
    if (!selectedReport) return;

    setSelectedReport({
      ...selectedReport,
      entries: selectedReport.entries.filter(entry => entry.id !== entryId),
    });
  };

  const calculateTotals = () => {
    if (!selectedReport) return Array(7).fill(0);

    return selectedReport.entries.reduce((totals, entry) => {
      entry.hours.forEach((hours, index) => {
        totals[index] += hours;
      });
      return totals;
    }, Array(7).fill(0));
  };

  if (!selectedReport) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/reports')}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver al listado de partes
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="py-1">
            <span className="font-bold">
              Semana del {format(selectedReport.startDate, 'dd/MM/yyyy')} al {format(selectedReport.endDate, 'dd/MM/yyyy')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            <div className="rounded-lg">
              <div className="grid grid-cols-[2fr,2fr,2fr,repeat(7,1fr),auto] border-b items-center bg-muted/50">
                <div className="p-2">Proyecto</div>
                <div className="p-2">Tarea</div>
                <div className="p-2">Concepto</div>
                {weekDays.map((day, i) => (
                  <div key={i} className="text-center p-2 border-l">
                    {format(day, 'EEE', { locale: es })}
                    <div className="text-xs text-muted-foreground">
                      {format(day, 'dd/MM')}
                    </div>
                  </div>
                ))}
                <div className="p-2 border-l"></div>
              </div>
              <div className="divide-y">
                {selectedReport.entries.map((entry) => (
                  <div key={entry.id} className="grid grid-cols-[2fr,2fr,2fr,repeat(7,1fr),auto] items-center">
                    <div className="p-2">
                      <Select value={entry.project} onValueChange={(value) => updateEntry(entry.id, 'project', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar proyecto" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProjects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.id} - {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-2">
                      <Select value={entry.task} onValueChange={(value) => updateEntry(entry.id, 'task', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar tarea" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTasks.map((task) => (
                            <SelectItem key={task.id} value={task.id}>
                              {task.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-2">
                      <Select value={entry.concept} onValueChange={(value) => updateEntry(entry.id, 'concept', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar concepto" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockConcepts.map((concept) => (
                            <SelectItem key={concept.id} value={concept.id}>
                              {concept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {entry.hours.map((hours, index) => (
                      <div key={index} className="p-2 border-l">
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          value={hours}
                          onChange={(e) => updateHours(entry.id, index, parseFloat(e.target.value) || 0)}
                          className="text-center"
                        />
                      </div>
                    ))}

                    <div className="p-2 border-l">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLine(entry.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-[2fr,2fr,2fr,repeat(7,1fr),auto] border-t items-center bg-muted/50">
                <div className="col-span-3 text-right font-medium p-2">Totales</div>
                {calculateTotals().map((total, index) => (
                  <div key={index} className="text-center font-medium p-2 border-l">
                    {total}
                  </div>
                ))}
                <div className="p-2 border-l"></div>
              </div>
            </div>

            <div className="flex justify-between p-4 border-t">
              <Button onClick={addNewLine}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir línea
              </Button>
              <Button onClick={() => {
                setReports(reports.map(r => r.id === selectedReport.id ? selectedReport : r));
                toast.success('Parte guardado correctamente');
              }}>
                Guardar Parte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}