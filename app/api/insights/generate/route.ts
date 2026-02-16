import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { analyzeProgress, generateInsights, generateWeeklyRecommendations } from '@/lib/ai/guidance'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const progress = await analyzeProgress(session.user.id)
    const insights = generateInsights(progress)
    const recommendations = await generateWeeklyRecommendations(session.user.id)

    // Save insights to database
    const savedInsights = []
    for (const insight of insights) {
      const saved = await prisma.insight.create({
        data: {
          type: 'weekly_summary',
          title: 'Weekly Progress Update',
          content: insight,
          priority: 'medium',
        }
      })
      savedInsights.push(saved)
    }

    for (const rec of recommendations) {
      const saved = await prisma.insight.create({
        data: {
          type: 'recommendation',
          title: 'Action Recommended',
          content: rec,
          priority: 'high',
        }
      })
      savedInsights.push(saved)
    }

    return NextResponse.json({
      progress,
      insights,
      recommendations,
      saved: savedInsights
    })
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}
