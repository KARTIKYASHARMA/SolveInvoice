import React from "react";
import InvoiceRiskAnalytics from "../components/ui/InvoiceRiskAnalytics";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Analytics</h1>
        <p className="text-slate-500">
          Insights and risk assessments for your billing operations.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 🔥 Pass invoiceId dynamically later */}
        <InvoiceRiskAnalytics invoiceId={101} />

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center min-h-[300px] text-slate-400">
          <p>More insights coming soon...</p>
        </div>
      </div>
    </div>
  );
}
