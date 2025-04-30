
import React from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { Button } from '../ui/button';
import { User, Mail, Phone, Building, Edit, Trash } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'active' | 'on-leave' | 'terminated';
}

interface EmployeeTableProps {
  employees: Employee[];
  title?: string;
  voiceDescription?: string;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, title = "Recent Employees", voiceDescription }) => {
  const { speak } = useVoice();

  React.useEffect(() => {
    if (voiceDescription) {
      // Register voice description when component mounts
    }
  }, [voiceDescription, speak]);

  const handleRowClick = (employee: Employee) => {
    speak(`Employee ${employee.name}, ${employee.position} in ${employee.department}. Email: ${employee.email}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on-leave':
        return 'bg-amber-100 text-amber-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">Manage your employees</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {employees.map((employee) => (
              <tr 
                key={employee.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => handleRowClick(employee)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-hrms-primary/10 flex items-center justify-center text-hrms-primary">
                      <User size={16} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">{employee.position}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Mail className="w-3 h-3 mr-1" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Phone className="w-3 h-3 mr-1" />
                      <span>{employee.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-foreground">
                    <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                    {employee.department}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(employee.status)}`}>
                    {formatStatus(employee.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(`Edit ${employee.name}'s profile`);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(`Delete ${employee.name} from employee records`);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
