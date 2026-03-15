# 03 — Monetization Strategy (Month-1 Break-Even, Month-2 Growth)

## 0) Executive Objective

**Primary financial objective**
- **Month 1:** Reach **break-even** against core operating costs:
  - cloud/realtime infra
  - observability/tooling
  - payment fees
  - **iOS Developer Program license allocation**
- **Month 2:** Move from break-even to **repeatable growth** with a safer monetization mix.

**Product rule (non-negotiable):**
- No hard subscription wall for gameplay.
- No paywall on core lessons, ranked access, or fair progression.
- Monetization must come from **cosmetics, convenience outside ranked, parent value, and lightweight partnerships**.

---

## 1) Cost Baseline for Break-Even (Lean v1)

To avoid vague targets, break-even is tied to an explicit monthly cost envelope.

### 1.1 Fixed + quasi-fixed monthly costs (v1)

| Cost Item | Assumption | Monthly Cost (USD) |
|---|---:|---:|
| Realtime/game backend + DB + cache + storage + CDN | Lean autoscaled footprint | 55 |
| Monitoring/logging/error tracking | Low-tier paid tools | 15 |
| Email/push/utility APIs | Transactional usage | 8 |
| Payment processing overhead buffer | blended fees reserve | 7 |
| **iOS Developer Program allocation** | $99/year ÷ 12 | **8.25** |
| Contingency buffer | ~10% for usage spikes | 12 |
| **Total Month-1 Break-Even Target** |  | **105.25** |

**Round target for execution:** **$110 MRR-equivalent** in Month 1.

> Note: Team salary is intentionally excluded from this phase target; this is a strict **platform self-sustainability checkpoint**.

---

## 2) v1 Low-Risk Monetization Stack (No Hard Paywall)

Prioritize only mechanisms with fast implementation, low legal complexity, and low trust risk.

### Stack A — Cosmetic Store (Primary)
**Why first:** Fast to ship, non-pay-to-win, emotionally rewarding for kids.

**Price ladder (localized equivalents):**
- Starter cosmetic: **$0.99**
- Themed bundle: **$2.49**
- Premium skin pack: **$4.99**

**Guardrails:**
- Zero gameplay stat advantage.
- No manipulative countdowns.
- Parent-visible receipts and purchase history.

---

### Stack B — Parent Insights Plus (Optional, not gameplay-gating)
**Why second:** Monetizes parent value, not child progression lock.

**Pricing:**
- **$3.99/month**
- **$29/year** (effective $2.42/month)

**Included value:**
- Weekly skill report
- Pronunciation/accuracy trend
- Home practice recommendations

**Not included:** Any ranked or lesson power advantage.

---

### Stack C — Rewarded Ads (Conservative)
**Why third:** Monetize free cohort without disrupting learning.

**Policy:**
- Optional rewarded ads only (no forced ad in active learning loop)
- Max **1–2 reward opportunities/day**
- Rewards limited to cosmetic tokens / non-ranked utility

---

### Stack D — Founding Supporter Pack (Early goodwill)
**Pricing:**
- One-time **$4.99** badge + thank-you cosmetic frame

**Use case:**
- Helps close Month-1 break-even gap without risky mechanics.

---

## 3) Month-1 Revenue Math (Break-Even Scenario)

### 3.1 Traffic and conversion assumptions (conservative)
- MAU: **300**
- Parent-linked accounts: **120**
- Average DAU: **70**

### 3.2 Revenue components

1) **Cosmetic Store**
- Buyer conversion: **3% of MAU**
- ARPPU: **$3.50**
- Revenue = `300 × 0.03 × 3.50 = $31.50`

2) **Parent Insights Plus**
- Conversion: **4% of parent accounts**
- Price: **$3.99/month**
- Revenue = `120 × 0.04 × 3.99 = $19.15`

3) **Rewarded Ads**
- Monthly rewarded impressions: **2,000**
- eCPM: **$6**
- Revenue = `(2,000 / 1,000) × 6 = $12.00`

4) **Founding Supporter Pack**
- Buyers: **10**
- Price: **$4.99**
- Revenue = `10 × 4.99 = $49.90`

### 3.3 Month-1 total and break-even check
- Total revenue = `31.50 + 19.15 + 12.00 + 49.90 = $112.55`
- Break-even target = **$105.25** (execution target $110)

✅ **Result:** Month-1 reaches break-even with a modest safety margin.

---

## 4) Month-2 Growth Scenarios

Goal: increase from “survive” to “grow” while keeping risk low.

### 4.1 Assumptions for Month 2
- MAU: **1,000** (via growth plan + retention)
- Parent-linked accounts: **400**
- DAU: **220**
- Slight infra scale-up cost: **$150 total monthly burn** (includes iOS allocation)

### 4.2 Base growth scenario (recommended target)

1) Cosmetics: `1000 × 0.04 × 4.00 = $160`
2) Parent Insights Plus: `400 × 0.06 × 3.99 = $95.76`
3) Rewarded Ads: `9,000 impressions / 1000 × $6.5 = $58.50`
4) Founding Supporter/limited drops: `30 × 4.99 = $149.70`
5) Optional weekend event ticket (non-ranked):
   - participants: `1000 × 0.08 = 80`
   - paid uptake: `25%` → 20 users
   - ticket: `$1.49`
   - revenue: `20 × 1.49 = $29.80`

**Month-2 base total = $493.76**

### 4.3 Stretch scenario (with one B2B micro-pilot)
- Base scenario: **$493.76**
- + 1 classroom pilot license: **$99/month**
- + 1 sponsor micro-event: **$150**

**Month-2 stretch total = $742.76**

### 4.4 Growth interpretation
- From Month-1 break-even (~$110) to Month-2 base (~$494): **~4.5x**
- With stretch deals (~$743): **~6.7x**

This is aggressive but still lower risk than launching complex economies too early.

---

## 5) Pricing & Conversion Benchmarks to Track Weekly

### 5.1 Core KPIs
- MAU, DAU, DAU/MAU
- Payer conversion (overall + by stream)
- ARPPU (cosmetics, parent plan)
- Ad ARPDAU
- Parent plan churn
- Refund rate
- Fairness complaints in ranked

### 5.2 Trigger-based actions
- If cosmetic conversion < 2% for 2 consecutive weeks → improve storefront bundles + post-match preview UX.
- If parent plan churn > 10% monthly → improve report quality before price changes.
- If ad-driven retention drop > 3% D7 → reduce ad opportunities immediately.

---

## 6) Anti-Pay-to-Win and Child-Safety Constraints

1. Ranked outcomes depend on skill only.
2. Paid items cannot alter:
   - question difficulty,
   - answer timing windows,
   - MMR/ELO gain-loss,
   - validation tolerance.
3. Booster effects (if any) are practice-only and visibly labeled.
4. Parent controls required: PIN, spending cap, purchase history.
5. Child privacy compliance: age gating, consent logging, data deletion/export flows.

---

## 7) Red Flags — Monetization Ideas to Avoid Early

Avoid these in v1/v1.5 to reduce trust, legal, and product risk:

1. **Loot boxes / gacha with opaque odds**
   - High backlash risk with minors.

2. **Energy systems that block learning unless paid**
   - Directly conflicts with learning mission and retention.

3. **Hard gameplay subscription gates**
   - Violates “free core learning + fair ranked” principle.

4. **Pay-for-power boosters in ranked**
   - Destroys competitive integrity and social trust.

5. **Aggressive interstitial ad frequency**
   - Short-term revenue, long-term retention damage.

6. **Complex creator marketplace at launch**
   - Heavy moderation and fraud risk before core loop stabilizes.

7. **Real-money prize mechanics with legal ambiguity**
   - High compliance exposure across jurisdictions for minors.

---

## 8) 60-Day Execution Plan

### Weeks 1–2
- Ship cosmetic store MVP (15–25 SKUs)
- Add conservative rewarded ads
- Launch Founding Supporter pack
- Instrument monetization events + fairness telemetry

### Weeks 3–4
- Launch Parent Insights Plus
- Add parent controls (PIN/cap/history)
- Run pricing A/B: $0.99 starter vs $1.49 starter bundle

### Weeks 5–6
- Add optional weekend paid event (non-ranked)
- Improve cosmetic merchandising from cohort data

### Weeks 7–8
- Pilot one classroom plan
- Test one sponsor micro-event
- Decide Month-3 scale based on retention + trust + conversion

---

## 9) Final Recommendation

For this arena plan, the safest path is:
- **Month 1:** break-even via cosmetics + parent insights + rewarded ads + supporter pack (target: **$110+**).
- **Month 2:** growth via conversion optimization and one or two lightweight B2B/sponsor wins (target: **$500–$750**, with upside).

This preserves mission alignment: **free core gameplay, fair competition, child-safe monetization**.