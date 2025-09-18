"use client"

import type React from "react"

import { useEffect, useState, useMemo, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUp, ArrowDown, QrCode, Search, Package, Scan, Check, X, Camera } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function StockPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPart, setSelectedPart] = useState<any>(null)
  const [quantity, setQuantity] = useState("")
  const [selectedShip, setSelectedShip] = useState("")
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [scanResult, setScanResult] = useState("")
  const router = useRouter()

  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    if (!token) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const parts = [
    { id: "1", partNumber: "EF-2024", description: "Engine Filter", currentStock: 15, category: "Engine" },
    { id: "2", partNumber: "HP-150", description: "Hydraulic Pump", currentStock: 3, category: "Hydraulic" },
    { id: "3", partNumber: "NL-LED", description: "Navigation Light LED", currentStock: 8, category: "Electrical" },
    { id: "4", partNumber: "BP-300", description: "Brake Pad Set", currentStock: 12, category: "Brake" },
    { id: "5", partNumber: "SF-450", description: "Safety Flare", currentStock: 25, category: "Safety" },
    { id: "6", partNumber: "CB-200", description: "Circuit Breaker", currentStock: 6, category: "Electrical" },
  ]

  const ships = ["FastCat M1", "FastCat M2", "FastCat M3", "FastCat Express", "Warehouse"]

  const filteredParts = useMemo(() => {
    return parts.filter(
      (part) =>
        part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handlePartSelect = useCallback((part: any) => {
    setSelectedPart(part)
    // Keep focus on search input after selection
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }, 0)
  }, [])

  const handleQRScan = () => {
    setShowQRScanner(true)
  }

  const handleBarcodeScan = () => {
    setShowBarcodeScanner(true)
  }

  const handleScanResult = (result: string) => {
    setScanResult(result)
    // Find part by scanned code
    const foundPart = parts.find(
      (part) =>
        part.partNumber.toLowerCase() === result.toLowerCase() ||
        part.description.toLowerCase().includes(result.toLowerCase()),
    )

    if (foundPart) {
      setSelectedPart(foundPart)
      setSearchTerm(result)
    } else {
      setSearchTerm(result)
    }

    setShowQRScanner(false)
    setShowBarcodeScanner(false)
  }

  const simulateScan = (type: "qr" | "barcode") => {
    // Simulate scanning one of the existing parts
    const sampleResults = ["EF-2024", "HP-150", "NL-LED", "BP-300"]
    const randomResult = sampleResults[Math.floor(Math.random() * sampleResults.length)]

    setTimeout(() => {
      handleScanResult(randomResult)
    }, 2000) // Simulate 2 second scan time
  }

  if (!isAuthenticated) {
    return null
  }

  const handleStockIn = () => {
    console.log("Stock In:", { selectedPart, quantity, selectedShip })
    setSelectedPart(null)
    setQuantity("")
    setSelectedShip("")
  }

  const handleStockOut = () => {
    console.log("Stock Out:", { selectedPart, quantity, selectedShip })
    setSelectedPart(null)
    setQuantity("")
    setSelectedShip("")
  }

  const StockForm = ({ type }: { type: "in" | "out" }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">Select Part</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              ref={searchInputRef}
              placeholder="Search parts by number, name, or category..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-12 h-12 text-base border-2 focus:border-blue-500"
              autoComplete="off"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {searchTerm ? `${filteredParts.length} parts found` : `${parts.length} parts available`}
          </p>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {filteredParts.map((part) => (
            <Card
              key={part.id}
              className={`cursor-pointer transition-all duration-200 m-1 ${
                selectedPart?.id === part.id
                  ? "border-2 border-blue-500 bg-blue-50 shadow-lg"
                  : "hover:shadow-md hover:border-gray-300 border-gray-200 border"
              }`}
              onClick={() => handlePartSelect(part)}
              onMouseDown={(e) => {
                e.preventDefault()
              }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{part.partNumber}</h4>
                      {selectedPart?.id === part.id && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 mb-1">{part.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {part.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={part.currentStock < 5 ? "destructive" : part.currentStock < 10 ? "default" : "outline"}
                      className="font-medium"
                    >
                      Stock: {part.currentStock}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredParts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h4 className="text-lg font-medium mb-2">No parts found</h4>
              <p className="text-sm">Try different search terms</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {selectedPart ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-blue-900">Selected Part</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPart(null)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-blue-900">{selectedPart.partNumber}</p>
                <p className="text-blue-800">{selectedPart.description}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">{selectedPart.category}</Badge>
                  <Badge variant={selectedPart.currentStock < 5 ? "destructive" : "outline"}>
                    Current Stock: {selectedPart.currentStock}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-2 block">Quantity</Label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  max={type === "out" ? selectedPart.currentStock : undefined}
                  className="h-12 text-base border-2 focus:border-blue-500"
                />
                {type === "out" && (
                  <p className="text-sm text-gray-500 mt-1">Maximum available: {selectedPart.currentStock}</p>
                )}
              </div>

              <div>
                <Label className="text-base font-medium mb-2 block">
                  {type === "out" ? "Ship/Location" : "Source"}
                </Label>
                <Select value={selectedShip} onValueChange={setSelectedShip}>
                  <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                    <SelectValue placeholder="Select destination..." />
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

              <div className="border-t pt-4">
                <Label className="text-base font-medium mb-3 block">Quick Actions</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 bg-white hover:bg-gray-50 border-2" onClick={handleQRScan}>
                    <QrCode className="mr-2 h-5 w-5" />
                    QR Scan
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 bg-white hover:bg-gray-50 border-2"
                    onClick={handleBarcodeScan}
                  >
                    <Scan className="mr-2 h-5 w-5" />
                    Barcode
                  </Button>
                </div>
              </div>

              <Button
                variant={type === "in" ? "success" : "destructive"}
                className="w-full h-14 text-base font-medium"
                onClick={type === "in" ? handleStockIn : handleStockOut}
                disabled={
                  !selectedPart ||
                  !quantity ||
                  !selectedShip ||
                  (type === "out" && Number.parseInt(quantity) > selectedPart.currentStock)
                }
              >
                {type === "in" ? (
                  <>
                    <ArrowUp className="mr-2 h-5 w-5" />
                    Add {quantity || "0"} to Stock
                  </>
                ) : (
                  <>
                    <ArrowDown className="mr-2 h-5 w-5" />
                    Remove {quantity || "0"} from Stock
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h4 className="text-lg font-medium mb-2">Select a Part</h4>
            <p className="text-sm">Choose a part from the list to continue</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600 mt-2">Add or remove parts from inventory</p>
        </div>

        <Tabs defaultValue="stock-in" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="stock-in" className="flex items-center gap-2 text-base">
              <ArrowUp className="h-4 w-4" />
              Stock In
            </TabsTrigger>
            <TabsTrigger value="stock-out" className="flex items-center gap-2 text-base">
              <ArrowDown className="h-4 w-4" />
              Stock Out
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stock-in">
            <Card className="min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Package className="h-5 w-5" />
                  Add Stock
                </CardTitle>
                <CardDescription>Add new parts to inventory or increase existing stock</CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <StockForm type="in" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock-out">
            <Card className="min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Package className="h-5 w-5" />
                  Remove Stock
                </CardTitle>
                <CardDescription>Remove parts from inventory for ship maintenance or repairs</CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <StockForm type="out" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest stock movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "Stock In", part: "EF-2024", quantity: 5, ship: "Warehouse", time: "2 hours ago" },
                { type: "Stock Out", part: "HP-150", quantity: 2, ship: "FastCat M1", time: "4 hours ago" },
                { type: "Stock Out", part: "NL-LED", quantity: 1, ship: "FastCat M3", time: "6 hours ago" },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "Stock In" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "Stock In" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.part}</p>
                      <p className="text-sm text-gray-600">{transaction.ship}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === "Stock In" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "Stock In" ? "+" : "-"}
                      {transaction.quantity}
                    </p>
                    <p className="text-sm text-gray-600">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
    </DashboardLayout>
  )
}
