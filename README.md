# GVCN Hub — Hệ thống quản lý lớp phân hệ

Giao diện web tĩnh (HTML / CSS / JS), lưu dữ liệu trên trình duyệt. **Không dùng Python.** Deploy trên **Vercel**.

Phiên bản giao diện chuyên nghiệp, responsive điện thoại và laptop. Nút đăng nhập ghi **Đăng nhập**. Phân môn cho nhiều lớp. Báo cáo theo ngày / tuần / tháng / quý / năm. Gửi Gmail khi sinh viên tạo đơn nghỉ phép. Hồ sơ SV, mã QR đơn phép, danh sách đơn kèm trạng thái, form báo cáo tuần.

## Chạy local (Node)

```bash
npm run dev
```

Mở http://localhost:3000

Có thể mở trực tiếp `index.html` bằng trình duyệt nếu CDN không bị chặn.

## Deploy Vercel

### CLI

```bash
npm i -g vercel
vercel login
vercel
```

Bản production:

```bash
vercel --prod
```

### GitHub

1. Đẩy repo lên GitHub
2. Vào vercel.com → Add New Project
3. Import repo
4. Framework Preset: **Other**
5. Root Directory: thư mục chứa `index.html`
6. Deploy

Không cần Build Command. Output là file tĩnh `index.html`, `css/`, `js/`, `assets/`.

## Tài khoản demo

| Vai trò | Tài khoản | Mật khẩu |
|---|---|---|
| Giáo viên chủ nhiệm | `gv` | `123456` |
| Học sinh | `sv001` … `sv010` | `123456` |

Góc phải màn hình GV luôn hiện năm học / kỳ / tuần hiện tại.

## Giáo viên chủ nhiệm

- Quản lý lớp: thêm, sửa, xóa
- Quản lý sinh viên: hồ sơ đầy đủ, validation SĐT VN, nhập Excel/JSON, cấp lại mật khẩu
- Lớp theo phân hệ: Đại học / Cao đẳng / Trung cấp → chọn lớp → bổ nhiệm ban cán sự
- Môn học + phân môn theo kỳ / năm
- Điểm danh theo ngày học của môn trong kỳ
- Công việc hôm nay / tuần này + lịch học lớp
- Báo cáo: vấn đề nghiêm trọng, nghỉ học, cần hỗ trợ, đã báo tuần, lượt trễ, HS cần quan tâm / theo dõi — xuất PDF & Excel
- Nghỉ phép: duyệt / từ chối; cấu hình Gmail khi SV nộp đơn
- Cấu hình: năm học, kỳ học, tuần hiện tại, Gmail

## Học sinh

- Xem thông tin cá nhân
- Tạo đơn nghỉ phép (form hoặc QR); xem trạng thái duyệt
- Báo cáo tuần: form phản hồi học tập

## Nhập liệu

- Excel / CSV / JSON tại mục Sinh viên
- File mẫu JSON: `assets/sinh_vien_mau.json`
- Nút Excel mẫu xuất đúng cột hệ thống hiểu
