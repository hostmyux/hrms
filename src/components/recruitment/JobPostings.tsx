
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, Edit, Eye, PlusCircle, Trash } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';

export const JobPostings: React.FC = () => {
  const { speak } = useVoice();
  
  const jobPostings = [
    { id: 1, title: "Senior React Developer", department: "Engineering", location: "Remote", openings: 2, applications: 24, status: "Active" },
    { id: 2, title: "HR Manager", department: "Human Resources", location: "New York", openings: 1, applications: 18, status: "Active" },
    { id: 3, title: "UX Designer", department: "Design", location: "San Francisco", openings: 3, applications: 37, status: "Active" },
    { id: 4, title: "Product Manager", department: "Product", location: "Remote", openings: 1, applications: 12, status: "Closed" },
    { id: 5, title: "Data Analyst", department: "Data Science", location: "Boston", openings: 2, applications: 29, status: "Draft" },
  ];
  
  const handleCreateJob = () => {
    speak("Creating a new job posting. Here you can define job details, requirements, and posting channels to attract qualified candidates.");
  };
  
  const handleViewJob = (jobTitle: string) => {
    speak(`Viewing details for ${jobTitle} position. You can see the full job description, requirements, and current application statistics.`);
  };
  
  const handleEditJob = (jobTitle: string) => {
    speak(`Editing ${jobTitle} position. You can update job details, modify requirements, or adjust posting settings.`);
  };
  
  const handleDeleteJob = (jobTitle: string) => {
    speak(`Preparing to delete ${jobTitle} position. This will remove the job posting and archive related applications.`);
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
        <CardContent>
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === "Active" ? "bg-green-100 text-green-800" :
                      job.status === "Closed" ? "bg-gray-100 text-gray-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {job.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewJob(job.title)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditJob(job.title)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteJob(job.title)}
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
