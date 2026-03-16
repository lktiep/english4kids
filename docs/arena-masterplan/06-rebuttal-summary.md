# 06 — Rebuttal Summary (v2 → v3)

## Mục tiêu file
Giúp reviewer nắm nhanh những thay đổi quan trọng giữa bản trước (`strategy/arena-rebuttal-v2`) và bản hiện tại (`strategy/arena-rebuttal-v3`) trong 5 phút.

---

## TL;DR

Bản v3 đã chuyển từ plan "đẹp nhưng tham vọng" sang plan **thực thi được với team nhỏ**:

- **Web-first + Duel-only v1** (không ôm 3 mode ngay)
- **Supabase/Cloudflare-native** (khớp stack hiện tại)
- **Month-1 = validation, Month-3 = break-even** (realistic finance)
- **Builder/Grower operating model** (khớp nhân sự thực)
- **Timeline 14–16 tuần** (thay vì 8–10 tuần)

---

## Mapping theo 6 điểm phản biện từ `05-critical-review.md`

## 1) Revenue math quá optimistic

### v2
- Target month-1 break-even quá sớm với giả định conversion cao.

### v3
- Chuyển thành:
  - **Month-1 validation**
  - **Month-3 break-even**
- Thêm scenario Bear/Base/Bull + pivot conditions cuối M2.
- Dùng giả định low-brand thực tế hơn.

---

## 2) Architecture không match stack thực tế

### v2
- Còn bias theo custom infra (Redis/service split sớm).

### v3
- Rewrite thành **Supabase-native + Cloudflare-native**:
  - Auth: Supabase Auth
  - DB: Supabase Postgres
  - API/Game flow: Next API + Edge Functions
  - Không Redis/custom infra ở phase 1
- Cost infra giai đoạn đầu: **$0–35/mo**.

---

## 3) Thiếu content pipeline khả thi

### v2
- Nêu game modes nhưng chưa đóng scope content theo data hiện có.

### v3
- Chốt content reality:
  - **Vocabulary-only** giai đoạn đầu
  - MCQ template generation từ word bank hiện tại
  - Difficulty banding + distractor constraints
- Đặt threshold pool tối thiểu trước khi mở mode mới.

---

## 4) Growth ownership quá tham vọng team

### v2
- Nhiều role chức năng như team lớn.

### v3
- Gộp về 2 vai trò:
  - **Builder**: product + data + implementation
  - **Grower**: content + community + distribution
- Cadence tuần cố định:
  - Mon lock
  - Wed async pulse
  - Fri review/decision

---

## 5) Timeline chưa thực tế

### v2
- 8–10 tuần cho scope khá rộng.

### v3
- Chốt **14–16 tuần** cho Duel-only web-first v1.
- Survival/Room chuyển sang **v1.1** sau khi qua launch gate.

---

## 6) iOS vs Web priority chưa rõ

### v2
- Chưa khóa rõ platform priority.

### v3
- **Web-first bắt buộc cho Arena v1**.
- iOS giữ vai trò follow-up phase sau khi web chứng minh loop/KPI.

---

## Scope lock v3 (để tránh trượt scope)

### In-scope v1
- Async Duel (core)
- Result/rematch/share loop
- Basic leaderboard
- Lightweight monetization

### Deferred v1.1+
- Survival Run
- Room Challenge
- iOS Arena full
- Realtime sockets
- Advanced anti-cheat/ML

---

## KPI/Gate logic ở v3

- Month-1: validation gate (retention + rematch + invite + payer signal)
- Month-2: optimize gate (loop quality + CAC guardrail + monetization signal)
- Month-3: break-even gate (run-rate bù infra + license allocation)

Nếu fail gate:
- freeze feature expansion
- ưu tiên fix core loop
- giảm/stop paid acquisition

---

## Files đã cập nhật trong v3

- `01-architecture.md`
- `02-game-design-gamification.md`
- `03-monetization-strategy.md`
- `04-growth-marketing.md`
- `00-defense-notes.md`
- `06-rebuttal-summary.md` (file này)

---

## Kết luận

v3 không cố “thắng bằng độ hoành tráng”, mà thắng bằng **khả năng ship + học nhanh + sống sót tài chính**.

Đây là bản phù hợp hơn cho vòng phản biện tiếp theo vì:
1. Match stack thực tế,
2. Match năng lực team hiện tại,
3. Match rủi ro tài chính giai đoạn sớm.
