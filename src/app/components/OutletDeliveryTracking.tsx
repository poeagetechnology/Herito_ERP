import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  Calendar,
  DollarSign,
  AlertCircle,
  Loader,
  X,
  Plus,
  Edit2,
} from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { OutletDelivery } from "../../lib/types";

export function OutletDeliveryTracking() {
  const { state, loading, error, refreshOrders } = useDataContext();
  const [showAddDelivery, setShowAddDelivery] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newDelivery, setNewDelivery] = useState({
    outletId: "",
    outletName: "",
    casesDelivered: 0,
    amount: 0,
    driver: "",
    deliveryDate: new Date().toISOString().split("T")[0],
    status: "delivered" as const,
    notes: "",
  });

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const deliveries: OutletDelivery[] = [];
  const outletStats = state.outlets.map((outlet) => {
    const deliveryCount = 0;
    const totalDelivered = 0;
    const totalAmount = 0;
    const lastDelivery = "N/A";

    return {
      outletId: outlet.id,
      outletName: outlet.name,
      address: outlet.address || "N/A",
      phone: outlet.phone || "N/A",
      deliveryCount,
      totalDelivered,
      totalAmount,
      lastDelivery,
      status: outlet.salesVolume,
    };
  });

  const filteredOutlets = outletStats.filter(
    (outlet) =>
      outlet.outletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outlet.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading delivery data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-900 mb-2">
          Error Loading Deliveries
        </h3>
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
            Outlet Delivery Tracking
          </h2>
          <p className="text-gray-500 mt-1">
            Track deliveries, cases, and amounts per outlet
          </p>
        </div>
        <button
          onClick={() => setShowAddDelivery(true)}
          className="px-6 py-3 rounded-2xl font-medium text-white transition-all hover:shadow-lg flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
          }}
        >
          <Plus className="w-5 h-5" />
          Record Delivery
        </button>

        {showAddDelivery && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Record Delivery
                </h3>
                <button
                  onClick={() => setShowAddDelivery(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outlet
                  </label>
                  <select
                    value={newDelivery.outletId}
                    onChange={(e) => {
                      const outlet = state.outlets.find(
                        (o) => o.id === e.target.value,
                      );
                      setNewDelivery({
                        ...newDelivery,
                        outletId: e.target.value,
                        outletName: outlet?.name || "",
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select outlet</option>
                    {state.outlets.map((outlet) => (
                      <option key={outlet.id} value={outlet.id}>
                        {outlet.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cases Delivered
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newDelivery.casesDelivered}
                    onChange={(e) =>
                      setNewDelivery({
                        ...newDelivery,
                        casesDelivered: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newDelivery.amount}
                    onChange={(e) =>
                      setNewDelivery({
                        ...newDelivery,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={newDelivery.deliveryDate}
                    onChange={(e) =>
                      setNewDelivery({
                        ...newDelivery,
                        deliveryDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter driver name"
                    value={newDelivery.driver}
                    onChange={(e) =>
                      setNewDelivery({
                        ...newDelivery,
                        driver: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    placeholder="Delivery notes..."
                    value={newDelivery.notes}
                    onChange={(e) =>
                      setNewDelivery({
                        ...newDelivery,
                        notes: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddDelivery(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newDelivery.outletId || !newDelivery.casesDelivered) {
                      alert("Please fill in all required fields");
                      return;
                    }
                    alert("Delivery recorded successfully!");
                    setShowAddDelivery(false);
                    setNewDelivery({
                      outletId: "",
                      outletName: "",
                      casesDelivered: 0,
                      amount: 0,
                      driver: "",
                      deliveryDate: new Date().toISOString().split("T")[0],
                      status: "delivered",
                      notes: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
                >
                  Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Outlets",
            value: state.outlets.length,
            icon: Package,
            color: "#FF8A00",
          },
          {
            label: "Total Cases Delivered",
            value: 0,
            icon: Package,
            color: "#2ECC71",
          },
          {
            label: "Total Amount",
            value: "₹0",
            icon: DollarSign,
            color: "#3B82F6",
          },
          {
            label: "Avg per Outlet",
            value: "₹0",
            icon: Truck,
            color: "#8B5CF6",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <Icon className="w-8 h-8" style={{ color: stat.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search outlets by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <select
          value={selectedOutlet}
          onChange={(e) => setSelectedOutlet(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">All Outlets</option>
          {state.outlets.map((outlet) => (
            <option key={outlet.id} value={outlet.id}>
              {outlet.name}
            </option>
          ))}
        </select>
      </div>

      {/* Outlets Table */}
      <div
        className="rounded-3xl overflow-hidden border border-gray-200"
        style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Outlet Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Address
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Deliveries
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Cases Delivered
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Last Delivery
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOutlets.map((outlet, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      {outlet.outletName}
                    </p>
                    <p className="text-sm text-gray-500">{outlet.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {outlet.address}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                      {outlet.deliveryCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {outlet.totalDelivered}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ₹{outlet.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {outlet.lastDelivery}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setShowAddDelivery(true)}
                      className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOutlets.length === 0 && (
        <div
          className="rounded-3xl p-12 bg-white text-center"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
        >
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No outlets found matching your search</p>
        </div>
      )}
    </div>
  );
}
