import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Assessment, Question } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AssessmentTakingProps {
  assessment: Assessment;
  onComplete: (responses: Record<string, any>) => void;
  onCancel: () => void;
}

export const AssessmentTaking = ({ assessment, onComplete, onCancel }: AssessmentTakingProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const allQuestions = assessment.sections.flatMap(s => s.questions);
  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(responses);
  };

  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;
  const canProceed = !currentQuestion.required || responses[currentQuestion.id] !== undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{assessment.title}</h2>
          <p className="text-muted-foreground">{assessment.description}</p>
        </div>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestionIndex + 1} of {allQuestions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <span>{currentQuestion.title}</span>
            {currentQuestion.required && (
              <span className="text-sm font-normal text-destructive">Required</span>
            )}
          </CardTitle>
          {currentQuestion.description && (
            <CardDescription>{currentQuestion.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.type === "single_choice" && (
            <RadioGroup
              value={responses[currentQuestion.id] || ""}
              onValueChange={(value) => handleResponse(currentQuestion.id, value)}
            >
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === "multiple_choice" && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option, index) => {
                const selectedOptions = responses[currentQuestion.id] || [];
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${index}`}
                      checked={selectedOptions.includes(option)}
                      onCheckedChange={(checked) => {
                        const newOptions = checked
                          ? [...selectedOptions, option]
                          : selectedOptions.filter((o: string) => o !== option);
                        handleResponse(currentQuestion.id, newOptions);
                      }}
                    />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer">{option}</Label>
                  </div>
                );
              })}
            </div>
          )}

          {currentQuestion.type === "short_text" && (
            <Input
              value={responses[currentQuestion.id] || ""}
              onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
              placeholder="Enter your answer"
            />
          )}

          {currentQuestion.type === "long_text" && (
            <Textarea
              value={responses[currentQuestion.id] || ""}
              onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
              placeholder="Enter your answer"
              rows={5}
            />
          )}

          {currentQuestion.type === "numeric" && (
            <Input
              type="number"
              value={responses[currentQuestion.id] || ""}
              onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
              placeholder="Enter a number"
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {!isLastQuestion ? (
          <Button onClick={handleNext} disabled={!canProceed}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!canProceed}>
            Submit Assessment
          </Button>
        )}
      </div>
    </div>
  );
};
