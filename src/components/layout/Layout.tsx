import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { CandidateNavigation } from "./CandidateNavigation";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { userRole } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        {userRole === 'candidate' ? <CandidateNavigation /> : <Navigation />}
        <main className="flex-1 overflow-auto">
          <div className="p-6 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};