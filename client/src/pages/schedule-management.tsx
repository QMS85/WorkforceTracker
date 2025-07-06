
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TopBar from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Download, Clock, User, FileSpreadsheet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Schedule, Employee } from "@shared/schema";

export default function ScheduleManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isExporting, setIsExporting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: schedules, isLoading: schedulesLoading } = useQuery<Schedule[]>({
    queryKey: ["/api/schedules"],
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (scheduleData: any) => {
      const response = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData),
      });
      if (!response.ok) throw new Error("Failed to create schedule");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      toast({
        title: "Schedule Created",
        description: "The schedule has been successfully created.",
      });
      setIsAddDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create schedule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const exportToGoogleSheets = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/schedules/export-google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          startDate: selectedDate.toISOString(),
          endDate: new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }),
      });
      
      if (!response.ok) throw new Error("Failed to export to Google Sheets");
      
      const result = await response.json();
      toast({
        title: "Export Successful",
        description: `Schedule exported to Google Sheets: ${result.spreadsheetUrl}`,
      });
      
      // Open the Google Sheets URL in a new tab
      window.open(result.spreadsheetUrl, '_blank');
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export to Google Sheets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employees?.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown";
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const todaySchedules = schedules?.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    return scheduleDate.toDateString() === selectedDate.toDateString();
  }) || [];

  return (
    <div className="flex-1 overflow-auto">
      <TopBar 
        title="Schedule Management" 
        subtitle="Manage employee schedules and shifts"
        actions={
          <div className="flex gap-2">
            <Button
              onClick={exportToGoogleSheets}
              disabled={isExporting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export to Sheets
                </>
              )}
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-hr-primary hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Schedule</DialogTitle>
                </DialogHeader>
                <ScheduleForm 
                  employees={employees || []} 
                  onSubmit={createScheduleMutation.mutate}
                  isLoading={createScheduleMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="h-6 w-6 text-hr-primary" />
            <h3 className="text-lg font-semibold text-hr-secondary">
              Schedule for {selectedDate.toLocaleDateString()}
            </h3>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
            >
              Previous Day
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
            >
              Next Day
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todaySchedules.length > 0 ? (
            todaySchedules.map((schedule) => (
              <Card key={schedule.id} className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-hr-primary" />
                      {getEmployeeName(schedule.employeeId)}
                    </div>
                    {schedule.isRecurring && (
                      <Badge variant="secondary" className="text-xs">
                        Recurring
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm text-hr-text-secondary mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                  </div>
                  {schedule.notes && (
                    <p className="text-sm text-hr-text-secondary">
                      {schedule.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No schedules for this date
                  </h3>
                  <p className="text-gray-500">
                    There are no scheduled shifts for {selectedDate.toLocaleDateString()}.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ScheduleFormProps {
  employees: Employee[];
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

function ScheduleForm({ employees, onSubmit, isLoading }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split('T')[0],
    startTime: "09:00",
    endTime: "17:00",
    notes: "",
    isRecurring: false,
    recurringPattern: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.employeeId || !formData.date || !formData.startTime || !formData.endTime) {
      return;
    }
    
    // Create proper date object
    const dateObj = new Date(formData.date + 'T00:00:00.000Z');
    
    onSubmit({
      ...formData,
      employeeId: parseInt(formData.employeeId),
      date: dateObj.toISOString(),
      isRecurring: formData.isRecurring,
      recurringPattern: formData.isRecurring && formData.recurringPattern ? formData.recurringPattern : null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employeeId">Employee</Label>
          <Select value={formData.employeeId} onValueChange={(value) => setFormData({...formData, employeeId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.firstName} {employee.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          placeholder="Any additional notes about this schedule..."
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isRecurring"
          checked={formData.isRecurring}
          onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
        />
        <Label htmlFor="isRecurring">Recurring Schedule</Label>
      </div>

      {formData.isRecurring && (
        <div>
          <Label htmlFor="recurringPattern">Recurring Pattern</Label>
          <Select value={formData.recurringPattern} onValueChange={(value) => setFormData({...formData, recurringPattern: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select pattern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full bg-hr-primary hover:bg-blue-700 text-white">
        {isLoading ? "Creating..." : "Create Schedule"}
      </Button>
    </form>
  );
}
