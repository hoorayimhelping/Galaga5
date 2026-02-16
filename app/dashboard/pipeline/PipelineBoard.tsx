'use client'

import Link from 'next/link'
import { useState } from 'react'

interface LP {
  id: string
  firstName: string
  lastName: string
  organization: string | null
  lpType: string
  status: string
  commitment: number | null
  priority: string
  _count: {
    interactions: number
  }
}

const STAGES = [
  { id: 'prospect', label: 'Prospect', color: 'bg-gray-100', textColor: 'text-gray-800' },
  { id: 'contacted', label: 'Contacted', color: 'bg-blue-100', textColor: 'text-blue-800' },
  { id: 'interested', label: 'Interested', color: 'bg-purple-100', textColor: 'text-purple-800' },
  { id: 'committed', label: 'Committed', color: 'bg-yellow-100', textColor: 'text-yellow-800' },
  { id: 'active', label: 'Active', color: 'bg-green-100', textColor: 'text-green-800' },
]

export default function PipelineBoard({ lps }: { lps: LP[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const getLPTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      individual: '👤',
      family_office: '🏛️',
      institution: '🏢',
      fund_of_funds: '💼',
    }
    return icons[type] || '👤'
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return null
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(amount)
  }

  const filteredLPs = lps.filter(lp =>
    searchTerm === '' ||
    lp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lp.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getLPsByStage = (stageId: string) => {
    return filteredLPs.filter(lp => lp.status === stageId)
  }

  const getTotalCommitmentByStage = (stageId: string) => {
    const lpsInStage = filteredLPs.filter(lp => lp.status === stageId)
    const total = lpsInStage.reduce((sum, lp) => sum + (lp.commitment || 0), 0)
    return total
  }

  return (
    <div>
      {/* Search and Stats */}
      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <input
            type="text"
            placeholder="Search LPs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Total LPs:</span>{' '}
              <span className="font-bold text-gray-900">{filteredLPs.length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Total Pipeline:</span>{' '}
              <span className="font-bold text-gray-900">
                {formatCurrency(filteredLPs.reduce((sum, lp) => sum + (lp.commitment || 0), 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-4 min-w-full">
          {STAGES.map(stage => {
            const lpsInStage = getLPsByStage(stage.id)
            const totalCommitment = getTotalCommitmentByStage(stage.id)

            return (
              <div key={stage.id} className="flex-1 min-w-[280px]">
                <div className={`${stage.color} rounded-t-lg p-3`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${stage.textColor}`}>{stage.label}</h3>
                    <span className={`text-sm font-medium ${stage.textColor}`}>
                      {lpsInStage.length}
                    </span>
                  </div>
                  {totalCommitment > 0 && (
                    <p className={`text-xs ${stage.textColor} opacity-75`}>
                      {formatCurrency(totalCommitment)} committed
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-b-lg p-2 min-h-[500px] space-y-2">
                  {lpsInStage.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No LPs in this stage
                    </div>
                  ) : (
                    lpsInStage.map(lp => (
                      <Link
                        key={lp.id}
                        href={`/dashboard/lps/${lp.id}`}
                        className="block bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-xl">{getLPTypeIcon(lp.lpType)}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">
                              {lp.firstName} {lp.lastName}
                            </h4>
                            {lp.organization && (
                              <p className="text-xs text-gray-600 truncate">{lp.organization}</p>
                            )}
                          </div>
                          {lp.priority === 'high' && (
                            <span className="text-red-500 text-xs">⭐</span>
                          )}
                        </div>

                        {lp.commitment && (
                          <div className="text-xs font-medium text-green-600 mb-1">
                            💰 {formatCurrency(lp.commitment)}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>💬 {lp._count.interactions}</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Stage Definitions</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Prospect:</span>
            <p className="text-gray-600">Potential LPs identified but not yet contacted</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Contacted:</span>
            <p className="text-gray-600">Initial outreach made, awaiting response</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Interested:</span>
            <p className="text-gray-600">Expressed interest, in discussion phase</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Committed:</span>
            <p className="text-gray-600">Verbal or written commitment received</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Active:</span>
            <p className="text-gray-600">Funds received, active LP in the fund</p>
          </div>
        </div>
      </div>
    </div>
  )
}