import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Download,
  Plus,
  X,
  Filter,
  Loader,
  AlertCircle,
  Eye,
  Printer,
} from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { Invoice, Order } from "../../lib/types";

export function Billing() {
  const { state, loading, error, refreshOrders } = useDataContext();
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const [invoiceForm, setInvoiceForm] = useState({
    orderId: "",
    discount: 0,
    notes: "",
  });

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  // Mock invoices from orders
  const invoices: Invoice[] = state.orders.map((order, index) => ({
    id: `INV-${Date.now()}-${index}`,
    invoiceNumber: `INV-${String(index + 1001).slice(-4)}`,
    outletId: order.outletId,
    outletName: order.outletName,
    orderId: order.id,
    items: order.items,
    subtotal: order.total,
    tax: Math.round(order.total * 0.18),
    discount: 0,
    total: order.total + Math.round(order.total * 0.18),
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: order.status === "delivered" ? "issued" : ("draft" as const),
    notes: "",
  }));

  const filteredInvoices = invoices.filter(
    (invoice) =>
      (filterStatus === "all" || invoice.status === filterStatus) &&
      (invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.outletName.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleCreateInvoice = () => {
    if (!invoiceForm.orderId) {
      alert("Please select an order");
      return;
    }
    alert("Invoice created successfully!");
    setShowAddInvoice(false);
    setInvoiceForm({ orderId: "", discount: 0, notes: "" });
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const outlet = state.outlets.find((o) => o.id === invoice.outletId);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: #333;
            }
            .invoice {
              max-width: 900px;
              margin: 0 auto;
              padding: 40px;
              background: white;
              border: 1px solid #ddd;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #FF8A00;
              padding-bottom: 20px;
            }
            .company-name {
              font-size: 28px;
              font-weight: bold;
              color: #FF8A00;
            }
            .invoice-title {
              font-size: 24px;
              font-weight: bold;
              color: #333;
            }
            .invoice-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            .details-column {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }
            .label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              font-weight: bold;
            }
            .value {
              font-size: 14px;
              color: #333;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            th {
              background: #f0f0f0;
              padding: 12px;
              text-align: left;
              font-weight: bold;
              border-bottom: 2px solid #FF8A00;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #eee;
            }
            .amount {
              text-align: right;
            }
            .totals {
              width: 100%;
              display: flex;
              justify-content: flex-end;
              margin-top: 30px;
            }
            .totals-table {
              width: 300px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .grand-total {
              display: flex;
              justify-content: space-between;
              padding: 15px 0;
              font-size: 18px;
              font-weight: bold;
              color: #FF8A00;
              border-top: 2px solid #FF8A00;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .invoice {
                border: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <div class="company-name">Design Juice Distribution</div>
              <div class="invoice-title">INVOICE</div>
            </div>

            <div class="invoice-details">
              <div class="details-column">
                <div>
                  <div class="label">Bill To</div>
                  <div class="value">
                    <strong>${invoice.outletName}</strong><br/>
                    ${outlet?.address || "N/A"}<br/>
                    ${outlet?.phone || "N/A"}
                  </div>
                </div>
              </div>
              <div class="details-column">
                <div>
                  <div class="label">Invoice Number</div>
                  <div class="value">${invoice.invoiceNumber}</div>
                </div>
                <div>
                  <div class="label">Invoice Date</div>
                  <div class="value">${new Date(invoice.issueDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div class="label">Due Date</div>
                  <div class="value">${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}</div>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="amount">Quantity</th>
                  <th class="amount">Unit Price</th>
                  <th class="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.product}</td>
                    <td class="amount">${item.quantity}</td>
                    <td class="amount">₹${item.unitPrice.toFixed(2)}</td>
                    <td class="amount">₹${item.totalPrice.toFixed(2)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-table">
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>₹${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                  <span>Tax (18%)</span>
                  <span>₹${invoice.tax.toFixed(2)}</span>
                </div>
                ${
                  invoice.discount
                    ? `
                  <div class="total-row">
                    <span>Discount</span>
                    <span>-₹${invoice.discount.toFixed(2)}</span>
                  </div>
                `
                    : ""
                }
                <div class="grand-total">
                  <span>Total Amount Due</span>
                  <span>₹${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            ${
              invoice.notes
                ? `
              <div style="margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
                <strong>Notes:</strong><br/>
                ${invoice.notes}
              </div>
            `
                : ""
            }

            <div class="footer">
              <p>Thank you for your business!</p>
              <p>This is an electronically generated invoice and is valid without signature.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    alert("PDF download feature will be implemented with a PDF library");
    // This would require adding a PDF library like jsPDF or react-pdf
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-900 mb-2">Error Loading Invoices</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={refreshOrders}
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
            Billing & Invoicing
          </h2>
          <p className="text-gray-500 mt-1">
            Generate, manage, and track invoices
          </p>
        </div>
        <button
          onClick={() => setShowAddInvoice(true)}
          className="px-6 py-3 rounded-2xl font-medium text-white transition-all hover:shadow-lg flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
          }}
        >
          <Plus className="w-5 h-5" />
          Create Invoice
        </button>

        {showAddInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Create Invoice
                </h3>
                <button
                  onClick={() => setShowAddInvoice(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Order *
                  </label>
                  <select
                    value={invoiceForm.orderId}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        orderId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select an order</option>
                    {state.orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.outletName} - {order.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={invoiceForm.discount}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        discount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    placeholder="Invoice notes..."
                    value={invoiceForm.notes}
                    onChange={(e) =>
                      setInvoiceForm({ ...invoiceForm, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddInvoice(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateInvoice}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
                >
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Invoices",
            value: invoices.length,
            color: "#FF8A00",
          },
          {
            label: "Issued",
            value: invoices.filter((i) => i.status === "issued").length,
            color: "#3B82F6",
          },
          {
            label: "Pending Payment",
            value: invoices.filter(
              (i) => i.status === "issued" || i.status === "overdue",
            ).length,
            color: "#FFA500",
          },
          {
            label: "Total Amount",
            value: `₹${invoices.reduce((sum, i) => sum + i.total, 0).toLocaleString()}`,
            color: "#2ECC71",
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
          placeholder="Search by invoice # or outlet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="issued">Issued</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div
        className="rounded-3xl overflow-hidden border border-gray-200"
        style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Invoice #
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Outlet
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {invoice.outletName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    ₹{invoice.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor:
                          invoice.status === "paid"
                            ? "#d4edda"
                            : invoice.status === "issued"
                              ? "#cfe2ff"
                              : invoice.status === "overdue"
                                ? "#f8d7da"
                                : "#e7e7e7",
                        color:
                          invoice.status === "paid"
                            ? "#155724"
                            : invoice.status === "issued"
                              ? "#004085"
                              : invoice.status === "overdue"
                                ? "#721c24"
                                : "#666",
                      }}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrintInvoice(invoice)}
                        className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-all"
                        title="Print Invoice"
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(invoice)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
                        title="Download PDF"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInvoices.length === 0 && (
        <div
          className="rounded-3xl p-12 bg-white text-center"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
        >
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No invoices found</p>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Invoice {selectedInvoice.invoiceNumber}
              </h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div ref={printRef} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bill To</p>
                  <p className="font-semibold text-gray-900">
                    {selectedInvoice.outletName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Invoice Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedInvoice.issueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-600">
                        Description
                      </th>
                      <th className="text-right py-2 text-gray-600">Qty</th>
                      <th className="text-right py-2 text-gray-600">
                        Unit Price
                      </th>
                      <th className="text-right py-2 text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2">{item.product}</td>
                        <td className="text-right">{item.quantity}</td>
                        <td className="text-right">
                          ₹{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="text-right font-semibold">
                          ₹{item.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Subtotal:</span>
                    <span>₹{selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Tax (18%):</span>
                    <span>₹{selectedInvoice.tax.toFixed(2)}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Discount:</span>
                      <span>-₹{selectedInvoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 font-bold text-lg text-orange-600">
                    <span>Total:</span>
                    <span>₹{selectedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Notes</p>
                  <p className="text-gray-900">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (printRef.current) {
                    handlePrintInvoice(selectedInvoice);
                  }
                }}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Print / PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
