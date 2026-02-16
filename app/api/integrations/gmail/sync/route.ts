import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { refreshGmailToken, fetchGmailMessages } from '@/lib/integrations/gmail'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Gmail integration
    const integration = await prisma.integration.findUnique({
      where: { userId: session.user.id, provider: 'gmail' }
    })

    if (!integration) {
      return NextResponse.json({ error: 'Gmail not connected' }, { status: 404 })
    }

    // Check if token needs refresh
    let accessToken = integration.accessToken
    if (integration.expiresAt && new Date() > integration.expiresAt) {
      accessToken = await refreshGmailToken(integration)
    }

    // Fetch recent messages (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const query = `after:${Math.floor(thirtyDaysAgo.getTime() / 1000)}`

    const messages = await fetchGmailMessages(accessToken, query)

    // Get all LPs with email addresses
    const lps = await prisma.lP.findMany({
      where: {
        createdById: session.user.id,
        email: { not: null }
      },
      select: { id: true, email: true, firstName: true, lastName: true }
    })

    const lpEmailMap = new Map(
      lps.map(lp => [lp.email!.toLowerCase(), lp])
    )

    let syncedCount = 0
    const errors = []

    // Match messages with LPs and create interactions
    for (const message of messages) {
      try {
        const headers = message.payload.headers
        const fromHeader = headers.find((h: any) => h.name === 'From')?.value || ''
        const toHeader = headers.find((h: any) => h.name === 'To')?.value || ''
        const subjectHeader = headers.find((h: any) => h.name === 'Subject')?.value || ''
        const dateHeader = headers.find((h: any) => h.name === 'Date')?.value

        // Extract email addresses
        const fromEmail = fromHeader.match(/<(.+?)>/)?.[1] || fromHeader
        const toEmail = toHeader.match(/<(.+?)>/)?.[1] || toHeader

        // Find matching LP
        const matchedLP = lpEmailMap.get(fromEmail.toLowerCase()) || lpEmailMap.get(toEmail.toLowerCase())

        if (!matchedLP) continue

        // Check if this message already exists
        const existing = await prisma.interaction.findFirst({
          where: { gmailMessageId: message.id }
        })

        if (existing) continue

        // Get message body
        let body = ''
        if (message.payload.body?.data) {
          body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8')
        } else if (message.payload.parts) {
          const textPart = message.payload.parts.find((p: any) => p.mimeType === 'text/plain')
          if (textPart?.body?.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString('utf-8')
          }
        }

        // Determine if email was sent or received
        const wasSent = fromEmail.toLowerCase() === integration.email?.toLowerCase()

        // Create interaction
        await prisma.interaction.create({
          data: {
            type: 'email',
            subject: subjectHeader,
            content: body.substring(0, 5000), // Limit content length
            gmailMessageId: message.id,
            emailSent: wasSent,
            createdAt: dateHeader ? new Date(dateHeader) : new Date(),
            lpId: matchedLP.id,
            createdById: session.user.id,
          }
        })

        // Update last contacted date
        await prisma.lP.update({
          where: { id: matchedLP.id },
          data: { lastContactedAt: dateHeader ? new Date(dateHeader) : new Date() }
        })

        syncedCount++
      } catch (error) {
        errors.push(`Failed to sync message ${message.id}: ${error}`)
      }
    }

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'gmail_synced',
        description: `Synced ${syncedCount} emails from Gmail`,
        userId: session.user.id,
      }
    })

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      total: messages.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    console.error('Error syncing Gmail:', error)
    return NextResponse.json({ error: 'Failed to sync Gmail' }, { status: 500 })
  }
}