import TopBar from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Square } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Employee, TimeEntry } from "@shared/schema";

export default function TimeTracking() {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const { data: timeEntries } = useQuery<TimeEntry[]>({
    queryKey: ["/api/time-entries"],
  });

  const clockInMutation = useMutation({
    mutationFn: async (employeeId: number) => {
      const response = await apiRequest("POST", "/api/time-entries", {
        employeeId,
        clockIn: new Date().toISOString(),
        status: "active",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
      toast({
        title: "Clocked In",
        description: "Employee has been clocked in successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clock in. Please try again.",
        variant: "destructive",
      });
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: async (entryId: number) => {
      const response = await apiRequest("PUT", `/api/time-entries/${entryId}/clock-out`, {
        clockOut: new Date().toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
      toast({
        title: "Clocked Out",
        description: "Employee has been clocked out successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clock out. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getActiveEntry = (employeeId: number) => {
    return timeEntries?.find(entry => 
      entry.employeeId === employeeId && entry.status === "active"
    );
  };

  const handleClockAction = (employee: Employee) => {
    const activeEntry = getActiveEntry(employee.id);
    
    if (activeEntry) {
      clockOutMutation.mutate(activeEntry.id);
    } else {
      clockInMutation.mutate(employee.id);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <TopBar 
        title="Time Tracking" 
        subtitle="Clock in/out and track working hours"
        actions={
          <Button className="bg-hr-primary hover:bg-blue-700 text-white">
            <Clock className="mr-2 h-4 w-4" />
            View Time Reports
          </Button>
        }
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees?.map((employee) => {
            const activeEntry = getActiveEntry(employee.id);
            const isActive = !!activeEntry;
            
            return (
              <Card key={employee.id} className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-medium text-hr-secondary">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-sm text-hr-text-secondary">
                        {employee.department}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isActive && activeEntry && (
                      <div className="text-center">
                        <p className="text-sm text-hr-text-secondary mb-2">Clocked in at:</p>
                        <p className="text-lg font-medium text-hr-secondary">
                          {new Date(activeEntry.clockIn).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                    
                    <Button
                      onClick={() => handleClockAction(employee)}
                      disabled={clockInMutation.isPending || clockOutMutation.isPending}
                      className={`w-full ${isActive 
                        ? 'bg-hr-error hover:bg-red-600' 
                        : 'bg-hr-success hover:bg-green-600'
                      } text-white`}
                    >
                      {isActive ? (
                        <>
                          <Square className="mr-2 h-4 w-4" />
                          Clock Out
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Clock In
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {!employees?.length && (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-500">
                Add employees to start tracking their time and attendance.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
