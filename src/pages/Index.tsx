import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, FileText, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "View Jobs",
      description: "Browse and manage all job postings",
      icon: Briefcase,
      action: () => navigate('/'),
      color: "bg-blue-500"
    },
    {
      title: "Candidates",
      description: "Manage candidate applications",
      icon: Users,
      action: () => navigate('/candidates'),
      color: "bg-green-500"
    },
    {
      title: "Assessments",
      description: "Create and manage assessments",
      icon: FileText,
      action: () => navigate('/assessments'),
      color: "bg-purple-500"
    },
    {
      title: "Analytics",
      description: "View hiring metrics and insights",
      icon: TrendingUp,
      action: () => navigate('/analytics'),
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Welcome to TalentFlow</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Streamline your hiring process with our comprehensive recruitment management platform
        </p>
        <Button size="lg" onClick={() => navigate('/')} className="mt-4">
          <Plus className="h-5 w-5 mr-2" />
          Get Started
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={action.action}>
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription className="text-sm">{action.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto text-primary hover:text-primary">
                  Access Feature <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-500" />
              Job Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Create and manage job postings</li>
              <li>• Set requirements and descriptions</li>
              <li>• Track application status</li>
              <li>• Archive completed positions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Candidate Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Track candidate progress</li>
              <li>• Manage interview schedules</li>
              <li>• Store candidate notes</li>
              <li>• View detailed profiles</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Create custom assessments</li>
              <li>• Multiple question types</li>
              <li>• Track completion rates</li>
              <li>• Generate reports</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
