# 03 — Monetization Strategy (Month-1 Validation, Month-3 Break-Even)

## 0) Executive Objective

**Financial milestones (revised)**

- **Month 1 (Validation):** prove early willingness-to-pay and ad viability on a small base; target **$30–$60 monthly revenue** with clean retention/fairness signals.
- **Month 2 (Optimization):** improve conversion and ARPPU while keeping monetization light; target **$90–$140 monthly revenue**.
- **Month 3 (Break-even):** reach **$170+ monthly revenue** to cover lean platform costs.

**Product rule (non-negotiable)**

- No hard paywall for core duel gameplay.
- No pay-to-win in ranked/fair matches.
- Monetization only from cosmetics, optional parent value, and low-pressure rewarded ads.

---

## 1) Cost Baseline (Web-first, Duel-only v1)

Break-even is tied to explicit monthly operating cost for v1.

| Cost Item | Assumption | Monthly Cost (USD) |
|---|---:|---:|
| Web app hosting + realtime/game backend + DB + CDN | Lean autoscaling, single region | 80 |
| Monitoring/logging/error tooling | Low-tier paid stack | 20 |
| Email/notifications/utilities | Transactional, low volume | 10 |
| Payment fees reserve | Blended fee + failed payment buffer | 10 |
| Contingency | Usage spikes + misc | 15 |
| **Total Break-even Target** |  | **135** |

**Execution threshold:** aim for **$170/month** by Month 3 (includes safety margin vs. variance/refunds).

> Note: salaries are excluded in this phase. This checkpoint is strict platform self-sustainability.

---

## 2) Realistic Early-Stage Assumptions (Low brand trust)

For a new education game with low brand recognition, initial conversion is usually weak. Model assumptions should reflect that.

### 2.1 Traffic assumptions

- **Month 1 MAU:** 350
- **Month 2 MAU:** 700
- **Month 3 MAU:** 1,100
- Parent-linked ratio: ~35–40% of MAU

### 2.2 Conversion assumptions (conservative)

- Cosmetic payer conversion starts at **1.5%** (not 3–5% in Month 1)
- Parent plan conversion starts at **1.0% of parent-linked accounts**
- Rewarded ads usage starts at **3–4 rewarded views/user/month** among active cohort
- Founding support is one-time and decays after launch window

These are intentionally strict to avoid false confidence.

---

## 3) v1 Monetization Stack (Low-risk, Duel-only Web-first)

Prioritize mechanisms with low implementation risk, low legal complexity, and low trust damage.

### A) Cosmetics (Primary)

- Starter: **$0.99**
- Bundle: **$1.99**
- Premium cosmetic pack: **$3.99**

Rules:
- Visual-only, no gameplay advantage.
- No manipulative countdown pressure.
- Clear purchase history for parents.

### B) Rewarded Ads (Secondary)

- Optional only; never forced during active duels.
- Max **1 reward slot/day** in Month 1, can increase to 2 if retention unaffected.
- Rewards limited to cosmetic currency and non-ranked quality-of-life items.

### C) Parent Insights Lite (Small optional add-on)

- Price: **$2.99/month** (no annual plan in first 90 days)
- Includes: weekly progress summary + suggested practice routine
- Excludes: any ranked power/advantage

### D) Founding Badge Pack (Launch-only bridge)

- One-time **$3.99**
- Includes supporter badge + cosmetic frame
- Explicitly time-boxed, not treated as recurring core revenue

---

## 4) Revenue Math by Month (Revised)

## 4.1 Month 1 — Validation (not break-even)

Assumptions:
- MAU: 350
- Parent-linked accounts: 130

Revenue:
1. Cosmetics: `350 × 1.5% × $2.20 ARPPU = $11.55`
2. Parent Insights Lite: `130 × 1.0% × $2.99 = $3.89`
3. Rewarded ads: `1,900 impressions ÷ 1000 × $5.5 eCPM = $10.45`
4. Founding badge: `8 buyers × $3.99 = $31.92`

**Month 1 total = $57.81**

Interpretation:
- ✅ Good validation signal if D30 retention is stable and complaint rate is low
- ❌ Not intended to cover costs yet

## 4.2 Month 2 — Optimization

Assumptions:
- MAU: 700
- Parent-linked: 260
- Slight conversion improvements from UX/pricing iterations

Revenue:
1. Cosmetics: `700 × 2.2% × $2.40 = $36.96`
2. Parent Insights Lite: `260 × 1.8% × $2.99 = $13.99`
3. Rewarded ads: `6,000 ÷ 1000 × $6.0 = $36.00`
4. Founding badge tail: `10 × $3.99 = $39.90`

**Month 2 total = $126.85**

Interpretation:
- Near-operating-cost range in optimistic weeks
- Still not reliable break-even because one-time badge contributes meaningfully

## 4.3 Month 3 — Break-even target

Assumptions:
- MAU: 1,100
- Parent-linked: 420
- Better store merchandising and onboarding

Revenue:
1. Cosmetics: `1100 × 3.0% × $2.70 = $89.10`
2. Parent Insights Lite: `420 × 2.2% × $2.99 = $27.63`
3. Rewarded ads: `10,000 ÷ 1000 × $6.0 = $60.00`
4. Founding badge tail: `5 × $3.99 = $19.95`

**Month 3 total = $196.68**

Break-even check:
- Cost baseline: **$135**
- Safety break-even threshold: **$170**
- Result: **$196.68 → pass with limited margin**

---

## 5) Scenario Table (Decision-ready)

| Scenario | M3 MAU | Cosmetics Conv. | Parent Conv. | Ad Revenue | M3 Revenue |
|---|---:|---:|---:|---:|---:|
| Bear | 850 | 2.0% | 1.5% | $40 | ~$112 |
| Base | 1,100 | 3.0% | 2.2% | $60 | ~$197 |
| Bull | 1,400 | 3.8% | 3.0% | $80 | ~$286 |

Use **Base** for planning, **Bear** for risk control, **Bull** as upside only.

---

## 6) Weekly KPI Gates (Strict)

Track weekly and compare against gates:

- D7 retention (overall and payer cohort)
- Cosmetic conversion
- Parent plan activation and churn
- Rewarded ad opt-in rate
- Refund rate
- Fairness complaints (pay-to-win perception)
- Ad-related sentiment score

### Gate thresholds

- Cosmetic conversion **<1.2% for 2 consecutive weeks** → rework store UX before adding new SKUs.
- Parent churn **>12% monthly equivalent** → improve report quality, no price increase.
- D7 retention drop **>4pp after ad rollout** → reduce ad opportunities immediately.
- Refund rate **>8%** → freeze new offers and fix expectation mismatch.
- Pay-to-win complaints **>2% of active feedback volume** → immediate monetization review.

---

## 7) Hard Red Flags (Do NOT ship in v1/v1.5)

1. Loot boxes / gacha with opaque odds
2. Energy systems that block duels unless paid
3. Any ranked advantage from paid items
4. Forced interstitial ads between duel sessions
5. Complex marketplace/UGC economy before moderation maturity
6. Real-money prize mechanics with legal ambiguity for minors
7. Price experiments that hide true cost from parents

If any red-flag design is required to hit revenue, strategy is likely broken and should pivot.

---

## 8) Pivot Conditions (Strict)

Trigger pivot discussion if **any** of the following occurs by end of Month 2:

1. Revenue **< $90** despite MAU growth and two pricing/store iterations.
2. D30 retention **< 12%** and monetization changes worsen retention.
3. Parent plan conversion remains **<1.0%** after product/report improvements.
4. Ad monetization causes sustained negative sentiment or >4pp retention impact.
5. Compliance/parent trust concerns consume roadmap capacity.

### Approved pivot directions

- Pivot A: reduce monetization surface, focus on retention loop first (content/duel quality).
- Pivot B: add lightweight B2B classroom pilot earlier (teacher dashboard, school bundle).
- Pivot C: broaden web distribution channels before deeper monetization complexity.

---

## 9) 90-Day Rollout (Low-risk sequence)

### Month 1
- Ship cosmetics MVP (10–15 SKUs)
- Enable optional rewarded ads (1 slot/day)
- Launch founding badge pack
- Instrument full monetization + fairness analytics

### Month 2
- Improve store UX, bundle clarity, and price points
- Launch Parent Insights Lite
- Add parent controls (history + spending lock)
- Run two controlled experiments only (avoid over-testing noise)

### Month 3
- Scale winning offers only
- Keep ad pressure capped unless retention unaffected
- Decide: continue B2C scaling vs. add B2B classroom pilot

---

## 10) Final Recommendation

For duel-only web-first v1, use a **trust-first, low-risk** monetization model:

- **Month 1:** validate demand signals, not break-even.
- **Month 2:** optimize conversion with strict safety/fairness gates.
- **Month 3:** hit break-even (~$170+ target) through cosmetics + light parent value + conservative rewarded ads.

This path is slower than aggressive monetization, but far safer for a low-brand early-stage kids product where trust and retention determine long-term survival.