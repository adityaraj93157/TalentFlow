import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssessmentBuilder } from "@/components/assessments/AssessmentBuilder";
import { Assessment, Job } from "@/types";
import { FileText, Plus, Edit, Trash2 } from "lucide-react";
import { db } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const Assessments = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allAssessments, allJobs] = await Promise.all([
        db.assessments.orderBy('createdAt').reverse().toArray(),
        db.jobs.toArray()
      ]);
      
      setAssessments(allAssessments);
      setJobs(allJobs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assessments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (assessment: Assessment) => {
    setShowBuilder(false);
    setEditingAssessment(null);
    loadData();
  };

  const handleEdit = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setShowBuilder(true);
  };

  const handleDelete = async (assessmentId: string) => {
    try {
      await db.assessments.delete(assessmentId);
      toast({
        title: "Success",
        description: "Assessment deleted successfully"
      });
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assessment",
        variant: "destructive"
      });
    }
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job ? `${job.title} - ${job.department}` : 'Unknown Job';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading assessments...</span>
      </div>
    );
  }

  if (showBuilder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {editingAssessment ? 'Edit Assessment' : 'Create Assessment'}
            </h1>
            <p className="text-muted-foreground">
              {editingAssessment ? 'Modify your assessment' : 'Build a new job-specific assessment'}
            </p>
          </div>
          <Button variant="outline" onClick={() => {
            setShowBuilder(false);
            setEditingAssessment(null);
          }}>
            Back to Assessments
          </Button>
        </div>

        <AssessmentBuilder 
          onSave={handleSave}
          initialAssessment={editingAssessment || undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
          <p className="text-muted-foreground">Create and manage job-specific assessments</p>
        </div>
        <Button onClick={() => setShowBuilder(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Assessment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assessment Library ({assessments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assessments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No assessments yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first assessment to evaluate candidates
              </p>
              <Button onClick={() => setShowBuilder(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Assessment
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{assessment.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {assessment.sections[0]?.questions?.length || 0} questions
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {getJobTitle(assessment.jobId)}
                        </p>
                        
                        {assessment.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {assessment.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            Created {formatDistanceToNow(assessment.createdAt, { addSuffix: true })}
                          </span>
                          <span>
                            Updated {formatDistanceToNow(assessment.updatedAt, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(assessment)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete(assessment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Assessments;