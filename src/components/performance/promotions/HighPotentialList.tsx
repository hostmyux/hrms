
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { HighPotentialEmployee, ReadinessLevel } from './types';

interface HighPotentialListProps {
  highPotentialEmployees: HighPotentialEmployee[];
  onViewDevelopmentPlan: (employee: HighPotentialEmployee) => void;
  getReadinessColor: (readiness: ReadinessLevel) => string;
}

export const HighPotentialList: React.FC<HighPotentialListProps> = ({
  highPotentialEmployees,
  onViewDevelopmentPlan,
  getReadinessColor
}) => {
  return (
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
                    onClick={() => onViewDevelopmentPlan(employee)}
                    title="View Development Plan"
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
  );
};
