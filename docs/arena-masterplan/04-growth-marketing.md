# 04) Growth & Marketing Masterplan — Async Turn-Based v1

## 0) Scope Lock (Must Match Built Product)

This growth plan is constrained to **async turn-based v1** and only uses in-app features already defined in the current masterplan docs.

### In-scope product surfaces (used by marketing)

- **Async Challenge (Ghost / Time-shifted)** with ~24h turn window
- **1v1 duel results + rematch CTA**
- **Friend list + safe preset interactions** (e.g., “GG”, “Let’s rematch”)
- **Social share from session/result flow**
- **Daily quests + streak system** (with streak protection)
- **Teams / clubs / classroom identity mechanics**
- **Seasonal and class/friends leaderboards**
- **Profile progression** (XP, levels, badges/mastery signals)

### Out-of-scope for v1 growth (do not depend on)

- UGC video clip generator
- Public creator portals/affiliate dashboards
- Ambassador payout automation
- Advanced deep-link campaign infrastructure not already shipped
- New teacher admin products not already in v1

If a tactic requires anything above, it is excluded from this plan.

---

## 1) North Star and Metric Tree

### North Star

- **WAL-3A** = Weekly Active Learners with **3+ completed async challenges**

Why: directly measures repeat learning behavior in async mode.

### Primary growth stack

1. **Acquisition:** qualified new learners entering first async challenge
2. **Activation:** first challenge sent + first challenge completed
3. **Retention:** return to complete 3+ async challenges/week
4. **Social growth:** challenge-send loops, friend acceptance, class participation

### Core KPIs

- Install/visit → signup
- Signup → first async challenge created
- Challenge created → challenge accepted
- Challenge accepted → challenge completed within 24h
- D1 / D7 retention (async cohort)
- Invites sent per active user
- Invite acceptance rate
- % new users from friend/class invites
- WAL-3A growth WoW

---

## 2) Positioning for Async Turn-Based v1

### Parent-led (5–10)

“10–15 phút/ngày, con luyện nói tiếng Anh đều đặn qua thử thách ngắn và an toàn.”

### Self-driven kids (9–14)

“Thử thách bạn bè mọi lúc, không cần online cùng lúc, vẫn leo bảng xếp hạng.”

### Teacher/community organizer

“Chạy mini speaking challenge theo lớp/nhóm, theo dõi mức độ tham gia hàng tuần.”

### Messaging pillars

1. **No schedule friction:** play anytime, reply within 24h
2. **Safe social competition:** friend-first, preset interactions
3. **Visible progress:** streak, badges, leaderboard movement
4. **Short daily habit:** easy to repeat, easy to share

---

## 3) Growth Loops (Feature-Coupled)

## 3.1 Core Referral Loop (Friend Challenge Loop)

**Trigger:** learner finishes async challenge.

**In-app path:** Result screen → Rematch / Send new challenge → Friend accepts → completes → sends back.

**Loop KPI:**

- challenge_send_rate
- challenge_accept_rate
- completion_within_24h_rate
- avg_challenges_per_active_user

**Owner:** Product Growth + CRM/Community

---

## 3.2 Streak Loop (Daily Habit Loop)

**Trigger:** daily quest reset + streak visibility.

**In-app path:** Open app → see streak/day quest → complete 1 async challenge → maintain streak → return next day.

**Loop KPI:**

- daily_quest_completion_rate
- streak_day_2_to_day_7 conversion
- streak_break_rate

**Owner:** Product Growth

---

## 3.3 Class/Community Loop (Closed Group Competition)

**Trigger:** weekly class/community leaderboard check-in.

**In-app path:** Learner joins class/team context → completes async challenges during week → appears on class/friends board → peers respond.

**Loop KPI:**

- class_activation_count
- % active learners in class each week
- weekly challenges per learner in class cohorts

**Owner:** School Partnerships + Community Ops

---

## 3.4 Content-to-Play Loop (No New Tech Dependency)

**Trigger:** short-form post with clear “copy challenge code / search challenge name in app” CTA.

**In-app path:** User sees content → opens app manually → starts named challenge flow → sends to friend.

**Loop KPI:**

- content-coded installs/signups (campaign code)
- first_challenge_from_campaign_code

**Owner:** Content Lead + Growth Analyst

---

## 4) 30-Day Launch Plan (Execution-Ready)

## Week 1 (Day 1–7): Instrument + Message Fit

### Actions

1. Finalize async growth event tracking in dashboards:
   - `async_challenge_created`
   - `async_challenge_sent`
   - `async_challenge_accepted`
   - `async_challenge_completed`
   - `friend_invite_sent`
   - `friend_invite_accepted`
   - `daily_quest_completed`
   - `streak_continued`
2. Ship/verify 3 in-app growth prompts only where already available:
   - Post-result rematch/send challenge prompt
   - Daily quest reminder surface
   - Streak continuity nudge
3. Run messaging test set A/B (parent vs kid framing) in owned channels.

### Owners

- Product Growth (tracking + in-app prompt QA)
- Data (dashboard + baseline cohorts)
- Content (message variants)

### Cadence

- Daily standup (15 min)
- KPI check Mon/Wed/Fri
- Weekly decision review (Friday)

### Week 1 success thresholds

- Tracking completeness >= 95%
- Signup → first async challenge >= 45%
- Async completion within 24h >= 55%

---

## Week 2 (Day 8–14): Launch Referral and Friend Loops

### Actions

1. Push “Challenge a friend today” campaign in-app/community channels.
2. Run 2 referral scripts per segment (parent-led / kid-led).
3. Launch “3 challenges in 3 days” streak push.
4. Activate safe preset social prompts in community instructions (GG/rematch etiquette).

### Owners

- CRM/Community (execution)
- Product Growth (in-app placement timing)
- Data (invite funnel reporting)

### Cadence

- Daily reporting in shared growth channel
- Mid-week creative refresh

### Week 2 success thresholds

- Invites per WAU >= 0.8
- Invite acceptance >= 20%
- Day-7 retention lift +3 pts vs Week 1 cohort

---

## Week 3 (Day 15–21): School/Community Activation Sprint

### Actions

1. Onboard first partner cohorts (teachers, clubs, parent groups) using existing class/team + leaderboard mechanics.
2. Run “Weekly Class Async Ladder” pilot (no new tooling):
   - Monday kickoff
   - Wednesday reminder
   - Friday leaderboard snapshot + recognition
3. Distribute facilitator playbook and posting templates.

### Owners

- School Partnerships (teacher/community ops)
- Community Manager (facilitator support)
- Data (class cohort health)

### Cadence

- 2 check-ins/week per active cohort
- Friday cohort summary

### Week 3 success thresholds

- > = 5 active cohorts
- > = 60% learner participation within active cohorts
- cohort D7 >= non-cohort D7 +5 pts

---

## Week 4 (Day 22–30): Optimize + Standardize

### Actions

1. Identify top-performing loop by cohort (friend vs streak vs class).
2. Standardize winner playbook for next 60 days:
   - Best CTA copy
   - Best reminder timing
   - Best class cadence
3. Cut low-performing content and focus on 2 highest-converting templates.
4. Publish v1 growth ops SOP.

### Owners

- Growth Lead (prioritization)
- Data Analyst (cohort diagnosis)
- Content Lead (template consolidation)

### Cadence

- Daily KPI pulse
- End-of-month growth retro

### Day-30 target outcomes

- WAL-3A baseline established and rising
- Invite acceptance >= 25%
- Async completion within 24h >= 65%
- D7 retention >= 18% (async cohorts)

---

## 5) 60-Day Growth Plan (Day 31–90)

## Phase A (Day 31–60): Scale Repeatable Loops

### Strategic goal

Scale proven loops without adding new product dependencies.

### Actions

1. **Referral scale:**
   - Weekly friend challenge themes (e.g., Travel Week, Animal Week)
   - Segment-specific invite copy by age/persona
2. **Streak scale:**
   - Habit campaigns around 3-day and 7-day streak milestones
   - Recovery messaging for near-break cohorts
3. **Class/community scale:**
   - Expand to 15–20 active cohorts
   - Fixed weekly cadence kit for facilitators
4. **Leaderboard moments:**
   - Weekly “rank jump” recognition posts using existing board outcomes
5. **Content scale:**
   - 3 short posts/week per core segment driving manual app challenge entry

### Owners

- Growth Lead: channel mix + weekly priorities
- Partnerships Lead: cohort expansion
- Content Lead: creative pipeline
- Data Lead: weekly model + scorecards

### Cadence

- Weekly growth pod meeting (Mon)
- Mid-week metric checkpoint (Wed)
- Friday performance + next-week lock

### Day-60 target outcomes

- WAL-3A +30–40% from Day-30 baseline
- % new users from invites/classes >= 35%
- D7 retention >= 20%
- 24h challenge completion >= 70%

---

## Phase B (Day 61–90): Efficiency + Defensibility

### Strategic goal

Improve conversion efficiency and lock in community-led growth behavior.

### Actions

1. Double down on highest LTV cohorts (class + high-streak households).
2. Run win-back campaigns for inactive async challengers (7-day inactivity cohort).
3. Create monthly inter-class/community async cup using existing leaderboard surfaces.
4. Formalize facilitator certification-light program (content + cadence + reporting), no new portal required.
5. Build geo/language message packs from top-performing templates.

### Owners

- Growth + Partnerships joint ownership
- Data for cohort prioritization
- Community Ops for facilitator enablement

### Cadence

- Bi-weekly cohort business review
- Weekly campaign launch rhythm

### Day-90 target outcomes

- WAL-3A sustained growth >= 12% WoW
- Invite acceptance >= 28%
- Class cohort retention 1.3x non-class cohorts
- CAC blended reduction via higher organic/invite share

---

## 6) Content Templates (Ready to Use)

## 6.1 Parent Community Post Template

**Hook:** “Con ngại nói tiếng Anh? Thử format 10 phút/ngày này.”

**Body:**

- Mỗi ngày 1 async challenge (không cần online cùng lúc)
- Có streak + nhiệm vụ ngày để giữ nhịp
- Cuối tuần xem thứ hạng lớp/nhóm để tạo động lực

**CTA:** “Mở app → vào thử thách [Tên Challenge] → gửi cho 1 bạn học.”

---

## 6.2 Kid-Facing Post Template

**Hook:** “Dám đấu 1 kèo speaking trong 24h không?”

**Body:**

- Mình vừa xong challenge [Tên]
- Bạn reply trong 24h để giữ chuỗi thắng
- Thắng là leo bảng bạn bè luôn

**CTA:** “Vào app, tìm [Tên Challenge], chơi và rematch mình.”

---

## 6.3 Teacher/Facilitator Weekly Script

- **Monday:** “Tuần này lớp mình chơi challenge [Tên], hạn 24h mỗi lượt.”
- **Wednesday:** “Nhắc nhẹ: ai chưa làm lượt thì hoàn thành để giữ điểm lớp.”
- **Friday:** “Cập nhật bảng xếp hạng lớp + khen nỗ lực/tiến bộ.”

---

## 7) Referral Mechanics (Within Existing Features)

## 7.1 Loop design

- End of challenge → prompt send/rematch to friend
- Friend accepts within 24h → both continue chain
- Chain depth target: 2–3 turns minimum/user/week

## 7.2 Anti-spam guardrails

- Cap outbound prompts/day per user
- Prioritize accepted contacts over broadcast behavior
- Keep all social prompts within preset safe interactions

## 7.3 Metrics

- invites_sent_per_user_per_week
- unique_invited_friends
- accepted_invites_ratio
- referral_cohort_D7_vs_nonref_D7

---

## 8) School & Community Activation Playbook

## 8.1 Target partners (v1-friendly)

- English after-school clubs
- Small tutoring centers
- Parent Zalo/Telegram groups
- School class homeroom communities

## 8.2 Activation model

1. Recruit facilitator (teacher/admin/parent lead)
2. Run 1-week async challenge cycle
3. Publish Friday recognition using class leaderboard
4. Repeat with new weekly challenge theme

## 8.3 Cohort operating cadence

- Kickoff pack Monday
- Midweek reminder
- Friday leaderboard + recognition
- Monthly recap to facilitator

## 8.4 Success metrics

- active_cohorts
- learners_per_cohort
- weekly_participation_rate
- cohort_retention_4w

---

## 9) Tracking Framework (What Must Be Visible Weekly)

## 9.1 Funnel dashboard (async-specific)

- New users
- First async challenge creation rate
- First accepted challenge rate
- 24h completion rate
- WAL-3A

## 9.2 Cohort dashboard

- Referred vs non-referred D1/D7
- Class/community vs solo D1/D7
- Streak users vs non-streak users retention delta

## 9.3 Channel dashboard

- Owned content campaigns (coded)
- Community-led cohorts
- Invite-led acquisition share

## 9.4 Guardrails

- Safety reports per 1k users
- Complaint rate from school/community channels
- Session crash/error trends during growth pushes

---

## 10) Operating Rhythm & Ownership

### Weekly Growth Pod

- **Participants:** Growth, Product, Data, Content, Partnerships, Community
- **Agenda:**
  1. KPI delta vs targets
  2. Loop-by-loop diagnosis
  3. Next 3 actions (owner + due date)

### Ownership matrix

- **Growth Lead:** overall KPI, prioritization, execution quality
- **Product Growth:** in-app prompt placement and loop optimization
- **Data Lead:** dashboard reliability, cohort insights
- **Content Lead:** templates and publishing cadence
- **Partnerships Lead:** school/community expansion
- **Community Ops:** facilitator support and weekly delivery

---

## 11) Definition of Success for Async Turn-Based v1

By Day 90, growth is considered healthy if:

- WAL-3A is growing consistently (target >= 12% WoW sustained)
- Invite/class channels contribute >= 35% of new activated users
- Async 24h completion rate >= 70%
- D7 retention >= 20% in priority cohorts
- School/community cohorts are repeatable without new feature dependencies

This plan intentionally avoids speculative features and ties every major tactic to already-defined in-app v1 surfaces.
