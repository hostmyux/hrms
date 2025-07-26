
import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/toastHelpers';
import { useVoice } from '../../contexts/VoiceContext';
import { 
  getDepartments, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment, 
  type Department 
} from '../../services/organizationService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Users,
  ChevronDown,
  ChevronUp,
  UsersRound
} from 'lucide-react';

export const DepartmentManagement: React.FC = () => {
  // Using toast from sonner import
  const { speak } = useVoice();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Department>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Partial<Department>>({
    name: '',
    description: '',
    managerId: '',
    managerName: '',
    employeeCount: 0,
    parentDepartmentId: null
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load departments on component mount
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
        speak("Departments loaded. You can view, add, edit, or delete departments from this screen.");
      } catch (error) {
        toast({
          title: "Error loading departments",
          description: "Failed to load departments. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDepartments();
  }, [speak, toast]);

  // Handle sort
  const handleSort = (field: keyof Department) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort departments
  const filteredAndSortedDepartments = departments
    .filter(dept => 
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.managerName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'employeeCount') {
        return sortDirection === 'asc' 
          ? a.employeeCount - b.employeeCount 
          : b.employeeCount - a.employeeCount;
      } else {
        const aValue = a[sortField]?.toString().toLowerCase() || '';
        const bValue = b[sortField]?.toString().toLowerCase() || '';
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
    });

  // Open add dialog
  const handleOpenAddDialog = () => {
    setFormData({
      name: '',
      description: '',
      managerId: '',
      managerName: '',
      employeeCount: 0,
      parentDepartmentId: null
    });
    setIsAddDialogOpen(true);
    speak("Adding a new department. Please fill in the department details.");
  };

  // Open edit dialog
  const handleOpenEditDialog = (department: Department) => {
    setSelectedDepartment(department);
    setFormData(department);
    setIsEditDialogOpen(true);
    speak(`Editing ${department.name} department. You can update department details.`);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
    speak(`Confirm deletion of ${department.name} department.`);
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'employeeCount' ? parseInt(value) || 0 : value
    }));
  };

  // Handle department creation
  const handleCreateDepartment = async () => {
    if (!formData.name || !formData.managerName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const newDepartment = await createDepartment({
        name: formData.name || '',
        description: formData.description || '',
        managerId: formData.managerId || '',
        managerName: formData.managerName || '',
        employeeCount: formData.employeeCount || 0,
        parentDepartmentId: formData.parentDepartmentId
      });
      
      setDepartments(prev => [...prev, newDepartment]);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: `Department "${newDepartment.name}" created successfully.`,
      });
      speak(`Department ${newDepartment.name} created successfully.`);
    } catch (error) {
      toast({
        title: "Error creating department",
        description: "Failed to create department. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle department update
  const handleUpdateDepartment = async () => {
    if (!selectedDepartment || !formData.name || !formData.managerName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedDepartment = await updateDepartment(selectedDepartment.id, formData);
      
      setDepartments(prev => 
        prev.map(dept => dept.id === updatedDepartment.id ? updatedDepartment : dept)
      );
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: `Department "${updatedDepartment.name}" updated successfully.`,
      });
      speak(`Department ${updatedDepartment.name} updated successfully.`);
    } catch (error) {
      toast({
        title: "Error updating department",
        description: "Failed to update department. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle department deletion
  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;

    setIsSaving(true);
    try {
      await deleteDepartment(selectedDepartment.id);
      
      setDepartments(prev => prev.filter(dept => dept.id !== selectedDepartment.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: `Department "${selectedDepartment.name}" deleted successfully.`,
      });
      speak(`Department ${selectedDepartment.name} deleted successfully.`);
    } catch (error) {
      toast({
        title: "Error deleting department",
        description: "Failed to delete department. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <UsersRound className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-medium">Departments</h3>
            <div className="ml-3 flex items-center bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
              {departments.length} total
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search departments..."
                className="w-full sm:w-[250px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleOpenAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </div>
        </div>

        {/* Departments table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Department Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('managerName')}
                >
                  <div className="flex items-center">
                    Manager
                    {sortField === 'managerName' && (
                      sortDirection === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('employeeCount')}
                >
                  <div className="flex items-center">
                    Employees
                    {sortField === 'employeeCount' && (
                      sortDirection === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Users size={48} strokeWidth={1.5} className="mb-2" />
                      {searchQuery ? (
                        <p>No departments match your search criteria.</p>
                      ) : (
                        <p>No departments found. Create your first department.</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.managerName}</TableCell>
                    <TableCell>{department.employeeCount}</TableCell>
                    <TableCell className="max-w-xs truncate">{department.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenEditDialog(department)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDeleteDialog(department)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Department Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>
                Create a new department in your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="managerName">Manager Name *</Label>
                  <Input
                    id="managerName"
                    name="managerName"
                    value={formData.managerName || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerId">Manager ID</Label>
                  <Input
                    id="managerId"
                    name="managerId"
                    value={formData.managerId || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Number of Employees</Label>
                  <Input
                    id="employeeCount"
                    name="employeeCount"
                    type="number"
                    min="0"
                    value={formData.employeeCount || 0}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentDepartmentId">Parent Department (Optional)</Label>
                  <select
                    id="parentDepartmentId"
                    name="parentDepartmentId"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.parentDepartmentId || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parentDepartmentId: e.target.value || null
                    }))}
                  >
                    <option value="">None (Top Level)</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDepartment} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Creating...
                  </>
                ) : "Create Department"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Department Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Update the details of this department.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Department Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-managerName">Manager Name *</Label>
                  <Input
                    id="edit-managerName"
                    name="managerName"
                    value={formData.managerName || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-managerId">Manager ID</Label>
                  <Input
                    id="edit-managerId"
                    name="managerId"
                    value={formData.managerId || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-employeeCount">Number of Employees</Label>
                  <Input
                    id="edit-employeeCount"
                    name="employeeCount"
                    type="number"
                    min="0"
                    value={formData.employeeCount || 0}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-parentDepartmentId">Parent Department</Label>
                  <select
                    id="edit-parentDepartmentId"
                    name="parentDepartmentId"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.parentDepartmentId || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      parentDepartmentId: e.target.value || null
                    }))}
                  >
                    <option value="">None (Top Level)</option>
                    {departments
                      .filter(dept => dept.id !== selectedDepartment?.id)
                      .map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateDepartment} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Updating...
                  </>
                ) : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Department</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the department "{selectedDepartment?.name}"?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteDepartment}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Deleting...
                  </>
                ) : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
