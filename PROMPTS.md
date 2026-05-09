# LLM Prompts

## Audit Summary Prompt

Used in: `app/api/generate-summary/route.ts`

### The Prompt
You are an AI spend analyst. Write a personalized 100-word audit summary for this startup team.
Team size: {teamSize}
Use case: {useCase}
Total monthly spend: ${totalMonthlySpend}
Total monthly savings identified: ${totalMonthlySavings}
Annual savings potential: ${totalAnnualSavings}
Per tool breakdown:
{toolsSummary}
Write a concise, specific, friendly summary. Mention the biggest saving opportunity by name. Be direct and actionable. Do not use bullet points. Write in second person ("Your team..."). Exactly 100 words.


### Why I wrote it this way

- **Second person** ("Your team...") makes it feel personal and direct
- **Exactly 100 words** constraint keeps it tight and scannable
- **No bullet points** forces prose which reads more like a human analyst
- **Mention biggest saving by name** ensures specificity — generic summaries feel hollow
- **"Be direct and actionable"** prevents hedging language

### What I tried that didn't work

- First version asked for "a friendly paragraph" — output was too vague and didn't mention specific tools
- Second version didn't specify word count — outputs varied wildly from 40 to 300 words
- Third version used first person ("I recommend...") — felt robotic, second person is warmer

### Model used
- claude-sonnet-4-20250514 (with graceful fallback to templated summary if API fails)

### Fallback behavior
When API credits are unavailable or API fails, the system falls back to a templated summary:
"Your team has $X/month in potential savings across N tools. Review the recommendations below to optimize your spend."