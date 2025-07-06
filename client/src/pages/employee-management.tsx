import TopBar from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Filter, Eye, Edit, Trash2, Plus, Users, FileSpreadsheet } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import EmployeeForm from "@/components/forms/employee-form";
import EmployeeViewEdit from "@/components/forms/employee-view-edit";
import type { Employee } from "@shared/schema";

export default function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({
        title: "Employee Deleted",
        description: "Employee has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      });
    },
  });

  const exportToGoogleSheetsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/employees/export-google-sheets");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Export Successful",
        description: `Employee data exported to Google Sheets. ${data.recordCount} records exported.`,
      });
      if (data.spreadsheetUrl) {
        window.open(data.spreadsheetUrl, '_blank');
      }
    },
    onError: () => {
      toast({
        title: "Export Failed",
        description: "Failed to export employee data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredEmployees = employees?.filter(employee =>
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-hr-primary", "bg-hr-accent", "bg-hr-success", "bg-hr-secondary"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployeeMutation.mutate(id);
    }
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToGoogleSheetsMutation.mutateAsync();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <TopBar 
        title="Employee Management" 
        subtitle="Manage your workforce and employee information"
        actions={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isExporting || !employees?.length}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              {isExporting ? "Exporting..." : "Export to Sheets"}
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-hr-primary hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <EmployeeForm onSuccess={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      
      <div className="p-6">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-hr-secondary">
                All Employees
              </CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-hr-text-secondary" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-hr-text-secondary font-medium">Employee</TableHead>
                    <TableHead className="text-hr-text-secondary font-medium">Department</TableHead>
                    <TableHead className="text-hr-text-secondary font-medium">Position</TableHead>
                    <TableHead className="text-hr-text-secondary font-medium">Hourly Rate</TableHead>
                    <TableHead className="text-hr-text-secondary font-medium">Status</TableHead>
                    <TableHead className="text-hr-text-secondary font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={`${getAvatarColor(employee.firstName)} text-white text-sm font-medium`}>
                              {getInitials(employee.firstName, employee.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-hr-secondary">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-hr-text-secondary">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-hr-secondary">
                        {employee.department}
                      </TableCell>
                      <TableCell className="text-sm text-hr-secondary">
                        {employee.position}
                      </TableCell>
                      <TableCell className="text-sm text-hr-secondary">
                        {employee.hourlyRate ? `$${employee.hourlyRate}/hr` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={employee.isActive ? "default" : "destructive"}
                          className={employee.isActive ? "bg-green-100 text-green-800" : ""}
                        >
                          {employee.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-hr-primary hover:text-blue-700"
                            onClick={() => handleView(employee)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-hr-accent hover:text-orange-700"
                            onClick={() => handleView(employee)}
                            title="Edit Employee"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-hr-error hover:text-red-700"
                            onClick={() => handleDelete(employee.id)}
                            disabled={deleteEmployeeMutation.isPending}
                            title="Delete Employee"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {!isLoading && filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No employees found" : "No employees yet"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm 
                    ? "Try adjusting your search terms to find what you're looking for."
                    : "Add your first employee to get started with workforce management."
                  }
                </p>
                {!searchTerm && (
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-hr-primary hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Employee
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Employee</DialogTitle>
                      </DialogHeader>
                      <EmployeeForm onSuccess={() => setIsAddDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View/Edit Employee Dialog */}
      {selectedEmployee && (
        <EmployeeViewEdit
          employee={selectedEmployee}
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
        />
      )}
    </div>
  );
}
