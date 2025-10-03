import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CandidateList } from "@/components/candidates/CandidateList";
import { CandidateProfile } from "@/components/candidates/CandidateProfile";
import { AddCandidateDialog } from "@/components/candidates/AddCandidateDialog";
import { useCandidateData } from "@/hooks/useCandidateData";
import { Candidate, Job } from "@/types";
import { db } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

const Candidates = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const { loading } = useCandidateData();
  const { toast } = useToast();

  useEffect(() => {
    const loadJobs = async () => {
      const jobsList = await db.jobs.toArray();
      setJobs(jobsList);
    };
    loadJobs();
  }, []);

  const handleAddCandidate = async (candidateData: Omit<Candidate, 'id'>) => {
    try {
      const newCandidate = {
        ...candidateData,
        id: crypto.randomUUID(),
      };

      await db.candidates.add(newCandidate);
      
      toast({
        title: "Success",
        description: "Candidate added successfully",
      });
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast({
        title: "Error",
        description: "Failed to add candidate",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading candidates...</span>
      </div>
    );
  }

  if (selectedCandidate) {
    return (
      <CandidateProfile 
        candidate={selectedCandidate}
        onBack={() => setSelectedCandidate(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground">Manage candidate applications and pipeline</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      <CandidateList onCandidateClick={setSelectedCandidate} />

      <AddCandidateDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddCandidate={handleAddCandidate}
        jobs={jobs}
      />
    </div>
  );
};

export default Candidates;