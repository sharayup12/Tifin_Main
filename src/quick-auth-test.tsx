import { useState } from 'react'
import { supabase, signUp } from './lib/supabase'
import { toast } from 'sonner'

export default function QuickAuthTest() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  const testSignUp = async () => {
    setLoading(true)
    setResult('')
    
    try {
      console.log('Testing signup with:', { email, password })
      
      const { data, error } = await signUp(email, password, {
        name: 'Test User',
        phone: '+91 98765 43210',
        role: 'food_seeker'
      })
      
      if (error) {
        console.error('Signup error:', error)
        setResult(`Error: ${error.message}`)
        toast.error(`Signup failed: ${error.message}`)
      } else {
        console.log('Signup successful:', data)
        setResult('Signup successful! Check your email for confirmation.')
        toast.success('Signup successful! 🎉')
      }
      
    } catch (error: any) {
      console.error('Unexpected error:', error)
      setResult(`Unexpected error: ${error.message}`)
      toast.error(`Unexpected error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Quick Auth Test</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
      
      <button
        onClick={testSignUp}
        disabled={loading}
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Testing...' : 'Test Sign Up'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p className="text-sm">{result}</p>
        </div>
      )}
      
      <div className="mt-6 text-xs text-gray-600">
        <p>URL: {import.meta.env.VITE_SUPABASE_URL?.substring(0, 30)}...</p>
        <p>Key length: {import.meta.env.VITE_SUPABASE_ANON_KEY?.length}</p>
      </div>
    </div>
  )
}