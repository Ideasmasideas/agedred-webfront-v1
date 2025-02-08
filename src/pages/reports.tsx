import { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
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
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar as CalendarIcon } from 'lucide-react';

const reports = [
  {
    id: '1',
    startDate: '2024-03-01',
    endDate: '2024-03-07',
    status: 'Completed',
  },
  {
    id: '2',
    startDate: '2024-03-08',
    endDate: '2024-03-14',
    status: 'In Progress',
  },
  {
    id: '3',
    startDate: '2024-03-15',
    endDate: '2024-03-21',
    status: 'Pending',
  },
];

export function ReportsPage() {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const weekStart = startOfWeek(date, { locale: es });
      const weekEnd = endOfWeek(date, { locale: es });
      setSelectedDate(date);
      setShowCalendar(false);
      navigate('/reports/weekly', { 
        state: { 
          startDate: weekStart,
          endDate: weekEnd
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Partes semanales</h2>
        <Button onClick={() => setShowCalendar(true)}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Abrir nueva semana
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semana</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => {
              const startDate = new Date(report.startDate);
              const endDate = new Date(report.endDate);
              
              return (
                <TableRow 
                  key={report.id}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => navigate('/reports/weekly', { 
                    state: { 
                      reportId: report.id,
                      startDate,
                      endDate,
                      status: report.status
                    }
                  })}
                >
                  <TableCell className="font-medium">
                    Semana del {format(startDate, 'dd/MM/yyyy')} al {format(endDate, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/reports/weekly', { 
                          state: { 
                            reportId: report.id,
                            startDate,
                            endDate,
                            status: report.status
                          }
                        });
                      }}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seleccionar semana</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={es}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}