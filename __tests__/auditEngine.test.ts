import { runAudit } from "../app/lib/auditEngine";
import { FormData } from "../app/types";

describe("Audit Engine", () => {
  test("Cursor Business with 2 seats should recommend downgrade to Pro", () => {
    const formData: FormData = {
      tools: [{ toolId: "cursor", planName: "Business", seats: 2, monthlySpend: 80 }],
      teamSize: 2,
      useCase: "coding",
    };
    const result = runAudit(formData);
    expect(result.recommendations[0].severity).toBe("significant");
    expect(result.totalMonthlySavings).toBe(40);
  });

  test("Cursor Pro with 1 seat should be optimal", () => {
    const formData: FormData = {
      tools: [{ toolId: "cursor", planName: "Pro", seats: 1, monthlySpend: 20 }],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(formData);
    expect(result.recommendations[0].severity).toBe("optimal");
    expect(result.totalMonthlySavings).toBe(0);
  });

  test("ChatGPT Plus for coding should recommend switch to Cursor", () => {
    const formData: FormData = {
      tools: [{ toolId: "chatgpt", planName: "Plus", seats: 1, monthlySpend: 20 }],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(formData);
    expect(result.recommendations[0].severity).toBe("moderate");
  });

  test("Claude Max with 1 seat should recommend downgrade", () => {
    const formData: FormData = {
      tools: [{ toolId: "claude", planName: "Max", seats: 1, monthlySpend: 100 }],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(formData);
    expect(result.recommendations[0].severity).toBe("significant");
    expect(result.totalMonthlySavings).toBe(80);
  });

  test("Windsurf Team with 2 seats should recommend downgrade", () => {
    const formData: FormData = {
      tools: [{ toolId: "windsurf", planName: "Team", seats: 2, monthlySpend: 70 }],
      teamSize: 2,
      useCase: "coding",
    };
    const result = runAudit(formData);
    expect(result.recommendations[0].severity).toBe("significant");
  });

  test("Total savings calculated correctly across multiple tools", () => {
    const formData: FormData = {
      tools: [
        { toolId: "cursor", planName: "Business", seats: 2, monthlySpend: 80 },
        { toolId: "claude", planName: "Max", seats: 1, monthlySpend: 100 },
      ],
      teamSize: 2,
      useCase: "coding",
    };
    const result = runAudit(formData);
    expect(result.totalMonthlySavings).toBe(120);
    expect(result.totalAnnualSavings).toBe(1440);
  });

  test("Optimal audit returns correct overall verdict", () => {
    const formData: FormData = {
      tools: [{ toolId: "cursor", planName: "Pro", seats: 1, monthlySpend: 20 }],
      teamSize: 1,
      useCase: "coding",
    };
    const result = runAudit(formData);
    expect(result.overallVerdict).toBe("optimal");
  });
});