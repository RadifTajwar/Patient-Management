import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import AppointmentsPage from "./pages/AppointmentsPage";
import PatientsPage from "./pages/PatientsPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import PatientDetailPage from "./pages/PatientDetailPage";
import ConsultationPage from "./pages/ConsultationPage";
import DoctorProfilePage from "./pages/DoctorProfilePage";
// import CalendarPage from "./pages/CalendarPage";
// import NotesPage from "./pages/NotesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AnalyticsPage from "./pages/AnalyticsPage";
// import FeedbackPage from "./pages/FeedbackPage";
// import SubscriptionPage from "./pages/SubscriptionPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route
              path="/patients/:patientId"
              element={<PatientDetailPage />}
            />
            <Route
              path="/consultation/:appointmentId"
              element={<ConsultationPage />}
            />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/profile" element={<DoctorProfilePage />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
