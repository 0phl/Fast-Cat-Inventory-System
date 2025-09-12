"use client"

import type React from "react"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ("Admin" | "Manager" | "Staff")[]
  fallbackPath?: string
}

export function RoleGuard({ children, allowedRoles, fallbackPath = "/" }: RoleGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || !allowedRoles.includes(user.role))) {
      router.push(fallbackPath)
    }
  }, [user, isLoading, allowedRoles, fallbackPath, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
