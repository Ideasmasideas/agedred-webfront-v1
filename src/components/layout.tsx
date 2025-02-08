import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen w-screen flex flex-col bg-background">
      <Header>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </Header>
      <div className="flex flex-1 w-full">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <main
          className={cn(
            "flex-1 p-6 overflow-x-hidden transition-all duration-300",
            sidebarOpen ? "md:pl-[calc(16rem+1.5rem)]" : "md:pl-[calc(4rem+1.5rem)]"
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}