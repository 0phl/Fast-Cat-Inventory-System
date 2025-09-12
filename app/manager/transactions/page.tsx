"use client"

import { useState } from "react"
import { ManagerLayout } from "@/components/layouts/manager-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Eye, Calendar, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { toast } from "@/hooks/use-toast"

// Mock transaction data
const mockTransactions = [
  {
    id: "TXN-001",
    type: "Stock In",
    partName: "Engine Oil Filter",
    partNumber: "ENG-001",
    quantity: 50,
    ship: "FastCat M1",
    user: "John Doe",
    timestamp: new Date("2024-01-15T10:30:00"),
    status: "Completed",
    notes: "Regular maintenance stock replenishment",
  },
  {
    id: "TXN-002",
    type: "Stock Out",
    partName: "Brake Pads",
    partNumber: "BRK-005",
    quantity: 8,
    ship: "FastCat M2",
    user: "Jane Smith",
    timestamp: new Date("2024-01-15T14:45:00"),
    status: "Completed",
    notes: "Emergency brake maintenance",
  },
  {
    id: "TXN-003",
    type: "Stock In",
    partName: "Hydraulic Fluid",
    partNumber: "HYD-003",
    quantity: 25,
    ship: "FastCat M3",
    user: "Mike Johnson",
    timestamp: new Date("2024-01-16T09:15:00"),
    status: "Pending",
    notes: "Scheduled delivery from supplier",
  },
  {
    id: "TXN-004",
    type: "Stock Out",
    partName: "Air Filter",
    partNumber: "AIR-002",
    quantity: 12,
    ship: "FastCat M1",
    user: "Sarah Wilson",
    timestamp: new Date("2024-01-16T16:20:00"),
    status: "Completed",
    notes: "Routine filter replacement",
  },
  {
    id: "TXN-005",
    type: "Stock In",
    partName: "Fuel Injector",
    partNumber: "FUE-007",
    quantity: 6,
    ship: "FastCat M2",
    user: "Tom Brown",
    timestamp: new Date("2024-01-17T11:00:00"),
    status: "Failed",
    notes: "Quality check failed - returned to supplier",
  },
]

export default function ManagerTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [showDatePicker, setShowDatePicker] = useState(false)

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.ship.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus

    const matchesDateRange =
      !dateRange?.from ||
      !dateRange?.to ||
      (transaction.timestamp >= dateRange.from && transaction.timestamp <= dateRange.to)

    return matchesSearch && matchesType && matchesStatus && matchesDateRange
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    return type === "Stock In"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
  }

  const handleViewTransaction = (transactionId: string) => {
    setSelectedTransaction(transactionId)
    setShowTransactionDetails(true)
  }

  const handleApproveTransaction = (transactionId: string) => {
    console.log(`Manager approving transaction ${transactionId}`)
    // In a real app, this would make an API call
  }

  const handleExport = () => {
    const csvHeaders = [
      "Transaction ID",
      "Type",
      "Part Name",
      "Part Number",
      "Quantity",
      "Ship",
      "User",
      "Date",
      "Status",
      "Notes",
    ]
    const csvData = filteredTransactions.map((transaction) => [
      transaction.id,
      transaction.type,
      transaction.partName,
      transaction.partNumber,
      transaction.quantity,
      transaction.ship,
      transaction.user,
      format(transaction.timestamp, "yyyy-MM-dd HH:mm:ss"),
      transaction.status,
      transaction.notes,
    ])

    const csvContent = [csvHeaders, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `manager_transactions_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Successful",
      description: `Exported ${filteredTransactions.length} transactions to CSV file.`,
    })
  }

  const handleDateRangeReset = () => {
    setDateRange(undefined)
    setShowDatePicker(false)
    toast({
      title: "Date Filter Cleared",
      description: "Showing all transactions.",
    })
  }

  const getSelectedTransactionDetails = () => {
    return mockTransactions.find((t) => t.id === selectedTransaction)
  }

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction Logs</h1>
            <p className="text-gray-600 dark:text-gray-400">View all inventory movements and operations</p>
          </div>
          <div className="flex gap-2">
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Date Range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
                <div className="p-3 border-t flex justify-between">
                  <Button variant="outline" size="sm" onClick={handleDateRangeReset}>
                    Clear
                  </Button>
                  <Button size="sm" onClick={() => setShowDatePicker(false)}>
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockTransactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockTransactions.filter((t) => t.status === "Completed").length}
                  </p>
                </div>
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
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mockTransactions.filter((t) => t.status === "Failed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View and monitor all inventory transactions
              {(dateRange?.from || filterType !== "all" || filterStatus !== "all") && (
                <span className="ml-2 text-sm text-blue-600">({filteredTransactions.length} filtered results)</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Stock In">Stock In</SelectItem>
                  <SelectItem value="Stock Out">Stock Out</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transactions Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Part</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Ship</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(transaction.type)}>{transaction.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.partName}</p>
                          <p className="text-sm text-gray-500">{transaction.partNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{transaction.ship}</TableCell>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell>{format(transaction.timestamp, "MMM dd, yyyy HH:mm")}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTransaction(transaction.id)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {transaction.status === "Pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApproveTransaction(transaction.id)}
                              title="Approve Transaction"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No transactions found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showTransactionDetails} onOpenChange={setShowTransactionDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>Complete information about transaction {selectedTransaction}</DialogDescription>
            </DialogHeader>
            {getSelectedTransactionDetails() && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                    <p className="font-mono">{getSelectedTransactionDetails()?.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p>
                      <Badge className={getTypeColor(getSelectedTransactionDetails()?.type || "")}>
                        {getSelectedTransactionDetails()?.type}
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
                    <label className="text-sm font-medium text-gray-500">User</label>
                    <p>{getSelectedTransactionDetails()?.user}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date & Time</label>
                    <p>{format(getSelectedTransactionDetails()?.timestamp || new Date(), "MMM dd, yyyy 'at' HH:mm")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p>
                      <Badge className={getStatusColor(getSelectedTransactionDetails()?.status || "")}>
                        {getSelectedTransactionDetails()?.status}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    {getSelectedTransactionDetails()?.notes}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ManagerLayout>
  )
}
