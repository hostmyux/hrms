
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useVoice } from '../../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, Edit, Trash2, Plus, Share2, Globe } from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  status: 'draft' | 'published' | 'closed';
  postedDate?: string;
  applications: number;
  views: number;
}

interface JobPostingFormValues {
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string;
  status: 'draft' | 'published';
}

export const JobPostings: React.FC = () => {
  const { speak } = useVoice();
  const [jobs, setJobs] = useState<JobPosting[]>([
    {
      id: '1',
      title: 'Senior React Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '$90,000 - $120,000',
      description: 'We are looking for an experienced React developer to join our front-end team...',
      requirements: ['3+ years React experience', 'TypeScript proficiency', 'Experience with state management'],
      status: 'published',
      postedDate: '2025-04-01',
      applications: 12,
      views: 345
    },
    {
      id: '2',
      title: 'HR Manager',
      department: 'Human Resources',
      location: 'New York, NY',
      type: 'Full-time',
      experience: '5+ years',
      salary: '$85,000 - $105,000',
      description: 'Seeking an experienced HR Manager to oversee all HR functions...',
      requirements: ['5+ years HR experience', 'Knowledge of employment laws', 'Strong communication skills'],
      status: 'draft',
      applications: 0,
      views: 0
    },
    {
      id: '3',
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Chicago, IL',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '$60,000 - $75,000',
      description: 'Join our marketing team to help grow our brand presence...',
      requirements: ['Digital marketing experience', 'Content creation skills', 'Analytics knowledge'],
      status: 'published',
      postedDate: '2025-04-10',
      applications: 8,
      views: 210
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<JobPostingFormValues>({
    defaultValues: {
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      experience: '',
      salary: '',
      description: '',
      requirements: '',
      status: 'draft'
    }
  });

  const handleNewJob = () => {
    setIsEditMode(false);
    form.reset();
    setIsCreateDialogOpen(true);
    speak("Creating a new job posting. Fill in the job details and decide whether to save as draft or publish immediately.");
  };

  const handleEditJob = (job: JobPosting) => {
    setSelectedJob(job);
    setIsEditMode(true);
    form.reset({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements.join('\n'),
      status: job.status
    });
    setIsCreateDialogOpen(true);
    speak(`Editing job posting for ${job.title}. Update the details as needed.`);
  };

  const handleDeleteJob = (id: string, title: string) => {
    setJobs(jobs.filter(job => job.id !== id));
    toast.success(`Job posting "${title}" has been deleted`);
    speak(`Job posting for ${title} has been deleted.`);
  };

  const handlePublishJob = (job: JobPosting) => {
    setSelectedJob(job);
    setIsPublishDialogOpen(true);
    speak(`Preparing to publish job posting for ${job.title}. Select publishing channels and review the posting before making it live.`);
  };

  const confirmPublish = () => {
    if (!selectedJob) return;

    const updatedJobs = jobs.map(job => 
      job.id === selectedJob.id 
        ? { 
            ...job, 
            status: 'published' as const, 
            postedDate: new Date().toISOString().substring(0, 10) 
          } 
        : job
    );
    
    setJobs(updatedJobs);
    setIsPublishDialogOpen(false);
    toast.success(`Job posting "${selectedJob.title}" has been published`);
    speak(`Job posting for ${selectedJob.title} has been successfully published and is now visible to candidates.`);
  };

  const onSubmit = (data: JobPostingFormValues) => {
    if (isEditMode && selectedJob) {
      // Update existing job
      const updatedJobs = jobs.map(job => 
        job.id === selectedJob.id 
          ? { 
              ...job, 
              ...data, 
              requirements: data.requirements.split('\n').filter(req => req.trim() !== ''),
              status: data.status,
              postedDate: data.status === 'published' ? new Date().toISOString().substring(0, 10) : job.postedDate
            } 
          : job
      );
      
      setJobs(updatedJobs);
      toast.success(`Job posting "${data.title}" has been updated`);
      speak(`Job posting for ${data.title} has been updated.`);
    } else {
      // Create new job
      const newJob: JobPosting = {
        id: (jobs.length + 1).toString(),
        ...data,
        requirements: data.requirements.split('\n').filter(req => req.trim() !== ''),
        status: data.status,
        postedDate: data.status === 'published' ? new Date().toISOString().substring(0, 10) : undefined,
        applications: 0,
        views: 0
      };
      
      setJobs([...jobs, newJob]);
      toast.success(`Job posting "${data.title}" has been created`);
      speak(`New job posting for ${data.title} has been created.`);
    }
    
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Job Postings</h2>
          <p className="text-sm text-muted-foreground">Manage open positions and job listings</p>
        </div>
        <Button onClick={handleNewJob}>
          <Plus className="mr-2 h-4 w-4" />
          New Job Posting
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription>{job.department} • {job.location}</CardDescription>
                </div>
                <Badge variant={job.status === 'published' ? 'default' : job.status === 'draft' ? 'outline' : 'destructive'}>
                  {job.status === 'published' ? 'Published' : job.status === 'draft' ? 'Draft' : 'Closed'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="py-2 flex-grow">
              <div className="mb-3">
                <div className="flex items-center gap-x-2 text-sm">
                  <span className="font-medium">Type:</span> {job.type}
                </div>
                <div className="flex items-center gap-x-2 text-sm">
                  <span className="font-medium">Experience:</span> {job.experience}
                </div>
                <div className="flex items-center gap-x-2 text-sm">
                  <span className="font-medium">Salary:</span> {job.salary}
                </div>
              </div>
              
              {job.status === 'published' && (
                <div className="flex gap-3 text-sm mb-3">
                  <div>
                    <span className="font-medium">{job.applications}</span> Applications
                  </div>
                  <div>
                    <span className="font-medium">{job.views}</span> Views
                  </div>
                  {job.postedDate && (
                    <div>
                      Posted: <span className="font-medium">{job.postedDate}</span>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
            </CardContent>
            <CardFooter className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => handleEditJob(job)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              {job.status === 'draft' && (
                <Button variant="default" size="sm" onClick={() => handlePublishJob(job)}>
                  <Globe className="h-4 w-4 mr-1" />
                  Publish
                </Button>
              )}
              {job.status === 'published' && (
                <Button variant="outline" size="sm" onClick={() => speak(`Sharing job posting for ${job.title}`)}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              )}
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteJob(job.id, job.title)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Create/Edit Job Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Job Posting' : 'Create New Job Posting'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Update the job posting details below.' 
                : 'Fill in the job details and save as draft or publish immediately.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Job title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  rules={{ required: "Department is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Human Resources">Human Resources</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New York, NY or Remote" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Temporary">Temporary</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3-5 years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Range</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $60,000 - $80,000" {...field} />
                    </FormControl>
                    <FormDescription>Leave blank to show "Competitive salary"</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                rules={{ required: "Job description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the role, responsibilities, and ideal candidate..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List requirements, one per line..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>Enter each requirement on a new line</FormDescription>
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
                        <SelectItem value="draft">Save as Draft</SelectItem>
                        <SelectItem value="published">Publish Immediately</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditMode ? 'Save Changes' : 'Create Job'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Publish Job Dialog */}
      <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Job Posting</DialogTitle>
            <DialogDescription>
              Select where you want to publish this job posting
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Publishing Channels</h3>
              <div className="space-y-2">
                {['Company Website', 'LinkedIn', 'Indeed', 'Glassdoor', 'ZipRecruiter'].map((channel) => (
                  <div key={channel} className="flex items-center space-x-2">
                    <input type="checkbox" id={channel} defaultChecked={channel === 'Company Website'} className="rounded" />
                    <label htmlFor={channel} className="text-sm">{channel}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Publishing Duration</h3>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md mt-4">
              <p className="text-sm text-blue-800">
                Publishing will make this job visible to candidates on all selected platforms.
                You can unpublish or edit the job at any time.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPublishDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPublish}>
              Publish Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
