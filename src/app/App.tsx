import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { InventoryHub } from "./components/InventoryHub";
import { OutletMap } from "./components/OutletMap";
import { OutletManagement } from "./components/OutletManagement";
import { OrderPipeline } from "./components/OrderPipeline";
import { SalesPerformance } from "./components/SalesPerformance";
import { Logistics } from "./components/Logistics";
import { OutletDeliveryTracking } from "./components/OutletDeliveryTracking";
import { ProductManagement } from "./components/ProductManagement";

import { MobileView } from "./components/MobileView";
import { useDataContext } from "../lib/dataContext";

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const { error: contextError } = useDataContext();

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <InventoryHub />;
      case "outlets":
        return <OutletMap />;
      case "outlet-management":
        return <OutletManagement />;
      case "orders":
        return <OrderPipeline />;
      case "performance":
        return <SalesPerformance />;
      case "logistics":
        return <Logistics />;
      case "deliveries":
        return <OutletDeliveryTracking />;
      case "products":
        return <ProductManagement />;

      case "mobile":
        return <MobileView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-green-50/30">
      {contextError && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="rounded-2xl p-4 bg-red-50 border border-red-200 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900">Error</h3>
                <p className="text-sm text-red-700 mt-1">{contextError}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 overflow-auto">
        <div className="p-8">{renderView()}</div>
      </main>
    </div>
  );
}
