# 02 — Game Design & Gamification Masterplan

## 0) Design North Star

Build a **high-retention competitive learning arena** where kids repeatedly return because matches feel:
- **Kịch tính** (tense, dramatic, meaningful)
- **Cay cú** (motivating “I want a rematch” energy)
- **Safe and constructive** (no humiliation, no toxic pressure)

Core product promise:
> “Every session is a short, exciting duel that improves English ability, rewards effort + growth, and makes players want one more game.”

---

## 1) Product Pillars (Non-Negotiables)

1. **Skill First, Spectacle Second**
   - Competition exists to improve learning outcomes, not distract from them.
   - Accuracy + reasoning quality always outweigh pure speed spam.

2. **Short Sessions, Fast Emotion Curve**
   - 3–8 minute core sessions for kids’ attention span and routine habit loops.
   - Every match has clear opening, tension, climax, closure.

3. **Fairness = Retention**
   - Matchmaking quality, anti-smurfing, anti-grind exploitation are foundational.
   - Players should feel “I lost because I can improve,” not “the system is rigged.”

4. **Protective Competition**
   - No direct harassment channels.
   - Positive social mechanics by default; emotional safety guardrails always on.

5. **Measurable Gamification**
   - Every mechanic maps to measurable KPIs and experiment hooks.

---

## 2) Core Player Segments

- **Challengers**: motivated by rank, rivalry, status.
- **Collectors**: motivated by progression, cosmetics, completion.
- **Social Learners**: motivated by friends/class/team identity.
- **Routine Builders**: motivated by streaks, daily goals, consistency.

Design objective: each session should satisfy at least 2 segment motives simultaneously.

---

## 3) Core Game Loops

## 3.1 Moment-to-Moment Loop (30–90s cycles inside a match)
1. Receive question (adaptive difficulty target band)
2. Decide quickly (confidence + speed pressure)
3. Get immediate feedback (correctness, explanation bite, points impact)
4. See relative state (lead/trail delta, momentum cue)
5. Re-engage next question

**KPI hooks**
- Question answer rate
- Time-to-answer median
- Hint usage rate
- Accuracy by difficulty band
- Rage-quit incidence mid-round

## 3.2 Session Loop (3–8 min)
1. Queue / join lobby
2. Play match
3. Resolve rewards (MMR, XP, quest progress, currency)
4. Post-match reflection (1 learning insight + rematch CTA)
5. Requeue / claim / social share

**KPI hooks**
- Sessions per DAU
- Requeue rate within 60s
- Match completion rate
- Post-match “one more game” conversion

## 3.3 Daily Loop
1. Login + streak check
2. Daily mission stack
3. Core competitive play (2–6 matches)
4. Claim chest / pass progress
5. Optional social/team contribution

**KPI hooks**
- D1/D7/D30 retention
- Daily mission completion rate
- Streak save purchase/usage rate

## 3.4 Seasonal Loop (4–8 weeks)
1. Placement / recalibration
2. Rank climb + event ladders
3. Tournament windows
4. Seasonal rewards + prestige reset
5. Narrative kickoff for next season

**KPI hooks**
- Season participation rate
- Mid-season churn
- End-of-season return spike
- % active players completing at least 1 ranked tier climb

---

## 4) Session Design Blueprint (Excitement Without Harm)

## 4.1 Match Arc Template
- **Opening (10–20s):** matchup intro, mode objective, confidence warm-up
- **Build (60–180s):** alternating pressure + comeback opportunities
- **Climax (last 20–40s):** amplified stakes (final-round multiplier or objective lock)
- **Closure (20–30s):** result + growth feedback + rematch option

## 4.2 Emotional Safety Rules
- Never show humiliating text (e.g., “you are bad”).
- Loss screen always includes:
  - one concrete improvement tip
  - one positive metric (“Accuracy improved +8% vs last week”).
- Rematch prompts capped to avoid compulsive loops for minors.
- Session break nudges after prolonged play (“Great effort—time for a short break”).

**KPI hooks**
- Loss-to-next-match recovery rate
- Negative sentiment signal rate
- Average consecutive matches before fatigue exit

---

## 5) Game Modes Portfolio

## 5.1 1v1 Live Duel (Primary Skill Mode)
**Structure**
- 8–12 questions, synchronized rounds.
- Scoring: correctness base + speed bonus (capped) + streak multiplier.

**Design intent**
- Highest clarity of skill expression.
- Strongest source of “cay cú” rematch tension.

**KPIs**
- Queue time p50/p95
- Win-rate fairness by MMR delta
- Rematch acceptance rate
- Skill gain velocity after 10 matches

## 5.2 Team Battle (2v2 / 3v3)
**Structure**
- Individual answer phases + team objective rounds.
- Shared team meter rewards consistency over one carry player.

**Design intent**
- Social stickiness, classroom/friend engagement.

**KPIs**
- Team mode weekly participation
- Invite-to-match conversion
- Team churn vs solo churn differential

## 5.3 Async Challenge (Ghost / Time-shifted)
**Structure**
- Play against friend’s recorded performance profile.
- Turn windows (e.g., 24h) with gentle reminders.

**Design intent**
- Works across schedule mismatch, reduces queue dependency.

**KPIs**
- Challenge send/accept ratio
- Completion within window
- Async users converting to live matches

## 5.4 Tournaments (Bracket + Swiss Light)
**Structure**
- Age/skill-gated weekend windows.
- Short brackets for completion confidence.
- Consolation path so one loss ≠ event over.

**Design intent**
- Peak excitement moments + prestige rewards.

**KPIs**
- Registration to participation rate
- Tournament completion rate
- Return rate next tournament cycle

## 5.5 Classroom Leagues
**Structure**
- Teacher-created or system-generated leagues.
- Team points combine participation + learning improvement.
- Weekly “fair play” awards, not just top score.

**Design intent**
- Institutional retention, social accountability, educational alignment.

**KPIs**
- Class activation rate
- Weekly class participation breadth (% students active)
- Teacher NPS / satisfaction

---

## 6) Matchmaking, MMR, and League Systems

## 6.1 Rating Model
Use hidden rating tuple per player:
- **Mu (skill estimate)**
- **Sigma (uncertainty/confidence)**
- **Behavior score modifier (sportsmanship/reliability)**
- **Domain skill vectors** (vocab, grammar, reading speed, listening)

Suggested base: Glicko/TrueSkill-inspired update with per-question signal weighting.

## 6.2 Matchmaking Rules
- Primary constraint: expected win probability band (40–60% ideal).
- Secondary constraints: latency, queue time ceiling, age safety band.
- Dynamic expansion after threshold wait to protect queue health.
- Avoid repeat-opponent loops unless explicit rematch accepted.

## 6.3 League Structure (Visible Status Layer)
- Leagues: Bronze → Silver → Gold → Platinum → Diamond → Master.
- Sub-divisions with stars/points.
- Promotion series lightweight; demotion protection buffer for kids.

## 6.4 Placement & Recalibration
- New players: 5–10 placement matches with high sigma decay.
- Seasonal soft reset (not hard reset) to preserve identity.

**MMR/League KPIs**
- Match quality index (predicted vs actual closeness)
- Smurf detection precision/recall
- Rating inflation stability
- Queue abandonment rate due to long waits
- Per-league retention

---

## 7) Progression Systems

## 7.1 Meta Progression
- Player level (XP)
- Mastery tracks per English domain
- Badge milestones (accuracy, consistency, comeback, teamwork)

## 7.2 Seasonal Progression
- Battle pass style track (free + premium optional)
- Non-pay-to-win rewards only (cosmetics, profile flair, emotes, themes)

## 7.3 Prestige & Legacy
- Seasonal legacy cards (highest rank, signature achievement)
- Archive history for identity continuity

**Progression KPIs**
- XP earned per session
- Level-up frequency health band
- Pass completion distribution
- Reward claim rate

---

## 8) Quests, Streaks, and Habit Mechanics

## 8.1 Quest Stack
- **Daily quests:** quick, mode-diverse, achievable in 10–20 min.
- **Weekly quests:** encourage breadth (solo + team + async).
- **Skill quests:** target weak domains with adaptive tasks.

## 8.2 Streak Design
- Streak counted on meaningful activity (completed match or lesson objective).
- Grace mechanics:
  - 1 free weekly miss buffer
  - earnable streak shields
- Avoid harsh streak loss trauma for children.

## 8.3 FOMO Boundaries
- No predatory expiry pressure timers for minors.
- Missed rewards can partially roll into “recovery missions.”

**Quest/Streak KPIs**
- Daily quest completion rate
- Streak length median / p90
- Streak break recovery rate
- Burnout indicators after long streaks

---

## 9) Social Mechanics (Healthy Rivalry)

## 9.1 Positive Social Layer
- Friend list + safe preset interactions (GG, Nice comeback, Let’s rematch).
- Clubs/teams with shared goals.
- “Study buddy” bonuses for co-play consistency.

## 9.2 Rivalry System
- Opt-in rivals (max capped count).
- Rival boards emphasize recent head-to-head and improvement, not insults.

## 9.3 Spectator/Share Moments
- Auto-highlight clips/cards: clutch win, perfect round, comeback.
- Shareable in closed classroom/community channels.

**Social KPIs**
- Friend invite acceptance
- Social session ratio
- Rival rematch frequency
- Toxic interaction report rate

---

## 10) Toxicity Controls & Child Safety

## 10.1 Communication Controls
- No free-text chat by default for minors.
- Safe phrase wheel + moderated sticker/emote set.
- Contextual chat gating for age/compliance zones.

## 10.2 Behavior Moderation
- Auto-detect grief patterns: stalling, intentional throw, quit abuse.
- Behavior score impacts matchmaking priority and rewards multipliers.
- Escalation ladder: warning → temporary restrictions → supervised queue.

## 10.3 Emotional Safety UX
- Ban public shaming leaderboards at micro-cohort scale.
- Use “personal best” framing and fair-play honors.
- Cooldown suggestions after repeated losses.

**Safety KPIs**
- Reports per 1,000 matches
- Verified toxicity incidence
- Repeat offender rate
- Parent/teacher trust score

---

## 11) Balancing Framework

## 11.1 Balance Axes
- Accuracy vs speed weighting
- Comeback potential vs deserved lead protection
- Difficulty variance vs fairness
- Reward intensity vs economy inflation

## 11.2 Patch Cadence
- Weekly micro-tuning (scoring weights, item values, pool distribution)
- Seasonal macro-balance (mode rules, rank thresholds)

## 11.3 Experimentation
- A/B test framework per mechanic with guardrail metrics:
  - learning outcome
  - retention
  - toxicity
  - monetization neutrality for fairness

**Balancing KPIs**
- Mode pick-rate parity
- Win-rate skew by archetype/segment
- Comeback win % (target band)
- Volatility of match outcomes

---

## 12) Question Content Pipeline (Quality + Velocity)

## 12.1 Content Sources
- Curriculum-aligned base banks
- Teacher-authored submissions
- AI-assisted draft generation (human-reviewed)

## 12.2 Lifecycle Stages
1. Draft
2. Pedagogical review
3. Bias/cultural safety review
4. Difficulty calibration pilot
5. Live deployment (limited)
6. Performance monitoring
7. Refresh/retire

## 12.3 Metadata Schema (Mandatory)
- Skill domain
- CEFR/grade alignment
- Difficulty estimate + confidence
- Language context tags
- Typical error patterns
- Content safety flags

## 12.4 Live Quality Monitoring
- Item discrimination index
- Time-to-answer distribution
- Guessability signals
- Miskey report rate

**Content KPIs**
- % catalog with full metadata coverage
- Question defect escape rate
- Calibration drift over time
- Authoring throughput per week

---

## 13) Adaptive Difficulty Engine

## 13.1 Real-Time Targeting
For each player/session, maintain target success band (e.g., 60–75%).
- If too easy: escalate complexity type, not only speed.
- If too hard: scaffold with hints/near-level backoff.

## 13.2 Multi-Dimensional Adaptation
Adapt by:
- linguistic difficulty
- distractor quality
- time pressure
- concept novelty

## 13.3 Competitive Fairness Constraint
In direct PvP, adaptation must preserve fairness:
- symmetric expected challenge
- transparent scoring normalization if difficulty differs

**Adaptive KPIs**
- Target-band adherence rate
- Frustration proxy (rapid errors + exits)
- Learning gain delta vs non-adaptive baseline

---

## 14) Anti-Grind & Anti-Abuse Controls

## 14.1 Abuse Patterns to Prevent
- Win-trading
- Smurf boosting
- Bot/automation answering
- Intentional low-performance farming easier lobbies
- Reward farming via collusive rematches

## 14.2 Control Mechanisms
- Diminishing rewards on repetitive opponent loops
- Suspicious pattern detection (timing entropy, answer signature anomalies)
- Ranked eligibility gates (minimum verified activity quality)
- Reward caps with skill-based unlock paths (not pure volume)

## 14.3 Child-Friendly Enforcement
- First response is educational warning and explainability.
- Avoid overly punitive systems that create fear.

**Anti-abuse KPIs**
- Fraud/abuse detection precision
- False positive rate
- Economy leakage from abuse
- Post-warning behavior correction rate

---

## 15) Economy Touchpoints (Non-P2W, Learning-Aligned)

## 15.1 Currencies
- **Soft currency:** earned via play/quests; spend on cosmetics, profile customizations.
- **Event tokens:** seasonal, mode-specific rewards.
- **Premium currency (optional):** cosmetic acceleration only.

## 15.2 Sinks
- Cosmetic shop (avatars, trails, arena themes)
- Limited-time thematic collections
- Clan/classroom banner upgrades

## 15.3 Faucets
- Match completion
- Quest milestones
- Seasonal placements
- Fair-play bonuses

## 15.4 Guardrails
- No purchasable power affecting ranked outcomes.
- Transparent odds for any random reward.
- Spend controls and parental governance options.

**Economy KPIs**
- Currency inflation/deflation index
- Sink participation rate
- Cosmetic attach rate
- ARPDAU (if monetized) with fairness guardrail checks

---

## 16) UX Principles for “Kịch Tính / Cay Cú” (Without Harm)

1. **Readable stakes**
   - Always show what matters now: score gap, remaining rounds, comeback paths.

2. **Controlled intensity**
   - Audio/visual tension ramps near climax, but never overwhelming for children.

3. **Near-miss motivation, not shame**
   - Highlight “you were close” with specific next-step guidance.

4. **Fast recovery loops**
   - Instant queue + optional low-stress mode after tough loss.

5. **Celebrate improvement moments**
   - Personal best overlays, mastery breakthroughs, consistency wins.

6. **Clarity beats complexity**
   - One primary CTA on result screen: rematch / continue progression.

**UX KPIs**
- Post-loss next action rate
- Time-to-requeue
- UI confusion signals (misclick, backtrack, abandonment)
- Subjective excitement vs stress score (survey pulse)

---

## 17) KPI Framework by Lifecycle Layer

## 17.1 Acquisition-to-Activation
- Tutorial completion rate
- First ranked/first duel start rate
- First-day match completion

## 17.2 Engagement
- DAU/WAU
- Sessions per DAU
- Avg matches per session
- Mode diversity index

## 17.3 Retention
- D1, D7, D14, D30
- Comeback rate after 3-loss streak
- Streak continuity (healthy band)

## 17.4 Learning Outcomes
- Accuracy improvement per domain
- Error type reduction over time
- Transfer performance on new question sets

## 17.5 Social Health & Safety
- Toxicity report rate
- Fair-play commendation rate
- Parent/teacher trust and satisfaction

## 17.6 Economy Health
- Faucet/sink balance
- Cosmetic conversion
- Non-P2W compliance incidents (target: 0)

---

## 18) Implementation Roadmap (Suggested)

## Phase 1 — Competitive Core (6–8 weeks)
- 1v1 live duel
- Baseline MMR + matchmaking
- Daily quests + simple streaks
- Basic toxicity controls

Success gate:
- Match completion > 85%
- Requeue rate > 35%
- Report rate below safety threshold

## Phase 2 — Social Retention Layer (6–10 weeks)
- Team battles
- Async challenges
- Clubs/friends + preset interactions
- Expanded progression and pass

Success gate:
- Social session share > 25%
- D7 retention uplift vs Phase 1 cohort

## Phase 3 — Prestige & Institutional Scale (8–12 weeks)
- Tournaments
- Classroom leagues + teacher tooling
- Anti-abuse advanced detection
- Seasonal prestige systems

Success gate:
- Tournament repeat participation > 40%
- Classroom weekly active breadth target met

---

## 19) Governance & Operating Rhythm

- Weekly: balance + safety + economy review
- Bi-weekly: content quality council
- Monthly: retention deep-dive and segmentation
- Seasonal: full reset/reward/postmortem cycle

Dashboards must be segmented by:
- Age band
- Skill tier
- Mode
- Region/language
- New vs returning cohorts

---

## 20) Final Design Doctrine

A great competitive learning arena for kids is not “maximum pressure.”
It is **maximum meaningful excitement with psychological safety**.

If players feel:
- “I can improve,”
- “I want one more match,”
- “I feel proud, not scared,”

…then retention, learning, and long-term trust will compound together.
