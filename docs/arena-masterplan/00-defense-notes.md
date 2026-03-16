# 00 — Defense Notes for Arena Review Panel (Rebuttal v3)

> Mục tiêu: trả lời phản biện nhanh, có mapping rõ đến 6 critical issues trong `05-critical-review.md`, và dùng được ngay cho buổi review với team nhỏ.

---

## 1) Core Positioning (30-second opening)

"Chúng ta chọn **web-first, async duel-only v1** để giảm rủi ro kỹ thuật và vận hành cho team 1-2 người. Month-1 tập trung validation loop (duel -> rematch -> invite), Month-3 mới nhắm break-even. Survival/Room/iOS Arena là phase sau, chỉ mở khi core metrics đạt ngưỡng."

---

## 2) Explicit Response Mapping to 6 Critical Issues

## Issue #1 — Revenue math quá lạc quan (Month-1 break-even không thực tế)

**Panel concern:** giả định conversion quá optimistic cho MAU thấp.

**Our response:**
- Đồng ý. Đã đổi mục tiêu từ "break-even month-1" sang:
  - **Month-1 = validation**
  - **Month-3 = break-even target**
- Dùng framing "unit economics positivity proof" ở cohort tốt thay vì ép toàn hệ thống hòa vốn ngay.

**Operational change:**
- Không dựa vào 1 nguồn thu.
- Monetization nhẹ, ưu tiên retention/rematch trước.

**Proof metrics:**
- Cohort-level ARPDAU
- payer conversion by cohort
- retention-adjusted revenue (D7/D30 cohorts)

---

## Issue #2 — Architecture plan không match stack thực tế (Supabase/Cloudflare)

**Panel concern:** tài liệu cũ giả định custom infra + Redis từ đầu.

**Our response:**
- Đồng ý. V1 dùng **Supabase-native + Cloudflare Pages**.
- Không thêm Redis/custom queue ở phase đầu.

**Operational change:**
- Auth: Supabase Auth
- Data: Supabase Postgres + RLS
- Backend logic: API routes/Edge functions phù hợp stack hiện tại
- Hosting: Cloudflare Pages

**Proof metrics:**
- infra cost/month
- deploy frequency
- mean time to recovery (MTTR)

---

## Issue #3 — Thiếu content pipeline cho game questions

**Panel concern:** chưa rõ ai tạo question bank, format và sản lượng.

**Our response:**
- V1 chỉ dùng **vocabulary MCQ auto-generated** từ word list hiện có.
- Grammar/listening defer phase sau.

**Operational change:**
- Template MCQ: 1 correct + 3 distractors cùng topic/difficulty
- Seed pool mục tiêu đủ cho Duel v1 trước khi mở rộng mode khác
- Grower review chất lượng hàng tuần, Builder đảm bảo toolchain generate/validate

**Proof metrics:**
- question repetition rate
- question error report rate
- duel completion vs question set quality

---

## Issue #4 — Growth org quá tham vọng so với team size

**Panel concern:** plan cũ giả định 6+ roles.

**Our response:**
- Đồng ý. Gộp còn 2 role:
  - **Builder**: product + data + instrumentation
  - **Grower**: content + community + partnerships

**Operational change:**
- Cadence theo tuần (Mon lock, Wed pulse async, Fri review)
- Mỗi tuần tối đa 3 ưu tiên lớn

**Proof metrics:**
- sprint completion rate
- unplanned work ratio
- KPI delta/tuần theo từng loop

---

## Issue #5 — Timeline 8-10 tuần cho full scope là phi thực tế

**Panel concern:** team 1-2 người không thể ship 3 modes + full polish nhanh như cũ.

**Our response:**
- Đồng ý. Timeline mới:
  - **6-8 tuần:** web async duel v1
  - **9-16 tuần:** cân nhắc v1.1 (Survival/Room) nếu duel loop ổn

**Operational change:**
- Scope lock Duel-only cho launch
- Feature gate rõ trước khi mở rộng

**Proof metrics:**
- scope adherence
- milestone hit rate
- bug backlog burn-down

---

## Issue #6 — iOS vs Web priority chưa rõ

**Panel concern:** làm song song web + iOS gây double effort.

**Our response:**
- Đồng ý. **Web-first cho Arena v1**.
- iOS giữ learn-only phase đầu; Arena iOS là phase sau PMF signal.

**Operational change:**
- Toàn bộ growth loop vận hành qua web release cycle
- Tập trung deep link/share flow cho web trước

**Proof metrics:**
- release cycle time
- time-to-experiment
- invite-to-play conversion trên web

---

## 3) Weekly Operating Playbook (for review panel confidence)

## Monday (Plan Lock)
- Chốt 3 ưu tiên lớn nhất tuần
- Define expected KPI movement
- Assign owner Builder/Grower

## Wednesday (Async Pulse)
- Check funnel + cohort quick health
- Unblock 1-2 vấn đề lớn nhất

## Friday (Decision Review)
- So sánh kết quả vs threshold
- Quyết định: keep / iterate / cut
- Cập nhật next-week lock

---

## 4) Validation Assumptions (first 30 days)

1. Duel có đủ hấp dẫn để tạo rematch đều đặn?
2. Invite flow có chuyển thành accepted duel không?
3. Cohort-led ops (class/group) có kéo D7 tốt hơn solo?
4. Monetization nhẹ có không làm hại retention?
5. Content auto-generated có giữ được completion quality?

---

## 5) Red Flags & Mandatory Actions

## Red flags
- completion_24h < 50% (2 tuần liên tiếp)
- rematch_rate < 15% sau 2 vòng tối ưu
- cohort D7 không tốt hơn non-cohort
- bug/latency làm hỏng core duel flow

## Mandatory actions when hit
1. Freeze scope expansion
2. Builder sửa core drop-off points
3. Grower chạy interview nhanh (5-10 users)
4. Rebaseline KPI ở sprint kế tiếp

---

## 6) Review-Ready Checklist

- [ ] Mọi KPI có assumption note + ngưỡng quyết định
- [ ] Có mapping rõ tới 6 critical issues
- [ ] Scope lock: web-first, duel-only được ghi rõ
- [ ] Team model Builder/Grower + weekly cadence rõ ràng
- [ ] Có red flags và action protocol
- [ ] Có kế hoạch phase sau nhưng không trộn vào v1

---

## 7) Final Leadership Answer (30s)

"Chúng ta đã sửa plan theo thực tế: team nhỏ, stack hiện tại, và tốc độ học nhanh. V1 chỉ web async duel để chứng minh loop và unit economics ở cohort tốt. Chỉ khi các ngưỡng completion/rematch/retention đạt, chúng ta mới mở rộng sang mode/platform tiếp theo."
