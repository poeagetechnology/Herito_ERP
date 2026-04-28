import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Target,
  DollarSign,
  Phone,
  Mail,
  Building2,
  TrendingUp,
  X,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { SalesRep } from "../../lib/types";

export function MobileView() {
  const {
    state,
    loading,
    error,
    refreshSalesReps,
    addSalesRep,
    updateSalesRep,
    deleteSalesRep,
  } = useDataContext();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    target: 0,
    casesSold: 0,
    revenue: 0,
    outlets: 0,
    trend: 0,
  });

  useEffect(() => {
    refreshSalesReps();
  }, [refreshSalesReps]);

  const filteredAgents = state.salesReps.filter((agent) => {
    const search = searchTerm.toLowerCase();
    return (
      agent.name.toLowerCase().includes(search) ||
      agent.email?.toLowerCase().includes(search) ||
      agent.phone?.toLowerCase().includes(search)
    );
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      avatar: "",
      target: 0,
      casesSold: 0,
      revenue: 0,
      outlets: 0,
      trend: 0,
    });
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter agent name");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateSalesRep(editingId, formData);
        alert("Field agent updated successfully!");
      } else {
        await addSalesRep(formData);
        alert("Field agent added successfully!");
      }

      setShowForm(false);
      resetForm();
      refreshSalesReps();
    } catch (saveError) {
      console.error("Error saving field agent:", saveError);
      alert("Failed to save field agent. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (agent: SalesRep) => {
    setFormData({
      name: agent.name,
      email: agent.email || "",
      phone: agent.phone || "",
      avatar: agent.avatar || "",
      target: agent.target,
      casesSold: agent.casesSold,
      revenue: agent.revenue,
      outlets: agent.outlets,
      trend: agent.trend,
    });
    setEditingId(agent.id);
    setShowForm(true);
  };

  const handleDelete = async (agentId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this field agent? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setDeletingId(agentId);
      await deleteSalesRep(agentId);
      alert("Field agent deleted successfully!");
      refreshSalesReps();
    } catch (deleteError) {
      console.error("Error deleting field agent:", deleteError);
      alert("Failed to delete field agent. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalTarget = state.salesReps.reduce((sum, agent) => sum + agent.target, 0);
  const totalCases = state.salesReps.reduce(
    (sum, agent) => sum + agent.casesSold,
    0,
  );
  const totalRevenue = state.salesReps.reduce(
    (sum, agent) => sum + agent.revenue,
    0,
  );
  const avgAchievement =
    totalTarget > 0 ? ((totalCases / totalTarget) * 100).toFixed(1) : "0.0";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading field agents...</p>
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
            Field Agents
          </h2>
          <p className="text-gray-500 mt-1">
            Add complete agent details and manage them in one place
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-6 py-3 rounded-2xl font-medium text-white transition-all hover:shadow-lg flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
          }}
        >
          <Plus className="w-5 h-5" />
          Add Field Agent
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingId ? "Edit Field Agent" : "Add Field Agent"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Arjun Kumar"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                    placeholder="e.g., +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
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
                    placeholder="e.g., agent@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar / Initials
                </label>
                <input
                  type="text"
                  placeholder="e.g., AK"
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Outlets
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.outlets}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        outlets: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trend %
                  </label>
                  <input
                    type="number"
                    value={formData.trend}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trend: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Cases
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.target}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        target: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cases Sold
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.casesSold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        casesSold: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revenue (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.revenue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        revenue: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : editingId ? "Update Agent" : "Add Agent"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Agents",
            value: state.salesReps.length,
            icon: Users,
            color: "#FF8A00",
          },
          {
            label: "Total Target Cases",
            value: totalTarget.toLocaleString(),
            icon: Target,
            color: "#3B82F6",
          },
          {
            label: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "#2ECC71",
          },
          {
            label: "Avg Achievement",
            value: `${avgAchievement}%`,
            icon: TrendingUp,
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
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {filteredAgents.length === 0 ? (
        <div
          className="rounded-3xl p-12 bg-white text-center"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
        >
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No field agents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAgents.map((agent) => {
            const initials =
              agent.avatar ||
              agent.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
            const achievement =
              agent.target > 0 ? (agent.casesSold / agent.target) * 100 : 0;

            return (
              <div
                key={agent.id}
                className="rounded-2xl p-5 bg-white"
                style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{agent.name}</h4>
                      <p className="text-sm text-gray-600">
                        {agent.outlets} assigned outlets
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(agent)}
                      className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      disabled={deletingId === agent.id}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{agent.phone || "No phone"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{agent.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>Trend: {agent.trend}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded-lg p-2 bg-gray-50">
                      <p className="text-gray-500">Target</p>
                      <p className="font-semibold text-gray-900">{agent.target}</p>
                    </div>
                    <div className="rounded-lg p-2 bg-gray-50">
                      <p className="text-gray-500">Sold</p>
                      <p className="font-semibold text-gray-900">
                        {agent.casesSold}
                      </p>
                    </div>
                    <div className="rounded-lg p-2 bg-gray-50">
                      <p className="text-gray-500">Revenue</p>
                      <p className="font-semibold text-gray-900">
                        ₹{agent.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Achievement</span>
                      <span className="font-semibold text-gray-700">
                        {achievement.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(achievement, 100)}%`,
                          background:
                            "linear-gradient(90deg, #FF8A00 0%, #FFB347 100%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
