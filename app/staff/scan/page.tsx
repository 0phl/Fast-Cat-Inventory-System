"use client"

import { useState, useRef, useEffect } from "react"
import { StaffLayout } from "@/components/layouts/staff-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { QrCode, Camera, Search, Package, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Mock parts data
const mockParts = [
  {
    id: "EF-2024",
    name: "Engine Filter",
    stock: 15,
    category: "Engine",
    location: "A1-B2",
    description: "High-performance engine filter for marine diesel engines",
    specifications: "Compatible with CAT 3406E, 3412, C15 engines",
    price: "$45.99",
    supplier: "Marine Parts Co.",
  },
  {
    id: "HP-150",
    name: "Hydraulic Pump",
    stock: 3,
    category: "Hydraulic",
    location: "B2-C3",
    description: "Heavy-duty hydraulic pump for steering systems",
    specifications: "Flow rate: 150 GPM, Max pressure: 3000 PSI",
    price: "$299.99",
    supplier: "HydroTech Ltd.",
  },
  {
    id: "NL-LED",
    name: "Navigation Light LED",
    stock: 8,
    category: "Electrical",
    location: "C1-A4",
    description: "LED navigation light for marine vessels",
    specifications: "12V DC, IP67 rated, 5W consumption",
    price: "$89.50",
    supplier: "NaviLight Systems",
  },
  {
    id: "BF-300",
    name: "Brake Fluid",
    stock: 12,
    category: "Fluid",
    location: "D1-B1",
    description: "DOT 4 brake fluid for marine applications",
    specifications: "1 liter bottle, DOT 4 specification",
    price: "$24.99",
    supplier: "Marine Fluids Inc.",
  },
]

export default function ScanQRPage() {
  const [scannedCode, setScannedCode] = useState("")
  const [manualCode, setManualCode] = useState("")
  const [foundPart, setFoundPart] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState("")
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [requestQuantity, setRequestQuantity] = useState("")
  const [requestPriority, setRequestPriority] = useState("")
  const [requestNotes, setRequestNotes] = useState("")
  const [requestSubmitted, setRequestSubmitted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const searchPart = (code: string) => {
    const part = mockParts.find((p) => p.id === code.toUpperCase())
    if (part) {
      setFoundPart(part)
      setError("")
    } else {
      setFoundPart(null)
      setError("Part not found. Please check the code and try again.")
    }
  }

  const handleManualSearch = () => {
    if (manualCode.trim()) {
      searchPart(manualCode.trim())
      setScannedCode(manualCode.trim())
    }
  }

  const handleRequestSubmit = () => {
    if (!requestQuantity || !requestPriority) {
      return
    }

    // Simulate request submission
    setRequestSubmitted(true)
    setTimeout(() => {
      setShowRequestDialog(false)
      setRequestSubmitted(false)
      setRequestQuantity("")
      setRequestPriority("")
      setRequestNotes("")
    }, 2000)
  }

  const startCamera = async () => {
    try {
      setIsScanning(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError("Camera access denied. Please use manual input.")
      setIsScanning(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setIsScanning(false)
  }

  const simulateQRScan = () => {
    // Simulate scanning a random part for demo
    const randomPart = mockParts[Math.floor(Math.random() * mockParts.length)]
    setScannedCode(randomPart.id)
    searchPart(randomPart.id)
    stopCamera()
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <StaffLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">QR Code Scanner</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Scan or enter part codes to quickly access inventory information
          </p>
        </div>

        {/* Scanner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Scanner
              </CardTitle>
              <CardDescription>Point your camera at a QR code to scan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isScanning ? (
                <div className="text-center space-y-4">
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                  <Button onClick={startCamera} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-48 bg-black rounded-lg" />
                  <div className="flex gap-2">
                    <Button onClick={simulateQRScan} className="flex-1">
                      Simulate Scan
                    </Button>
                    <Button onClick={stopCamera} variant="outline">
                      Stop Camera
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Manual Input
              </CardTitle>
              <CardDescription>Enter part number manually if QR code is not available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Enter part number (e.g., EF-2024)"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleManualSearch()}
                />
                <Button onClick={handleManualSearch} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search Part
                </Button>
              </div>

              {scannedCode && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Last Scanned: {scannedCode}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Part Information */}
        {foundPart && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Part Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">{foundPart.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">Part Number: {foundPart.id}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{foundPart.category}</Badge>
                    <span className="text-sm">
                      <span className="font-medium">Stock:</span> {foundPart.stock} units
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Location:</p>
                    <p className="text-lg font-mono">{foundPart.location}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full">Request This Part</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Request Part: {foundPart.name}</DialogTitle>
                        <DialogDescription>
                          Submit a request for this part. Your request will be reviewed by management.
                        </DialogDescription>
                      </DialogHeader>

                      {!requestSubmitted ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Quantity Needed</label>
                            <Input
                              type="number"
                              placeholder="Enter quantity"
                              value={requestQuantity}
                              onChange={(e) => setRequestQuantity(e.target.value)}
                              min="1"
                              max={foundPart.stock}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Priority Level</label>
                            <Select value={requestPriority} onValueChange={setRequestPriority}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low - Routine maintenance</SelectItem>
                                <SelectItem value="medium">Medium - Scheduled repair</SelectItem>
                                <SelectItem value="high">High - Urgent repair</SelectItem>
                                <SelectItem value="critical">Critical - Safety issue</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Additional Notes (Optional)</label>
                            <Textarea
                              placeholder="Describe the reason for this request..."
                              value={requestNotes}
                              onChange={(e) => setRequestNotes(e.target.value)}
                              rows={3}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handleRequestSubmit}
                              disabled={!requestQuantity || !requestPriority}
                              className="flex-1"
                            >
                              Submit Request
                            </Button>
                            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                            Request Submitted Successfully!
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Your request has been sent to management for approval.
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full bg-transparent">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          {foundPart.name}
                        </DialogTitle>
                        <DialogDescription>Complete part information and specifications</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Part Number</label>
                            <p className="font-mono text-lg">{foundPart.id}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Category</label>
                            <p>{foundPart.category}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Current Stock</label>
                            <p className="text-lg font-semibold">{foundPart.stock} units</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Location</label>
                            <p className="font-mono">{foundPart.location}</p>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">Description</label>
                          <p className="text-sm">{foundPart.description}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">Specifications</label>
                          <p className="text-sm">{foundPart.specifications}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Price</label>
                            <p className="text-lg font-semibold text-green-600">{foundPart.price}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Supplier</label>
                            <p className="text-sm">{foundPart.supplier}</p>
                          </div>
                        </div>

                        <Button onClick={() => setShowDetailsDialog(false)} className="w-full">
                          Close
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Access Parts */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Frequently requested parts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockParts.map((part) => (
                <div
                  key={part.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    setScannedCode(part.id)
                    searchPart(part.id)
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{part.category}</Badge>
                    <QrCode className="h-4 w-4 text-gray-400" />
                  </div>
                  <h4 className="font-medium mb-1">{part.name}</h4>
                  <p className="text-sm text-gray-500">{part.id}</p>
                  <p className="text-xs text-gray-400 mt-1">Stock: {part.stock}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StaffLayout>
  )
}
