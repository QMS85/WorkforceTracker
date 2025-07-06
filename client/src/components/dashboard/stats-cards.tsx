import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, Clock, HourglassIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface StatsData {
  totalEmployees: number;
  presentToday: number;
  avgHours: number;
  overtimeHours: number;
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ["/api/analytics/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const attendanceRate = stats.totalEmployees > 0 
    ? Math.round((stats.presentToday / stats.totalEmployees) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-hr-text-secondary text-sm font-medium">Total Employees</p>
              <p className="text-2xl font-bold text-hr-secondary mt-1">{stats.totalEmployees}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-hr-primary h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-hr-success text-sm font-medium">+2.5%</span>
            <span className="text-hr-text-secondary text-sm ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-hr-text-secondary text-sm font-medium">Present Today</p>
              <p className="text-2xl font-bold text-hr-secondary mt-1">{stats.presentToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-hr-success h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-hr-success text-sm font-medium">{attendanceRate}%</span>
            <span className="text-hr-text-secondary text-sm ml-2">attendance rate</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-hr-text-secondary text-sm font-medium">Avg Hours/Day</p>
              <p className="text-2xl font-bold text-hr-secondary mt-1">{stats.avgHours}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="text-hr-accent h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-hr-text-secondary text-sm font-medium">Target: 8.0 hours</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-hr-text-secondary text-sm font-medium">Overtime Hours</p>
              <p className="text-2xl font-bold text-hr-secondary mt-1">{stats.overtimeHours}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <HourglassIcon className="text-hr-warning h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-hr-warning text-sm font-medium">This week</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
