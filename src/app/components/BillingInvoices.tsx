import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Plus,
  X,
  Loader,
  AlertCircle,
  Trash2,
  CheckCircle2,
  IndianRupee,
  Receipt,
  Wallet,
  Printer,
} from "lucide-react";
import { useDataContext } from "../../lib/dataContext";
import type { Invoice, Outlet } from "../../lib/types";

type DiscountType = "percentage" | "fixed";

interface InvoiceLineForm {
  productId: string;
  product: string;
  cases: string;
  unitsPerCase: string;
  unitPrice: string;
}

const toInputDate = (date: Date) => date.toISOString().split("T")[0];

const toNumber = (value: string) => {
  if (value.trim() === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatINR = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getInvoiceStatus = (
  total: number,
  amountPaid: number,
  dueDate: string,
): Invoice["status"] => {
  if (amountPaid >= total) return "paid";
  if (amountPaid > 0) return "partial";
  if (dueDate && new Date(dueDate) < new Date()) return "overdue";
  return "issued";
};

export function BillingInvoices() {
  const {
    state,
    loading,
    error,
    refreshInvoices,
    refreshOutlets,
    refreshInventory,
    refreshOrders,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
  } = useDataContext();

  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [lineItems, setLineItems] = useState<InvoiceLineForm[]>([
    {
      productId: "",
      product: "",
      cases: "1",
      unitsPerCase: "24",
      unitPrice: "",
    },
  ]);

  const [formData, setFormData] = useState({
    outletId: "",
    issueDate: toInputDate(new Date()),
    dueDate: toInputDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    taxRate: "18",
    discount: "",
    discountType: "percentage" as DiscountType,
    amountPaid: "",
    notes: "",
    terms: "Payment due within 7 days.",
  });

  useEffect(() => {
    refreshInvoices();
    refreshOutlets();
    refreshInventory();
    refreshOrders();
  }, [refreshInvoices, refreshOutlets, refreshInventory, refreshOrders]);

  const inventoryProducts = useMemo(
    () =>
      state.inventory.map((item) => ({
        id: item.id,
        name: item.flavor,
        // ProductManagement currently displays pricing tiers (cost/dealer/outlet/mro)
        // using fixed demo values. Billing uses outlet price directly by default.
        outletUnitPrice: 100,
      })),
    [state.inventory],
  );

  const selectedOutlet: Outlet | undefined = state.outlets.find(
    (outlet) => outlet.id === formData.outletId,
  );

  const subtotal = useMemo(
    () =>
      lineItems.reduce(
        (sum, item) =>
          sum +
          toNumber(item.cases) *
            toNumber(item.unitsPerCase) *
            toNumber(item.unitPrice),
        0,
      ),
    [lineItems],
  );

  const discountAmount =
    formData.discountType === "percentage"
      ? (subtotal * toNumber(formData.discount)) / 100
      : toNumber(formData.discount);
  const taxableAmount = Math.max(subtotal - discountAmount, 0);
  const tax = (taxableAmount * toNumber(formData.taxRate)) / 100;
  const total = taxableAmount + tax;
  const balanceDue = Math.max(total - toNumber(formData.amountPaid), 0);

  const nextInvoiceNumber = useMemo(() => {
    const maxNumber = state.invoices.reduce((max, invoice) => {
      const suffix = Number(invoice.invoiceNumber.split("-")[1] || "0");
      return Number.isFinite(suffix) ? Math.max(max, suffix) : max;
    }, 0);
    return `INV-${String(maxNumber + 1).padStart(4, "0")}`;
  }, [state.invoices]);

  const filteredInvoices = state.invoices.filter((invoice) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(search) ||
      invoice.outletName.toLowerCase().includes(search);
    const matchesStatus =
      statusFilter === "all" ? true : invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totals = useMemo(() => {
    const gross = state.invoices.reduce((sum, inv) => sum + inv.total, 0);
    const received = state.invoices.reduce(
      (sum, inv) => sum + (inv.amountPaid || 0),
      0,
    );
    const outstanding = state.invoices.reduce(
      (sum, inv) => sum + Math.max(inv.balanceDue || 0, 0),
      0,
    );
    const overdueCount = state.invoices.filter(
      (inv) =>
        inv.status === "overdue" ||
        ((inv.balanceDue || 0) > 0 &&
          inv.dueDate &&
          new Date(inv.dueDate) < new Date()),
    ).length;
    return { gross, received, outstanding, overdueCount };
  }, [state.invoices]);

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        productId: "",
        product: "",
        cases: "1",
        unitsPerCase: "24",
        unitPrice: "",
      },
    ]);
  };

  const removeLineItem = (index: number) => {
    setLineItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const resetInvoiceForm = () => {
    setFormData({
      outletId: "",
      issueDate: toInputDate(new Date()),
      dueDate: toInputDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      taxRate: "18",
      discount: "",
      discountType: "percentage",
      amountPaid: "",
      notes: "",
      terms: "Payment due within 7 days.",
    });
    setLineItems([
      {
        productId: "",
        product: "",
        cases: "1",
        unitsPerCase: "24",
        unitPrice: "",
      },
    ]);
  };

  const handleCreateInvoice = async () => {
    if (!selectedOutlet) {
      alert("Please select an outlet.");
      return;
    }
    if (
      lineItems.some(
        (item) => !item.productId || toNumber(item.unitPrice) <= 0,
      )
    ) {
      alert("Please fill all invoice items with valid product and price.");
      return;
    }
    if (total <= 0) {
      alert("Invoice total must be greater than zero.");
      return;
    }

    try {
      setSaving(true);

      const paidNow = toNumber(formData.amountPaid);
      const status = getInvoiceStatus(total, paidNow, formData.dueDate);
      await addInvoice({
        invoiceNumber: nextInvoiceNumber,
        outletId: selectedOutlet.id,
        outletName: selectedOutlet.name,
        outletAddress: selectedOutlet.address,
        outletPhone: selectedOutlet.phone,
        items: lineItems.map((item) => ({
          product: item.product,
          productId: item.productId,
          cases: Math.max(toNumber(item.cases), 1),
          unitsPerCase: Math.max(toNumber(item.unitsPerCase), 1),
          unitPrice: Math.max(toNumber(item.unitPrice), 0),
          totalPrice:
            Math.max(toNumber(item.cases), 1) *
            Math.max(toNumber(item.unitsPerCase), 1) *
            Math.max(toNumber(item.unitPrice), 0),
        })),
        subtotal,
        tax,
        taxRate: toNumber(formData.taxRate),
        discount: toNumber(formData.discount),
        discountType: formData.discountType,
        total,
        amountPaid: paidNow,
        balanceDue,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        status,
        notes: formData.notes,
        terms: formData.terms,
      });

      alert("Invoice created successfully!");
      setShowCreateInvoice(false);
      resetInvoiceForm();
      refreshInvoices();
    } catch (saveError) {
      console.error("Error creating invoice:", saveError);
      alert("Failed to create invoice. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (
    invoice: Invoice,
    status: Invoice["status"],
  ) => {
    try {
      await updateInvoiceStatus(invoice.id, status);
      if (status === "paid") {
        await updateInvoice(invoice.id, {
          amountPaid: invoice.total,
          balanceDue: 0,
        });
      }
      refreshInvoices();
    } catch (statusError) {
      console.error("Error updating status:", statusError);
      alert("Failed to update invoice status.");
    }
  };

  const handleRecordPayment = async (invoice: Invoice) => {
    const paymentText = window.prompt(
      `Enter payment amount for ${invoice.invoiceNumber}`,
      String(invoice.amountPaid || 0),
    );
    if (paymentText === null) return;
    const parsed = Number(paymentText);
    if (!Number.isFinite(parsed) || parsed < 0) {
      alert("Please enter a valid payment amount.");
      return;
    }
    const safePaid = Math.min(parsed, invoice.total);
    const newBalance = Math.max(invoice.total - safePaid, 0);
    const newStatus = getInvoiceStatus(invoice.total, safePaid, invoice.dueDate || "");

    try {
      await updateInvoice(invoice.id, {
        amountPaid: safePaid,
        balanceDue: newBalance,
        status: newStatus,
      });
      refreshInvoices();
    } catch (paymentError) {
      console.error("Error recording payment:", paymentError);
      alert("Failed to record payment.");
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!window.confirm("Delete this invoice? This action cannot be undone.")) {
      return;
    }
    try {
      setDeletingId(id);
      await deleteInvoice(id);
      refreshInvoices();
    } catch (deleteError) {
      console.error("Error deleting invoice:", deleteError);
      alert("Failed to delete invoice.");
    } finally {
      setDeletingId(null);
    }
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const doc = window.open("", "_blank", "noopener,noreferrer");
    if (!doc) {
      alert("Popup blocked. Please allow popups to print invoices.");
      return;
    }

    const issueDate = new Date(invoice.issueDate).toLocaleDateString("en-IN");
    const dueDate = invoice.dueDate
      ? new Date(invoice.dueDate).toLocaleDateString("en-IN")
      : "N/A";

    const itemsHtml = invoice.items
      .map((item, idx) => {
        return `
          <tr>
            <td class="num">${idx + 1}</td>
            <td>
              <div class="prod">
                <div class="name">${item.product}</div>
              </div>
            </td>
            <td class="right">${item.cases}</td>
            <td class="right">${item.unitsPerCase}</td>
            <td class="right">${formatINR(item.unitPrice)}</td>
            <td class="right">${formatINR(item.totalPrice)}</td>
          </tr>
        `;
      })
      .join("");

    const paid = invoice.amountPaid || 0;
    const bal = invoice.balanceDue || 0;

    doc.document.open();
    doc.document.write(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${invoice.invoiceNumber} - Invoice</title>
    <style>
      :root {
        --ink: #0f172a;
        --muted: #64748b;
        --border: #e2e8f0;
        --bg: #ffffff;
        --accent: #ff8a00;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #f8fafc;
        color: var(--ink);
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Helvetica Neue", sans-serif;
      }
      .page {
        width: 210mm;
        min-height: 297mm;
        margin: 12mm auto;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 14mm;
      }
      .top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        border-bottom: 1px solid var(--border);
        padding-bottom: 12px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .logo {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        background: linear-gradient(135deg, #ff8a00 0%, #ffb347 100%);
      }
      .brand h1 {
        font-size: 18px;
        margin: 0;
        letter-spacing: 0.2px;
      }
      .brand p {
        margin: 2px 0 0 0;
        color: var(--muted);
        font-size: 12px;
      }
      .meta {
        text-align: right;
      }
      .meta .title {
        font-size: 12px;
        color: var(--muted);
        letter-spacing: 0.2px;
        margin-bottom: 4px;
      }
      .meta .inv {
        font-size: 22px;
        font-weight: 800;
        margin: 0;
      }
      .chips {
        margin-top: 8px;
        display: inline-flex;
        gap: 6px;
        justify-content: flex-end;
        flex-wrap: wrap;
      }
      .chip {
        font-size: 11px;
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid var(--border);
        color: var(--muted);
        background: #f8fafc;
      }
      .grid2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 14px;
      }
      .box {
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 12px;
      }
      .box h3 {
        font-size: 12px;
        margin: 0 0 8px 0;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.6px;
      }
      .row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        font-size: 12px;
        margin: 6px 0;
      }
      .row .k { color: var(--muted); }
      .row .v { font-weight: 600; }
      table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin-top: 14px;
        border: 1px solid var(--border);
        border-radius: 12px;
        overflow: hidden;
      }
      thead th {
        background: #f8fafc;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--muted);
        padding: 10px;
        border-bottom: 1px solid var(--border);
      }
      tbody td {
        padding: 10px;
        font-size: 12px;
        border-bottom: 1px solid var(--border);
        vertical-align: top;
      }
      tbody tr:last-child td { border-bottom: none; }
      .right { text-align: right; }
      .num { width: 36px; color: var(--muted); }
      .prod .name { font-weight: 700; }
      .totals {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 12px;
        margin-top: 14px;
      }
      .summary .row { margin: 8px 0; }
      .summary .grand {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed var(--border);
        font-size: 13px;
      }
      .summary .grand .v { font-size: 16px; }
      .footer {
        margin-top: 16px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .note {
        color: var(--muted);
        font-size: 12px;
        line-height: 1.5;
        white-space: pre-wrap;
      }
      .stamp {
        border: 1px dashed var(--border);
        border-radius: 12px;
        padding: 12px;
        text-align: center;
        color: var(--muted);
        font-size: 12px;
      }
      @media print {
        body { background: #fff; }
        .page { margin: 0; border: none; border-radius: 0; padding: 12mm; }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="top">
        <div class="brand">
          <div class="logo"></div>
          <div>
            <h1>herito</h1>
            <p>Fresh Efficiency</p>
          </div>
        </div>
        <div class="meta">
          <div class="title">Tax Invoice</div>
          <p class="inv">${invoice.invoiceNumber}</p>
          <div class="chips">
            <span class="chip">Issue: ${issueDate}</span>
            <span class="chip">Due: ${dueDate}</span>
            <span class="chip">Status: ${invoice.status.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div class="grid2">
        <div class="box">
          <h3>Bill To</h3>
          <div class="row"><span class="k">Outlet</span><span class="v">${invoice.outletName}</span></div>
          <div class="row"><span class="k">Phone</span><span class="v">${invoice.outletPhone || "—"}</span></div>
          <div class="row"><span class="k">Address</span><span class="v">${invoice.outletAddress || "—"}</span></div>
        </div>
        <div class="box">
          <h3>Invoice Details</h3>
          <div class="row"><span class="k">Subtotal</span><span class="v">${formatINR(invoice.subtotal)}</span></div>
          <div class="row"><span class="k">Discount</span><span class="v">${formatINR(invoice.discount || 0)}</span></div>
          <div class="row"><span class="k">Tax (${invoice.taxRate}%)</span><span class="v">${formatINR(invoice.tax)}</span></div>
          <div class="row"><span class="k">Paid</span><span class="v">${formatINR(paid)}</span></div>
          <div class="row"><span class="k">Balance</span><span class="v">${formatINR(bal)}</span></div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th class="num">#</th>
            <th>Product</th>
            <th class="right">Cases</th>
            <th class="right">Units/Case</th>
            <th class="right">Unit Price</th>
            <th class="right">Line Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="totals">
        <div class="box note">
          <h3>Notes</h3>
          ${invoice.notes ? invoice.notes : "—"}
        </div>
        <div class="box summary">
          <h3>Amount Summary</h3>
          <div class="row"><span class="k">Subtotal</span><span class="v">${formatINR(invoice.subtotal)}</span></div>
          <div class="row"><span class="k">Discount</span><span class="v">${formatINR(invoice.discount || 0)}</span></div>
          <div class="row"><span class="k">Tax</span><span class="v">${formatINR(invoice.tax)}</span></div>
          <div class="row grand"><span class="k">Grand Total</span><span class="v">${formatINR(invoice.total)}</span></div>
        </div>
      </div>

      <div class="footer">
        <div class="box note">
          <h3>Terms</h3>
          ${invoice.terms ? invoice.terms : "—"}
        </div>
        <div class="stamp">
          Authorized Signature<br/><br/><br/>
          ______________________
        </div>
      </div>
    </div>
    <script>
      window.focus();
      setTimeout(() => window.print(), 250);
    </script>
  </body>
</html>
    `);
    doc.document.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading billing module...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-900 mb-2">Error Loading Billing</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={refreshInvoices}
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
          <h2 className="text-3xl font-bold text-gray-900">Billing & Invoices</h2>
          <p className="text-gray-500 mt-1">
            Professional distributor invoicing with payment tracking
          </p>
        </div>
        <button
          onClick={() => setShowCreateInvoice(true)}
          className="px-6 py-3 rounded-2xl font-medium text-white transition-all hover:shadow-lg flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
          }}
        >
          <Plus className="w-5 h-5" />
          Create Invoice
        </button>
      </div>

      {showCreateInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="w-6 h-6 text-orange-600" />
                New Invoice ({nextInvoiceNumber})
              </h3>
              <button
                onClick={() => {
                  setShowCreateInvoice(false);
                  resetInvoiceForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outlet *
                </label>
                <select
                  value={formData.outletId}
                  onChange={(e) =>
                    setFormData({ ...formData, outletId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select outlet</option>
                  {state.outlets.map((outlet) => (
                    <option key={outlet.id} value={outlet.id}>
                      {outlet.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, issueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.taxRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      taxRate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as DiscountType,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">Fixed ₹</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Invoice Items</h4>
                <button
                  onClick={addLineItem}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  + Add Item
                </button>
              </div>

              {lineItems.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Product
                      </label>
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const selected = inventoryProducts.find(
                            (prod) => prod.id === e.target.value,
                          );
                          setLineItems((prev) =>
                            prev.map((line, lineIndex) =>
                              lineIndex === index
                                ? {
                                    ...line,
                                    productId: selected?.id || "",
                                    product: selected?.name || "",
                                    unitPrice: String(
                                      selected?.outletUnitPrice ?? "",
                                    ),
                                  }
                                : line,
                            ),
                          );
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select Product</option>
                        {inventoryProducts.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Cases
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.cases}
                        onChange={(e) =>
                          setLineItems((prev) =>
                            prev.map((line, lineIndex) =>
                              lineIndex === index
                                ? {
                                    ...line,
                                    cases: e.target.value,
                                  }
                                : line,
                            ),
                          )
                        }
                        placeholder="e.g., 1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Units / Case
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.unitsPerCase}
                        onChange={(e) =>
                          setLineItems((prev) =>
                            prev.map((line, lineIndex) =>
                              lineIndex === index
                                ? {
                                    ...line,
                                    unitsPerCase: e.target.value,
                                  }
                                : line,
                            ),
                          )
                        }
                        placeholder="e.g., 24"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Unit Price (₹)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          readOnly
                          placeholder="Auto"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        {lineItems.length > 1 && (
                          <button
                            onClick={() => removeLineItem(index)}
                            className="px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                            title="Remove line"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Auto-filled from product outlet price.
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Line Total: ₹
                    {(
                      toNumber(item.cases) *
                      toNumber(item.unitsPerCase) *
                      toNumber(item.unitPrice)
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms
                </label>
                <textarea
                  rows={3}
                  value={formData.terms}
                  onChange={(e) =>
                    setFormData({ ...formData, terms: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Subtotal</p>
                  <p className="font-semibold">₹{subtotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Discount</p>
                  <p className="font-semibold">₹{discountAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tax</p>
                  <p className="font-semibold">₹{tax.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-semibold text-orange-700">
                    ₹{total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Balance</p>
                  <p className="font-semibold text-red-600">
                    ₹{balanceDue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 p-4 bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Paid
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amountPaid}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amountPaid: e.target.value,
                    })
                  }
                  placeholder="Enter payment received (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Keep empty if payment is pending.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4 bg-white">
                <p className="text-sm text-gray-600 mb-2">Payment Summary</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total</span>
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-500">Paid</span>
                  <span className="font-semibold">
                    ₹{toNumber(formData.amountPaid).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-500">Balance Due</span>
                  <span className="font-semibold text-red-600">
                    ₹{balanceDue.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateInvoice(false);
                  resetInvoiceForm();
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvoice}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Create Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Billed",
            value: `₹${totals.gross.toLocaleString()}`,
            icon: Receipt,
            color: "#FF8A00",
          },
          {
            label: "Amount Received",
            value: `₹${totals.received.toLocaleString()}`,
            icon: Wallet,
            color: "#2ECC71",
          },
          {
            label: "Outstanding",
            value: `₹${totals.outstanding.toLocaleString()}`,
            icon: IndianRupee,
            color: "#EF4444",
          },
          {
            label: "Overdue Invoices",
            value: totals.overdueCount,
            icon: AlertCircle,
            color: "#B91C1C",
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
          placeholder="Search invoice number or outlet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="issued">Issued</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div
        className="rounded-3xl overflow-hidden border border-gray-200"
        style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Invoice
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Outlet
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Issue / Due
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
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {invoice.items.length} line items
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <p className="font-medium">{invoice.outletName}</p>
                    <p className="text-xs text-gray-500">
                      {invoice.outletPhone || "No phone"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <p>{new Date(invoice.issueDate).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">
                      Due {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <p className="font-semibold">₹{invoice.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      Paid ₹{(invoice.amountPaid || 0).toFixed(2)} | Bal ₹
                      {(invoice.balanceDue || 0).toFixed(2)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={invoice.status}
                      onChange={(e) =>
                        handleStatusUpdate(
                          invoice,
                          e.target.value as Invoice["status"],
                        )
                      }
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="issued">Issued</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrintInvoice(invoice)}
                        className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                        title="Print / Save as PDF"
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRecordPayment(invoice)}
                        className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-all"
                        title="Record Payment"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        disabled={deletingId === invoice.id}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-5 h-5" />
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
    </div>
  );
}
