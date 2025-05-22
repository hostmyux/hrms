import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PromotionDialogs } from './PromotionDialogs';
import { promotionCycles as initialPromotionCycles } from './demoData';
import { PromotionCycle, PromotionCandidate, PromotionStatus2 } from './types';

export const PromotionList = () => {
  const [promotionCycles, setPromotionCycles] = useState<PromotionCycle[]>(initialPromotionCycles);
  const [selectedCycle, setSelectedCycle] = useState<PromotionCycle>(promotionCycles[0]);
  const [selectedCandidate, setSelectedCandidate] = useState<PromotionCandidate | null>(null);
  const [dialogType, setDialogType] = useState<'view' | 'approve' | 'reject' | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<PromotionStatus2 | 'all'>('all');

  const filteredCandidates = selectedCycle?.candidates.filter(candidate => {
    const departmentMatch = filterDepartment === 'all' || candidate.currentDepartment === filterDepartment;
    const statusMatch = filterStatus === 'all' || candidate.status === filterStatus;
    return departmentMatch && statusMatch;
  }) || [];

  const handleViewDetails = (candidate: PromotionCandidate) => {
    setSelectedCandidate(candidate);
    setDialogType('view');
  };

  const handleApprove = (candidate: PromotionCandidate) => {
    setSelectedCandidate(candidate);
    setDialogType('approve');
  };

  const handleReject = (candidate: PromotionCandidate) => {
    setSelectedCandidate(candidate);
    setDialogType('reject');
  };

  const confirmAction = (action: 'approve' | 'reject', reason: string) => {
    if (!selectedCandidate) return;

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    const updatedCycles = promotionCycles.map(cycle => {
      if (cycle.id === selectedCycle.id) {
        return {
          ...cycle,
          candidates: cycle.candidates.map(candidate => {
            if (candidate.id === selectedCandidate.id) {
              return {
                ...candidate,
                status: newStatus as PromotionStatus2,
                notes: [...candidate.notes, { 
                  date: new Date().toISOString(), 
                  content: reason, 
                  author: "HR Manager"
                }]
              };
            }
            return candidate;
          })
        };
      }
      return cycle;
    });
    
    setPromotionCycles(updatedCycles);
    const updatedCycle = updatedCycles.find(c => c.id === selectedCycle.id);
    if (updatedCycle) {
      setSelectedCycle(updatedCycle);
    }
    
    setDialogType(null);
  };

  const getStatusBadge = (status: PromotionStatus2) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'in-review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800">In Review</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const calculatePromotionStats = () => {
    const total = selectedCycle?.candidates.length || 0;
    const pending = selectedCycle?.candidates.filter(c => c.status === 'pending').length || 0;
    const approved = selectedCycle?.candidates.filter(c => c.status === 'approved').length || 0;
    const rejected = selectedCycle?.candidates.filter(c => c.status === 'rejected').length || 0;
    const inReview = selectedCycle?.candidates.filter(c => c.status === 'in-review').length || 0;
    
    return { total, pending, approved, rejected, inReview };
  };

  const stats = calculatePromotionStats();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <Select 
            value={selectedCycle?.id.toString()} 
            onValueChange={(value) => {
              const cycle = promotionCycles.find(c => c.id.toString() === value);
              if (cycle) setSelectedCycle(cycle);
            }}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select promotion cycle" />
            </SelectTrigger>
            <SelectContent>
              {promotionCycles.map(cycle => (
                <SelectItem key={cycle.id} value={cycle.id.toString()}>
                  {cycle.name} ({new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filterStatus} 
            onValueChange={(value) => setFilterStatus(value as PromotionStatus2 | 'all')}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">Export</Button>
        </div>
      </div>
      
      {selectedCycle && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.inReview}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              </CardContent>
            </Card>
          </div>
        
          <Card>
            <CardHeader>
              <CardTitle>{selectedCycle.name}</CardTitle>
              <CardDescription>
                {new Date(selectedCycle.startDate).toLocaleDateString()} - {new Date(selectedCycle.endDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Current Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Proposed Position</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.currentPosition}</TableCell>
                      <TableCell>{candidate.currentDepartment}</TableCell>
                      <TableCell>{candidate.proposedPosition}</TableCell>
                      <TableCell>{candidate.manager}</TableCell>
                      <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(candidate)}
                          >
                            View
                          </Button>
                          {['pending', 'in-review'].includes(candidate.status) && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600"
                                onClick={() => handleApprove(candidate)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() => handleReject(candidate)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
      
      <PromotionDialogs
        dialogType={dialogType}
        candidate={selectedCandidate}
        onClose={() => {
          setDialogType(null);
          setSelectedCandidate(null);
        }}
        onApprove={(reason) => confirmAction('approve', reason)}
        onReject={(reason) => confirmAction('reject', reason)}
      />
    </div>
  );
};
