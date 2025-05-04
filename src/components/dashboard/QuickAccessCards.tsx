
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, BarChart, FileText, UserPlus } from 'lucide-react';

interface QuickAccessCardsProps {
  onCardClick: (destination: string, message: string) => void;
}

export const QuickAccessCards: React.FC<QuickAccessCardsProps> = ({ onCardClick }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors" 
        onClick={() => onCardClick("attendance", "Navigating to leave management screen where you can review and manage employee leave requests.")}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Calendar className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Leave Management</h3>
          <p className="text-sm text-muted-foreground">Approve and manage leave requests</p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors" 
        onClick={() => onCardClick("performance", "Navigating to performance goals section where you can set and track employee objectives.")}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <BarChart className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Performance Goals</h3>
          <p className="text-sm text-muted-foreground">Create and manage goals</p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors" 
        onClick={() => onCardClick("payroll", "Navigating to payroll management where you can run payroll processes and review compensation reports.")}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <FileText className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Payroll</h3>
          <p className="text-sm text-muted-foreground">Process employee payments</p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors" 
        onClick={() => onCardClick("recruitment", "Navigating to recruitment section where you can manage job listings and review candidates.")}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <UserPlus className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Recruitment</h3>
          <p className="text-sm text-muted-foreground">Manage hiring pipeline</p>
        </CardContent>
      </Card>
    </div>
  );
};
