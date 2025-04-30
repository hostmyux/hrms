
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, CheckCircle, Eye, FileText, Plus, ThumbsUp } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';

export const Promotions: React.FC = () => {
  const { speak } = useVoice();
  
  const promotionRequests = [
    { 
      id: 1, 
      employee: "Emily Brown", 
      currentPosition: "UI Designer", 
      proposedPosition: "Senior UI Designer", 
      manager: "David Lee",
      requestDate: "April 15, 2025",
      status: "Under Review" 
    },
    { 
      id: 2, 
      employee: "Michael Wilson", 
      currentPosition: "Product Manager", 
      proposedPosition: "Senior Product Manager", 
      manager: "Sarah Johnson",
      requestDate: "April 10, 2025",
      status: "Approved" 
    },
    { 
      id: 3, 
      employee: "Alex Johnson", 
      currentPosition: "Software Developer", 
      proposedPosition: "Senior Developer", 
      manager: "John Smith",
      requestDate: "April 5, 2025",
      status: "HR Review" 
    },
    { 
      id: 4, 
      employee: "Jessica Miller", 
      currentPosition: "Marketing Specialist", 
      proposedPosition: "Marketing Manager", 
      manager: "Robert Chen",
      requestDate: "March 28, 2025",
      status: "Declined" 
    }
  ];
  
  const highPotentialEmployees = [
    { 
      id: 1, 
      name: "Daniel Davis", 
      position: "Customer Support Lead", 
      department: "Customer Service",
      readinessLevel: "Ready Now",
      manager: "Maria Garcia"
    },
    { 
      id: 2, 
      name: "Sophia Martinez", 
      position: "Financial Analyst", 
      department: "Finance",
      readinessLevel: "Ready in 3-6 months",
      manager: "William Taylor"
    },
    { 
      id: 3, 
      name: "James Wilson", 
      position: "Software Developer", 
      department: "Engineering",
      readinessLevel: "Ready in 6-12 months",
      manager: "John Smith"
    }
  ];
  
  const handleCreatePromotion = () => {
    speak("Creating a new promotion request. This process includes performance justification, skill assessment, and proper documentation to support the proposed advancement.");
  };
  
  const handleViewPromotion = (employee: string) => {
    speak(`Viewing promotion details for ${employee}. This shows the complete promotion case including performance history, skills assessment, and manager recommendations.`);
  };
  
  const handleApprovePromotion = (employee: string) => {
    speak(`Preparing to approve promotion for ${employee}. Once approved, HR will process the promotion including title change, compensation adjustment, and update to organizational charts.`);
  };
  
  const handleViewDevelopmentPlan = (employee: string) => {
    speak(`Viewing career development plan for ${employee}. This outlines skills to develop, training opportunities, and mentorship arrangements to prepare for future advancement.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "HR Review": return "bg-blue-100 text-blue-800";
      case "Approved": return "bg-green-100 text-green-800";
      case "Declined": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case "Ready Now": return "bg-green-100 text-green-800";
      case "Ready in 3-6 months": return "bg-blue-100 text-blue-800";
      case "Ready in 6-12 months": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Promotion Management</h3>
          <p className="text-muted-foreground text-sm">
            Track promotion requests and high potential employees
          </p>
        </div>
        <Button onClick={handleCreatePromotion}>
          <Plus className="mr-2 h-4 w-4" />
          Request Promotion
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Active Promotion Requests</CardTitle>
          <CardDescription>
            Track status of pending promotion recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Current promotion requests and their status.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Current Position</TableHead>
                <TableHead>Proposed Position</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotionRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.employee}</TableCell>
                  <TableCell>{request.currentPosition}</TableCell>
                  <TableCell>{request.proposedPosition}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewPromotion(request.employee)}
                      >
                        <Eye size={16} />
                      </Button>
                      {(request.status === "HR Review" || request.status === "Under Review") && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleApprovePromotion(request.employee)}
                        >
                          <CheckCircle size={16} />
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
      
      <Card>
        <CardHeader>
          <CardTitle>High Potential Employees</CardTitle>
          <CardDescription>
            Employees identified for accelerated development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Employees on leadership development track.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Current Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Readiness Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highPotentialEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReadinessColor(employee.readinessLevel)}`}>
                      {employee.readinessLevel}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDevelopmentPlan(employee.name)}
                    >
                      <FileText size={16} />
                    </Button>
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
