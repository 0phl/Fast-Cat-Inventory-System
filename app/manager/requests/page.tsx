"use client"

import { useState } from "react"
import { ManagerLayout } from "@/components/layouts/manager-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, CheckCircle, XCircle, Clock, Eye, AlertTriangle } from "lucide-react"
import { format } from "date-fns"

interface StaffRequest {
  id: string
  staffName: string
  staffId: string
  partName: string
  partNumber: string
  quantity: number
  ship: string
  priority: "Low" | "Medium" | "High" | "Critical"
  reason: string
  requestDate: Date
  status: "Pending" | "Approved" | "Rejected"
  notes?: string
}

export default function ManagerRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<StaffRequest | null>(null)
  const [actionDialog, setActionDialog] = useState<{ type: "approve" | "reject"; request: StaffRequest } | null>(null)
  const [actionNotes, setActionNotes] = useState("")

  // Mock staff requests data
  const staffRequests: StaffRequest[] = [
    {
      id: "REQ-001",
      staffName: "Mike Johnson",
      staffId: "STF-001",
      partName: "Engine Oil Filter",
      partNumber: "ENG-001",
      quantity: 5,
      ship: "FastCat M1",
      priority: "High",
      reason: "Emergency maintenance - oil leak detected",
      requestDate: new Date("2024-01-15T10:30:00"),
      status: "Pending",
    },
    {
      id: "REQ-002",
      staffName: "Sarah Wilson",
      staffId: "STF-002",
      partName: "Brake Pads Set",
      partNumber: "BRK-005",
      quantity: 2,
      ship: "FastCat M2",
      priority: "Medium",
      reason: "Scheduled maintenance replacement",
      requestDate: new Date("2024-01-15T14:45:00"),
      status: "Pending",
    },
    {
      id: "REQ-003",
      staffName: "Tom Brown",
      staffId: "STF-003",
      partName: "Hydraulic Fluid",
      partNumber: "HYD-003",
      quantity: 10,
      ship: "FastCat M3",
      priority: "Critical",
      reason: "Hydraulic system failure - immediate replacement needed",
      requestDate: new Date("2024-01-16T09:15:00"),
      status: "Pending",
    },
    {
      id: "REQ-004",
      staffName: "Lisa Davis",
      staffId: "STF-004",
      partName: "Air Filter",
      partNumber: "AIR-002",
      quantity: 3,
      ship: "FastCat M1",
      priority: "Low",
      reason: "Routine filter replacement",
      requestDate: new Date("2024-01-16T16:20:00"),
      status: "Approved",
      notes: "Approved for routine maintenance schedule",
    },
    {
      id: "REQ-005",
      staffName: "James Miller",
      staffId: "STF-005",
      partName: "Fuel Injector",
      partNumber: "FUE-007",
      quantity: 1,
      ship: "FastCat M2",
      priority: "Medium",
      reason: "Performance issues detected during inspection",
      requestDate: new Date("2024-01-17T11:00:00"),
      status: "Rejected",
      notes: "Insufficient justification - please provide detailed diagnostic report",
    },
  ]

  const filteredRequests = staffRequests.filter((request) => {
    const matchesSearch =
      request.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.ship.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    const matchesPriority = filterPriority === "all" || request.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
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

  const handleApproveReject = (action: "approve" | "reject", request: StaffRequest) => {
    setActionDialog({ type: action, request })
    setActionNotes("")
  }

  const confirmAction = () => {
    if (actionDialog) {
      // Here you would typically make an API call to update the request status
      console.log(`${actionDialog.type} request ${actionDialog.request.id} with notes: ${actionNotes}`)
      setActionDialog(null)
      setActionNotes("")
    }
  }

  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Requests</h1>
            <p className="text-gray-600 dark:text-gray-400">Review and approve staff part requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{staffRequests.length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {staffRequests.filter((r) => r.status === "Pending").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {staffRequests.filter((r) => r.status === "Approved").length}
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
                    {staffRequests.filter((r) => r.status === "Rejected").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Request Management</CardTitle>
            <CardDescription>Review and process staff part requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Requests Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Part</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Ship</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.staffName}</p>
                          <p className="text-sm text-gray-500">{request.staffId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.partName}</p>
                          <p className="text-sm text-gray-500">{request.partNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>{request.quantity}</TableCell>
                      <TableCell>{request.ship}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                      </TableCell>
                      <TableCell>{format(request.requestDate, "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(request)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.status === "Pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleApproveReject("approve", request)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleApproveReject("reject", request)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No requests found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request Details Dialog */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>Review the complete request information</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Request ID</label>
                    <p className="font-medium">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Badge className={getStatusColor(selectedRequest.status)}>{selectedRequest.status}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Staff Member</label>
                    <p className="font-medium">{selectedRequest.staffName}</p>
                    <p className="text-sm text-gray-500">{selectedRequest.staffId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ship</label>
                    <p className="font-medium">{selectedRequest.ship}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Part</label>
                    <p className="font-medium">{selectedRequest.partName}</p>
                    <p className="text-sm text-gray-500">{selectedRequest.partNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Quantity</label>
                    <p className="font-medium">{selectedRequest.quantity}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Priority</label>
                  <Badge className={getPriorityColor(selectedRequest.priority)}>{selectedRequest.priority}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Reason</label>
                  <p className="text-gray-900">{selectedRequest.reason}</p>
                </div>
                {selectedRequest.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Manager Notes</label>
                    <p className="text-gray-900">{selectedRequest.notes}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Request Date</label>
                  <p className="text-gray-900">{format(selectedRequest.requestDate, "PPP 'at' p")}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Action Dialog */}
        <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{actionDialog?.type === "approve" ? "Approve Request" : "Reject Request"}</DialogTitle>
              <DialogDescription>
                {actionDialog?.type === "approve"
                  ? "Confirm approval of this part request"
                  : "Provide a reason for rejecting this request"}
              </DialogDescription>
            </DialogHeader>
            {actionDialog && (
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{actionDialog.request.partName}</p>
                  <p className="text-sm text-gray-600">
                    Requested by {actionDialog.request.staffName} • Quantity: {actionDialog.request.quantity}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {actionDialog.type === "approve" ? "Approval Notes (Optional)" : "Rejection Reason (Required)"}
                  </label>
                  <Textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder={
                      actionDialog.type === "approve"
                        ? "Add any notes about this approval..."
                        : "Explain why this request is being rejected..."
                    }
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setActionDialog(null)}>
                    Cancel
                  </Button>
                  <Button
                    className={
                      actionDialog.type === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                    onClick={confirmAction}
                    disabled={actionDialog.type === "reject" && !actionNotes.trim()}
                  >
                    {actionDialog.type === "approve" ? "Approve" : "Reject"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ManagerLayout>
  )
}
