'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Contact {
  id: string
  firstName: string
  lastName: string
  company: string | null
  firmName: string | null
}

interface Interaction {
  id: string
  type: string
  subject: string | null
  content: string | null
  outcome: string | null
  sentiment: string | null
  meetingDate: Date | null
  createdAt: Date
  contact: Contact
}

export default function InteractionTimeline({ interactions }: { interactions: Interaction[] }) {
  const [filter, setFilter] = useState<string>('all')

  const filteredInteractions = interactions.filter((interaction) =>
    filter === 'all' || interaction.type === filter
  )

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      email: '📧',
      call: '📞',
      meeting: '🤝',
      linkedin: '💼',
      event: '📅',
      note: '📝',
    }
    return icons[type] || '💬'
  }

  const getSentimentColor = (sentiment: string | null) => {
    if (!sentiment) return ''
    const colors: Record<string, string> = {
      positive: 'bg-green-100 text-green-700',
      neutral: 'bg-gray-100 text-gray-700',
      negative: 'bg-red-100 text-red-700',
    }
    return colors[sentiment] || ''
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Types</option>
          <option value="email">Email</option>
          <option value="call">Call</option>
          <option value="meeting">Meeting</option>
          <option value="linkedin">LinkedIn</option>
          <option value="event">Event</option>
          <option value="note">Note</option>
        </select>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredInteractions.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-600 mb-4">No interactions logged yet</p>
            <Link
              href="/dashboard/interactions/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Log Your First Interaction
            </Link>
          </div>
        ) : (
          filteredInteractions.map((interaction) => (
            <div key={interaction.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{getTypeIcon(interaction.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {interaction.type}
                        </h3>
                        {interaction.sentiment && (
                          <span
                            className={`text-xs px-2 py-1 rounded ${getSentimentColor(
                              interaction.sentiment
                            )}`}
                          >
                            {interaction.sentiment}
                          </span>
                        )}
                        {interaction.outcome && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {interaction.outcome}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/dashboard/contacts/${interaction.contact.id}`}
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        {interaction.contact.firstName} {interaction.contact.lastName}
                        {(interaction.contact.firmName || interaction.contact.company) && (
                          <span className="text-gray-600">
                            {' '}
                            • {interaction.contact.firmName || interaction.contact.company}
                          </span>
                        )}
                      </Link>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(interaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {interaction.subject && (
                    <h4 className="font-medium text-gray-900 mt-2">{interaction.subject}</h4>
                  )}
                  {interaction.content && (
                    <p className="text-gray-600 mt-2 whitespace-pre-wrap">{interaction.content}</p>
                  )}
                  {interaction.meetingDate && (
                    <p className="text-sm text-gray-500 mt-2">
                      📅 Scheduled:{' '}
                      {new Date(interaction.meetingDate).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
