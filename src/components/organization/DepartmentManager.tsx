
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useVoice } from '../../contexts/VoiceContext';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  employeeCount: number;
  budget: number;
  location: string;
}

export const DepartmentManager: React.FC = () => {
  const { speak } = useVoice();
  const { addAction } = useUser();
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'hr',
      name: 'Human Resources',
      description: 'Manages employee relations, recruitment, and policy enforcement',
      manager: 'Sarah Johnson',
      employeeCount: 12,
      budget: 450000,
      location: 'Floor 2, Building A'
    },
    {
      id: 'it',
      name: 'Information Technology',
      description: 'Handles all technology infrastructure and software development',
      manager: 'Michael Chen',
      employeeCount: 25,
      budget: 850000,
      location: 'Floor 3, Building B'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Develops marketing strategies and manages brand presence',
      manager: 'Emily Davis',
      employeeCount: 18,
      budget: 620000,
      location: 'Floor 1, Building A'
    }
  ]);

  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Department>>({});

  useEffect(() => {
    speak("Department management interface loaded. You can view, create, edit, and delete departments. Each department shows employee count, budget, and manager information.");
  }, [speak]);

  const handleCreateDepartment = () => {
    setFormData({});
    setIsEditing(false);
    setIsDialogOpen(true);
    speak("Opening department creation form. Please fill in the required fields to create a new department.");
  };

  const handleEditDepartment = (dept: Department) => {
    setFormData(dept);
    setSelectedDept(dept);
    setIsEditing(true);
    setIsDialogOpen(true);
    speak(`Editing department: ${dept.name}. You can modify department details in the form.`);
  };

  const handleDeleteDepartment = (dept: Department) => {
    setDepartments(prev => prev.filter(d => d.id !== dept.id));
    addAction({
      type: "delete",
      description: `Deleted department: ${dept.name}`,
      module: "Organization"
    });
    speak(`Department ${dept.name} has been deleted successfully.`);
    toast(`Department ${dept.name} deleted`);
  };

  const handleSaveDepartment = () => {
    if (!formData.name || !formData.manager) {
      speak("Please fill in all required fields: department name and manager.");
      toast("Please fill in all required fields");
      return;
    }

    if (isEditing && selectedDept) {
      setDepartments(prev => 
        prev.map(d => d.id === selectedDept.id ? { ...d, ...formData } : d)
      );
      addAction({
        type: "update",
        description: `Updated department: ${formData.name}`,
        module: "Organization"
      });
      speak(`Department ${formData.name} has been updated successfully.`);
      toast(`Department ${formData.name} updated`);
    } else {
      const newDept: Department = {
        id: Date.now().toString(),
        name: formData.name || '',
        description: formData.description || '',
        manager: formData.manager || '',
        employeeCount: formData.employeeCount || 0,
        budget: formData.budget || 0,
        location: formData.location || ''
      };
      setDepartments(prev => [...prev, newDept]);
      addAction({
        type: "create",
        description: `Created department: ${newDept.name}`,
        module: "Organization"
      });
      speak(`New department ${newDept.name} has been created successfully.`);
      toast(`Department ${newDept.name} created`);
    }
    
    setIsDialogOpen(false);
    setFormData({});
  };

  const handleDepartmentHover = (dept: Department) => {
    speak(`Department: ${dept.name}. Manager: ${dept.manager}. Employee count: ${dept.employeeCount}. Budget: ${dept.budget} dollars.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Department Management</h2>
        <Button onClick={handleCreateDepartment} onMouseEnter={() => speak('Create new department')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <Card 
            key={dept.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onMouseEnter={() => handleDepartmentHover(dept)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{dept.name}</span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditDepartment(dept)}
                    onMouseEnter={() => speak('Edit department')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteDepartment(dept)}
                    onMouseEnter={() => speak('Delete department')}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{dept.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-medium">Manager</Label>
                  <p>{dept.manager}</p>
                </div>
                <div>
                  <Label className="font-medium">Location</Label>
                  <p>{dept.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{dept.employeeCount} employees</span>
                </div>
                <div>
                  <Label className="font-medium">Budget</Label>
                  <p>${dept.budget.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Department' : 'Create New Department'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modify the department details below.' : 'Fill in the details to create a new department.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Department Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter department name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter department description"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="manager">Manager *</Label>
              <Input
                id="manager"
                value={formData.manager || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                placeholder="Enter manager name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Input
                  id="employeeCount"
                  type="number"
                  value={formData.employeeCount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeCount: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDepartment}>
              {isEditing ? 'Update' : 'Create'} Department
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
