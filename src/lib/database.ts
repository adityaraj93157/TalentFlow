import Dexie, { Table } from 'dexie';
import { Job, Candidate, Assessment, AssessmentResponse } from '@/types';

export class TalentFlowDB extends Dexie {
  jobs!: Table<Job>;
  candidates!: Table<Candidate>;
  assessments!: Table<Assessment>;
  assessmentResponses!: Table<AssessmentResponse>;

  constructor() {
    super('TalentFlowDB_v2');
    this.version(1).stores({
      jobs: '++id, title, slug, status, department, createdAt, order',
      candidates: '++id, name, email, jobId, stage, createdAt',
      assessments: '++id, jobId, title, createdAt',
      assessmentResponses: '++id, assessmentId, candidateId, submittedAt'
    });
  }
}

export const db = new TalentFlowDB();

// Clean up old database
const cleanupOldDatabase = async () => {
  try {
    const oldDb = new Dexie('TalentFlowDB');
    await oldDb.delete();
    console.log('Old database cleaned up');
  } catch (error) {
    // Ignore errors if old database doesn't exist
  }
};

// Run cleanup on import
cleanupOldDatabase();