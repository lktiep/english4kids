# 02 — Game Design & Gamification (Duel-Only v1, Web-First)

## 0) Product Goal (v1)

Ship a **duel-only competitive loop** for kids on **web first** that is:

- **Fast:** one duel session in 2–4 minutes
- **Emotional:** close matches, comeback feeling, rematch tension
- **Safe:** anti-frustration by design (no shame, no toxic pressure)
- **Buildable:** realistic for team size and current stack/content

Core promise:

> “In a few minutes, I can challenge someone, feel the thrill, learn vocabulary, and tap rematch immediately.”

---

## 1) Scope Doctrine (Hard Rules)

### 1.1 What v1 includes (must ship)

1. **Async Duel only** (friend challenge + auto-match)
2. **Web-first implementation** (no iOS Arena in v1)
3. **Vocabulary-only question content** (auto-generated MCQ from existing data)
4. **Rematch loop + result inbox + share card**
5. **Kid-safe anti-frustration system**

### 1.2 What v1 explicitly excludes (defer to v1.1)

- Survival Run
- Room Challenge
- Realtime synchronous PvP
- Team modes, tournaments, public global leaderboard
- Open text chat/voice chat

### 1.3 v1.1 scope (after v1 validation)

- Survival Run (solo)
- Room Challenge (private code)

---

## 2) Why Duel-Only v1

Duel has the strongest core loop for earliest validation:

1. **Challenge -> Play -> Result -> Rematch** is naturally viral
2. Smaller scope than shipping 3 modes at once
3. Easier to instrument and improve quickly
4. Fits current content constraints (vocabulary-only bank)

Product principle:

> Validate one strong social-learning loop first, then expand mode portfolio.

---

## 3) v1 Core Loop (Exact)

1. User receives/creates duel
2. Plays **8-question async run**
3. Sees pending state until opponent completes or timeout
4. Receives result card (win/lose/draw + learning insights)
5. One dominant CTA: **Rematch**

Target session time:

- Per run: **2–4 minutes**
- Full emotional loop (including result/rematch tap): **<5 minutes**

---

## 4) Duel Format & Match Rules (Exact Mechanics)

## 4.1 Match object

- `duel_id`
- `created_by`
- `opponent_id` (or matched player)
- `difficulty_band` (starter/core/challenger)
- `question_set_id` (same for both players)
- `status`: waiting_opponent | active | complete | expired
- `expires_at` (default 24h)

## 4.2 Turn structure

- Each player completes **1 run of 8 questions**
- Same question set for fairness
- Minor choice-order shuffle per question allowed (anti-copying)
- No pause abuse: per-question timer always runs once shown

## 4.3 Scoring formula (v1 exact)

Per question:

- Correct: **+100**
- Speed bonus: **+0 to +40**
  - <=2s: +40
  - >2s to <=4s: +30
  - >4s to <=6s: +20
  - >6s to <=8s: +10
  - >8s: +0
- Streak bonus: **+10 × current streak**, cap +50
- Hint used: **-20** (floor per question = 0)
- Wrong: **0** (no negative score)

Duel total score:

`sum(question_score_1..8)`

Tiebreakers (in order):

1. Higher accuracy
2. Faster average response time
3. Earlier completion timestamp

## 4.4 Outcome states

- Win
- Loss
- Draw
- Win by completion (opponent timeout)

---

## 5) Matchmaking (Simple, Realistic v1)

Inputs:

- Grade band (or equivalent level bucket)
- Hidden skill rating bucket
- Recent opponent history

Rules:

1. Start with expected win probability band **40–60%**
2. If no match, widen band every 30s simulation step
3. Avoid repeating same opponent >2 times/day (unless both accept rematch)
4. New users (first 5 duels): beginner-protection pool priority

---

## 6) Content Generation Constraints (Vocabulary-Only Reality)

## 6.1 Current constraint baseline

v1 content is limited to existing vocabulary dataset:

- ~18 topics × ~8 words (~144 vocabulary items)
- Available signal: word + meaning mapping
- Not reliably available in v1: grammar/listening/pronunciation assets

Therefore:

- **Only vocabulary MCQ** in v1 duels
- No grammar/listening/pronunciation duel packs in v1

## 6.2 Question template policy (v1)

Primary template types:

1. **Word -> Meaning MCQ**
2. **Meaning -> Word MCQ**

MCQ generation rules:

- 1 correct + 3 distractors
- Distractors prioritized from same topic and similar difficulty
- Avoid duplicate distractors within one duel
- Avoid repeating same lemma more than once per duel

## 6.3 Fairness & repetition control

Because bank is limited, enforce:

1. No immediate repeat of same question in consecutive duels for same player
2. Daily cap per item exposure (to reduce memorization-only exploitation)
3. Question-set rotation by topic clusters
4. Optional lightweight seeded generation with stable `question_set_id`

## 6.4 Difficulty banding under limited data

Use operational bands (not deep pedagogy yet):

- **Starter:** high-frequency familiar words
- **Core:** mixed frequency/common school vocabulary
- **Challenger:** lower-frequency or confusable words

Band assignment can be heuristic in v1, refined by telemetry in v1.x.

---

## 7) Anti-Frustration System (Kid-Safe by Design)

## 7.1 Non-negotiable safeguards

1. No negative total scoring for wrong answers
2. No humiliating copy, no public shaming
3. Loss screen must include one positive signal + one next-step suggestion
4. First 5 duels: no rank-point loss framing

## 7.2 Dynamic frustration controls

If user loses **3 duels in a row**:

- Offer “Easier Rematch Pack”
- Soften rivalry copy tone
- Prefer matchmaking vs similarly struggling peers

If user exits early after losses (rage-risk):

- Trigger low-pressure nudge: “Try a shorter confidence duel?”
- Offer one-tap retry with easier difficulty band

If opponent timeout occurs:

- Award **Win by Completion**
- Give reduced glory messaging, full learning credit

## 7.3 UX language constraints

Allowed tone examples:

- “So close — you improved speed by 12%.”
- “Nice effort. Want a confidence rematch?”

Disallowed tone examples:

- “You got crushed.”
- “Lowest rank.”

---

## 8) UX Requirements (Web v1)

## 8.1 Home entry points

Primary CTA:

- **Start Duel**

Secondary:

- Inbox (results/pending)
- Missions strip (duel-focused)

## 8.2 In-duel HUD (must show)

- Score
- Question progress (e.g., 3/8)
- Soft timer cue
- Hint button (if enabled)

## 8.3 Result screen order

1. Emotional headline (positive/neutral)
2. Score + accuracy + avg response time
3. One growth insight (e.g., strongest topic)
4. Rival comparison
5. **Primary CTA: Rematch**
6. Secondary CTA: Share

## 8.4 Rematch UX requirement

- One-tap rematch with same rules/content band whenever possible
- No multi-step setup unless user explicitly changes settings

---

## 9) Telemetry & KPI (v1 Minimum)

Track events:

- duel_created
- duel_started
- question_answered (correct/time/hint/template_type)
- duel_completed
- duel_expired
- result_viewed
- rematch_tapped
- share_tapped / invite_sent / invite_accepted
- frustration_intervention_triggered

KPI targets (first 90 days post launch):

1. Duel completion rate: **>=75%**
2. Opponent timeout rate: **<=20%**
3. Rematch rate after completed duel: **>=35%**
4. Post-loss next-duel rate (within 10 min): **>=45%**
5. 3-loss-streak recovery rate (plays again within same day): **>=50%**

---

## 10) Daily Habit Layer (Duel-Only v1)

Simple mission set:

- Complete 1 duel
- Play 2 duels
- Send 1 challenge

Streak policy:

- Any completed duel counts toward daily streak
- 1 weekly grace day auto-applied
- No dramatic streak-break punishment visuals

---

## 11) Implementation Timeline (Realistic 14–16 Weeks)

Assumption: team size 1–2, existing Supabase + web stack.

## Phase 0 (Week 1): Product/Tech Spec Lock

- Finalize duel rules, scoring, event schema
- Freeze v1 scope (duel-only)
- Define content-generation constraints from current vocabulary data

Deliverable: signed-off spec + event contract

## Phase 1 (Weeks 2–4): Foundation

- DB schema for duel, question_set, attempt, result inbox
- Async duel lifecycle APIs
- Basic matchmaking service (bucket-based)

Deliverable: end-to-end duel lifecycle works in dev

## Phase 2 (Weeks 5–7): Content Pipeline + Scoring

- MCQ auto-generation from vocabulary dataset
- Distractor selection logic + repetition guards
- Scoring engine + tie-break implementation

Deliverable: stable 8-question duel packs from real data

## Phase 3 (Weeks 8–10): Web Gameplay UX

- Duel play screen (HUD, timer cue, hints)
- Result screen (insights + rematch-first)
- Inbox/pending states + timeout resolution UX

Deliverable: playable closed alpha on web

## Phase 4 (Weeks 11–12): Anti-Frustration + Share Loop

- Loss-streak interventions
- Confidence rematch path
- Share card + challenge deep-link flow

Deliverable: emotional loop + safety loop complete

## Phase 5 (Weeks 13–14): Telemetry, Tuning, Internal Beta

- Full event tracking dashboard
- KPI instrumentation verification
- Matchmaking and copy tuning via small cohort

Deliverable: launch candidate if gates pass

## Buffer / Hardening (Weeks 15–16, if needed)

- Bug fixing + performance hardening
- Final UX polish
- Rollout controls and fallback plans

Deliverable: production-ready v1 with lower launch risk

---

## 12) Launch Gates (Go/No-Go)

Before public v1 launch, require:

1. Duel technical completion >=80% in beta
2. Critical bug rate below agreed threshold
3. Rematch tap rate >=25% in controlled cohort
4. No severe kid-safety copy violations in review set
5. Timeout and result-inbox flows stable under load test

If gates fail:

- Do not expand scope
- Fix core duel loop first

---

## 13) v1.1 Expansion Plan (Deferred Modes)

Only after duel loop is validated:

1. Add **Survival Run** (solo progression loop)
2. Add **Room Challenge** (private async group)

Entry criteria for v1.1:

- Duel completion and rematch KPIs stable for 4+ weeks
- Content pipeline proven sustainable
- Team capacity available without degrading duel quality

---

## 14) Final Doctrine

For this stage, success is not “many modes.”
Success is one reliable, exciting, safe loop:

**Challenge -> Duel -> Result -> Rematch**

Ship duel-only v1 on web, validate behavior, then scale to Survival/Room in v1.1.
