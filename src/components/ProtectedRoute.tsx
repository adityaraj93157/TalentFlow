import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'recruiter' | 'candidate';
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (allowedRole && userRole && userRole !== allowedRole) {
        // Redirect to appropriate portal based on role
        navigate(userRole === 'recruiter' ? '/' : '/candidate-portal');
      }
    }
  }, [user, userRole, loading, allowedRole, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRole && userRole !== allowedRole) {
    return null;
  }

  return <>{children}</>;
};
