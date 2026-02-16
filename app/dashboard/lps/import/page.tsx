'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ImportLPsPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setResult(null)
    }
  }

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const data = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const row: any = {}

      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })

      data.push(row)
    }

    return data
  }

  const mapCSVToLP = (row: any): any => {
    // Common field mappings for Salesforce and Google Sheets
    return {
      firstName: row.FirstName || row['First Name'] || row.firstName || '',
      lastName: row.LastName || row['Last Name'] || row.lastName || '',
      email: row.Email || row.email || '',
      phone: row.Phone || row.phone || '',
      organization: row.Company || row.Organization || row.organization || row.AccountName || '',
      title: row.Title || row.title || '',
      lpType: row.Type || row.type || row.lpType || 'individual',
      commitment: row.Commitment || row.commitment || '',
      capitalCalled: row['Capital Called'] || row.capitalCalled || '',
      status: row.Status || row.status || 'prospect',
      priority: row.Priority || row.priority || 'medium',
      notes: row.Notes || row.Description || row.notes || '',
      linkedIn: row.LinkedIn || row.linkedIn || '',
      investmentFocus: row['Investment Focus'] || row.investmentFocus || '',
      vintage: row.Vintage || row.vintage || '',
      geography: row.Geography || row.geography || '',
    }
  }

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setImporting(true)
    setError(null)

    try {
      const text = await file.text()
      const csvData = parseCSV(text)

      if (csvData.length === 0) {
        throw new Error('No data found in CSV file')
      }

      const lps = csvData.map(mapCSVToLP).filter(lp => lp.firstName && lp.lastName)

      const response = await fetch('/api/lps/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lps }),
      })

      if (!response.ok) {
        throw new Error('Failed to import LPs')
      }

      const data = await response.json()
      setResult(data)

      if (data.success > 0) {
        setTimeout(() => {
          router.push('/dashboard/lps')
        }, 3000)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during import')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/lps"
          className="text-indigo-600 hover:text-indigo-700 text-sm"
        >
          ← Back to LPs
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Import LPs from CSV</h1>
        <p className="text-gray-600 mb-6">
          Import your LP data from Salesforce or Google Sheets
        </p>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 CSV Format Instructions</h3>
          <p className="text-sm text-blue-800 mb-3">
            Your CSV should include the following columns (case-insensitive):
          </p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>Required:</strong> FirstName (or "First Name"), LastName (or "Last Name")</li>
            <li><strong>Optional:</strong> Email, Phone, Company/Organization, Title</li>
            <li><strong>Optional:</strong> Type/lpType (individual, family_office, institution, fund_of_funds)</li>
            <li><strong>Optional:</strong> Commitment, "Capital Called", Status, Priority</li>
            <li><strong>Optional:</strong> Notes/Description, LinkedIn, "Investment Focus", Vintage, Geography</li>
          </ul>
        </div>

        {/* Sample CSV */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">📄 Sample CSV Format</h3>
          <pre className="text-xs text-gray-700 overflow-x-auto">
{`FirstName,LastName,Email,Organization,Title,Type,Commitment,Status
John,Doe,john@example.com,Doe Family Office,Managing Director,family_office,5000000,active
Jane,Smith,jane@example.com,,Angel Investor,individual,250000,interested`}
          </pre>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              cursor-pointer"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {result && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">✓ Import Complete!</h3>
            <p className="text-sm text-green-800">
              Successfully imported {result.success} LPs
              {result.failed > 0 && ` (${result.failed} failed)`}
            </p>
            {result.errors && result.errors.length > 0 && (
              <details className="mt-2">
                <summary className="text-sm text-green-700 cursor-pointer">
                  View errors ({result.errors.length})
                </summary>
                <ul className="mt-2 text-xs text-green-700 space-y-1 list-disc list-inside">
                  {result.errors.map((err: string, idx: number) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </details>
            )}
            <p className="text-sm text-green-700 mt-2">
              Redirecting to LPs page...
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/lps"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {importing ? 'Importing...' : 'Import LPs'}
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Tips for Best Results</h3>
        <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
          <li>Export your data from Salesforce or Google Sheets as CSV</li>
          <li>Ensure FirstName and LastName columns are present</li>
          <li>Clean up any special characters or formatting issues</li>
          <li>For LP Type, use: individual, family_office, institution, or fund_of_funds</li>
          <li>For Status, use: prospect, contacted, interested, committed, active, inactive, or exited</li>
          <li>Commitment and Capital Called values should be numbers (no currency symbols)</li>
        </ul>
      </div>
    </div>
  )
}