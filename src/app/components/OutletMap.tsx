import { useState, useEffect } from "react";
import { MapPin, Store, Clock, DollarSign, Loader, X } from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { Outlet } from "../../lib/types";

export function OutletMap() {
  const { state, loading, error, refreshOutlets, addOutlet } = useDataContext();
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [showAddOutlet, setShowAddOutlet] = useState(false);
  const [newOutlet, setNewOutlet] = useState({
    name: "",
    location: { x: 50, y: 50 },
    salesVolume: "medium" as const,
    nextDelivery: "",
    coolerCapacity: 500,
    currentStock: 0,
    owedAmount: 0,
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    refreshOutlets();
  }, [refreshOutlets]);

  useEffect(() => {
    if (state.outlets.length > 0 && !selectedOutlet) {
      setSelectedOutlet(state.outlets[0]);
    }
  }, [state.outlets, selectedOutlet]);

  const getVolumeColor = (volume: string) => {
    switch (volume) {
      case "high":
        return "#2ECC71";
      case "medium":
        return "#FF8A00";
      case "low":
        return "#94A3B8";
      default:
        return "#94A3B8";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading outlets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-900 mb-2">Error Loading Outlets</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={refreshOutlets}
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
            Outlet Management & Map
          </h2>
          <p className="text-gray-500 mt-1">
            Track customer locations and delivery schedules
          </p>
        </div>
        <button
          onClick={() => setShowAddOutlet(true)}
          className="px-6 py-3 rounded-2xl font-medium text-white transition-all hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
          }}
        >
          Add Outlet
        </button>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-700">High Volume</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm text-gray-700">Medium</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-sm text-gray-700">Low</span>
          </div>
        </div>
      </div>

      {showAddOutlet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Add New Outlet
              </h3>
              <button
                onClick={() => setShowAddOutlet(false)}
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
                <input
                  type="text"
                  placeholder="e.g., Downtown Store"
                  value={newOutlet.name}
                  onChange={(e) =>
                    setNewOutlet({ ...newOutlet, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Street address"
                  value={newOutlet.address}
                  onChange={(e) =>
                    setNewOutlet({ ...newOutlet, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="Contact number"
                  value={newOutlet.phone}
                  onChange={(e) =>
                    setNewOutlet({ ...newOutlet, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sales Volume
                </label>
                <select
                  value={newOutlet.salesVolume}
                  onChange={(e) =>
                    setNewOutlet({
                      ...newOutlet,
                      salesVolume: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cooler Capacity (cases)
                </label>
                <input
                  type="number"
                  min="1"
                  value={newOutlet.coolerCapacity}
                  onChange={(e) =>
                    setNewOutlet({
                      ...newOutlet,
                      coolerCapacity: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Delivery
                </label>
                <input
                  type="date"
                  value={newOutlet.nextDelivery}
                  onChange={(e) =>
                    setNewOutlet({ ...newOutlet, nextDelivery: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddOutlet(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newOutlet.name) {
                    alert("Please enter outlet name");
                    return;
                  }
                  try {
                    await addOutlet({
                      name: newOutlet.name,
                      location: newOutlet.location,
                      salesVolume: newOutlet.salesVolume,
                      nextDelivery: newOutlet.nextDelivery,
                      coolerCapacity: newOutlet.coolerCapacity,
                      currentStock: newOutlet.currentStock,
                      owedAmount: newOutlet.owedAmount,
                      phone: newOutlet.phone,
                      address: newOutlet.address,
                    });
                    alert("Outlet added successfully!");
                    setShowAddOutlet(false);
                    setNewOutlet({
                      name: "",
                      location: { x: 50, y: 50 },
                      salesVolume: "medium",
                      nextDelivery: "",
                      coolerCapacity: 500,
                      currentStock: 0,
                      owedAmount: 0,
                      phone: "",
                      email: "",
                      address: "",
                    });
                  } catch (err) {
                    alert("Error adding outlet. Please try again.");
                  }
                }}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
              >
                Add Outlet
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 rounded-3xl p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #F0FDF4 0%, #DBEAFE 100%)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
            height: "600px",
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20px 20px, #94A3B8 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm w-fit">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-gray-700">
                Distribution Zone A
              </span>
            </div>

            {state.outlets.map((outlet: Outlet) => (
              <div
                key={outlet.id}
                className="absolute cursor-pointer group"
                style={{
                  left: `${outlet.location.x}%`,
                  top: `${outlet.location.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => setSelectedOutlet(outlet)}
              >
                <div className="relative">
                  <div
                    className="w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-150"
                    style={{
                      backgroundColor: getVolumeColor(outlet.salesVolume),
                      boxShadow: `0 0 0 8px ${getVolumeColor(outlet.salesVolume)}20`,
                    }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl bg-gray-900 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {outlet.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 right-4 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm">
              <p className="text-sm font-semibold text-gray-900">
                {state.outlets.length} Active Outlets
              </p>
            </div>
          </div>
        </div>

        <div
          className="space-y-4 overflow-y-auto"
          style={{ maxHeight: "600px" }}
        >
          <h3 className="font-bold text-xl text-gray-900">
            Upcoming Deliveries
          </h3>

          {state.outlets.length === 0 ? (
            <div className="rounded-2xl p-6 bg-gray-50 text-center">
              <p className="text-gray-500">No outlets found</p>
            </div>
          ) : (
            state.outlets.map((outlet: Outlet) => {
              const stockPercentage =
                (outlet.currentStock / outlet.coolerCapacity) * 100;
              const isSelected = selectedOutlet?.id === outlet.id;

              return (
                <div
                  key={outlet.id}
                  onClick={() => setSelectedOutlet(outlet)}
                  className="rounded-2xl p-4 cursor-pointer transition-all duration-300"
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)"
                      : "rgba(255, 255, 255, 0.9)",
                    boxShadow: isSelected
                      ? "0 8px 24px rgba(255, 138, 0, 0.25)"
                      : "0 4px 16px rgba(0, 0, 0, 0.04)",
                    color: isSelected ? "white" : "#1E293B",
                    border: isSelected
                      ? "none"
                      : "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Store
                        className="w-5 h-5"
                        style={{
                          color: isSelected
                            ? "white"
                            : getVolumeColor(outlet.salesVolume),
                        }}
                      />
                      <h4 className="font-semibold">{outlet.name}</h4>
                    </div>
                    {outlet.owedAmount > 0 && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${isSelected ? "bg-white/20" : "bg-red-50 text-red-600"}`}
                      >
                        Credit
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{outlet.nextDelivery}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={
                          isSelected ? "text-white/80" : "text-gray-600"
                        }
                      >
                        Stock: {outlet.currentStock}/{outlet.coolerCapacity}
                      </span>
                      <span className="font-semibold">
                        {stockPercentage.toFixed(0)}%
                      </span>
                    </div>

                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{
                        background: isSelected
                          ? "rgba(255, 255, 255, 0.2)"
                          : "#F1F5F9",
                      }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${stockPercentage}%`,
                          background: isSelected
                            ? "white"
                            : getVolumeColor(outlet.salesVolume),
                        }}
                      />
                    </div>

                    {outlet.owedAmount > 0 && (
                      <div
                        className="flex items-center gap-2 pt-2 border-t"
                        style={{
                          borderColor: isSelected
                            ? "rgba(255, 255, 255, 0.2)"
                            : "#F1F5F9",
                        }}
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>Owed: ₹{outlet.owedAmount}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
