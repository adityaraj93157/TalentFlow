import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import Assessments from "./pages/Assessments";
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";
import RecruiterProfile from "./pages/RecruiterProfile";
import CandidateProfile from "./pages/CandidateProfile";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import CandidateAssessments from "./pages/candidate/CandidateAssessments";
import CandidateAnalytics from "./pages/candidate/CandidateAnalytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import "./lib/resetDatabase"; // Import to make resetDatabase available globally

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/" element={
            <ProtectedRoute allowedRole="recruiter">
              <Layout><Jobs /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/candidates" element={
            <ProtectedRoute allowedRole="recruiter">
              <Layout><Candidates /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/candidates/:id" element={
            <ProtectedRoute allowedRole="recruiter">
              <Layout><Candidates /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/assessments" element={
            <ProtectedRoute allowedRole="recruiter">
              <Layout><Assessments /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <ProtectedRoute allowedRole="recruiter">
              <Layout><Analytics /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute allowedRole="recruiter">
              <Layout><RecruiterProfile /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute allowedRole="recruiter">
              <Layout><Settings /></Layout>
            </ProtectedRoute>
          } />
          
          <Route
            path="/candidate-portal"
            element={
              <ProtectedRoute allowedRole="candidate">
                <Layout>
                  <CandidateJobs />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate-portal/assessments"
            element={
              <ProtectedRoute allowedRole="candidate">
                <Layout>
                  <CandidateAssessments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate-portal/analytics"
            element={
              <ProtectedRoute allowedRole="candidate">
                <Layout>
                  <CandidateAnalytics />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route path="/candidate-profile" element={
            <ProtectedRoute allowedRole="candidate">
              <Layout><CandidateProfile /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/candidate-portal/settings" element={
            <ProtectedRoute allowedRole="candidate">
              <Layout><Settings /></Layout>
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
