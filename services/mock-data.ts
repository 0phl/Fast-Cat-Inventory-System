
import { User, Part, Transaction, StaffRequest, Stat, LowStockItem } from "@/types";
import { Package, AlertTriangle, TrendingUp, Building, Clock } from "lucide-react";

export const mockUsers: User[] = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john.doe@fastcat.com",
    phone: "+63 912 345 6789",
    role: "Admin",
    department: "Operations",
    ship: "FastCat M1",
    status: "Active",
    lastLogin: new Date("2024-01-17T08:30:00"),
    createdAt: new Date("2023-06-15T10:00:00"),
  },
  {
    id: "USR-002",
    name: "Jane Smith",
    email: "jane.smith@fastcat.com",
    phone: "+63 912 345 6790",
    role: "Manager",
    department: "Maintenance",
    ship: "FastCat M2",
    status: "Active",
    lastLogin: new Date("2024-01-17T09:15:00"),
    createdAt: new Date("2023-07-20T14:30:00"),
  },
  {
    id: "USR-003",
    name: "Mike Johnson",
    email: "mike.johnson@fastcat.com",
    phone: "+63 912 345 6791",
    role: "Staff",
    department: "Inventory",
    ship: "FastCat M3",
    status: "Active",
    lastLogin: new Date("2024-01-16T16:45:00"),
    createdAt: new Date("2023-08-10T11:20:00"),
  },
  {
    id: "USR-004",
    name: "Sarah Wilson",
    email: "sarah.wilson@fastcat.com",
    phone: "+63 912 345 6792",
    role: "Staff",
    department: "Operations",
    ship: "FastCat M1",
    status: "Inactive",
    lastLogin: new Date("2024-01-10T12:00:00"),
    createdAt: new Date("2023-09-05T09:45:00"),
  },
  {
    id: "USR-005",
    name: "Tom Brown",
    email: "tom.brown@fastcat.com",
    phone: "+63 912 345 6793",
    role: "Manager",
    department: "Engineering",
    ship: "FastCat M2",
    status: "Active",
    lastLogin: new Date("2024-01-17T07:20:00"),
    createdAt: new Date("2023-10-12T13:15:00"),
  },
];

export const mockParts: Part[] = [
  { id: "EF-2024", partNumber: "EF-2024", name: "Engine Filter", description: "High-performance engine filter for marine diesel engines", category: "Engine", stock: 15, location: "A1-B2", minStock: 5 },
  { id: "NL-LED", partNumber: "NL-LED", name: "Navigation Light LED", description: "LED navigation light for marine vessels", category: "Electrical", stock: 8, location: "C3-D4", minStock: 3 },
  { id: "HP-150", partNumber: "HP-150", name: "Hydraulic Pump", description: "Heavy-duty hydraulic pump for steering systems", category: "Hydraulic", stock: 3, location: "E5-F6", minStock: 2 },
  { id: "CB-12V", partNumber: "CB-12V", name: "Circuit Breaker 12V", description: "12V Circuit Breaker", category: "Electrical", stock: 12, location: "G7-H8", minStock: 4 },
  { id: "FH-STD", partNumber: "FH-STD", name: "Fire Hose Standard", description: "Standard Fire Hose", category: "Safety", stock: 6, location: "I9-J10", minStock: 2 },
  { id: "PV-25", partNumber: "PV-25", name: "Pressure Valve 25mm", description: "25mm Pressure Valve", category: "Hydraulic", stock: 9, location: "K11-L12", minStock: 3 },
];

export const mockTransactions: Transaction[] = [
    {
    id: "TXN-001",
    type: "Stock In",
    partName: "Engine Oil Filter",
    partNumber: "ENG-001",
    quantity: 50,
    ship: "FastCat M1",
    user: "John Doe",
    timestamp: new Date("2024-01-15T10:30:00"),
    status: "Completed",
    notes: "Regular maintenance stock replenishment",
  },
  {
    id: "TXN-002",
    type: "Stock Out",
    partName: "Brake Pads",
    partNumber: "BRK-005",
    quantity: 8,
    ship: "FastCat M2",
    user: "Jane Smith",
    timestamp: new Date("2024-01-15T14:45:00"),
    status: "Completed",
    notes: "Emergency brake maintenance",
  },
  {
    id: "TXN-003",
    type: "Stock In",
    partName: "Hydraulic Fluid",
    partNumber: "HYD-003",
    quantity: 25,
    ship: "FastCat M3",
    user: "Mike Johnson",
    timestamp: new Date("2024-01-16T09:15:00"),
    status: "Pending",
    notes: "Scheduled delivery from supplier",
  },
];

export const mockRequests: StaffRequest[] = [
    {
      id: "REQ-001",
      type: 'Request',
      staffName: "Mike Johnson",
      staffId: "STF-001",
      partName: "Engine Oil Filter",
      partNumber: "ENG-001",
      quantity: 5,
      ship: "FastCat M1",
      priority: "High",
      reason: "Emergency maintenance - oil leak detected",
      requestDate: new Date("2024-01-15T10:30:00"),
      status: "Pending",
    },
    {
      id: "REQ-002",
      staffName: "Sarah Wilson",
      staffId: "STF-002",
      partName: "Brake Pads Set",
      partNumber: "BRK-005",
      quantity: 2,
      ship: "FastCat M2",
      priority: "Medium",
      reason: "Scheduled maintenance replacement",
      requestDate: new Date("2024-01-15T14:45:00"),
      status: "Pending",
      type: "Request"
    },
];

export const mockDashboardStats: { [key: string]: Stat[] } = {
    admin: [
        { title: "Total Parts", value: "1,247", description: "Active inventory items", icon: Package, color: "text-blue-600", bgColor: "bg-blue-50" },
        { title: "Low Stock Alerts", value: "23", description: "Items need restocking", icon: AlertTriangle, color: "text-orange-500", bgColor: "bg-orange-50" },
        { title: "Transactions Today", value: "156", description: "Stock movements", icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50" },
        { title: "Active Vessels", value: "8", description: "Vessels in service", icon: Building, color: "text-blue-500", bgColor: "bg-blue-50" },
    ],
    manager: [
        { title: "Total Parts", value: "1,247", description: "Active inventory items", icon: Package, color: "text-blue-600", bgColor: "bg-blue-50" },
        { title: "Low Stock Alerts", value: "23", description: "Items need restocking", icon: AlertTriangle, color: "text-orange-500", bgColor: "bg-orange-50" },
        { title: "Pending Requests", value: "12", description: "Awaiting approval", icon: Clock, color: "text-purple-600", bgColor: "bg-purple-50" },
        { title: "Active Vessels", value: "8", description: "Vessels in service", icon: Building, color: "text-blue-500", bgColor: "bg-blue-50" },
    ]
};

export const mockLowStockItems: LowStockItem[] = [
    { part: "Engine Oil Filter", current: 3, minimum: 10, critical: true },
    { part: "Brake Pads Set", current: 7, minimum: 15, critical: false },
    { part: "Coolant Hose", current: 2, minimum: 8, critical: true },
    { part: "Spark Plugs", current: 12, minimum: 20, critical: false },
];

export const mockRecentTransactions = [
    { id: 1, part: "Engine Filter EF-2024", type: "Stock Out", ship: "FastCat M1", quantity: -2, time: "2 hours ago" },
    { id: 2, part: "Hydraulic Pump HP-150", type: "Stock In", ship: "Warehouse", quantity: 5, time: "4 hours ago" },
    { id: 3, part: "Navigation Light NL-LED", type: "Stock Out", ship: "FastCat M3", quantity: -1, time: "6 hours ago" },
    { id: 4, part: "Fuel Injector FI-V8", type: "Stock In", ship: "Warehouse", quantity: 8, time: "1 day ago" },
];
