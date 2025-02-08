import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Layout } from '@/components/layout';
import { LoginPage } from '@/pages/login';
import { DashboardPage } from '@/pages/dashboard';
import { EmployeesPage } from '@/pages/employees';
import { EmployeeProfilePage } from '@/pages/employee-profile';
import { ReportsPage } from '@/pages/reports';
import { EvaluationsPage } from '@/pages/evaluations';
import { EvaluationListPage } from '@/pages/evaluation-list';
import { TimeClockPage } from '@/pages/time-clock';
import { FilesPage } from '@/pages/files';
import { VacationPage } from '@/pages/vacation';
import { LeaveRequestPage } from '@/pages/leave-request';
import { TrainingPage } from '@/pages/training';
import { WeeklyReportPage } from '@/pages/weekly-report';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="employees/:id" element={<EmployeeProfilePage />} />
          <Route path="time-clock" element={<TimeClockPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/weekly" element={<WeeklyReportPage />} />
          <Route path="evaluations" element={<EvaluationListPage />} />
          <Route path="evaluations/new" element={<EvaluationsPage />} />
          <Route path="vacation" element={<VacationPage />} />
          <Route path="leave-request" element={<LeaveRequestPage />} />
          <Route path="training" element={<TrainingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}