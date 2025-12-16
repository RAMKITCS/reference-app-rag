import { useState } from 'react'
import { Upload, FileText, Zap, BarChart3, CheckCircle2 } from 'lucide-react'
import './App.css'

const API_URL = '/api'

// TypeScript Interfaces
interface Document {
  id: string
  filename: string
  status: string
  processed: boolean
}

interface QueryResult {
  response: string
  quality_score?: number
  quality_breakdown?: any
  metrics: {
    tokens_input: number
    tokens_output: number
    cost: number
    latency: number
  }
  evidence?: any[]
}

function App() {
  // State Management
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [query, setQuery] = useState('')
  const [querying, setQuerying] = useState(false)
  const [standardResult, setStandardResult] = useState<QueryResult | null>(null)
  const [truecontextResult, setTruecontextResult] = useState<QueryResult | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'query' | 'compare'>('upload')

  // Load documents from API
  const loadDocuments = async () => {
    try {
      const response = await fetch(`${API_URL}/documents`)
      const data = await response.json()
      setDocuments(data.documents)
    } catch (error) {
      console.error('Error loading documents:', error)
    }
  }

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('document_type', 'general')

    try {
      const response = await fetch(`${API_URL}/documents/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      alert(`Uploaded: ${data.filename}`)
      loadDocuments()
    } catch (error) {
      alert(`Upload error: ${error}`)
    } finally {
      setUploading(false)
    }
  }

  // Process document (chunking, embedding, indexing)
  const processDocument = async (docId: string) => {
    setProcessing(true)
    try {
      const response = await fetch(`${API_URL}/documents/process/${docId}`, {
        method: 'POST'
      })
      const data = await response.json()
      alert(`Processed: ${data.chunks_created} chunks created`)
      loadDocuments()
    } catch (error) {
      alert(`Processing error: ${error}`)
    } finally {
      setProcessing(false)
    }
  }

  // Query with Standard RAG
  const queryStandardRAG = async () => {
    const processedDocs = documents.filter(d => d.processed).map(d => d.id)
    if (processedDocs.length === 0) {
      alert('Please upload and process documents first')
      return
    }

    setQuerying(true)
    try {
      const response = await fetch(`${API_URL}/rag/standard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          document_ids: processedDocs,
          model: 'gpt-4.1-mini'
        })
      })
      const data = await response.json()
      setStandardResult(data)
    } catch (error) {
      alert(`Query error: ${error}`)
    } finally {
      setQuerying(false)
    }
  }

  // Query with TrueContext RAG
  const queryTrueContextRAG = async () => {
    const processedDocs = documents.filter(d => d.processed).map(d => d.id)
    if (processedDocs.length === 0) {
      alert('Please upload and process documents first')
      return
    }

    setQuerying(true)
    try {
      const response = await fetch(`${API_URL}/rag/truecontext`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          document_ids: processedDocs,
          model: 'gpt-4.1-mini'
        })
      })
      const data = await response.json()
      setTruecontextResult(data)
    } catch (error) {
      alert(`Query error: ${error}`)
    } finally {
      setQuerying(false)
    }
  }

  // Run both approaches side-by-side
  const compareApproaches = async () => {
    await Promise.all([queryStandardRAG(), queryTrueContextRAG()])
    setActiveTab('compare')
  }

  // Load documents on mount
  useState(() => {
    loadDocuments()
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            TrueContext AI - Quality-First RAG
          </h1>
          <p className="text-gray-600 mt-2">
            Budget optimization + 6-dimension quality validation
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="inline-block w-5 h-5 mr-2" />
              Upload & Process
            </button>
            <button
              onClick={() => setActiveTab('query')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'query'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Zap className="inline-block w-5 h-5 mr-2" />
              Query
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'compare'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="inline-block w-5 h-5 mr-2" />
              Compare
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Upload & Process Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {uploading ? 'Uploading...' : 'Click to upload file'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      accept=".pdf,.docx,.csv,.txt"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOCX, CSV, or TXT up to 100MB
                  </p>
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Documents</h2>
              <div className="space-y-3">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between border p-4 rounded">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.filename}</p>
                        <p className="text-sm text-gray-500">
                          {doc.processed ? 'Processed ✓' : `Status: ${doc.status}`}
                        </p>
                      </div>
                    </div>
                    {!doc.processed && doc.status === 'uploaded' && (
                      <button
                        onClick={() => processDocument(doc.id)}
                        disabled={processing}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                      >
                        {processing ? 'Processing...' : 'Process'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Query Tab */}
        {activeTab === 'query' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Query Documents</h2>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your question..."
                className="w-full h-32 border rounded p-3 mb-4"
              />
              <div className="flex space-x-4">
                <button
                  onClick={queryStandardRAG}
                  disabled={querying}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
                >
                  Standard RAG
                </button>
                <button
                  onClick={queryTrueContextRAG}
                  disabled={querying}
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                  TrueContext RAG ⭐
                </button>
                <button
                  onClick={compareApproaches}
                  disabled={querying}
                  className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                >
                  Compare Both
                </button>
              </div>
            </div>

            {/* TrueContext Results */}
            {truecontextResult && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">TrueContext Result</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <p className="text-sm font-medium text-green-900">
                      Quality Score: {(truecontextResult.quality_score! * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{truecontextResult.response}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Input Tokens</p>
                      <p className="font-semibold">{truecontextResult.metrics.tokens_input}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Output Tokens</p>
                      <p className="font-semibold">{truecontextResult.metrics.tokens_output}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Cost</p>
                      <p className="font-semibold">${truecontextResult.metrics.cost.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Latency</p>
                      <p className="font-semibold">{truecontextResult.metrics.latency.toFixed(2)}s</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Standard RAG Column */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Standard RAG (Baseline)</h3>
              {standardResult ? (
                <div className="space-y-4">
                  <div className="prose max-w-none text-sm">
                    <p className="whitespace-pre-wrap">{standardResult.response}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cost:</span>
                      <span className="font-semibold">${standardResult.metrics.cost.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Latency:</span>
                      <span className="font-semibold">{standardResult.metrics.latency.toFixed(2)}s</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Run comparison to see results</p>
              )}
            </div>

            {/* TrueContext RAG Column */}
            <div className="bg-white shadow rounded-lg p-6 border-2 border-green-500">
              <h3 className="text-lg font-semibold mb-4">TrueContext RAG ⭐</h3>
              {truecontextResult ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border-l-4 border-green-500 p-3">
                    <p className="text-sm font-medium text-green-900">
                      Quality: {(truecontextResult.quality_score! * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="prose max-w-none text-sm">
                    <p className="whitespace-pre-wrap">{truecontextResult.response}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cost:</span>
                      <span className="font-semibold">${truecontextResult.metrics.cost.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Latency:</span>
                      <span className="font-semibold">{truecontextResult.metrics.latency.toFixed(2)}s</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Run comparison to see results</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
