import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Get LP stats
  const [
    totalLPs,
    activeLPs,
    recentInteractions,
    upcomingMeetings,
    totalCommitments,
    totalCalled,
  ] = await Promise.all([
    prisma.lP.count({ where: { createdById: session?.user?.id } }),
    prisma.lP.count({
      where: {
        createdById: session?.user?.id,
        status: 'active'
      }
    }),
    prisma.interaction.count({
      where: {
        createdById: session?.user?.id,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    }),
    prisma.interaction.count({
      where: {
        createdById: session?.user?.id,
        type: 'meeting',
        meetingDate: { gte: new Date() }
      }
    }),
    prisma.lP.aggregate({
      where: { createdById: session?.user?.id },
      _sum: { commitment: true }
    }),
    prisma.lP.aggregate({
      where: { createdById: session?.user?.id },
      _sum: { capitalCalled: true }
    }),
  ])

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session?.user?.name}!</h1>
        <p className="mt-2 text-gray-600">Here's an overview of your LP management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total LPs</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{totalLPs}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active LPs</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{activeLPs}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Commitments</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(totalCommitments._sum.commitment)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Capital Called</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(totalCalled._sum.capitalCalled)}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week's Activity</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{recentInteractions}</p>
              <p className="text-xs text-gray-500 mt-1">interactions logged</p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{upcomingMeetings}</p>
              <p className="text-xs text-gray-500 mt-1">scheduled with LPs</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/lps/new"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">➕</span>
              <div>
                <p className="font-medium text-gray-900">Add New LP</p>
                <p className="text-sm text-gray-600">Add a limited partner to your fund</p>
              </div>
            </Link>
            <Link
              href="/dashboard/lps/import"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📥</span>
              <div>
                <p className="font-medium text-gray-900">Import LPs</p>
                <p className="text-sm text-gray-600">Bulk import from CSV (Salesforce, Sheets)</p>
              </div>
            </Link>
            <Link
              href="/dashboard/interactions/new"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📝</span>
              <div>
                <p className="font-medium text-gray-900">Log Interaction</p>
                <p className="text-sm text-gray-600">Record a call, email, or meeting</p>
              </div>
            </Link>
            <Link
              href="/dashboard/insights"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🤖</span>
              <div>
                <p className="font-medium text-gray-900">View AI Insights</p>
                <p className="text-sm text-gray-600">Get personalized recommendations</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">💼 LP Management Platform</h2>
          <p className="mb-4">Your AI-powered LP relationship management platform</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Track all LP communications
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Manage commitments and capital calls
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Gmail integration for email tracking
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              AI-powered insights and recommendations
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Never miss an LP follow-up
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
