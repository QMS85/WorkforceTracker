import { 
  employees, 
  timeEntries, 
  schedules, 
  attendanceRecords,
  type Employee, 
  type InsertEmployee,
  type TimeEntry,
  type InsertTimeEntry,
  type Schedule,
  type InsertSchedule,
  type AttendanceRecord,
  type InsertAttendanceRecord
} from "@shared/schema";

export interface IStorage {
  // Employee operations
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: number): Promise<boolean>;
  
  // Time entry operations
  getTimeEntries(): Promise<TimeEntry[]>;
  getTimeEntriesByEmployee(employeeId: number): Promise<TimeEntry[]>;
  getActiveTimeEntry(employeeId: number): Promise<TimeEntry | undefined>;
  createTimeEntry(timeEntry: InsertTimeEntry): Promise<TimeEntry>;
  updateTimeEntry(id: number, timeEntry: Partial<InsertTimeEntry>): Promise<TimeEntry | undefined>;
  clockOut(id: number, clockOut: Date): Promise<TimeEntry | undefined>;
  
  // Schedule operations
  getSchedules(): Promise<Schedule[]>;
  getSchedulesByEmployee(employeeId: number): Promise<Schedule[]>;
  getSchedulesByDate(date: Date): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: number, schedule: Partial<InsertSchedule>): Promise<Schedule | undefined>;
  deleteSchedule(id: number): Promise<boolean>;
  
  // Attendance operations
  getAttendanceRecords(): Promise<AttendanceRecord[]>;
  getAttendanceByEmployee(employeeId: number): Promise<AttendanceRecord[]>;
  getAttendanceByDateRange(startDate: Date, endDate: Date): Promise<AttendanceRecord[]>;
  createAttendanceRecord(record: InsertAttendanceRecord): Promise<AttendanceRecord>;
  updateAttendanceRecord(id: number, record: Partial<InsertAttendanceRecord>): Promise<AttendanceRecord | undefined>;
}

export class MemStorage implements IStorage {
  private employees: Map<number, Employee> = new Map();
  private timeEntries: Map<number, TimeEntry> = new Map();
  private schedules: Map<number, Schedule> = new Map();
  private attendanceRecords: Map<number, AttendanceRecord> = new Map();
  
  private employeeIdCounter = 1;
  private timeEntryIdCounter = 1;
  private scheduleIdCounter = 1;
  private attendanceIdCounter = 1;

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample employees
    const sampleEmployees = [
      { firstName: "Alice", lastName: "Smith", email: "alice.smith@company.com", department: "Engineering", position: "Software Engineer", hourlyRate: "75.00", isActive: true },
      { firstName: "Bob", lastName: "Johnson", email: "bob.johnson@company.com", department: "Marketing", position: "Marketing Manager", hourlyRate: "65.00", isActive: true },
      { firstName: "Carol", lastName: "Williams", email: "carol.williams@company.com", department: "Sales", position: "Sales Representative", hourlyRate: "50.00", isActive: true },
      { firstName: "David", lastName: "Brown", email: "david.brown@company.com", department: "Operations", position: "Operations Manager", hourlyRate: "70.00", isActive: true },
      { firstName: "Emma", lastName: "Davis", email: "emma.davis@company.com", department: "HR", position: "HR Specialist", hourlyRate: "55.00", isActive: true },
      { firstName: "Frank", lastName: "Wilson", email: "frank.wilson@company.com", department: "Finance", position: "Financial Analyst", hourlyRate: "60.00", isActive: false },
    ];

    sampleEmployees.forEach(emp => {
      const employee: Employee = {
        id: this.employeeIdCounter++,
        ...emp,
        hourlyRate: emp.hourlyRate || null,
        isActive: emp.isActive ?? true,
        createdAt: new Date(),
      };
      this.employees.set(employee.id, employee);
    });

    // Sample schedules
    const today = new Date();
    const sampleSchedules = [
      { employeeId: 1, date: today, startTime: "09:00", endTime: "17:00", notes: "Regular shift", isRecurring: true, recurringPattern: "weekly" },
      { employeeId: 2, date: today, startTime: "10:00", endTime: "18:00", notes: "Marketing hours", isRecurring: false, recurringPattern: null },
      { employeeId: 3, date: new Date(today.getTime() + 24 * 60 * 60 * 1000), startTime: "08:00", endTime: "16:00", notes: "Early shift", isRecurring: false, recurringPattern: null },
      { employeeId: 4, date: new Date(today.getTime() + 24 * 60 * 60 * 1000), startTime: "12:00", endTime: "20:00", notes: "Afternoon shift", isRecurring: true, recurringPattern: "daily" },
    ];

    sampleSchedules.forEach(sched => {
      const schedule: Schedule = {
        id: this.scheduleIdCounter++,
        ...sched,
        notes: sched.notes || null,
        isRecurring: sched.isRecurring ?? false,
        recurringPattern: sched.recurringPattern || null,
        createdAt: new Date(),
      };
      this.schedules.set(schedule.id, schedule);
    });
  }

  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const newEmployee: Employee = {
      id: this.employeeIdCounter++,
      ...employee,
      hourlyRate: employee.hourlyRate || null,
      isActive: employee.isActive ?? true,
      createdAt: new Date(),
    };
    this.employees.set(newEmployee.id, newEmployee);
    return newEmployee;
  }

  async updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const existing = this.employees.get(id);
    if (!existing) return undefined;
    
    const updated: Employee = { ...existing, ...employee };
    this.employees.set(id, updated);
    return updated;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    return this.employees.delete(id);
  }

  // Time entry operations
  async getTimeEntries(): Promise<TimeEntry[]> {
    return Array.from(this.timeEntries.values());
  }

  async getTimeEntriesByEmployee(employeeId: number): Promise<TimeEntry[]> {
    return Array.from(this.timeEntries.values()).filter(entry => entry.employeeId === employeeId);
  }

  async getActiveTimeEntry(employeeId: number): Promise<TimeEntry | undefined> {
    return Array.from(this.timeEntries.values()).find(entry => 
      entry.employeeId === employeeId && entry.status === 'active'
    );
  }

  async createTimeEntry(timeEntry: InsertTimeEntry): Promise<TimeEntry> {
    const newEntry: TimeEntry = {
      id: this.timeEntryIdCounter++,
      ...timeEntry,
      status: timeEntry.status || "active",
      clockOut: timeEntry.clockOut || null,
      breakDuration: timeEntry.breakDuration || null,
      notes: timeEntry.notes || null,
      totalHours: null,
      createdAt: new Date(),
    };
    this.timeEntries.set(newEntry.id, newEntry);
    return newEntry;
  }

  async updateTimeEntry(id: number, timeEntry: Partial<InsertTimeEntry>): Promise<TimeEntry | undefined> {
    const existing = this.timeEntries.get(id);
    if (!existing) return undefined;
    
    const updated: TimeEntry = { ...existing, ...timeEntry };
    this.timeEntries.set(id, updated);
    return updated;
  }

  async clockOut(id: number, clockOut: Date): Promise<TimeEntry | undefined> {
    const existing = this.timeEntries.get(id);
    if (!existing) return undefined;
    
    const hoursWorked = (clockOut.getTime() - existing.clockIn.getTime()) / (1000 * 60 * 60);
    const totalHours = Math.max(0, hoursWorked - (existing.breakDuration || 0) / 60);
    
    const updated: TimeEntry = {
      ...existing,
      clockOut,
      totalHours: totalHours.toFixed(2),
      status: 'completed',
    };
    this.timeEntries.set(id, updated);
    return updated;
  }

  // Schedule operations
  async getSchedules(): Promise<Schedule[]> {
    return Array.from(this.schedules.values());
  }

  async getSchedulesByEmployee(employeeId: number): Promise<Schedule[]> {
    return Array.from(this.schedules.values()).filter(schedule => schedule.employeeId === employeeId);
  }

  async getSchedulesByDate(date: Date): Promise<Schedule[]> {
    const targetDate = date.toISOString().split('T')[0];
    return Array.from(this.schedules.values()).filter(schedule => 
      schedule.date.toISOString().split('T')[0] === targetDate
    );
  }

  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const newSchedule: Schedule = {
      id: this.scheduleIdCounter++,
      ...schedule,
      notes: schedule.notes || null,
      isRecurring: schedule.isRecurring ?? false,
      recurringPattern: schedule.recurringPattern || null,
      createdAt: new Date(),
    };
    this.schedules.set(newSchedule.id, newSchedule);
    return newSchedule;
  }

  async updateSchedule(id: number, schedule: Partial<InsertSchedule>): Promise<Schedule | undefined> {
    const existing = this.schedules.get(id);
    if (!existing) return undefined;
    
    const updated: Schedule = { ...existing, ...schedule };
    this.schedules.set(id, updated);
    return updated;
  }

  async deleteSchedule(id: number): Promise<boolean> {
    return this.schedules.delete(id);
  }

  // Attendance operations
  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    return Array.from(this.attendanceRecords.values());
  }

  async getAttendanceByEmployee(employeeId: number): Promise<AttendanceRecord[]> {
    return Array.from(this.attendanceRecords.values()).filter(record => record.employeeId === employeeId);
  }

  async getAttendanceByDateRange(startDate: Date, endDate: Date): Promise<AttendanceRecord[]> {
    return Array.from(this.attendanceRecords.values()).filter(record => 
      record.date >= startDate && record.date <= endDate
    );
  }

  async createAttendanceRecord(record: InsertAttendanceRecord): Promise<AttendanceRecord> {
    const newRecord: AttendanceRecord = {
      id: this.attendanceIdCounter++,
      ...record,
      notes: record.notes || null,
      scheduledHours: record.scheduledHours || null,
      actualHours: record.actualHours || null,
      createdAt: new Date(),
    };
    this.attendanceRecords.set(newRecord.id, newRecord);
    return newRecord;
  }

  async updateAttendanceRecord(id: number, record: Partial<InsertAttendanceRecord>): Promise<AttendanceRecord | undefined> {
    const existing = this.attendanceRecords.get(id);
    if (!existing) return undefined;
    
    const updated: AttendanceRecord = { ...existing, ...record };
    this.attendanceRecords.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
