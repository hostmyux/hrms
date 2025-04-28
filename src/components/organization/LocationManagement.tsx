
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVoice } from '../../contexts/VoiceContext';
import { 
  getLocations, 
  createLocation, 
  updateLocation, 
  deleteLocation, 
  type Location 
} from '../../services/organizationService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Building,
  MapPin,
  Globe,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Users,
  Check,
  X 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const LocationManagement: React.FC = () => {
  const { toast } = useToast();
  const { speak } = useVoice();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Location>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    type: 'Branch Office',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    phone: '',
    email: '',
    employees: 0,
    isActive: true
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load locations on component mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);
        speak("Office locations loaded. You can view, add, edit, or delete office locations from this screen.");
      } catch (error) {
        toast({
          title: "Error loading locations",
          description: "Failed to load office locations. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, [speak, toast]);

  // Handle sort
  const handleSort = (field: keyof Location) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort locations
  const filteredAndSortedLocations = locations
    .filter(loc => 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.country.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'employees') {
        return sortDirection === 'asc' 
          ? a.employees - b.employees 
          : b.employees - a.employees;
      } else if (sortField === 'isActive') {
        return sortDirection === 'asc' 
          ? (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1) 
          : (a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1);
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
      type: 'Branch Office',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      phone: '',
      email: '',
      employees: 0,
      isActive: true
    });
    setIsAddDialogOpen(true);
    speak("Adding a new office location. Please fill in the location details.");
  };

  // Open edit dialog
  const handleOpenEditDialog = (location: Location) => {
    setSelectedLocation(location);
    setFormData({
      ...location,
      address: { ...location.address }
    });
    setIsEditDialogOpen(true);
    speak(`Editing ${location.name} location. You can update location details.`);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (location: Location) => {
    setSelectedLocation(location);
    setIsDeleteDialogOpen(true);
    speak(`Confirm deletion of ${location.name} location.`);
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'address') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address!,
            [child]: value
          }
        }));
      }
    } else if (name === 'employees') {
      setFormData(prev => ({
        ...prev,
        employees: parseInt(value) || 0
      }));
    } else if (name === 'isActive') {
      setFormData(prev => ({
        ...prev,
        isActive: value === 'true'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle location creation
  const handleCreateLocation = async () => {
    if (!formData.name || !formData.address?.city || !formData.address?.country) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const newLocation = await createLocation({
        name: formData.name || '',
        type: formData.type as 'Headquarters' | 'Branch Office' | 'Remote Hub' | 'Other',
        address: {
          street: formData.address?.street || '',
          city: formData.address?.city || '',
          state: formData.address?.state || '',
          zipCode: formData.address?.zipCode || '',
          country: formData.address?.country || ''
        },
        phone: formData.phone || '',
        email: formData.email || '',
        employees: formData.employees || 0,
        isActive: formData.isActive !== undefined ? formData.isActive : true
      });
      
      setLocations(prev => [...prev, newLocation]);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: `Location "${newLocation.name}" created successfully.`,
      });
      speak(`Location ${newLocation.name} created successfully.`);
    } catch (error) {
      toast({
        title: "Error creating location",
        description: "Failed to create location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle location update
  const handleUpdateLocation = async () => {
    if (!selectedLocation || !formData.name || !formData.address?.city || !formData.address?.country) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedLocation = await updateLocation(selectedLocation.id, {
        ...formData,
        address: { ...formData.address }
      } as Location);
      
      setLocations(prev => 
        prev.map(loc => loc.id === updatedLocation.id ? updatedLocation : loc)
      );
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: `Location "${updatedLocation.name}" updated successfully.`,
      });
      speak(`Location ${updatedLocation.name} updated successfully.`);
    } catch (error) {
      toast({
        title: "Error updating location",
        description: "Failed to update location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle location deletion
  const handleDeleteLocation = async () => {
    if (!selectedLocation) return;

    setIsSaving(true);
    try {
      await deleteLocation(selectedLocation.id);
      
      setLocations(prev => prev.filter(loc => loc.id !== selectedLocation.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: `Location "${selectedLocation.name}" deleted successfully.`,
      });
      speak(`Location ${selectedLocation.name} deleted successfully.`);
    } catch (error) {
      toast({
        title: "Error deleting location",
        description: "Failed to delete location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Format date display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
            <MapPin className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-medium">Office Locations</h3>
            <div className="ml-3 flex items-center bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
              {locations.length} total
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search locations..."
                className="w-full sm:w-[250px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleOpenAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </div>
        </div>

        {/* View mode tabs */}
        <Tabs defaultValue="grid" onValueChange={(value) => setViewMode(value as 'table' | 'grid')}>
          <div className="flex justify-end mb-2">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
          </div>

          {/* Grid view */}
          <TabsContent value="grid" className="mt-0">
            {filteredAndSortedLocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <MapPin size={48} strokeWidth={1.5} className="mb-2" />
                {searchQuery ? (
                  <p>No locations match your search criteria.</p>
                ) : (
                  <p>No office locations found. Add your first location.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedLocations.map((location) => (
                  <Card key={location.id}>
                    <CardContent className="p-0">
                      <div className={`p-4 flex items-start gap-3 ${location.isActive ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-300'}`}>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-base">{location.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded ${location.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {location.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{location.type}</p>
                          
                          <div className="mt-3 space-y-1">
                            <div className="flex items-center text-sm">
                              <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <span>{[location.address.city, location.address.country].filter(Boolean).join(', ')}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <span>{location.employees} employees</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenEditDialog(location)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive" 
                                onClick={() => handleOpenDeleteDialog(location)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="p-4 border-t">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="truncate">{location.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="truncate">{location.email || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Table view */}
          <TabsContent value="table" className="mt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer w-[200px]"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Location Name
                        {sortField === 'name' && (
                          sortDirection === 'asc' 
                            ? <ChevronUp className="ml-1 h-4 w-4" /> 
                            : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center">
                        Type
                        {sortField === 'type' && (
                          sortDirection === 'asc' 
                            ? <ChevronUp className="ml-1 h-4 w-4" /> 
                            : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('employees')}
                    >
                      <div className="flex items-center">
                        Employees
                        {sortField === 'employees' && (
                          sortDirection === 'asc' 
                            ? <ChevronUp className="ml-1 h-4 w-4" /> 
                            : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('isActive')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === 'isActive' && (
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
                  {filteredAndSortedLocations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <MapPin size={48} strokeWidth={1.5} className="mb-2" />
                          {searchQuery ? (
                            <p>No locations match your search criteria.</p>
                          ) : (
                            <p>No office locations found. Add your first location.</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedLocations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell className="font-medium">{location.name}</TableCell>
                        <TableCell>{location.type}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {[
                            location.address.street,
                            location.address.city,
                            location.address.state,
                            location.address.zipCode,
                            location.address.country
                          ].filter(Boolean).join(', ')}
                        </TableCell>
                        <TableCell>{location.employees}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${location.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {location.isActive ? (
                              <>
                                <Check className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenEditDialog(location)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenDeleteDialog(location)}
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
          </TabsContent>
        </Tabs>

        {/* Add Location Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>
                Create a new office location for your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Location Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Location Type *</Label>
                  <select
                    id="type"
                    name="type"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.type || 'Branch Office'}
                    onChange={handleChange}
                    required
                  >
                    <option value="Headquarters">Headquarters</option>
                    <option value="Branch Office">Branch Office</option>
                    <option value="Remote Hub">Remote Hub</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address.street">Street Address</Label>
                <Input
                  id="address.street"
                  name="address.street"
                  value={formData.address?.street || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address.city">City *</Label>
                  <Input
                    id="address.city"
                    name="address.city"
                    value={formData.address?.city || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.state">State / Province</Label>
                  <Input
                    id="address.state"
                    name="address.state"
                    value={formData.address?.state || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address.zipCode">Postal / Zip Code</Label>
                  <Input
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address?.zipCode || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.country">Country *</Label>
                  <Input
                    id="address.country"
                    name="address.country"
                    value={formData.address?.country || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Input
                    id="employees"
                    name="employees"
                    type="number"
                    min="0"
                    value={formData.employees || 0}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <select
                    id="isActive"
                    name="isActive"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.isActive === false ? 'false' : 'true'}
                    onChange={handleChange}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLocation} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Creating...
                  </>
                ) : "Create Location"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Location Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
              <DialogDescription>
                Update the details of this office location.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Location Name *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Location Type *</Label>
                  <select
                    id="edit-type"
                    name="type"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.type || 'Branch Office'}
                    onChange={handleChange}
                    required
                  >
                    <option value="Headquarters">Headquarters</option>
                    <option value="Branch Office">Branch Office</option>
                    <option value="Remote Hub">Remote Hub</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address.street">Street Address</Label>
                <Input
                  id="edit-address.street"
                  name="address.street"
                  value={formData.address?.street || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-address.city">City *</Label>
                  <Input
                    id="edit-address.city"
                    name="address.city"
                    value={formData.address?.city || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address.state">State / Province</Label>
                  <Input
                    id="edit-address.state"
                    name="address.state"
                    value={formData.address?.state || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-address.zipCode">Postal / Zip Code</Label>
                  <Input
                    id="edit-address.zipCode"
                    name="address.zipCode"
                    value={formData.address?.zipCode || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address.country">Country *</Label>
                  <Input
                    id="edit-address.country"
                    name="address.country"
                    value={formData.address?.country || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-employees">Number of Employees</Label>
                  <Input
                    id="edit-employees"
                    name="employees"
                    type="number"
                    min="0"
                    value={formData.employees || 0}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-isActive">Status</Label>
                  <select
                    id="edit-isActive"
                    name="isActive"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.isActive === false ? 'false' : 'true'}
                    onChange={handleChange}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateLocation} disabled={isSaving}>
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
              <AlertDialogTitle>Delete Location</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the location "{selectedLocation?.name}"?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteLocation}
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
