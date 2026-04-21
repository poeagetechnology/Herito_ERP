import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  InventoryItem,
  Order,
  Outlet,
  SalesRep,
  DeliveryVan,
  DashboardData,
  AppState,
  Invoice,
} from "./types";
import {
  inventoryService,
  orderService,
  outletService,
  salesRepService,
  vanService,
  dashboardService,
  invoiceService,
} from "./firebaseService";

interface DataContextType {
  state: AppState;
  loading: boolean;
  error: string | null;

  // Refresh functions
  refreshDashboard: () => Promise<void>;
  refreshInventory: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshOutlets: () => Promise<void>;
  refreshSalesReps: () => Promise<void>;
  refreshVans: () => Promise<void>;
  refreshAll: () => Promise<void>;

  // Inventory operations
  addInventoryItem: (item: Omit<InventoryItem, "id">) => Promise<void>;
  updateInventoryItem: (
    id: string,
    updates: Partial<InventoryItem>,
  ) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;

  // Order operations
  addOrder: (order: Omit<Order, "id">) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  // Outlet operations
  addOutlet: (outlet: Omit<Outlet, "id">) => Promise<void>;
  updateOutlet: (id: string, updates: Partial<Outlet>) => Promise<void>;
  deleteOutlet: (id: string) => Promise<void>;

  // Sales Rep operations
  addSalesRep: (rep: Omit<SalesRep, "id">) => Promise<void>;
  updateSalesRep: (id: string, updates: Partial<SalesRep>) => Promise<void>;
  deleteSalesRep: (id: string) => Promise<void>;

  // Van operations
  addVan: (van: Omit<DeliveryVan, "id">) => Promise<void>;
  updateVan: (id: string, updates: Partial<DeliveryVan>) => Promise<void>;
  deleteVan: (id: string) => Promise<void>;

  // Invoice operations
  refreshInvoices: () => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, "id">) => Promise<string>;
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>;
  updateInvoiceStatus: (id: string, status: string) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppState>({
    dashboardData: null,
    inventory: [],
    orders: [],
    outlets: [],
    salesReps: [],
    vans: [],
    invoices: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const hasInitialized = useRef(false);

  // ============== DASHBOARD ==============
  const refreshDashboard = useCallback(async () => {
    try {
      const dashboardData = await dashboardService.getDashboardData();
      const alerts = await dashboardService.getAlerts();
      setState((prev) => ({
        ...prev,
        dashboardData: dashboardData
          ? { ...dashboardData, alerts }
          : {
              stats: [],
              weeklyRevenue: [],
              topFlavors: [],
              alerts,
            },
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Failed to load dashboard",
      }));
    }
  }, []);

  // ============== INVENTORY ==============
  const refreshInventory = useCallback(async () => {
    try {
      const inventory = await inventoryService.getAll();
      setState((prev) => ({
        ...prev,
        inventory,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Failed to load inventory",
      }));
    }
  }, []);

  const addInventoryItem = useCallback(
    async (item: Omit<InventoryItem, "id">) => {
      try {
        await inventoryService.create(item);
        await refreshInventory();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error ? err.message : "Failed to add inventory item",
        }));
        throw err;
      }
    },
    [refreshInventory],
  );

  const updateInventoryItem = useCallback(
    async (id: string, updates: Partial<InventoryItem>) => {
      try {
        await inventoryService.update(id, updates);
        await refreshInventory();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error
              ? err.message
              : "Failed to update inventory item",
        }));
        throw err;
      }
    },
    [refreshInventory],
  );

  const deleteInventoryItem = useCallback(
    async (id: string) => {
      try {
        await inventoryService.delete(id);
        await refreshInventory();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error
              ? err.message
              : "Failed to delete inventory item",
        }));
        throw err;
      }
    },
    [refreshInventory],
  );

  // ============== ORDERS ==============
  const refreshOrders = useCallback(async () => {
    try {
      const orders = await orderService.getAll();
      setState((prev) => ({
        ...prev,
        orders,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Failed to load orders",
      }));
    }
  }, []);

  const addOrder = useCallback(
    async (order: Omit<Order, "id">) => {
      try {
        await orderService.create(order);
        await refreshOrders();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to add order",
        }));
        throw err;
      }
    },
    [refreshOrders],
  );

  const updateOrder = useCallback(
    async (id: string, updates: Partial<Order>) => {
      try {
        await orderService.update(id, updates);
        await refreshOrders();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to update order",
        }));
        throw err;
      }
    },
    [refreshOrders],
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: string) => {
      try {
        await orderService.updateStatus(id, status);
        await refreshOrders();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error
              ? err.message
              : "Failed to update order status",
        }));
        throw err;
      }
    },
    [refreshOrders],
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      try {
        await orderService.delete(id);
        await refreshOrders();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to delete order",
        }));
        throw err;
      }
    },
    [refreshOrders],
  );

  // ============== OUTLETS ==============
  const refreshOutlets = useCallback(async () => {
    try {
      const outlets = await outletService.getAll();
      setState((prev) => ({
        ...prev,
        outlets,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Failed to load outlets",
      }));
    }
  }, []);

  const addOutlet = useCallback(
    async (outlet: Omit<Outlet, "id">) => {
      try {
        await outletService.create(outlet);
        await refreshOutlets();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to add outlet",
        }));
        throw err;
      }
    },
    [refreshOutlets],
  );

  const updateOutlet = useCallback(
    async (id: string, updates: Partial<Outlet>) => {
      try {
        await outletService.update(id, updates);
        await refreshOutlets();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to update outlet",
        }));
        throw err;
      }
    },
    [refreshOutlets],
  );

  const deleteOutlet = useCallback(
    async (id: string) => {
      try {
        await outletService.delete(id);
        await refreshOutlets();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to delete outlet",
        }));
        throw err;
      }
    },
    [refreshOutlets],
  );

  // ============== SALES REPS ==============
  const refreshSalesReps = useCallback(async () => {
    try {
      const salesReps = await salesRepService.getAll();
      setState((prev) => ({
        ...prev,
        salesReps,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Failed to load sales reps",
      }));
    }
  }, []);

  const addSalesRep = useCallback(
    async (rep: Omit<SalesRep, "id">) => {
      try {
        await salesRepService.create(rep);
        await refreshSalesReps();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to add sales rep",
        }));
        throw err;
      }
    },
    [refreshSalesReps],
  );

  const updateSalesRep = useCallback(
    async (id: string, updates: Partial<SalesRep>) => {
      try {
        await salesRepService.update(id, updates);
        await refreshSalesReps();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error ? err.message : "Failed to update sales rep",
        }));
        throw err;
      }
    },
    [refreshSalesReps],
  );

  const deleteSalesRep = useCallback(
    async (id: string) => {
      try {
        await salesRepService.delete(id);
        await refreshSalesReps();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error ? err.message : "Failed to delete sales rep",
        }));
        throw err;
      }
    },
    [refreshSalesReps],
  );

  // ============== VANS ==============
  const refreshVans = useCallback(async () => {
    try {
      const vans = await vanService.getAll();
      setState((prev) => ({
        ...prev,
        vans,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Failed to load vans",
      }));
    }
  }, []);

  const addVan = useCallback(
    async (van: Omit<DeliveryVan, "id">) => {
      try {
        await vanService.create(van);
        await refreshVans();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to add van",
        }));
        throw err;
      }
    },
    [refreshVans],
  );

  const updateVan = useCallback(
    async (id: string, updates: Partial<DeliveryVan>) => {
      try {
        await vanService.update(id, updates);
        await refreshVans();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to update van",
        }));
        throw err;
      }
    },
    [refreshVans],
  );

  const deleteVan = useCallback(
    async (id: string) => {
      try {
        await vanService.delete(id);
        await refreshVans();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to delete van",
        }));
        throw err;
      }
    },
    [refreshVans],
  );

  // ============== INVOICES ==============
  const refreshInvoices = useCallback(async () => {
    try {
      const invoices = await invoiceService.getAll();
      setState((prev) => ({
        ...prev,
        invoices,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Failed to load invoices",
      }));
    }
  }, []);

  const addInvoice = useCallback(
    async (invoice: Omit<Invoice, "id">) => {
      try {
        const id = await invoiceService.create(invoice);
        await refreshInvoices();
        return id;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to add invoice",
        }));
        throw err;
      }
    },
    [refreshInvoices],
  );

  const updateInvoice = useCallback(
    async (id: string, updates: Partial<Invoice>) => {
      try {
        await invoiceService.update(id, updates);
        await refreshInvoices();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error ? err.message : "Failed to update invoice",
        }));
        throw err;
      }
    },
    [refreshInvoices],
  );

  const updateInvoiceStatus = useCallback(
    async (id: string, status: string) => {
      try {
        await invoiceService.updateStatus(id, status);
        await refreshInvoices();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error
              ? err.message
              : "Failed to update invoice status",
        }));
        throw err;
      }
    },
    [refreshInvoices],
  );

  const deleteInvoice = useCallback(
    async (id: string) => {
      try {
        await invoiceService.delete(id);
        await refreshInvoices();
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error:
            err instanceof Error ? err.message : "Failed to delete invoice",
        }));
        throw err;
      }
    },
    [refreshInvoices],
  );

  // ============== REFRESH ALL ==============
  const refreshAll = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await Promise.all([
        refreshDashboard(),
        refreshInventory(),
        refreshOrders(),
        refreshOutlets(),
        refreshSalesReps(),
        refreshVans(),
        refreshInvoices(),
      ]);
      setState((prev) => ({
        ...prev,
        loading: false,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to refresh data",
      }));
    }
  }, [
    refreshDashboard,
    refreshInventory,
    refreshOrders,
    refreshOutlets,
    refreshSalesReps,
    refreshVans,
  ]);

  // Initial load
  useEffect(() => {
    if (hasInitialized.current) return; // Prevent multiple initializations
    hasInitialized.current = true;

    refreshAll();

    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(refreshAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const value: DataContextType = {
    state,
    loading: state.loading,
    error: state.error,

    refreshDashboard,
    refreshInventory,
    refreshOrders,
    refreshOutlets,
    refreshSalesReps,
    refreshVans,
    refreshAll,

    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,

    addOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,

    addOutlet,
    updateOutlet,
    deleteOutlet,

    addSalesRep,
    updateSalesRep,
    deleteSalesRep,

    addVan,
    updateVan,
    deleteVan,

    refreshInvoices,
    addInvoice,
    updateInvoice,
    updateInvoiceStatus,
    deleteInvoice,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within DataProvider");
  }
  return context;
};
