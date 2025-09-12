"use client"

import { useState } from "react"
import { StaffLayout } from "@/components/layouts/staff-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Package, Send, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data
const mockParts = [
  { id: "EF-2024", name: "Engine Filter", stock: 15, category: "Engine", location: "A1-B2" },
  { id: "HP-150", name: "Hydraulic Pump", stock: 3, category: "Hydraulic", location: "B2-C3" },
  { id: "NL-LED", name: "Navigation Light LED", stock: 8, category: "Electrical", location: "C1-A4" },
  { id: "BF-300", name: "Brake Fluid", stock: 12, category: "Fluid", location: "D1-B1" },
  { id: "SF-200", name: "Safety Fuse", stock: 25, category: "Electrical", location: "C2-D1" },
  { id: "GB-450", name: "Gear Box", stock: 2, category: "Mechanical", location: "E1-F2" },
]

const ships = ["FastCat M1", "FastCat M2", "FastCat M3", "FastCat Express"]
const priorities = ["Low", "Medium", "High", "Urgent"]

export default function RequestPartsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParts, setSelectedParts] = useState<any[]>([])
  const [requestForm, setRequestForm] = useState({
    ship: "",
    priority: "Medium",
    reason: "",
    notes: "",
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const filteredParts = mockParts.filter(
    (part) =>
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addPartToRequest = (part: any) => {
    const existingPart = selectedParts.find((p) => p.id === part.id)
    if (existingPart) {
      setSelectedParts(selectedParts.map((p) => (p.id === part.id ? { ...p, quantity: p.quantity + 1 } : p)))
    } else {
      setSelectedParts([...selectedParts, { ...part, quantity: 1 }])
    }
  }

  const updatePartQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedParts(selectedParts.filter((p) => p.id !== partId))
    } else {
      setSelectedParts(selectedParts.map((p) => (p.id === partId ? { ...p, quantity } : p)))
    }
  }

  const submitRequest = () => {
    if (selectedParts.length === 0 || !requestForm.ship || !requestForm.reason) {
      return
    }

    // Simulate request submission
    setShowSuccess(true)
    setSelectedParts([])
    setRequestForm({ ship: "", priority: "Medium", reason: "", notes: "" })

    setTimeout(() => setShowSuccess(false), 5000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
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

  return (
    <StaffLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Request Parts</h1>
          <p className="text-gray-600 dark:text-gray-400">Submit requests for parts needed for your vessel</p>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Your part request has been submitted successfully and is pending approval.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parts Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Select Parts
              </CardTitle>
              <CardDescription>Search and add parts to your request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search parts by name, number, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Parts List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredParts.map((part) => (
                  <div
                    key={part.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{part.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {part.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {part.id} • Stock: {part.stock}
                      </p>
                    </div>
                    <Button size="sm" onClick={() => addPartToRequest(part)} disabled={part.stock === 0}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Request Details
              </CardTitle>
              <CardDescription>Complete your part request information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Parts */}
              {selectedParts.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Parts ({selectedParts.length})</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-2">
                    {selectedParts.map((part) => (
                      <div key={part.id} className="flex items-center justify-between text-sm">
                        <span>
                          {part.name} ({part.id})
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePartQuantity(part.id, part.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{part.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePartQuantity(part.id, part.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ship Selection */}
              <div className="space-y-2">
                <Label htmlFor="ship">Ship/Vessel *</Label>
                <Select
                  value={requestForm.ship}
                  onValueChange={(value) => setRequestForm({ ...requestForm, ship: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your ship" />
                  </SelectTrigger>
                  <SelectContent>
                    {ships.map((ship) => (
                      <SelectItem key={ship} value={ship}>
                        {ship}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={requestForm.priority}
                  onValueChange={(value) => setRequestForm({ ...requestForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(priority)}>{priority}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Request *</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Maintenance, Repair, Replacement"
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information or special requirements..."
                  value={requestForm.notes}
                  onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={submitRequest}
                disabled={selectedParts.length === 0 || !requestForm.ship || !requestForm.reason}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </StaffLayout>
  )
}
