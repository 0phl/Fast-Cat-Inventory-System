"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Staff"
  department: string
  ship: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role?: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function useAuthHook() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    const userRole = localStorage.getItem("user-role")

    if (token && userRole) {
      // Mock user data based on role
      const mockUser: User = {
        id: "USR-001",
        name: userRole === "Admin" ? "John Doe" : userRole === "Manager" ? "Jane Smith" : "Mike Johnson",
        email: `${userRole.toLowerCase()}@fastcat.com`,
        role: userRole as "Admin" | "Manager" | "Staff",
        department: userRole === "Admin" ? "Operations" : userRole === "Manager" ? "Maintenance" : "Inventory",
        ship: "FastCat M1",
      }
      setUser(mockUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role?: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userRole = role || "Staff"
    localStorage.setItem("auth-token", "demo-token")
    localStorage.setItem("user-role", userRole)

    const mockUser: User = {
      id: "USR-001",
      name: userRole === "Admin" ? "John Doe" : userRole === "Manager" ? "Jane Smith" : "Mike Johnson",
      email: email,
      role: userRole as "Admin" | "Manager" | "Staff",
      department: userRole === "Admin" ? "Operations" : userRole === "Manager" ? "Maintenance" : "Inventory",
      ship: "FastCat M1",
    }

    setUser(mockUser)
    setIsLoading(false)

    // Redirect based on role
    if (userRole === "Staff") {
      router.push("/staff/dashboard")
    } else if (userRole === "Manager") {
      router.push("/manager/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  const logout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-role")
    setUser(null)
    router.push("/")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    const permissions = {
      Admin: ["all"],
      Manager: ["inventory.read", "inventory.write", "transactions.read", "requests.approve", "staff.manage"],
      Staff: ["inventory.read", "requests.create", "qr.scan", "transactions.own"],
    }

    const userPermissions = permissions[user.role] || []
    return userPermissions.includes("all") || userPermissions.includes(permission)
  }

  return {
    user,
    isLoading,
    login,
    logout,
    hasPermission,
  }
}
