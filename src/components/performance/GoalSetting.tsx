
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Plus, Target, Trash, AlertCircle } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type GoalType = 'Organization' | 'Department' | 'Team' | 'Individual';
type GoalStatus = 'Not Started' | 'On Track' | 'At Risk' | 'Delayed' | 'Completed';

interface Goal {
  id: number;
  title: string;
  description?: string;
  type: GoalType;
  owner: string;
  dueDate: string;
  progress: number;
  status: GoalStatus;
  metrics?: string;
}

interface GoalFormData {
  title: string;
  description: string;
  type: GoalType;
  owner: string;
  dueDate: string;
  metrics: string;
  progress: number;
  status: GoalStatus;
}

export const GoalSetting: React.FC = () => {
  const { speak } = useVoice();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  
  // Initial data
  const [goals, setGoals] = useState<Goal[]>([
    { 
      id: 1, 
      title: "Improve Customer Satisfaction Score", 
      description: "Increase NPS score from 45 to 60 by implementing customer feedback system and improving response times.",
      type: "Organization", 
      owner: "Customer Service", 
      dueDate: "Dec 31, 2025", 
      progress: 65, 
      status: "On Track",
      metrics: "NPS Score >= 60"
    },
    { 
      id: 2, 
      title: "Reduce Employee Turnover", 
      description: "Decrease annual turnover rate from 15% to 10% through improved onboarding and regular feedback sessions.",
      type: "Department", 
      owner: "HR Department", 
      dueDate: "Dec 31, 2025", 
      progress: 40, 
      status: "At Risk",
      metrics: "Turnover Rate <= 10%"
    },
    { 
      id: 3, 
      title: "Launch New Product Line", 
      description: "Successfully introduce the XYZ product line with at least 5 SKUs and $2M in projected annual revenue.",
      type: "Team", 
      owner: "Product Team", 
      dueDate: "Sep 30, 2025", 
      progress: 80, 
      status: "On Track",
      metrics: "5+ SKUs, $2M+ revenue projection"
    },
    { 
      id: 4, 
      title: "Implement New CRM System", 
      description: "Configure and deploy new CRM system with 100% data migration and full team training completion.",
      type: "Individual", 
      owner: "John Smith", 
      dueDate: "Aug 15, 2025", 
      progress: 25, 
      status: "Delayed",
      metrics: "Full deployment with 100% data accuracy"
    },
    { 
      id: 5, 
      title: "Complete Leadership Training", 
      description: "Complete all 6 modules of leadership training program and apply techniques in at least 3 team scenarios.",
      type: "Individual", 
      owner: "Jane Doe", 
      dueDate: "Jul 1, 2025", 
      progress: 90, 
      status: "On Track",
      metrics: "All modules completed, 3+ applied scenarios"
    }
  ]);
  
  // Form for creating/editing goals
  const form = useForm<GoalFormData>({
    defaultValues: {
      title: '',
      description: '',
      type: 'Individual',
      owner: '',
      dueDate: '',
      metrics: '',
      progress: 0,
      status: 'Not Started'
    }
  });

  const handleCreateGoal = () => {
    setIsCreateDialogOpen(true);
    form.reset({
      title: '',
      description: '',
      type: 'Individual',
      owner: '',
      dueDate: '',
      metrics: '',
      progress: 0,
      status: 'Not Started'
    });
    speak("Creating a new goal. Follow the SMART framework to ensure goals are specific, measurable, achievable, relevant, and time-bound. This structure helps track progress effectively.");
  };
  
  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
    form.reset({
      title: goal.title,
      description: goal.description || '',
      type: goal.type,
      owner: goal.owner,
      dueDate: goal.dueDate,
      metrics: goal.metrics || '',
      progress: goal.progress,
      status: goal.status
    });
    speak(`Editing goal: ${goal.title}. You can update targets, timelines, progress or assigned resources to ensure alignment with organizational objectives.`);
  };
  
  const handleDeleteGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDeleteDialogOpen(true);
    speak(`Preparing to delete goal: ${goal.title}. This action will remove the goal and its associated progress tracking data. This action cannot be undone.`);
  };

  const onSubmitCreate = (data: GoalFormData) => {
    const newGoal: Goal = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      type: data.type,
      owner: data.owner,
      dueDate: data.dueDate,
      progress: data.progress,
      status: data.status,
      metrics: data.metrics
    };
    
    setGoals(prev => [newGoal, ...prev]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Goal Created",
      description: `${data.title} has been successfully created.`
    });
    speak(`Goal successfully created. The new goal "${data.title}" has been added to your tracking system and assigned to ${data.owner}.`);
  };

  const onSubmitEdit = (data: GoalFormData) => {
    if (!selectedGoal) return;
    
    setGoals(prev => prev.map(goal => {
      if (goal.id === selectedGoal.id) {
        return {
          ...goal,
          title: data.title,
          description: data.description,
          type: data.type,
          owner: data.owner,
          dueDate: data.dueDate,
          progress: data.progress,
          status: data.status,
          metrics: data.metrics
        };
      }
      return goal;
    }));
    
    setIsEditDialogOpen(false);
    toast({
      title: "Goal Updated",
      description: `${data.title} has been successfully updated.`
    });
    speak(`Goal successfully updated. The changes to "${data.title}" have been saved. Goal is now set to ${data.progress}% complete with a status of ${data.status}.`);
  };

  const handleConfirmDelete = () => {
    if (!selectedGoal) return;
    
    setGoals(prev => prev.filter(goal => goal.id !== selectedGoal.id));
    setIsDeleteDialogOpen(false);
    toast({
      title: "Goal Deleted",
      description: `${selectedGoal.title} has been removed.`
    });
    speak(`Goal successfully deleted. ${selectedGoal.title} has been removed from your tracking system.`);
  };

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case "Not Started": return "bg-gray-100 text-gray-800";
      case "On Track": return "bg-green-100 text-green-800";
      case "At Risk": return "bg-yellow-100 text-yellow-800";
      case "Delayed": return "bg-red-100 text-red-800";
      case "Completed": return "bg-blue-100 text-blue-800";
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
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteGoal(goal)}
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

      {/* Create Goal Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              Add a new goal following the SMART criteria: Specific, Measurable, Achievable, Relevant, Time-bound.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitCreate)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Goal title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter goal title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Organization">Organization</SelectItem>
                          <SelectItem value="Department">Department</SelectItem>
                          <SelectItem value="Team">Team</SelectItem>
                          <SelectItem value="Individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="owner"
                  rules={{ required: "Owner is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter goal owner" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the goal in detail" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dueDate"
                  rules={{ required: "Due date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="e.g., Dec 31, 2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="On Track">On Track</SelectItem>
                          <SelectItem value="At Risk">At Risk</SelectItem>
                          <SelectItem value="Delayed">Delayed</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="metrics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Success Metrics</FormLabel>
                    <FormControl>
                      <Input placeholder="Define measurable success criteria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progress ({field.value}%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        onChange={field.onChange}
                        value={field.value} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Goal</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Goal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>
              Update goal details and progress tracking.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Goal title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter goal title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Organization">Organization</SelectItem>
                          <SelectItem value="Department">Department</SelectItem>
                          <SelectItem value="Team">Team</SelectItem>
                          <SelectItem value="Individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="owner"
                  rules={{ required: "Owner is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter goal owner" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the goal in detail" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dueDate"
                  rules={{ required: "Due date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="e.g., Dec 31, 2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="On Track">On Track</SelectItem>
                          <SelectItem value="At Risk">At Risk</SelectItem>
                          <SelectItem value="Delayed">Delayed</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="metrics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Success Metrics</FormLabel>
                    <FormControl>
                      <Input placeholder="Define measurable success criteria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progress ({field.value}%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        onChange={field.onChange}
                        value={field.value} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Goal Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the goal "{selectedGoal?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
