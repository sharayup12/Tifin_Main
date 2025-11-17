import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function DebugAuth() {
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [isTesting, setIsTesting] = useState(false)

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${info}`])
  }

  const runDebugTests = async () => {
    setIsTesting(true)
    addDebugInfo('Starting debug tests...')
    
    try {
      // Test 1: Environment variables
      addDebugInfo('Testing environment variables...')
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!url) {
        addDebugInfo('❌ VITE_SUPABASE_URL is missing')
        return
      }
      if (!key) {
        addDebugInfo('❌ VITE_SUPABASE_ANON_KEY is missing')
        return
      }
      
      addDebugInfo(`✅ URL: ${url.substring(0, 30)}...`)
      addDebugInfo(`✅ Key length: ${key.length}`)
      
      // Test 2: Supabase client
      addDebugInfo('Testing Supabase client...')
      const { data, error } = await supabase.from('kitchens').select('id').limit(1)
      
      if (error) {
        addDebugInfo(`❌ Database query failed: ${error.message}`)
        addDebugInfo(`Error code: ${error.code}`)
        addDebugInfo(`Error details: ${JSON.stringify(error)}`)
      } else {
        addDebugInfo(`✅ Database query successful, found ${data?.length || 0} kitchens`)
      }
      
      // Test 3: Auth
      addDebugInfo('Testing authentication...')
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        addDebugInfo(`❌ Auth check failed: ${authError.message}`)
      } else {
        addDebugInfo(`✅ Auth check successful, user: ${user ? 'logged in' : 'not logged in'}`)
      }
      
      addDebugInfo('Debug tests completed!')
      
    } catch (error: any) {
      addDebugInfo(`❌ Unexpected error: ${error.message}`)
    } finally {
      setIsTesting(false)
    }
  }

  useEffect(() => {
    // Run tests automatically on component mount
    runDebugTests()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Debug Authentication</h2>
      
      <div className="mb-6">
        <button
          onClick={runDebugTests}
          disabled={isTesting}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isTesting ? 'Running tests...' : 'Run Debug Tests'}
        </button>
      </div>
      
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        {debugInfo.length === 0 ? (
          <p>Running initial tests...</p>
        ) : (
          debugInfo.map((info, index) => (
            <div key={index} className="mb-1">{info}</div>
          ))
        )}
      </div>
      
      <div className="mt-6 text-xs text-gray-600">
        <p>Note: This will automatically run tests when the page loads</p>
      </div>
    </div>
  )
}