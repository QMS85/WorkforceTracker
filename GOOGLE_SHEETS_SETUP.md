
# Google Sheets Integration Setup

This guide will help you set up Google Sheets integration for schedule export functionality.

## Prerequisites

1. A Google Cloud Project
2. Google Sheets API enabled
3. Service Account credentials

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Enter a name for your service account
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 3: Generate Service Account Key

1. Click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Select "JSON" format
5. Download the key file

## Step 4: Store Credentials in Replit

1. In your Replit project, go to the Secrets tab
2. Create a new secret called `GOOGLE_SHEETS_CREDENTIALS`
3. Copy the entire contents of the downloaded JSON file and paste it as the value

## Step 5: Update the Google Sheets Service

Replace the mock implementation in `server/google-sheets.ts` with the real implementation:

```typescript
import { google } from 'googleapis';

export async function createGoogleSheet(data: any[], startDate: Date, endDate: Date): Promise<string> {
  try {
    // Initialize Google Sheets API with service account credentials
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Create a new spreadsheet
    const resource = {
      properties: {
        title: `Work Schedule - ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
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
```

## Step 6: Test the Integration

1. Create some test schedules in your application
2. Use the "Export to Sheets" button
3. Check that a new Google Sheets document is created with your schedule data

## Notes

- The service account will be the owner of created spreadsheets
- You may want to share the spreadsheets with specific users or make them public
- Consider implementing error handling for quota limits and API failures
- For production use, consider implementing caching and rate limiting
