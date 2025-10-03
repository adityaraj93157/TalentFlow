import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Question, QuestionResponse } from "@/types";
import { Upload, FileText } from "lucide-react";

interface AssessmentPreviewProps {
  title: string;
  description: string;
  questions: Question[];
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
}

export const AssessmentPreview = ({ 
  title, 
  description, 
  questions, 
  responses, 
  onResponseChange 
}: AssessmentPreviewProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateQuestion = (question: Question, value: any): string | null => {
    if (question.required && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required';
    }

    if (question.validation && value) {
      const { minLength, maxLength, minValue, maxValue } = question.validation;
      
      if (question.type === 'numeric') {
        const numValue = Number(value);
        if (minValue !== undefined && numValue < minValue) {
          return `Value must be at least ${minValue}`;
        }
        if (maxValue !== undefined && numValue > maxValue) {
          return `Value must be at most ${maxValue}`;
        }
      } else if (typeof value === 'string') {
        if (minLength !== undefined && value.length < minLength) {
          return `Must be at least ${minLength} characters`;
        }
        if (maxLength !== undefined && value.length > maxLength) {
          return `Must be at most ${maxLength} characters`;
        }
      }
    }

    return null;
  };

  const handleResponseChange = (questionId: string, value: any) => {
    onResponseChange(questionId, value);
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  const handleBlur = (question: Question) => {
    const value = responses[question.id];
    const error = validateQuestion(question, value);
    setErrors(prev => ({ ...prev, [question.id]: error || '' }));
  };

  const getVisibleQuestions = () => {
    return questions.filter(question => {
      if (!question.conditionalLogic) return true;
      
      const dependsOnValue = responses[question.conditionalLogic.dependsOn];
      const conditionValue = question.conditionalLogic.value;
      
      switch (question.conditionalLogic.condition) {
        case 'equals':
          return dependsOnValue === conditionValue;
        case 'not_equals':
          return dependsOnValue !== conditionValue;
        case 'contains':
          return Array.isArray(dependsOnValue) 
            ? dependsOnValue.includes(conditionValue)
            : String(dependsOnValue || '').includes(conditionValue);
        default:
          return true;
      }
    });
  };

  const renderQuestion = (question: Question) => {
    const value = responses[question.id];
    const error = errors[question.id];

    switch (question.type) {
      case 'short_text':
        return (
          <div>
            <Input
              value={value || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              onBlur={() => handleBlur(question)}
              placeholder="Enter your answer..."
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        );

      case 'long_text':
        return (
          <div>
            <Textarea
              value={value || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              onBlur={() => handleBlur(question)}
              placeholder="Enter your detailed answer..."
              rows={4}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        );

      case 'numeric':
        return (
          <div>
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              onBlur={() => handleBlur(question)}
              placeholder="Enter a number..."
              min={question.validation?.minValue}
              max={question.validation?.maxValue}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        );

      case 'single_choice':
        return (
          <div>
            <RadioGroup
              value={value || ''}
              onValueChange={(newValue) => handleResponseChange(question.id, newValue)}
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        );

      case 'multiple_choice':
        return (
          <div>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${index}`}
                    checked={(value || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const currentValues = value || [];
                      const newValues = checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option);
                      handleResponseChange(question.id, newValues);
                    }}
                  />
                  <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        );

      case 'file_upload':
        return (
          <div>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              {value && (
                <p className="text-sm text-primary mt-2">
                  File selected: {value.name || 'document.pdf'}
                </p>
              )}
            </div>
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        );

      default:
        return <p className="text-muted-foreground">Unsupported question type</p>;
    }
  };

  const visibleQuestions = getVisibleQuestions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Assessment Preview'}</CardTitle>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {visibleQuestions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No questions added yet</p>
          </div>
        ) : (
          visibleQuestions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  {index + 1}
                </Badge>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-base font-medium">
                      {question.title}
                    </Label>
                    {question.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </div>
                  
                  {question.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {question.description}
                    </p>
                  )}
                  
                  {renderQuestion(question)}
                </div>
              </div>
            </div>
          ))
        )}
        
        {visibleQuestions.length > 0 && (
          <div className="flex justify-end pt-4 border-t">
            <Button>Submit Assessment</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};