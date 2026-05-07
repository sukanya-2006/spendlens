import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import { AuditResult } from "../../lib/auditEngine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result: AuditResult = body.result;

    const { data, error } = await supabase
      .from("audits")
      .insert({
        tools: result.formData.tools,
        team_size: result.formData.teamSize,
        use_case: result.formData.useCase,
        total_monthly_spend: result.totalMonthlySpend,
        total_monthly_savings: result.totalMonthlySavings,
        total_annual_savings: result.totalAnnualSavings,
        recommendations: result.recommendations,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Error saving audit:", error);
    return NextResponse.json(
      { error: "Failed to save audit" },
      { status: 500 }
    );
  }
}