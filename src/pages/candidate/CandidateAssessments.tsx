import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle } from "lucide-react";
import { db } from "@/lib/database";
import { Assessment } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { AssessmentTaking } from "@/components/assessments/AssessmentTaking";

export default function CandidateAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedAssessments, setCompletedAssessments] = useState<Set<string>>(new Set());
  const [takingAssessment, setTakingAssessment] = useState<Assessment | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const allAssessments = await db.assessments.toArray();
      setAssessments(allAssessments);
    } catch (error) {
      console.error("Error loading assessments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = (assessment: Assessment) => {
    setTakingAssessment(assessment);
  };

  const handleCompleteAssessment = (responses: Record<string, any>) => {
    if (takingAssessment) {
      setCompletedAssessments(prev => new Set([...prev, takingAssessment.id]));
      setTakingAssessment(null);
      toast({
        title: "Assessment completed!",
        description: "Your responses have been submitted successfully.",
      });
    }
  };

  const handleCancelAssessment = () => {
    setTakingAssessment(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (takingAssessment) {
    return (
      <AssessmentTaking
        assessment={takingAssessment}
        onComplete={handleCompleteAssessment}
        onCancel={handleCancelAssessment}
      />
    );
  }

  const pendingAssessments = assessments.filter(a => !completedAssessments.has(a.id));
  const completed = assessments.filter(a => completedAssessments.has(a.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Assessments</h1>
        <p className="text-muted-foreground">View and complete your assigned assessments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssessments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAssessments.size}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pending Assessments</h2>
        {pendingAssessments.map((assessment) => (
          <Card key={assessment.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{assessment.title}</CardTitle>
                  <CardDescription>{assessment.description}</CardDescription>
                </div>
                <Badge>Pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {assessment.sections.reduce((acc, s) => acc + s.questions.length, 0)} questions
                </div>
                <Button onClick={() => handleStartAssessment(assessment)}>
                  Start Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {pendingAssessments.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                No pending assessments
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {completed.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Completed Assessments</h2>
          {completed.map((assessment) => (
            <Card key={assessment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{assessment.title}</CardTitle>
                    <CardDescription>{assessment.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
