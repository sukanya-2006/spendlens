# Reflection

## 1. Hardest bug I hit this week

The hardest bug was the 404 error on shareable audit URLs. When I navigated to `/audit/[id]`, the page consistently returned 404 even though the audit was confirmed saved in Supabase.

My first hypothesis was that the Supabase query was failing — I added console logs and confirmed the query was running but returning no data. Second hypothesis: the UUID wasn't being passed correctly. I checked the URL and the ID looked right.

After reading the Next.js 16 docs more carefully, I found the issue: in Next.js 16, `params` in server components is now a Promise and must be awaited before accessing properties. My code was doing `params.id` directly, which returned undefined, causing the Supabase query to match nothing and return null, which triggered `notFound()`.

The fix was changing the function signature to `params: Promise<{ id: string }>` and adding `const { id } = await params;` before the query. One line fix after 45 minutes of debugging.

## 2. A decision I reversed mid-week

I initially planned to build a separate Express backend for the API routes. I set up the folder structure and started writing it on Day 1. About an hour in I reversed this decision and deleted it entirely.

The reason: Next.js App Router already supports API routes natively via `route.ts` files. A separate Express server would mean managing two processes locally, two deployments on Vercel, CORS configuration, and additional complexity for zero benefit at this scale. Everything the Express server would do, Next.js API routes do natively. I documented this assumption in my DEVLOG and moved on.

## 3. What I would build in week 2

In week 2 I would build three things. First, a benchmark mode — "your AI spend per developer is $X, companies your size average $Y." This requires collecting aggregate anonymized data from audits and displaying percentile rankings. It makes the tool stickier and more shareable.

Second, a PDF export of the full audit report. Founders want to share this with their finance team or board. A downloadable PDF with the SpendLens branding makes it a real deliverable.

Third, a proper transactional email via Resend — sending the audit summary to the user's email after they submit. Currently the email is captured and saved to Supabase but no confirmation is sent. This closes the loop and builds trust.

## 4. How I used AI tools

I used Claude as my primary coding assistant throughout the week. I used it for: generating boilerplate component structure, debugging TypeScript errors, writing the audit engine logic which I then reviewed and edited for correctness, and drafting the markdown documentation files.

I did not trust Claude with: the actual pricing numbers (I verified every number against official vendor pages myself), the audit logic reasoning (I read every rule and asked "would a finance person agree?" before keeping it), and the git history (I wrote every commit message myself to ensure they were meaningful).

One specific time Claude was wrong: it suggested using `localStorage` for storing audit results across sessions, which would have broken the shareable URL feature entirely since localStorage is per-browser. I caught this because I was thinking about how the shareable URL would work — a different user opening the link wouldn't have the data in their localStorage. The correct solution was Supabase.

For the AI summary feature: I implemented the full Anthropic API integration with a carefully crafted prompt. However, my free account had zero credits and I couldn't add funds. Rather than showing a generic fallback message, I built a smart template engine that generates genuinely different summaries based on real audit data — savings tier, team size, use case, and biggest saving opportunity by name. The Anthropic API code remains in git history and will work immediately when credits are added. This was a deliberate engineering decision: a meaningful fallback is better than a broken feature.

## 5. Self-rating

- **Discipline: 7/10** — I started on Day 1 and committed every working day except the travel day. I could have been more consistent with commit granularity early on.
- **Code quality: 7/10** — TypeScript types are well-defined, audit engine is readable and modular. I would add more error boundaries and loading states with more time.
- **Design sense: 6/10** — The dark theme is clean and professional. The results page is clear. I didn't invest enough in making the form more visually engaging.
- **Problem solving: 8/10** — Debugged the params async issue systematically, handled the Anthropic API fallback with a smart template engine rather than a generic message, made pragmatic architectural decisions quickly.
- **Entrepreneurial thinking: 7/10** — I understood the lead-gen purpose of the tool from Day 1 and built the Credex CTA, shareable URLs, and email capture accordingly. The GTM and economics documents show genuine thinking about distribution and unit economics.