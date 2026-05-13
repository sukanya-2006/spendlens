

# User Research Notes

**These notes were documen**ted between May 9–11, 2026 while building the project to better understand how different types of users might interact with AI tools, subscriptions, and pricing models.

Due to time constraints, I was not able to conduct formal real-world user interviews during the build period. Instead, I spent time observing common usage patterns, researching online discussions, reflecting on peer behavior, and creating hypothetical user personas to guide product decisions and recommendation logic.

The goal of this research was not to validate the product scientifically, but to think more carefully about different user types and avoid designing around only my own assumptions.

---

## Persona 1 — Lightweight Creative User

### Example Profile

Associate graphic designer at a small agency who occasionally uses AI tools for writing assistance, brainstorming, and content support alongside primary creative work.

### Expected Usage Patterns

* Uses AI occasionally instead of daily
* Prefers free tools over subscriptions
* Cares more about consistency and simplicity than advanced features
* Would only consider paying if AI became part of their everyday workflow

### Key Product Insight

This made me think more carefully about lightweight users who may not benefit from premium subscriptions. Instead of always suggesting upgrades, the product should also recognize when a user is already spending efficiently.

### Design Impact

* Reduced overly aggressive upgrade recommendations
* Added clearer reasoning behind suggestions
* Introduced “You’re spending well” style messaging for users already optimizing costs

---

## Persona 2 — Heavy Student AI User

### Example Profile

Computer science student actively using AI tools for coding help, debugging, assignments, hackathons, and exam preparation.

### Expected Usage Patterns

* Uses multiple AI tools simultaneously
* Frequently hits free usage limits during intense work sessions
* Treats different AI tools as useful for different purposes
* More likely to consider student-friendly pricing options

### Key Product Insight

This highlighted that users may intentionally keep multiple tools instead of searching for one perfect replacement. Different products can occupy different emotional or functional roles in a user’s workflow.

### Design Impact

* Avoided treating all AI tools as direct competitors
* Improved recommendation logic around usage limits vs pricing
* Considered how workflows change during stressful or deadline-heavy periods

---

## Persona 3 — Occasional Research-Focused User

### Example Profile

Non-CS student using AI tools occasionally for research, concept understanding, summarization, and organizing academic work.

### Expected Usage Patterns

* Uses AI casually instead of daily
* Values quick explanations and organization help
* Less interested in premium or power-user features
* Unlikely to justify recurring monthly subscriptions

### Key Product Insight

This helped frame AI tools as utility products for some users rather than essential daily platforms. For occasional users, speed and accessibility may matter more than advanced capabilities.

### Design Impact

* Added stronger distinction between heavy and occasional users
* Reduced unnecessary paid recommendations for low-frequency workflows
* Improved logic around identifying users who are already spending appropriately

---

## Reflection

Even though I could not conduct formal interviews during the project timeline, this research process still helped me think more intentionally about user behavior instead of designing entirely from my own perspective.

One of the biggest takeaways was realizing that good recommendations are not always about maximizing upgrades or reducing costs — sometimes the best outcome is simply helping users understand that their current setup already works well for them.
