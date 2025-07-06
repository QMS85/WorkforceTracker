import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AttendanceChart() {
  const [viewMode, setViewMode] = useState("daily");
  
  const { data: attendanceData } = useQuery({
    queryKey: ["/api/attendance"],
  });

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Present',
        data: [22, 23, 21, 22],
        backgroundColor: 'hsl(122, 41%, 57%)',
      },
      {
        label: 'Absent',
        data: [2, 1, 3, 2],
        backgroundColor: 'hsl(4, 87%, 60%)',
      },
      {
        label: 'Late',
        data: [3, 2, 4, 3],
        backgroundColor: 'hsl(36, 100%, 50%)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-hr-secondary">
            Time & Attendance
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("daily")}
              className={viewMode === "daily" ? "bg-hr-primary text-white" : ""}
            >
              Daily
            </Button>
            <Button
              variant={viewMode === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("weekly")}
              className={viewMode === "weekly" ? "bg-hr-primary text-white" : ""}
            >
              Weekly
            </Button>
            <Button
              variant={viewMode === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("monthly")}
              className={viewMode === "monthly" ? "bg-hr-primary text-white" : ""}
            >
              Monthly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
