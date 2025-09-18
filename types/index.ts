export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Manager" | "Staff";
  department: string;
  ship: string;
  status: "Active" | "Inactive";
  lastLogin: Date;
  createdAt: Date;
}

export interface Part {
    id: string;
    partNumber: string;
    name: string;
    description: string;
    category: string;
    stock: number;
    location: string;
    minStock: number;
}

export interface Transaction {
    id: string;
    type: "Stock In" | "Stock Out" | "Request";
    partName: string;
    partNumber: string;
    quantity: number;
    ship: string;
    user?: string; // User who performed the transaction
    staffName?: string; // For requests
    status: "Completed" | "Pending" | "Failed" | "Approved" | "Rejected" | "Delivered";
    timestamp?: Date; // General timestamp
    requestDate?: Date; // For requests
    notes?: string;
}

export interface StaffRequest extends Transaction {
    staffId: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    reason: string;
}

// For dashboard stats
export interface Stat {
    title: string;
    value: string;
    description: string;
    icon: any; // lucide-react icon
    color: string;
    bgColor: string;
}

export interface LowStockItem {
    part: string;
    current: number;
    minimum: number;
    critical: boolean;
}
