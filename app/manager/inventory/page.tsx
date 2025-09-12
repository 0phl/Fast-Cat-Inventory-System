"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ManagerLayout } from "@/components/layouts/manager-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Edit, QrCode, Package, AlertTriangle } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface Part {
  id: string
  partNumber: string
  description: string
  category: string
  ship: string
  quantity: number
  minQuantity: number
  location: string
  supplier: string
  price: number
  lastUpdated: string
}

export default function ManagerInventoryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [showQRCode, setShowQRCode] = useState<string | null>(null)
  const [partsList, setPartsList] = useState<Part[]>([
    {
      id: "1",
      partNumber: "EF-2024",
      description: "Engine Filter",
      category: "Engine",
      ship: "FastCat M1",
      quantity: 15,
      minQuantity: 10,
      location: "A1-B2",
      supplier: "Marine Parts Co.",
      price: 45.99,
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      partNumber: "HP-150",
      description: "Hydraulic Pump",
      category: "Hydraulics",
      ship: "All Vessels",
      quantity: 3,
      minQuantity: 5,
      location: "B2-C1",
      supplier: "HydroTech Ltd.",
      price: 299.99,
      lastUpdated: "2024-01-14",
    },
    {
      id: "3",
      partNumber: "NL-LED",
      description: "Navigation Light LED",
      category: "Electronics",
      ship: "FastCat M2",
      quantity: 8,
      minQuantity: 6,
      location: "C1-D3",
      supplier: "NaviLight Systems",
      price: 89.5,
      lastUpdated: "2024-01-13",
    },
  ])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    const role = localStorage.getItem("user-role")
    if (!token || role !== "Manager") {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const categories = ["all", "Engine", "Hydraulics", "Electronics", "Safety", "Navigation"]

  const filteredParts = partsList.filter((part) => {
    const matchesSearch =
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || part.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleEditPart = (part: Part) => {
    setSelectedPart(part)
    setIsEditDialogOpen(true)
  }

  if (!isAuthenticated) {
    return null
  }

  const AddPartDialog = () => (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Part</DialogTitle>
          <DialogDescription>Enter the details for the new inventory item</DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partNumber">Part Number</Label>
              <Input id="partNumber" placeholder="e.g., EF-2024" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Part description" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Min Quantity</Label>
              <Input id="minQuantity" type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" placeholder="0.00" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g., A1-B2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ship">Ship</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select ship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FastCat M1">FastCat M1</SelectItem>
                  <SelectItem value="FastCat M2">FastCat M2</SelectItem>
                  <SelectItem value="FastCat M3">FastCat M3</SelectItem>
                  <SelectItem value="All Vessels">All Vessels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Add Part</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )

  const EditPartDialog = () => (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Part</DialogTitle>
          <DialogDescription>Update the details for this inventory item</DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editPartNumber">Part Number</Label>
              <Input id="editPartNumber" defaultValue={selectedPart?.partNumber} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCategory">Category</Label>
              <Select defaultValue={selectedPart?.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="editDescription">Description</Label>
            <Textarea id="editDescription" defaultValue={selectedPart?.description} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editQuantity">Quantity</Label>
              <Input id="editQuantity" type="number" defaultValue={selectedPart?.quantity} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editMinQuantity">Min Quantity</Label>
              <Input id="editMinQuantity" type="number" defaultValue={selectedPart?.minQuantity} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPrice">Price</Label>
              <Input id="editPrice" type="number" step="0.01" defaultValue={selectedPart?.price} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editLocation">Location</Label>
              <Input id="editLocation" defaultValue={selectedPart?.location} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editShip">Ship</Label>
              <Select defaultValue={selectedPart?.ship}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FastCat M1">FastCat M1</SelectItem>
                  <SelectItem value="FastCat M2">FastCat M2</SelectItem>
                  <SelectItem value="FastCat M3">FastCat M3</SelectItem>
                  <SelectItem value="All Vessels">All Vessels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Update Part</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )

  const QRCodeDialog = () => (
    <Dialog open={!!showQRCode} onOpenChange={() => setShowQRCode(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>Scan this code to quickly access part information</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center p-6">
          {showQRCode && <QRCodeSVG value={showQRCode} size={200} level="M" includeMargin />}
        </div>
        <div className="text-center text-sm text-gray-600">Part: {showQRCode}</div>
      </DialogContent>
    </Dialog>
  )

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-2">Manage ship parts inventory (Add/Edit permissions)</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Part
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by part number or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Parts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Parts Inventory ({filteredParts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part Number</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Ship</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParts.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell className="font-medium">{part.partNumber}</TableCell>
                      <TableCell>{part.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{part.category}</Badge>
                      </TableCell>
                      <TableCell>{part.ship}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={part.quantity <= part.minQuantity ? "text-red-600 font-medium" : ""}>
                            {part.quantity}
                          </span>
                          {part.quantity <= part.minQuantity && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>{part.location}</TableCell>
                      <TableCell>${part.price}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setShowQRCode(part.partNumber)}>
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditPart(part)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <AddPartDialog />
        <EditPartDialog />
        <QRCodeDialog />
      </div>
    </ManagerLayout>
  )
}
