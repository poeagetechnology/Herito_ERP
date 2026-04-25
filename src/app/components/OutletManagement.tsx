import { useState, useEffect } from "react";
import {
  Store,
  Plus,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { Outlet } from "../../lib/types";

export function OutletManagement() {
  const {
    state,
    loading,
    error,
    refreshOutlets,
    addOutlet,
    updateOutlet,
    deleteOutlet,
  } = useDataContext();
  const [showAddOutlet, setShowAddOutlet] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVolume, setFilterVolume] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    coolerCapacity: 500,
    currentStock: 0,
    owedAmount: 0,
    salesVolume: "medium" as "high" | "medium" | "low",
    nextDelivery: "",
    location: { x: 50, y: 50 },
  });

  useEffect(() => {
    refreshOutlets();
  }, [refreshOutlets]);

  const salesVolumes = ["high", "medium", "low"];

  const filteredOutlets = state.outlets.filter(
    (outlet) =>
      (outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outlet.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outlet.address?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterVolume === "all" || outlet.salesVolume === filterVolume),
  );

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      coolerCapacity: 500,
      currentStock: 0,
      owedAmount: 0,
      salesVolume: "medium",
      nextDelivery: "",
      location: { x: 50, y: 50 },
    });
    setEditingId(null);
  };

  const handleAddOutlet = async () => {
    if (!formData.name) {
      alert("Please fill in outlet name");
      return;
    }
    if (formData.coolerCapacity <= 0) {
      alert("Cooler capacity must be greater than 0");
      return;
    }

    try {
      setIsSaving(true);
      if (editingId) {
        await updateOutlet(editingId, formData);
        alert("Outlet updated successfully!");
      } else {
        await addOutlet(formData);
        alert("Outlet added successfully!");
      }
      setShowAddOutlet(false);
      resetForm();
      refreshOutlets();
    } catch (error) {
      console.error("Error saving outlet:", error);
      alert("Failed to save outlet. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditOutlet = (outlet: Outlet) => {
    setFormData({
      name: outlet.name,
      phone: outlet.phone || "",
      email: outlet.email || "",
      address: outlet.address || "",
      coolerCapacity: outlet.coolerCapacity,
      currentStock: outlet.currentStock,
      owedAmount: outlet.owedAmount,
      salesVolume: outlet.salesVolume,
      nextDelivery: outlet.nextDelivery,
      location: outlet.location,
    });
    setEditingId(outlet.id);
    setShowAddOutlet(true);
  };

  const handleDeleteOutlet = async (outletId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this outlet? This action cannot be undone.",
      )
    ) {
      try {
        setDeletingId(outletId);
        await deleteOutlet(outletId);
        alert("Outlet deleted successfully!");
        refreshOutlets();
      } catch (error) {
        console.error("Error deleting outlet:", error);
        alert("Failed to delete outlet. Please try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getVolumeColor = (volume: string) => {
    switch (volume) {
      case "high":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          dot: "bg-green-500",
        };
      case "medium":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          dot: "bg-orange-500",
        };
      case "low":
        return { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
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
            Outlet Management
          </h2>
          <p className="text-gray-500 mt-1">
            Manage outlets, track deliveries and customer details
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddOutlet(true);
          }}
          className="px-6 py-3 rounded-2xl font-medium text-white transition-all hover:shadow-lg flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
          }}
        >
          <Plus className="w-5 h-5" />
          Add Outlet
        </button>

        {showAddOutlet && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Edit Outlet" : "Add New Outlet"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddOutlet(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Basic Information */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Store className="w-5 h-5 text-orange-600" />
                    Basic Information
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Outlet Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Downtown Store"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sales Volume
                      </label>
                      <select
                        value={formData.salesVolume}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salesVolume: e.target.value as
                              | "high"
                              | "medium"
                              | "low",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {salesVolumes.map((vol) => (
                          <option key={vol} value={vol}>
                            {vol.charAt(0).toUpperCase() + vol.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Next Delivery
                      </label>
                      <input
                        type="date"
                        value={formData.nextDelivery}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nextDelivery: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-orange-600" />
                    Contact Information
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      placeholder="Complete address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
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
                        placeholder="e.g., store@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory & Capacity */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    Inventory & Capacity
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cooler Capacity (units) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.coolerCapacity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            coolerCapacity: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.currentStock}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentStock: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Owed (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.owedAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          owedAmount: parseFloat(e.target.value) || 0,
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
                    setShowAddOutlet(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOutlet}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving
                    ? "Saving..."
                    : editingId
                      ? "Update Outlet"
                      : "Add Outlet"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Outlets",
            value: state.outlets.length,
            color: "#FF8A00",
          },
          {
            label: "High Volume Outlets",
            value: state.outlets.filter((o) => o.salesVolume === "high").length,
            color: "#2ECC71",
          },
          {
            label: "Total Amount Owed",
            value: `₹${state.outlets.reduce((sum, o) => sum + o.owedAmount, 0).toLocaleString()}`,
            color: "#EF4444",
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
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by name, phone or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <select
          value={filterVolume}
          onChange={(e) => setFilterVolume(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Volumes</option>
          {salesVolumes.map((vol) => (
            <option key={vol} value={vol}>
              {vol.charAt(0).toUpperCase() + vol.slice(1)} Volume
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
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Volume
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Amount Owed
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Next Delivery
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOutlets.map((outlet) => {
                const volumeColor = getVolumeColor(outlet.salesVolume);
                return (
                  <tr
                    key={outlet.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {outlet.name}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {outlet.address || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        {outlet.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{outlet.phone}</span>
                          </div>
                        )}
                        {outlet.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{outlet.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${volumeColor.bg} ${volumeColor.text}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${volumeColor.dot}`}
                        />
                        {outlet.salesVolume.charAt(0).toUpperCase() +
                          outlet.salesVolume.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min((outlet.currentStock / outlet.coolerCapacity) * 100, 100)}%`,
                              backgroundColor:
                                outlet.currentStock >
                                outlet.coolerCapacity * 0.5
                                  ? "#2ECC71"
                                  : outlet.currentStock >
                                      outlet.coolerCapacity * 0.2
                                    ? "#FF8A00"
                                    : "#EF4444",
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12">
                          {outlet.currentStock}/{outlet.coolerCapacity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₹{outlet.owedAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {outlet.nextDelivery
                        ? new Date(outlet.nextDelivery).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditOutlet(outlet)}
                          className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-all"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOutlet(outlet.id)}
                          disabled={deletingId === outlet.id}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
          <p className="text-gray-500">No outlets found</p>
        </div>
      )}
    </div>
  );
}
