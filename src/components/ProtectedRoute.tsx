import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-terracotta-200 border-t-terracotta-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-warmbrown-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}