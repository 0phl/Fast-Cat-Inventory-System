"use client"

import { ManagerLayout } from "@/components/layouts/manager-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, QrCode, Scan, Camera } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useStockManagement } from "@/hooks/use-stock-management"
import { StockForm } from "@/components/stock/StockForm"

export default function ManagerStockPage() {
  const {
    activeTab,
    setActiveTab,
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
    showQRScanner,
    setShowQRScanner,
    showBarcodeScanner,
    setShowBarcodeScanner,
    simulateScan,
  } = useStockManagement()

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
                  handleQRScan={() => setShowQRScanner(true)}
                  handleBarcodeScan={() => setShowBarcodeScanner(true)}
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
                  handleQRScan={() => setShowQRScanner(true)}
                  handleBarcodeScan={() => setShowBarcodeScanner(true)}
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
                <Button onClick={simulateScan} className="bg-blue-600 hover:bg-blue-700">
                  <Camera className="mr-2 h-4 w-4" />
                  Simulate Scan
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
                <Button onClick={simulateScan} className="bg-blue-600 hover:bg-blue-700">
                  <Camera className="mr-2 h-4 w-4" />
                  Simulate Scan
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

