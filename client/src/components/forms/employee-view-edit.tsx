
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, User, Mail, Building, Briefcase, DollarSign } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Employee, InsertEmployee } from "@shared/schema";

interface EmployeeViewEditProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EmployeeViewEdit({ employee, open, onOpenChange }: EmployeeViewEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<InsertEmployee>({
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    department: employee.department,
    position: employee.position,
    hourlyRate: employee.hourlyRate || "0",
    isActive: employee.isActive,
  });
  const { toast } = useToast();

  const updateEmployeeMutation = useMutation({
    mutationFn: async (data: Partial<InsertEmployee>) => {
      const response = await apiRequest("PUT", `/api/employees/${employee.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({
        title: "Employee Updated",
        description: "Employee information has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateEmployeeMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      hourlyRate: employee.hourlyRate || "0",
      isActive: employee.isActive,
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof InsertEmployee, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Employee Details
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={employee.isActive ? "default" : "destructive"}>
                {employee.isActive ? "Active" : "Inactive"}
              </Badge>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={updateEmployeeMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                First Name
              </Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{employee.firstName}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Last Name
              </Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{employee.lastName}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{employee.email}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="flex items-center">
                <Building className="mr-2 h-4 w-4" />
                Department
              </Label>
              {isEditing ? (
                <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{employee.department}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4" />
                Position
              </Label>
              {isEditing ? (
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">{employee.position}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate" className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Hourly Rate
              </Label>
              {isEditing ? (
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  {employee.hourlyRate ? `$${employee.hourlyRate}/hr` : 'N/A'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              {isEditing ? (
                <Select value={formData.isActive ? "true" : "false"} onValueChange={(value) => handleInputChange("isActive", value === "true")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-gray-50 rounded-md">
                  <Badge variant={employee.isActive ? "default" : "destructive"}>
                    {employee.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-gray-500">
              <p>Employee ID: {employee.id}</p>
              <p>Created: {new Date(employee.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
