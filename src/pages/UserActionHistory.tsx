
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Search, Filter, Trash, History, Settings } from 'lucide-react';

const UserActionHistory: React.FC = () => {
  const { actions, clearActions } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [actionTypeFilter, setActionTypeFilter] = useState('all');
  
  const uniqueModules = ['all', ...Array.from(new Set(actions.map(action => action.module)))];
  const uniqueActionTypes = ['all', ...Array.from(new Set(actions.map(action => action.type)))];
  
  const filteredActions = actions.filter(action => {
    const matchesSearch = action.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'all' || action.module === moduleFilter;
    const matchesType = actionTypeFilter === 'all' || action.type === actionTypeFilter;
    
    return matchesSearch && matchesModule && matchesType;
  });
  
  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'view': return 'bg-gray-100 text-gray-800';
      case 'navigation': return 'bg-purple-100 text-purple-800';
      case 'export': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Activity History</h1>
          <p className="text-muted-foreground">
            View a log of your recent activities and actions in the HRMS
          </p>
        </div>
        
        <Button variant="destructive" size="sm" onClick={clearActions} className="flex items-center gap-2">
          <Trash size={16} />
          <span>Clear History</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search activities..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <SelectValue placeholder="Filter by module" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {uniqueModules.map((module) => (
                    <SelectItem key={module} value={module}>
                      {module === 'all' ? 'All Modules' : module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <History size={16} />
                    <SelectValue placeholder="Filter by action" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {uniqueActionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Actions' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredActions.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell className="font-medium">
                        {formatDistanceToNow(new Date(action.timestamp), { addSuffix: true })}
                      </TableCell>
                      <TableCell>{action.description}</TableCell>
                      <TableCell>{action.module}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className={getActionTypeColor(action.type)}>
                          {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <History className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No activity found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || moduleFilter !== 'all' || actionTypeFilter !== 'all'
                  ? 'Try adjusting your filters to see more results'
                  : 'Your activity history will appear here as you use the application'}
              </p>
              {(searchTerm || moduleFilter !== 'all' || actionTypeFilter !== 'all') && (
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setModuleFilter('all');
                  setActionTypeFilter('all');
                }}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings size={16} />
              <span>Manage Preferences</span>
            </Button>
          </div>
          <p className="text-center text-muted-foreground py-4">
            Coming soon: Customize your HRMS experience with personalized settings and preferences
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActionHistory;
