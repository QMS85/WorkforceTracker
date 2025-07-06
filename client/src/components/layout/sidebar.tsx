import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Settings,
  User
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Schedule Management", href: "/schedule", icon: Calendar },
  { name: "Time Tracking", href: "/time-tracking", icon: Clock },
  { name: "Employee Management", href: "/employees", icon: Users },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg flex-shrink-0 border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-hr-primary">HR Dashboard</h1>
        <p className="text-sm text-hr-text-secondary mt-1">Time & Scheduling</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "text-hr-primary bg-blue-50"
                      : "text-hr-secondary hover:bg-gray-50"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-hr-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
            <User className="h-4 w-4" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-hr-secondary">Jonathan Peters</p>
            <p className="text-xs text-hr-text-secondary">HR Director</p>
          </div>
        </div>
      </div>
    </div>
  );
}
