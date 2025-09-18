"use client"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { InventoryManagement } from "@/components/inventory/inventory-management"

export default function InventoryPage() {
  return (
    <DashboardLayout>
      <InventoryManagement />
    </DashboardLayout>
  )
}