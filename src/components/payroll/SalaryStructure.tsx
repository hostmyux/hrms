
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export const SalaryStructure: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Salary Components</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Component
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Salary</CardTitle>
            <CardDescription>Core compensation component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Calculation Type</span>
                <span className="text-sm font-medium">Fixed Amount</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Taxable</span>
                <span className="text-sm font-medium">Yes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Included in CTC</span>
                <span className="text-sm font-medium">Yes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Default Value</span>
                <span className="text-sm font-medium">Based on grade</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Housing Allowance</CardTitle>
            <CardDescription>Housing benefit component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Calculation Type</span>
                <span className="text-sm font-medium">Percentage of Basic (40%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Taxable</span>
                <span className="text-sm font-medium">Partially</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Included in CTC</span>
                <span className="text-sm font-medium">Yes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Default Value</span>
                <span className="text-sm font-medium">40% of Basic</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transport Allowance</CardTitle>
            <CardDescription>Transportation support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Calculation Type</span>
                <span className="text-sm font-medium">Fixed Amount</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Taxable</span>
                <span className="text-sm font-medium">No (up to $100)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Included in CTC</span>
                <span className="text-sm font-medium">Yes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Default Value</span>
                <span className="text-sm font-medium">$100</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Medical Insurance</CardTitle>
            <CardDescription>Health benefits component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Calculation Type</span>
                <span className="text-sm font-medium">Fixed Amount</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Taxable</span>
                <span className="text-sm font-medium">No</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Included in CTC</span>
                <span className="text-sm font-medium">Yes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Default Value</span>
                <span className="text-sm font-medium">$250</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
