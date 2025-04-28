
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVoice } from '../../contexts/VoiceContext';
import { 
  getDesignations, 
  createDesignation, 
  updateDesignation, 
  deleteDesignation, 
  type Designation 
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
  Briefcase,
  ChevronDown,
  ChevronUp,
  X,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const DesignationManagement: React.FC = () => {
  const { toast } = useToast();
  const { speak } = useVoice();
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Designation>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [formData, setFormData] = useState<Partial<Designation>>({
    title: '',
    department: '',
    description: '',
    responsibilities: [],
    minSalary: 0,
    maxSalary: 0
  });
  const [newResponsibility, setNewResponsibility] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load designations on component mount
  useEffect(() => {
    const loadDesignations = async () => {
      try {
        const data = await getDesignations();
        setDesignations(data);
        speak("Job titles and designations loaded. You can view, add, edit, or delete job positions from this screen.");
      } catch (error) {
        toast({
          title: "Error loading designations",
          description: "Failed to load job titles. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDesignations();
  }, [speak, toast]);

  // Handle sort
  const handleSort = (field: keyof Designation) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort designations
  const filteredAndSortedDesignations = designations
    .filter(desig => 
      desig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desig.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desig.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'minSalary' || sortField === 'maxSalary') {
        return sortDirection === 'asc' 
          ? a[sortField] - b[sortField] 
          : b[sortField] - a[sortField];
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
      title: '',
      department: '',
      description: '',
      responsibilities: [],
      minSalary: 0,
      maxSalary: 0
    });
    setIsAddDialogOpen(true);
    speak("Adding a new job title. Please fill in the position details.");
  };

  // Open edit dialog
  const handleOpenEditDialog = (designation: Designation) => {
    setSelectedDesignation(designation);
    setFormData(designation);
    setIsEditDialogOpen(true);
    speak(`Editing ${designation.title} position. You can update job details.`);
  };

  // Open view dialog
  const handleOpenViewDialog = (designation: Designation) => {
    setSelectedDesignation(designation);
    setIsViewDialogOpen(true);
    speak(`Viewing details for ${designation.title} position.`);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (designation: Designation) => {
    setSelectedDesignation(designation);
    setIsDeleteDialogOpen(true);
    speak(`Confirm deletion of ${designation.title} position.`);
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'minSalary' || name === 'maxSalary' ? parseInt(value) || 0 : value
    }));
  };

  // Handle adding a responsibility
  const handleAddResponsibility = () => {
    if (!newResponsibility.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      responsibilities: [...(prev.responsibilities || []), newResponsibility.trim()]
    }));
    setNewResponsibility('');
  };

  // Handle removing a responsibility
  const handleRemoveResponsibility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities?.filter((_, i) => i !== index) || []
    }));
  };

  // Handle designation creation
  const handleCreateDesignation = async () => {
    if (!formData.title || !formData.department) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.minSalary && formData.maxSalary && formData.minSalary > formData.maxSalary) {
      toast({
        title: "Invalid salary range",
        description: "Minimum salary cannot be greater than maximum salary.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const newDesignation = await createDesignation({
        title: formData.title || '',
        department: formData.department || '',
        description: formData.description || '',
        responsibilities: formData.responsibilities || [],
        minSalary: formData.minSalary || 0,
        maxSalary: formData.maxSalary || 0
      });
      
      setDesignations(prev => [...prev, newDesignation]);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: `Job title "${newDesignation.title}" created successfully.`,
      });
      speak(`Job title ${newDesignation.title} created successfully.`);
    } catch (error) {
      toast({
        title: "Error creating job title",
        description: "Failed to create job title. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle designation update
  const handleUpdateDesignation = async () => {
    if (!selectedDesignation || !formData.title || !formData.department) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.minSalary && formData.maxSalary && formData.minSalary > formData.maxSalary) {
      toast({
        title: "Invalid salary range",
        description: "Minimum salary cannot be greater than maximum salary.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedDesignation = await updateDesignation(selectedDesignation.id, formData);
      
      setDesignations(prev => 
        prev.map(desig => desig.id === updatedDesignation.id ? updatedDesignation : desig)
      );
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: `Job title "${updatedDesignation.title}" updated successfully.`,
      });
      speak(`Job title ${updatedDesignation.title} updated successfully.`);
    } catch (error) {
      toast({
        title: "Error updating job title",
        description: "Failed to update job title. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle designation deletion
  const handleDeleteDesignation = async () => {
    if (!selectedDesignation) return;

    setIsSaving(true);
    try {
      await deleteDesignation(selectedDesignation.id);
      
      setDesignations(prev => prev.filter(desig => desig.id !== selectedDesignation.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: `Job title "${selectedDesignation.title}" deleted successfully.`,
      });
      speak(`Job title ${selectedDesignation.title} deleted successfully.`);
    } catch (error) {
      toast({
        title: "Error deleting job title",
        description: "Failed to delete job title. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Format salary display
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
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
            <Briefcase className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-medium">Job Titles & Designations</h3>
            <div className="ml-3 flex items-center bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
              {designations.length} total
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search job titles..."
                className="w-full sm:w-[250px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleOpenAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Job Title
            </Button>
          </div>
        </div>

        {/* Designations table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Job Title
                    {sortField === 'title' && (
                      sortDirection === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center">
                    Department
                    {sortField === 'department' && (
                      sortDirection === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('minSalary')}
                >
                  <div className="flex items-center">
                    Salary Range
                    {(sortField === 'minSalary' || sortField === 'maxSalary') && (
                      sortDirection === 'asc' 
                        ? <ChevronUp className="ml-1 h-4 w-4" /> 
                        : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedDesignations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Briefcase size={48} strokeWidth={1.5} className="mb-2" />
                      {searchQuery ? (
                        <p>No job titles match your search criteria.</p>
                      ) : (
                        <p>No job titles found. Create your first job title.</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedDesignations.map((designation) => (
                  <TableRow key={designation.id}>
                    <TableCell className="font-medium">{designation.title}</TableCell>
                    <TableCell>{designation.department}</TableCell>
                    <TableCell className="max-w-xs truncate">{designation.description}</TableCell>
                    <TableCell>
                      {formatSalary(designation.minSalary)} - {formatSalary(designation.maxSalary)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenViewDialog(designation)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(designation)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive" 
                            onClick={() => handleOpenDeleteDialog(designation)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Designation Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Job Title</DialogTitle>
              <DialogDescription>
                Create a new job title or position in your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={2}
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minSalary">Minimum Salary</Label>
                  <Input
                    id="minSalary"
                    name="minSalary"
                    type="number"
                    min="0"
                    value={formData.minSalary || 0}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSalary">Maximum Salary</Label>
                  <Input
                    id="maxSalary"
                    name="maxSalary"
                    type="number"
                    min="0"
                    value={formData.maxSalary || 0}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Responsibilities</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="Add a responsibility"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddResponsibility();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddResponsibility}
                    disabled={!newResponsibility.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.responsibilities?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No responsibilities added yet.</p>
                  ) : (
                    formData.responsibilities?.map((responsibility, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between bg-muted p-2 rounded-md"
                      >
                        <span className="text-sm">{responsibility}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveResponsibility(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDesignation} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Creating...
                  </>
                ) : "Create Job Title"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Designation Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Job Title</DialogTitle>
              <DialogDescription>
                Update the details of this job title.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Job Title *</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department *</Label>
                  <Input
                    id="edit-department"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  rows={2}
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-minSalary">Minimum Salary</Label>
                  <Input
                    id="edit-minSalary"
                    name="minSalary"
                    type="number"
                    min="0"
                    value={formData.minSalary || 0}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maxSalary">Maximum Salary</Label>
                  <Input
                    id="edit-maxSalary"
                    name="maxSalary"
                    type="number"
                    min="0"
                    value={formData.maxSalary || 0}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Responsibilities</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="Add a responsibility"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddResponsibility();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddResponsibility}
                    disabled={!newResponsibility.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.responsibilities?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No responsibilities added yet.</p>
                  ) : (
                    formData.responsibilities?.map((responsibility, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between bg-muted p-2 rounded-md"
                      >
                        <span className="text-sm">{responsibility}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveResponsibility(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateDesignation} disabled={isSaving}>
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

        {/* View Designation Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedDesignation?.title}</DialogTitle>
              <DialogDescription>
                Job title details and responsibilities.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Department</h4>
                  <p className="text-sm text-muted-foreground">{selectedDesignation?.department}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Salary Range</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedDesignation && (
                      `${formatSalary(selectedDesignation.minSalary)} - ${formatSalary(selectedDesignation.maxSalary)}`
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDesignation?.description || "No description provided."}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Responsibilities</h4>
                {selectedDesignation?.responsibilities?.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-1">No responsibilities defined.</p>
                ) : (
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                    {selectedDesignation?.responsibilities?.map((responsibility, index) => (
                      <li key={index}>{responsibility}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium">Created On</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDesignation?.createdAt ? new Date(selectedDesignation.createdAt).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                if (selectedDesignation) handleOpenEditDialog(selectedDesignation);
              }}>
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Job Title</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the job title "{selectedDesignation?.title}"?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteDesignation}
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
