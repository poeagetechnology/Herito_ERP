import { useEffect } from "react";
import { AlertTriangle, TrendingUp, Package, Loader } from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { InventoryItem } from "../../lib/types";

export function InventoryHub() {
  const { state, loading, error, refreshInventory } = useDataContext();

  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  const getLowStockAlert = (stock: number, capacity: number) => {
    const percentage = (stock / capacity) * 100;
    return percentage < 15;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-900 mb-2">Error Loading Inventory</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={refreshInventory}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Live Inventory Hub
          </h2>
          <p className="text-gray-500 mt-1">
            Real-time stock levels across all flavors
          </p>
        </div>
        <button
          onClick={() => {
            // Generate CSV report of inventory
            const inventoryReport = state.inventory.map((item) => ({
              Flavor: item.flavor,
              Stock: item.stock,
              Capacity: item.capacity,
              Level: ((item.stock / item.capacity) * 100).toFixed(1) + "%",
              Trend: item.trend + "%",
            }));
            const csvContent = [
              Object.keys(inventoryReport[0]).join(","),
              ...inventoryReport.map((row) => Object.values(row).join(",")),
            ].join("\n");
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `inventory-report-${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
          }}
          className="px-6 py-3 rounded-2xl font-medium text-white transition-all hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
          }}
        >
          Generate Report
        </button>
      </div>

      {state.inventory.length === 0 ? (
        <div
          className="rounded-3xl p-12 bg-white text-center"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
        >
          <p className="text-gray-500">
            No inventory items found. Please add items to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.inventory.map((item: InventoryItem) => {
            const stockPercentage = (item.stock / item.capacity) * 100;
            const isLowStock = getLowStockAlert(item.stock, item.capacity);

            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:scale-105"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {isLowStock && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-semibold text-red-600">
                      Low Stock
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{
                      background:
                        item.gradient ||
                        `linear-gradient(135deg, ${item.color} 0%, ${item.color}99 100%)`,
                      boxShadow: `0 8px 24px ${item.color}40`,
                    }}
                  >
                    {item.icon || "📦"}
                  </div>
                  {item.trend !== undefined && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full ${item.trend > 0 ? "bg-green-50" : "bg-red-50"}`}
                    >
                      <TrendingUp
                        className={`w-3 h-3 ${item.trend > 0 ? "text-green-600" : "text-red-600 rotate-180"}`}
                      />
                      <span
                        className={`text-xs font-semibold ${item.trend > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {Math.abs(item.trend)}%
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  {item.flavor}
                </h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: item.color }}
                  >
                    {item.stock.toLocaleString()}
                  </span>
                  <span className="text-gray-400">
                    / {item.capacity.toLocaleString()} cases
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stock Level</span>
                    <span
                      className="font-semibold"
                      style={{ color: item.color }}
                    >
                      {stockPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stockPercentage}%`,
                        background:
                          item.gradient ||
                          `linear-gradient(135deg, ${item.color} 0%, ${item.color}99 100%)`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>24 units/case</span>
                  </div>
                  <button
                    className="text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-100"
                    style={{ color: item.color }}
                  >
                    Restock
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
