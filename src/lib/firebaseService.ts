import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Query,
  QueryConstraint,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  InventoryItem,
  Order,
  Outlet,
  SalesRep,
  DeliveryVan,
  DashboardData,
  DashboardStat,
  WeeklyRevenue,
  TopFlavor,
  Alert,
  Invoice,
} from "./types";

// ============== INVOICE OPERATIONS ==============

export const invoiceService = {
  // Get all invoices
  async getAll(): Promise<Invoice[]> {
    try {
      const q = query(collection(db, "invoices"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Invoice[];
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  },

  // Get invoices by status
  async getByStatus(status: string): Promise<Invoice[]> {
    try {
      const q = query(
        collection(db, "invoices"),
        where("status", "==", status),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Invoice[];
    } catch (error) {
      console.error("Error fetching invoices by status:", error);
      throw error;
    }
  },

  // Get invoices by outlet
  async getByOutlet(outletId: string): Promise<Invoice[]> {
    try {
      const q = query(
        collection(db, "invoices"),
        where("outletId", "==", outletId),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Invoice[];
    } catch (error) {
      console.error("Error fetching invoices by outlet:", error);
      throw error;
    }
  },

  // Get single invoice
  async getById(id: string): Promise<Invoice | null> {
    try {
      const docSnap = await getDoc(doc(db, "invoices", id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Invoice;
      }
      return null;
    } catch (error) {
      console.error("Error fetching invoice:", error);
      throw error;
    }
  },

  // Create invoice
  async create(invoice: Omit<Invoice, "id">): Promise<string> {
    try {
      const docRef = doc(collection(db, "invoices"));
      await setDoc(docRef, {
        ...invoice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  },

  // Update invoice
  async update(id: string, updates: Partial<Invoice>): Promise<void> {
    try {
      await updateDoc(doc(db, "invoices", id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating invoice:", error);
      throw error;
    }
  },

  // Update invoice status
  async updateStatus(id: string, status: string): Promise<void> {
    try {
      await updateDoc(doc(db, "invoices", id), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating invoice status:", error);
      throw error;
    }
  },

  // Delete invoice
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "invoices", id));
    } catch (error) {
      console.error("Error deleting invoice:", error);
      throw error;
    }
  },

  // Get next invoice number
  async getNextInvoiceNumber(): Promise<string> {
    try {
      const q = query(
        collection(db, "invoices"),
        orderBy("invoiceNumber", "desc"),
        limit(1),
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return "INV-0001";
      }
      const lastInvoice = querySnapshot.docs[0].data();
      const lastNumber = parseInt(
        lastInvoice.invoiceNumber.split("-")[1] || "0",
      );
      return `INV-${String(lastNumber + 1).padStart(4, "0")}`;
    } catch (error) {
      console.error("Error getting next invoice number:", error);
      return `INV-${String(Date.now()).slice(-4)}`;
    }
  },
};

// ============== INVENTORY OPERATIONS ==============

export const inventoryService = {
  // Get all inventory items
  async getAll(): Promise<InventoryItem[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InventoryItem[];
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw error;
    }
  },

  // Get single inventory item
  async getById(id: string): Promise<InventoryItem | null> {
    try {
      const docSnap = await getDoc(doc(db, "inventory", id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as InventoryItem;
      }
      return null;
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      throw error;
    }
  },

  // Create inventory item
  async create(item: Omit<InventoryItem, "id">): Promise<string> {
    try {
      const docRef = doc(collection(db, "inventory"));
      await setDoc(docRef, {
        ...item,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating inventory item:", error);
      throw error;
    }
  },

  // Update inventory item
  async update(id: string, updates: Partial<InventoryItem>): Promise<void> {
    try {
      await updateDoc(doc(db, "inventory", id), {
        ...updates,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating inventory item:", error);
      throw error;
    }
  },

  // Delete inventory item
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "inventory", id));
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      throw error;
    }
  },
};

// ============== ORDER OPERATIONS ==============

export const orderService = {
  // Get all orders
  async getAll(): Promise<Order[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get orders by status
  async getByStatus(status: string): Promise<Order[]> {
    try {
      const q = query(collection(db, "orders"), where("status", "==", status));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      throw error;
    }
  },

  // Get recent orders
  async getRecent(limitCount: number = 10): Promise<Order[]> {
    try {
      const q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      throw error;
    }
  },

  // Get single order
  async getById(id: string): Promise<Order | null> {
    try {
      const docSnap = await getDoc(doc(db, "orders", id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Order;
      }
      return null;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  // Create order
  async create(order: Omit<Order, "id">): Promise<string> {
    try {
      const docRef = doc(collection(db, "orders"));
      await setDoc(docRef, {
        ...order,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Update order
  async update(id: string, updates: Partial<Order>): Promise<void> {
    try {
      await updateDoc(doc(db, "orders", id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  // Update order status
  async updateStatus(id: string, status: string): Promise<void> {
    try {
      await updateDoc(doc(db, "orders", id), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Delete order
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "orders", id));
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },
};

// ============== OUTLET OPERATIONS ==============

export const outletService = {
  // Get all outlets
  async getAll(): Promise<Outlet[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "outlets"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Outlet[];
    } catch (error) {
      console.error("Error fetching outlets:", error);
      throw error;
    }
  },

  // Get single outlet
  async getById(id: string): Promise<Outlet | null> {
    try {
      const docSnap = await getDoc(doc(db, "outlets", id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Outlet;
      }
      return null;
    } catch (error) {
      console.error("Error fetching outlet:", error);
      throw error;
    }
  },

  // Create outlet
  async create(outlet: Omit<Outlet, "id">): Promise<string> {
    try {
      const docRef = doc(collection(db, "outlets"));
      await setDoc(docRef, {
        ...outlet,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating outlet:", error);
      throw error;
    }
  },

  // Update outlet
  async update(id: string, updates: Partial<Outlet>): Promise<void> {
    try {
      await updateDoc(doc(db, "outlets", id), updates);
    } catch (error) {
      console.error("Error updating outlet:", error);
      throw error;
    }
  },

  // Delete outlet
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "outlets", id));
    } catch (error) {
      console.error("Error deleting outlet:", error);
      throw error;
    }
  },
};

// ============== SALES REP OPERATIONS ==============

export const salesRepService = {
  // Get all sales reps
  async getAll(): Promise<SalesRep[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "salesReps"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SalesRep[];
    } catch (error) {
      console.error("Error fetching sales reps:", error);
      throw error;
    }
  },

  // Get single sales rep
  async getById(id: string): Promise<SalesRep | null> {
    try {
      const docSnap = await getDoc(doc(db, "salesReps", id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as SalesRep;
      }
      return null;
    } catch (error) {
      console.error("Error fetching sales rep:", error);
      throw error;
    }
  },

  // Create sales rep
  async create(rep: Omit<SalesRep, "id">): Promise<string> {
    try {
      const docRef = doc(collection(db, "salesReps"));
      await setDoc(docRef, rep);
      return docRef.id;
    } catch (error) {
      console.error("Error creating sales rep:", error);
      throw error;
    }
  },

  // Update sales rep
  async update(id: string, updates: Partial<SalesRep>): Promise<void> {
    try {
      await updateDoc(doc(db, "salesReps", id), updates);
    } catch (error) {
      console.error("Error updating sales rep:", error);
      throw error;
    }
  },

  // Delete sales rep
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "salesReps", id));
    } catch (error) {
      console.error("Error deleting sales rep:", error);
      throw error;
    }
  },
};

// ============== VAN/LOGISTICS OPERATIONS ==============

export const vanService = {
  // Get all vans
  async getAll(): Promise<DeliveryVan[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "vans"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DeliveryVan[];
    } catch (error) {
      console.error("Error fetching vans:", error);
      throw error;
    }
  },

  // Get vans by status
  async getByStatus(status: string): Promise<DeliveryVan[]> {
    try {
      const q = query(collection(db, "vans"), where("status", "==", status));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DeliveryVan[];
    } catch (error) {
      console.error("Error fetching vans by status:", error);
      throw error;
    }
  },

  // Get single van
  async getById(id: string): Promise<DeliveryVan | null> {
    try {
      const docSnap = await getDoc(doc(db, "vans", id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DeliveryVan;
      }
      return null;
    } catch (error) {
      console.error("Error fetching van:", error);
      throw error;
    }
  },

  // Create van
  async create(van: Omit<DeliveryVan, "id">): Promise<string> {
    try {
      const docRef = doc(collection(db, "vans"));
      await setDoc(docRef, {
        ...van,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating van:", error);
      throw error;
    }
  },

  // Update van
  async update(id: string, updates: Partial<DeliveryVan>): Promise<void> {
    try {
      await updateDoc(doc(db, "vans", id), {
        ...updates,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating van:", error);
      throw error;
    }
  },

  // Delete van
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "vans", id));
    } catch (error) {
      console.error("Error deleting van:", error);
      throw error;
    }
  },
};

// ============== DASHBOARD OPERATIONS ==============

export const dashboardService = {
  // Get dashboard data (stats, revenue, flavors, alerts)
  async getDashboardData(): Promise<DashboardData | null> {
    try {
      const docSnap = await getDoc(doc(db, "dashboard", "metrics"));
      if (docSnap.exists()) {
        return docSnap.data() as DashboardData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },

  // Update dashboard stats
  async updateStats(stats: DashboardStat[]): Promise<void> {
    try {
      const docRef = doc(db, "dashboard", "metrics");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data() : {};

      await setDoc(
        docRef,
        {
          ...currentData,
          stats,
          lastUpdated: new Date().toISOString(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error updating dashboard stats:", error);
      throw error;
    }
  },

  // Update weekly revenue
  async updateWeeklyRevenue(weeklyRevenue: WeeklyRevenue[]): Promise<void> {
    try {
      const docRef = doc(db, "dashboard", "metrics");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data() : {};

      await setDoc(
        docRef,
        {
          ...currentData,
          weeklyRevenue,
          lastUpdated: new Date().toISOString(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error updating weekly revenue:", error);
      throw error;
    }
  },

  // Update top flavors
  async updateTopFlavors(topFlavors: TopFlavor[]): Promise<void> {
    try {
      const docRef = doc(db, "dashboard", "metrics");
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.exists() ? docSnap.data() : {};

      await setDoc(
        docRef,
        {
          ...currentData,
          topFlavors,
          lastUpdated: new Date().toISOString(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error("Error updating top flavors:", error);
      throw error;
    }
  },

  // Get alerts
  async getAlerts(): Promise<Alert[]> {
    try {
      const q = query(
        collection(db, "alerts"),
        orderBy("timestamp", "desc"),
        limit(10),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Alert[];
    } catch (error) {
      console.error("Error fetching alerts:", error);
      throw error;
    }
  },

  // Create alert
  async createAlert(alert: Omit<Alert, "id">): Promise<string> {
    try {
      const docRef = doc(collection(db, "alerts"));
      await setDoc(docRef, {
        ...alert,
        timestamp: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating alert:", error);
      throw error;
    }
  },
};
