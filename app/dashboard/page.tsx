"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, TrendingUp, Building } from "lucide-react"

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    if (!token) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  const stats = [
    {
      title: "Total Parts",
      value: "1,247",
      description: "Active inventory items",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Low Stock Alerts",
      value: "23",
      description: "Items need restocking",
      icon: AlertTriangle,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Transactions Today",
      value: "156",
      description: "Stock movements",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Vessels",
      value: "8",
      description: "Vessels in service",
      icon: Building,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ]

  const recentTransactions = [
    { id: 1, part: "Engine Filter EF-2024", type: "Stock Out", ship: "FastCat M1", quantity: -2, time: "2 hours ago" },
    { id: 2, part: "Hydraulic Pump HP-150", type: "Stock In", ship: "Warehouse", quantity: 5, time: "4 hours ago" },
    {
      id: 3,
      part: "Navigation Light NL-LED",
      type: "Stock Out",
      ship: "FastCat M3",
      quantity: -1,
      time: "6 hours ago",
    },
    { id: 4, part: "Fuel Injector FI-V8", type: "Stock In", ship: "Warehouse", quantity: 8, time: "1 day ago" },
  ]

  const lowStockItems = [
    { part: "Engine Oil Filter", current: 3, minimum: 10, critical: true },
    { part: "Brake Pads Set", current: 7, minimum: 15, critical: false },
    { part: "Coolant Hose", current: 2, minimum: 8, critical: true },
    { part: "Spark Plugs", current: 12, minimum: 20, critical: false },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your ship parts inventory</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Latest stock movements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{transaction.part}</p>
                      <p className="text-sm text-gray-600">
                        {transaction.ship} • {transaction.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={transaction.type === "Stock In" ? "default" : "secondary"}>
                        {transaction.type}
                      </Badge>
                      <span className={`font-medium ${transaction.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                        {transaction.quantity > 0 ? "+" : ""}
                        {transaction.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>Items that need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.part}</p>
                      <p className="text-sm text-gray-600">
                        Current: {item.current} | Minimum: {item.minimum}
                      </p>
                    </div>
                    <Badge variant={item.critical ? "destructive" : "secondary"}>
                      {item.critical ? "Critical" : "Low"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
