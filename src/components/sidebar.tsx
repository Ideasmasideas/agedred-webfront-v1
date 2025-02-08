import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  FolderOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar,
  GraduationCap,
  ClipboardList,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from '@/contexts/auth-context';

const getNavigationItems = (role: string) => {
  const allItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Trabajadores', href: '/employees', icon: Users },
    { name: 'Fichaje', href: '/time-clock', icon: Clock },
    { name: 'Archivos', href: '/files', icon: FolderOpen },
    { name: 'Evaluaciones', href: '/evaluations', icon: FileCheck },
    { name: 'Partes', href: '/reports', icon: ClipboardList },
    { name: 'Estadísticas', href: '/analytics', icon: BarChart3 },
    { name: 'Vacaciones', href: '/vacation', icon: Calendar },
    { name: 'Formaciones', href: '/training', icon: GraduationCap },
  ];

  if (role === 'trabajador') {
    return allItems.filter(item => 
      ['Fichaje', 'Archivos', 'Evaluaciones', 'Partes', 'Vacaciones', 'Formaciones'].includes(item.name)
    );
  }

  return allItems;
};

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const { user } = useAuth();
  const navigation = getNavigationItems(user?.role || 'trabajador');

  const NavContent = () => (
    <nav className="space-y-1 px-2">
      {navigation.map((item) => (
        <TooltipProvider key={item.name} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                    'hover:bg-accent hover:text-accent-foreground',
                    !open && "justify-center",
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  )
                }
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onOpenChange(false);
                  }
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {open && <span className="truncate">{item.name}</span>}
                </div>
              </NavLink>
            </TooltipTrigger>
            {!open && (
              <TooltipContent side="right">
                {item.name}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-4">
          <div className="flex flex-col h-full">
            <NavContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300 md:block",
          open ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto py-4">
            <NavContent />
          </div>
          <div className="border-t p-4 flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(!open)}
            >
              {open ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}