import { prisma } from '@/lib/prisma'

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET

export async function refreshGmailToken(integration: any): Promise<string> {
  if (!integration.refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID!,
      client_secret: GMAIL_CLIENT_SECRET!,
      refresh_token: integration.refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  const tokens = await response.json()
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

  // Update integration with new token
  await prisma.integration.update({
    where: { id: integration.id },
    data: {
      accessToken: tokens.access_token,
      expiresAt,
    },
  })

  return tokens.access_token
}

export async function fetchGmailMessages(
  accessToken: string,
  query: string = '',
  maxResults: number = 100
): Promise<any[]> {
  // First, get list of message IDs
  const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=${encodeURIComponent(query)}`

  const listResponse = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!listResponse.ok) {
    throw new Error('Failed to fetch message list')
  }

  const listData = await listResponse.json()

  if (!listData.messages || listData.messages.length === 0) {
    return []
  }

  // Fetch full message details
  const messages = await Promise.all(
    listData.messages.map(async (msg: any) => {
      const messageUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`
      const messageResponse = await fetch(messageUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!messageResponse.ok) {
        return null
      }

      return messageResponse.json()
    })
  )

  return messages.filter(Boolean)
}

export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  body: string
): Promise<any> {
  // Create email in RFC 2822 format
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=utf-8',
    '',
    body,
  ].join('\n')

  // Base64 encode the email
  const encodedEmail = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedEmail }),
  })

  if (!response.ok) {
    throw new Error('Failed to send email')
  }

  return response.json()
}

export async function getGmailProfile(accessToken: string): Promise<any> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Gmail profile')
  }

  return response.json()
}