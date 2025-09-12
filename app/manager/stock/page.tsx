"use client"

import type React from "react"

import { useState, useMemo, useRef, useCallback } from "react"
import { ManagerLayout } from "@/components/layouts/manager-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Minus, QrCode, CheckCircle, Scan, Camera } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data for parts
const mockParts = [
  { id: "EF-2024", name: "Engine Filter", category: "Engine", stock: 15, location: "A1-B2", minStock: 5 },
  { id: "NL-LED", name: "Navigation Light LED", category: "Electrical", stock: 8, location: "C3-D4", minStock: 3 },
  { id: "HP-150", name: "Hydraulic Pump", category: "Hydraulic", stock: 3, location: "E5-F6", minStock: 2 },
  { id: "CB-12V", name: "Circuit Breaker 12V", category: "Electrical", stock: 12, location: "G7-H8", minStock: 4 },
  { id: "FH-STD", name: "Fire Hose Standard", category: "Safety", stock: 6, location: "I9-J10", minStock: 2 },
  { id: "PV-25", name: "Pressure Valve 25mm", category: "Hydraulic", stock: 9, location: "K11-L12", minStock: 3 },
]

export default function ManagerStockPage() {
  const [activeTab, setActiveTab] = useState("stock-in")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPart, setSelectedPart] = useState<(typeof mockParts)[0] | null>(null)
  const [quantity, setQuantity] = useState("")
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [notes, setNotes] = useState("")
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredParts = useMemo(() => {
    if (!searchTerm) return mockParts
    return mockParts.filter(
      (part) =>
        part.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handlePartSelect = useCallback((part: (typeof mockParts)[0]) => {
    setSelectedPart(part)
    setQuantity("")
    setSource("")
    setDestination("")
    setNotes("")
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPart || !quantity) return

    const action = activeTab === "stock-in" ? "Stock In" : "Stock Out"
    console.log(`${action} submitted:`, {
      part: selectedPart,
      quantity: Number.parseInt(quantity),
      source: activeTab === "stock-in" ? source : undefined,
      destination: activeTab === "stock-out" ? destination : undefined,
      notes,
    })

    // Reset form
    setQuantity("")
    setSource("")
    setDestination("")
    setNotes("")
    alert(`${action} request submitted successfully!`)
  }

  const handleQRScan = () => {
    setShowQRScanner(true)
  }

  const handleBarcodeScan = () => {
    setShowBarcodeScanner(true)
  }

  const handleScanResult = (result: string) => {
    // Find part by scanned code
    const foundPart = mockParts.find(
      (part) =>
        part.id.toLowerCase() === result.toLowerCase() || part.name.toLowerCase().includes(result.toLowerCase()),
    )

    if (foundPart) {
      handlePartSelect(foundPart)
      setSearchTerm(result)
    } else {
      setSearchTerm(result)
    }

    setShowQRScanner(false)
    setShowBarcodeScanner(false)
  }

  const simulateScan = (type: "qr" | "barcode") => {
    // Simulate scanning one of the existing parts
    const sampleResults = ["EF-2024", "HP-150", "NL-LED", "CB-12V"]
    const randomResult = sampleResults[Math.floor(Math.random() * sampleResults.length)]

    setTimeout(() => {
      handleScanResult(randomResult)
    }, 2000) // Simulate 2 second scan time
  }

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
          <p className="text-muted-foreground">Add or remove parts from inventory</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stock-in" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Stock In
            </TabsTrigger>
            <TabsTrigger value="stock-out" className="flex items-center gap-2">
              <Minus className="h-4 w-4" />
              Stock Out
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stock-in" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  Add Stock
                </CardTitle>
                <CardDescription>Add new parts to inventory or increase existing stock</CardDescription>
              </CardHeader>
              <CardContent>
                <StockForm
                  type="in"
                  searchTerm={searchTerm}
                  searchInputRef={searchInputRef}
                  handleSearchChange={handleSearchChange}
                  filteredParts={filteredParts}
                  selectedPart={selectedPart}
                  handlePartSelect={handlePartSelect}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  source={source}
                  setSource={setSource}
                  notes={notes}
                  setNotes={setNotes}
                  handleSubmit={handleSubmit}
                  handleQRScan={handleQRScan}
                  handleBarcodeScan={handleBarcodeScan}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock-out" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Minus className="h-5 w-5 text-red-600" />
                  Remove Stock
                </CardTitle>
                <CardDescription>Remove parts from inventory or reduce existing stock</CardDescription>
              </CardHeader>
              <CardContent>
                <StockForm
                  type="out"
                  searchTerm={searchTerm}
                  searchInputRef={searchInputRef}
                  handleSearchChange={handleSearchChange}
                  filteredParts={filteredParts}
                  selectedPart={selectedPart}
                  handlePartSelect={handlePartSelect}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  destination={destination}
                  setDestination={setDestination}
                  notes={notes}
                  setNotes={setNotes}
                  handleSubmit={handleSubmit}
                  handleQRScan={handleQRScan}
                  handleBarcodeScan={handleBarcodeScan}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Scanner
            </DialogTitle>
            <DialogDescription>Position the QR code within the camera frame to scan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500 mb-4">Camera preview would appear here</p>
                <Button onClick={() => simulateScan("qr")} className="bg-blue-600 hover:bg-blue-700">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Scanning
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowQRScanner(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Barcode Scanner
            </DialogTitle>
            <DialogDescription>Position the barcode within the camera frame to scan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Scan className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500 mb-4">Camera preview would appear here</p>
                <Button onClick={() => simulateScan("barcode")} className="bg-blue-600 hover:bg-blue-700">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Scanning
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowBarcodeScanner(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ManagerLayout>
  )
}

interface StockFormProps {
  type: "in" | "out"
  searchTerm: string
  searchInputRef: React.RefObject<HTMLInputElement>
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  filteredParts: typeof mockParts
  selectedPart: (typeof mockParts)[0] | null
  handlePartSelect: (part: (typeof mockParts)[0]) => void
  quantity: string
  setQuantity: (value: string) => void
  source?: string
  setSource?: (value: string) => void
  destination?: string
  setDestination?: (value: string) => void
  notes: string
  setNotes: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  handleQRScan?: () => void
  handleBarcodeScan?: () => void
}

function StockForm({
  type,
  searchTerm,
  searchInputRef,
  handleSearchChange,
  filteredParts,
  selectedPart,
  handlePartSelect,
  quantity,
  setQuantity,
  source,
  setSource,
  destination,
  setDestination,
  notes,
  setNotes,
  handleSubmit,
  handleQRScan,
  handleBarcodeScan,
}: StockFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Part Selection */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search Part</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                ref={searchInputRef}
                id="search"
                placeholder="Search parts by number, name, or category..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{filteredParts.length} parts available</p>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredParts.map((part) => (
              <Card
                key={part.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPart?.id === part.id ? "border-2 border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => handlePartSelect(part)}
                onMouseDown={(e) => e.preventDefault()}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{part.id}</h3>
                        {selectedPart?.id === part.id && <CheckCircle className="h-4 w-4 text-blue-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{part.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {part.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Stock: {part.stock}</p>
                      <p className="text-xs text-muted-foreground">{part.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column - Transaction Form */}
        <div className="space-y-4">
          {selectedPart && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Selected Part</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-900">{selectedPart.id}</h3>
                  <p className="text-blue-700">{selectedPart.name}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline">{selectedPart.category}</Badge>
                    <span className="text-blue-600">Current Stock: {selectedPart.stock}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={type === "out" ? selectedPart?.stock : undefined}
            />
          </div>

          {type === "in" && setSource && (
            <div>
              <Label htmlFor="source">Source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "out" && setDestination && (
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="disposal">Disposal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className={`flex-1 ${type === "in" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              disabled={!selectedPart || !quantity}
            >
              {type === "in" ? (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Stock
                </>
              ) : (
                <>
                  <Minus className="mr-2 h-4 w-4" />
                  Remove from Stock
                </>
              )}
            </Button>
            {handleQRScan && (
              <Button type="button" variant="outline" className="px-3 bg-transparent" onClick={handleQRScan}>
                <QrCode className="h-4 w-4" />
              </Button>
            )}
            {handleBarcodeScan && (
              <Button type="button" variant="outline" className="px-3 bg-transparent" onClick={handleBarcodeScan}>
                <Scan className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
