import { db } from './database';
import { generateCandidates, generateJobs, generateAssessments } from './seedData';

export const resetDatabase = async () => {
  try {
    console.log('Clearing existing data...');
    
    // Clear all existing data
    await Promise.all([
      db.candidates.clear(),
      db.jobs.clear(),
      db.assessments.clear(),
      db.assessmentResponses.clear()
    ]);
    
    console.log('Generating new data...');
    
    // Generate new data
    const jobs = generateJobs();
    const candidates = generateCandidates(jobs);
    const assessments = generateAssessments(jobs);
    
    // Add new data to database
    await Promise.all([
      db.jobs.bulkAdd(jobs),
      db.candidates.bulkAdd(candidates),
      db.assessments.bulkAdd(assessments)
    ]);
    
    console.log(`✅ Successfully reset database with:`);
    console.log(`   - ${jobs.length} jobs`);
    console.log(`   - ${candidates.length} candidates`);
    console.log(`   - ${assessments.length} assessments`);
    
    return {
      jobs: jobs.length,
      candidates: candidates.length,
      assessments: assessments.length
    };
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).resetDatabase = resetDatabase;
}
