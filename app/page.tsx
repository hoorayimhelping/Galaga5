export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4">
            HCAP
          </h1>
          <p className="text-xl text-gray-700">
            Your AI-Powered VC Fundraising Platform
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">👥</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">CRM</h2>
            <p className="text-gray-600">
              Manage investor relationships, track interactions, and maintain detailed contact information.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Pipeline</h2>
            <p className="text-gray-600">
              Track your fundraising progress across stages and visualize your path to funding.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🤖</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">AI Guidance</h2>
            <p className="text-gray-600">
              Get intelligent weekly recommendations on next steps based on your progress.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📧</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Outreach</h2>
            <p className="text-gray-600">
              Manage email campaigns, templates, and track response rates.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📅</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Events</h2>
            <p className="text-gray-600">
              Schedule meetings, track events, and sync with your calendar.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📄</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Content</h2>
            <p className="text-gray-600">
              Store pitch decks, track versions, and manage fundraising materials.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            We're building the most comprehensive VC fundraising platform. Features launching soon:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Multi-user collaboration for your fundraising team</li>
            <li>AI-powered insights and weekly progress analysis</li>
            <li>Email, calendar, and LinkedIn integrations</li>
            <li>Document management and version control</li>
            <li>Automated follow-up reminders</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
