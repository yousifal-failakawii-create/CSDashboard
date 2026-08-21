import { google, type sheets_v4 } from 'googleapis'

export function createGoogleSheetsClient(): sheets_v4.Sheets {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)?.replace(
    /\\n/g,
    '\n'
  )

  if (!clientEmail || !privateKey) {
    throw new Error(
      'GOOGLE_CLIENT_EMAIL (or GOOGLE_SERVICE_ACCOUNT_EMAIL) and GOOGLE_PRIVATE_KEY must be configured.'
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

export async function getSheetValues(
  spreadsheetId: string = process.env.GOOGLE_SHEET_ID || '',
  range: string = 'Orders!A1:Z1000'
): Promise<unknown[][]> {
  const sheets = createGoogleSheetsClient()
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  return response.data.values ?? []
}
