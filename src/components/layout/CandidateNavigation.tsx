import { NavLink, useLocation } from "react-router-dom";
import { Briefcase, FileText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Jobs", href: "/candidate-portal", icon: Briefcase },
  { name: "Assessments", href: "/candidate-portal/assessments", icon: FileText },
  { name: "Analytics", href: "/candidate-portal/analytics", icon: BarChart3 },
];

export const CandidateNavigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-card border-r border-border w-64 h-full">
      <div className="p-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
