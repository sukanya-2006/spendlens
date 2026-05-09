
# SpendLens — Free AI Spend Audit for Startups

SpendLens is a free web tool that audits your startup's AI tool spend and tells you exactly where you're overpaying — with specific, defensible recommendations to switch plans or tools.

Built as part of the Credex internship assignment. Deployable and usable by any startup today.

**Live URL:** https://spendlens-taupe-eight.vercel.app

---

## Screenshots

> [Add 3 screenshots here before submission]
> 1. Spend input form
> 2. Results page showing savings
> 3. Shareable audit URL

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

### Deploy to Vercel

1. Push to GitHub
2. Import repo on vercel.com
3. Add environment variables in Vercel dashboard
4. Deploy

---

## Decisions

1. **Rules-based audit engine instead of AI** — The assignment specifically said "for the audit math itself, hardcoded rules are correct — knowing when not to use AI is part of the test." Each rule is defensible: a finance person would agree with the reasoning.

2. **Next.js over plain React** — App Router handles both frontend and API routes in one codebase. No separate backend needed. Vercel deployment is zero-config.

3. **Supabase over Firebase** — Postgres gives us proper relational data between audits and leads. Better TypeScript SDK. Free tier is generous enough for this use case.

4. **Email gate after value, never before** — The assignment was explicit about this. User sees full audit results first, email is optional to save/share the report.

5. **Graceful fallback for Anthropic API** — Rather than blocking the UI when API credits are unavailable, the app falls back to a templated summary. The feature is built and documented; credits are a billing concern not a code concern.