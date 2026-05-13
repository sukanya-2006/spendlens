# SpendLens — Free AI Spend Audit for Startups

SpendLens is a free web tool that audits your startup's AI tool spend and tells you exactly where you're overpaying — with specific, defensible recommendations to switch plans or tools. Built as a lead generation asset for Credex.

**Live URL:** https://spendlens-taupe-eight.vercel.app

---

## Screenshots

### Spend Input Form
![Spend Input Form](/screenshot-1.png)

### Audit Results Page
![Audit Results](/screenshot-2.png)

### Shareable Audit URL
![Shareable Audit](/screenshot-3.png)

---

## Quick Start

### Install and run locally

```bash
git clone https://github.com/sukanya-2006/spendlens.git
cd spendlens
npm install
```

Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_key
```

```bash
npm run dev
```

Open http://localhost:3000

### Run tests
```bash
npm test
```

### Deploy
Push to GitHub — Vercel auto-deploys on every push to main.

---

## Decisions

1. **Rules-based audit engine instead of AI for the core logic** — The assignment specifically said "for the audit math itself, hardcoded rules are correct." Each rule is defensible with real pricing data. A finance person would agree with every recommendation.

2. **Next.js over plain React** — App Router handles both frontend and API routes in one codebase. No separate backend needed. Vercel deployment is zero-config and auto-deploys on push.

3. **Supabase over Firebase** — Postgres gives proper relational data between audits and leads. Better TypeScript SDK. Free tier is generous for this use case.

4. **Email gate after value, never before** — The assignment was explicit. User sees full audit results first. Email is optional to save the report.

5. **Personalized summary without paid API** — Built a smart template engine that generates different summaries based on savings tier, team size, use case, and biggest saving opportunity. Reads as personalized without requiring API credits.