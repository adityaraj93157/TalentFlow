import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Question, QuestionType } from "@/types";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, useDraggable } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { SortableItem } from "./SortableItem";

interface QuestionBuilderProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const questionTypeLabels: Record<QuestionType, string> = {
  single_choice: "Single Choice",
  multiple_choice: "Multiple Choice", 
  short_text: "Short Text",
  long_text: "Long Text",
  numeric: "Numeric",
  file_upload: "File Upload"
};

export const QuestionBuilder = ({ question, onUpdate, onDelete }: QuestionBuilderProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const updateQuestion = (updates: Partial<Question>) => {
    onUpdate({ ...question, ...updates });
  };

  const addOption = () => {
    const options = question.options || [];
    updateQuestion({ options: [...options, `Option ${options.length + 1}`] });
  };

  const updateOption = (index: number, value: string) => {
    const options = [...(question.options || [])];
    options[index] = value;
    updateQuestion({ options });
  };

  const removeOption = (index: number) => {
    const options = [...(question.options || [])];
    options.splice(index, 1);
    updateQuestion({ options });
  };

  const needsOptions = question.type === 'single_choice' || question.type === 'multiple_choice';
  const needsValidation = question.type === 'short_text' || question.type === 'long_text' || question.type === 'numeric';

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className="border-l-4 border-l-primary"
      {...attributes}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="cursor-move p-1 hover:bg-muted rounded" {...listeners}>
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <Badge variant="outline">{questionTypeLabels[question.type]}</Badge>
            {question.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
          </div>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`question-title-${question.id}`}>Question Title *</Label>
            <Input
              id={`question-title-${question.id}`}
              value={question.title}
              onChange={(e) => updateQuestion({ title: e.target.value })}
              placeholder="Enter your question..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor={`question-type-${question.id}`}>Question Type</Label>
            <Select value={question.type} onValueChange={(value: QuestionType) => updateQuestion({ type: value, options: needsOptions ? ['Option 1', 'Option 2'] : undefined })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                {Object.entries(questionTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor={`question-desc-${question.id}`}>Description (Optional)</Label>
          <Textarea
            id={`question-desc-${question.id}`}
            value={question.description || ''}
            onChange={(e) => updateQuestion({ description: e.target.value })}
            placeholder="Add additional context or instructions..."
            className="mt-1"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`required-${question.id}`}
            checked={question.required}
            onCheckedChange={(required) => updateQuestion({ required })}
          />
          <Label htmlFor={`required-${question.id}`}>Required field</Label>
        </div>

        {needsOptions && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Answer Options</Label>
              <Button size="sm" variant="outline" onClick={addOption}>
                <Plus className="h-3 w-3 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {(question.options || []).map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => removeOption(index)}
                    disabled={(question.options?.length || 0) <= 2}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {needsValidation && (
          <div>
            <Label>Validation Rules</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {question.type === 'numeric' ? (
                <>
                  <div>
                    <Label htmlFor={`min-value-${question.id}`} className="text-sm">Min Value</Label>
                    <Input
                      id={`min-value-${question.id}`}
                      type="number"
                      value={question.validation?.minValue || ''}
                      onChange={(e) => updateQuestion({ 
                        validation: { 
                          ...question.validation, 
                          minValue: e.target.value ? Number(e.target.value) : undefined 
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`max-value-${question.id}`} className="text-sm">Max Value</Label>
                    <Input
                      id={`max-value-${question.id}`}
                      type="number"
                      value={question.validation?.maxValue || ''}
                      onChange={(e) => updateQuestion({ 
                        validation: { 
                          ...question.validation, 
                          maxValue: e.target.value ? Number(e.target.value) : undefined 
                        }
                      })}
                      placeholder="100"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor={`min-length-${question.id}`} className="text-sm">Min Length</Label>
                    <Input
                      id={`min-length-${question.id}`}
                      type="number"
                      value={question.validation?.minLength || ''}
                      onChange={(e) => updateQuestion({ 
                        validation: { 
                          ...question.validation, 
                          minLength: e.target.value ? Number(e.target.value) : undefined 
                        }
                      })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`max-length-${question.id}`} className="text-sm">Max Length</Label>
                    <Input
                      id={`max-length-${question.id}`}
                      type="number"
                      value={question.validation?.maxLength || ''}
                      onChange={(e) => updateQuestion({ 
                        validation: { 
                          ...question.validation, 
                          maxLength: e.target.value ? Number(e.target.value) : undefined 
                        }
                      })}
                      placeholder={question.type === 'short_text' ? '100' : '1000'}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};