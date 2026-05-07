import { AITool } from "../types";

export const AI_TOOLS: AITool[] = [
  {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    plans: [
      { name: "Hobby", price: 0 },
      { name: "Pro", price: 20 },
      { name: "Business", price: 40 },
      { name: "Enterprise", price: 100 },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "coding",
    plans: [
      { name: "Individual", price: 10 },
      { name: "Business", price: 19 },
      { name: "Enterprise", price: 39 },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    category: "mixed",
    plans: [
      { name: "Free", price: 0 },
      { name: "Pro", price: 20 },
      { name: "Max", price: 100 },
      { name: "Team", price: 30 },
      { name: "Enterprise", price: 60 },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "mixed",
    plans: [
      { name: "Free", price: 0 },
      { name: "Plus", price: 20 },
      { name: "Team", price: 30 },
      { name: "Enterprise", price: 60 },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    category: "mixed",
    plans: [
      { name: "Free", price: 0 },
      { name: "Pro", price: 20 },
      { name: "Ultra", price: 30 },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    category: "coding",
    plans: [
      { name: "Free", price: 0 },
      { name: "Pro", price: 15 },
      { name: "Team", price: 35 },
    ],
  },
];