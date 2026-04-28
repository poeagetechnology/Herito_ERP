// Dashboard Types
export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  icon: string;
  trend?: number;
  trendLabel?: string;
}

export interface WeeklyRevenue {
  day: string;
  revenue: number;
  target?: number;
}

export interface TopFlavor {
  id: string;
  name: string;
  casesSold: number;
  percentage: number;
  color: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "error";
  timestamp: string;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  flavor: string;
  stock: number;
  capacity: number;
  color: string;
  gradient: string;
  icon: string;
  trend: number;
  lastUpdated?: string;
}

// Product Types (with multiple pricing)
export interface Product {
  id: string;
  name: string;
  flavor?: string;
  sku: string;
  category: string;
  costPrice: number;
  dealerPrice: number;
  outletPrice: number;
  mroPrice?: number;
  customPrice?: number;
  stock: number;
  capacity: number;
  color: string;
  icon: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Order Types
export interface OrderItem {
  product: string;
  productId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = "placed" | "packing" | "transit" | "delivered";

export interface Order {
  id: string;
  outletId: string;
  outletName: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  time: string;
  assignedDriver?: string;
  deliveryDate?: string;
  deliveryNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Outlet Delivery Tracking
export interface OutletDelivery {
  id: string;
  outletId: string;
  outletName: string;
  orderId: string;
  deliveryDate: string;
  casesDelivered: number;
  weight?: number;
  amount: number;
  driver?: string;
  status: "pending" | "delivered" | "partial";
  notes?: string;
  createdAt?: string;
}

// Invoice/Billing
export interface InvoiceItem {
  product: string;
  productId: string;
  cases: number;
  unitsPerCase: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  outletId: string;
  outletName: string;
  outletAddress?: string;
  outletPhone?: string;
  orderId?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount?: number;
  discountType?: "percentage" | "fixed";
  total: number;
  amountPaid?: number;
  balanceDue?: number;
  issueDate: string;
  dueDate?: string;
  status: "draft" | "issued" | "paid" | "partial" | "overdue";
  notes?: string;
  terms?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderStage {
  name: OrderStatus;
  label: string;
  icon: string;
  color: string;
}

// Outlet Types
export interface OutletLocation {
  x?: number;
  y?: number;
  lat?: number;
  lng?: number;
}

export interface Outlet {
  id: string;
  name: string;
  location: OutletLocation;
  locationName?: string;
  salesVolume: "high" | "medium" | "low";
  nextDelivery: string;
  coolerCapacity: number;
  currentStock: number;
  owedAmount: number;
  refillBreakDays?: 7 | 14 | 28;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: string;
}

// Sales Rep Types
export interface SalesRep {
  id: string;
  name: string;
  avatar?: string;
  casesSold: number;
  target: number;
  revenue: number;
  outlets: number;
  trend: number;
  email?: string;
  phone?: string;
}

// Logistics Types
export type VanStatus = "active" | "idle" | "returning";

export interface DeliveryVan {
  id: string;
  driver: string;
  avatar?: string;
  licensePlate: string;
  status: VanStatus;
  location: string;
  deliveries: number;
  completed: number;
  eta: string;
  route: string[];
  fuelLevel: number;
  lastUpdated?: string;
}

// Dashboard Overview
export interface DashboardData {
  stats: DashboardStat[];
  weeklyRevenue: WeeklyRevenue[];
  topFlavors: TopFlavor[];
  alerts: Alert[];
}

// App-wide state
export interface AppState {
  dashboardData: DashboardData | null;
  inventory: InventoryItem[];
  products: Product[];
  orders: Order[];
  outlets: Outlet[];
  outletDeliveries: OutletDelivery[];
  invoices: Invoice[];
  salesReps: SalesRep[];
  vans: DeliveryVan[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}
