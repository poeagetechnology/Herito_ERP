import { useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Loader,
  DollarSign,
  Package,
  Store,
  Truck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDataContext } from "../../lib/dataContext";
import type { DashboardStat } from "../../lib/types";

export function Dashboard() {
  const { state, loading, error, refreshDashboard } = useDataContext();

  useEffect(() => {
    // Refresh dashboard data when component mounts
    refreshDashboard();
  }, [refreshDashboard]);

  const dashboardData = state.dashboardData || {
    stats: [],
    weeklyRevenue: [],
    topFlavors: [],
    alerts: [],
  };

  // Format stats for display
  const displayStats = dashboardData.stats.map((stat: DashboardStat) => ({
    ...stat,
    icon: getIconForStat(stat.label),
    color: getColorForStat(stat.label),
    bgColor: getBgColorForStat(stat.label),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={refreshDashboard}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((stat: any, index: number) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id || index}
              className="rounded-2xl p-6 transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                {stat.trend !== undefined && stat.trend > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-semibold text-green-600">
                      {stat.trend > 0 ? "+" : ""}
                      {stat.trend}%
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatStatValue(stat.value)}
              </p>
              {stat.trendLabel && (
                <p className="text-sm text-gray-600 mt-2">{stat.trendLabel}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 rounded-3xl p-6 bg-white"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-gray-900">Revenue Trend</h3>
            <select className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
            </select>
          </div>
          {dashboardData.weeklyRevenue &&
          dashboardData.weeklyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.weeklyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2ECC71" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2ECC71"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              No revenue data available
            </div>
          )}
        </div>

        <div
          className="rounded-3xl p-6 bg-white"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
        >
          <h3 className="font-bold text-xl text-gray-900 mb-4">Top Flavors</h3>
          {dashboardData.topFlavors && dashboardData.topFlavors.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.topFlavors.map((flavor: any, index: number) => (
                <div key={flavor.id || index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: flavor.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {flavor.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {flavor.casesSold}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${flavor.percentage}%`,
                        backgroundColor: flavor.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No flavor data available</p>
          )}
        </div>
      </div>

      <div
        className="rounded-3xl p-6 bg-white"
        style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-gray-900">Recent Alerts</h3>
          <button 
            onClick={() => alert('View all alerts feature coming soon')}
            className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            View All
          </button>
        </div>
        {dashboardData.alerts && dashboardData.alerts.length > 0 ? (
          <div className="space-y-3">
            {dashboardData.alerts.map((alert: any, index: number) => (
              <div
                key={alert.id || index}
                className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50 border border-orange-100"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                </div>
                <button 
                  onClick={() => {
                    alert(`Alert: ${alert.title}\n\n${alert.message}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-orange-600 font-medium hover:bg-orange-100 transition-all whitespace-nowrap"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No alerts at this time
          </p>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getIconForStat(label: string) {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Revenue: DollarSign,
    "Total Revenue": DollarSign,
    Sales: DollarSign,
    Cases: Package,
    "Cases Sold": Package,
    Outlets: Store,
    "Active Outlets": Store,
    Deliveries: Truck,
    "Active Deliveries": Truck,
  };

  for (const [key, icon] of Object.entries(iconMap)) {
    if (label.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return Package;
}

function getColorForStat(label: string) {
  if (
    label.toLowerCase().includes("revenue") ||
    label.toLowerCase().includes("sales")
  )
    return "#2ECC71";
  if (label.toLowerCase().includes("cases")) return "#FF8A00";
  if (label.toLowerCase().includes("outlet")) return "#3B82F6";
  if (label.toLowerCase().includes("deliver")) return "#8B5CF6";
  return "#FF8A00";
}

function getBgColorForStat(label: string) {
  if (
    label.toLowerCase().includes("revenue") ||
    label.toLowerCase().includes("sales")
  )
    return "#F0FDF4";
  if (label.toLowerCase().includes("cases")) return "#FFF4E6";
  if (label.toLowerCase().includes("outlet")) return "#EFF6FF";
  if (label.toLowerCase().includes("deliver")) return "#F5F3FF";
  return "#FFF4E6";
}

function formatStatValue(value: any) {
  if (typeof value === "number") {
    if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `${value.toLocaleString()}`;
  }
  return value;
}
