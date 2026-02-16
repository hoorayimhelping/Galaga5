import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import InteractionTimeline from './InteractionTimeline'

export default async function InteractionsPage() {
  const session = await getServerSession(authOptions)

  const interactions = await prisma.interaction.findMany({
    where: { createdById: session?.user?.id },
    include: {
      contact: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          company: true,
          firmName: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interactions</h1>
          <p className="mt-1 text-gray-600">Track all your investor touchpoints</p>
        </div>
        <Link
          href="/dashboard/interactions/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <span className="mr-2">➕</span>
          Log Interaction
        </Link>
      </div>

      <InteractionTimeline interactions={interactions} />
    </div>
  )
}
