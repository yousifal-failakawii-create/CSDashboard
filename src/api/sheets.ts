import { google, type sheets_v4 } from 'googleapis'

/**
 * Creates an authenticated Google Sheets client for server-side use.
 *
 * Do not import this module from browser-rendered React components. Configure
 * the required environment variables only in a trusted server or serverless
 * runtime, never in a VITE_ prefixed client-side variable.
 */
export function createGoogleSheetsClient(): sheets_v4.Sheets {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n'
  )

  if (!clientEmail || !privateKey) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY must be configured.'
    )
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  return google.sheets({ version: 'v4', auth })
}

/**
 * Reads values from a range in a Google Spreadsheet using service-account credentials.
 */
export async function getSheetValues(
  spreadsheetId: string,
  range: string
): Promise<unknown[][]> {
  const sheets = createGoogleSheetsClient()
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  return response.data.values ?? []
}
