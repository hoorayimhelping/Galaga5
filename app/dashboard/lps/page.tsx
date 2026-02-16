import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import LPsList from './LPsList'

export default async function LPsPage() {
  const session = await getServerSession(authOptions)

  const lps = await prisma.lP.findMany({
    where: { createdById: session?.user?.id },
    include: {
      _count: {
        select: { interactions: true, commitments: true }
      }
    },
    orderBy: { lastContactedAt: 'desc' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Limited Partners</h1>
          <p className="mt-1 text-gray-600">Manage your fund's LP relationships</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/lps/import"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            📥 Import
CSV
          </Link>
          <Link
            href="/dashboard/lps/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            + Add LP
          </Link>
        </div>
      </div>

      <LPsList lps={lps} />
    </div>
  )
}