import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import AppointmentsPage from "./pages/AppointmentsPage";
import PatientsPage from "./pages/PatientsPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import PatientDetailPage from "./pages/PatientDetailPage";
import ConsultationPage from "./pages/ConsultationPage";
import DoctorProfilePage from "./pages/DoctorProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ConsultantsPage from "./pages/ConsultantsPage";
import FollowUpPage from "./pages/FollowUpPage";
import FinancePage from "./pages/FinancePage";
const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route
              path="/patients/:patientId"
              element={<PatientDetailPage />}
            />
            <Route
              path="/consultation/:patientId/:appointmentId"
              element={<ConsultationPage />}
            />
            <Route path="/follow-up" element={<FollowUpPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/consultants" element={<ConsultantsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/account" element={<DoctorProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
