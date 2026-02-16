import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { analyzeProgress, generateInsights, generateWeeklyRecommendations } from '@/lib/ai/guidance'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function InsightsPage() {
  const session = await getServerSession(authOptions)

  const progress = await analyzeProgress(session?.user?.id!)
  const insights = generateInsights(progress)
  const recommendations = await generateWeeklyRecommendations(session?.user?.id!)

  // Get recent insights from database
  const savedInsights = await prisma.insight.findMany({
    where: { isRead: false, isDismissed: false },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Insights & Guidance</h1>
        <p className="mt-1 text-gray-600">Smart recommendations to accelerate your fundraising</p>
      </div>

      {/* Current Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Contacts</p>
          <p className="text-2xl font-bold text-gray-900">{progress.totalContacts}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Active Deals</p>
          <p className="text-2xl font-bold text-indigo-600">{progress.activeContacts}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">This Week's Activity</p>
          <p className="text-2xl font-bold text-green-600">{progress.weeklyInteractions}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Upcoming Meetings</p>
          <p className="text-2xl font-bold text-purple-600">{progress.upcomingMeetings}</p>
        </div>
      </div>

      {/* Weekly Insights */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <h2 className="text-2xl font-bold mb-4">🤖 This Week's Insights</h2>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-lg">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Recommended Actions</h2>
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <input type="checkbox" className="mt-1" />
              <p className="text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Interested Investors</span>
              <span className="font-semibold text-green-600">{progress.interestedInvestors}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Passed Investors</span>
              <span className="font-semibold text-red-600">{progress.passedInvestors}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Needs Follow-up</span>
              <span className="font-semibold text-orange-600">{progress.contactsWithoutRecentInteraction}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Trend</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Week</span>
              <span className="font-semibold text-indigo-600">{progress.weeklyInteractions} interactions</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Week</span>
              <span className="font-semibold text-gray-600">{progress.lastWeekInteractions} interactions</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Change</span>
              <span className={`font-semibold ${progress.weeklyInteractions > progress.lastWeekInteractions ? 'text-green-600' : 'text-red-600'}`}>
                {progress.lastWeekInteractions > 0
                  ? `${progress.weeklyInteractions > progress.lastWeekInteractions ? '+' : ''}${Math.round((progress.weeklyInteractions / progress.lastWeekInteractions - 1) * 100)}%`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Enhancement Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Enhanced AI Coming Soon</h3>
            <p className="text-blue-700 mb-3">
              We're building advanced AI capabilities that will:
            </p>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Analyze investor sentiment from your interactions</li>
              <li>Predict which leads are most likely to convert</li>
              <li>Suggest optimal timing for follow-ups</li>
              <li>Generate personalized outreach templates</li>
              <li>Provide competitive intelligence on investors</li>
            </ul>
            <p className="text-sm text-blue-600 mt-3">
              To enable AI features, add your OpenAI or Anthropic API key to the .env file
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
