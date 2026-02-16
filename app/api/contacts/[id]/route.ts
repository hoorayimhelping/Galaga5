import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
      include: {
        interactions: {
          orderBy: { createdAt: 'desc' },
        },
        pipelineStages: {
          orderBy: { enteredAt: 'desc' },
        },
      },
    })

    if (!contact || contact.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
    })

    if (!contact || contact.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    const updatedContact = await prisma.contact.update({
      where: { id: params.id },
      data,
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'contact_updated',
        description: `Updated contact: ${updatedContact.firstName} ${updatedContact.lastName}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(updatedContact)
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
    })

    if (!contact || contact.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    await prisma.contact.delete({
      where: { id: params.id },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'contact_deleted',
        description: `Deleted contact: ${contact.firstName} ${contact.lastName}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}
