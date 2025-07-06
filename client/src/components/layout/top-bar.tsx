import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-hr-secondary">{title}</h2>
          <p className="text-hr-text-secondary mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          {actions || (
            <>
              <Button className="bg-hr-primary hover:bg-blue-700 text-white">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button className="bg-hr-accent hover:bg-orange-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
