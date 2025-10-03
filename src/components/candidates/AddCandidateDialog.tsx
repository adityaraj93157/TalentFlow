import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Candidate } from "@/types";

interface AddCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCandidate: (candidate: Omit<Candidate, 'id'>) => void;
  jobs: Array<{ id: string; title: string; department: string }>;
}

export const AddCandidateDialog = ({ open, onOpenChange, onAddCandidate, jobs }: AddCandidateDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    currentRole: "",
    resume: "",
    skills: [] as string[],
    appliedJobs: [] as string[],
    stage: "applied" as const,
    notes: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stages = ["applied", "screening", "interview", "offer", "hired", "rejected"];
  const experienceLevels = ["0-1 years", "2-4 years", "5-7 years", "8-10 years", "10+ years"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newCandidate = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      jobId: formData.appliedJobs[0] || "",
      stage: formData.stage,
      resume: formData.resume,
      notes: formData.notes ? [
        {
          id: crypto.randomUUID(),
          content: formData.notes,
          author: "Current User",
          mentions: [],
          createdAt: new Date(),
        }
      ] : [],
      timeline: [
        {
          id: crypto.randomUUID(),
          type: 'stage_change' as const,
          description: "Candidate added to system",
          author: "Current User",
          createdAt: new Date(),
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAddCandidate(newCandidate);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      experience: "",
      currentRole: "",
      resume: "",
      skills: [],
      appliedJobs: [],
      stage: "applied",
      notes: "",
    });
    setSkillInput("");
    setErrors({});
    onOpenChange(false);
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const toggleJobApplication = (jobId: string) => {
    setFormData(prev => ({
      ...prev,
      appliedJobs: prev.appliedJobs.includes(jobId)
        ? prev.appliedJobs.filter(id => id !== jobId)
        : [...prev.appliedJobs, jobId]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. John Doe"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="e.g. john@example.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="e.g. +1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. New York, NY"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stage">Current Stage</Label>
              <Select value={formData.stage} onValueChange={(value: any) => setFormData(prev => ({ ...prev, stage: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="currentRole">Current Role</Label>
            <Input
              id="currentRole"
              value={formData.currentRole}
              onChange={(e) => setFormData(prev => ({ ...prev, currentRole: e.target.value }))}
              placeholder="e.g. Senior Software Engineer at Tech Corp"
            />
          </div>

          <div>
            <Label htmlFor="resume">Resume URL</Label>
            <Input
              id="resume"
              value={formData.resume}
              onChange={(e) => setFormData(prev => ({ ...prev, resume: e.target.value }))}
              placeholder="e.g. https://drive.google.com/..."
            />
          </div>

          <div>
            <Label htmlFor="skills">Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add skills (press Enter)"
              />
              <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
            </div>
          </div>

          <div>
            <Label>Applied Jobs</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
              {jobs.map(job => (
                <div key={job.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`job-${job.id}`}
                    checked={formData.appliedJobs.includes(job.id)}
                    onChange={() => toggleJobApplication(job.id)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`job-${job.id}`} className="text-sm cursor-pointer">
                    {job.title} - {job.department}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes about the candidate..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Candidate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};