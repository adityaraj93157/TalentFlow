export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'active' | 'archived' | 'draft';
  description: string;
  requirements: string[];
  tags: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobId: string;
  stage: CandidateStage;
  resume?: string;
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
  timeline: TimelineEvent[];
}

export type CandidateStage = 
  | 'applied' 
  | 'screening' 
  | 'interview' 
  | 'assessment' 
  | 'offer' 
  | 'hired' 
  | 'rejected';

export interface Note {
  id: string;
  content: string;
  author: string;
  mentions: string[];
  createdAt: Date;
}

export interface TimelineEvent {
  id: string;
  type: 'stage_change' | 'note_added' | 'assessment_completed' | 'interview_scheduled';
  description: string;
  author: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description: string;
  sections: AssessmentSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  order: number;
}

export type QuestionType = 
  | 'single_choice' 
  | 'multiple_choice' 
  | 'short_text' 
  | 'long_text' 
  | 'numeric' 
  | 'file_upload';

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  order: number;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
  };
  conditionalLogic?: {
    dependsOn: string;
    condition: 'equals' | 'not_equals' | 'contains';
    value: string;
  };
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  responses: QuestionResponse[];
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionResponse {
  questionId: string;
  value: string | string[] | number | File;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}