import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ContactsList from './ContactsList'

export default async function ContactsPage() {
  const session = await getServerSession(authOptions)

  const contacts = await prisma.contact.findMany({
    where: { createdById: session?.user?.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { interactions: true }
      }
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-1 text-gray-600">Manage your investor relationships</p>
        </div>
        <Link
          href="/dashboard/contacts/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <span className="mr-2">➕</span>
          Add Contact
        </Link>
      </div>

      <ContactsList contacts={contacts} />
    </div>
  )
}
