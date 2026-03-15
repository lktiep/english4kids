# 04) Growth & Marketing Masterplan (Product-Coupled)

## 0. North Star

Build the **#1 kids English speaking arena game** by making growth mechanics part of gameplay, not an external ad layer.

**North Star Metric:**
- **Weekly Active Learners with 3+ completed speaking battles (WAL-3)**

Why: this captures retention + learning behavior + social/game loop quality.

---

## 1. Growth Model Overview

We use a 4-loop growth system:

1. **Content Loop (Discovery):** Short-form videos/social content → install/visit → first battle.
2. **Social Loop (Invites):** Existing users invite peers/classmates/family → co-play rewards.
3. **Institutional Loop (Schools/Communities):** teachers/centers run classroom leagues → recurring cohorts.
4. **Performance Loop (Paid + SEO/ASO):** predictable acquisition optimized by LTV/CAC and conversion quality.

Each loop has embedded product surfaces (codes, missions, share cards, league modes, creator events).

---

## 2. Audience Segments & Positioning

## 2.1 Core Segments
- **S1: Parent-led (ages 5–10)**
  - Buyer: parent
  - Need: confidence speaking English, safe gamified learning
- **S2: Self-driven kids (ages 9–14)**
  - User: child
  - Need: fun competition, social recognition
- **S3: Teachers/tutors/centers**
  - Buyer + operator
  - Need: measurable speaking practice at class scale

## 2.2 Value Propositions by Segment
- **Parent:** “15 minutes/day to stronger English confidence, measurable every week.”
- **Kid:** “Battle friends, level up your voice avatar, become top speaker.”
- **Teacher:** “Run speaking leagues with auto scoring, assignments, and class leaderboard.”

## 2.3 Messaging Pillars (global)
1. **Speak with confidence** (outcome)
2. **Play with friends** (motivation)
3. **Track real progress** (credibility)
4. **Safe kid-first environment** (trust)

---

## 3. Channel Strategy (with Product + Engineering Mapping)

## 3.1 TikTok / Reels / YouTube Shorts

### Strategy
- Daily short-form program: challenge clips, before/after pronunciation, “battle moments”, creator duets.
- Use serialized formats (Episode #) and weekly themes (“Animal Week”, “Travel Week”).
- Every video maps to a playable in-app challenge.

### Product Features Needed
- **Challenge Deep Link System** (`/challenge/:id`)
- **Campaign Landing Screen** with one-tap “Play this challenge now”
- **Shareable battle highlights** (auto-generated 9:16 snippets)
- **UGC template cards** (caption + hashtag + challenge ID)

### Engineering Tasks
- Build universal links + deferred deep linking (install → open to challenge)
- Clip-generation service (auto trim top moments + subtitles)
- Campaign attribution parameter support (`utm_source`, `utm_campaign`, `creative_id`)
- In-app event `challenge_started_from_content`

### KPI
- View → click-through rate (CTR)
- Click → install rate
- Install → first battle completion
- Cost per WAL-3 by creative series

---

## 3.2 Referral Loops

### Strategy
- Two-sided rewards: inviter + invitee both gain premium currency / cosmetic unlocks.
- Multi-tier social quests: “Invite 1 friend”, “Play 3 duo battles”, “Create team of 5”.
- Family mode and class mode referral tracks.

### Product Features Needed
- **Referral Hub** with code/link, progress tracker, reward ladder
- **Friend join missions** (co-op milestone rewards)
- **Team creation and team XP boosts**
- Anti-abuse checks and transparent referral status

### Engineering Tasks
- Referral service with unique codes + fraud detection (device/account graph)
- Reward issuance engine with idempotency
- Cohort tagging by inviter and referral wave
- Event schema: `invite_sent`, `invite_accepted`, `referral_reward_claimed`

### KPI
- Viral coefficient (K-factor)
- Invite acceptance rate
- Referred user Day-7 retention vs non-referred
- % of new users from referral channel

---

## 3.3 School / Community Ambassadors

### Strategy
- Recruit teacher ambassadors and parent-community champions.
- Provide “League-in-a-box”: class tournament templates, printable materials, monthly ranking packs.
- Incentivize with certification, spotlight pages, and revenue share for paid cohorts.

### Product Features Needed
- **Classroom League Mode** (private code join, class leaderboard)
- **Teacher dashboard** (assignments, participation, speaking score trends)
- **Ambassador portal** (referral tracking, assets, payouts)
- **Bulk student onboarding** (CSV/class code)

### Engineering Tasks
- Role-based accounts (teacher vs parent vs learner)
- Class roster + privacy-compliant child account workflow
- League scheduler + automated weekly reports
- Ambassador payout ledger + webhook integration

### KPI
- # active ambassador cohorts
- Students activated per ambassador/month
- Class retention (week-over-week active ratio)
- Revenue per institutional account

---

## 3.4 Creator Collaborations

### Strategy
- Partner with family-safe education creators and kid performers.
- Co-branded challenge packs (voice lines, custom avatars, creator cup tournaments).
- Affiliate payouts tied to retained learners, not only installs.

### Product Features Needed
- **Creator Event Pages** (countdown, rewards)
- **Creator skins/badges** (limited-time)
- **Affiliate tracking links + dashboards**
- Live leaderboard for creator campaigns

### Engineering Tasks
- Creator ID in attribution pipeline
- Feature flag system for creator-themed content drops
- Real-time leaderboard service
- Conversion API hooks for partner reporting

### KPI
- Creator campaign D1/D7 retention
- Cost per retained learner by creator
- Engagement minutes during creator events

---

## 3.5 SEO + ASO

### Strategy
- SEO content clusters around “kids speaking games”, “English speaking practice for kids”, curriculum-aligned topic pages.
- ASO: localized screenshots/videos, keyword A/B tests, review-generation flow.

### Product Features Needed
- **Web challenge previews** indexable by search engines
- **In-app review prompt logic** after positive moments (win streak/progress milestone)
- Localization-ready store asset pipeline

### Engineering Tasks
- SSR/SSG indexable pages for challenge/topic hubs
- Structured data markup + performance optimization (Core Web Vitals)
- Store experiment metadata management
- Event `review_prompt_shown`, `review_submitted`

### KPI
- Organic installs per geo
- App store conversion rate
- Ranking for priority keywords
- Review volume and average rating

---

## 3.6 Paid UA (Meta, Google UAC, TikTok Ads, YouTube)

### Strategy
- Start with broad + lookalike audiences, then shift budget by marginal CAC and retained cohort quality.
- Creative system: hooks by age/parent pain point + gameplay proof + social proof.
- Optimize to in-app quality events (not install-only).

### Product Features Needed
- **Event quality tiers** (first battle, 3 battles/week, subscription intent)
- **Paywall variants** tied to user progression stage
- **Onboarding branch tests** by acquisition source

### Engineering Tasks
- MMP/attribution SDK integration with SKAN + privacy-safe postbacks
- Server-side event forwarding to ad platforms (CAPI)
- LTV prediction model (early signal scoring)
- Budget automation rules consuming cohort metrics

### KPI
- CAC, CPI, CPR (cost per retained learner)
- D7/D30 ROAS
- Payback period
- LTV/CAC by geo and channel

---

## 4. Viral Mechanics Design (Built Into Product)

## 4.1 Core Viral Objects
1. **Challenge Cards** – “Can you beat my pronunciation score?” shareable in 1 tap.
2. **Streak Duels** – maintaining streak unlocks co-op rewards with friends.
3. **Team Seasons** – class/friend teams compete for seasonal badges.
4. **Remix Battles** – users respond to a shared prompt with own attempt (social chain).

## 4.2 Trigger Points
- After “Personal Best” score
- After battle win streak milestones (3/5/10)
- After avatar unlock
- Before seasonal deadline (“Invite 2 teammates to secure rank”)

## 4.3 Anti-Spam & Safety
- Invite frequency cap
- Child-safe sharing defaults (parent gate for external posting in younger cohorts)
- Abuse detection on repeated device/account invites

## 4.4 Engineering Requirements
- Share intent framework with contextual payload
- Reward throttling/rules engine
- Parent consent and age-based permission matrix
- Moderation workflow for UGC clips

---

## 5. Content Strategy Engine

## 5.1 Content Pillars
1. **Gameplay Proof:** real battle snippets + score improvements
2. **Learning Proof:** before/after pronunciation and fluency gains
3. **Social Fun:** friend/team rivalry clips
4. **Parent Trust:** safety, progress dashboard, teacher endorsements
5. **Cultural Relevance:** local holidays/trends/slang-safe prompts

## 5.2 Content Operating Model
- **Weekly cycle**
  - Mon: trend scouting + script generation
  - Tue-Wed: production
  - Thu-Fri: publishing + paid boost on winners
  - Sat-Sun: UGC remix contests

## 5.3 In-App ↔ Content Sync
- Every public content theme has matching in-app mission tag.
- Mission completion unlocks “share-ready” media assets.
- Top community posts are featured in-app (consent-gated).

## 5.4 Engineering Tasks
- CMS for campaign themes and mission tags
- Creator asset pack generator (captions, hooks, thumbnails)
- UGC ingestion pipeline + moderation queue
- In-app featured content widget

---

## 6. 90-Day Launch Calendar

## Phase 1 (Day 1–30): Foundation + Signal Capture
**Goals:** instrument funnel, validate message-market fit, launch first loops.

- Launch onboarding v1 with source-specific branches
- Ship referral hub v1
- Ship short-form challenge deep links
- Start always-on content (1–2 posts/day/channel)
- Run first 10 paid creatives across 3 hooks
- Recruit first 20 ambassadors (pilot schools/communities)

**Exit Criteria:**
- D1 retention >= 35%
- Invite acceptance >= 18%
- First battle completion >= 65% of installers

## Phase 2 (Day 31–60): Scale What Works
**Goals:** increase K-factor and lower CPR.

- Introduce team seasons + creator cup #1
- Expand paid budget to winning geos/creatives
- Launch ASO experiments in top 3 locales
- Roll out teacher dashboard beta
- Weekly creator collabs (micro creators)

**Exit Criteria:**
- K-factor >= 0.25
- D7 retention >= 18%
- CPR down 20% vs Phase 1 baseline

## Phase 3 (Day 61–90): Operationalize Growth Engine
**Goals:** predictable growth and repeatable playbook.

- Launch ambassador portal + payout automation
- Deploy LTV prediction for bid optimization
- Launch geo expansion pack (2 new markets)
- Creator cup #2 + seasonal mega event
- Publish SEO topic cluster (30+ pages)

**Exit Criteria:**
- WAL-3 growth >= 15% WoW sustained
- D30 retention >= 10%
- Payback <= 120 days in primary geo

---

## 7. Weekly Experiment System

## 7.1 Cadence
- Run 6–10 experiments/week across:
  - Acquisition creative
  - Onboarding flow
  - Referral incentives
  - Re-engagement messaging
  - Monetization offer timing

## 7.2 Experiment Template
- **Hypothesis**
- **Primary metric**
- **Guardrail metrics** (retention, child safety incidents, complaint rate)
- **Variant design**
- **Sample size / stop rule**
- **Decision owner / rollout plan**

## 7.3 Engineering Support
- Remote config / feature flag platform
- Experiment assignment service (stable bucketing)
- Metrics dashboard with p-value / Bayesian confidence
- Experiment registry to prevent overlap conflicts

---

## 8. Metric Tree (from North Star to Levers)

**North Star:** WAL-3

- **A. Acquisition volume**
  - Reach (impressions)
  - CTR
  - Install rate
- **B. Activation quality**
  - Onboarding completion
  - First battle completion
  - Time-to-first-win
- **C. Retention**
  - D1, D7, D30 retention
  - Weekly battle frequency
  - Streak continuation rate
- **D. Virality**
  - Invites/user
  - Invite acceptance
  - K-factor
- **E. Monetization**
  - Trial start / subscription conversion
  - ARPPU / ARPDAU
  - LTV

Guardrails:
- Safety reports per 1k users
- Parent NPS
- Crash-free sessions
- Moderation SLA

---

## 9. Attribution & Instrumentation Blueprint

## 9.1 Event Taxonomy (minimum)
- `app_install_attributed`
- `onboarding_started`, `onboarding_completed`
- `battle_started`, `battle_completed`
- `challenge_opened`, `challenge_completed`
- `invite_sent`, `invite_accepted`
- `team_joined`, `season_reward_claimed`
- `subscription_started`, `subscription_renewed`
- `share_card_generated`, `share_outbound`

## 9.2 Required Properties
- `user_id`, `device_id` (privacy-safe)
- `acq_channel`, `campaign_id`, `adset_id`, `creative_id`
- `geo`, `language`, `age_band`
- `experiment_id`, `variant_id`
- `referrer_user_id` / `ambassador_id` / `creator_id`

## 9.3 Data Stack Recommendations
- Client SDK + server events
- Warehouse-first model (daily cohort tables)
- Real-time dashboard for launch windows
- Privacy compliance layer (COPPA/GDPR-K safe event gating)

## 9.4 Engineering Tasks
- Data contract spec + schema versioning
- Event QA harness in CI
- Attribution reconciliation jobs (MMP vs internal)
- Alerting for tracking breaks

---

## 10. Creative Testing Framework

## 10.1 Creative Matrix
Test dimensions:
- Hook: (funny / challenge / parent outcome / social proof)
- Format: (UGC selfie / gameplay montage / testimonial / creator duet)
- CTA: (Play challenge now / Join team season / Beat my score)
- Persona: (parent / kid / teacher)
- Language/localization variant

## 10.2 Test Design Rules
- 3–5 variants per hypothesis
- Minimum spend threshold before kill
- Winners promoted in 3 steps: organic → low-budget paid → scale
- Re-test top concepts every 2–3 weeks for fatigue

## 10.3 Product Coupling
- Winning hooks become in-app home banners
- Winning CTA maps to onboarding first mission
- Winning creator persona gets in-app event slot

## 10.4 Engineering Tasks
- Creative metadata registry
- Auto-tagging creatives to experiments
- Fatigue detection model (declining CTR/CVR)
- “Creative to cohort” reporting view

---

## 11. Geo Expansion Strategy

## 11.1 Market Prioritization Framework
Score each geo by:
- English learning demand
- Mobile CPM/CPI economics
- Payment readiness
- Local creator ecosystem
- Regulatory complexity for minors

Priority wave suggestion:
1. **Wave 1:** Vietnam, Indonesia, Philippines
2. **Wave 2:** Thailand, Brazil, Mexico
3. **Wave 3:** MENA + selected EU markets

## 11.2 Localization Stack
- Language localization (UI + prompts + voice examples)
- Cultural localization (topics, holidays, characters)
- Educational alignment (CEFR/local curriculum mappings)
- Parent trust localization (safety and progress messaging)

## 11.3 Engineering Tasks
- i18n content pipeline with fallback logic
- Locale-specific prompt packs
- Geo-configurable mission calendars
- Regional compliance flags and consent flows

---

## 12. Localized Messaging Framework

## 12.1 Message Architecture
For each locale, map:
- **Problem statement** (what parent/kid struggles with)
- **Promise** (specific outcome)
- **Proof** (scores, testimonials, teacher endorsements)
- **Action** (join challenge/team)

## 12.2 Example Messaging Variants
- **Vietnam (parent):** “Mỗi ngày 15 phút, con tự tin nói tiếng Anh hơn qua đấu trường vui nhộn.”
- **Indonesia (parent):** “Latihan speaking 15 menit/hari, seru dan terukur hasilnya.”
- **Brazil (kid):** “Desafie seus amigos, suba no ranking e fale inglês com confiança.”

## 12.3 In-App Mapping
- Onboarding headline localized by persona + geo
- Push notification templates localized by event type
- Seasonal events tied to local calendars

---

## 13. Cross-Functional Operating Rhythm

**Weekly Growth Pod Meeting** (Product, Engineering, Content, UA, Data, Community):
- Review metric tree deltas
- Review experiment outcomes
- Decide top 3 bets for next sprint
- Confirm engineering dependencies and launch blockers

**Monthly Growth Review:**
- Channel mix rebalance
- Cohort LTV/CAC review
- Geo expansion readiness check
- Ambassador and creator program health

---

## 14. Execution Backlog (Prioritized Engineering Work)

## P0 (Immediate)
1. Attribution SDK + event taxonomy v1
2. Deep link + deferred deep link pipeline
3. Referral hub v1 + reward engine
4. Onboarding experiments framework
5. Basic growth dashboards

## P1 (30–60 days)
1. Team season + class league mode
2. Creator campaign infrastructure
3. UGC clip generation + moderation
4. ASO/SEO instrumentation and indexed web challenge pages

## P2 (60–90 days)
1. Ambassador portal + payout automation
2. LTV prediction and bid optimization integration
3. Geo localization pipeline + locale ops tools
4. Creative fatigue and budget reallocation automation

---

## 15. Definition of Success (First 90 Days)

- WAL-3 grows consistently (>=15% WoW by end of period)
- Organic + referral share reaches >=40% of new users
- D7 retention >=18%, D30 >=10%
- Paid channels achieve path to payback <=120 days in core market
- At least 2 institutional cohorts and 10+ creator partnerships producing retained learners

This plan ensures every growth bet is directly tied to product surfaces and engineering implementation, making marketing performance durable, compounding, and defensible.