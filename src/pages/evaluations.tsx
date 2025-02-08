import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

const evaluationQuestions = [
  {
    id: 1,
    category: 'Productividad',
    questions: [
      'Completa sus tareas en el tiempo asignado',
      'Mantiene un alto nivel de calidad en su trabajo',
      'Gestiona eficientemente múltiples responsabilidades',
    ],
  },
  {
    id: 2,
    category: 'Habilidades de Comunicación',
    questions: [
      'Se comunica de manera clara y efectiva',
      'Escucha activamente a sus compañeros',
      'Proporciona retroalimentación constructiva',
    ],
  },
  {
    id: 3,
    category: 'Trabajo en Equipo',
    questions: [
      'Colabora efectivamente con sus compañeros',
      'Contribuye positivamente al ambiente del equipo',
      'Apoya a otros miembros del equipo cuando es necesario',
    ],
  },
];

const ratingLabels = {
  1: 'Necesita Mejorar',
  2: 'Cumple Parcialmente',
  3: 'Cumple Expectativas',
  4: 'Supera Expectativas',
  5: 'Excepcional',
};

export function EvaluationsPage() {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [evaluationType, setEvaluationType] = useState('');
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleRatingChange = (questionId: string, value: number[]) => {
    setRatings((prev) => ({
      ...prev,
      [questionId]: value[0],
    }));
  };

  const getRatingLabel = (value: number) => {
    return ratingLabels[value as keyof typeof ratingLabels] || '';
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Nueva Evaluación</h2>
        <Button>Guardar Evaluación</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Empleado</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Marc Anderson</SelectItem>
                  <SelectItem value="2">Sarah Wilson</SelectItem>
                  <SelectItem value="3">Michael Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Evaluación</Label>
              <Select value={evaluationType} onValueChange={setEvaluationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarterly">Evaluación Trimestral</SelectItem>
                  <SelectItem value="annual">Evaluación Anual</SelectItem>
                  <SelectItem value="project">Evaluación de Proyecto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {evaluationQuestions.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle>{section.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {section.questions.map((question, index) => {
              const questionId = `${section.id}-${index}`;
              const currentValue = ratings[questionId] || 3;

              return (
                <div key={questionId} className="space-y-4">
                  <div className="flex justify-between items-start">
                    <Label className="text-base">{question}</Label>
                    <span className="text-sm font-medium text-primary ml-4 min-w-[120px] text-right">
                      {getRatingLabel(currentValue)}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Slider
                      value={[currentValue]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleRatingChange(questionId, value)}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Necesita Mejorar</span>
                      <span className="text-xs text-muted-foreground">Excepcional</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Comentarios Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ingrese comentarios adicionales sobre el desempeño del empleado..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}