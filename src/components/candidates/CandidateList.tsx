import { useMemo, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CandidateCard } from "./CandidateCard";
import { Candidate, CandidateStage } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Users } from "lucide-react";
import { db } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { useCandidateData } from "@/hooks/useCandidateData";

interface CandidateListProps {
  onCandidateClick: (candidate: Candidate) => void;
}

export const CandidateList = ({ onCandidateClick }: CandidateListProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<CandidateStage | "all">("all");
  const { toast } = useToast();
  const { isSeeded, loading: seedingLoading } = useCandidateData();

  useEffect(() => {
    if (isSeeded) {
      loadCandidates();
    }
  }, [isSeeded]);

  const loadCandidates = async () => {
    try {
      console.log("Loading candidates from database...");
      
      // Ensure database is open before querying
      if (!db.isOpen()) {
        console.log("Database not open, opening now...");
        await db.open();
      }
      
      const allCandidates = await db.candidates.orderBy('createdAt').reverse().toArray();
      console.log(`Loaded ${allCandidates.length} candidates from database`);
      setCandidates(allCandidates);
    } catch (error) {
      console.error("Error loading candidates:", error);
      toast({
        title: "Error",
        description: `Failed to load candidates: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = searchQuery === "" || 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStage = stageFilter === "all" || candidate.stage === stageFilter;
      
      return matchesSearch && matchesStage;
    });
  }, [candidates, searchQuery, stageFilter]);

  const parentRef = useMemo(() => {
    const ref: React.RefObject<HTMLDivElement> = { current: null };
    return ref;
  }, []);

  const virtualizer = useVirtualizer({
    count: filteredCandidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  const stageOptions: { value: CandidateStage | "all"; label: string }[] = [
    { value: "all", label: "All Stages" },
    { value: "applied", label: "Applied" },
    { value: "screening", label: "Screening" },
    { value: "interview", label: "Interview" },
    { value: "assessment", label: "Assessment" },
    { value: "offer", label: "Offer" },
    { value: "hired", label: "Hired" },
    { value: "rejected", label: "Rejected" }
  ];

  if (loading || seedingLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading candidates...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Candidates ({filteredCandidates.length})
        </CardTitle>
        
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={stageFilter} onValueChange={(value) => setStageFilter(value as CandidateStage | "all")}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stageOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No candidates found</h3>
            <p className="text-muted-foreground">
              {searchQuery || stageFilter !== "all" 
                ? "Try adjusting your search or filters"
                : "No candidates have been added yet"
              }
            </p>
          </div>
        ) : (
          <div
            ref={parentRef}
            className="h-[600px] overflow-auto"
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const candidate = filteredCandidates[virtualItem.index];
                return (
                  <div
                    key={virtualItem.key}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    className="px-1 py-2"
                  >
                    <CandidateCard
                      candidate={candidate}
                      onClick={() => onCandidateClick(candidate)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};