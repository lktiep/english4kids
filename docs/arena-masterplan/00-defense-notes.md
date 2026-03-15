# 00 — Defense Notes for AI Review Panel

> Mục tiêu tài liệu này: chuẩn bị trước các điểm sẽ bị phản biện để team trả lời chắc, nhanh, và có số liệu kiểm chứng.

## 1) Positioning cốt lõi (để mở đầu mọi buổi phản biện)

- **Không theo hướng realtime-first** ở v1.
- **Async-first + turn-based** là lựa chọn chiến lược để đạt:
  1. Thời gian ra mắt nhanh,
  2. Chi phí hạ tầng thấp,
  3. Rủi ro kỹ thuật thấp,
  4. Dễ đạt PMF + hòa vốn tháng đầu.
- Chỉ nâng cấp realtime khi có **trigger định lượng** (CCU, retention, rematch pressure, payback).

---

## 2) Các phản biện chắc chắn sẽ gặp + cách trả lời

## A. "Không realtime thì mất kịch tính, khó viral"

### Trả lời ngắn
Kịch tính đến từ **outcome loop** (thắng/thua/rematch/chia sẻ), không bắt buộc từ socket realtime.

### Trả lời sâu
- V1 dùng async duel với:
  - 24h response window,
  - Tie-break theo time + accuracy,
  - "Bạn vừa bị vượt điểm" push,
  - One-tap rematch.
- Cảm xúc vẫn mạnh nhờ nhịp cạnh tranh và social proof.
- Realtime được đưa vào phase sau khi có dữ liệu đủ mạnh.

### Metric để chứng minh
- Rematch rate > 20%
- Share-to-install conversion > 8%
- Duel completion > 60%

---

## B. "Mô hình doanh thu quá lạc quan"

### Trả lời ngắn
Bản rework đã giảm kỳ vọng và dùng stack doanh thu rủi ro thấp.

### Trả lời sâu
- Month-1 target là **break-even**, không đặt lợi nhuận lớn.
- Revenue mix phân tán:
  - Cosmetics,
  - Supporter pack,
  - Rewarded ads,
  - Parent insights optional.
- Không phụ thuộc 1 nguồn thu duy nhất.

### Guardrails tài chính
- CPI trần, CAC trần theo cohort.
- Nếu D7 < ngưỡng => dừng paid UA, quay về organic loop.

---

## C. "Không subscription thì khó scale doanh thu"

### Trả lời ngắn
Subscription có thể có, nhưng **không khóa gameplay**.

### Trả lời sâu
- Core game free để tối ưu viral and network effects.
- Subscription chỉ áp cho value-add (parent analytics, advanced reporting).
- Mở rộng doanh thu theo layer: cosmetics -> event ticket -> B2B school -> sponsorship.

---

## D. "Trẻ em + cạnh tranh sẽ tăng toxicity"

### Trả lời ngắn
Thiết kế đã có anti-frustration + safety guardrails từ đầu.

### Trả lời sâu
- No public shaming,
- Soft language templates,
- Cooldown and nudge,
- Protected beginner bracket,
- Report/block flows,
- Moderation queue cho content/user report.

### KPI an toàn
- Toxic report rate
- Rage quit rate
- Parent complaint rate

---

## E. "Sao không build full kiến trúc enterprise ngay?"

### Trả lời ngắn
Vì tối ưu kinh doanh giai đoạn sớm: **giảm burn, tăng learning velocity**.

### Trả lời sâu
- Enterprise architecture phù hợp khi đã có PMF và load ổn định.
- V1 ưu tiên:
  - cycle experiment nhanh,
  - hạ tầng gọn,
  - feature/metric loop ngắn.

---

## F. "Giả định KPI chưa có bằng chứng"

### Trả lời ngắn
Đúng — nên đã gắn explicit validation plan theo tuần.

### Trả lời sâu
- Tất cả KPI trong tài liệu là **working assumptions**.
- Mỗi assumption có test:
  - test metric,
  - sample size,
  - decision threshold,
  - action nếu fail.

---

## 3) Assumptions cần validate sớm (trong 30 ngày)

1. Async duel đủ hấp dẫn để tạo rematch?
2. Share card có kéo install thật không?
3. Rewarded ads có làm giảm retention không?
4. Parent insights có willingness to pay?
5. Classroom activation có tạo DAU ổn định theo tuần?

---

## 4) Red flags (nếu gặp thì phải pivot nhanh)

- D1 < 25% trong 2 tuần liên tục.
- Duel completion < 45%.
- Rematch rate < 10% dù đã tối ưu UX.
- Viral K-factor < 0.2 sau nhiều vòng thử creative.
- ARPDAU không tăng sau 3 iteration monetization nhẹ.

Khi red flag xảy ra:
1) dừng feature expansion,
2) dồn lực fix loop core,
3) giảm paid spend,
4) chạy problem interview với phụ huynh/học sinh.

---

## 5) Câu trả lời chuẩn 30 giây cho leadership

"Chúng ta cố tình chọn async-first để giảm rủi ro kỹ thuật và tài chính ở giai đoạn chưa có PMF. V1 tập trung vào loop thắng-thua-rematch-share, mục tiêu tháng đầu hòa vốn, tháng hai tăng trưởng. Realtime không bị loại bỏ; nó là bước nâng cấp có trigger dữ liệu rõ ràng thay vì cảm tính."

---

## 6) Checklist trước buổi phản biện

- [ ] Mọi chỉ số trong docs có source/assumption note
- [ ] Có phương án nếu KPI fail
- [ ] Có danh sách deferred scope rõ ràng
- [ ] Có bảng chi phí hạ tầng theo tier
- [ ] Có owner cho từng đầu việc 30/60/90 ngày
- [ ] Có plan compliance cho minors + App Store

---

## 7) Review prompt gợi ý cho team phản biện AI

"Hãy phản biện theo 4 trục: (1) tính khả thi kỹ thuật 90 ngày, (2) unit economics tháng 1-2, (3) risk safety/compliance cho users nhỏ tuổi, (4) khả năng mở rộng sản phẩm nếu metrics tốt. Yêu cầu nêu rõ assumption nào sai sẽ phá plan và đề xuất plan B tương ứng."
