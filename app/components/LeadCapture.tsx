"use client";

import { useState } from "react";

export default function LeadCapture({
  auditId,
  monthlySavings,
}: {
  auditId: string | null;
  monthlySavings: number;
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company_name: company,
          role,
          audit_id: auditId,
        }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving lead:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-gray-900 border border-green-400/20 rounded-2xl p-6 mb-6 text-center">
        <div className="text-3xl mb-2">✅</div>
        <p className="text-green-400 font-semibold mb-1">Report saved!</p>
        <p className="text-gray-400 text-sm">
          We'll notify you when new optimizations apply to your stack.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
      <h3 className="font-bold text-white mb-1">
        {monthlySavings > 0
          ? "Save your report & get notified of better deals"
          : "Get notified when optimizations apply to your stack"}
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        No spam. One email with your full report.
      </p>
      <div className="space-y-3">
        <input
          type="email"
          placeholder="your@email.com *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-400"
        />
        <input
          type="text"
          placeholder="Company name (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-400"
        />
        <input
          type="text"
          placeholder="Your role (optional)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-400"
        />
        <button
          onClick={handleSubmit}
          disabled={!email || loading}
          className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
        >
          {loading ? "Saving..." : "Save my report"}
        </button>
      </div>
    </div>
  );
}