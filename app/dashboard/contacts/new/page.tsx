import ContactForm from '@/components/ContactForm'

export default function NewContactPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Contact</h1>
        <p className="mt-1 text-gray-600">Create a new investor contact</p>
      </div>

      <ContactForm />
    </div>
  )
}
