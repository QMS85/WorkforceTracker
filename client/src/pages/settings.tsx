import TopBar from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Save } from "lucide-react";

export default function Settings() {
  return (
    <div className="flex-1 overflow-auto">
      <TopBar 
        title="Settings" 
        subtitle="Configure your HR system preferences"
        actions={
          <Button className="bg-hr-primary hover:bg-blue-700 text-white">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        }
      />
      
      <div className="p-6">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="mr-2 h-5 w-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <SettingsIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Configuration</h3>
              <p className="text-gray-500">
                System settings and preferences will be available here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
