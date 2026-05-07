"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AI_TOOLS } from "../data/tools";
import { FormData, UserToolEntry } from "../types";

const defaultEntry = (): UserToolEntry => ({
  toolId: "cursor",
  planName: "Pro",
  seats: 1,
  monthlySpend: 20,
});

const defaultForm = (): FormData => ({
  tools: [defaultEntry()],
  teamSize: 1,
  useCase: "coding",
});

export default function SpendForm({
  onSubmit,
}: {
  onSubmit: (data: FormData) => void;
}) {
  const [form, setForm] = useState<FormData>(defaultForm());

  // Persist form state across page reloads
  useEffect(() => {
    const saved = localStorage.getItem("spendlens_form");
    if (saved) setForm(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("spendlens_form", JSON.stringify(form));
  }, [form]);

  const updateTool = (index: number, field: keyof UserToolEntry, value: string | number) => {
    const updated = [...form.tools];
    if (field === "toolId") {
      const tool = AI_TOOLS.find((t) => t.id === value);
      updated[index] = {
        ...updated[index],
        toolId: value as string,
        planName: tool?.plans[0].name || "",
        monthlySpend: (tool?.plans[0].price || 0) * updated[index].seats,
      };
    } else if (field === "planName") {
      const tool = AI_TOOLS.find((t) => t.id === updated[index].toolId);
      const plan = tool?.plans.find((p) => p.name === value);
      updated[index] = {
        ...updated[index],
        planName: value as string,
        monthlySpend: (plan?.price || 0) * updated[index].seats,
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setForm({ ...form, tools: updated });
  };

  const addTool = () => {
    setForm({ ...form, tools: [...form.tools, defaultEntry()] });
  };

  const removeTool = (index: number) => {
    const updated = form.tools.filter((_, i) => i !== index);
    setForm({ ...form, tools: updated });
  };

  const handleSubmit = () => {
    if (form.tools.length === 0) return;
    onSubmit(form);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">
            Spend<span className="text-orange-400">Lens</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Find out exactly where you're overpaying on AI tools.
          </p>
        </div>

        {/* Team Info */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Your Team
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Team Size</label>
              <input
                type="number"
                min={1}
                value={form.teamSize}
                onChange={(e) =>
                  setForm({ ...form, teamSize: parseInt(e.target.value) || 1 })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Primary Use Case</label>
              <select
                value={form.useCase}
                onChange={(e) =>
                  setForm({ ...form, useCase: e.target.value as FormData["useCase"] })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
              >
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="data">Data</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="space-y-4 mb-6">
          {form.tools.map((entry, index) => {
            const tool = AI_TOOLS.find((t) => t.id === entry.toolId);
            return (
              <div
                key={index}
                className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Tool {index + 1}
                  </span>
                  {form.tools.length > 1 && (
                    <button
                      onClick={() => removeTool(index)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Tool</label>
                    <select
                      value={entry.toolId}
                      onChange={(e) => updateTool(index, "toolId", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
                    >
                      {AI_TOOLS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Plan</label>
                    <select
                      value={entry.planName}
                      onChange={(e) => updateTool(index, "planName", e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
                    >
                      {tool?.plans.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name} — ${p.price}/user/mo
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Seats</label>
                    <input
                      type="number"
                      min={1}
                      value={entry.seats}
                      onChange={(e) =>
                        updateTool(index, "seats", parseInt(e.target.value) || 1)
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Monthly Spend ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={entry.monthlySpend}
                      onChange={(e) =>
                        updateTool(index, "monthlySpend", parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Tool Button */}
        <button
          onClick={addTool}
          className="w-full border border-dashed border-gray-700 rounded-2xl py-4 text-gray-500 hover:text-orange-400 hover:border-orange-400 transition-colors flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={18} />
          Add another tool
        </button>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-2xl transition-colors text-lg"
        >
          Run My Audit →
        </button>
      </div>
    </div>
  );
}