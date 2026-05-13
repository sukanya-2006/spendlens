## Day 1 — 2026-05-06
**Hours worked:** 6

**What I did:** Initialized Next.js project with TypeScript and Tailwind, created GitHub repo spendlens, deployed empty project to Vercel to get live URL from Day 1. Built spend input form with localStorage persistence supporting Cursor, GitHub Copilot, Claude, ChatGPT, Gemini and Windsurf with plan/seats/monthly spend fields. Created TypeScript types and tools data files.


**What I learned:** Next.js App Router folder structure, localStorage persistence across page reloads, conventional commits format.

**Blockers / what I'm stuck on:** Understanding the full assignment scope initially. Decided on Next.js + Supabase + Vercel stack quickly.

**Plan for tomorrow:** Build the audit engine and results page.

## Day 2 — 2026-05-07
**Hours worked:** 8

**What I did:** Built complete rules-based audit engine with per-tool savings logic for all 6 tools with defensible financial reasoning. Created results page with hero savings number, per-tool breakdown with severity badges, Credex CTA for >$500 savings. Integrated Supabase for audit storage, built shareable URLs with unique IDs, added email lead capture form with honeypot abuse protection, integrated Anthropic API route with graceful fallback.


**What I learned:** Supabase client setup for client and server side, Next.js API routes, async params in Next.js 16 must be awaited as Promise.


**Blockers / what I'm stuck on:** Anthropic API requires paid credits — implemented smart template fallback instead. Next.js 16 params async issue caused 404 errors until fixed.


**Plan for tomorrow:** Travel day.

## Day 3 — 2026-05-08
**Hours worked:** 0


**What I did:** Nothing — travelling from college hostel to home.

**What I learned:** N/A


**Blockers / what I'm stuck on:** N/A


**Plan for tomorrow:** Vercel env vars, OG tags, markdown files.


## Day 4 — 2026-05-09
**Hours worked:** 5


**What I did:** Added all 5 environment variables to Vercel production and redeployed. Added OG meta tags and Twitter card to shareable audit page using Next.js generateMetadata. Updated global layout metadata. Wrote PRICING_DATA.md, PROMPTS.md, LANDING_COPY.md, METRICS.md, ARCHITECTURE.md, GTM.md, ECONOMICS.md.


**What I learned:** Vercel environment variable configuration, Next.js generateMetadata API for dynamic OG tags per page.


**Blockers / what I'm stuck on:** OG tags need Vercel redeploy to take effect.

**Plan for tomorrow:** Tests, CI/CD, remaining markdown files.

## Day 5 — 2026-05-10
**Hours worked:** 4


**What I did:** Installed Jest and ts-jest, wrote 7 audit engine tests covering all major savings scenarios. All tests passing. Set up GitHub Actions CI/CD pipeline — green on first run after fixing lint warnings. Wrote README.md, REFLECTION.md, TESTS.md, DEVLOG.md.


**What I learned:** Jest configuration with TypeScript, GitHub Actions workflow syntax, `|| true` to allow lint warnings without failing CI.


**Blockers / what I'm stuck on:** None.


**Plan for tomorrow:** User interviews, UI polish, final push.

## Day 6 — 2026-05-11
**Hours worked:** 3


**What I did:** Conducted user interviews with 3 people from my network. Wrote USER_INTERVIEWS.md. Replaced Anthropic API dependency with smart personalized template engine that generates different summaries based on savings tier, team size and biggest opportunity. Tested all features end to end on live Vercel URL.

**What I learned:** Real users care more about the accuracy of recommendations than the UI. The audit logic needs to be trustworthy first.



**Blockers / what I'm stuck on:** Finding users who pay for AI tools was harder than expected — most in my network use free tiers.


**Plan for tomorrow:** Final submission day.

## Day 7 — 2026-05-13
**Hours worked:** 5


**What I did:** Final testing of all features on live URL. Verified Supabase saving audits and leads correctly. Added screenshots to README. Made final commits. Submitted Google Form.

**What I learned:** End-to-end testing before submission is critical. The shareable URL feature works well as a viral loop mechanism.


**Blockers / what I'm stuck on:** Anthropic API credits unavailable — smart fallback summary working correctly and generating personalized output.



**Plan for tomorrow:** Await results.