import { useState } from 'react'
import { supabase } from './lib/supabase'

export default function TestAuth() {
  const [status, setStatus] = useState<string>('Click test to check connection')
  const [error, setError] = useState<string>('')

  const testConnection = async () => {
    try {
      setStatus('Testing Supabase connection...')
      setError('')
      
      // Debug environment variables
      console.log('Environment check:')
      console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('Key length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length)
      console.log('Key preview:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
      
      // Test basic connection
      const { data, error } = await supabase.from('kitchens').select('id').limit(1)
      
      if (error) {
        setError(`Connection failed: ${error.message}`)
        setStatus('Connection failed')
        console.error('Supabase error:', error)
      } else {
        setStatus('Connection successful!')
        setError('')
        console.log('Connection successful, data:', data)
      }
      
      // Test authentication
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current user:', user)
      
    } catch (err) {
      setError(`Test error: ${err}`)
      setStatus('Test failed')
      console.error('Test error:', err)
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Supabase Connection Test</h2>
      <div className="mb-4">
        <button 
          onClick={testConnection}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Test Connection
        </button>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Status: {status}</p>
        {error && (
          <p className="text-red-500 mt-2">Error: {error}</p>
        )}
      </div>
      <div className="text-sm text-gray-600">
        <p>URL: {import.meta.env.VITE_SUPABASE_URL}</p>
        <p>Key exists: {!!import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}