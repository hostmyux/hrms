
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Edit, Save, Trash2 } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { toast } from 'sonner';

interface SalaryComponent {
  id: number;
  name: string;
  type: "earning" | "deduction";
  default: string;
  taxable: boolean;
}

export const SalaryStructure: React.FC = () => {
  const { speak } = useVoice();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [components, setComponents] = useState<SalaryComponent[]>([
    {
      id: 1,
      name: "Basic Salary",
      type: "earning",
      default: "60% of CTC",
      taxable: true
    },
    {
      id: 2,
      name: "House Rent Allowance",
      type: "earning",
      default: "15% of Basic",
      taxable: true
    },
    {
      id: 3,
      name: "Medical Allowance",
      type: "earning",
      default: "5% of Basic",
      taxable: false
    },
    {
      id: 4,
      name: "Provident Fund",
      type: "deduction",
      default: "12% of Basic",
      taxable: false
    },
    {
      id: 5,
      name: "Professional Tax",
      type: "deduction",
      default: "Fixed Amount",
      taxable: false
    },
  ]);
  
  const [editForm, setEditForm] = useState({
    name: "",
    type: "earning" as "earning" | "deduction",
    default: "",
    taxable: false
  });

  const handleEdit = (component: SalaryComponent) => {
    setEditingId(component.id);
    setEditForm({
      name: component.name,
      type: component.type,
      default: component.default,
      taxable: component.taxable
    });
    speak(`Editing ${component.name} component settings`);
  };

  const handleSave = (id: number) => {
    setComponents(components.map(component => 
      component.id === id ? { ...component, ...editForm } : component
    ));
    setEditingId(null);
    toast.success("Salary component updated successfully");
    speak("Salary component has been updated successfully");
  };

  const handleDelete = (id: number, name: string) => {
    setComponents(components.filter(component => component.id !== id));
    toast.success(`${name} has been removed`);
    speak(`${name} component has been removed from the salary structure`);
  };

  const handleAddNew = () => {
    const newComponent: SalaryComponent = {
      id: Math.max(0, ...components.map(c => c.id)) + 1,
      name: "New Component",
      type: "earning",
      default: "% of Basic",
      taxable: false
    };
    
    setComponents([...components, newComponent]);
    setEditingId(newComponent.id);
    setEditForm({
      name: newComponent.name,
      type: newComponent.type,
      default: newComponent.default,
      taxable: newComponent.taxable
    });
    
    speak("Created a new salary component. Please define its properties.");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Salary Structure</CardTitle>
          <CardDescription>
            Define earnings and deductions that make up employee compensation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Default Value</TableHead>
                <TableHead>Taxable</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((component) => (
                <TableRow key={component.id}>
                  <TableCell>
                    {editingId === component.id ? (
                      <Input 
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    ) : (
                      component.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === component.id ? (
                      <select 
                        className="border rounded px-2 py-1 w-full"
                        value={editForm.type}
                        onChange={(e) => setEditForm({...editForm, type: e.target.value as "earning" | "deduction"})}
                      >
                        <option value="earning">Earning</option>
                        <option value="deduction">Deduction</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        component.type === "earning" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {component.type === "earning" ? "Earning" : "Deduction"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === component.id ? (
                      <Input 
                        value={editForm.default}
                        onChange={(e) => setEditForm({...editForm, default: e.target.value})}
                      />
                    ) : (
                      component.default
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === component.id ? (
                      <input 
                        type="checkbox" 
                        checked={editForm.taxable}
                        onChange={(e) => setEditForm({...editForm, taxable: e.target.checked})}
                        className="rounded border-gray-300"
                      />
                    ) : (
                      component.taxable ? "Yes" : "No"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingId === component.id ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSave(component.id)}
                        >
                          <Save size={16} />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(component)}
                        >
                          <Edit size={16} />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(component.id, component.name)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Note: Changes to the salary structure will affect future payroll calculations.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
