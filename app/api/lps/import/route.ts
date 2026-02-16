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

    const { lps } = await request.json()

    if (!Array.isArray(lps) || lps.length === 0) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (const lpData of lps) {
      try {
        // Validate required fields
        if (!lpData.firstName || !lpData.lastName) {
          results.failed++
          results.errors.push(`Missing required fields for ${lpData.firstName || ''} ${lpData.lastName || 'Unknown'}`)
          continue
        }

        await prisma.lP.create({
          data: {
            firstName: lpData.firstName,
            lastName: lpData.lastName,
            email: lpData.email || null,
            phone: lpData.phone || null,
            linkedIn: lpData.linkedIn || null,
            lpType: lpData.lpType || 'individual',
            organization: lpData.organization || null,
            title: lpData.title || null,
            commitment: lpData.commitment ? parseFloat(lpData.commitment) : null,
            capitalCalled: lpData.capitalCalled ? parseFloat(lpData.capitalCalled) : 0,
            capitalDistributed: lpData.capitalDistributed ? parseFloat(lpData.capitalDistributed) : 0,
            ownershipPercent: lpData.ownershipPercent ? parseFloat(lpData.ownershipPercent) : null,
            vintage: lpData.vintage || null,
            investmentFocus: lpData.investmentFocus || null,
            ticketSize: lpData.ticketSize || null,
            geography: lpData.geography || null,
            status: lpData.status || 'prospect',
            priority: lpData.priority || 'medium',
            tags: lpData.tags ? JSON.stringify(Array.isArray(lpData.tags) ? lpData.tags : [lpData.tags]) : null,
            notes: lpData.notes || null,
            commitmentDate: lpData.commitmentDate ? new Date(lpData.commitmentDate) : null,
            createdById: session.user.id,
          }
        })

        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Failed to import ${lpData.firstName} ${lpData.lastName}: ${error}`)
      }
    }

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'lps_imported',
        description: `Imported ${results.success} LPs (${results.failed} failed)`,
        metadata: JSON.stringify({ success: results.success, failed: results.failed }),
        userId: session.user.id,
      }
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error importing LPs:', error)
    return NextResponse.json({ error: 'Failed to import LPs' }, { status: 500 })
  }
}