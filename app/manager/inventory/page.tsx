"use client"

import { ManagerLayout } from "@/components/layouts/manager-layout"
import { InventoryManagement } from "@/components/inventory/inventory-management"

export default function ManagerInventoryPage() {
  return (
    <ManagerLayout>
      <InventoryManagement showDelete={true} />
    </ManagerLayout>
  )
}