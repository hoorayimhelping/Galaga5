import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all LPs
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lps = await prisma.lP.findMany({
      where: { createdById: session.user.id },
      include: {
        _count: {
          select: { interactions: true, commitments: true }
        }
      },
      orderBy: { lastContactedAt: 'desc' }
    })

    return NextResponse.json(lps)
  } catch (error) {
    console.error('Error fetching LPs:', error)
    return NextResponse.json({ error: 'Failed to fetch LPs' }, { status: 500 })
  }
}

// POST create new LP
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const lp = await prisma.lP.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        linkedIn: data.linkedIn || null,
        lpType: data.lpType || 'individual',
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
        status: data.status || 'prospect',
        priority: data.priority || 'medium',
        tags: data.tags ? JSON.stringify(data.tags) : null,
        notes: data.notes || null,
        commitmentDate: data.commitmentDate ? new Date(data.commitmentDate) : null,
        createdById: session.user.id,
      }
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'lp_created',
        description: `Added new LP: ${lp.firstName} ${lp.lastName}`,
        userId: session.user.id,
      }
    })

    return NextResponse.json(lp, { status: 201 })
  } catch (error) {
    console.error('Error creating LP:', error)
    return NextResponse.json({ error: 'Failed to create LP' }, { status: 500 })
  }
}