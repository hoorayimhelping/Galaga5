'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string | null
  company: string | null
  title: string | null
  firmName: string | null
  status: string
  priority: string
  lastContactedAt: Date | null
  _count: {
    interactions: number
  }
}

export default function ContactsList({ contacts }: { contacts: Contact[] }) {
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filteredContacts = contacts.filter((contact) => {
    const matchesFilter = filter === 'all' || contact.status === filter
    const matchesSearch =
      search === '' ||
      contact.firstName.toLowerCase().includes(search.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(search.toLowerCase()) ||
      contact.email?.toLowerCase().includes(search.toLowerCase()) ||
      contact.company?.toLowerCase().includes(search.toLowerCase()) ||
      contact.firmName?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      prospect: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      meeting: 'bg-purple-100 text-purple-800',
      interested: 'bg-green-100 text-green-800',
      passed: 'bg-red-100 text-red-800',
      invested: 'bg-emerald-100 text-emerald-800',
    }
    return colors[status] || colors.prospect
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
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="prospect">Prospect</option>
            <option value="contacted">Contacted</option>
            <option value="meeting">Meeting</option>
            <option value="interested">Interested</option>
            <option value="passed">Passed</option>
            <option value="invested">Invested</option>
          </select>
        </div>
      </div>

      {/* Contacts List */}
      <div className="divide-y divide-gray-200">
        {filteredContacts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-600 mb-4">No contacts found</p>
            <Link
              href="/dashboard/contacts/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Your First Contact
            </Link>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <Link
              key={contact.id}
              href={`/dashboard/contacts/${contact.id}`}
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        contact.status
                      )}`}
                    >
                      {contact.status}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                        contact.priority
                      )}`}
                    >
                      {contact.priority} priority
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    {contact.title && contact.company && (
                      <span>
                        {contact.title} at {contact.company}
                      </span>
                    )}
                    {contact.firmName && <span>🏢 {contact.firmName}</span>}
                    {contact.email && <span>📧 {contact.email}</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span>💬 {contact._count.interactions} interactions</span>
                    {contact.lastContactedAt && (
                      <span>
                        Last contact:{' '}
                        {new Date(contact.lastContactedAt).toLocaleDateString()}
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
