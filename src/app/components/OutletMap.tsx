import { useState, useEffect } from "react";
import { MapPin, Store, Clock, DollarSign, Loader } from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { Outlet } from "../../lib/types";

export function OutletMap() {
  const { state, loading, error, refreshOutlets } = useDataContext();
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);

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
