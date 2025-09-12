"use client"

import { useState } from "react"
import { StaffLayout } from "@/components/layouts/staff-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Search, Download, Filter, Package, Clock, CheckCircle, XCircle, Eye, RotateCcw } from "lucide-react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock transaction data
const mockTransactions = [
  {
    id: "TXN-001",
    type: "Request",
    partNumber: "EF-2024",
    partName: "Engine Filter",
    quantity: 2,
    ship: "FastCat M1",
    status: "Approved",
    requestedAt: new Date("2024-01-17T10:30:00"),
    approvedAt: new Date("2024-01-17T14:20:00"),
    approvedBy: "Jane Smith",
    reason: "Routine Maintenance",
    priority: "Medium",
  },
  {
    id: "TXN-002",
    type: "Request",
    partNumber: "HP-150",
    partName: "Hydraulic Pump",
    quantity: 1,
    ship: "FastCat M1",
    status: "Pending",
    requestedAt: new Date("2024-01-16T14:20:00"),
    reason: "Emergency Repair",
    priority: "High",
  },
  {
    id: "TXN-003",
    type: "Request",
    partNumber: "NL-LED",
    partName: "Navigation Light LED",
    quantity: 4,
    ship: "FastCat M2",
    status: "Rejected",
    requestedAt: new Date("2024-01-15T09:15:00"),
    rejectedAt: new Date("2024-01-15T16:30:00"),
    rejectedBy: "Jane Smith",
    reason: "Replacement",
    priority: "Low",
    rejectionReason: "Insufficient stock",
  },
  {
    id: "TXN-004",
    type: "Request",
    partNumber: "BF-300",
    partName: "Brake Fluid",
    quantity: 3,
    ship: "FastCat M1",
    status: "Approved",
    requestedAt: new Date("2024-01-14T11:45:00"),
    approvedAt: new Date("2024-01-14T15:10:00"),
    approvedBy: "Mike Johnson",
    reason: "Preventive Maintenance",
    priority: "Medium",
  },
  {
    id: "TXN-005",
    type: "Request",
    partNumber: "SF-200",
    partName: "Safety Fuse",
    quantity: 6,
    ship: "FastCat M3",
    status: "Delivered",
    requestedAt: new Date("2024-01-12T08:20:00"),
    approvedAt: new Date("2024-01-12T10:30:00"),
    deliveredAt: new Date("2024-01-13T09:15:00"),
    approvedBy: "Jane Smith",
    reason: "Safety Upgrade",
    priority: "High",
  },
]

export default function MyTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.ship.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter
    const matchesPriority = priorityFilter === "all" || transaction.priority.toLowerCase() === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Delivered":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const exportTransactions = () => {
    // Simulate export functionality
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Type,Part Number,Part Name,Quantity,Ship,Status,Requested At,Priority\n" +
      filteredTransactions
        .map(
          (t) =>
            `${t.id},${t.type},${t.partNumber},${t.partName},${t.quantity},${t.ship},${t.status},${format(t.requestedAt, "yyyy-MM-dd HH:mm")},${t.priority}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "my_transactions.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewTransaction = (transactionId: string) => {
    setSelectedTransaction(transactionId)
    setShowTransactionDetails(true)
  }

  const handleResubmitRequest = (transactionId: string) => {
    console.log(`Resubmitting request ${transactionId}`)
    // In a real app, this would navigate to the request form with pre-filled data
  }

  const getSelectedTransactionDetails = () => {
    return mockTransactions.find((t) => t.id === selectedTransaction)
  }

  return (
    <StaffLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Transactions</h1>
            <p className="text-gray-600 dark:text-gray-400">View your part request history and status</p>
          </div>
          <Button onClick={exportTransactions} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockTransactions.length}</p>
                </div>
                <History className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {mockTransactions.filter((t) => t.status === "Pending").length}
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
                    {mockTransactions.filter((t) => t.status === "Approved" || t.status === "Delivered").length}
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mockTransactions.filter((t) => t.status === "Rejected").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-gray-500 flex items-center">
                Showing {filteredTransactions.length} of {mockTransactions.length} transactions
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Complete history of your part requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {getStatusIcon(transaction.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{transaction.partName}</h3>
                          <Badge variant="outline">{transaction.partNumber}</Badge>
                          <Badge className={getPriorityColor(transaction.priority)}>{transaction.priority}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Quantity: {transaction.quantity} • Ship: {transaction.ship} • Reason: {transaction.reason}
                        </p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Requested: {format(transaction.requestedAt, "MMM dd, yyyy 'at' HH:mm")}</p>
                          {transaction.approvedAt && (
                            <p>
                              Approved: {format(transaction.approvedAt, "MMM dd, yyyy 'at' HH:mm")} by{" "}
                              {transaction.approvedBy}
                            </p>
                          )}
                          {transaction.deliveredAt && (
                            <p>Delivered: {format(transaction.deliveredAt, "MMM dd, yyyy 'at' HH:mm")}</p>
                          )}
                          {transaction.rejectedAt && (
                            <p>
                              Rejected: {format(transaction.rejectedAt, "MMM dd, yyyy 'at' HH:mm")} by{" "}
                              {transaction.rejectedBy}
                            </p>
                          )}
                          {transaction.rejectionReason && (
                            <p className="text-red-600">Reason: {transaction.rejectionReason}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      <p className="text-xs text-gray-500 mt-1">{transaction.id}</p>
                      <div className="flex justify-end gap-1 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTransaction(transaction.id)}
                          title="View Details"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {transaction.status === "Rejected" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResubmitRequest(transaction.id)}
                            title="Resubmit Request"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details Dialog */}
        <Dialog open={showTransactionDetails} onOpenChange={setShowTransactionDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>Complete information about your request {selectedTransaction}</DialogDescription>
            </DialogHeader>
            {getSelectedTransactionDetails() && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Request ID</label>
                    <p className="font-mono">{getSelectedTransactionDetails()?.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <p>
                      <Badge className={getPriorityColor(getSelectedTransactionDetails()?.priority || "")}>
                        {getSelectedTransactionDetails()?.priority}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Part</label>
                    <p className="font-medium">{getSelectedTransactionDetails()?.partName}</p>
                    <p className="text-sm text-gray-500">{getSelectedTransactionDetails()?.partNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Quantity</label>
                    <p>{getSelectedTransactionDetails()?.quantity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ship</label>
                    <p>{getSelectedTransactionDetails()?.ship}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p>
                      <Badge className={getStatusColor(getSelectedTransactionDetails()?.status || "")}>
                        {getSelectedTransactionDetails()?.status}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Requested</label>
                    <p>
                      {format(getSelectedTransactionDetails()?.requestedAt || new Date(), "MMM dd, yyyy 'at' HH:mm")}
                    </p>
                  </div>
                  {getSelectedTransactionDetails()?.approvedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Approved</label>
                      <p>
                        {format(getSelectedTransactionDetails()?.approvedAt || new Date(), "MMM dd, yyyy 'at' HH:mm")}
                      </p>
                      <p className="text-sm text-gray-500">by {getSelectedTransactionDetails()?.approvedBy}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reason</label>
                  <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    {getSelectedTransactionDetails()?.reason}
                  </p>
                </div>
                {getSelectedTransactionDetails()?.rejectionReason && (
                  <div>
                    <label className="text-sm font-medium text-red-600">Rejection Reason</label>
                    <p className="mt-1 p-3 bg-red-50 dark:bg-red-900/20 rounded-md text-red-700 dark:text-red-300">
                      {getSelectedTransactionDetails()?.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </StaffLayout>
  )
}
