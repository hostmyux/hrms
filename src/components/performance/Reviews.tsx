
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Clock, Edit, FileText, Plus, AlertCircle } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { toast } from '../../utils/toastHelpers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useForm } from 'react-hook-form';

type ReviewStatus = 'Not Started' | 'In Progress' | 'Self Review' | 'Manager Review' | 'Completed';
type ReviewType = 'Annual Review' | 'Quarterly Check-in' | 'Probationary Review' | 'Project Review';

interface Review {
  id: number;
  employee: string;
  position: string;
  reviewType: ReviewType;
  dueDate: string;
  manager: string;
  status: ReviewStatus;
  createdDate?: string;
  description?: string;
}

interface ReviewFormData {
  employee: string;
  position: string;
  reviewType: ReviewType;
  dueDate: string;
  manager: string;
  description: string;
}

export const Reviews: React.FC = () => {
  const { speak } = useVoice();
  // Using toast from sonner import
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  
  const [reviews, setReviews] = useState<Review[]>([
    { 
      id: 1, 
      employee: "John Smith", 
      position: "Senior Developer", 
      reviewType: "Annual Review", 
      dueDate: "May 15, 2025", 
      manager: "Sarah Johnson",
      status: "In Progress",
      createdDate: "April 15, 2025",
      description: "Annual performance review covering all aspects of job performance, goal achievement, and career development plans."
    },
    { 
      id: 2, 
      employee: "Emily Brown", 
      position: "UI/UX Designer", 
      reviewType: "Annual Review", 
      dueDate: "May 10, 2025", 
      manager: "David Lee",
      status: "Not Started",
      createdDate: "April 10, 2025",
      description: "Annual performance evaluation focusing on design portfolio, collaboration, and creative contributions."
    },
    { 
      id: 3, 
      employee: "Michael Wilson", 
      position: "Product Manager", 
      reviewType: "Quarterly Check-in", 
      dueDate: "May 5, 2025", 
      manager: "Sarah Johnson",
      status: "Manager Review",
      createdDate: "April 5, 2025",
      description: "Quarterly assessment of project deliverables, team leadership, and strategic planning capabilities."
    },
    { 
      id: 4, 
      employee: "Jessica Miller", 
      position: "Marketing Specialist", 
      reviewType: "Annual Review", 
      dueDate: "April 30, 2025", 
      manager: "Robert Chen",
      status: "Completed",
      createdDate: "March 30, 2025",
      description: "Annual evaluation of marketing campaign performance, creative contributions, and professional growth."
    },
    { 
      id: 5, 
      employee: "Daniel Davis", 
      position: "Customer Support", 
      reviewType: "Probationary Review", 
      dueDate: "April 28, 2025", 
      manager: "Maria Garcia",
      status: "Completed",
      createdDate: "March 28, 2025",
      description: "End of probation review assessing customer handling skills, product knowledge, and team integration."
    }
  ]);
  
  // Form for creating/editing reviews
  const form = useForm<ReviewFormData>({
    defaultValues: {
      employee: '',
      position: '',
      reviewType: 'Annual Review',
      dueDate: '',
      manager: '',
      description: ''
    }
  });

  const handleCreateReview = () => {
    setIsCreateDialogOpen(true);
    form.reset({
      employee: '',
      position: '',
      reviewType: 'Annual Review',
      dueDate: '',
      manager: '',
      description: ''
    });
    speak("Creating a new performance review. You can select review type, assign participants, set evaluation criteria, and establish deadlines for each stage of the review process.");
  };
  
  const handleStartReview = (review: Review) => {
    setSelectedReview(review);
    setIsStartDialogOpen(true);
    speak(`Initiating performance review for ${review.employee}. This will notify the employee and their manager to begin the self-evaluation and assessment process.`);
  };
  
  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setIsEditDialogOpen(true);
    form.reset({
      employee: review.employee,
      position: review.position,
      reviewType: review.reviewType,
      dueDate: review.dueDate,
      manager: review.manager,
      description: review.description || ''
    });
    speak(`Editing review settings for ${review.employee}. You can adjust deadlines, change reviewers, or modify evaluation criteria as needed.`);
  };
  
  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
    speak(`Viewing performance review details for ${review.employee}. This shows all assessment responses, ratings, and feedback from the review cycle.`);
  };

  const onSubmitCreate = (data: ReviewFormData) => {
    const newReview: Review = {
      id: Date.now(),
      employee: data.employee,
      position: data.position,
      reviewType: data.reviewType,
      dueDate: data.dueDate,
      manager: data.manager,
      status: 'Not Started',
      createdDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      description: data.description
    };
    
    setReviews(prev => [newReview, ...prev]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Review Created",
      description: `Performance review for ${data.employee} has been created.`
    });
    speak(`Review successfully created. A new performance review for ${data.employee} has been scheduled with a due date of ${data.dueDate}.`);
  };

  const onSubmitEdit = (data: ReviewFormData) => {
    if (!selectedReview) return;
    
    setReviews(prev => prev.map(review => {
      if (review.id === selectedReview.id) {
        return {
          ...review,
          employee: data.employee,
          position: data.position,
          reviewType: data.reviewType,
          dueDate: data.dueDate,
          manager: data.manager,
          description: data.description
        };
      }
      return review;
    }));
    
    setIsEditDialogOpen(false);
    toast({
      title: "Review Updated",
      description: `Performance review for ${data.employee} has been updated.`
    });
    speak(`Review successfully updated. The performance review for ${data.employee} has been modified with the new information.`);
  };

  const handleStartConfirm = () => {
    if (!selectedReview) return;
    
    setReviews(prev => prev.map(review => {
      if (review.id === selectedReview.id) {
        return {
          ...review,
          status: review.status === 'Not Started' ? 'In Progress' : (review.status === 'In Progress' ? 'Self Review' : 'Manager Review')
        };
      }
      return review;
    }));
    
    setIsStartDialogOpen(false);
    toast({
      title: "Review Initiated",
      description: `Performance review for ${selectedReview.employee} has been started.`
    });
    speak(`Review successfully initiated. Notifications have been sent to both ${selectedReview.employee} and ${selectedReview.manager} to begin the review process.`);
  };

  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case "Not Started": return "bg-gray-100 text-gray-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Self Review": return "bg-purple-100 text-purple-800";
      case "Manager Review": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-green-100 text-green-800";
    }
  };

  const getNextStepText = (status: ReviewStatus) => {
    switch (status) {
      case "Not Started": return "Start Review";
      case "In Progress": return "Request Self-Review";
      case "Self Review": return "Request Manager Review";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Performance Reviews</h3>
          <p className="text-muted-foreground text-sm">
            Create and manage employee performance reviews
          </p>
        </div>
        <Button onClick={handleCreateReview}>
          <Plus className="mr-2 h-4 w-4" />
          Create Review
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Active Review Cycles</CardTitle>
          <CardDescription>
            Track and manage ongoing performance reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Current performance review cycles.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.employee}</TableCell>
                  <TableCell>{review.position}</TableCell>
                  <TableCell>{review.reviewType}</TableCell>
                  <TableCell>{review.dueDate}</TableCell>
                  <TableCell>{review.manager}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {(review.status === 'Not Started' || review.status === 'In Progress' || review.status === 'Self Review') && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStartReview(review)}
                          title={getNextStepText(review.status)}
                        >
                          <Clock size={16} />
                        </Button>
                      )}
                      {review.status !== "Completed" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditReview(review)}
                          title="Edit Review"
                        >
                          <Edit size={16} />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewReview(review)}
                        title="View Details"
                      >
                        <FileText size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Review Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create Performance Review</DialogTitle>
            <DialogDescription>
              Set up a new performance review cycle for an employee.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitCreate)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employee"
                  rules={{ required: "Employee name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="position"
                  rules={{ required: "Position is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee position" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="reviewType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select review type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Annual Review">Annual Review</SelectItem>
                          <SelectItem value="Quarterly Check-in">Quarterly Check-in</SelectItem>
                          <SelectItem value="Probationary Review">Probationary Review</SelectItem>
                          <SelectItem value="Project Review">Project Review</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  rules={{ required: "Due date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., May 15, 2025" {...field} />
                      </FormControl>
                      <FormDescription>
                        Date review must be completed by
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="manager"
                rules={{ required: "Manager name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reviewing manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter description of review focus areas"
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description of what this review will focus on
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Review</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Review Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Performance Review</DialogTitle>
            <DialogDescription>
              Update the details of this performance review.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employee"
                  rules={{ required: "Employee name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="position"
                  rules={{ required: "Position is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter employee position" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="reviewType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select review type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Annual Review">Annual Review</SelectItem>
                          <SelectItem value="Quarterly Check-in">Quarterly Check-in</SelectItem>
                          <SelectItem value="Probationary Review">Probationary Review</SelectItem>
                          <SelectItem value="Project Review">Project Review</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  rules={{ required: "Due date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., May 15, 2025" {...field} />
                      </FormControl>
                      <FormDescription>
                        Date review must be completed by
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="manager"
                rules={{ required: "Manager name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reviewing manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter description of review focus areas"
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description of what this review will focus on
                    </FormDescription>
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

      {/* View Review Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Complete information about this performance review.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Employee</h4>
                  <p>{selectedReview.employee}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Position</h4>
                  <p>{selectedReview.position}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Review Type</h4>
                  <p>{selectedReview.reviewType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Status</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReview.status)}`}>
                    {selectedReview.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold">Due Date</h4>
                  <p>{selectedReview.dueDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Created</h4>
                  <p>{selectedReview.createdDate}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold">Manager</h4>
                <p>{selectedReview.manager}</p>
              </div>
              
              {selectedReview.description && (
                <div>
                  <h4 className="text-sm font-semibold">Description</h4>
                  <p className="text-sm">{selectedReview.description}</p>
                </div>
              )}

              {selectedReview.status === 'Completed' && (
                <div className="border-t pt-4 mt-6">
                  <h3 className="text-md font-semibold mb-2">Review Summary</h3>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-semibold">Overall Rating</h4>
                      <div className="flex items-center">
                        {Array(5).fill(0).map((_, i) => (
                          <CheckCircle key={i} size={16} className={`mr-1 ${i < 4 ? 'text-primary' : 'text-muted'}`} />
                        ))}
                        <span className="ml-2 text-sm">4/5 - Exceeds Expectations</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold">Manager Comments</h4>
                      <p className="text-sm">
                        {selectedReview.employee} has consistently delivered high-quality work and has become a valuable team member.
                        Particularly strong in problem-solving and communication. Areas for improvement include documentation and knowledge sharing.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Start Review Dialog */}
      <AlertDialog open={isStartDialogOpen} onOpenChange={setIsStartDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedReview && getNextStepText(selectedReview.status)}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedReview && selectedReview.status === 'Not Started' && (
                <>Initiate the review process for {selectedReview.employee}. This will send notifications to begin the review.</>
              )}
              {selectedReview && selectedReview.status === 'In Progress' && (
                <>Request self-evaluation from {selectedReview.employee}. They will receive a notification to complete their self-assessment.</>
              )}
              {selectedReview && selectedReview.status === 'Self Review' && (
                <>Request manager evaluation from {selectedReview.manager}. They will receive a notification to provide their assessment.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStartConfirm}>
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
