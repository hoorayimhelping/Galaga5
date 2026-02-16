import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LPDetailClient from './LPDetailClient'

export default async function LPDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

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
        where: { isActive: true },
        orderBy: { enteredAt: 'desc' },
        take: 1
      }
    }
  })

  if (!lp || lp.createdById !== session?.user?.id) {
    notFound()
  }

  return <LPDetailClient lp={lp} />
}