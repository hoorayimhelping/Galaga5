import { prisma } from '../prisma'

interface UserProgress {
  totalContacts: number
  activeContacts: number
  weeklyInteractions: number
  lastWeekInteractions: number
  contactsWithoutRecentInteraction: number
  upcomingMeetings: number
  passedInvestors: number
  interestedInvestors: number
}

export async function analyzeProgress(userId: string): Promise<UserProgress> {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const [
    totalContacts,
    activeContacts,
    weeklyInteractions,
    lastWeekInteractions,
    contactsWithoutRecentInteraction,
    upcomingMeetings,
    passedInvestors,
    interestedInvestors,
  ] = await Promise.all([
    prisma.contact.count({
      where: { createdById: userId }
    }),
    prisma.contact.count({
      where: {
        createdById: userId,
        status: { in: ['contacted', 'meeting', 'interested'] }
      }
    }),
    prisma.interaction.count({
      where: {
        createdById: userId,
        createdAt: { gte: oneWeekAgo }
      }
    }),
    prisma.interaction.count({
      where: {
        createdById: userId,
        createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo }
      }
    }),
    prisma.contact.count({
      where: {
        createdById: userId,
        status: { in: ['contacted', 'meeting', 'interested'] },
        OR: [
          { lastContactedAt: null },
          { lastContactedAt: { lt: oneWeekAgo } }
        ]
      }
    }),
    prisma.interaction.count({
      where: {
        createdById: userId,
        type: 'meeting',
        meetingDate: { gte: now }
      }
    }),
    prisma.contact.count({
      where: {
        createdById: userId,
        status: 'passed'
      }
    }),
    prisma.contact.count({
      where: {
        createdById: userId,
        status: 'interested'
      }
    }),
  ])

  return {
    totalContacts,
    activeContacts,
    weeklyInteractions,
    lastWeekInteractions,
    contactsWithoutRecentInteraction,
    upcomingMeetings,
    passedInvestors,
    interestedInvestors,
  }
}

export function generateInsights(progress: UserProgress): string[] {
  const insights: string[] = []

  // Activity insights
  if (progress.weeklyInteractions === 0) {
    insights.push('⚠️ No interactions logged this week. Start reaching out to your contacts!')
  } else if (progress.weeklyInteractions < progress.lastWeekInteractions) {
    insights.push(`📉 Activity down ${Math.round((1 - progress.weeklyInteractions / progress.lastWeekInteractions) * 100)}% from last week. Keep the momentum going!`)
  } else if (progress.weeklyInteractions > progress.lastWeekInteractions) {
    insights.push(`📈 Great work! Activity up ${Math.round((progress.weeklyInteractions / progress.lastWeekInteractions - 1) * 100)}% from last week.`)
  }

  // Follow-up insights
  if (progress.contactsWithoutRecentInteraction > 0) {
    insights.push(`🔔 You have ${progress.contactsWithoutRecentInteraction} active contacts that haven't been contacted in over a week. Consider following up.`)
  }

  // Pipeline insights
  if (progress.interestedInvestors > 0 && progress.upcomingMeetings === 0) {
    insights.push(`💼 You have ${progress.interestedInvestors} interested investors but no upcoming meetings. Schedule calls to move them forward!`)
  }

  if (progress.upcomingMeetings > 0) {
    insights.push(`✅ ${progress.upcomingMeetings} meetings scheduled. Make sure to prepare and follow up after.`)
  }

  // Conversion insights
  if (progress.passedInvestors > progress.interestedInvestors * 2) {
    insights.push('💡 Your pass rate is high. Consider refining your target criteria or pitch approach.')
  }

  // Pipeline health
  const conversionRate = progress.totalContacts > 0 ? (progress.activeContacts / progress.totalContacts) * 100 : 0
  if (conversionRate < 20 && progress.totalContacts > 10) {
    insights.push(`📊 Only ${Math.round(conversionRate)}% of contacts are active. Focus on warming up prospects.`)
  }

  // Positive reinforcement
  if (progress.weeklyInteractions >= 10) {
    insights.push('🔥 Outstanding activity level! Keep this pace to close your round faster.')
  }

  if (insights.length === 0) {
    insights.push('👍 You\'re making steady progress. Keep logging interactions and following up with contacts.')
  }

  return insights
}

export async function generateWeeklyRecommendations(userId: string): Promise<string[]> {
  const recommendations: string[] = []

  // Get contacts needing follow-up
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const contactsNeedingFollowUp = await prisma.contact.findMany({
    where: {
      createdById: userId,
      status: { in: ['contacted', 'meeting', 'interested'] },
      OR: [
        { lastContactedAt: null },
        { lastContactedAt: { lt: oneWeekAgo } }
      ]
    },
    orderBy: { priority: 'desc' },
    take: 5,
  })

  if (contactsNeedingFollowUp.length > 0) {
    recommendations.push(`📞 Follow up with ${contactsNeedingFollowUp.map(c => `${c.firstName} ${c.lastName}`).join(', ')}`)
  }

  // Get prospects to reach out to
  const prospects = await prisma.contact.findMany({
    where: {
      createdById: userId,
      status: 'prospect',
      priority: { in: ['high', 'medium'] }
    },
    orderBy: { priority: 'desc' },
    take: 3,
  })

  if (prospects.length > 0) {
    recommendations.push(`✉️ Reach out to new prospects: ${prospects.map(c => `${c.firstName} ${c.lastName}`).join(', ')}`)
  }

  // Check for meetings without notes
  const recentMeetings = await prisma.interaction.findMany({
    where: {
      createdById: userId,
      type: 'meeting',
      meetingDate: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      content: null
    },
    include: {
      contact: true
    },
    take: 3,
  })

  if (recentMeetings.length > 0) {
    recommendations.push(`📝 Add notes to recent meetings with ${recentMeetings.map(m => `${m.contact.firstName} ${m.contact.lastName}`).join(', ')}`)
  }

  if (recommendations.length === 0) {
    recommendations.push('✨ Great job staying on top of your fundraising! Continue building relationships and moving deals forward.')
  }

  return recommendations
}
