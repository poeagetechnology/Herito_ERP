import { useState, useEffect } from "react";
import { AlertTriangle, TrendingUp, Package, Loader, X } from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { InventoryItem } from "../../lib/types";

export function InventoryHub() {
  const {
    state,
    loading,
    error,
    refreshInventory,
    addInventoryItem,
    updateInventoryItem,
  } = useDataContext();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showUpdateStock, setShowUpdateStock] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    flavor: "",
    stock: 0,
    capacity: 1000,
    color: "#FF8A00",
    gradient: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
    icon: "🧋",
    trend: 0,
  });
  const [stockUpdate, setStockUpdate] = useState({ quantity: 0 });

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
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddProduct(true)}
            className="px-6 py-3 rounded-2xl font-medium text-white transition-all hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
            }}
          >
            Add Product
          </button>
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
      </div>

      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Add New Product
              </h3>
              <button
                onClick={() => setShowAddProduct(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name (Flavor)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mango Fusion"
                  value={newProduct.flavor}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, flavor: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Stock (cases)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Capacity (cases)
                </label>
                <input
                  type="number"
                  min="1"
                  value={newProduct.capacity}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      capacity: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Icon/Emoji
                </label>
                <input
                  type="text"
                  placeholder="e.g., 🧋"
                  value={newProduct.icon}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, icon: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={newProduct.color}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, color: e.target.value })
                  }
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddProduct(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newProduct.flavor) {
                    alert("Please enter product name");
                    return;
                  }
                  try {
                    await addInventoryItem({
                      flavor: newProduct.flavor,
                      stock: newProduct.stock,
                      capacity: newProduct.capacity,
                      color: newProduct.color,
                      gradient: `linear-gradient(135deg, ${newProduct.color} 0%, ${newProduct.color}99 100%)`,
                      icon: newProduct.icon,
                      trend: 0,
                    });
                    alert("Product added successfully!");
                    setShowAddProduct(false);
                    setNewProduct({
                      flavor: "",
                      stock: 0,
                      capacity: 1000,
                      color: "#FF8A00",
                      gradient:
                        "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
                      icon: "🧋",
                      trend: 0,
                    });
                  } catch (err) {
                    alert("Error adding product. Please try again.");
                  }
                }}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateStock && selectedItemId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Update Stock Level
              </h3>
              <button
                onClick={() => setShowUpdateStock(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-4">
                  Product:{" "}
                  <span className="font-bold">
                    {
                      state.inventory.find((i) => i.id === selectedItemId)
                        ?.flavor
                    }
                  </span>
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Stock Quantity (cases)
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockUpdate.quantity}
                  onChange={(e) =>
                    setStockUpdate({ quantity: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter new stock level"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowUpdateStock(false);
                  setSelectedItemId(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (selectedItemId) {
                    try {
                      await updateInventoryItem(selectedItemId, {
                        stock: stockUpdate.quantity,
                      });
                      alert("Stock updated successfully!");
                      setShowUpdateStock(false);
                      setSelectedItemId(null);
                      setStockUpdate({ quantity: 0 });
                    } catch (err) {
                      alert("Error updating stock. Please try again.");
                    }
                  }
                }}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

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
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setStockUpdate({ quantity: item.stock });
                      setShowUpdateStock(true);
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all"
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
