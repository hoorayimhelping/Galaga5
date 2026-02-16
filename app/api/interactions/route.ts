import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Verify contact belongs to user
    const contact = await prisma.contact.findUnique({
      where: { id: data.contactId },
    })

    if (!contact || contact.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    const interaction = await prisma.interaction.create({
      data: {
        type: data.type,
        subject: data.subject || null,
        content: data.content || null,
        outcome: data.outcome || null,
        sentiment: data.sentiment || null,
        meetingDate: data.meetingDate || null,
        duration: data.duration || null,
        contactId: data.contactId,
        createdById: session.user.id,
      },
    })

    // Update last contacted date on contact
    await prisma.contact.update({
      where: { id: data.contactId },
      data: { lastContactedAt: new Date() },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'interaction_added',
        description: `Added ${data.type} interaction with ${contact.firstName} ${contact.lastName}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(interaction, { status: 201 })
  } catch (error) {
    console.error('Error creating interaction:', error)
    return NextResponse.json({ error: 'Failed to create interaction' }, { status: 500 })
  }
}
