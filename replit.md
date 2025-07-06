# HR Dashboard - Employee Time Tracking & Scheduling System

## Overview

This is a full-stack HR dashboard application built for employee time tracking and scheduling management. The system provides a comprehensive solution for managing employee data, tracking work hours, managing schedules, and generating reports. It features a modern React-based frontend with a clean, professional design and a robust Express.js backend with PostgreSQL database integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom HR-themed color palette
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Charts**: Chart.js for data visualization
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **API Design**: RESTful API endpoints with proper error handling

### Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Strongly typed schema definitions with Zod validation
- **Migrations**: Drizzle-kit for database schema management
- **Connection**: Connection pooling with Neon's serverless driver

## Key Components

### Database Schema
- **Employees**: Core employee information (name, email, department, position, hourly rate)
- **Time Entries**: Clock in/out records with break duration tracking
- **Schedules**: Employee scheduling with recurring pattern support
- **Attendance Records**: Daily attendance tracking with status management

### Frontend Features
- **Dashboard**: Overview with productivity charts and attendance metrics
- **Employee Management**: CRUD operations for employee data
- **Time Tracking**: Clock in/out functionality with live tracking
- **Schedule Management**: Visual schedule grid with drag-and-drop capabilities
- **Reports**: Data visualization and export functionality
- **Responsive Design**: Mobile-friendly interface with adaptive layouts

### Backend API Endpoints
- **Employee Routes**: `/api/employees` - Full CRUD operations
- **Time Entry Routes**: `/api/time-entries` - Clock management and tracking
- **Schedule Routes**: `/api/schedules` - Schedule CRUD and filtering
- **Attendance Routes**: `/api/attendance` - Attendance record management
- **Analytics Routes**: `/api/analytics` - Dashboard metrics and reports

## Data Flow

### Client-Server Communication
1. Frontend makes HTTP requests to Express.js API endpoints
2. Backend validates requests using Zod schemas
3. Drizzle ORM handles database operations with type safety
4. Response data is cached and managed by TanStack Query on the frontend
5. Real-time updates trigger cache invalidation and re-fetching

### Authentication & Session Management
- PostgreSQL session store for server-side session management
- Session-based authentication with secure cookie handling
- Database-backed session persistence for scalability

### State Management Flow
- Server state managed by TanStack Query with automatic caching
- Optimistic updates for better user experience
- Error boundaries and loading states throughout the application

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React with TypeScript support
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS processing
- **Data Fetching**: TanStack Query for server state management
- **Charts**: Chart.js for data visualization
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date manipulation

### Backend Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Store**: connect-pg-simple for PostgreSQL session management
- **Validation**: Zod for runtime type checking
- **HTTP Framework**: Express.js with standard middleware

### Development Tools
- **Build Tool**: Vite with React plugin
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Development Server**: Vite dev server with HMR

## Deployment Strategy

### Development Environment
- Vite development server for frontend with hot module replacement
- tsx for TypeScript execution in development
- Concurrent development with frontend and backend servers

### Production Build
- Vite builds optimized frontend bundle to `dist/public`
- esbuild compiles backend TypeScript to `dist/index.js`
- Static file serving integrated with Express.js
- Environment-based configuration for database connections

### Database Management
- Drizzle migrations for schema versioning
- Environment variable configuration for database URLs
- Connection pooling for production scalability

### Hosting Considerations
- Designed for deployment on platforms supporting Node.js
- Static assets served through Express.js
- Database migrations managed through Drizzle CLI
- Environment variables for configuration management

## Changelog

```
Changelog:
- July 06, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```