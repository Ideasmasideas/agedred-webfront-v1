import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AppRouter } from '@/routes';
import { AuthProvider } from '@/contexts/auth-context';

function App() {
  return (
    <div className="w-screen min-h-screen overflow-x-hidden">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <AppRouter />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;