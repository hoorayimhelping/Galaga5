'use client'

import Link from 'next/link'

interface Interaction {
  id: string
  type: string
  subject: string | null
  content: string | null
  outcome: string | null
  createdAt: Date
  meetingDate: Date | null
}

export default function InteractionsList({
  contactId,
  interactions,
}: {
  contactId: string
  interactions: Interaction[]
}) {
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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Interactions</h2>
        <Link
          href={`/dashboard/interactions/new?contactId=${contactId}`}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          + Add Interaction
        </Link>
      </div>

      {interactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No interactions yet</p>
          <Link
            href={`/dashboard/interactions/new?contactId=${contactId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add First Interaction
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {interactions.map((interaction) => (
            <div
              key={interaction.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getTypeIcon(interaction.type)}</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {interaction.type}
                    </span>
                    {interaction.outcome && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        {interaction.outcome}
                      </span>
                    )}
                  </div>
                  {interaction.subject && (
                    <h3 className="font-medium text-gray-900 mb-1">{interaction.subject}</h3>
                  )}
                  {interaction.content && (
                    <p className="text-sm text-gray-600 mb-2">{interaction.content}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(interaction.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
