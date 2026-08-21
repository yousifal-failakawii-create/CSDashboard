import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = (process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)?.replace(/\\n/g, '\n')
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!clientEmail || !privateKey || !spreadsheetId) {
      return res.status(500).json({ error: 'Missing environment variables' })
    }

    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Orders!A1:E1000',
    })

    return res.status(200).json({ rows: response.data.values || [] })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
