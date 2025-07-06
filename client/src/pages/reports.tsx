import TopBar from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";

export default function Reports() {
  return (
    <div className="flex-1 overflow-auto">
      <TopBar 
        title="Reports" 
        subtitle="Generate and view detailed reports"
        actions={
          <Button className="bg-hr-primary hover:bg-blue-700 text-white">
            <Download className="mr-2 h-4 w-4" />
            Export All Reports
          </Button>
        }
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2 text-hr-primary" />
                Productivity Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-hr-text-secondary mb-4">
                Analyze employee productivity trends and performance metrics over time.
              </p>
              <Button className="w-full bg-hr-primary hover:bg-blue-700 text-white">
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-hr-success" />
                Attendance Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-hr-text-secondary mb-4">
                Track attendance patterns, tardiness, and absence rates by employee.
              </p>
              <Button className="w-full bg-hr-success hover:bg-green-600 text-white">
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2 text-hr-accent" />
                Time Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-hr-text-secondary mb-4">
                View total hours worked, overtime, and time allocation across departments.
              </p>
              <Button className="w-full bg-hr-accent hover:bg-orange-600 text-white">
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports generated yet</h3>
              <p className="text-gray-500">
                Generate your first report to see it appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
