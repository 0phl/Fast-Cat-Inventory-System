"use client"

import { useState } from "react"
import { StaffLayout } from "@/components/layouts/staff-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, CheckCircle, XCircle, Plus } from "lucide-react"
import { format } from "date-fns"

// Mock data for staff dashboard
const mockRequests = [
  {
    id: "REQ-001",
    partNumber: "EF-2024",
    partName: "Engine Filter",
    quantity: 2,
    ship: "FastCat M1",
    status: "Pending",
    requestedAt: new Date("2024-01-17T10:30:00"),
    approvedBy: null,
  },
  {
    id: "REQ-002",
    partNumber: "HP-150",
    partName: "Hydraulic Pump",
    quantity: 1,
    ship: "FastCat M1",
    status: "Approved",
    requestedAt: new Date("2024-01-16T14:20:00"),
    approvedBy: "Jane Smith",
  },
  {
    id: "REQ-003",
    partNumber: "NL-LED",
    partName: "Navigation Light LED",
    quantity: 4,
    ship: "FastCat M1",
    status: "Rejected",
    requestedAt: new Date("2024-01-15T09:15:00"),
    approvedBy: "Jane Smith",
  },
]

const mockAvailableParts = [
  { id: "EF-2024", name: "Engine Filter", stock: 15, category: "Engine" },
  { id: "HP-150", name: "Hydraulic Pump", stock: 3, category: "Hydraulic" },
  { id: "NL-LED", name: "Navigation Light LED", stock: 8, category: "Electrical" },
  { id: "BF-300", name: "Brake Fluid", stock: 12, category: "Fluid" },
]

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <StaffLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your part requests and inventory access</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockRequests.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {mockRequests.filter((r) => r.status === "Pending").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockRequests.filter((r) => r.status === "Approved").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Parts</p>
                  <p className="text-2xl font-bold text-blue-600">{mockAvailableParts.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle>My Recent Requests</CardTitle>
            <CardDescription>Track your part requests and their approval status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium">{request.partName}</p>
                      <p className="text-sm text-gray-500">
                        {request.partNumber} • Qty: {request.quantity} • {request.ship}
                      </p>
                      <p className="text-xs text-gray-400">
                        Requested {format(request.requestedAt, "MMM dd, yyyy 'at' HH:mm")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                    {request.approvedBy && <p className="text-xs text-gray-500 mt-1">by {request.approvedBy}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Parts */}
        <Card>
          <CardHeader>
            <CardTitle>Available Parts</CardTitle>
            <CardDescription>Parts currently in stock that you can request</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockAvailableParts.map((part) => (
                <div key={part.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{part.category}</Badge>
                    <span className="text-sm font-medium">Stock: {part.stock}</span>
                  </div>
                  <h3 className="font-medium mb-1">{part.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{part.id}</p>
                  <Button size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Request
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StaffLayout>
  )
}
