import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import MarketingHome from "./pages/MarketingHome";
import AuthPage from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import StudiosDirectory from "./pages/StudiosDirectory";
import StudioPublic from "./pages/StudioPublic";
import NotFound from "./pages/NotFound";
import Manifesto from "./pages/Manifesto";

import AppLayout from "./pages/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Praxis from "./pages/app/Praxis";
import Scribe from "./pages/app/Scribe";
import Architect from "./pages/app/Architect";
import Egos from "./pages/app/Egos";
import Archive from "./pages/app/Archive";
import DNA from "./pages/app/DNA";
import Distribution from "./pages/app/Distribution";
import Settings from "./pages/app/Settings";
import StudiosInApp from "./pages/app/StudiosInApp";

export default function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster theme="dark" position="top-right" />
        <Routes>
          <Route path="/" element={<MarketingHome />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={
            <ProtectedRoute requireStudio={false}><Onboarding /></ProtectedRoute>
          } />
          <Route path="/studios" element={<StudiosDirectory />} />
          <Route path="/studios/:slug" element={<StudioPublic />} />

          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="agents/nexus" element={<Dashboard />} />
            <Route path="agents/praxis" element={<Praxis />} />
            <Route path="agents/scribe" element={<Scribe />} />
            <Route path="agents/architect" element={<Architect />} />
            <Route path="agents/egos" element={<Egos />} />
            <Route path="archive" element={<Archive />} />
            <Route path="dna" element={<DNA />} />
            <Route path="distribution" element={<Distribution />} />
            <Route path="studios" element={<StudiosInApp />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  );
}
