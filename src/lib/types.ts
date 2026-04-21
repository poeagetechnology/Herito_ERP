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

// Order Types
export interface OrderItem {
  product: string;
  quantity: number;
}

export type OrderStatus = "placed" | "packing" | "transit" | "delivered";

export interface Order {
  id: string;
  outletId: string;
  outletName: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  time: string;
  assignedDriver?: string;
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
  x: number;
  y: number;
}

export interface Outlet {
  id: string;
  name: string;
  location: OutletLocation;
  salesVolume: "high" | "medium" | "low";
  nextDelivery: string;
  coolerCapacity: number;
  currentStock: number;
  owedAmount: number;
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
  orders: Order[];
  outlets: Outlet[];
  salesReps: SalesRep[];
  vans: DeliveryVan[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}
