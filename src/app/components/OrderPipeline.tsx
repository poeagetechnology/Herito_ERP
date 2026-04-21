import { useEffect, useState } from "react";
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Loader,
  X,
} from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { Order, OrderStage } from "../../lib/types";

export function OrderPipeline() {
  const { state, loading, error, refreshOrders, addOrder } = useDataContext();
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [formData, setFormData] = useState({
    outletName: "",
    items: [""],
    quantities: [1],
  });

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const stages: OrderStage[] = [
    { name: "placed", label: "Order Placed", icon: "placed", color: "#94A3B8" },
    {
      name: "packing",
      label: "Warehouse Packing",
      icon: "packing",
      color: "#FF8A00",
    },
    { name: "transit", label: "In Transit", icon: "transit", color: "#3B82F6" },
    {
      name: "delivered",
      label: "Delivered & Invoiced",
      icon: "delivered",
      color: "#2ECC71",
    },
  ];

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      placed: Clock,
      packing: Package,
      transit: Truck,
      delivered: CheckCircle,
    };
    return icons[iconName] || Package;
  };

  const getOrdersByStatus = (status: string) =>
    state.orders.filter((order: Order) => order.status === status);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-900 mb-2">Error Loading Orders</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={refreshOrders}
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
            Order Lifecycle Pipeline
          </h2>
          <p className="text-gray-500 mt-1">
            Track orders from placement to delivery
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white border border-gray-200">
            <span className="text-sm text-gray-600">Total: </span>
            <span className="font-bold text-gray-900">
              {state.orders.length} orders
            </span>
          </div>
          <button
            onClick={() => setShowNewOrderForm(true)}
            className="px-6 py-3 rounded-2xl font-medium text-white transition-all hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
            }}
          >
            New Order
          </button>

          {showNewOrderForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Create New Order
                  </h3>
                  <button
                    onClick={() => setShowNewOrderForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Outlet Name
                    </label>
                    <select
                      value={formData.outletName}
                      onChange={(e) =>
                        setFormData({ ...formData, outletName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select an outlet</option>
                      {state.outlets.map((outlet) => (
                        <option key={outlet.id} value={outlet.name}>
                          {outlet.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Items & Quantities
                    </label>
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Product"
                          value={item}
                          onChange={(e) => {
                            const newItems = [...formData.items];
                            newItems[index] = e.target.value;
                            setFormData({ ...formData, items: newItems });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          min="1"
                          value={formData.quantities[index]}
                          onChange={(e) => {
                            const newQties = [...formData.quantities];
                            newQties[index] = parseInt(e.target.value);
                            setFormData({ ...formData, quantities: newQties });
                          }}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          items: [...formData.items, ""],
                          quantities: [...formData.quantities, 1],
                        });
                      }}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowNewOrderForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!formData.outletName) {
                        alert("Please select an outlet");
                        return;
                      }
                      try {
                        await addOrder({
                          outletId:
                            state.outlets.find(
                              (o) => o.name === formData.outletName,
                            )?.id || "",
                          outletName: formData.outletName,
                          status: "placed",
                          items: formData.items.map((item, i) => ({
                            product: item,
                            quantity: formData.quantities[i],
                          })),
                          total: 0,
                          time: new Date().toLocaleTimeString(),
                        });
                        alert("Order created successfully!");
                        setShowNewOrderForm(false);
                        setFormData({
                          outletName: "",
                          items: [""],
                          quantities: [1],
                        });
                      } catch (err) {
                        alert("Error creating order. Please try again.");
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
                  >
                    Create Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-6 rounded-3xl bg-gradient-to-r from-orange-50 to-green-50">
        {stages.map((stage, index) => {
          const Icon = getIconComponent(stage.icon);
          const count = getOrdersByStatus(stage.name).length;

          return (
            <div key={stage.name} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${stage.color} 0%, ${stage.color}CC 100%)`,
                    boxShadow: `0 8px 24px ${stage.color}40`,
                  }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <p className="font-semibold text-gray-900 text-center">
                  {stage.label}
                </p>
                <div
                  className="mt-2 px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: stage.color }}
                >
                  {count}
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className="w-24 h-1 mx-4 rounded-full bg-gradient-to-r from-gray-200 to-gray-300" />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const stageOrders = getOrdersByStatus(stage.name);
          const Icon = getIconComponent(stage.icon);

          return (
            <div key={stage.name} className="space-y-3">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ backgroundColor: `${stage.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: stage.color }} />
                <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                <span
                  className="ml-auto px-2 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: stage.color }}
                >
                  {stageOrders.length}
                </span>
              </div>

              <div className="space-y-2">
                {stageOrders.map((order: Order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl p-4 bg-white border border-gray-100 hover:shadow-lg transition-all duration-300"
                    style={{
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {order.outletName}
                        </p>
                      </div>
                      <div
                        className="px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          backgroundColor: `${stage.color}20`,
                          color: stage.color,
                        }}
                      >
                        {order.items?.length || 0} items
                      </div>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total:</span>
                        <span className="font-semibold text-gray-900">
                          ₹{order.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time:</span>
                        <span className="font-medium text-gray-700">
                          {order.time}
                        </span>
                      </div>
                      {order.assignedDriver && (
                        <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-semibold"
                            style={{ backgroundColor: stage.color }}
                          >
                            {order.assignedDriver
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-xs text-gray-600">
                            {order.assignedDriver}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {stageOrders.length === 0 && (
                  <div className="rounded-2xl p-6 bg-gray-50 border border-dashed border-gray-300 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No orders</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
