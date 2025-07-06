import TopBar from "@/components/layout/top-bar";
import StatsCards from "@/components/dashboard/stats-cards";
import ProductivityChart from "@/components/dashboard/productivity-chart";
import AttendanceChart from "@/components/dashboard/attendance-chart";
import EmployeeTable from "@/components/dashboard/employee-table";
import { Button } from "@/components/ui/button";
import { Clock, CalendarPlus } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-auto">
      <TopBar 
        title="Productivity Dashboard" 
        subtitle="Track employee time and attendance"
      />
      
      <div className="p-6">
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ProductivityChart />
          <AttendanceChart />
        </div>
        
        <EmployeeTable />
        
        {/* Quick Actions */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-4">
          <Button
            className="w-14 h-14 bg-hr-primary rounded-full shadow-lg hover:bg-blue-700 p-0"
            title="Quick Clock In/Out"
          >
            <Clock className="h-6 w-6 text-white" />
          </Button>
          <Button
            className="w-14 h-14 bg-hr-accent rounded-full shadow-lg hover:bg-orange-600 p-0"
            title="Schedule Meeting"
          >
            <CalendarPlus className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
