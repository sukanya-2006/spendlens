import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { AuditResult } from "../../lib/auditEngine";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result: AuditResult = body.result;

    const toolsSummary = result.recommendations
      .map((r) => `${r.toolName} (${r.currentPlan}): $${r.currentSpend}/mo, savings: $${r.monthlySavings}/mo — ${r.recommendedAction}`)
      .join("\n");

    const prompt = `You are an AI spend analyst. Write a personalized 100-word audit summary for this startup team.

Team size: ${result.formData.teamSize}
Use case: ${result.formData.useCase}
Total monthly spend: $${result.totalMonthlySpend}
Total monthly savings identified: $${result.totalMonthlySavings}
Annual savings potential: $${result.totalAnnualSavings}

Per tool breakdown:
${toolsSummary}

Write a concise, specific, friendly summary. Mention the biggest saving opportunity by name. Be direct and actionable. Do not use bullet points. Write in second person ("Your team..."). Exactly 100 words.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const summary = message.content[0].type === "text" 
      ? message.content[0].text 
      : null;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    // Graceful fallback
    return NextResponse.json({
      summary: null,
    });
  }
}