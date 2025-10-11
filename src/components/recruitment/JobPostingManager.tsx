
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useVoice } from '../../contexts/VoiceContext';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, MapPin, DollarSign, Clock, Users } from 'lucide-react';
import { ResponsiveDialog } from '../shared/ResponsiveDialog';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  status: 'active' | 'paused' | 'closed';
  applicantCount: number;
}

export const JobPostingManager: React.FC = () => {
  const { speak } = useVoice();
  const { addAction } = useUser();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: { min: 120000, max: 180000, currency: 'USD' },
      description: 'We are looking for a Senior Software Engineer to join our growing team...',
      requirements: ['5+ years experience', 'React/TypeScript', 'Node.js', 'AWS'],
      benefits: ['Health Insurance', '401k', 'Remote Work', 'Stock Options'],
      postedDate: '2024-01-15',
      status: 'active',
      applicantCount: 24
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'full-time',
      salary: { min: 110000, max: 150000, currency: 'USD' },
      description: 'Join our product team to drive innovation and user experience...',
      requirements: ['3+ years PM experience', 'Agile/Scrum', 'Data Analysis', 'Stakeholder Management'],
      benefits: ['Health Insurance', 'Flexible PTO', 'Learning Budget', 'Gym Membership'],
      postedDate: '2024-01-20',
      status: 'active',
      applicantCount: 18
    }
  ]);

  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<JobPosting>>({});

  useEffect(() => {
    speak("Job posting management interface loaded. You can create, edit, and manage job postings. Each posting shows applicant count, salary range, and current status.");
  }, [speak]);

  const handleCreateJob = () => {
    setFormData({
      type: 'full-time',
      status: 'active',
      salary: { min: 0, max: 0, currency: 'USD' },
      requirements: [],
      benefits: []
    });
    setIsEditing(false);
    setIsDialogOpen(true);
    speak("Opening job posting creation form. Fill in the details to create a new job posting.");
  };

  const handleEditJob = (job: JobPosting) => {
    setFormData(job);
    setSelectedJob(job);
    setIsEditing(true);
    setIsDialogOpen(true);
    speak(`Editing job posting: ${job.title}. You can modify all job details in the form.`);
  };

  const handleDeleteJob = (job: JobPosting) => {
    setJobPostings(prev => prev.filter(j => j.id !== job.id));
    addAction({
      type: "delete",
      description: `Deleted job posting: ${job.title}`,
      module: "Recruitment"
    });
    speak(`Job posting ${job.title} has been deleted successfully.`);
    toast(`Job posting ${job.title} deleted`);
  };

  const handleSaveJob = () => {
    if (!formData.title || !formData.department || !formData.location) {
      speak("Please fill in all required fields: title, department, and location.");
      toast("Please fill in all required fields");
      return;
    }

    if (isEditing && selectedJob) {
      setJobPostings(prev => 
        prev.map(j => j.id === selectedJob.id ? { ...j, ...formData } as JobPosting : j)
      );
      addAction({
        type: "update",
        description: `Updated job posting: ${formData.title}`,
        module: "Recruitment"
      });
      speak(`Job posting ${formData.title} has been updated successfully.`);
      toast(`Job posting ${formData.title} updated`);
    } else {
      const newJob: JobPosting = {
        id: Date.now().toString(),
        title: formData.title || '',
        department: formData.department || '',
        location: formData.location || '',
        type: formData.type || 'full-time',
        salary: formData.salary || { min: 0, max: 0, currency: 'USD' },
        description: formData.description || '',
        requirements: formData.requirements || [],
        benefits: formData.benefits || [],
        postedDate: new Date().toISOString().split('T')[0],
        status: formData.status || 'active',
        applicantCount: 0
      };
      setJobPostings(prev => [...prev, newJob]);
      addAction({
        type: "create",
        description: `Created job posting: ${newJob.title}`,
        module: "Recruitment"
      });
      speak(`New job posting ${newJob.title} has been created successfully.`);
      toast(`Job posting ${newJob.title} created`);
    }
    
    setIsDialogOpen(false);
    setFormData({});
  };

  const handleJobHover = (job: JobPosting) => {
    speak(`Job: ${job.title} in ${job.department}. Location: ${job.location}. Salary range: ${job.salary.min} to ${job.salary.max} ${job.salary.currency}. Status: ${job.status}. ${job.applicantCount} applicants.`);
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'closed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Posting Management</h2>
        <Button onClick={handleCreateJob} onMouseEnter={() => speak('Create new job posting')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Job Posting
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {jobPostings.map((job) => (
          <Card 
            key={job.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onMouseEnter={() => handleJobHover(job)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{job.title}</span>
                <div className="flex gap-2">
                  <Badge variant={getStatusVariant(job.status)}>
                    {job.status}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditJob(job)}
                    onMouseEnter={() => speak('Edit job posting')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteJob(job)}
                    onMouseEnter={() => speak('Delete job posting')}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>${job.salary.min}k - ${job.salary.max}k</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="capitalize">{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{job.applicantCount} applicants</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {job.requirements.slice(0, 3).map((req, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {req}
                  </Badge>
                ))}
                {job.requirements.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.requirements.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ResponsiveDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={isEditing ? 'Edit Job Posting' : 'Create New Job Posting'}
        description={isEditing ? 'Modify the job posting details below.' : 'Fill in the details to create a new job posting.'}
        footer={
          <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleSaveJob} className="w-full sm:w-auto">
              {isEditing ? 'Update' : 'Create'} Job Posting
            </Button>
          </div>
        }
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter job title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Enter department"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Job Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter job description"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="salaryMin">Min Salary</Label>
              <Input
                id="salaryMin"
                type="number"
                value={formData.salary?.min || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  salary: { ...prev.salary, min: parseInt(e.target.value) || 0, max: prev.salary?.max || 0, currency: 'USD' }
                }))}
                placeholder="0"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="salaryMax">Max Salary</Label>
              <Input
                id="salaryMax"
                type="number"
                value={formData.salary?.max || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  salary: { ...prev.salary, min: prev.salary?.min || 0, max: parseInt(e.target.value) || 0, currency: 'USD' }
                }))}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </ResponsiveDialog>
    </div>
  );
};
