'use client'

import Link from 'next/link'
import { useState } from 'react'

interface LP {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  linkedIn: string | null
  lpType: string
  organization: string | null
  title: string | null
  commitment: number | null
  capitalCalled: number | null
  capitalDistributed: number | null
  ownershipPercent: number | null
  vintage: string | null
  investmentFocus: string | null
  ticketSize: string | null
  geography: string | null
  status: string
  priority: string
  notes: string | null
  lastContactedAt: Date | null
  commitmentDate: Date | null
  createdAt: Date
  interactions: any[]
  commitments: any[]
}

export default function LPDetailClient({ lp }: { lp: LP }) {
  const [showAddInteraction, setShowAddInteraction] = useState(false)

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      prospect: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      interested: 'bg-purple-100 text-purple-800',
      committed: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-orange-100 text-orange-800',
      exited: 'bg-red-100 text-red-800',
    }
    return colors[status] || colors.prospect
  }

  const getLPTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      individual: 'Individual',
      family_office: 'Family Office',
      institution: 'Institution',
      fund_of_funds: 'Fund of Funds',
    }
    return labels[type] || type
  }

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

  const called = lp.capitalCalled || 0
  const committed = lp.commitment || 0
  const percentCalled = committed > 0 ? (called / committed) * 100 : 0

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/lps" className="text-indigo-600 hover:text-indigo-700 text-sm">
          ← Back to LPs
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {lp.firstName} {lp.lastName}
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lp.status)}`}>
                {lp.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <span className="font-medium">{getLPTypeLabel(lp.lpType)}</span>
              </span>
              {lp.organization && <span>🏢 {lp.organization}</span>}
              {lp.title && <span>{lp.title}</span>}
            </div>
          </div>
          <Link
            href={`/dashboard/lps/${lp.id}/edit`}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            ✏️ Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lp.email && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`mailto:${lp.email}`} className="text-indigo-600 hover:text-indigo-700">
                      {lp.email}
                    </a>
                  </dd>
                </div>
              )}
              {lp.phone && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`tel:${lp.phone}`} className="text-indigo-600 hover:text-indigo-700">
                      {lp.phone}
                    </a>
                  </dd>
                </div>
              )}
              {lp.linkedIn && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">LinkedIn</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={lp.linkedIn} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                      View Profile →
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Financial Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Commitment</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(lp.commitment)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Capital Called</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(lp.capitalCalled)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Distributed</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(lp.capitalDistributed)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ownership</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{lp.ownershipPercent || 0}%</p>
              </div>
            </div>
            {committed > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Capital Called Progress</span>
                  <span className="font-medium text-gray-900">{percentCalled.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(percentCalled, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Investment Details */}
          {(lp.investmentFocus || lp.ticketSize || lp.geography || lp.vintage) && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Investment Details</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lp.investmentFocus && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Investment Focus</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lp.investmentFocus}</dd>
                  </div>
                )}
                {lp.ticketSize && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Typical Ticket Size</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lp.ticketSize}</dd>
                  </div>
                )}
                {lp.geography && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Geography</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lp.geography}</dd>
                  </div>
                )}
                {lp.vintage && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Vintage</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lp.vintage}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Notes */}
          {lp.notes && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{lp.notes}</p>
            </div>
          )}

          {/* Interactions */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Interactions ({lp.interactions.length})</h2>
              <button
                onClick={() => setShowAddInteraction(true)}
                className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                + Add
              </button>
            </div>
            {lp.interactions.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No interactions yet</p>
            ) : (
              <div className="space-y-4">
                {lp.interactions.map((interaction: any) => (
                  <div key={interaction.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getTypeIcon(interaction.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 capitalize">{interaction.type}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(interaction.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {interaction.subject && (
                          <p className="text-sm font-medium text-gray-900 mb-1">{interaction.subject}</p>
                        )}
                        {interaction.content && (
                          <p className="text-sm text-gray-600">{interaction.content}</p>
                        )}
                        {interaction.outcome && (
                          <span className="inline-block mt-2 text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                            {interaction.outcome}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Priority</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lp.priority === 'high' ? 'bg-red-100 text-red-700' :
                    lp.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {lp.priority}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Contacted</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lp.lastContactedAt
                    ? new Date(lp.lastContactedAt).toLocaleDateString()
                    : 'Never'}
                </dd>
              </div>
              {lp.commitmentDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Commitment Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(lp.commitmentDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Interactions</dt>
                <dd className="mt-1 text-sm text-gray-900">{lp.interactions.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Capital Calls</dt>
                <dd className="mt-1 text-sm text-gray-900">{lp.commitments.length}</dd>
              </div>
            </dl>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {lp.email && (
                <a
                  href={`mailto:${lp.email}`}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 text-center"
                >
                  📧 Send Email
                </a>
              )}
              {lp.phone && (
                <a
                  href={`tel:${lp.phone}`}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 text-center"
                >
                  📞 Call
                </a>
              )}
              {lp.linkedIn && (
                <a
                  href={lp.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 text-center"
                >
                  💼 LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}