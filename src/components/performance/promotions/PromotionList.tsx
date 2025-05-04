
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle } from 'lucide-react';
import { PromotionRequest, PromotionStatus } from './types';

interface PromotionListProps {
  promotionRequests: PromotionRequest[];
  onViewPromotion: (promotion: PromotionRequest) => void;
  onApprovePromotion: (promotion: PromotionRequest) => void;
  getStatusColor: (status: PromotionStatus) => string;
}

export const PromotionList: React.FC<PromotionListProps> = ({
  promotionRequests,
  onViewPromotion,
  onApprovePromotion,
  getStatusColor
}) => {
  return (
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
                      onClick={() => onViewPromotion(request)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Button>
                    {(request.status === "HR Review" || request.status === "Under Review") && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onApprovePromotion(request)}
                        title="Approve Promotion"
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
  );
};
