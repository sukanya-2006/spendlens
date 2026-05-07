import { supabase } from "../../lib/supabase";
import { notFound } from "next/navigation";

// export default async function AuditPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const { data, error } = await supabase
//     .from("audits")
//     .select("*")
//     .eq("id", params.id)
//     .single();

export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return notFound();

  const recommendations = data.recommendations as any[];
  const isOptimal = Number(data.total_monthly_savings) <= 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Spend<span className="text-orange-400">Lens</span>
          </h1>
          <p className="text-gray-400">Shared AI Spend Audit</p>
        </div>

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
                Spending well
              </h2>
              <p className="text-gray-400">
                This team AI stack is optimized.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                Potential savings identified
              </p>
              <div className="text-6xl font-black text-orange-400 mb-1">
                ${Number(data.total_monthly_savings).toFixed(0)}
                <span className="text-2xl font-normal text-gray-400">/mo</span>
              </div>
              <div className="text-2xl font-bold text-white mb-3">
                ${Number(data.total_annual_savings).toFixed(0)}/year
              </div>
              <p className="text-gray-400 text-sm">
                Team of {data.team_size} · {data.use_case} use case
              </p>
            </>
          )}
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Per-tool breakdown
          </h2>
          {recommendations.map((rec: any, index: number) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">{rec.toolName}</h3>
                <span className="text-xs text-gray-400">
                  {rec.currentPlan} · ${rec.currentSpend}/mo
                </span>
              </div>
              <p className="text-sm text-gray-400">{rec.reason}</p>
              {rec.monthlySavings > 0 && (
                <p className="text-orange-400 font-bold text-sm mt-2">
                  Save ${rec.monthlySavings}/mo
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">
            Want to audit your own AI spend?
          </p>
          <a
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Run your free audit
          </a>
        </div>

      </div>
    </div>
  );
}