import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PipelineBoard from './PipelineBoard'

export default async function PipelinePage() {
  const session = await getServerSession(authOptions)

  const lps = await prisma.lP.findMany({
    where: { createdById: session?.user?.id },
    include: {
      _count: {
        select: { interactions: true }
      }
    },
    orderBy: { lastContactedAt: 'desc' }
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">LP Fundraising Pipeline</h1>
        <p className="mt-1 text-gray-600">Track your LP relationships through the fundraising process</p>
      </div>

      <PipelineBoard lps={lps} />
    </div>
  )
}