
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Minus, QrCode, CheckCircle, Scan } from "lucide-react"
import type { Part } from "@/types"

interface StockFormProps {
  type: "in" | "out"
  searchTerm: string
  searchInputRef: React.RefObject<HTMLInputElement>
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  filteredParts: Part[]
  selectedPart: Part | null
  handlePartSelect: (part: Part) => void
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

export function StockForm({
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
