import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
import { FileText, Plus } from 'lucide-react';

const evaluations = [
  {
    id: '1',
    employeeName: 'Sarah Wilson',
    type: 'Evaluación Trimestral',
    date: '2024-03-15',
    status: 'Completada',
  },
  {
    id: '2',
    employeeName: 'Michael Chen',
    type: 'Evaluación Anual',
    date: '2024-03-10',
    status: 'Pendiente',
  },
  {
    id: '3',
    employeeName: 'Emily Rodriguez',
    type: 'Evaluación de Proyecto',
    date: '2024-03-05',
    status: 'En Progreso',
  },
];

export function EvaluationListPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Evaluaciones</h2>
        <Button onClick={() => navigate('/evaluations/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Evaluación
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell className="font-medium">
                    {evaluation.employeeName}
                  </TableCell>
                  <TableCell>{evaluation.type}</TableCell>
                  <TableCell>{evaluation.date}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        evaluation.status === 'Completada' && "bg-green-100 text-green-800",
                        evaluation.status === 'Pendiente' && "bg-yellow-100 text-yellow-800",
                        evaluation.status === 'En Progreso' && "bg-blue-100 text-blue-800"
                      )}
                    >
                      {evaluation.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/evaluations/${evaluation.id}`)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}