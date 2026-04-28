import { useState, useEffect } from "react";
import {
  MapPin,
  Store,
  Clock,
  DollarSign,
  Loader,
  X,
  Info,
  Plus,
} from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { Outlet } from "../../lib/types";
import { InteractiveMap } from "./figma/InteractiveMap";
import { getLocationName } from "../../lib/mapUtils";

export function OutletMap() {
  const { state, loading, error, refreshOutlets, addOutlet } = useDataContext();
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [showAddOutlet, setShowAddOutlet] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [newOutlet, setNewOutlet] = useState({
    name: "",
    locationName: "",
    location: { lat: 11.0086, lng: 76.9011 }, // Default to Coimbatore
    phone: "",
    email: "",
    address: "",
    refillBreakDays: 7 as 7 | 14 | 28,
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
          className="px-6 py-3 rounded-2xl font-medium text-white transition-all hover:shadow-lg flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
          }}
        >
          <Plus className="w-5 h-5" />
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
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Add New Outlet with Location
              </h3>
              <button
                onClick={() => {
                  setShowAddOutlet(false);
                  setSelectedMapLocation(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Interactive Map for Location Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  Select Location on Map *
                </label>
                <div style={{ height: "400px", overflow: "auto" }}>
                  <InteractiveMap
                    outlets={[]}
                    onOutletSelect={() => {}}
                    onLocationSelect={(location) => {
                      const locationName = getLocationName(location.lat, location.lng);
                      setSelectedMapLocation(location);
                      setNewOutlet({ ...newOutlet, location, locationName });
                    }}
                    isSelectionMode={true}
                  />
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Outlet Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Outlet Name *
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
                      Location *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Gandhipuram, Coimbatore"
                      value={newOutlet.locationName}
                      onChange={(e) =>
                        setNewOutlet({
                          ...newOutlet,
                          locationName: e.target.value,
                        })
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

                  <div className="grid grid-cols-2 gap-3">
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
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Email address"
                        value={newOutlet.email}
                        onChange={(e) =>
                          setNewOutlet({ ...newOutlet, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refill Break *
                    </label>
                    <select
                      value={newOutlet.refillBreakDays}
                      onChange={(e) =>
                        setNewOutlet({
                          ...newOutlet,
                          refillBreakDays: Number(e.target.value) as 7 | 14 | 28,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value={7}>7 Days</option>
                      <option value={14}>14 Days</option>
                      <option value={28}>28 Days</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              {selectedMapLocation && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">
                      Location:{" "}
                      {getLocationName(
                        selectedMapLocation.lat,
                        selectedMapLocation.lng,
                      )}
                    </p>
                    <p className="text-xs mt-1">
                      Coordinates: {selectedMapLocation.lat.toFixed(4)}°N,{" "}
                      {selectedMapLocation.lng.toFixed(4)}°E
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowAddOutlet(false);
                  setSelectedMapLocation(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newOutlet.name) {
                    alert("Please enter outlet name");
                    return;
                  }
                  if (!newOutlet.locationName) {
                    alert("Please enter location");
                    return;
                  }
                  if (!selectedMapLocation) {
                    alert("Please select location on the map");
                    return;
                  }
                  try {
                    await addOutlet({
                      name: newOutlet.name,
                      locationName: newOutlet.locationName,
                      location: newOutlet.location,
                      salesVolume: "medium",
                      nextDelivery: "",
                      coolerCapacity: 500,
                      currentStock: 0,
                      owedAmount: 0,
                      refillBreakDays: newOutlet.refillBreakDays,
                      phone: newOutlet.phone,
                      email: newOutlet.email,
                      address: newOutlet.address,
                    });
                    alert("Outlet added successfully!");
                    setShowAddOutlet(false);
                    setSelectedMapLocation(null);
                    setNewOutlet({
                      name: "",
                      locationName: "",
                      location: { lat: 11.0086, lng: 76.9011 },
                      phone: "",
                      email: "",
                      address: "",
                      refillBreakDays: 7,
                    });
                    refreshOutlets();
                  } catch (err) {
                    alert("Error adding outlet. Please try again.");
                  }
                }}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium"
              >
                Add Outlet
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 rounded-3xl p-6 overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
          }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            Distribution Map - Tamil Nadu (Interactive)
          </h3>
          <InteractiveMap
            outlets={state.outlets}
            selectedOutletId={selectedOutlet?.id}
            onOutletSelect={(outletId) => {
              const outlet = state.outlets.find((o) => o.id === outletId);
              if (outlet) {
                setSelectedOutlet(outlet);
              }
            }}
            isSelectionMode={false}
          />
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
