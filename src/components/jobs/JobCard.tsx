import { Job } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MoreHorizontal, MapPin, Building, Clock, DollarSign } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onArchive: (job: Job) => void;
  onUnarchive: (job: Job) => void;
  isDragging?: boolean;
}

export const JobCard = ({ job, onEdit, onArchive, onUnarchive, isDragging }: JobCardProps) => {
  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'archived':
        return 'bg-muted text-muted-foreground';
      case 'draft':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: Job['type']) => {
    switch (type) {
      case 'full-time':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'part-time':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'contract':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'internship':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatSalary = (salary: Job['salary']) => {
    if (!salary) return null;
    return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`;
  };

  return (
    <Card className={cn(
      "group cursor-pointer transition-all duration-200 hover:shadow-md",
      isDragging && "shadow-lg rotate-2 opacity-80"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <Badge className={cn("text-xs", getStatusColor(job.status))}>
                {job.status}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground space-x-4">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {job.department}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(job)}>
                Edit Job
              </DropdownMenuItem>
              {job.status === 'archived' ? (
                <DropdownMenuItem onClick={() => onUnarchive(job)}>
                  Unarchive
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onArchive(job)}>
                  Archive
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className={getTypeColor(job.type)}>
            {job.type.replace('-', ' ')}
          </Badge>
          {job.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
          {job.salary && (
            <div className="flex items-center font-medium text-foreground">
              <DollarSign className="h-4 w-4 mr-1" />
              {formatSalary(job.salary)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};