
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Plus, Target, Trash } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { Progress } from '@/components/ui/progress';

export const GoalSetting: React.FC = () => {
  const { speak } = useVoice();
  
  const goals = [
    { 
      id: 1, 
      title: "Improve Customer Satisfaction Score", 
      type: "Organization", 
      owner: "Customer Service", 
      dueDate: "Dec 31, 2025", 
      progress: 65, 
      status: "On Track" 
    },
    { 
      id: 2, 
      title: "Reduce Employee Turnover", 
      type: "Department", 
      owner: "HR Department", 
      dueDate: "Dec 31, 2025", 
      progress: 40, 
      status: "At Risk" 
    },
    { 
      id: 3, 
      title: "Launch New Product Line", 
      type: "Team", 
      owner: "Product Team", 
      dueDate: "Sep 30, 2025", 
      progress: 80, 
      status: "On Track" 
    },
    { 
      id: 4, 
      title: "Implement New CRM System", 
      type: "Individual", 
      owner: "John Smith", 
      dueDate: "Aug 15, 2025", 
      progress: 25, 
      status: "Delayed" 
    },
    { 
      id: 5, 
      title: "Complete Leadership Training", 
      type: "Individual", 
      owner: "Jane Doe", 
      dueDate: "Jul 1, 2025", 
      progress: 90, 
      status: "On Track" 
    }
  ];
  
  const handleCreateGoal = () => {
    speak("Creating a new goal. Follow the SMART framework to ensure goals are specific, measurable, achievable, relevant, and time-bound. This structure helps track progress effectively.");
  };
  
  const handleEditGoal = (title: string) => {
    speak(`Editing goal: ${title}. You can update targets, timelines, or assigned resources to ensure alignment with organizational objectives.`);
  };
  
  const handleDeleteGoal = (title: string) => {
    speak(`Preparing to delete goal: ${title}. This action will remove the goal and its associated progress tracking data.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track": return "bg-green-100 text-green-800";
      case "At Risk": return "bg-yellow-100 text-yellow-800";
      case "Delayed": return "bg-red-100 text-red-800";
      case "Completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Goals & Objectives</h3>
          <p className="text-muted-foreground text-sm">
            Set and track organization, team, and individual goals
          </p>
        </div>
        <Button onClick={handleCreateGoal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Goal
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Active Goals</CardTitle>
          <CardDescription>
            Track progress on all active goals and objectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of current organizational and individual goals.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Goal</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goals.map((goal) => (
                <TableRow key={goal.id}>
                  <TableCell className="font-medium">{goal.title}</TableCell>
                  <TableCell>{goal.type}</TableCell>
                  <TableCell>{goal.owner}</TableCell>
                  <TableCell>{goal.dueDate}</TableCell>
                  <TableCell className="w-[200px]">
                    <div className="flex items-center gap-2">
                      <Progress value={goal.progress} className={getProgressColor(goal.progress)} />
                      <span className="text-xs font-medium">{goal.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                      {goal.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditGoal(goal.title)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteGoal(goal.title)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
