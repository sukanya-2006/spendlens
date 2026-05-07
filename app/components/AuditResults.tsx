
"use client";

import { useEffect, useState } from "react";
import { AuditResult } from "../lib/auditEngine";
import LeadCapture from "./LeadCapture";

const severityConfig = {
  optimal: {
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    badge: "bg-green-400/20 text-green-400",
    label: "Optimal",
  },
  minor: {
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    badge: "bg-yellow-400/20 text-yellow-400",
    label: "Minor savings",
  },
  moderate: {
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    badge: "bg-orange-400/20 text-orange-400",
    label: "Overspending",
  },
  significant: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    badge: "bg-red-400/20 text-red-400",
    label: "Significant overspend",
  },
};

export default function AuditResults({
  result,
  onReset,
}: {
  result: AuditResult;
  onReset: () => void;
}) {
  const isHighSavings = result.totalMonthlySavings > 500;
  const isOptimal = result.totalMonthlySavings <= 0;
  const [summary, setSummary] = useState<string | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saveAndSummarize = async () => {
      try {
        const saveRes = await fetch("/api/save-audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result }),
        });
        const saveData = await saveRes.json();
        if (saveData.id) setAuditId(saveData.id);

        const summaryRes = await fetch("/api/generate-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result }),
        });
        const summaryData = await summaryRes.json();
        if (summaryData.summary) setSummary(summaryData.summary);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoadingSummary(false);
      }
    };

    saveAndSummarize();
  }, []);

  const handleCopy = () => {
    if (auditId) {
      navigator.clipboard.writeText(
        `${window.location.origin}/audit/${auditId}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Spend<span className="text-orange-400">Lens</span>
          </h1>
          <p className="text-gray-400">Your AI Spend Audit Report</p>
        </div>

        {/* Hero savings card */}
        <div
          className={`rounded-2xl p-8 mb-6 border text-center ${
            isOptimal
              ? "bg-green-400/10 border-green-400/20"
              : "bg-orange-400/10 border-orange-400/20"
          }`}
        >
          {isOptimal ? (
            <>
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                You're spending well
              </h2>
              <p className="text-gray-400">
                Your current AI stack is optimized for your team size and use case.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                Potential savings identified
              </p>
              <div className="text-6xl font-black text-orange-400 mb-1">
                ${result.totalMonthlySavings.toFixed(0)}
                <span className="text-2xl font-normal text-gray-400">/mo</span>
              </div>
              <div className="text-2xl font-bold text-white mb-3">
                ${result.totalAnnualSavings.toFixed(0)}/year
              </div>
              <p className="text-gray-400 text-sm">
                Based on your current spend of ${result.totalMonthlySpend}/month
                across {result.recommendations.length} tool
                {result.recommendations.length > 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>

        {/* AI Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3">
            AI Analysis
          </p>
          {loadingSummary ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-800 rounded mb-2 w-full"></div>
              <div className="h-4 bg-gray-800 rounded mb-2 w-5/6"></div>
              <div className="h-4 bg-gray-800 rounded w-4/6"></div>
            </div>
          ) : summary ? (
            <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
          ) : (
            <p className="text-gray-400 text-sm">
              {isOptimal
                ? "Your AI stack is well optimized for your team size and use case. No immediate action required."
                : `Your team has $${result.totalMonthlySavings}/month in potential savings across ${result.recommendations.length} tools. Review the recommendations below to optimize your spend.`}
            </p>
          )}
        </div>

        {/* Shareable URL */}
        {auditId && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
            <p className="text-gray-400 text-sm truncate">
              Share:{" "}
              <span className="text-orange-400">
                {window.location.origin}/audit/{auditId.slice(0, 8)}...
              </span>
            </p>
            <button
              onClick={handleCopy}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-lg transition-colors whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        )}

        {/* Credex CTA for high savings */}
        {isHighSavings && (
          <div className="bg-gray-900 border border-orange-400/30 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-bold text-white mb-1">
                  You could save even more with Credex
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Credex sells discounted AI credits — the same tools you use today
                  at up to 60% off retail. With $
                  {result.totalMonthlySavings.toFixed(0)}/mo already on the table,
                  a Credex consultation could unlock even more.
                </p>
                <a 
                  href="https://credex.rocks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
                >
                  Book a free Credex consultation
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Per tool breakdown */}
        <div className="space-y-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Per-tool breakdown
          </h2>
          {result.recommendations.map((rec) => {
            const config = severityConfig[rec.severity];
            return (
              <div
                key={rec.toolId}
                className={`rounded-2xl p-6 border ${config.bg} ${config.border}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {rec.toolName}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {rec.currentPlan} plan · ${rec.currentSpend}/mo
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${config.badge}`}
                  >
                    {config.label}
                  </span>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4 mb-3">
                  <p className="text-sm font-semibold text-white mb-1">
                    {rec.recommendedAction}
                  </p>
                  <p className="text-sm text-gray-400">{rec.reason}</p>
                </div>

                {rec.monthlySavings > 0 && (
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Monthly savings</p>
                      <p className={`font-bold ${config.color}`}>
                        ${rec.monthlySavings.toFixed(0)}/mo
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Annual savings</p>
                      <p className={`font-bold ${config.color}`}>
                        ${rec.annualSavings.toFixed(0)}/yr
                      </p>
                    </div>
                    {rec.projectedSpend > 0 && (
                      <div>
                        <p className="text-xs text-gray-500">Optimized spend</p>
                        <p className="font-bold text-white">
                          ${rec.projectedSpend.toFixed(0)}/mo
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Optimal spend message */}
        {isOptimal && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Want to be notified when new optimizations apply to your stack?
            </p>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg text-sm transition-colors">
              Notify me of future savings
            </button>
          </div>
        )}
          <LeadCapture
          auditId={auditId}
          monthlySavings={result.totalMonthlySavings}
        />

        {/* Run another audit */}
        <button
          onClick={onReset}
          className="w-full border border-gray-700 hover:border-orange-400 text-gray-400 hover:text-orange-400 font-semibold py-4 rounded-2xl transition-colors"
        >
        
          Run another audit
        </button>

      </div>
    </div>
  );
}