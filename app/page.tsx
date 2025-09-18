"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      const role = user?.role
      if (role === 'Manager') router.push('/manager/dashboard');
      else if (role === 'Staff') router.push('/staff/dashboard');
      else router.push('/dashboard');
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated) {
    return null // Or a loading spinner, while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-4xl font-bold">
              <span className="text-blue-600">Fast</span>
              <span className="text-orange-500">Cat</span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Ship Parts Inventory</h1>
          <p className="text-gray-600">Manage your ferry parts efficiently</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
