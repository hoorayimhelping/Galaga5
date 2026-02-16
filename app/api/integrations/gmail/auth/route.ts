import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Gmail OAuth configuration
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET
const GMAIL_REDIRECT_URI = process.env.NEXT_PUBLIC_URL + '/api/integrations/gmail/callback'

const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/userinfo.email',
].join(' ')

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!GMAIL_CLIENT_ID) {
      return NextResponse.json({
        error: 'Gmail integration not configured',
        message: 'Please add GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET to your .env file'
      }, { status: 500 })
    }

    // Build OAuth URL
    const params = new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      redirect_uri: GMAIL_REDIRECT_URI,
      response_type: 'code',
      scope: GMAIL_SCOPES,
      access_type: 'offline',
      prompt: 'consent',
      state: session.user.id, // Pass user ID to verify in callback
    })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Error generating Gmail auth URL:', error)
    return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 })
  }
}