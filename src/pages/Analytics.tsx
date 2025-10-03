import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart3, Users, Briefcase, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { db } from "@/lib/database";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    activeCandidates: 0,
  });

  const [hiringData, setHiringData] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      // Load basic stats
      const [jobs, candidates] = await Promise.all([
        db.jobs.toArray(),
        db.candidates.toArray(),
      ]);

      setStats({
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.status === 'active').length,
        totalCandidates: candidates.length,
        activeCandidates: candidates.filter(c => c.stage !== 'rejected').length,
      });

      // Prepare hiring funnel data
      const stages = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];
      const stageStats = stages.map(stage => ({
        stage: stage.charAt(0).toUpperCase() + stage.slice(1),
        count: candidates.filter(c => c.stage === stage).length,
        fill: stage === 'hired' ? 'hsl(var(--primary))' : 
              stage === 'rejected' ? 'hsl(var(--destructive))' :
              stage === 'offer' ? 'hsl(var(--chart-2))' :
              stage === 'interview' ? 'hsl(var(--chart-3))' :
              stage === 'screening' ? 'hsl(var(--chart-4))' : 'hsl(var(--chart-5))'
      }));
      setStageData(stageStats);

      // Prepare department hiring data
      const deptStats = jobs.reduce((acc, job) => {
        acc[job.department] = (acc[job.department] || 0) + 
          candidates.filter(c => c.jobId === job.id).length;
        return acc;
      }, {});

      const hiringStats = Object.entries(deptStats).map(([dept, count]) => ({
        department: dept,
        candidates: count,
        fill: 'hsl(var(--primary))'
      }));
      setHiringData(hiringStats);

      // Prepare trend data (mock data for last 7 days)
      const trendStats = Array.from({ length: 7 }, (_, i) => ({
        day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        applications: Math.floor(Math.random() * 20) + 5,
        interviews: Math.floor(Math.random() * 10) + 2,
      }));
      setTrendData(trendStats);
    };

    loadAnalytics();
  }, []);

  const chartConfig = {
    candidates: {
      label: "Candidates",
      color: "hsl(var(--primary))",
    },
    applications: {
      label: "Applications",
      color: "hsl(var(--primary))",
    },
    interviews: {
      label: "Interviews", 
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track hiring metrics and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeJobs} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCandidates} in pipeline
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time to Hire</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 days</div>
            <p className="text-xs text-muted-foreground">
              -2 days from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hiring by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringData}>
                  <XAxis dataKey="department" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="candidates" fill="var(--color-candidates)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Candidate Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stageData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ stage, count }) => `${stage}: ${count}`}
                  >
                    {stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Trends (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="var(--color-applications)" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="interviews" 
                  stroke="var(--color-interviews)" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;