import { FormData, UserToolEntry } from "../types";

export type AuditRecommendation = {
  toolId: string;
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan?: string;
  alternativeTool?: string;
  projectedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  severity: "optimal" | "minor" | "moderate" | "significant";
};

export type AuditResult = {
  recommendations: AuditRecommendation[];
  totalMonthlySpend: number;
  totalProjectedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  overallVerdict: "optimal" | "minor" | "moderate" | "significant";
  formData: FormData;
};

const TOOL_NAMES: Record<string, string> = {
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

// Pricing as of May 2025 — sources in PRICING_DATA.md
const PRICING: Record<string, Record<string, number>> = {
  cursor: {
    Hobby: 0,
    Pro: 20,
    Business: 40,
    Enterprise: 100,
  },
  "github-copilot": {
    Individual: 10,
    Business: 19,
    Enterprise: 39,
  },
  claude: {
    Free: 0,
    Pro: 20,
    Max: 100,
    Team: 30,
    Enterprise: 60,
  },
  chatgpt: {
    Free: 0,
    Plus: 20,
    Team: 30,
    Enterprise: 60,
  },
  gemini: {
    Free: 0,
    Pro: 20,
    Ultra: 30,
  },
  windsurf: {
    Free: 0,
    Pro: 15,
    Team: 35,
  },
};

function auditCursor(entry: UserToolEntry, teamSize: number, useCase: string): AuditRecommendation {
  const currentSpend = entry.monthlySpend;
  let recommendedAction = "";
  let recommendedPlan = entry.planName;
  let alternativeTool: string | undefined;
  let projectedSpend = currentSpend;
  let reason = "";
  let severity: AuditRecommendation["severity"] = "optimal";

  if (entry.planName === "Business" && entry.seats <= 3) {
    recommendedPlan = "Pro";
    projectedSpend = 20 * entry.seats;
    reason = `Cursor Business ($40/seat) is designed for teams needing SSO and centralized billing. With only ${entry.seats} seats, Cursor Pro ($20/seat) provides identical AI features at half the price. Business plan extras only justify cost at 10+ seats.`;
    recommendedAction = `Downgrade to Cursor Pro`;
    severity = "significant";
  } else if (entry.planName === "Pro" && useCase === "writing") {
    alternativeTool = "Claude Pro";
    projectedSpend = 20 * entry.seats;
    reason = `Cursor is optimized for code editing and IDE integration. For writing-focused workflows, Claude Pro ($20/seat) offers superior long-form generation, better context handling, and a cleaner interface — at the same price point.`;
    recommendedAction = `Switch to Claude Pro for writing tasks`;
    severity = "moderate";
  } else if (entry.planName === "Pro" && entry.seats > 10) {
    recommendedPlan = "Business";
    projectedSpend = 40 * entry.seats;
    reason = `At ${entry.seats} seats, Cursor Business adds SSO, audit logs, and centralized billing — worth the $20/seat premium for security and admin overhead reduction at this scale.`;
    recommendedAction = `Upgrade to Cursor Business for team management features`;
    severity = "minor";
  } else {
    reason = `Cursor ${entry.planName} is well-matched to your team size (${entry.seats} seats) and use case. No immediate action needed.`;
    recommendedAction = "No change needed";
    severity = "optimal";
  }

  const monthlySavings = currentSpend - projectedSpend;
  return {
    toolId: "cursor",
    toolName: "Cursor",
    currentPlan: entry.planName,
    currentSpend,
    recommendedAction,
    recommendedPlan,
    alternativeTool,
    projectedSpend,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason,
    severity,
  };
}

function auditGithubCopilot(entry: UserToolEntry, teamSize: number, useCase: string): AuditRecommendation {
  const currentSpend = entry.monthlySpend;
  let recommendedAction = "";
  let recommendedPlan = entry.planName;
  let alternativeTool: string | undefined;
  let projectedSpend = currentSpend;
  let reason = "";
  let severity: AuditRecommendation["severity"] = "optimal";

  if (entry.planName === "Business" && entry.seats <= 3) {
    recommendedPlan = "Individual";
    projectedSpend = 10 * entry.seats;
    reason = `GitHub Copilot Business ($19/seat) adds policy management and audit logs relevant for larger teams. With ${entry.seats} seats, Individual plan ($10/seat) covers all core AI completion features. You're paying a 90% premium for admin features you likely don't need yet.`;
    recommendedAction = "Downgrade to Individual plans";
    severity = "significant";
  } else if (entry.planName === "Individual" && useCase === "coding" && entry.seats >= 3) {
    recommendedPlan = "Business";
    projectedSpend = 19 * entry.seats;
    reason = `With ${entry.seats} developers, GitHub Copilot Business adds team-wide policy controls and usage analytics for $9 more per seat — worth it for visibility into AI usage across your engineering team.`;
    recommendedAction = "Consider upgrading to Business for team visibility";
    severity = "minor";
  } else if (entry.planName === "Business" && useCase === "coding") {
    alternativeTool = "Cursor Pro";
    projectedSpend = 20 * entry.seats;
    const diff = projectedSpend - currentSpend;
    reason = `GitHub Copilot Business ($19/seat) provides inline completions. Cursor Pro ($20/seat) includes a full AI-native IDE with multi-file edits, codebase chat, and Claude/GPT-4 integration — marginally more expensive but significantly higher productivity for coding-heavy teams.`;
    recommendedAction = diff > 0 ? "Current plan is cost-efficient; Cursor is more capable if productivity matters more than cost" : "Switch to Cursor Pro for better coding AI";
    severity = "minor";
  } else {
    reason = `GitHub Copilot ${entry.planName} is appropriately matched to your ${entry.seats}-seat team. Pricing is competitive for the feature set.`;
    recommendedAction = "No change needed";
    severity = "optimal";
  }

  const monthlySavings = currentSpend - projectedSpend;
  return {
    toolId: "github-copilot",
    toolName: "GitHub Copilot",
    currentPlan: entry.planName,
    currentSpend,
    recommendedAction,
    recommendedPlan,
    alternativeTool,
    projectedSpend,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason,
    severity,
  };
}

function auditClaude(entry: UserToolEntry, teamSize: number, useCase: string): AuditRecommendation {
  const currentSpend = entry.monthlySpend;
  let recommendedAction = "";
  let recommendedPlan = entry.planName;
  let projectedSpend = currentSpend;
  let reason = "";
  let severity: AuditRecommendation["severity"] = "optimal";

  if (entry.planName === "Max" && entry.seats <= 2) {
    recommendedPlan = "Pro";
    projectedSpend = 20 * entry.seats;
    reason = `Claude Max ($100/seat) is designed for power users needing 5x higher usage limits. For ${entry.seats} seats doing standard work, Claude Pro ($20/seat) provides ample capacity. Max only justifies cost if you're hitting Pro rate limits daily.`;
    recommendedAction = "Downgrade to Claude Pro unless hitting rate limits daily";
    severity = "significant";
  } else if (entry.planName === "Team" && entry.seats <= 2) {
    recommendedPlan = "Pro";
    projectedSpend = 20 * entry.seats;
    reason = `Claude Team ($30/seat) adds collaboration features and higher limits but requires minimum 5 seats to be cost-effective. With ${entry.seats} seats, two individual Pro plans ($20/seat) save $${(entry.seats * 30) - (entry.seats * 20)}/month with equivalent individual capabilities.`;
    recommendedAction = "Switch to individual Pro plans";
    severity = "moderate";
  } else if (entry.planName === "Pro" && entry.seats >= 5) {
    recommendedPlan = "Team";
    projectedSpend = 30 * entry.seats;
    reason = `Claude Team ($30/seat) at ${entry.seats} seats adds shared context, admin controls, and higher rate limits across your team. The $10/seat premium is justified by coordination benefits at this scale.`;
    recommendedAction = "Upgrade to Team plan for collaboration features";
    severity = "minor";
  } else {
    reason = `Claude ${entry.planName} is well-matched to your usage. Anthropic's pricing is competitive at this tier.`;
    recommendedAction = "No change needed";
    severity = "optimal";
  }

  const monthlySavings = currentSpend - projectedSpend;
  return {
    toolId: "claude",
    toolName: "Claude",
    currentPlan: entry.planName,
    currentSpend,
    recommendedAction,
    recommendedPlan,
    projectedSpend,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason,
    severity,
  };
}

function auditChatGPT(entry: UserToolEntry, teamSize: number, useCase: string): AuditRecommendation {
  const currentSpend = entry.monthlySpend;
  let recommendedAction = "";
  let recommendedPlan = entry.planName;
  let alternativeTool: string | undefined;
  let projectedSpend = currentSpend;
  let reason = "";
  let severity: AuditRecommendation["severity"] = "optimal";

  if (entry.planName === "Team" && entry.seats <= 2) {
    recommendedPlan = "Plus";
    projectedSpend = 20 * entry.seats;
    reason = `ChatGPT Team ($30/seat) adds workspace features and higher limits. With only ${entry.seats} users, individual Plus plans ($20/seat) cover all core GPT-4 access. Team features — shared billing, admin console — only add value at 5+ seats.`;
    recommendedAction = "Downgrade to Plus plans";
    severity = "significant";
  } else if (entry.planName === "Plus" && useCase === "coding") {
    alternativeTool = "Cursor Pro";
    projectedSpend = 20 * entry.seats;
    reason = `ChatGPT Plus ($20/seat) for coding use cases is outperformed by Cursor Pro ($20/seat) — Cursor provides IDE-native AI with codebase awareness, inline edits, and multi-file context. Same price, purpose-built for coding.`;
    recommendedAction = "Switch to Cursor Pro for coding workflows";
    severity = "moderate";
  } else if (entry.planName === "Plus" && (useCase === "writing" || useCase === "research")) {
    alternativeTool = "Claude Pro";
    projectedSpend = 20 * entry.seats;
    reason = `For writing and research, Claude Pro ($20/seat) offers longer context windows (200k tokens vs GPT-4's 128k), better document analysis, and stronger long-form writing. Same price, better fit for your use case.`;
    recommendedAction = "Consider switching to Claude Pro";
    severity = "moderate";
  } else {
    reason = `ChatGPT ${entry.planName} is appropriately priced for your team and use case.`;
    recommendedAction = "No change needed";
    severity = "optimal";
  }

  const monthlySavings = currentSpend - projectedSpend;
  return {
    toolId: "chatgpt",
    toolName: "ChatGPT",
    currentPlan: entry.planName,
    currentSpend,
    recommendedAction,
    recommendedPlan,
    alternativeTool,
    projectedSpend,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason,
    severity,
  };
}

function auditGemini(entry: UserToolEntry, teamSize: number, useCase: string): AuditRecommendation {
  const currentSpend = entry.monthlySpend;
  let recommendedAction = "";
  let recommendedPlan = entry.planName;
  let alternativeTool: string | undefined;
  let projectedSpend = currentSpend;
  let reason = "";
  let severity: AuditRecommendation["severity"] = "optimal";

  if (entry.planName === "Ultra" && useCase !== "mixed") {
    recommendedPlan = "Pro";
    projectedSpend = 20 * entry.seats;
    reason = `Gemini Ultra ($30/seat) is optimized for multimodal heavy workloads. For a ${useCase}-focused team, Gemini Pro ($20/seat) covers all standard tasks. The $10/seat premium for Ultra only justifies if you're doing complex image/video analysis at scale.`;
    recommendedAction = "Downgrade to Gemini Pro";
    severity = "moderate";
  } else if (entry.planName === "Pro" && useCase === "coding") {
    alternativeTool = "Cursor Pro";
    projectedSpend = 20 * entry.seats;
    reason = `Gemini Pro for coding lacks IDE integration. Cursor Pro ($20/seat) provides the same price point with native VS Code/JetBrains integration, inline completions, and codebase-aware chat — purpose-built for developer workflows.`;
    recommendedAction = "Switch to Cursor Pro for coding";
    severity = "moderate";
  } else {
    reason = `Gemini ${entry.planName} is reasonably priced for your use case. Google's ecosystem integration adds value if you're in Google Workspace.`;
    recommendedAction = "No change needed";
    severity = "optimal";
  }

  const monthlySavings = currentSpend - projectedSpend;
  return {
    toolId: "gemini",
    toolName: "Gemini",
    currentPlan: entry.planName,
    currentSpend,
    recommendedAction,
    recommendedPlan,
    alternativeTool,
    projectedSpend,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason,
    severity,
  };
}

function auditWindsurf(entry: UserToolEntry, teamSize: number, useCase: string): AuditRecommendation {
  const currentSpend = entry.monthlySpend;
  let recommendedAction = "";
  let recommendedPlan = entry.planName;
  let alternativeTool: string | undefined;
  let projectedSpend = currentSpend;
  let reason = "";
  let severity: AuditRecommendation["severity"] = "optimal";

  if (entry.planName === "Team" && entry.seats <= 3) {
    recommendedPlan = "Pro";
    projectedSpend = 15 * entry.seats;
    reason = `Windsurf Team ($35/seat) adds admin controls suited for larger engineering orgs. With ${entry.seats} seats, individual Pro plans ($15/seat) deliver all core AI coding features at 57% less cost.`;
    recommendedAction = "Downgrade to Pro plans";
    severity = "significant";
  } else if (entry.planName === "Pro" && useCase === "coding") {
    alternativeTool = "Cursor Pro";
    projectedSpend = 20 * entry.seats;
    const diff = projectedSpend - currentSpend;
    reason = `Windsurf Pro ($15/seat) is cost-efficient. Cursor Pro ($20/seat) costs $${diff > 0 ? diff : 0} more per seat but offers more mature multi-file editing and a larger model selection. If budget is tight, Windsurf is defensible; if productivity is priority, Cursor edges it.`;
    recommendedAction = diff > 0 ? "Windsurf Pro is cost-optimal; upgrade to Cursor only if productivity gains justify $5/seat premium" : "No change needed";
    severity = "minor";
  } else {
    reason = `Windsurf ${entry.planName} is a cost-competitive choice for your team.`;
    recommendedAction = "No change needed";
    severity = "optimal";
  }

  const monthlySavings = currentSpend - projectedSpend;
  return {
    toolId: "windsurf",
    toolName: "Windsurf",
    currentPlan: entry.planName,
    currentSpend,
    recommendedAction,
    recommendedPlan,
    alternativeTool,
    projectedSpend,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason,
    severity,
  };
}

function getDefaultAudit(entry: UserToolEntry): AuditRecommendation {
  return {
    toolId: entry.toolId,
    toolName: TOOL_NAMES[entry.toolId] || entry.toolId,
    currentPlan: entry.planName,
    currentSpend: entry.monthlySpend,
    recommendedAction: "No change needed",
    projectedSpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: "This plan appears well-matched to your team size and use case.",
    severity: "optimal",
  };
}

export function runAudit(formData: FormData): AuditResult {
  const recommendations: AuditRecommendation[] = [];

  for (const entry of formData.tools) {
    let rec: AuditRecommendation;
    switch (entry.toolId) {
      case "cursor":
        rec = auditCursor(entry, formData.teamSize, formData.useCase);
        break;
      case "github-copilot":
        rec = auditGithubCopilot(entry, formData.teamSize, formData.useCase);
        break;
      case "claude":
        rec = auditClaude(entry, formData.teamSize, formData.useCase);
        break;
      case "chatgpt":
        rec = auditChatGPT(entry, formData.teamSize, formData.useCase);
        break;
      case "gemini":
        rec = auditGemini(entry, formData.teamSize, formData.useCase);
        break;
      case "windsurf":
        rec = auditWindsurf(entry, formData.teamSize, formData.useCase);
        break;
      default:
        rec = getDefaultAudit(entry);
    }
    recommendations.push(rec);
  }

  const totalMonthlySpend = recommendations.reduce((sum, r) => sum + r.currentSpend, 0);
  const totalProjectedSpend = recommendations.reduce((sum, r) => sum + r.projectedSpend, 0);
  const totalMonthlySavings = totalMonthlySpend - totalProjectedSpend;
  const totalAnnualSavings = totalMonthlySavings * 12;

  const severityOrder = ["significant", "moderate", "minor", "optimal"];
  const worstSeverity = recommendations.reduce((worst, r) => {
    return severityOrder.indexOf(r.severity) < severityOrder.indexOf(worst)
      ? r.severity
      : worst;
  }, "optimal" as AuditRecommendation["severity"]);

  return {
    recommendations,
    totalMonthlySpend,
    totalProjectedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    overallVerdict: worstSeverity,
    formData,
  };
}