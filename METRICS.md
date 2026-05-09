# Metrics

## North Star Metric

**Audits completed per week**

Why: This is a B2B lead-gen tool used infrequently (once per quarter per team). DAU/MAU are meaningless. The single metric that drives everything is audits completed — each one is a potential Credex lead. More audits = more leads = more revenue.

---

## 3 Input Metrics

1. **Unique visitors to homepage**
   — Drives audit volume. If traffic drops, audit completions drop.

2. **Form completion rate (visitors → audit submitted)**
   — Measures how well the form UX converts curiosity into action. Target: >60%.

3. **Lead capture rate (audit completed → email submitted)**
   — Measures post-audit value perception. Target: >25% for high-savings audits.

---

## What I'd Instrument First

1. Posthog or Mixpanel event: `audit_completed` with properties: total_monthly_savings, team_size, use_case, tools_count
2. Event: `lead_captured` with audit_id and savings bucket (<$100, $100-$500, >$500)
3. Event: `shareable_url_copied` — tracks viral loop activation
4. Event: `credex_cta_clicked` — tracks high-intent conversion

---

## Pivot Trigger

If after 500 audits, fewer than 2% of users with >$500/mo savings click the Credex CTA, the value proposition or CTA placement needs rethinking. Either the savings aren't believable, or the connection to Credex isn't clear enough.