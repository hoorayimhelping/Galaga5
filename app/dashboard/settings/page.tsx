import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings & Integrations</h1>
        <p className="mt-1 text-gray-600">Connect your tools and manage your account</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={session?.user?.name || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={session?.user?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Email Integration */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📧 Email Integration</h2>
        <p className="text-gray-600 mb-4">
          Connect your Gmail or Outlook account to automatically track email interactions
        </p>
        <div className="space-y-3">
          <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2">
            <span>Connect Gmail</span>
            <span className="text-xs bg-red-700 px-2 py-1 rounded">Coming Soon</span>
          </button>
          <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 ml-0 sm:ml-3">
            <span>Connect Outlook</span>
            <span className="text-xs bg-blue-700 px-2 py-1 rounded">Coming Soon</span>
          </button>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Future capabilities:</strong> Auto-log emails, track open rates, sync sent/received messages
          </p>
        </div>
      </div>

      {/* Calendar Integration */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Calendar Integration</h2>
        <p className="text-gray-600 mb-4">
          Sync your calendar to automatically track meetings and set reminders
        </p>
        <div className="space-y-3">
          <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
            <span>Connect Google Calendar</span>
            <span className="text-xs bg-blue-700 px-2 py-1 rounded">Coming Soon</span>
          </button>
          <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 ml-0 sm:ml-3">
            <span>Connect Outlook Calendar</span>
            <span className="text-xs bg-indigo-700 px-2 py-1 rounded">Coming Soon</span>
          </button>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Future capabilities:</strong> Auto-create meeting interactions, set follow-up reminders, view availability
          </p>
        </div>
      </div>

      {/* LinkedIn Integration */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">💼 LinkedIn Integration</h2>
        <p className="text-gray-600 mb-4">
          Connect LinkedIn to import contacts and track messaging activity
        </p>
        <button className="w-full sm:w-auto px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center justify-center gap-2">
          <span>Connect LinkedIn</span>
          <span className="text-xs bg-blue-800 px-2 py-1 rounded">Coming Soon</span>
        </button>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Future capabilities:</strong> Import investor profiles, track LinkedIn messages, view connection activity
          </p>
        </div>
      </div>

      {/* Document Storage */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📄 Document Storage</h2>
        <p className="text-gray-600 mb-4">
          Connect cloud storage to manage pitch decks and fundraising materials
        </p>
        <div className="space-y-3">
          <button className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
            <span>Connect Google Drive</span>
            <span className="text-xs bg-blue-600 px-2 py-1 rounded">Coming Soon</span>
          </button>
          <button className="w-full sm:w-auto px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center justify-center gap-2 ml-0 sm:ml-3">
            <span>Connect Dropbox</span>
            <span className="text-xs bg-indigo-600 px-2 py-1 rounded">Coming Soon</span>
          </button>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Future capabilities:</strong> Store pitch decks, track document versions, share materials with investors
          </p>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🔑 AI Configuration</h2>
        <p className="text-gray-600 mb-4">
          Add your AI API keys to enable advanced guidance features
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Key</label>
            <input
              type="password"
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anthropic API Key</label>
            <input
              type="password"
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Save API Keys
          </button>
        </div>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> API keys are stored securely in your .env file. Never share your keys publicly.
          </p>
        </div>
      </div>
    </div>
  )
}
