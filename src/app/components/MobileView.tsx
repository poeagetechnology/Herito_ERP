import { useEffect } from "react";
import {
  Smartphone,
  Store,
  Package,
  Clock,
  CheckCircle,
  Plus,
  Zap,
  Loader,
} from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { Outlet } from "../../lib/types";

export function MobileView() {
  const { state, loading, error, refreshOutlets } = useDataContext();

  useEffect(() => {
    refreshOutlets();
  }, [refreshOutlets]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading mobile view...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-900 mb-2">Error Loading Data</h3>
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
            Field Agent Mobile App
          </h2>
          <p className="text-gray-500 mt-1">
            Simplified mobile interface for on-the-go sales
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div
            className="rounded-3xl p-8 bg-gradient-to-br from-gray-800 to-gray-900 text-white relative overflow-hidden"
            style={{ boxShadow: "0 16px 48px rgba(0, 0, 0, 0.2)" }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/20 to-transparent rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-6 h-6" />
                  <span className="font-semibold">herito Mobile</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm">Online</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Good Morning!</h3>
                <p className="text-white/70">
                  You have {state.outlets.length} outlets to visit today
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold">
                    {state.outlets.length * 3}
                  </div>
                  <div className="text-sm text-white/70 mt-1">Visits Today</div>
                </div>
                <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold">
                    {Math.floor(state.outlets.length * 2)}
                  </div>
                  <div className="text-sm text-white/70 mt-1">Orders</div>
                </div>
                <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold">96%</div>
                  <div className="text-sm text-white/70 mt-1">Target</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                      <Store className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-semibold">Next Visit</p>
                      <p className="text-sm text-white/70">
                        {state.outlets.length > 0
                          ? state.outlets[0].name
                          : "No outlets available"}
                      </p>
                    </div>
                  </div>
                  <Clock className="w-5 h-5 text-white/50" />
                </div>

                <button
                  className="w-full py-4 rounded-2xl font-semibold text-white transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
                  }}
                >
                  Start Navigation
                </button>
              </div>
            </div>
          </div>

          <div
            className="rounded-3xl p-6 bg-white"
            style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
          >
            <h3 className="font-bold text-xl text-gray-900 mb-4">
              Key Features
            </h3>
            <div className="space-y-3">
              {[
                {
                  icon: Zap,
                  label: "One-Tap Quick Order",
                  desc: "Reorder standard shipments instantly",
                },
                {
                  icon: Package,
                  label: "Digital POD",
                  desc: "Capture signatures electronically",
                },
                {
                  icon: CheckCircle,
                  label: "Offline Mode",
                  desc: "Works without internet connection",
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
                      }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {feature.label}
                      </p>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-gray-900">Today's Route</h3>
            <button 
              onClick={() => alert('Route optimization running...')}
              className="px-4 py-2 rounded-xl bg-orange-50 text-orange-600 font-medium hover:bg-orange-100 transition-all"
            >
              Optimize
            </button>
          </div>

          {state.outlets.length === 0 ? (
            <div
              className="rounded-2xl p-8 bg-white text-center"
              style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)" }}
            >
              <p className="text-gray-500">No outlets available for today</p>
            </div>
          ) : (
            state.outlets.map((outlet: Outlet, index: number) => {
              const isLowStock = outlet.currentStock < 35;

              return (
                <div
                  key={outlet.id}
                  className="rounded-2xl p-5 bg-white transition-all duration-300 hover:shadow-lg"
                  style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {outlet.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          <span>{outlet.location?.x}% away</span>
                          <span>·</span>
                          <span>{outlet.nextDelivery}</span>
                        </div>
                      </div>
                    </div>
                    {isLowStock && (
                      <div className="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-semibold">
                        Low Stock
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl p-3 bg-gray-50">
                      <p className="text-xs text-gray-600 mb-1">
                        Cooler Capacity
                      </p>
                      <p className="font-bold text-gray-900">
                        {outlet.coolerCapacity} cases
                      </p>
                    </div>
                    <div className="rounded-xl p-3 bg-gray-50">
                      <p className="text-xs text-gray-600 mb-1">
                        Current Stock
                      </p>
                      <p
                        className={`font-bold ${isLowStock ? "text-red-600" : "text-gray-900"}`}
                      >
                        {outlet.currentStock} cases
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Quick order for ${outlet.name} created!`)}
                      className="flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 hover:shadow-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
                        color: "white",
                        boxShadow: "0 4px 12px rgba(255, 138, 0, 0.25)",
                      }}
                    >
                      <Zap className="w-4 h-4" />
                      Quick Order
                    </button>
                    <button 
                      onClick={() => alert(`Custom order form opening for ${outlet.name}`)}
                      className="flex-1 py-3 rounded-xl font-medium bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-500 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Custom
                    </button>
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
