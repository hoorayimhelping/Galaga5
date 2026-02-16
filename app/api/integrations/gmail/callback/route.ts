import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET
const GMAIL_REDIRECT_URI = process.env.NEXT_PUBLIC_URL + '/api/integrations/gmail/callback'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // User ID
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard/settings?error=gmail_auth_failed&message=${error}`, request.url)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=invalid_callback', request.url)
      )
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GMAIL_CLIENT_ID!,
        client_secret: GMAIL_CLIENT_SECRET!,
        redirect_uri: GMAIL_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens')
    }

    const tokens = await tokenResponse.json()

    // Get user email
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    const userInfo = await userInfoResponse.json()

    // Save tokens to database
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

    await prisma.integration.upsert({
      where: { userId: state },
      create: {
        provider: 'gmail',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        scope: tokens.scope,
        email: userInfo.email,
        userId: state,
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        scope: tokens.scope,
        email: userInfo.email,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'integration_connected',
        description: `Connected Gmail account: ${userInfo.email}`,
        userId: state,
      },
    })

    return NextResponse.redirect(
      new URL('/dashboard/settings?success=gmail_connected', request.url)
    )
  } catch (error) {
    console.error('Error handling Gmail callback:', error)
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=gmail_callback_failed', request.url)
    )
  }
}