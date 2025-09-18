"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ManagerLayout } from "@/components/layouts/manager-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Clock } from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"
import { getDashboardStats, getLowStockItems, getRecentTransactions, getRequests } from "@/services/api"
import type { Stat, LowStockItem, StaffRequest, Transaction } from "@/types"

export default function ManagerDashboardPage() {
  const { isAuthenticated } = useAuth()
  const [stats, setStats] = useState<Stat[]>([])
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([])
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<StaffRequest[]>([])

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        setStats(await getDashboardStats("manager"))
        setLowStockItems(await getLowStockItems())
        setRecentTransactions(await getRecentTransactions())
        const allRequests = await getRequests()
        setPendingRequests(allRequests.filter(r => r.status === "Pending"))
      }
      fetchData()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage inventory and approve staff requests</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bgColor}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Pending Requests
              </CardTitle>
              <CardDescription>Staff requests awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{request.partName}</p>
                      <p className="text-sm text-gray-600">
                        {request.staffName} • {request.ship} • Qty: {request.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          request.priority === "High"
                            ? "destructive"
                            : request.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {request.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
        </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </ManagerLayout>
  )
}
