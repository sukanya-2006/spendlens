// import { NextRequest, NextResponse } from "next/server";
// import Anthropic from "@anthropic-ai/sdk";
// import { AuditResult } from "../../lib/auditEngine";

// const client = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const result: AuditResult = body.result;

//     const toolsSummary = result.recommendations
//       .map((r) => `${r.toolName} (${r.currentPlan}): $${r.currentSpend}/mo, savings: $${r.monthlySavings}/mo — ${r.recommendedAction}`)
//       .join("\n");

//     const prompt = `You are an AI spend analyst. Write a personalized 100-word audit summary for this startup team.

// Team size: ${result.formData.teamSize}
// Use case: ${result.formData.useCase}
// Total monthly spend: $${result.totalMonthlySpend}
// Total monthly savings identified: $${result.totalMonthlySavings}
// Annual savings potential: $${result.totalAnnualSavings}

// Per tool breakdown:
// ${toolsSummary}

// Write a concise, specific, friendly summary. Mention the biggest saving opportunity by name. Be direct and actionable. Do not use bullet points. Write in second person ("Your team..."). Exactly 100 words.`;

//     const message = await client.messages.create({
//       model: "claude-sonnet-4-20250514",
//       max_tokens: 200,
//       messages: [{ role: "user", content: prompt }],
//     });

//     const summary = message.content[0].type === "text" 
//       ? message.content[0].text 
//       : null;

//     return NextResponse.json({ summary });
//   } catch (error) {
//     console.error("Error generating summary:", error);
//     // Graceful fallback
//     return NextResponse.json({
//       summary: null,
//     });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { AuditResult } from "../../lib/auditEngine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result: AuditResult = body.result;

    const { totalMonthlySavings, totalAnnualSavings, totalMonthlySpend, formData, recommendations } = result;

    const biggestSaving = recommendations.reduce((max, r) =>
      r.monthlySavings > max.monthlySavings ? r : max,
      recommendations[0]
    );

    let summary = "";

    if (totalMonthlySavings <= 0) {
      summary = `Your team of ${formData.teamSize} is spending $${totalMonthlySpend}/month on AI tools and doing it well. Every tool in your current stack is appropriately matched to your team size and ${formData.useCase} use case. There are no immediate optimizations needed. We recommend revisiting your stack every quarter as pricing and alternatives evolve rapidly in the AI tools market.`;
    } else if (totalMonthlySavings < 100) {
      summary = `Your team of ${formData.teamSize} is spending $${totalMonthlySpend}/month on AI tools with $${totalMonthlySavings.toFixed(0)}/month in identified savings — $${totalAnnualSavings.toFixed(0)} annually. The biggest opportunity is ${biggestSaving.toolName}: ${biggestSaving.recommendedAction}. These are minor optimizations — your stack is generally well-chosen for your ${formData.useCase} workflows. Making these changes would put your AI spend in the optimal range.`;
    } else if (totalMonthlySavings < 500) {
      summary = `Your team of ${formData.teamSize} has a real overspend problem: $${totalMonthlySavings.toFixed(0)}/month ($${totalAnnualSavings.toFixed(0)}/year) is being wasted on AI tools. The biggest issue is ${biggestSaving.toolName} — ${biggestSaving.reason} Acting on these recommendations would meaningfully reduce your ${formData.useCase} tooling costs without sacrificing capability.`;
    } else {
      summary = `Your team of ${formData.teamSize} is significantly overspending on AI tools — $${totalMonthlySavings.toFixed(0)}/month ($${totalAnnualSavings.toFixed(0)}/year) in identified waste. The most urgent fix is ${biggestSaving.toolName}: ${biggestSaving.recommendedAction}. At this savings level, we strongly recommend a Credex consultation — you may be able to get the same tools at up to 60% off retail price, stacking savings on top of what's already identified here.`;
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json({ summary: null });
  }
}