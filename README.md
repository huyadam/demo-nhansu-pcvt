# 🏢 Demo Nhân sự PCVT — Đánh giá Điều chuyển

Công cụ web đánh giá mức độ phù hợp khi điều chuyển CBCNV giữa các Phòng/Đội — **Công ty Điện lực Vũng Tàu (PCVT)**.

## ✨ Tính năng

- **6 tiêu chí chấm điểm**: Kinh nghiệm (30), Chuyên ngành (25), Khu vực (20), Trình độ (10), Thâm niên (10), Điều chuyển (5)
- **Multi-select đơn vị nguồn**: Chọn nhiều đơn vị cùng lúc hoặc "Chọn tất cả"
- **Expand chi tiết inline**: Click dòng → xổ progress bar + keyword analysis
- **Keyword highlight**: Tô vàng keyword phù hợp trong lịch sử công tác
- **Bảng tiêu chí tham khảo**: Collapsible, hiển thị phổ điểm chi tiết
- **Tùy chỉnh trọng số**: Slider điều chỉnh weight từng tiêu chí
- **Xuất CSV**: Export kết quả xếp hạng
- **Responsive**: Tối ưu cho mobile & tablet

## 🚀 Cách chạy

### 1. Chuẩn bị dữ liệu
```bash
python export_data.py
```
Script tạo `cbcnv_data.json` từ file Excel nguồn.

### 2. Chạy server local
```bash
python -m http.server 8080
```

### 3. Mở trình duyệt
```
http://localhost:8080
```

## 📁 Cấu trúc

```
├── index.html          # Giao diện chính
├── style.css           # Design system (Dark mode + EVN Brand)
├── app.js              # Scoring engine + UI logic
├── export_data.py      # Script xuất dữ liệu từ Excel
├── .gitignore          # Loại trừ dữ liệu nhạy cảm
└── README.md
```

## ⚠️ Lưu ý

- File `cbcnv_data.json` chứa dữ liệu nhân sự **KHÔNG được đưa lên GitHub** (đã có trong .gitignore)
- Cần chạy `export_data.py` trước khi sử dụng

## 🎨 Tech Stack

- Vanilla HTML/CSS/JS (không framework)
- Dark mode + EVN Brand colors (#004B87 / #FF6600)
- Google Fonts: Inter

---

**PCVT — Công ty Điện lực Vũng Tàu** | ABCD Group
