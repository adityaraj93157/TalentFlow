import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionBuilder } from "./QuestionBuilder";
import { AssessmentPreview } from "./AssessmentPreview";
import { Assessment, Question, QuestionType, Job } from "@/types";
import { Plus, Eye, Settings } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from "./SortableItem";
import { db } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

interface AssessmentBuilderProps {
  onSave?: (assessment: Assessment) => void;
  initialAssessment?: Assessment;
}

export const AssessmentBuilder = ({ onSave, initialAssessment }: AssessmentBuilderProps) => {
  const [title, setTitle] = useState(initialAssessment?.title || '');
  const [description, setDescription] = useState(initialAssessment?.description || '');
  const [selectedJobId, setSelectedJobId] = useState(initialAssessment?.jobId || '');
  const [questions, setQuestions] = useState<Question[]>(
    initialAssessment?.sections[0]?.questions || []
  );
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState('builder');
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const allJobs = await db.jobs.where('status').equals('active').toArray();
      setJobs(allJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const generateQuestionId = () => `q_${Math.random().toString(36).substr(2, 9)}`;

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: generateQuestionId(),
      type,
      title: '',
      required: false,
      order: questions.length + 1,
      options: type === 'single_choice' || type === 'multiple_choice' ? ['Option 1', 'Option 2'] : undefined
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Assessment title is required",
        variant: "destructive"
      });
      return;
    }

    if (!selectedJobId) {
      toast({
        title: "Validation Error", 
        description: "Please select a job for this assessment",
        variant: "destructive"
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one question is required",
        variant: "destructive"
      });
      return;
    }

    const assessment: Assessment = {
      id: initialAssessment?.id || `assessment_${Math.random().toString(36).substr(2, 9)}`,
      jobId: selectedJobId,
      title: title.trim(),
      description: description.trim(),
      sections: [{
        id: `section_${Math.random().toString(36).substr(2, 9)}`,
        title: 'Questions',
        questions: questions.map((q, index) => ({ ...q, order: index + 1 })),
        order: 1
      }],
      createdAt: initialAssessment?.createdAt || new Date(),
      updatedAt: new Date()
    };

    try {
      await db.assessments.put(assessment);
      toast({
        title: "Success",
        description: "Assessment saved successfully"
      });
      
      if (onSave) {
        onSave(assessment);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment",
        variant: "destructive"
      });
    }
  };

  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'short_text', label: 'Short Text' },
    { value: 'long_text', label: 'Long Text' },
    { value: 'single_choice', label: 'Single Choice' },
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'numeric', label: 'Numeric' },
    { value: 'file_upload', label: 'File Upload' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Assessment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assessment-title">Assessment Title *</Label>
              <Input
                id="assessment-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Frontend Developer Assessment"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="job-select">Associated Job *</Label>
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a job..." />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  {jobs.map(job => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} - {job.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="assessment-description">Description</Label>
            <Textarea
              id="assessment-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this assessment evaluates..."
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Questions ({questions.length})</CardTitle>
                <Select onValueChange={(type: QuestionType) => addQuestion(type)}>
                  <SelectTrigger className="w-48">
                    <Plus className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Add Question" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border shadow-lg z-50">
                    {questionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <Plus className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No questions yet</h3>
                  <p className="text-muted-foreground">Add your first question to get started</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <QuestionBuilder
                          key={question.id}
                          question={question}
                          onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                          onDelete={() => deleteQuestion(index)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <AssessmentPreview
            title={title}
            description={description}
            questions={questions}
            responses={responses}
            onResponseChange={(questionId, value) => {
              setResponses(prev => ({ ...prev, [questionId]: value }));
            }}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setActiveTab('preview')}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button onClick={handleSave}>
          Save Assessment
        </Button>
      </div>
    </div>
  );
};