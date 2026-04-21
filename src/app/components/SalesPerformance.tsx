import { useEffect } from "react";
import {
  TrendingUp,
  Award,
  Target,
  DollarSign,
  Package,
  Loader,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDataContext } from "../../lib/dataContext";
import type { SalesRep } from "../../lib/types";

export function SalesPerformance() {
  const { state, loading, error, refreshSalesReps } = useDataContext();

  useEffect(() => {
    refreshSalesReps();
  }, [refreshSalesReps]);

  // Calculate statistics
  const totalCasesSold = state.salesReps.reduce(
    (sum: number, rep: SalesRep) => sum + rep.casesSold,
    0,
  );
  const totalRevenue = state.salesReps.reduce(
    (sum: number, rep: SalesRep) => sum + rep.revenue,
    0,
  );
  const averageTarget = state.salesReps.reduce(
    (sum: number, rep: SalesRep) => sum + rep.target,
    0,
  );
  const performanceRate =
    averageTarget > 0
      ? ((totalCasesSold / averageTarget) * 100).toFixed(1)
      : "0";

  // Generate weekly data from sales reps data (mock for now)
  const weeklyData = [
    { day: "Mon", cases: 420, revenue: 12600 },
    { day: "Tue", cases: 580, revenue: 17400 },
    { day: "Wed", cases: 710, revenue: 21300 },
    { day: "Thu", cases: 650, revenue: 19500 },
    { day: "Fri", cases: 890, revenue: 26700 },
    { day: "Sat", cases: 340, revenue: 10200 },
    { day: "Sun", cases: 190, revenue: 5700 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading sales performance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-900 mb-2">
          Error Loading Sales Data
        </h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={refreshSalesReps}
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
            Sales Rep Performance
          </h2>
          <p className="text-gray-500 mt-1">
            Track team achievements and targets
          </p>
        </div>
        <select className="px-4 py-2 rounded-xl border border-gray-200 bg-white font-medium text-gray-700">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Cases Sold",
            value: totalCasesSold.toLocaleString(),
            icon: Package,
            color: "#FF8A00",
            change: "+12%",
          },
          {
            label: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "#2ECC71",
            change: "+18%",
          },
          {
            label: "Performance Rate",
            value: `${performanceRate}%`,
            icon: Target,
            color: "#3B82F6",
            change: "+8%",
          },
          {
            label: "Active Reps",
            value: state.salesReps.length,
            icon: Award,
            color: "#8B5CF6",
            change: "—",
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
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                {stat.change !== "—" && (
                  <span className="px-2 py-1 rounded-lg bg-green-50 text-green-600 text-xs font-semibold">
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-3xl p-6 bg-white"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
        >
          <h3 className="font-bold text-xl text-gray-900 mb-4">
            Weekly Sales Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8A00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF8A00" stopOpacity={0} />
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
                dataKey="cases"
                stroke="#FF8A00"
                strokeWidth={3}
                fill="url(#colorCases)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div
          className="rounded-3xl p-6 bg-white"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
        >
          <h3 className="font-bold text-xl text-gray-900 mb-4">
            Daily Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
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
              <Bar dataKey="revenue" fill="#2ECC71" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-xl text-gray-900 mb-4">
          Team Leaderboard
        </h3>
        {state.salesReps.length === 0 ? (
          <div
            className="rounded-2xl p-12 bg-white text-center"
            style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
          >
            <p className="text-gray-500">No sales reps found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.salesReps.map((rep: SalesRep, index: number) => {
              const achievementRate = (rep.casesSold / rep.target) * 100;
              const isTopPerformer = achievementRate >= 100;

              return (
                <div
                  key={rep.id}
                  className="rounded-2xl p-6 transition-all duration-300 hover:scale-105"
                  style={{
                    background: isTopPerformer
                      ? "linear-gradient(135deg, #2ECC71 0%, #6EE7B7 100%)"
                      : "rgba(255, 255, 255, 0.9)",
                    boxShadow: isTopPerformer
                      ? "0 8px 32px rgba(46, 204, 113, 0.3)"
                      : "0 4px 16px rgba(0, 0, 0, 0.06)",
                    color: isTopPerformer ? "white" : "#1E293B",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 relative">
                      {index === 0 && (
                        <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg">
                          👑
                        </div>
                      )}
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl"
                        style={{
                          background: isTopPerformer
                            ? "rgba(255, 255, 255, 0.2)"
                            : "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
                          color: "white",
                        }}
                      >
                        {rep.avatar ||
                          rep.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{rep.name}</h4>
                        <p
                          className={`text-sm ${isTopPerformer ? "text-white/80" : "text-gray-600"}`}
                        >
                          {rep.outlets} outlets
                        </p>
                      </div>
                    </div>
                    {rep.trend !== undefined && (
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full ${rep.trend > 0 ? (isTopPerformer ? "bg-white/20" : "bg-green-50") : "bg-red-50"}`}
                      >
                        <TrendingUp
                          className={`w-3 h-3 ${rep.trend > 0 ? (isTopPerformer ? "text-white" : "text-green-600") : "text-red-600 rotate-180"}`}
                        />
                        <span
                          className={`text-xs font-semibold ${rep.trend > 0 ? (isTopPerformer ? "text-white" : "text-green-600") : "text-red-600"}`}
                        >
                          {Math.abs(rep.trend)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {rep.casesSold.toLocaleString()}
                      </span>
                      <span
                        className={
                          isTopPerformer ? "text-white/80" : "text-gray-500"
                        }
                      >
                        / {rep.target.toLocaleString()} cases
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Target Achievement</span>
                        <span className="font-semibold">
                          {achievementRate.toFixed(0)}%
                        </span>
                      </div>
                      <div
                        className="h-2 rounded-full overflow-hidden"
                        style={{
                          background: isTopPerformer
                            ? "rgba(255, 255, 255, 0.2)"
                            : "#F1F5F9",
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(achievementRate, 100)}%`,
                            background: isTopPerformer
                              ? "white"
                              : "linear-gradient(90deg, #FF8A00 0%, #FFB347 100%)",
                          }}
                        />
                      </div>
                    </div>

                    <div
                      className="pt-3 border-t flex items-center justify-between"
                      style={{
                        borderColor: isTopPerformer
                          ? "rgba(255, 255, 255, 0.2)"
                          : "#F1F5F9",
                      }}
                    >
                      <span className="text-sm">Revenue</span>
                      <span className="font-bold text-lg">
                        ₹{rep.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
