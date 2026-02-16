import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import InteractionsList from './InteractionsList'

export default async function ContactDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  const contact = await prisma.contact.findUnique({
    where: { id: params.id },
    include: {
      interactions: {
        orderBy: { createdAt: 'desc' },
      },
      pipelineStages: {
        orderBy: { enteredAt: 'desc' },
      },
    },
  })

  if (!contact || contact.createdById !== session?.user?.id) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link
            href="/dashboard/contacts"
            className="text-indigo-600 hover:underline mb-2 inline-block"
          >
            ← Back to Contacts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {contact.firstName} {contact.lastName}
          </h1>
          {contact.title && contact.company && (
            <p className="mt-1 text-gray-600">
              {contact.title} at {contact.company}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Quick Info Card */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-medium text-gray-900 capitalize">{contact.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Priority</p>
                <p className="text-lg font-medium text-gray-900 capitalize">{contact.priority}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Interactions</p>
                <p className="text-lg font-medium text-gray-900">{contact.interactions.length}</p>
              </div>
              {contact.firmName && (
                <div>
                  <p className="text-sm text-gray-600">Firm</p>
                  <p className="text-lg font-medium text-gray-900">{contact.firmName}</p>
                </div>
              )}
              {contact.investmentStage && (
                <div>
                  <p className="text-sm text-gray-600">Investment Stage</p>
                  <p className="text-lg font-medium text-gray-900">{contact.investmentStage}</p>
                </div>
              )}
              {contact.checkSize && (
                <div>
                  <p className="text-sm text-gray-600">Check Size</p>
                  <p className="text-lg font-medium text-gray-900">{contact.checkSize}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactions */}
        <div className="lg:col-span-3">
          <InteractionsList contactId={contact.id} interactions={contact.interactions} />
        </div>
      </div>

      {/* Edit Form */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Contact</h2>
        <ContactForm contact={contact} isEdit />
      </div>
    </div>
  )
}
