import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET single LP
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lp = await prisma.lP.findUnique({
      where: { id: params.id },
      include: {
        interactions: {
          orderBy: { createdAt: 'desc' }
        },
        commitments: {
          orderBy: { createdAt: 'desc' }
        },
        pipelineStages: {
          orderBy: { enteredAt: 'desc' }
        }
      }
    })

    if (!lp || lp.createdById !== session.user.id) {
      return NextResponse.json({ error: 'LP not found' }, { status: 404 })
    }

    return NextResponse.json(lp)
  } catch (error) {
    console.error('Error fetching LP:', error)
    return NextResponse.json({ error: 'Failed to fetch LP' }, { status: 500 })
  }
}

// PUT update LP
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

    // Verify ownership
    const existing = await prisma.lP.findUnique({
      where: { id: params.id }
    })

    if (!existing || existing.createdById !== session.user.id) {
      return NextResponse.json({ error: 'LP not found' }, { status: 404 })
    }

    const lp = await prisma.lP.update({
      where: { id: params.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        linkedIn: data.linkedIn || null,
        lpType: data.lpType,
        organization: data.organization || null,
        title: data.title || null,
        commitment: data.commitment ? parseFloat(data.commitment) : null,
        capitalCalled: data.capitalCalled ? parseFloat(data.capitalCalled) : 0,
        capitalDistributed: data.capitalDistributed ? parseFloat(data.capitalDistributed) : 0,
        ownershipPercent: data.ownershipPercent ? parseFloat(data.ownershipPercent) : null,
        vintage: data.vintage || null,
        investmentFocus: data.investmentFocus || null,
        ticketSize: data.ticketSize || null,
        geography: data.geography || null,
        status: data.status,
        priority: data.priority,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        notes: data.notes || null,
        commitmentDate: data.commitmentDate ? new Date(data.commitmentDate) : null,
      }
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'lp_updated',
        description: `Updated LP: ${lp.firstName} ${lp.lastName}`,
        userId: session.user.id,
      }
    })

    return NextResponse.json(lp)
  } catch (error) {
    console.error('Error updating LP:', error)
    return NextResponse.json({ error: 'Failed to update LP' }, { status: 500 })
  }
}

// DELETE LP
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const lp = await prisma.lP.findUnique({
      where: { id: params.id }
    })

    if (!lp || lp.createdById !== session.user.id) {
      return NextResponse.json({ error: 'LP not found' }, { status: 404 })
    }

    await prisma.lP.delete({
      where: { id: params.id }
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'lp_deleted',
        description: `Deleted LP: ${lp.firstName} ${lp.lastName}`,
        userId: session.user.id,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting LP:', error)
    return NextResponse.json({ error: 'Failed to delete LP' }, { status: 500 })
  }
}