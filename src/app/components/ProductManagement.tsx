import { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  X,
  DollarSign,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { Product } from "../../lib/types";

export function ProductManagement() {
  const { state, loading, error, refreshInventory } = useDataContext();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    flavor: "",
    sku: "",
    category: "beverage",
    costPrice: 0,
    dealerPrice: 0,
    outletPrice: 0,
    mroPrice: 0,
    customPrice: 0,
    stock: 0,
    capacity: 0,
    color: "#FF8A00",
    icon: "🥤",
    description: "",
  });

  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  const categories = ["beverage", "snacks", "equipment", "supplies"];

  const products: Product[] = state.inventory.map((item) => ({
    id: item.id,
    name: item.flavor,
    flavor: item.flavor,
    sku: `SKU-${item.id.slice(0, 6)}`,
    category: "beverage",
    costPrice: 50,
    dealerPrice: 75,
    outletPrice: 100,
    mroPrice: 85,
    customPrice: 0,
    stock: item.stock,
    capacity: item.capacity,
    color: item.color,
    icon: item.icon || "🥤",
    description: "",
  }));

  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === "all" || product.category === filterCategory),
  );

  const resetForm = () => {
    setFormData({
      name: "",
      flavor: "",
      sku: "",
      category: "beverage",
      costPrice: 0,
      dealerPrice: 0,
      outletPrice: 0,
      mroPrice: 0,
      customPrice: 0,
      stock: 0,
      capacity: 0,
      color: "#FF8A00",
      icon: "🥤",
      description: "",
    });
    setEditingId(null);
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.sku) {
      alert("Please fill in product name and SKU");
      return;
    }
    if (formData.dealerPrice <= formData.costPrice) {
      alert("Dealer price must be greater than cost price");
      return;
    }
    if (formData.outletPrice <= formData.dealerPrice) {
      alert("Outlet price must be greater than dealer price");
      return;
    }
    alert("Product added successfully!");
    setShowAddProduct(false);
    resetForm();
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      flavor: product.flavor || "",
      sku: product.sku,
      category: product.category,
      costPrice: product.costPrice,
      dealerPrice: product.dealerPrice,
      outletPrice: product.outletPrice,
      mroPrice: product.mroPrice || 0,
      customPrice: product.customPrice || 0,
      stock: product.stock,
      capacity: product.capacity,
      color: product.color,
      icon: product.icon,
      description: product.description || "",
    });
    setEditingId(product.id);
    setShowAddProduct(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-900 mb-2">Error Loading Products</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={refreshInventory}
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
            Product Management
          </h2>
          <p className="text-gray-500 mt-1">
            Manage products with cost, dealer, outlet & MRO pricing
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddProduct(true);
          }}
          className="px-6 py-3 rounded-2xl font-medium text-white transition-all hover:shadow-lg flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
          }}
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>

        {showAddProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddProduct(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Orange Mango Punch"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., OMP-001"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 🥤"
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      maxLength="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Product description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Pricing Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    Pricing Tiers
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cost Price (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.costPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            costPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Your cost</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dealer Price (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.dealerPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dealerPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Wholesale</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Outlet Price (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.outletPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            outletPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Retail</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        MRO Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.mroPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mroPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maintenance/Repair
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.customPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="For special agreements"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Stock Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    Inventory
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stock: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacity
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.capacity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            capacity: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowAddProduct(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium"
                >
                  {editingId ? "Update Product" : "Add Product"}
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
            label: "Total Products",
            value: products.length,
            color: "#FF8A00",
          },
          {
            label: "Total Stock Value",
            value: `₹${products.reduce((sum, p) => sum + p.stock * p.outletPrice, 0).toLocaleString()}`,
            color: "#2ECC71",
          },
          {
            label: "Low Stock Items",
            value: products.filter((p) => p.stock < p.capacity * 0.2).length,
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
          placeholder="Search by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div
        className="rounded-3xl overflow-hidden border border-gray-200"
        style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Cost Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Dealer Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Outlet Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  MRO Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: product.color + "20" }}
                      >
                        {product.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ₹{product.costPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ₹{product.dealerPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ₹{product.outletPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ₹{product.mroPrice?.toFixed(2) || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((product.stock / product.capacity) * 100, 100)}%`,
                            backgroundColor:
                              product.stock > product.capacity * 0.5
                                ? "#2ECC71"
                                : product.stock > product.capacity * 0.2
                                  ? "#FF8A00"
                                  : "#EF4444",
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12">
                        {product.stock}/{product.capacity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div
          className="rounded-3xl p-12 bg-white text-center"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
        >
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
}
