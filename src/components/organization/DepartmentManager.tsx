
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVoice } from '../../contexts/VoiceContext';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Users, MapPin, DollarSign, Phone, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  employeeCount: number;
  budget: number;
  location: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  establishedDate?: string;
  costCenter?: string;
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
      location: 'Floor 2, Building A',
      phone: '+1-555-0123',
      email: 'hr@company.com',
      status: 'active',
      establishedDate: '2020-01-15',
      costCenter: 'CC-HR-001'
    },
    {
      id: 'it',
      name: 'Information Technology',
      description: 'Handles all technology infrastructure and software development',
      manager: 'Michael Chen',
      employeeCount: 25,
      budget: 850000,
      location: 'Floor 3, Building B',
      phone: '+1-555-0124',
      email: 'it@company.com',
      status: 'active',
      establishedDate: '2019-06-10',
      costCenter: 'CC-IT-002'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Develops marketing strategies and manages brand presence',
      manager: 'Emily Davis',
      employeeCount: 18,
      budget: 620000,
      location: 'Floor 1, Building A',
      phone: '+1-555-0125',
      email: 'marketing@company.com',
      status: 'active',
      establishedDate: '2020-03-22',
      costCenter: 'CC-MKT-003'
    }
  ]);

  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Department>>({});

  useEffect(() => {
    speak("Department management interface loaded. You can view, create, edit, and delete departments. Each department shows comprehensive details including employee count, budget, contact information, and manager details. The interface is fully responsive and voice-guided.");
  }, [speak]);

  const handleCreateDepartment = () => {
    setFormData({
      status: 'active',
      employeeCount: 0,
      budget: 0
    });
    setIsEditing(false);
    setIsDialogOpen(true);
    speak("Opening department creation form. Please fill in the required fields including department name, manager, and location to create a new department. Additional fields like phone, email, and cost center are optional but recommended for complete department records.");
  };

  const handleEditDepartment = (dept: Department) => {
    setFormData(dept);
    setSelectedDept(dept);
    setIsEditing(true);
    setIsDialogOpen(true);
    speak(`Editing department: ${dept.name}. You can modify all department details including contact information, budget, and organizational data in this comprehensive form.`);
  };

  const handleDeleteDepartment = (dept: Department) => {
    setDepartments(prev => prev.filter(d => d.id !== dept.id));
    addAction({
      type: "delete",
      description: `Deleted department: ${dept.name}`,
      module: "Organization"
    });
    speak(`Department ${dept.name} has been permanently deleted from the organization structure.`);
    toast(`Department ${dept.name} deleted successfully`);
  };

  const handleSaveDepartment = () => {
    if (!formData.name || !formData.manager || !formData.location) {
      speak("Please fill in all required fields: department name, manager, and location are mandatory for creating or updating a department.");
      toast("Please fill in all required fields");
      return;
    }

    if (isEditing && selectedDept) {
      setDepartments(prev => 
        prev.map(d => d.id === selectedDept.id ? { ...d, ...formData } as Department : d)
      );
      addAction({
        type: "update",
        description: `Updated department: ${formData.name}`,
        module: "Organization"
      });
      speak(`Department ${formData.name} has been successfully updated with all the new information.`);
      toast(`Department ${formData.name} updated successfully`);
    } else {
      const newDept: Department = {
        id: Date.now().toString(),
        name: formData.name || '',
        description: formData.description || '',
        manager: formData.manager || '',
        employeeCount: formData.employeeCount || 0,
        budget: formData.budget || 0,
        location: formData.location || '',
        phone: formData.phone || '',
        email: formData.email || '',
        status: formData.status || 'active',
        establishedDate: formData.establishedDate || new Date().toISOString().split('T')[0],
        costCenter: formData.costCenter || ''
      };
      setDepartments(prev => [...prev, newDept]);
      addAction({
        type: "create",
        description: `Created department: ${newDept.name}`,
        module: "Organization"
      });
      speak(`New department ${newDept.name} has been successfully created with comprehensive details and added to your organization structure.`);
      toast(`Department ${newDept.name} created successfully`);
    }
    
    setIsDialogOpen(false);
    setFormData({});
  };

  const handleDepartmentHover = (dept: Department) => {
    speak(`Department: ${dept.name}. Manager: ${dept.manager}. Employee count: ${dept.employeeCount}. Budget: ${dept.budget.toLocaleString()} dollars. Status: ${dept.status}. Contact: ${dept.phone || 'No phone'}, ${dept.email || 'No email'}.`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Department Management</h2>
        <Button 
          onClick={handleCreateDepartment} 
          onMouseEnter={() => speak('Create new department with comprehensive details')}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((dept) => (
          <Card 
            key={dept.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onMouseEnter={() => handleDepartmentHover(dept)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="text-base sm:text-lg block truncate">{dept.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                    dept.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {dept.status}
                  </span>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditDepartment(dept)}
                    onMouseEnter={() => speak('Edit department details')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDeleteDepartment(dept)}
                    onMouseEnter={() => speak('Delete department')}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{dept.description}</p>
              
              <div className="grid grid-cols-1 gap-3 text-xs sm:text-sm">
                <div>
                  <Label className="font-medium text-xs">Manager</Label>
                  <p className="truncate">{dept.manager}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{dept.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>{dept.employeeCount} employees</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>${dept.budget.toLocaleString()}</span>
                </div>
                
                {dept.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{dept.phone}</span>
                  </div>
                )}
                
                {dept.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{dept.email}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Department' : 'Create New Department'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modify the department details below.' : 'Fill in the comprehensive details to create a new department.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status || 'active'} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
                placeholder="Enter comprehensive department description"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="manager">Manager *</Label>
                <Input
                  id="manager"
                  value={formData.manager || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                  placeholder="Enter manager name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter office location"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter department phone"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter department email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="employeeCount">Employee Count</Label>
                <Input
                  id="employeeCount"
                  type="number"
                  min="0"
                  value={formData.employeeCount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeCount: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="budget">Annual Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  value={formData.budget || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="establishedDate">Established Date</Label>
                <Input
                  id="establishedDate"
                  type="date"
                  value={formData.establishedDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, establishedDate: e.target.value }))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="costCenter">Cost Center</Label>
                <Input
                  id="costCenter"
                  value={formData.costCenter || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, costCenter: e.target.value }))}
                  placeholder="Enter cost center code"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveDepartment} className="w-full sm:w-auto">
              {isEditing ? 'Update' : 'Create'} Department
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
