import {
  LayoutDashboard,
  Package,
  MapPin,
  ClipboardList,
  TrendingUp,
  Truck,
  Users,
  Settings,
  Bell,
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "inventory", icon: Package, label: "Inventory Hub" },
    { id: "outlets", icon: MapPin, label: "Outlets & Map" },
    { id: "orders", icon: ClipboardList, label: "Order Pipeline" },
    { id: "performance", icon: TrendingUp, label: "Sales Performance" },
    { id: "logistics", icon: Truck, label: "Logistics" },
    { id: "mobile", icon: Users, label: "Field Agents" },
  ];

  return (
    <div
      className="w-72 h-screen sticky top-0 flex flex-col backdrop-blur-xl border-r border-white/20"
      style={{
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
        boxShadow: "4px 0 24px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
              boxShadow: "0 8px 24px rgba(255, 138, 0, 0.3)",
            }}
          >
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-900">herito</h1>
            <p className="text-xs text-gray-500">Fresh Efficiency</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-green-50 mb-6">
          <Bell className="w-5 h-5 text-orange-500" />
          <div className="flex-1">
            <p className="text-sm text-gray-700">3 Low Stock Alerts</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300"
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
                      boxShadow: "0 4px 16px rgba(255, 138, 0, 0.25)",
                      color: "white",
                    }
                  : {
                      background: "transparent",
                      color: "#64748B",
                    }
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200/50">
        <button
          onClick={() =>
            alert(
              "Settings panel coming soon. Contact administrator for system configuration.",
            )
          }
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-100/50 transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
}
