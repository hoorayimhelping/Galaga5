'use client'

import Link from 'next/link'
import { useState } from 'react'

interface LP {
  id: string
  firstName: string
  lastName: string
  email: string | null
  organization: string | null
  title: string | null
  lpType: string
  status: string
  priority: string
  commitment: number | null
  capitalCalled: number | null
  lastContactedAt: Date | null
  _count: {
    interactions: number
    commitments: number
  }
}

export default function LPsList({ lps }: { lps: LP[] }) {
  const [filter, setFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filteredLPs = lps.filter((lp) => {
    const matchesStatusFilter = filter === 'all' || lp.status === filter
    const matchesTypeFilter = typeFilter === 'all' || lp.lpType === typeFilter
    const matchesSearch =
      search === '' ||
      lp.firstName.toLowerCase().includes(search.toLowerCase()) ||
      lp.lastName.toLowerCase().includes(search.toLowerCase()) ||
      lp.email?.toLowerCase().includes(search.toLowerCase()) ||
      lp.organization?.toLowerCase().includes(search.toLowerCase())
    return matchesStatusFilter && matchesTypeFilter && matchesSearch
  })

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

  const getLPTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      individual: '👤',
      family_office: '🏛️',
      institution: '🏢',
      fund_of_funds: '💼',
    }
    return icons[type] || '👤'
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

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
    }
    return colors[priority] || colors.medium
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search LPs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="family_office">Family Office</option>
            <option value="institution">Institution</option>
            <option value="fund_of_funds">Fund of Funds</option>
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="prospect">Prospect</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="committed">Committed</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="exited">Exited</option>
          </select>
        </div>
      </div>

      {/* LPs List */}
      <div className="divide-y divide-gray-200">
        {filteredLPs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-600 mb-4">No LPs found</p>
            <Link
              href="/dashboard/lps/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Your First LP
            </Link>
          </div>
        ) : (
          filteredLPs.map((lp) => (
            <Link
              key={lp.id}
              href={`/dashboard/lps/${lp.id}`}
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getLPTypeIcon(lp.lpType)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lp.firstName} {lp.lastName}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        lp.status
                      )}`}
                    >
                      {lp.status}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                        lp.priority
                      )}`}
                    >
                      {lp.priority}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">{getLPTypeLabel(lp.lpType)}</span>
                    </span>
                    {lp.organization && (
                      <span className="flex items-center gap-1">
                        🏢 {lp.organization}
                      </span>
                    )}
                    {lp.title && <span>{lp.title}</span>}
                    {lp.email && <span>📧 {lp.email}</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    {lp.commitment && (
                      <span className="font-medium text-green-600">
                        💰 Commitment: {formatCurrency(lp.commitment)}
                      </span>
                    )}
                    {lp.capitalCalled !== null && lp.capitalCalled > 0 && (
                      <span>Called: {formatCurrency(lp.capitalCalled)}</span>
                    )}
                    <span>💬 {lp._count.interactions} interactions</span>
                    {lp._count.commitments > 0 && (
                      <span>📋 {lp._count.commitments} capital calls</span>
                    )}
                    {lp.lastContactedAt && (
                      <span>
                        Last contact:{' '}
                        {new Date(lp.lastContactedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4 text-gray-400">→</div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}