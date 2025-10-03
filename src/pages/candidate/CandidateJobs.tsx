import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import { db } from "@/lib/database";
import { Job } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function CandidateJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const allJobs = await db.jobs.where('status').equals('active').toArray();
      setJobs(allJobs);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (jobId: string) => {
    setAppliedJobs(prev => new Set([...prev, jobId]));
    toast({
      title: "Application submitted!",
      description: "Your application has been submitted successfully.",
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Available Positions</h1>
        <p className="text-muted-foreground">Browse and apply to open positions</p>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.type}
                    </span>
                  </CardDescription>
                </div>
                <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
              
              {job.salary && typeof job.salary === 'object' && 'min' in job.salary && (
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {job.salary.currency}{job.salary.min.toLocaleString()} - {job.salary.currency}{job.salary.max.toLocaleString()}
                  </span>
                </div>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={() => handleApply(job.id)}
                disabled={appliedJobs.has(job.id)}
                className="w-full sm:w-auto"
              >
                {appliedJobs.has(job.id) ? 'Applied' : 'Apply Now'}
              </Button>
            </CardContent>
          </Card>
        ))}

        {jobs.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">
                No active positions available at the moment
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
