import { useState, useEffect } from "react";
import { db } from "@/lib/database";
import { generateCandidates, generateJobs, generateAssessments } from "@/lib/seedData";
import { Candidate, Job, Assessment } from "@/types";

// Singleton to ensure initialization only happens once
let initializationPromise: Promise<void> | null = null;

export const useCandidateData = () => {
  const [isSeeded, setIsSeeded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    // If initialization is already in progress, wait for it
    if (initializationPromise) {
      await initializationPromise;
      setIsSeeded(true);
      setLoading(false);
      return;
    }

    // Start new initialization
    initializationPromise = (async () => {
      try {
        console.log("Starting database initialization...");
        
        // Ensure database is open
        if (!db.isOpen()) {
          console.log("Opening database...");
          await db.open();
        }
        
        // Wait a bit to ensure database is fully initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if we already have candidates
        const existingCandidates = await db.candidates.count();
        console.log(`Found ${existingCandidates} existing candidates`);
        
        if (existingCandidates === 0) {
          console.log("No existing data found, generating new data...");
          
          // Generate jobs first, then candidates and assessments
          const jobs = generateJobs();
          console.log(`Generated ${jobs.length} jobs`);
          await db.jobs.bulkAdd(jobs);
          console.log("Jobs added to database");
          
          const candidates = generateCandidates(jobs);
          console.log(`Generated ${candidates.length} candidates`);
          await db.candidates.bulkAdd(candidates);
          console.log("Candidates added to database");
          
          const assessments = generateAssessments(jobs);
          console.log(`Generated ${assessments.length} assessments`);
          await db.assessments.bulkAdd(assessments);
          console.log("Assessments added to database");
          
          console.log(`✅ Successfully seeded ${candidates.length} candidates, ${jobs.length} jobs, and ${assessments.length} assessments`);
        } else {
          console.log(`✅ Database already has ${existingCandidates} candidates, skipping seeding`);
        }
        
        return true;
      } catch (error) {
        console.error("❌ Error initializing candidate data:", error);
        throw error;
      }
    })();

    try {
      await initializationPromise;
      setIsSeeded(true);
    } catch (error) {
      console.error("❌ Error in initialization promise:", error);
      // Still set seeded to true to avoid infinite loading
      setIsSeeded(true);
    } finally {
      setLoading(false);
    }
  };

  return { isSeeded, loading };
};