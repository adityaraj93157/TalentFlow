import { User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsPopover } from "./NotificationsPopover";

export const Header = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b bg-card shadow-sm">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">TALENTFLOW</h1>
              <p className="text-xs text-muted-foreground">
                {userRole === 'candidate' ? 'Candidate Portal' : 'Hiring Platform'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationsPopover />
          
          <Button variant="ghost" size="sm" onClick={() => navigate(userRole === 'candidate' ? '/candidate-portal/settings' : '/settings')}>
            <Settings className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 pl-4 border-l">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm text-left">
                  <p className="font-medium">{user?.email?.split('@')[0] || 'User'}</p>
                  <p className="text-muted-foreground text-xs capitalize">{userRole}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(userRole === 'recruiter' ? '/profile' : '/candidate-profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};