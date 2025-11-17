import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner'
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import KitchenDetail from "./pages/KitchenDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import TestAuth from "./test-auth";
import QuickAuthTest from "./quick-auth-test";
import DebugAuth from "./debug-auth";
import { useAuthStore } from './stores/authStore'
import { useEffect } from 'react'

export default function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      <div className="min-h-screen bg-cream-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/kitchen/:id" element={<KitchenDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/test-auth" element={<TestAuth />} />
            <Route path="/quick-auth-test" element={<QuickAuthTest />} />
            <Route path="/debug-auth" element={<DebugAuth />} />
            
            {/* Protected Routes */}
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/edit-profile" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFF8DC',
              color: '#8B4513',
              border: '1px solid #D2691E',
              borderRadius: '12px',
            },
            className: 'font-sans',
          }}
        />
      </div>
    </Router>
  );
}
