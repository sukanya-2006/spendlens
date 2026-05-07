export type ToolPlan = {
  name: string;
  price: number; // per user per month
};

export type AITool = {
  id: string;
  name: string;
  plans: ToolPlan[];
  category: string;
};

export type UserToolEntry = {
  toolId: string;
  planName: string;
  seats: number;
  monthlySpend: number;
};

export type FormData = {
  tools: UserToolEntry[];
  teamSize: number;
  useCase: "coding" | "writing" | "data" | "research" | "mixed";
  email?: string;
  companyName?: string;
};