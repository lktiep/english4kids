# 02 — Game Design & Gamification (Non‑Realtime First)

## 0) Product Goal (v1)

Build a **non-realtime competitive arena** for kids that creates:

- **Short sessions** (2–6 minutes)
- **Emotional competition** ("I almost won, rematch now!")
- **Safe motivation** (no shame, no toxic pressure)
- **Simple implementation** (low ops complexity, no live-sync dependency)

Core promise:

> “In a few minutes, I can challenge a friend, feel the thrill, learn English, and want one more round.”

---

## 1) v1 Design Principles (Hard Rules)

1. **Async by default**
   - No live websocket battle required for core loop.
   - Every mode must work with delayed turns/results.

2. **Session length guardrail**
   - One full play unit must finish in 2–6 minutes.
   - If a mode risks >6 minutes, split into checkpoints.

3. **Rematch in 1 tap**
   - Post-result screen always has one dominant CTA: **Rematch**.
   - Rematch setup must reuse same rules/content band when possible.

4. **Learning + emotion together**
   - Speed matters, but correctness and improvement matter more.
   - Every loss screen shows one positive metric + one next-step tip.

5. **Kid-safe frustration control**
   - No humiliating text, no public shaming, no hard punishments.
   - Comeback and retry opportunities are built-in.

---

## 2) v1 Mode Portfolio (Only 3 Modes)

We intentionally ship only these:

1. **Async Duels** (friend or matched rival)
2. **Survival Run** (solo score run with async leaderboard slices)
3. **Room Challenge** (private code room, asynchronous participation)

No live PvP, no team battle, no tournaments in v1.

---

## 3) Core Scoring System (Shared Across Modes)

For each question:

- Correct answer: **+100 base points**
- Speed bonus: **+0 to +40** (linear by response time window)
- Streak bonus: **+10 × streak**, cap at +50
- Hint used: **-20** (but never negative total per question)
- Wrong answer: **0** (no negative points in v1)

Round summary metrics:

- Total Score
- Accuracy %
- Avg response time
- Strongest skill tag (e.g., Vocabulary)

Why this works for kids:

- Wrong answers are not punished harshly.
- Fast and correct still feels exciting.
- Streak creates emotional tension without severe penalty.

---

## 4) Mode 1 — Async Duels

## 4.1 Match Format

- 1 duel = **8 questions** from same difficulty band.
- Player A plays first; Player B receives same question set (order shuffled minimally only if anti-cheat needed).
- Turn window: **24 hours** default.
- Result finalizes when both complete, or when timer expires.

## 4.2 Matchmaking (Simple v1)

- Inputs: grade band + hidden skill rating bucket.
- Target expected win chance band: **40–60%**.
- If no match in threshold, widen bucket gradually every 30s of queue simulation.
- Avoid same-opponent repetition >2 times/day unless both tap rematch.

## 4.3 Rematch Loop

Post-result options:

1. **Rematch Same Rules** (1 tap, best converting)
2. **Revenge with Easier Pack** (if lost by >20%)
3. **New Rival**

Rematch message to opponent is preset-safe only:

- “GG! Rematch?”
- “So close—again?”

## 4.4 UX Flow

1. Home → Tap **Async Duel**
2. Choose Friend or Auto Match
3. Play 8-question run (2–4 min)
4. End screen: “Waiting for opponent” + optional share card
5. Final result card when opponent finishes
6. One-tap rematch CTA

## 4.5 Anti-Frustration Rules

- If opponent times out: active player gets **Win by Completion** reward (reduced glory, full learning credit).
- If child loses 3 duels in a row:
  - show softer rival suggestions,
  - offer “Confidence Pack” (slightly easier content),
  - suppress aggressive rivalry copy.
- No rank-point loss in first 5 duels (onboarding protection).

## 4.6 KPI Targets (90-day targets)

- Duel completion rate: **≥75%**
- Opponent timeout rate: **≤20%**
- Rematch rate after completed duel: **≥35%**
- Post-loss next-match rate (within 10 min): **≥45%**

---

## 5) Mode 2 — Survival Run

## 5.1 Format

- Solo endless-style run with **3 hearts**.
- Wrong answer costs 1 heart.
- Correct streaks every 5 grant **+1 shield charge** (auto-block one heart loss), cap 2.
- Session hard stop at **5 minutes** in v1 (even if hearts remain).

## 5.2 Difficulty Curve

- Start in player comfort band.
- Every 3 correct answers: slight difficulty increase.
- After wrong answer: temporary ease-down for next 2 questions.

## 5.3 Emotional Competition Layer

- Compare score against:
  - Personal Best
  - Friend Ghost (async snapshot)
  - Daily Mini Leaderboard (small cohort, e.g., 20 players similar level)
- Result labels focus on progress:
  - “New personal best!”
  - “You passed Minh by 120 points!”

## 5.4 UX Flow

1. Home → Tap **Survival Run**
2. Instant start (no queue)
3. Live progress UI: hearts, streak, score, “next target”
4. Run ends by hearts=0 or 5-min cap
5. Result: PB delta + beat/close gap + retry button

## 5.5 Anti-Frustration Rules

- First mistake in first 30 seconds triggers one-time “Warm-up Mercy” (no heart loss).
- Near-miss feedback: “You were 2 questions from beating your best.”
- Retry always starts within 1 tap, no extra dialogs.

## 5.6 KPI Targets

- Survival starts per DAU: **≥1.8**
- 5-minute completion (or natural end) rate: **≥85%**
- Immediate retry rate: **≥30%**
- PB improvement rate weekly active users: **≥40%**

---

## 6) Mode 3 — Room Challenge (Async Private Group)

## 6.1 Format

- A user creates a room with code (e.g., 6 chars).
- Host sets:
  - Question count: 8 or 12
  - Topic focus (vocab/grammar/mixed)
  - Deadline: 2h / 24h / 48h
- Participants join and play asynchronously.
- Final standings revealed at deadline or when all finish.

## 6.2 Why This Mode Matters

- High social virality without realtime coordination.
- Works for classmates/friends/family in different schedules.
- Simple backend: one challenge config + many submissions.

## 6.3 UX Flow

1. Home → **Room Challenge**
2. Create Room or Join by Code
3. Share code/link (Telegram/Zalo/Copy)
4. Participants complete run
5. Final board + celebration badges + “Run It Back”

## 6.4 Ranking Rules (Simple)

- Primary: total score
- Tiebreak 1: higher accuracy
- Tiebreak 2: faster avg time

## 6.5 Anti-Frustration + Safety

- Default room visibility: private only.
- No text chat in room in v1 (preset reactions only).
- Show “Most Improved” badge, not only winner badge.
- For younger users, hide exact bottom rank; show “Keep going” tier grouping.

## 6.6 KPI Targets

- Room creation rate (DAU): **≥8%**
- Avg participants per room: **≥3.0**
- Room completion rate: **≥65%**
- % rooms generating at least one rematch room: **≥25%**

---

## 7) Viral Mechanics (Built for Kids + Parents + Friends)

## 7.1 Shareable Moments (Auto-generated cards)

Generate after each mode:

- “Narrow win by 50 points”
- “New personal best”
- “Beat your rival 3-2 this week”

Card structure:

- friendly avatar + score headline + CTA: “Can you beat me?”
- deep-link to duel/room

## 7.2 Invite Loops

- Duel result → “Invite for rematch”
- Survival PB → “Challenge 3 friends”
- Room finished → “Run same room again”

## 7.3 Safety Constraints for Virality

- No public global ranking in v1.
- No language that shames lower performers.
- Parent/teacher share mode available (progress-focused template).

KPI Targets:

- Share click-through rate: **≥12%**
- Invite-to-start conversion: **≥20%**
- K-factor from challenge flows: **0.15–0.25** early target

---

## 8) Retention & Habit Loops

## 8.1 Daily Structure (10–15 mins typical)

- 1 Async Duel
- 1 Survival Run
- 1 Room/Invite action (optional)

## 8.2 Daily Missions (simple and short)

Examples:

- Complete 1 duel
- Reach streak 5 in survival
- Join or create 1 room

## 8.3 Streak Policy (Kid-safe)

- Streak counts on any meaningful completion.
- 1 weekly grace day auto-applied.
- No dramatic reset animation on streak break.

KPI Targets:

- D1: **≥45%**
- D7: **≥20%**
- D30: **≥8%**
- Avg sessions/DAU: **≥2.5**

---

## 9) UX Standards (Exact Screen Requirements)

## 9.1 Home Screen

Must show only 3 primary buttons:

- Async Duel
- Survival Run
- Room Challenge

Plus:

- mission progress strip
- streak indicator
- inbox for results

## 9.2 In-Game HUD

Must always show:

- score
- question index/progress
- timer cue (soft, non-threatening)
- hint button (if allowed)

## 9.3 Result Screen

Order of elements:

1. Emotional headline (positive/neutral)
2. Score + accuracy + one growth insight
3. Rival/friend comparison
4. **Primary CTA: Rematch / Retry**
5. Secondary CTA: Share

---

## 10) Anti-Frustration Framework for Children

1. **No hard negative scoring** in v1.
2. **Beginner protection** for first 5 competitive matches.
3. **Adaptive easing** after repeated mistakes.
4. **Positive language templates only**.
5. **Session break nudges** after 4 consecutive matches.
6. **Comeback framing** (“You improved speed by 12%”).

Monitor risk signals:

- rapid exits after loss
- repeated 0-heart early failures
- long inactivity after defeat

If risk detected: auto-offer easier pack + low-pressure mode suggestion.

---

## 11) Telemetry & KPI Dashboard (v1 Minimum)

Track events:

- mode_start, mode_complete
- question_answered (correct/time/hint)
- result_viewed
- rematch_tap
- share_tap, invite_sent, invite_accepted
- timeout_win/loss

Core dashboard sections:

1. Engagement: sessions/DAU, mode mix
2. Competition health: close-match rate, rematch loops
3. Learning: accuracy trend by skill tag
4. Frustration: post-loss exits, failure streaks
5. Virality: invite funnel conversion

---

## 12) v1 Scope Control — Explicitly Avoid

Do **NOT** build these in v1:

1. Realtime synchronous PvP (live lockstep gameplay)
2. Team modes (2v2/3v3)
3. Large global leaderboards
4. Open text chat / voice chat
5. Complex economy (multiple currencies, gacha-like systems)
6. Tournament brackets with live rounds
7. Heavy cosmetic inventory systems
8. Advanced anti-cheat ML stack (start with rule-based checks)

Reason: these add ops/load/moderation complexity and slow learning loop validation.

---

## 13) Simple Implementation Plan (8–10 weeks)

## Phase A (Weeks 1–3): Foundations

- shared scoring service
- question pack service
- async match object + result inbox
- basic telemetry

## Phase B (Weeks 4–6): Three Modes Playable

- Async Duel complete loop
- Survival Run complete loop
- Room Challenge with code + deadline

## Phase C (Weeks 7–10): Polish + Growth Hooks

- rematch optimization
- share cards + deep links
- anti-frustration interventions
- KPI tuning experiments

Launch gate:

- Match/Run completion **≥80%** overall
- Rematch or retry action rate **≥30%**
- Post-loss abandonment reduced week-over-week

---

## 14) Final Doctrine

For this product stage, winning means:

- kids can play quickly,
- feel competitive emotion safely,
- re-enter instantly for “one more game,”
- and invite friends naturally.

**Keep v1 small, fast, and sticky.**
Complexity can come later; habit and emotional loop must come first.
