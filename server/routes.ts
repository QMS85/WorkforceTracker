import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEmployeeSchema, 
  insertTimeEntrySchema, 
  insertScheduleSchema, 
  insertAttendanceRecordSchema 
} from "@shared/schema";
import { z } from "zod";
import { createGoogleSheet, calculateHours } from "./google-sheets";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Employee routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const employee = await storage.getEmployee(id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const employeeData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(employeeData);
      res.status(201).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid employee data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create employee" });
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const employeeData = insertEmployeeSchema.partial().parse(req.body);
      const employee = await storage.updateEmployee(id, employeeData);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid employee data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update employee" });
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEmployee(id);
      if (!success) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // Time entry routes
  app.get("/api/time-entries", async (req, res) => {
    try {
      const employeeId = req.query.employeeId ? parseInt(req.query.employeeId as string) : undefined;
      
      if (employeeId) {
        const entries = await storage.getTimeEntriesByEmployee(employeeId);
        res.json(entries);
      } else {
        const entries = await storage.getTimeEntries();
        res.json(entries);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time entries" });
    }
  });

  app.get("/api/time-entries/active/:employeeId", async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const entry = await storage.getActiveTimeEntry(employeeId);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active time entry" });
    }
  });

  app.post("/api/time-entries", async (req, res) => {
    try {
      // Ensure clockIn is properly formatted as a Date
      const data = {
        ...req.body,
        clockIn: req.body.clockIn ? new Date(req.body.clockIn) : new Date(),
        clockOut: req.body.clockOut ? new Date(req.body.clockOut) : null
      };
      
      const timeEntryData = insertTimeEntrySchema.parse(data);
      const entry = await storage.createTimeEntry(timeEntryData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Time entry validation error:", error.errors);
        return res.status(400).json({ 
          message: "Invalid time entry data", 
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      console.error("Time entry creation error:", error);
      res.status(500).json({ message: "Failed to create time entry" });
    }
  });

  app.put("/api/time-entries/:id/clock-out", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const clockOut = new Date(req.body.clockOut);
      const entry = await storage.clockOut(id, clockOut);
      if (!entry) {
        return res.status(404).json({ message: "Time entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to clock out" });
    }
  });

  // Schedule routes
  app.get("/api/schedules", async (req, res) => {
    try {
      const employeeId = req.query.employeeId ? parseInt(req.query.employeeId as string) : undefined;
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      
      if (employeeId) {
        const schedules = await storage.getSchedulesByEmployee(employeeId);
        res.json(schedules);
      } else if (date) {
        const schedules = await storage.getSchedulesByDate(date);
        res.json(schedules);
      } else {
        const schedules = await storage.getSchedules();
        res.json(schedules);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    try {
      // Parse and validate the date properly
      const data = {
        ...req.body,
        date: new Date(req.body.date),
        employeeId: parseInt(req.body.employeeId),
        isRecurring: Boolean(req.body.isRecurring),
        recurringPattern: req.body.isRecurring && req.body.recurringPattern ? req.body.recurringPattern : null
      };
      
      const scheduleData = insertScheduleSchema.parse(data);
      const schedule = await storage.createSchedule(scheduleData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Schedule validation error:", error.errors);
        return res.status(400).json({ 
          message: "Invalid schedule data", 
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      console.error("Schedule creation error:", error);
      res.status(500).json({ message: "Failed to create schedule" });
    }
  });

  app.put("/api/schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const scheduleData = insertScheduleSchema.partial().parse(req.body);
      const schedule = await storage.updateSchedule(id, scheduleData);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update schedule" });
    }
  });

  app.delete("/api/schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSchedule(id);
      if (!success) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json({ message: "Schedule deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete schedule" });
    }
  });

  // Attendance routes
  app.get("/api/attendance", async (req, res) => {
    try {
      const employeeId = req.query.employeeId ? parseInt(req.query.employeeId as string) : undefined;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      if (employeeId) {
        const records = await storage.getAttendanceByEmployee(employeeId);
        res.json(records);
      } else if (startDate && endDate) {
        const records = await storage.getAttendanceByDateRange(startDate, endDate);
        res.json(records);
      } else {
        const records = await storage.getAttendanceRecords();
        res.json(records);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attendance records" });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const attendanceData = insertAttendanceRecordSchema.parse(req.body);
      const record = await storage.createAttendanceRecord(attendanceData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid attendance data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create attendance record" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      const timeEntries = await storage.getTimeEntries();
      const attendanceRecords = await storage.getAttendanceRecords();
      
      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(emp => emp.isActive).length;
      
      // Calculate today's attendance
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const todayEntries = timeEntries.filter(entry => 
        entry.clockIn >= todayStart && entry.clockIn < todayEnd
      );
      const presentToday = todayEntries.length;
      
      // Calculate average hours per day
      const recentEntries = timeEntries.filter(entry => 
        entry.totalHours && entry.clockOut
      );
      const avgHours = recentEntries.length > 0 
        ? recentEntries.reduce((sum, entry) => sum + parseFloat(entry.totalHours!), 0) / recentEntries.length 
        : 0;
      
      // Calculate overtime hours this week
      const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weekEntries = timeEntries.filter(entry => 
        entry.clockIn >= weekStart && entry.totalHours
      );
      const overtimeHours = weekEntries.reduce((sum, entry) => {
        const hours = parseFloat(entry.totalHours!);
        return sum + Math.max(0, hours - 8);
      }, 0);
      
      res.json({
        totalEmployees,
        presentToday,
        avgHours: Math.round(avgHours * 10) / 10,
        overtimeHours: Math.round(overtimeHours)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  // Employee Google Sheets export route
  app.post("/api/employees/export-google-sheets", async (req, res) => {
    try {
      // Get all employees
      const employees = await storage.getEmployees();
      
      // Create spreadsheet data
      const spreadsheetData = employees.map(employee => ({
        'Employee ID': employee.id,
        'First Name': employee.firstName,
        'Last Name': employee.lastName,
        'Full Name': `${employee.firstName} ${employee.lastName}`,
        'Email': employee.email,
        'Department': employee.department,
        'Position': employee.position,
        'Hourly Rate': employee.hourlyRate ? `$${employee.hourlyRate}` : 'N/A',
        'Status': employee.isActive ? 'Active' : 'Inactive',
        'Created Date': employee.createdAt.toLocaleDateString(),
        'Created Time': employee.createdAt.toLocaleTimeString()
      }));
      
      // Use Google Sheets API to create and populate spreadsheet
      const spreadsheetUrl = await createGoogleSheet(spreadsheetData, null, null, 'Employee Directory');
      
      res.json({ 
        message: "Employee data exported successfully",
        spreadsheetUrl,
        recordCount: employees.length
      });
    } catch (error) {
      console.error("Employee Google Sheets export error:", error);
      res.status(500).json({ message: "Failed to export employee data to Google Sheets" });
    }
  });

  // Google Sheets export route
  app.post("/api/schedules/export-google-sheets", async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Get schedules in the date range
      const schedules = await storage.getSchedules();
      const filteredSchedules = schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= start && scheduleDate <= end;
      });
      
      // Get employees for lookup
      const employees = await storage.getEmployees();
      const employeeMap = new Map(employees.map(emp => [emp.id, emp]));
      
      // Create spreadsheet data
      const spreadsheetData = filteredSchedules.map(schedule => {
        const employee = employeeMap.get(schedule.employeeId);
        return {
          Date: schedule.date.toLocaleDateString(),
          Employee: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
          Department: employee?.department || 'N/A',
          'Start Time': schedule.startTime,
          'End Time': schedule.endTime,
          'Total Hours': calculateHours(schedule.startTime, schedule.endTime),
          Notes: schedule.notes || '',
          Recurring: schedule.isRecurring ? 'Yes' : 'No'
        };
      });
      
      // Use Google Sheets API to create and populate spreadsheet
      const spreadsheetUrl = await createGoogleSheet(spreadsheetData, start, end);
      
      res.json({ 
        message: "Schedule exported successfully",
        spreadsheetUrl,
        recordCount: filteredSchedules.length
      });
    } catch (error) {
      console.error("Google Sheets export error:", error);
      res.status(500).json({ message: "Failed to export to Google Sheets" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
