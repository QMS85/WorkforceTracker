import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Schedule, Employee } from "@shared/schema";

export default function ScheduleGrid() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { data: schedules } = useQuery<Schedule[]>({
    queryKey: ["/api/schedules"],
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

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
    <div className="space-y-6">
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
  );
}
