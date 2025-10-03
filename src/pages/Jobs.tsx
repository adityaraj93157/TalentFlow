import { useState, useEffect } from "react";
import { Job } from "@/types";
import { JobsBoard } from "@/components/jobs/JobsBoard";
import { CreateJobDialog } from "@/components/jobs/CreateJobDialog";
import { EditJobDialog } from "@/components/jobs/EditJobDialog";
import { generateJobs } from "@/lib/seedData";
import { db } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        // Check if we have jobs in the database
        const existingJobs = await db.jobs.toArray();
        
        if (existingJobs.length === 0) {
          // Seed initial data
          const seedJobs = generateJobs();
          await db.jobs.bulkAdd(seedJobs);
          setJobs(seedJobs);
        } else {
          setJobs(existingJobs.sort((a, b) => a.order - b.order));
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load jobs. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [toast]);

  const handleCreateJob = async (jobData: Omit<Job, 'id'>) => {
    try {
      const newJob = {
        ...jobData,
        id: crypto.randomUUID(),
        slug: jobData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        order: jobs.length,
      };

      await db.jobs.add(newJob);
      setJobs(prev => [newJob, ...prev]);
      
      toast({
        title: "Success",
        description: "Job created successfully",
      });
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: "Error",
        description: "Failed to create job",
        variant: "destructive",
      });
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowEditDialog(true);
  };

  const handleUpdateJob = async (updatedJob: Job) => {
    try {
      await db.jobs.put(updatedJob);
      setJobs(jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
      
      toast({
        title: "Success",
        description: "Job updated successfully",
      });
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: "Error",
        description: "Failed to update job",
        variant: "destructive",
      });
    }
  };

  const handleArchiveJob = async (job: Job) => {
    try {
      const updatedJob = { ...job, status: 'archived' as const, updatedAt: new Date() };
      await db.jobs.put(updatedJob);
      setJobs(jobs.map(j => j.id === job.id ? updatedJob : j));
      
      toast({
        title: "Job Archived",
        description: `"${job.title}" has been archived successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnarchiveJob = async (job: Job) => {
    try {
      const updatedJob = { ...job, status: 'active' as const, updatedAt: new Date() };
      await db.jobs.put(updatedJob);
      setJobs(jobs.map(j => j.id === job.id ? updatedJob : j));
      
      toast({
        title: "Job Unarchived",
        description: `"${job.title}" has been reactivated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unarchive job. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <JobsBoard
        jobs={jobs}
        onCreateJob={() => setShowCreateDialog(true)}
        onEditJob={handleEditJob}
        onArchiveJob={handleArchiveJob}
        onUnarchiveJob={handleUnarchiveJob}
      />

      <CreateJobDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateJob={handleCreateJob}
      />

      <EditJobDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        job={editingJob}
        onUpdateJob={handleUpdateJob}
      />
    </>
  );
};

export default Jobs;