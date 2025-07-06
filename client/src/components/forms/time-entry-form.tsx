import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertTimeEntry } from "@shared/schema";

interface TimeEntryFormProps {
  employeeId: number;
  onSuccess?: () => void;
}

export default function TimeEntryForm({ employeeId, onSuccess }: TimeEntryFormProps) {
  const [formData, setFormData] = useState({
    clockIn: "",
    clockOut: "",
    breakDuration: 0,
    notes: "",
  });

  const { toast } = useToast();

  const createTimeEntryMutation = useMutation({
    mutationFn: async (timeEntry: InsertTimeEntry) => {
      const response = await apiRequest("POST", "/api/time-entries", timeEntry);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-entries"] });
      toast({
        title: "Time Entry Added",
        description: "Time entry has been recorded successfully.",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add time entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const timeEntry: InsertTimeEntry = {
      employeeId,
      clockIn: new Date(formData.clockIn),
      clockOut: formData.clockOut ? new Date(formData.clockOut) : undefined,
      breakDuration: formData.breakDuration,
      notes: formData.notes || undefined,
      status: formData.clockOut ? "completed" : "active",
    };

    createTimeEntryMutation.mutate(timeEntry);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clockIn">Clock In</Label>
              <Input
                id="clockIn"
                type="datetime-local"
                value={formData.clockIn}
                onChange={(e) => handleInputChange("clockIn", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="clockOut">Clock Out (Optional)</Label>
              <Input
                id="clockOut"
                type="datetime-local"
                value={formData.clockOut}
                onChange={(e) => handleInputChange("clockOut", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
            <Input
              id="breakDuration"
              type="number"
              min="0"
              value={formData.breakDuration}
              onChange={(e) => handleInputChange("breakDuration", parseInt(e.target.value) || 0)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Add any additional notes about this time entry..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTimeEntryMutation.isPending}
              className="bg-hr-primary hover:bg-blue-700 text-white"
            >
              {createTimeEntryMutation.isPending ? "Adding..." : "Add Time Entry"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
