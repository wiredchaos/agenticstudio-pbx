import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useStudio } from "@/hooks/useStudio";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children, requireStudio = true }: { children: ReactNode; requireStudio?: boolean }) {
  const { user, loading } = useAuth();
  const { data: studio, isLoading: sLoading } = useStudio();
  const location = useLocation();

  if (loading || (user && requireStudio && sLoading)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/60 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />;
  if (requireStudio && !studio) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}
