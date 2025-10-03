import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Candidate } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Mail, Phone } from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

const stageColors = {
  applied: "bg-blue-100 text-blue-800 border-blue-200",
  screening: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  interview: "bg-orange-100 text-orange-800 border-orange-200",
  assessment: "bg-purple-100 text-purple-800 border-purple-200",
  offer: "bg-green-100 text-green-800 border-green-200",
  hired: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-red-100 text-red-800 border-red-200"
};

export const CandidateCard = ({ candidate, onClick }: CandidateCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer border-border hover:border-primary/20"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(candidate.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground truncate">
                {candidate.name}
              </h3>
              <Badge 
                variant="outline" 
                className={stageColors[candidate.stage]}
              >
                {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span className="truncate">{candidate.email}</span>
              </div>
              
              {candidate.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{candidate.phone}</span>
                </div>
              )}
            </div>
            
            <div className="mt-2 text-xs text-muted-foreground">
              Applied {formatDistanceToNow(candidate.createdAt, { addSuffix: true })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};