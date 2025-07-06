
# HR Dashboard - Employee Time Tracking & Scheduling System

## 📋 Overview

A modern, full-stack HR dashboard application designed for comprehensive employee time tracking and scheduling management. Built with React and TypeScript on the frontend, Express.js backend, and PostgreSQL database integration via Drizzle ORM.

## ✨ Features

### Core Functionality
- **Employee Management**: Complete CRUD operations for employee data
- **Time Tracking**: Clock in/out functionality with break duration tracking
- **Schedule Management**: Visual schedule creation with recurring pattern support
- **Attendance Tracking**: Daily attendance monitoring with status management
- **Analytics Dashboard**: Real-time productivity charts and attendance metrics
- **Google Sheets Integration**: Export schedules and employee data to Google Sheets
- **Responsive Design**: Mobile-friendly interface with adaptive layouts

### Technical Features
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Real-time Updates**: Live data synchronization via TanStack Query
- **Error Handling**: Comprehensive error boundaries and validation
- **Modern UI**: Radix UI components with Tailwind CSS styling
- **Database ORM**: Drizzle ORM for type-safe database operations

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **Tailwind CSS** with custom HR-themed styling
- **Radix UI** components with shadcn/ui library
- **Chart.js** for data visualization
- **Vite** for development and build tooling

### Backend
- **Node.js** with Express.js framework
- **TypeScript** with ES modules
- **PostgreSQL** with Drizzle ORM
- **Neon Database** (serverless PostgreSQL)
- **Zod** for schema validation
- **Google Sheets API** integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or Neon Database account)
- Google Cloud Console account (for Sheets integration)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hr-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL=your_postgresql_connection_string
GOOGLE_SHEETS_CREDENTIALS=your_google_service_account_json
```

4. **Initialize the database**
```bash
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📊 Google Sheets Integration Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 2: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Enter a name for your service account
4. Click "Create and Continue"
5. Skip optional steps and click "Done"

### Step 3: Generate Service Account Key

1. Click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" → "Create New Key"
4. Select "JSON" format
5. Download the key file

### Step 4: Configure Replit Secrets

1. In your Replit project, go to the Secrets tab
2. Create a new secret called `GOOGLE_SHEETS_CREDENTIALS`
3. Copy the entire contents of the downloaded JSON file and paste as the value

### Step 5: Update Google Sheets Service

Replace the mock implementation in `server/google-sheets.ts` with the real implementation:

```typescript
import { google } from 'googleapis';

export async function createGoogleSheet(data: any[], startDate: Date | null, endDate: Date | null, customTitle?: string): Promise<string> {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    const title = customTitle || 
      (startDate && endDate ? `Work Schedule - ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}` : 
      'HR Data Export');

    const resource = {
      properties: { title },
    };

    const spreadsheet = await sheets.spreadsheets.create({ resource });
    const spreadsheetId = spreadsheet.data.spreadsheetId!;

    // Prepare headers based on data type
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    const values = [
      headers,
      ...data.map(row => headers.map(header => row[header] || ''))
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      resource: { values },
    });

    // Format header row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [{
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                textFormat: { bold: true },
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        }],
      },
    });

    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    throw new Error('Failed to create Google Sheet');
  }
}
```

### Step 6: Test Integration

1. Create test schedules in your application
2. Use the "Export to Sheets" button in Schedule Management
3. Verify that a new Google Sheets document is created
4. Test employee data export from Employee Management

## 📈 Application Improvements

### Critical Issues to Address

#### 1. Navigation Structure Fix
**Issue**: Console warning about nested anchor tags in sidebar navigation
**Priority**: High
**Solution**: Remove nested `<a>` tags and use proper Wouter Link components

#### 2. Error Boundaries Enhancement
**Issue**: Missing error boundaries for React component errors
**Priority**: High
**Solution**: Implement comprehensive error boundaries with fallback UI

#### 3. Form Validation Improvements
**Issue**: Time entry form validation errors (400 responses)
**Priority**: Critical
**Solution**: Add client-side validation and improve error messaging

### Recommended Enhancements

#### Frontend Improvements
- **Real-time Updates**: WebSocket integration for live time tracking
- **Advanced Filtering**: Enhanced search and filter capabilities
- **Data Visualization**: More interactive charts and analytics
- **Mobile Optimization**: Improved responsive design for mobile devices
- **Accessibility**: ARIA labels and keyboard navigation support

#### Backend Improvements
- **API Security**: Rate limiting and request sanitization
- **Database Optimization**: Indexes for frequently queried fields
- **Caching**: Redis integration for improved performance
- **Input Validation**: Comprehensive middleware validation
- **Logging**: Structured logging with different log levels

#### Feature Additions
- **User Authentication**: Role-based access control system
- **Advanced Reporting**: PDF export and scheduled reports
- **Notifications**: Email and in-app notification system
- **Data Import**: CSV bulk import functionality
- **Backup System**: Automated data backup and restore

#### Code Quality Improvements
- **Testing Suite**: Unit, integration, and E2E tests
- **TypeScript Strict Mode**: Enhanced type safety
- **Code Documentation**: JSDoc comments and API documentation
- **Performance Monitoring**: Application performance tracking
- **Security Audits**: Regular security vulnerability assessments

### Implementation Priority

#### Phase 1 (Immediate - Critical)
1. Fix navigation nested link issue
2. Resolve schedule creation form validation
3. Add basic error boundaries
4. Implement proper Google Sheets integration

#### Phase 2 (High Priority - Next Sprint)
1. Enhance form validation across all forms
2. Add loading states and better UX feedback
3. Implement security improvements
4. Add comprehensive error handling

#### Phase 3 (Medium Priority - Future)
1. Real-time features with WebSocket
2. Advanced reporting capabilities
3. Performance optimizations
4. Mobile app considerations

#### Phase 4 (Nice to Have)
1. Advanced user management system
2. Comprehensive testing suite
3. Advanced analytics and insights
4. Third-party integrations (Slack, Teams, etc.)

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database schema push
npm run db:push
```

## 🌐 Deployment

### Replit Deployment
1. Fork this project on Replit
2. Set up your environment variables in Replit Secrets
3. Use the Deploy button in Replit
4. Configure with these settings:
   - **Build command**: `npm run build`
   - **Run command**: `npm start`

### Manual Deployment
1. Build the application: `npm run build`
2. Set environment variables on your hosting platform
3. Deploy the `dist` folder and server files
4. Ensure PostgreSQL database is accessible

## 📄 API Documentation

### Employee Endpoints
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Time Entry Endpoints
- `GET /api/time-entries` - Get all time entries
- `GET /api/time-entries/active/:employeeId` - Get active time entry
- `POST /api/time-entries` - Create time entry (clock in)
- `PUT /api/time-entries/:id/clock-out` - Clock out

### Schedule Endpoints
- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create new schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Export Endpoints
- `POST /api/schedules/export-google-sheets` - Export schedules to Google Sheets
- `POST /api/employees/export-google-sheets` - Export employee data to Google Sheets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the improvement suggestions above

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
