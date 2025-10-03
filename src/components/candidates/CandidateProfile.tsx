import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Candidate, TimelineEvent } from "@/types";
import { formatDistanceToNow, format } from "date-fns";
import { ArrowLeft, Mail, Phone, Calendar, MessageCircle, FileText } from "lucide-react";

interface CandidateProfileProps {
  candidate: Candidate;
  onBack: () => void;
}

const stageColors = {
  applied: "bg-blue-100 text-blue-800 border-blue-200",
  screening: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  interview: "bg-orange-100 text-orange-800 border-orange-200",
  assessment: "bg-purple-100 text-purple-800 border-purple-200",
  offer: "bg-green-100 text-green-800 border-green-200",
  hired: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-red-100 text-red-800 border-red-200"
};

const timelineIcons = {
  stage_change: Calendar,
  note_added: MessageCircle,
  assessment_completed: FileText,
  interview_scheduled: Calendar
};

export const CandidateProfile = ({ candidate, onBack }: CandidateProfileProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Candidate Profile</h1>
          <p className="text-muted-foreground">Detailed view and timeline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                    {getInitials(candidate.name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{candidate.name}</h2>
                <Badge 
                  variant="outline" 
                  className={`mt-2 ${stageColors[candidate.stage]}`}
                >
                  {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{candidate.email}</span>
                </div>
                
                {candidate.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Applied {format(candidate.createdAt, 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>

              {candidate.resume && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Resume</h3>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Resume
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.timeline.length > 0 ? (
                <div className="space-y-4">
                  {candidate.timeline
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((event, index) => {
                      const Icon = timelineIcons[event.type];
                      return (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            {index < candidate.timeline.length - 1 && (
                              <div className="w-px h-8 bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-sm">{event.description}</p>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(event.createdAt, { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">by {event.author}</p>
                            {event.metadata && (
                              <div className="mt-2 p-2 bg-muted rounded text-xs">
                                <pre>{JSON.stringify(event.metadata, null, 2)}</pre>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No timeline events yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Notes ({candidate.notes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.notes.length > 0 ? (
                <div className="space-y-4">
                  {candidate.notes
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((note) => (
                      <div key={note.id} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{note.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(note.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                        {note.mentions.length > 0 && (
                          <div className="mt-2 flex gap-1">
                            {note.mentions.map((mention, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                @{mention}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No notes added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};