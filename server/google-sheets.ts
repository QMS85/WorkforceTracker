import { google } from 'googleapis';

// Helper function to calculate hours between two time strings
export function calculateHours(startTime: string, endTime: string): string {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  const hours = diffMs / (1000 * 60 * 60);
  return hours.toFixed(1);
}

export async function createGoogleSheet(data: any[], startDate: Date | null, endDate: Date | null, customTitle?: string): Promise<string> {
  try {
    // For development, we'll create a mock spreadsheet URL
    // In production, you would use actual Google Sheets API with credentials

    // Mock implementation for development
    const mockSpreadsheetId = 'mock-spreadsheet-id-' + Date.now();
    const mockUrl = `https://docs.google.com/spreadsheets/d/${mockSpreadsheetId}/edit`;

    // Log the data that would be exported
    console.log('Exporting schedule data to Google Sheets:', {
      dateRange: `${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`,
      recordCount: data.length,
      data: data.slice(0, 5) // Log first 5 records
    });

    // In a real implementation, you would:
    // 1. Set up Google Sheets API credentials
    // 2. Create a new spreadsheet
    // 3. Add headers and data
    // 4. Format the spreadsheet
    // 5. Set permissions
    // 6. Return the actual spreadsheet URL

    return mockUrl;
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    throw new Error('Failed to create Google Sheet');
  }
}

// Real Google Sheets implementation (commented out for development)
/*
export async function createGoogleSheet(data: any[], startDate: Date | null, endDate: Date | null, customTitle?: string): Promise<string> {
  try {
    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      keyFile: 'path/to/service-account-key.json', // You'd need to set this up
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Create a new spreadsheet
    const title = customTitle || 
    (startDate && endDate ? `Work Schedule - ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}` : 
    'HR Data Export');

    const resource = {
      properties: {
        title: title,
      },
    };

    const spreadsheet = await sheets.spreadsheets.create({
      resource,
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId!;

    // Prepare the data for the spreadsheet
    const headers = ['Date', 'Employee', 'Department', 'Start Time', 'End Time', 'Total Hours', 'Notes', 'Recurring'];
    const values = [
      headers,
      ...data.map(row => [
        row.Date,
        row.Employee,
        row.Department,
        row['Start Time'],
        row['End Time'],
        row['Total Hours'],
        row.Notes,
        row.Recurring
      ])
    ];

    // Add data to the spreadsheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      resource: {
        values,
      },
    });

    // Format the spreadsheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
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
          },
        ],
      },
    });

    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    throw new Error('Failed to create Google Sheet');
  }
}
*/