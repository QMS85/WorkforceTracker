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
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Employee } from "@shared/schema";

export default function EmployeeTable() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
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

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-hr-secondary">
            Employee Overview
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
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-hr-text-secondary font-medium">Employee</TableHead>
              <TableHead className="text-hr-text-secondary font-medium">Department</TableHead>
              <TableHead className="text-hr-text-secondary font-medium">Status</TableHead>
              <TableHead className="text-hr-text-secondary font-medium">Hours Today</TableHead>
              <TableHead className="text-hr-text-secondary font-medium">Hours This Week</TableHead>
              <TableHead className="text-hr-text-secondary font-medium">Attendance Rate</TableHead>
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
                <TableCell>
                  <Badge 
                    variant={employee.isActive ? "default" : "destructive"}
                    className={employee.isActive ? "bg-green-100 text-green-800" : ""}
                  >
                    {employee.isActive ? "Present" : "Absent"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-hr-secondary">
                  {employee.isActive ? "7.5 hrs" : "0 hrs"}
                </TableCell>
                <TableCell className="text-sm text-hr-secondary">
                  {employee.isActive ? "42.5 hrs" : "32.5 hrs"}
                </TableCell>
                <TableCell className="text-sm text-hr-secondary">
                  {employee.isActive ? "95%" : "78%"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-hr-primary hover:text-blue-700">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-hr-accent hover:text-orange-700">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-hr-error hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-hr-text-secondary">
              Showing 1 to {filteredEmployees.length} of {employees?.length || 0} entries
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button size="sm" className="bg-hr-primary text-white">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
