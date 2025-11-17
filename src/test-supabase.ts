// Test Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)
console.log('Supabase Key length:', supabaseAnonKey?.length)

// Test if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing!')
  console.error('Please check your .env file contains:')
  console.error('VITE_SUPABASE_URL=your_supabase_url')
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
} else {
  console.log('✅ Environment variables loaded successfully')
}