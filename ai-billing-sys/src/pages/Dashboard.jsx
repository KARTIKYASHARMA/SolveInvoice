import React, { useState } from "react";
import { useInvoices } from "../context/InvoiceContext";
import { Search, Filter, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchInvoicePdf } from "../api/invoice";

export default function Dashboard() {
  const { invoices, loading, error } = useInvoices();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // -------------------------
  // LOADING / ERROR STATES
  // -------------------------
  if (loading) {
    return <div className="p-6 text-slate-600">Loading invoices...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  // -------------------------
  // SAFE FILTERING
  // -------------------------
  const filteredInvoices = (invoices || []).filter((inv) => {
    const clientName = inv.customerName?.toLowerCase() || "";
    const invoiceId = String(inv.id || "");

    const matchesSearch =
      clientName.includes(searchTerm.toLowerCase()) ||
      invoiceId.includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" ||
      inv.status?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-700";
      case "UNPAID":
        return "bg-red-100 text-red-700";
      case "OVERDUE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Overview of your billing activities.</p>
        </div>
        <Link
          to="/create-invoice"
          className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          + New Invoice
        </Link>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            className="pl-9 w-full h-9 rounded-lg border text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <select
            className="pl-9 pr-8 h-9 rounded-lg border text-sm bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left">Invoice ID</th>
                <th className="px-6 py-4 text-left">Client</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{inv.id}</td>
                  <td className="px-6 py-4">{inv.customerName || "-"}</td>
                  <td className="px-6 py-4">
                    {inv.createdAt
                      ? new Date(inv.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ₹{Number(inv.totalAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        inv.status
                      )}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-slate-400">
                      

                      <button
                        className="hover:text-primary-600"
                        onClick={async () => {
                          try {
                            const pdfUrl = await fetchInvoicePdf(inv.id);
                            if (!pdfUrl) {
                              alert("PDF not available yet");
                              return;
                            }
                            window.open(pdfUrl, "_blank", "noopener,noreferrer");
                          } catch (err) {
                            console.error("PDF download failed", err);
                            alert("Failed to download PDF");
                          }
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
