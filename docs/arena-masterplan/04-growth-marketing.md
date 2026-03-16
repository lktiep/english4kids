# 04) Growth & Marketing Masterplan — **Web-first, Duel-only v1**

> Bản này đã được thu gọn để **thực thi bởi team 1-2 người** và align với critical review.
>
> - Team model: **Builder / Grower**
> - Cadence: **weekly sprint**, không daily standup bắt buộc
> - Product scope: **Web-first + Async Duel-only** (không phụ thuộc Survival/Room/iOS Arena)
> - Mục tiêu: **Month-1 validation, Month-3 break-even**

---

## 0) Scope Lock (Non-negotiable)

## In-scope (v1 launch)

- Web app (Next.js + Supabase) cho Arena
- **Async Duel** (turn-based, 24h response window)
- Result screen + rematch CTA + share CTA
- Daily quest + streak protection (mức cơ bản)
- Friend challenge loop (safe preset interactions)

## Out-of-scope (defer sang v1.1+)

- Survival Run
- Room Challenge
- iOS Arena client
- UGC creator tools / ambassador portal / automation payout
- Paid UA quy mô lớn trong 30 ngày đầu

---

## 1) Team Operating Model (Builder / Grower)

## Builder (Dev)

**Owner:** product shipping + instrumentation + data reliability

- Build/ship Duel flow trên web
- Implement event tracking + dashboard primitives
- Tối ưu conversion points trong app (challenge/rematch/share)
- Fix bugs, performance, telemetry integrity

## Grower (Founder)

**Owner:** community + content + partnerships + cohort ops

- Vận hành cohort nhỏ (parent groups, lớp học, CLB)
- Xuất bản content templates (parent/kid/teacher)
- Chạy weekly challenge campaign
- Thu feedback định tính + phỏng vấn nhanh

## Weekly cadence (bắt buộc)

- **Mon (30-45’):** lock plan tuần (3 ưu tiên max)
- **Wed (async check-in):** metric pulse + unblock
- **Fri (45-60’):** review KPI + quyết định keep/kill/iterate
- Daily updates qua Telegram async (nếu cần), không cần standup cố định

---

## 2) North Star & KPI Tree (v1)

## North Star

- **WAL-3D** = Weekly Active Learners hoàn thành **>=3 duel/tuần**

## Funnel KPI cốt lõi

1. Visitor → signup
2. Signup → first duel created
3. Duel created → duel accepted
4. Duel accepted → duel completed <=24h
5. Duel completed → rematch/send-next
6. D1 / D7 retention theo cohort

## Social KPI

- invites_sent_per_active_user
- invite_accept_rate
- rematch_rate
- % new activations from invite/community

## Monetization KPI (light)

- Rewarded ad views / active user
- Cosmetic attach rate
- Parent insights trial/activation (nếu đã mở)

---

## 3) Growth Loops (Only Loops We Can Actually Run)

## Loop A — Duel Rematch Loop (core)

**Trigger:** user hoàn thành duel

**Path:** Result -> Rematch -> Friend accepts -> Completes -> Rematch

**Mục tiêu tuần:**
- rematch_rate >= 20%
- completion_24h >= 60%

---

## Loop B — Daily Habit Loop

**Trigger:** daily quest + streak status

**Path:** Open app -> 1 duel -> giữ streak -> quay lại hôm sau

**Mục tiêu tuần:**
- daily_duel_completion_rate tăng tuần-over-tuần
- streak_day2_to_day7 conversion cải thiện liên tục

---

## Loop C — Cohort Challenge Loop (manual ops)

**Trigger:** Grower kickoff challenge cho nhóm/lớp

**Path:** post challenge -> learners duel trong tuần -> Friday recognition

**Mục tiêu tuần:**
- active_cohorts >= 3 (ban đầu)
- cohort participation >= 50%
- cohort D7 > non-cohort D7

---

## 4) 30-Day Execution Plan (Operational)

## Week 1 — Instrument + Baseline

**Builder**
- Verify 8 events bắt buộc:
  - `duel_created`
  - `duel_sent`
  - `duel_accepted`
  - `duel_completed`
  - `rematch_clicked`
  - `invite_sent`
  - `invite_accepted`
  - `daily_quest_completed`
- Set dashboard baseline (funnel + cohort)

**Grower**
- Publish 3 message variants (Parent/Kid/Teacher)
- Recruit 1-2 pilot cohorts nhỏ

**Exit criteria**
- tracking completeness >= 95%
- signup -> first duel >= 40%

---

## Week 2 — Activate Duel + Invite

**Builder**
- Tối ưu result screen CTA (rematch first, share second)
- Giảm friction invite flow

**Grower**
- Chạy campaign “3 duels / 3 days”
- Manual reminder cho pilot cohorts (Mon/Wed/Fri)

**Exit criteria**
- invites_per_active_user >= 0.6
- invite_accept_rate >= 18%
- completion_24h >= 55%

---

## Week 3 — Cohort Repeatability

**Builder**
- Add lightweight cohort tagging cho phân tích
- Fix top 3 bug gây drop-off

**Grower**
- Mở rộng lên 3-5 cohorts
- Dùng script facilitator chuẩn (kickoff/reminder/recap)

**Exit criteria**
- >=3 active cohorts
- cohort participation >= 50%
- cohort D7 +3 điểm vs baseline

---

## Week 4 — Standardize What Works

**Builder**
- Chốt dashboard template tuần
- Lock tracking/spec cho phase kế tiếp

**Grower**
- Cắt 50% content yếu, giữ 2 template tốt nhất
- Chốt playbook 60 ngày

**Exit criteria (Day-30)**
- WAL-3D baseline established
- completion_24h >= 60%
- rematch_rate >= 20%
- Có quyết định rõ: continue / adjust / pivot

---

## 5) Day 31-90 (Scale Carefully)

## Phase 2 (Day 31-60)

- Scale cohort channels đã chứng minh hiệu quả
- Tăng chất lượng invite scripts theo persona
- Bắt đầu monetization nhẹ (rewarded ads/cosmetics) nếu retention ổn

## Phase 3 (Day 61-90)

- Tối ưu economics theo cohort (không đốt paid UA sớm)
- Chuẩn bị điều kiện để mở v1.1 (Survival/Room) nếu core duel loop ổn định

---

## 6) Content Templates (Ready-to-run)

## Parent post

"Mỗi ngày 10 phút, con làm 1 kèo duel tiếng Anh, không cần online cùng lúc. Cuối tuần xem tiến bộ qua streak và bảng nhóm."

CTA: "Mở app -> Duel challenge [Tên] -> gửi 1 bạn học"

## Kid post

"Đấu 1 kèo trong 24h không? Mình vừa xong challenge [Tên], vào rematch nào!"

## Facilitator script

- Monday: kickoff challenge
- Wednesday: reminder ngắn
- Friday: recap + recognition

---

## 7) Guardrails & Decision Rules

## Không mở rộng scope nếu chưa đạt core thresholds

- completion_24h < 50% (2 tuần liên tiếp)
- rematch_rate < 15% (sau 2 vòng tối ưu)
- D7 không cải thiện ở cohort đã hỗ trợ

Khi chạm red flag:
1. Freeze feature expansion
2. Builder fix core loop drop-offs
3. Grower chạy 5-10 interview ngắn
4. Rebaseline trong sprint kế tiếp

---

## 8) Definition of Success (Critique-ready)

Đến Day-90, coi là healthy nếu:

- WAL-3D tăng ổn định (không cần hyper-growth)
- completion_24h >= 65%
- rematch_rate >= 25%
- invite/community đóng góp >= 30% activated users
- Unit economics có tín hiệu dương ở cohort tốt (không bắt buộc toàn hệ thống break-even ngay)

---

## 9) Why This Plan Is Realistic

- Chỉ dựa trên **web + duel** đang có thể build ngay
- Fit **team 1-2 người** với cadence theo tuần
- Không giả định role/stack/feature không tồn tại
- Tập trung vào loop có viral value cao nhất trước (duel -> rematch -> invite)
