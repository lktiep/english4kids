# 05 — Phản Biện & Critical Review: Arena Masterplan

**Reviewer:** Engineering Lead (hiện đang build EduKids)
**Ngày:** 2026-03-16
**Phạm vi:** Review toàn bộ 4 docs (01-Architecture, 02-Game Design, 03-Monetization, 04-Growth)

> Mục tiêu: Đánh giá khả thi thực tế, phát hiện lỗ hổng logic, đề xuất điều chỉnh để tạo plan implement thống nhất.

---

## I. ĐÁNH GIÁ TỔNG QUAN

### Điểm mạnh (Giữ lại)

1. **Async-first là quyết định đúng** — giảm rủi ro kỹ thuật, phù hợp team nhỏ, MVP nhanh
2. **Anti-frustration framework tốt** — kid-safe, không shame, streak mercy, beginner protection
3. **Cost-control chặt** — target $375-500/mo, trigger thresholds để nâng cấp realtime
4. **3 game modes đủ đa dạng** — Duel/Survival/Room cover solo + PvP + social
5. **Growth loops dựa vào sản phẩm** — không phụ thuộc paid marketing

### Vấn đề nghiêm trọng (Must Fix)

> [!CAUTION]
> 6 vấn đề dưới đây nếu không giải quyết sẽ phá hỏng plan từ tháng 1.

---

## II. PHẢN BIỆN CHI TIẾT

### 1. 🔴 Revenue Math Không Thực Tế (doc-03)

**Vấn đề:** Month-1 target $110 từ 300 MAU → bất khả thi.

| Giả định           | Plan nói           | Thực tế                                                   |
| ------------------ | ------------------ | --------------------------------------------------------- |
| Cosmetic buyers    | 3% × 300 = 9 users | App mới, chưa brand → <1% thực tế = **2-3 users**         |
| Parent Insights    | 4% × 120 = ~5 subs | Feature chưa chứng minh value → **1-2 users**             |
| Founding Supporter | 10 buyers          | Không tên tuổi, chưa community → **2-3 buyers**           |
| Rewarded Ads       | 2000 impressions   | 300 MAU × 70 DAU → max 140 views/day × 30 = **4200** (ok) |

**Revenue thực tế tháng 1:**

```
Cosmetics:    3 × $3.50  = $10.50
Parent Plan:  2 × $3.99  = $7.98
Ads:          4200/1000 × $6 = $25.20
Supporter:    3 × $4.99  = $14.97
TOTAL = ~$58.65 (thiếu ~$50 so với break-even)
```

> [!IMPORTANT]
> **Đề xuất:** Chấp nhận lỗ $50-80 tháng 1, dùng tiền túi bù. Sửa target thành: "Month-1 = validation, Month-3 = break-even". Đổi narrative từ "break-even month-1" thành **"unit economics positivity proof"** — chứng minh mỗi user có willingness-to-pay, không cần break-even tổng ngay.

---

### 2. 🔴 Mâu Thuẫn Architecture: Plan nói Postgres + Redis nhưng hiện tại chạy Supabase

**Vấn đề:** Codebase thực tế dùng **Supabase (Postgres + Auth + Realtime + Edge Functions)** trên **Cloudflare Pages**. Plan viết như build từ zero với custom API + Redis.

| Plan viết                | Thực tế                                         |
| ------------------------ | ----------------------------------------------- |
| Custom JWT + rate limits | Supabase Auth (Google OAuth đã hoạt động)       |
| Redis cache + locks      | Supabase client cache, không cần Redis riêng    |
| Queue + Worker           | Supabase Edge Functions hoặc Cloudflare Workers |
| Modular monolith API     | Next.js API routes trên Cloudflare Pages        |
| Single Postgres primary  | Supabase managed Postgres (đã có)               |

> [!IMPORTANT]
> **Đề xuất:** Rewrite architecture section phù hợp stack hiện tại:
>
> - **Game Service** = Supabase Edge Functions + RLS policies
> - **Queue** = Supabase Database Webhooks + pg_cron
> - **Cache** = Supabase client-side cache, không cần Redis phase 1
> - **Auth** = Supabase Auth (đã có Google OAuth)
> - **Content** = Static JSON + Cloudflare CDN (đã có)
>
> Chi phí thực: Supabase Free tier + Cloudflare Pages = **$0-25/mo** (không phải $375).

---

### 3. 🟡 Game Design Thiếu Content Pipeline (doc-02)

**Vấn đề:** 3 game modes đều cần question banks theo difficulty bands, nhưng **plan không nói ai tạo content, bao nhiêu questions cần, format gì**.

| Mode           | Questions cần                                                                      |
| -------------- | ---------------------------------------------------------------------------------- |
| Async Duel     | 8 questions/match × ≥ 4 difficulty bands × ≥ 3 subjects = **≥96 unique questions** |
| Survival Run   | Endless = cần pool **≥200 questions** để không lặp                                 |
| Room Challenge | Reuse pool, nhưng cần theo topic_focus                                             |

**Hiện tại có gì?**

- 18 topics × 8 words ≈ 144 vocabulary items
- Chỉ có word → Vietnamese translation, chưa có MCQ format
- Chưa có grammar/listening/pronunciation questions

> [!WARNING]
> **Đề xuất:**
>
> 1. **Phase 1 chỉ dùng vocabulary quiz** — chuyển word list hiện tại thành MCQ tự động (pick 1 correct + 3 distractors từ same topic)
> 2. **Auto-generate questions** bằng template: "What is the Vietnamese for [word]?" / "Which image is [word]?"
> 3. **Defer grammar/listening** đến Phase 2 khi có content team

---

### 4. 🟡 Growth Plan Quá Tham Vọng về Team Size (doc-04)

**Vấn đề:** Ownership matrix giả định 6+ roles riêng biệt:

- Growth Lead, Product Growth, Data Lead, Content Lead, Partnerships Lead, Community Ops

**Thực tế:** Team hiện tại là **1-2 người** (dev + founder).

> [!IMPORTANT]
> **Đề xuất:** Gộp thành 2 roles:
>
> - **Builder** (dev): Product + Data + In-app growth
> - **Grower** (founder): Community + Content + Partnerships
>
> Giảm cadence: không daily standup, chuyển sang **weekly review + async Telegram updates**.

---

### 5. 🟡 Timeline 8-10 Weeks Phi Thực Tế

**Vấn đề:** Plan nói 8-10 tuần build 3 game modes + scoring + matchmaking + anti-cheat + share cards + deep links. Với team 1-2 người → **thực tế 16-20 tuần**.

| Phase         | Plan says | Realistic                                             |
| ------------- | --------- | ----------------------------------------------------- |
| A: Foundation | 3 weeks   | 5-6 weeks (scoring, match flow, data model)           |
| B: 3 Modes    | 3 weeks   | 6-8 weeks (Duel + Survival + Room, cả web + iOS)      |
| C: Polish     | 3-4 weeks | 4-5 weeks (share cards, deep links, anti-frustration) |

> [!IMPORTANT]
> **Đề xuất:** Ship **Async Duel only** trong 6-8 tuần đầu. Survival Run và Room Challenge là Phase 2 (tuần 9-16). Lý do:
>
> - Duel là mode có viral loop mạnh nhất (challenge → rematch)
> - Survival Run chỉ là solo (ít viral value)
> - Room Challenge cần critical mass users trước

---

### 6. 🟡 iOS vs Web Priority Chưa Rõ

**Vấn đề:** Plan nói "Mobile/Web client" nhưng không nói platform nào ship trước. Hiện có cả:

- **Web app** (Next.js, deployed, có users)
- **iOS app** (SwiftUI, mới build, chưa deploy)

Build Arena cho cả 2 platforms cùng lúc = **double effort**.

> [!IMPORTANT]
> **Đề xuất:** **Web-first cho Arena v1.** Lý do:
>
> - Không cần App Store review (nhanh hơn 2+ tuần)
> - Share links hoạt động trực tiếp (deep link web > universal links iOS)
> - Iteration nhanh hơn (deploy = `git push`)
> - iOS Arena = Phase 2 khi PMF validated trên web
>
> **Giữ iOS app hiện tại cho learn-only** (flashcards, quiz, gesture quiz). Không build Arena trên iOS phase 1.

---

## III. MISSING SECTIONS (Cần bổ sung)

### A. Content Generation Strategy ❌

- Ai viết question banks?
- Format MCQ hay fill-in-blank?
- Auto-generate từ word list hiện tại hay manual?
- Difficulty classification algorithm?

### B. Compliance & Legal cho Trẻ em ❌

- COPPA / PDPA Vietnam specific compliance
- Parental consent flow cho IAP
- App Store / Google Play kid-category requirements
- Nếu có ads: COPPA-compliant ad networks only

### C. Migration Path từ Codebase Hiện Tại ❌

- Supabase schema changes cần thiết
- API routes mới vs existing
- Tương thích ngược với learn flow hiện tại

### D. Fail-Safe & Pivot Scenarios ❌

- Nếu Duel mode không hấp dẫn → pivot thành gì?
- Minimum viable Arena = chỉ Room Challenge (giáo viên tạo room cho lớp)?
- Revenue plan B nếu cosmetics không sell?

---

## IV. ĐỀ XUẤT PLAN IMPLEMENT THỐNG NHẤT

### Nguyên tắc

1. **Web-first, iOS later**
2. **Duel-only v1**, Survival + Room là v1.1
3. **Supabase-native**, không thêm Redis/custom infra
4. **Auto-generated questions** từ vocabulary data hiện tại
5. **Month-1 = validate, Month-3 = break-even**

### Timeline đề xuất (Team 1-2 người)

```
Tuần 1-2:  Database schema + match flow API (Supabase)
Tuần 3-4:  Scoring engine + MCQ auto-generation
Tuần 5-6:  Async Duel UI (web) + matchmaking
Tuần 7-8:  Result screen + rematch + share cards
Tuần 9-10: Anti-frustration + telemetry + cosmetic store MVP
Tuần 11-12: Internal alpha (Gate 0)
Tuần 13-14: Small paid cohort launch (Gate 1)
Tuần 15-16: Survival Run + Room Challenge (v1.1)
```

### Cost Reality

| Item                   | Cost           |
| ---------------------- | -------------- |
| Supabase Pro (nếu cần) | $25/mo         |
| Cloudflare Pages       | $0 (free tier) |
| Apple Developer        | $8.25/mo       |
| Domain                 | ~$1/mo         |
| **TOTAL**              | **~$35/mo**    |

Break-even target ở $35/mo thay vì $110 → **khả thi hơn RẤT nhiều**.

---

## V. KẾT LUẬN

Plan gốc **viết rất tốt về mặt tư duy**, nhưng có 3 lỗ hổng cốt lõi:

1. **Revenue math quá optimistic** cho 300 MAU → cần điều chỉnh expectation
2. **Architecture không match stack thực tế** → cần rewrite cho Supabase/Cloudflare
3. **Scope quá lớn cho team size** → cần trim xuống Duel-only v1

Nếu sửa 3 điểm này, plan sẽ **thực thi được trong 14-16 tuần** với team hiện tại, và có probability of success cao hơn đáng kể so với plan gốc.

> **Verdict:** Approve concept & strategy. Reject scope & timeline. Cần rewrite implementation plan theo stack + team thực tế.
