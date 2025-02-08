import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const employees = {
  '1': {
    name: 'Sarah Wilson',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    yearsOfService: 5,
  },
  '2': {
    name: 'Michael Chen',
    role: 'Product Manager',
    department: 'Product',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    yearsOfService: 3,
  },
  '3': {
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    department: 'Design',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    yearsOfService: 2,
  },
};

const performanceData = [
  { month: 'Jan', performance: 85, attendance: 98 },
  { month: 'Feb', performance: 88, attendance: 95 },
  { month: 'Mar', performance: 92, attendance: 97 },
  { month: 'Apr', performance: 90, attendance: 99 },
  { month: 'May', performance: 85, attendance: 96 },
  { month: 'Jun', performance: 89, attendance: 98 },
];

const quarterlyGoals = [
  { name: 'Project Completion', value: 85, target: 100 },
  { name: 'Code Quality', value: 92, target: 95 },
  { name: 'Team Collaboration', value: 88, target: 90 },
  { name: 'Documentation', value: 78, target: 85 },
  { name: 'Innovation', value: 95, target: 90 },
];

const skillsData = [
  { subject: 'Technical Skills', A: 90, fullMark: 100 },
  { subject: 'Communication', A: 85, fullMark: 100 },
  { subject: 'Leadership', A: 78, fullMark: 100 },
  { subject: 'Problem Solving', A: 92, fullMark: 100 },
  { subject: 'Teamwork', A: 88, fullMark: 100 },
];

const projectCompletion = [
  { name: 'Completed', value: 75 },
  { name: 'In Progress', value: 15 },
  { name: 'Planned', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function EmployeeProfilePage() {
  const { id } = useParams();
  const employee = employees[id as keyof typeof employees];

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex items-center gap-6 py-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={employee.image} />
            <AvatarFallback>{employee.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{employee.name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{employee.role}</span>
              <span>•</span>
              <span>{employee.department}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge>Full-time</Badge>
              <Badge variant="outline">{employee.yearsOfService} years</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="goals" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Goals Progress</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={quarterlyGoals} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="target"
                      stroke="hsl(var(--muted-foreground))"
                      fill="hsl(var(--muted-foreground))"
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectCompletion}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectCompletion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Objectives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {quarterlyGoals.map((goal) => (
                  <div key={goal.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{goal.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {goal.value}%
                      </span>
                    </div>
                    <Progress value={goal.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="feedback">
          <Card>
            <CardContent className="py-6">
              <p>Feedback content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}