
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, Edit, Eye, PlusCircle, Trash, Map, Calendar, Clock } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { toast } from 'sonner';

type JobPosting = {
  id: number;
  title: string;
  department: string;
  location: string;
  openings: number;
  applications: number;
  status: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  salary?: string;
  postDate?: string;
  deadline?: string;
};

const jobPostingSchema = z.object({
  title: z.string().min(2, { message: "Job title must be at least 2 characters." }),
  department: z.string().min(2, { message: "Department is required." }),
  location: z.string().min(2, { message: "Location is required." }),
  openings: z.coerce.number().positive({ message: "Number of openings must be positive." }),
  description: z.string().min(10, { message: "Job description must be at least 10 characters." }),
  salary: z.string().optional(),
  deadline: z.string().optional(),
});

export const JobPostings: React.FC = () => {
  const { speak } = useVoice();
  const [isViewingJob, setIsViewingJob] = useState(false);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    { 
      id: 1, 
      title: "Senior React Developer", 
      department: "Engineering", 
      location: "Remote", 
      openings: 2, 
      applications: 24, 
      status: "Active",
      description: "We are seeking a skilled Senior React Developer to join our dynamic engineering team. The ideal candidate will lead front-end development initiatives, mentor junior developers, and contribute to architecture decisions.",
      requirements: [
        "5+ years of experience with React and modern JavaScript",
        "Strong understanding of state management solutions",
        "Experience with TypeScript and testing frameworks",
        "Excellent problem-solving skills",
      ],
      responsibilities: [
        "Design and implement user-facing features",
        "Build reusable components and libraries",
        "Optimize applications for maximum performance",
        "Collaborate with UX/UI designers and back-end developers",
      ],
      salary: "$120,000 - $150,000",
      postDate: "April 15, 2025",
      deadline: "May 15, 2025",
    },
    { 
      id: 2, 
      title: "HR Manager", 
      department: "Human Resources", 
      location: "New York", 
      openings: 1, 
      applications: 18, 
      status: "Active",
      description: "We are looking for an experienced HR Manager to oversee all aspects of human resources functions. The successful candidate will develop HR strategies aligned with our business objectives.",
      requirements: [
        "Bachelor's degree in Human Resources or related field",
        "5+ years of HR management experience",
        "Knowledge of HR systems and databases",
        "Strong interpersonal and communication skills",
      ],
      responsibilities: [
        "Develop and implement HR policies and procedures",
        "Oversee recruitment and onboarding processes",
        "Manage employee relations and performance evaluations",
        "Ensure compliance with employment laws and regulations",
      ],
      salary: "$90,000 - $110,000",
      postDate: "April 10, 2025",
      deadline: "May 10, 2025",
    },
    { 
      id: 3, 
      title: "UX Designer", 
      department: "Design", 
      location: "San Francisco", 
      openings: 3, 
      applications: 37, 
      status: "Active",
      description: "Join our creative design team as a UX Designer to create intuitive and engaging user experiences. You will collaborate with product managers and engineers to define and implement innovative solutions.",
      requirements: [
        "3+ years of UX design experience",
        "Proficiency in design tools (Figma, Sketch, Adobe XD)",
        "Portfolio demonstrating your design process",
        "Understanding of user-centered design principles",
      ],
      responsibilities: [
        "Create wireframes, prototypes, and user flows",
        "Conduct user research and usability testing",
        "Collaborate with developers on implementation",
        "Continuously iterate designs based on feedback",
      ],
      salary: "$95,000 - $125,000",
      postDate: "April 5, 2025",
      deadline: "May 5, 2025",
    },
    { 
      id: 4, 
      title: "Product Manager", 
      department: "Product", 
      location: "Remote", 
      openings: 1, 
      applications: 12, 
      status: "Closed",
      description: "We're seeking a Product Manager to drive product strategy and execution. The ideal candidate will have a blend of business acumen and technical understanding.",
      requirements: [
        "4+ years of product management experience",
        "Track record of successful product launches",
        "Strong analytical and problem-solving skills",
        "Excellent communication and leadership abilities",
      ],
      responsibilities: [
        "Define product vision and strategy",
        "Gather and prioritize product requirements",
        "Work closely with engineering, design, and marketing teams",
        "Analyze market trends and competition",
      ],
      salary: "$100,000 - $130,000",
      postDate: "March 15, 2025",
      deadline: "April 15, 2025",
    },
    { 
      id: 5, 
      title: "Data Analyst", 
      department: "Data Science", 
      location: "Boston", 
      openings: 2, 
      applications: 29, 
      status: "Draft",
      description: "We are looking for a Data Analyst to turn data into insights that drive business growth. The successful candidate will interpret data, analyze results, and provide ongoing reports.",
      requirements: [
        "Bachelor's degree in Statistics, Mathematics, or related field",
        "2+ years of experience with data analysis tools",
        "Proficiency in SQL and data visualization",
        "Strong analytical mindset",
      ],
      responsibilities: [
        "Develop and implement databases and data collection systems",
        "Identify, analyze, and interpret trends from large datasets",
        "Create data dashboards and visualizations",
        "Work with stakeholders to identify information needs",
      ],
      salary: "$80,000 - $100,000",
      postDate: "Not published",
      deadline: "Not set",
    },
  ]);
  
  // Form for creating/editing jobs
  const form = useForm<z.infer<typeof jobPostingSchema>>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      openings: 1,
      description: "",
      salary: "",
      deadline: new Date().toISOString().split('T')[0],
    },
  });

  // Initialize form when editing
  React.useEffect(() => {
    if (selectedJob && isEditingJob) {
      form.reset({
        title: selectedJob.title,
        department: selectedJob.department,
        location: selectedJob.location,
        openings: selectedJob.openings,
        description: selectedJob.description || "",
        salary: selectedJob.salary || "",
        deadline: selectedJob.deadline ? new Date(selectedJob.deadline).toISOString().split('T')[0] : undefined,
      });
    }
  }, [selectedJob, isEditingJob, form]);

  // Form submission handlers
  const onSubmitCreate = (values: z.infer<typeof jobPostingSchema>) => {
    const newJob = {
      id: jobPostings.length + 1,
      title: values.title,
      department: values.department,
      location: values.location,
      openings: values.openings,
      applications: 0,
      status: "Draft",
      description: values.description,
      requirements: [],
      responsibilities: [],
      salary: values.salary,
      postDate: "Not published",
      deadline: values.deadline,
    };
    
    setJobPostings([...jobPostings, newJob]);
    setIsCreatingJob(false);
    form.reset();
    toast.success("Job posting created", {
      description: "New job posting has been created as a draft"
    });
    speak("New job posting created. You can now review and publish it when ready.");
  };

  const onSubmitEdit = (values: z.infer<typeof jobPostingSchema>) => {
    if (!selectedJob) return;
    
    const updatedJobs = jobPostings.map(job => 
      job.id === selectedJob.id 
        ? { 
            ...job, 
            title: values.title,
            department: values.department,
            location: values.location,
            openings: values.openings,
            description: values.description,
            salary: values.salary,
            deadline: values.deadline,
          }
        : job
    );
    
    setJobPostings(updatedJobs);
    setIsEditingJob(false);
    setSelectedJob(null);
    toast.success("Job posting updated", {
      description: "Changes to the job posting have been saved"
    });
    speak("Job posting has been updated successfully.");
  };
  
  const handleCreateJob = () => {
    form.reset();
    setIsCreatingJob(true);
    speak("Creating a new job posting. Here you can define job details, requirements, and posting channels to attract qualified candidates.");
  };
  
  const handleViewJob = (job: JobPosting) => {
    setSelectedJob(job);
    setIsViewingJob(true);
    speak(`Viewing details for ${job.title} position. You can see the full job description, requirements, and current application statistics.`);
  };
  
  const handleEditJob = (job: JobPosting) => {
    setSelectedJob(job);
    setIsEditingJob(true);
    speak(`Editing ${job.title} position. You can update job details, modify requirements, or adjust posting settings.`);
  };
  
  const handleDeleteJob = (job: JobPosting) => {
    setSelectedJob(job);
    setIsDeleteDialogOpen(true);
    speak(`Preparing to delete ${job.title} position. This will remove the job posting and archive related applications.`);
  };

  const confirmDeleteJob = () => {
    if (!selectedJob) return;
    
    const updatedJobs = jobPostings.filter(job => job.id !== selectedJob.id);
    setJobPostings(updatedJobs);
    setIsDeleteDialogOpen(false);
    setSelectedJob(null);
    toast.success("Job posting deleted", {
      description: "The job posting has been removed"
    });
    speak(`Job posting for ${selectedJob.title} has been deleted.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Closed": return "bg-gray-100 text-gray-800";
      case "Draft": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Manage Job Postings</h3>
          <p className="text-muted-foreground text-sm">
            Create and manage job listings across multiple channels
          </p>
        </div>
        <Button onClick={handleCreateJob}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Job
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Current Job Postings</CardTitle>
          <CardDescription>
            View and manage active job listings
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableCaption>A list of all job postings.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Openings</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobPostings.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.openings}</TableCell>
                  <TableCell>{job.applications}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewJob(job)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditJob(job)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteJob(job)}
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

      {/* View Job Dialog */}
      <Dialog open={isViewingJob} onOpenChange={setIsViewingJob}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>
              View complete information about this job posting
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6 py-4">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{selectedJob.title}</h3>
                <div className="flex flex-wrap gap-2 items-center text-muted-foreground">
                  <span className="flex items-center">
                    <Briefcase className="mr-1 h-4 w-4" /> 
                    {selectedJob.department}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center">
                    <Map className="mr-1 h-4 w-4" /> 
                    {selectedJob.location}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" /> 
                    Posted: {selectedJob.postDate}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 border rounded-md p-3">
                  <p className="text-sm font-medium">Status</p>
                  <p className={`px-2 py-1 rounded-full text-xs font-medium inline-flex w-fit ${getStatusColor(selectedJob.status)}`}>
                    {selectedJob.status}
                  </p>
                </div>
                <div className="space-y-1 border rounded-md p-3">
                  <p className="text-sm font-medium">Openings</p>
                  <p>{selectedJob.openings} positions</p>
                </div>
                <div className="space-y-1 border rounded-md p-3">
                  <p className="text-sm font-medium">Applications</p>
                  <p>{selectedJob.applications} candidates</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-medium">Job Description</h4>
                  <p className="text-muted-foreground">{selectedJob.description}</p>
                </div>
                
                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium">Requirements</h4>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium">Responsibilities</h4>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      {selectedJob.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedJob.salary && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Salary Range</h4>
                      <p className="text-muted-foreground">{selectedJob.salary}</p>
                    </div>
                  )}
                  
                  {selectedJob.deadline && selectedJob.deadline !== "Not set" && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Application Deadline</h4>
                      <p className="text-muted-foreground">{selectedJob.deadline}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setIsViewingJob(false);
                handleEditJob(selectedJob!);
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              
              <Button variant="outline" onClick={() => {
                setIsViewingJob(false);
                handleDeleteJob(selectedJob!);
              }} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
            <Button onClick={() => setIsViewingJob(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Job Sheet */}
      <Sheet 
        open={isCreatingJob || isEditingJob} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreatingJob(false);
            setIsEditingJob(false);
            setSelectedJob(null);
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{isEditingJob ? "Edit Job Posting" : "Create New Job"}</SheetTitle>
            <SheetDescription>
              {isEditingJob 
                ? `Edit details for ${selectedJob?.title}`
                : "Fill in the details to create a new job posting"}
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(isEditingJob ? onSubmitEdit : onSubmitCreate)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior React Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Engineering" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Remote, New York, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="openings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Openings</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Range (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="$80,000 - $100,000" {...field} />
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
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <textarea 
                          className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                          placeholder="Describe the job role, responsibilities, and requirements..."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Deadline (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <SheetFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsCreatingJob(false);
                    setIsEditingJob(false);
                    setSelectedJob(null);
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isEditingJob ? "Save Changes" : "Create Job"}
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job posting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedJob && (
              <p className="font-semibold">{selectedJob.title} ({selectedJob.department})</p>
            )}
            {selectedJob?.applications > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                This job has {selectedJob.applications} active applications. Deleting it will archive all related applications.
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteJob}>
              <Trash className="mr-2 h-4 w-4" />
              Delete Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
