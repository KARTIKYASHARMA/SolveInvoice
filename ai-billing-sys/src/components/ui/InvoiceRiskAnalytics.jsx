import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AlertCircle, CheckCircle, BrainCircuit } from "lucide-react";
import { fetchInvoiceAiAnalytics } from "../../api/aiAnalytics";
import { useAuth } from "../../context/AuthContext";

const InvoiceRiskAnalytics = ({ invoiceId }) => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoiceId) return;

    fetchInvoiceAiAnalytics(invoiceId, token)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [invoiceId, token]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border text-slate-400">
        Loading AI analytics...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white p-6 rounded-xl border text-red-500">
        Failed to load AI analytics
      </div>
    );
  }

  const chartData = [
    { name: "Overdue", value: data.overdueProbability * 100 },
    { name: "On Time", value: 100 - data.overdueProbability * 100 }
  ];

  const COLORS = ["#ef4444", "#e2e8f0"];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-center gap-2">
        <BrainCircuit className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-lg text-slate-800">
          AI Invoice Risk Analysis
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Risk Assessment
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                data.riskAnalysis.status === "RISKY"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {data.riskAnalysis.status}
            </span>
          </div>

          <p className="text-sm text-slate-600 border-l-4 border-red-200 pl-3">
            {data.riskAnalysis.reason}
          </p>

          <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase text-primary-800">
                AI Recommendation
              </p>
              <p className="text-sm text-primary-700">
                {data.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Donut Chart */}
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={40}
                  outerRadius={60}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-bold text-slate-800">
                {Math.round(data.overdueProbability * 100)}%
              </span>
              <span className="text-[10px] text-slate-500 uppercase">
                Overdue
              </span>
            </div>
          </div>

          {/* NLP Anomalies */}
          {data.nlpAnomaly.anomalyDetected && (
            <div className="w-full">
              <p className="text-xs font-medium text-slate-500 mb-2 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1 text-orange-500" />
                Anomalies Detected
              </p>
              <div className="flex flex-wrap gap-2">
                {data.nlpAnomaly.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded border border-orange-100"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceRiskAnalytics;
