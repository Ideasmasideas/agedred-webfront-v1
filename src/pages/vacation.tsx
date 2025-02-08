import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, startOfWeek, endOfWeek, addDays, startOfDay, endOfDay, addHours, setHours, setMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const summaryBoxes = [
  { title: "Total Annual Days", value: 20 },
  { title: "Previous Year Days", value: 5 },
  { title: "Additional Days", value: 10 },
  { title: "Days Taken", value: 5 },
  { title: "Available Days", value: 30 },
];

const permissionTypes = {
  maternity: 'Maternidad',
  sickLeave: 'Baja enfermedad',
  overtime: 'Exceso de jornada',
  personalDay: 'Libre disposición',
} as const;

interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'time-tracking' | 'permission' | 'vacation';
}

interface DaySelection {
  date: Date;
  type: 'permission' | 'vacation';
  permissionType?: keyof typeof permissionTypes;
}

export function VacationPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [daySelections, setDaySelections] = useState<DaySelection[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<{
    date: Date;
    startTime: string;
    endTime: string;
  } | null>(null);
  const [showTimeSlotDialog, setShowTimeSlotDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<'permission' | 'vacation'>('vacation');
  const [showPermissionTypeDialog, setShowPermissionTypeDialog] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);
  const [selectedPermissionType, setSelectedPermissionType] = useState<keyof typeof permissionTypes>('personalDay');

  const handleTimeSlotSelect = (date: Date, hour: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    if (!selectedTimeRange) {
      setSelectedTimeRange({
        date,
        startTime: timeString,
        endTime: '',
      });
    } else if (selectedTimeRange.date.getTime() === date.getTime()) {
      if (!selectedTimeRange.endTime) {
        if (hour > parseInt(selectedTimeRange.startTime)) {
          setSelectedTimeRange({
            ...selectedTimeRange,
            endTime: timeString,
          });
          setShowTimeSlotDialog(true);
        } else {
          setSelectedTimeRange(null);
        }
      }
    } else {
      setSelectedTimeRange({
        date,
        startTime: timeString,
        endTime: '',
      });
    }
  };

  const handleTimeSlotSave = () => {
    if (selectedTimeRange && selectedTimeRange.endTime) {
      const newTimeSlot: TimeSlot = {
        id: Date.now().toString(),
        date: selectedTimeRange.date,
        startTime: selectedTimeRange.startTime,
        endTime: selectedTimeRange.endTime,
        type: 'time-tracking',
      };
      setTimeSlots([...timeSlots, newTimeSlot]);
      setSelectedTimeRange(null);
      setShowTimeSlotDialog(false);
      toast.success('Time slot saved successfully');
    }
  };

  const handleDaySelect = (date: Date) => {
    const isSelected = daySelections.some(selection => isSameDay(selection.date, date));
    if (isSelected) {
      setDaySelections(daySelections.filter(selection => !isSameDay(selection.date, date)));
    } else if (selectedType === 'permission') {
      setTempSelectedDate(date);
      setShowPermissionTypeDialog(true);
    } else {
      const newSelection: DaySelection = {
        date,
        type: selectedType,
      };
      setDaySelections([...daySelections, newSelection]);
      toast.success('Vacation request saved');
    }
  };

  const handlePermissionTypeSelect = () => {
    if (tempSelectedDate) {
      const newSelection: DaySelection = {
        date: tempSelectedDate,
        type: 'permission',
        permissionType: selectedPermissionType,
      };
      setDaySelections([...daySelections, newSelection]);
      setShowPermissionTypeDialog(false);
      setTempSelectedDate(null);
      toast.success(`${permissionTypes[selectedPermissionType]} request saved`);
    }
  };

  const getDaySelectionStyle = (selection: DaySelection) => {
    if (selection.type === 'vacation') {
      return 'bg-green-100 hover:bg-green-200 text-green-700';
    }
    return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700';
  };

  const renderMonthView = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="grid grid-cols-7 gap-px bg-border">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground bg-background"
          >
            {day}
          </div>
        ))}
        {days.map((day, dayIdx) => {
          const selection = daySelections.find(s => isSameDay(s.date, day));
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <Button
              key={day.toString()}
              variant="ghost"
              className={cn(
                "h-12 w-full rounded-none relative bg-background",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                selection && getDaySelectionStyle(selection),
                isToday && "border border-primary"
              )}
              onClick={() => handleDaySelect(day)}
            >
              <time dateTime={format(day, 'yyyy-MM-dd')}>
                {format(day, 'd')}
              </time>
              {selection?.permissionType && (
                <div className="absolute bottom-0 left-0 right-0 text-[10px] truncate px-1">
                  {permissionTypes[selection.permissionType]}
                </div>
              )}
            </Button>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const start = startOfWeek(currentDate, { locale: es });
    const end = endOfWeek(currentDate, { locale: es });
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => {
          const selection = daySelections.find(s => isSameDay(s.date, day));
          const isToday = isSameDay(day, new Date());

          return (
            <div key={day.toString()} className="space-y-1">
              <div className="text-center text-sm font-medium text-muted-foreground">
                {format(day, 'EEE', { locale: es })}
              </div>
              <Button
                variant="ghost"
                className={cn(
                  "h-24 w-full rounded-lg flex flex-col items-center justify-start p-2 relative",
                  selection && getDaySelectionStyle(selection),
                  isToday && "border border-primary"
                )}
                onClick={() => handleDaySelect(day)}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')} className="text-lg font-semibold">
                  {format(day, 'd')}
                </time>
                <div className="text-xs text-muted-foreground">
                  {format(day, 'MMM', { locale: es })}
                </div>
                {selection?.permissionType && (
                  <div className="absolute bottom-1 text-xs text-center px-1">
                    {permissionTypes[selection.permissionType]}
                  </div>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => addHours(startOfDay(currentDate), i));
    const dayTimeSlots = timeSlots.filter(slot => 
      isSameDay(slot.date, currentDate)
    );
    const daySelection = daySelections.find(selection => isSameDay(selection.date, currentDate));

    return (
      <div className="space-y-2">
        <div className="text-center text-lg font-semibold mb-4">
          {format(currentDate, 'EEEE, d MMMM', { locale: es })}
          {daySelection?.permissionType && (
            <div className="text-sm font-normal text-muted-foreground">
              {permissionTypes[daySelection.permissionType]}
            </div>
          )}
        </div>
        <div className={cn(
          "grid grid-cols-1 gap-1 rounded-lg p-4",
          daySelection && getDaySelectionStyle(daySelection)
        )}>
          {hours.map((hour) => {
            const hourSlots = dayTimeSlots.filter(slot => {
              const slotStart = parseInt(slot.startTime.split(':')[0]);
              const slotEnd = parseInt(slot.endTime.split(':')[0]);
              const currentHour = hour.getHours();
              return currentHour >= slotStart && currentHour <= slotEnd;
            });

            const isSelectionStart = selectedTimeRange?.startTime === format(hour, 'HH:00');
            const isInSelection = selectedTimeRange && !selectedTimeRange.endTime && 
              hour.getHours() > parseInt(selectedTimeRange.startTime) &&
              isSameDay(selectedTimeRange.date, currentDate);

            return (
              <div
                key={hour.toString()}
                className={cn(
                  "flex items-center p-2 hover:bg-muted/50 rounded-lg cursor-pointer",
                  isSelectionStart && "bg-blue-100",
                  isInSelection && "bg-blue-50"
                )}
                onClick={() => handleTimeSlotSelect(currentDate, hour.getHours())}
              >
                <div className="w-20 text-sm text-muted-foreground">
                  {format(hour, 'HH:mm')}
                </div>
                <div className="flex-1 min-h-[3rem] border-l pl-4 flex gap-2 flex-wrap">
                  {hourSlots.map(slot => (
                    <div
                      key={slot.id}
                      className="px-2 py-1 rounded text-sm border bg-blue-100 border-blue-300 text-blue-700"
                    >
                      {slot.startTime} - {slot.endTime}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month':
        direction === 'prev' 
          ? newDate.setMonth(currentDate.getMonth() - 1)
          : newDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'week':
        direction === 'prev'
          ? newDate.setDate(currentDate.getDate() - 7)
          : newDate.setDate(currentDate.getDate() + 7);
        break;
      case 'day':
        direction === 'prev'
          ? newDate.setDate(currentDate.getDate() - 1)
          : newDate.setDate(currentDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const renderCalendarView = () => {
    switch (view) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      default:
        return renderMonthView();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Vacation Management</h2>
        <Button onClick={() => window.location.href = '/leave-request'}>
          Request Leave
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {summaryBoxes.map((box, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {box.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{box.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            {view !== 'day' && (
              <Select value={selectedType} onValueChange={(value: 'permission' | 'vacation') => setSelectedType(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="permission">Permission</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Select value={view} onValueChange={(value: 'month' | 'week' | 'day') => setView(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleNavigate('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleNavigate('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-3">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold">
                {format(currentDate, view === 'month' ? 'MMMM yyyy' : 'MMMM yyyy', { locale: es })}
              </h2>
            </div>
            {renderCalendarView()}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showTimeSlotDialog} onOpenChange={setShowTimeSlotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Time Range</Label>
              <p className="text-sm">
                {selectedTimeRange?.startTime} - {selectedTimeRange?.endTime}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimeSlotDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleTimeSlotSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPermissionTypeDialog} onOpenChange={setShowPermissionTypeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Permission Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={selectedPermissionType} onValueChange={(value: keyof typeof permissionTypes) => setSelectedPermissionType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select permission type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(permissionTypes).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPermissionTypeDialog(false);
              setTempSelectedDate(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handlePermissionTypeSelect}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}