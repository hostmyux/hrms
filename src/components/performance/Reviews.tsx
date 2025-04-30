
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Clock, Edit, FileText, Plus } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';

export const Reviews: React.FC = () => {
  const { speak } = useVoice();
  
  const reviews = [
    { 
      id: 1, 
      employee: "John Smith", 
      position: "Senior Developer", 
      reviewType: "Annual Review", 
      dueDate: "May 15, 2025", 
      manager: "Sarah Johnson",
      status: "In Progress" 
    },
    { 
      id: 2, 
      employee: "Emily Brown", 
      position: "UI/UX Designer", 
      reviewType: "Annual Review", 
      dueDate: "May 10, 2025", 
      manager: "David Lee",
      status: "Not Started" 
    },
    { 
      id: 3, 
      employee: "Michael Wilson", 
      position: "Product Manager", 
      reviewType: "Quarterly Check-in", 
      dueDate: "May 5, 2025", 
      manager: "Sarah Johnson",
      status: "Manager Review" 
    },
    { 
      id: 4, 
      employee: "Jessica Miller", 
      position: "Marketing Specialist", 
      reviewType: "Annual Review", 
      dueDate: "April 30, 2025", 
      manager: "Robert Chen",
      status: "Completed" 
    },
    { 
      id: 5, 
      employee: "Daniel Davis", 
      position: "Customer Support", 
      reviewType: "Probationary Review", 
      dueDate: "April 28, 2025", 
      manager: "Maria Garcia",
      status: "Completed" 
    }
  ];
  
  const handleCreateReview = () => {
    speak("Creating a new performance review. You can select review type, assign participants, set evaluation criteria, and establish deadlines for each stage of the review process.");
  };
  
  const handleStartReview = (employee: string) => {
    speak(`Initiating performance review for ${employee}. This will notify the employee and their manager to begin the self-evaluation and assessment process.`);
  };
  
  const handleEditReview = (employee: string) => {
    speak(`Editing review settings for ${employee}. You can adjust deadlines, change reviewers, or modify evaluation criteria as needed.`);
  };
  
  const handleViewReview = (employee: string) => {
    speak(`Viewing performance review details for ${employee}. This shows all assessment responses, ratings, and feedback from the review cycle.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started": return "bg-gray-100 text-gray-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Self Review": return "bg-purple-100 text-purple-800";
      case "Manager Review": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
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
                      {review.status === "Not Started" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStartReview(review.employee)}
                        >
                          <Clock size={16} />
                        </Button>
                      )}
                      {review.status !== "Completed" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditReview(review.employee)}
                        >
                          <Edit size={16} />
                        </Button>
                      )}
                      {review.status === "Completed" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewReview(review.employee)}
                        >
                          <FileText size={16} />
                        </Button>
                      )}
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
