import { useEffect } from "react";
import {
  Truck,
  MapPin,
  Route,
  Clock,
  CheckCircle,
  Navigation,
  Loader,
} from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { DeliveryVan } from "../../lib/types";

export function Logistics() {
  const { state, loading, error, refreshVans } = useDataContext();

  useEffect(() => {
    refreshVans();
  }, [refreshVans]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#2ECC71";
      case "returning":
        return "#3B82F6";
      case "idle":
        return "#94A3B8";
      default:
        return "#94A3B8";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "On Route";
      case "returning":
        return "Returning";
      case "idle":
        return "Available";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading logistics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-900 mb-2">Error Loading Logistics</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={refreshVans}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const activeVans = state.vans.filter((v) => v.status === "active").length;
  const completedDeliveries = state.vans.reduce(
    (sum: number, v: DeliveryVan) => sum + v.completed,
    0,
  );
  const totalDeliveries = state.vans.reduce(
    (sum: number, v: DeliveryVan) => sum + v.deliveries,
    0,
  );
  const avgFuelLevel =
    state.vans.length > 0
      ? Math.round(
          state.vans.reduce(
            (sum: number, v: DeliveryVan) => sum + v.fuelLevel,
            0,
          ) / state.vans.length,
        )
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Distributor Logistics
          </h2>
          <p className="text-gray-500 mt-1">
            Real-time van tracking and route optimization
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              alert('Route optimization algorithm will run. This feature is being developed.');
              // TODO: Implement route optimization
            }}
            className="px-6 py-3 rounded-2xl font-medium bg-white border border-gray-200 text-gray-700 hover:border-orange-500 transition-all hover:shadow-md"
          >
            Optimize Routes
          </button>
          <button
            onClick={() => {
              alert('Dispatch Van form will open. This feature is being developed.');
              // TODO: Implement dispatch van form
            }}
            className="px-6 py-3 rounded-2xl font-medium text-white transition-all hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
            }}
          >
            Dispatch Van
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Active Vans",
            value: activeVans,
            total: state.vans.length,
            color: "#2ECC71",
          },
          {
            label: "Deliveries Today",
            value: completedDeliveries,
            total: totalDeliveries,
            color: "#FF8A00",
          },
          {
            label: "On-Time Rate",
            value: 96,
            total: 100,
            color: "#3B82F6",
            suffix: "%",
          },
          {
            label: "Avg Fuel Level",
            value: avgFuelLevel,
            total: 100,
            color: "#8B5CF6",
            suffix: "%",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span
                className="text-3xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
              {stat.suffix && (
                <span className="text-gray-400">{stat.suffix}</span>
              )}
              {!stat.suffix && (
                <span className="text-gray-400">/ {stat.total}</span>
              )}
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stat.total > 0 ? (stat.value / stat.total) * 100 : 0}%`,
                  backgroundColor: stat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {state.vans.length === 0 ? (
        <div
          className="rounded-3xl p-12 bg-white text-center"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
        >
          <p className="text-gray-500">
            No vans found. Please add vans to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {state.vans.map((van: DeliveryVan) => {
            const progressPercentage =
              van.deliveries > 0 ? (van.completed / van.deliveries) * 100 : 0;

            return (
              <div
                key={van.id}
                className="rounded-3xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
                      }}
                    >
                      {van.avatar ||
                        van.driver
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {van.driver}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {van.id} · {van.licensePlate}
                      </p>
                    </div>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: getStatusColor(van.status) }}
                  >
                    {getStatusLabel(van.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div
                    className="rounded-xl p-3"
                    style={{ backgroundColor: "#F8F9FB" }}
                  >
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">Current Location</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {van.location}
                    </p>
                  </div>
                  <div
                    className="rounded-xl p-3"
                    style={{ backgroundColor: "#F8F9FB" }}
                  >
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">ETA</span>
                    </div>
                    <p className="font-semibold text-gray-900">{van.eta}</p>
                  </div>
                </div>

                {van.deliveries > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Delivery Progress
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {van.completed} / {van.deliveries}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progressPercentage}%`,
                          background:
                            "linear-gradient(90deg, #2ECC71 0%, #6EE7B7 100%)",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Navigation className="w-4 h-4" />
                      <span className="text-sm">Fuel Level</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {van.fuelLevel}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${van.fuelLevel}%`,
                        backgroundColor:
                          van.fuelLevel > 50
                            ? "#2ECC71"
                            : van.fuelLevel > 25
                              ? "#FF8A00"
                              : "#EF4444",
                      }}
                    />
                  </div>
                </div>

                {van.route.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Route className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        Route
                      </span>
                    </div>
                    <div className="space-y-2">
                      {van.route.map((stop, index) => {
                        const isCompleted = index < van.completed;
                        const isCurrent = index === van.completed;

                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                  isCompleted
                                    ? "bg-green-500"
                                    : isCurrent
                                      ? "bg-orange-500 ring-4 ring-orange-100"
                                      : "bg-gray-200"
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                ) : (
                                  <span className="text-xs font-bold text-white">
                                    {index + 1}
                                  </span>
                                )}
                              </div>
                              {index < van.route.length - 1 && (
                                <div
                                  className={`w-0.5 h-6 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                                />
                              )}
                            </div>
                            <div
                              className={`flex-1 ${!isCompleted && !isCurrent ? "opacity-50" : ""}`}
                            >
                              <p
                                className={`text-sm ${isCurrent ? "font-semibold text-orange-600" : "text-gray-700"}`}
                              >
                                {stop}
                              </p>
                              {isCurrent && (
                                <p className="text-xs text-orange-500 mt-0.5">
                                  Current Stop
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {van.status === "idle" && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      className="w-full py-3 rounded-xl font-medium text-white transition-all"
                      style={{
                        background:
                          "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
                      }}
                    >
                      Assign Route
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
