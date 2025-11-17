import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, signIn, signUp, signOut, getCurrentUser, User } from '../lib/supabase'

interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
  error: string | null
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await signIn(email, password)
          if (error) throw error
          
          if (data.user) {
            const userData: User = {
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.user_metadata?.name || '',
              phone: data.user.user_metadata?.phone || '',
              role: data.user.user_metadata?.role || 'food_seeker',
              address: data.user.user_metadata?.address,
              created_at: data.user.created_at,
              updated_at: data.user.updated_at || data.user.created_at
            }
            set({ 
              user: userData, 
              session: data.session,
              loading: false 
            })
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to sign in', 
            loading: false 
          })
          throw error
        }
      },

      signUp: async (email: string, password: string, userData: Partial<User>) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await signUp(email, password, userData)
          if (error) throw error
          
          if (data.user) {
            const userData: User = {
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.user_metadata?.name || '',
              phone: data.user.user_metadata?.phone || '',
              role: data.user.user_metadata?.role || 'food_seeker',
              address: data.user.user_metadata?.address,
              created_at: data.user.created_at,
              updated_at: data.user.updated_at || data.user.created_at
            }
            set({ 
              user: userData, 
              session: data.session,
              loading: false 
            })
          }
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to sign up', 
            loading: false 
          })
          throw error
        }
      },

      signOut: async () => {
        set({ loading: true, error: null })
        try {
          const { error } = await signOut()
          if (error) throw error
          
          set({ 
            user: null, 
            session: null, 
            loading: false 
          })
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to sign out', 
            loading: false 
          })
          throw error
        }
      },

      checkAuth: async () => {
        set({ loading: true })
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || '',
              phone: session.user.user_metadata?.phone || '',
              role: session.user.user_metadata?.role || 'food_seeker',
              address: session.user.user_metadata?.address,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at || session.user.created_at
            }
            set({ 
              user: userData, 
              session: session,
              loading: false 
            })
          } else {
            set({ 
              user: null, 
              session: null,
              loading: false 
            })
          }
        } catch (error: any) {
          set({ 
            user: null, 
            session: null,
            loading: false 
          })
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        session: state.session 
      })
    }
  )
)

// Subscribe to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  const { checkAuth } = useAuthStore.getState()
  
  if (event === 'SIGNED_IN') {
    useAuthStore.setState({ 
      session,
      user: session?.user?.user_metadata as User
    })
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ 
      session: null, 
      user: null 
    })
  } else if (event === 'TOKEN_REFRESHED') {
    useAuthStore.setState({ session })
  }
  
  // Check auth state on any auth event
  checkAuth()
})