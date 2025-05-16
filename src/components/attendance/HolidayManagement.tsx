
import React, { useState } from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Holiday {
  id: number;
  name: string;
  date: string;
  type: 'public' | 'optional' | 'company';
  applicable: 'all' | 'region';
  region?: string;
  description?: string;
}

interface HolidayFormValues {
  name: string;
  date: string;
  type: 'public' | 'optional' | 'company';
  applicable: 'all' | 'region';
  region?: string;
  description?: string;
}

export const HolidayManagement: React.FC = () => {
  const { speak } = useVoice();
  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: 1,
      name: "New Year's Day",
      date: "2025-01-01",
      type: "public",
      applicable: "all",
      description: "First day of the calendar year"
    },
    {
      id: 2,
      name: "Memorial Day",
      date: "2025-05-26",
      type: "public",
      applicable: "region",
      region: "United States",
      description: "Federal holiday honoring military personnel who died in service"
    },
    {
      id: 3,
      name: "Independence Day",
      date: "2025-07-04",
      type: "public",
      applicable: "region",
      region: "United States",
      description: "United States Independence Day"
    },
    {
      id: 4,
      name: "Labor Day",
      date: "2025-09-01",
      type: "public",
      applicable: "region",
      region: "United States",
      description: "Federal holiday honoring the American labor movement"
    },
    {
      id: 5,
      name: "Thanksgiving Day",
      date: "2025-11-27",
      type: "public",
      applicable: "region",
      region: "United States",
      description: "Day of giving thanks"
    },
    {
      id: 6,
      name: "Christmas Day",
      date: "2025-12-25",
      type: "public",
      applicable: "all",
      description: "Christmas holiday"
    },
    {
      id: 7,
      name: "Company Foundation Day",
      date: "2025-08-15",
      type: "company",
      applicable: "all",
      description: "Celebrating the company's founding anniversary"
    }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  
  const form = useForm<HolidayFormValues>({
    defaultValues: {
      name: '',
      date: '',
      type: 'public',
      applicable: 'all',
      region: '',
      description: ''
    }
  });
  
  const handleAddHoliday = () => {
    setEditingHoliday(null);
    form.reset({
      name: '',
      date: '',
      type: 'public',
      applicable: 'all',
      region: '',
      description: ''
    });
    setIsAddOpen(true);
    speak("Creating a new holiday record. Please enter the holiday name, date, type, and other relevant information.");
  };
  
  const handleEditHoliday = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    form.reset({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type,
      applicable: holiday.applicable,
      region: holiday.region || '',
      description: holiday.description || ''
    });
    setIsAddOpen(true);
    speak(`Editing holiday record for ${holiday.name}. Update the details as needed.`);
  };
  
  const handleDeleteHoliday = (id: number, name: string) => {
    setHolidays(holidays.filter(holiday => holiday.id !== id));
    toast.success(`${name} has been removed from the holiday calendar`);
    speak(`${name} has been removed from the holiday calendar.`);
  };
  
  const onSubmit = (data: HolidayFormValues) => {
    if (editingHoliday) {
      // Update existing holiday
      setHolidays(holidays.map(holiday => 
        holiday.id === editingHoliday.id ? { ...data, id: holiday.id } : holiday
      ));
      toast.success(`${data.name} has been updated in the holiday calendar`);
      speak(`${data.name} has been successfully updated in the holiday calendar.`);
    } else {
      // Add new holiday
      const newHoliday: Holiday = {
        id: holidays.length + 1,
        ...data
      };
      setHolidays([...holidays, newHoliday]);
      toast.success(`${data.name} has been added to the holiday calendar`);
      speak(`${data.name} has been successfully added to the holiday calendar.`);
    }
    
    setIsAddOpen(false);
  };
  
  const getHolidayTypeBadge = (type: Holiday['type']) => {
    switch (type) {
      case "public":
        return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Public</Badge>;
      case "optional":
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 hover:bg-purple-50">Optional</Badge>;
      case "company":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Company</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Holiday Calendar</h2>
          <p className="text-sm text-muted-foreground">
            Manage company holidays and observances
          </p>
        </div>
        <Button onClick={handleAddHoliday}>
          <Plus className="mr-2 h-4 w-4" />
          Add Holiday
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Holiday List</CardTitle>
          <CardDescription>
            View and manage holidays for the current year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Holiday Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Applicable To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((holiday) => (
                <TableRow key={holiday.id}>
                  <TableCell className="font-medium">{holiday.name}</TableCell>
                  <TableCell>{new Date(holiday.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getHolidayTypeBadge(holiday.type)}</TableCell>
                  <TableCell>
                    {holiday.applicable === 'all' 
                      ? 'All Regions' 
                      : holiday.region ? holiday.region : 'Selected Regions'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditHoliday(holiday)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteHoliday(holiday.id, holiday.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Holiday Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingHoliday ? 'Edit Holiday' : 'Add Holiday'}</DialogTitle>
            <DialogDescription>
              {editingHoliday 
                ? 'Update holiday details in the company calendar' 
                : 'Add a new holiday to the company calendar'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Holiday name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Holiday Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Christmas Day, Independence Day" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Holiday Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public Holiday</SelectItem>
                          <SelectItem value="optional">Optional Holiday</SelectItem>
                          <SelectItem value="company">Company Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="applicable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applicable To</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select applicability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          <SelectItem value="region">Specific Region</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {form.watch('applicable') === 'region' && (
                <FormField
                  control={form.control}
                  name="region"
                  rules={{ required: "Region is required when applicable to specific region" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This holiday will only be applicable in the selected region
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of this holiday" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingHoliday ? 'Save Changes' : 'Add Holiday'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
