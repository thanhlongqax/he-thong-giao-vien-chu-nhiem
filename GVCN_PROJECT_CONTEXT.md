# CONTEXT CHUNG — HỆ THỐNG QUẢN TRỊ LỚP HỌC / GIÁO VIÊN CHỦ NHIỆM

> **Mục đích:** Đây là context chung của dự án dành cho AI coding agent (Grok Build).  
> AI phải đọc file này trước khi phân tích hoặc thay đổi code.
>
> **Nguyên tắc quan trọng:** Không tự ý mở rộng phạm vi, không phá chức năng đang hoạt động, không refactor lớn nếu chưa được yêu cầu.

---

## 1. MỤC TIÊU DỰ ÁN

Xây dựng một **hệ thống quản trị lớp học dành cho Giáo viên chủ nhiệm (GVCN)** tại trường cao đẳng/trung cấp.

Hệ thống hướng tới việc giúp GVCN quản lý tập trung:

- Lớp chủ nhiệm
- Sinh viên
- Hồ sơ và thông tin phụ huynh
- Điểm danh
- Nghỉ phép
- Tình hình học tập
- Tình hình rèn luyện / vấn đề
- Báo cáo tuần
- Công việc GVCN
- Lịch học / kế hoạch
- Thống kê
- Báo cáo
- Thông báo
- Quản lý nhiều lớp
- Phân quyền giữa GVCN, sinh viên và quản trị

Tên định hướng của sản phẩm:

**HỆ THỐNG QUẢN TRỊ LỚP HỌC / GVCN**

Không gọi sản phẩm đơn thuần là "hệ thống theo dõi sinh viên".

---

# 2. NGUYÊN TẮC LÀM VIỆC VỚI CODE

AI coding agent phải tuân thủ:

### 2.1. Không sửa ngoài phạm vi

Khi người dùng yêu cầu một task:

1. Đọc code liên quan.
2. Xác định chính xác file/hàm bị ảnh hưởng.
3. Chỉ sửa phạm vi cần thiết.
4. Không tự ý thêm tính năng khác.
5. Không tự ý đổi framework.
6. Không tự ý chuyển backend.
7. Không tự ý thay đổi UI toàn hệ thống.
8. Không refactor lớn nếu task không yêu cầu.

### 2.2. Ưu tiên bảo toàn chức năng

Mọi thay đổi phải đảm bảo:

- Không mất dữ liệu localStorage hiện tại.
- Không phá login.
- Không phá CRUD hiện có.
- Không phá export.
- Không phá dashboard.
- Không phá mobile UI.
- Không phá dữ liệu của sinh viên.
- Không phá dữ liệu của giáo viên.
- Không phá dữ liệu admin.

### 2.3. Không sửa theo suy đoán

Nếu chưa hiểu một hàm hoặc schema:

- Tìm nơi khai báo.
- Tìm tất cả nơi sử dụng.
- Xác định luồng dữ liệu.
- Sau đó mới sửa.

Không được "đoán" cấu trúc code.

### 2.4. Khi sửa schema

Luôn ưu tiên:

```text
schema cũ
   ↓
migration
   ↓
schema mới
   ↓
ứng dụng tiếp tục hoạt động
```

Không được đơn giản hóa thành:

```text
xóa dữ liệu cũ
→ seed lại dữ liệu
```

---

# 3. KIẾN TRÚC HIỆN TẠI

Hệ thống hiện tại là:

**SPA tĩnh — Vanilla JavaScript — không backend.**

Cấu trúc:

```text
index.html
css/
  styles.css
js/
  app.js
assets/
  logo
  ảnh login
  JSON mẫu
package.json
vercel.json
README.md
```

Hiện tại phần lớn nghiệp vụ nằm trong:

```text
js/app.js
```

Khoảng gần 2.000 dòng.

Luồng hoạt động:

```text
Browser
   ↓
index.html
   ↓
app.js
   ↓
load()
   ↓
localStorage["gvcn_system_v3"]
   ↓
migrate()
   ↓
seed() nếu chưa có dữ liệu
   ↓
login/session
   ↓
renderShell()
   ↓
paint()
   ↓
viewXxx()
   ↓
CRUD
   ↓
save(DB)
```

Mỗi trình duyệt hiện tại có một bộ dữ liệu riêng.

Không có:

- API server
- Database server
- Server-side authentication
- Server-side authorization
- Shared database

---

# 4. CÁC VAI TRÒ

Hiện có 3 vai trò:

```text
gv = Giáo viên / GVCN
sv = Sinh viên
ad = Quản trị
```

## 4.1. Giáo viên / GVCN

Session hiện tại có thông tin kiểu:

```text
teacherId
username
```

### QUY TẮC NGHIỆP VỤ QUAN TRỌNG

Sau khi hoàn thiện phạm vi GVCN:

> Giáo viên chỉ được xem và thao tác trên dữ liệu thuộc lớp mình chủ nhiệm, trừ những chức năng được đặc tả rõ là dành cho giáo viên bộ môn.

Không được tiếp tục để mọi giáo viên mặc định nhìn thấy toàn bộ lớp.

---

## 4.2. Sinh viên

Sinh viên chỉ được xem/thao tác dữ liệu thuộc chính mình:

- Hồ sơ
- Đơn phép
- Báo cáo tuần
- Đổi mật khẩu

---

## 4.3. Admin

Admin có quyền quản trị toàn hệ thống:

- Khoa
- Giáo viên
- Lớp
- Sinh viên
- Năm học / kỳ / tuần
- Cấu hình
- Phân công
- Dữ liệu toàn trường

---

# 5. MODULE HIỆN CÓ

## Nền tảng

- Seed
- Migration
- Load/save
- Session
- Toast
- Modal
- Validation
- Ngày tháng tiếng Việt

## Giáo viên

- Dashboard
- Lớp
- Sinh viên
- Import Excel/JSON
- Cấp lại mật khẩu
- Môn học
- Phân công lớp/GV
- Điểm danh
- Công việc
- Lịch tháng
- Lịch học tuần
- Nghỉ phép
- Báo cáo tổng hợp
- Export file
- Báo cáo tuần
- Reset báo cáo tuần
- Cấu hình Gmail cá nhân

## Sinh viên

- Hồ sơ
- Đơn phép
- Timeline đơn phép
- Báo cáo tuần 3 bước
- Đổi mật khẩu

## Admin

- Khoa
- Giáo viên
- Cấu hình năm/kỳ/tuần
- Quản lý giáo viên
- Quản lý khoa

---

# 6. SCHEMA HIỆN TẠI

Database hiện tại là một JSON object trong localStorage.

Key chính:

```text
gvcn_system_v3
```

Các collection chính:

```text
config
admin
faculties[]
teachers[]
teacher
classes[]
students[]
subjects[]
assigns[]
attendance[]
leaves[]
reports[]
tasks[]
schedule[]
issues[]
mailLog[]
```

---

## 6.1. config

Hiện có dạng gần như:

```js
{
  year,
  term,
  week,
  gmailNotify?,
  gmail?
}
```

`config.gmail` là field di sản nếu Gmail đã chuyển sang cấu hình riêng của giáo viên.

Không xóa ngay nếu chưa kiểm tra migration và nơi sử dụng.

---

## 6.2. admin

```js
{
  name,
  username,
  password
}
```

---

## 6.3. faculties

```js
{
  id,
  name,
  locked
}
```

---

## 6.4. teachers

```js
{
  id,
  name,
  dob,
  position,
  title,
  facultyId,
  username,
  password,
  active,
  gmail,
  gmailNotify
}
```

---

## 6.5. teacher — LEGACY

Hiện vẫn có object cũ:

```js
{
  name,
  username,
  password
}
```

Đây là schema di sản.

Trước khi xóa:

1. Tìm toàn bộ nơi sử dụng.
2. Đảm bảo không còn dependency.
3. Viết migration nếu cần.
4. Chỉ sau đó mới loại bỏ.

---

## 6.6. classes

Hiện tại:

```js
{
  id,
  name,
  level,
  year,
  note
}
```

### SCHEMA MỤC TIÊU

Cần bổ sung:

```js
{
  id,
  name,
  level,
  year,
  note,
  homeroomTeacherId
}
```

Trong đó:

```text
homeroomTeacherId = teachers.id
```

Đây là quan hệ rất quan trọng của hệ thống GVCN.

---

## 6.7. students

```js
{
  id,
  mssv,
  name,
  gender,
  dob,
  classId,
  phone,

  father,
  fatherPhone,

  mother,
  motherPhone,

  addrThuongTru,
  addrCuTru,

  status,

  username,
  password,

  officer
}
```

Quan hệ:

```text
Student.classId → Class.id
```

---

## 6.8. subjects

```js
{
  id,
  name,
  code,
  credit
}
```

---

## 6.9. assigns

```js
{
  id,
  subjectId,
  classIds[],
  teacherIds[],
  year,
  term
}
```

Lưu ý:

`teacherIds` có thể chưa tồn tại trong seed cũ.

---

## 6.10. attendance

```js
{
  id,
  studentId,
  subjectId,
  date,
  status,
  note
}
```

Hiện tại chưa gắn trực tiếp:

```text
scheduleId
```

Đây là vấn đề cần xử lý sau, không tự ý sửa trong task khác.

---

## 6.11. leaves

```js
{
  id,
  studentId,
  from,
  to,
  session?,
  reason,
  status,
  source,
  createdAt
}
```

---

## 6.12. reports

```js
{
  id,
  studentId,
  week,
  year,
  term,
  answers,
  createdAt
}
```

---

## 6.13. tasks

```js
{
  id,
  title,
  date,
  time?,
  session?,
  type,
  done
}
```

---

## 6.14. schedule

Hiện tại:

```js
{
  id,
  day,
  start,
  end,
  subject,
  classId
}
```

### Vấn đề

`subject` đang là tên môn dạng string.

Schema mục tiêu nên hướng tới:

```js
subjectId
```

Không sửa nếu task hiện tại không yêu cầu.

---

## 6.15. issues

```js
{
  id,
  studentId,
  type,
  text,
  week,
  reported,
  date
}
```

Hiện chưa có lifecycle rõ ràng giữa:

```text
nhập tay
vs
sinh từ báo cáo tuần
```

Cần chuẩn hóa sau.

---

## 6.16. mailLog

```js
{
  id,
  at,
  to,
  subject,
  ok,
  note
}
```

---

# 7. QUAN HỆ DOMAIN

Quan hệ chính:

```text
Faculty
   ↓
Teacher

Teacher
   ↓
Class.homeroomTeacherId
   ↓
Class
   ↓
Student
```

Ngoài ra:

```text
Subject
   ↓
Assign
   ↓
Class + Teacher
```

Và:

```text
Student
 ├── Attendance
 ├── Leave
 ├── WeeklyReport
 └── Issue
```

---

# 8. LỖI NGHIỆP VỤ QUAN TRỌNG NHẤT

## Lỗi 1 — Giáo viên thấy toàn bộ lớp

Hiện tại:

```text
GV đăng nhập
   ↓
có thể xem toàn bộ classes
   ↓
có thể xem toàn bộ students
```

Điều này không phù hợp với hệ thống GVCN.

### Mục tiêu:

```text
GV
 ↓
teacherId
 ↓
classes.homeroomTeacherId
 ↓
chỉ các lớp mình chủ nhiệm
 ↓
students.classId
 ↓
chỉ sinh viên của lớp mình
```

---

# 9. DATA SCOPE — QUY TẮC BẮT BUỘC

Khi triển khai phạm vi GVCN:

```js
class.homeroomTeacherId === session.teacherId
```

là điều kiện cơ bản.

Không chỉ ẩn menu.

Không chỉ ẩn bảng.

Phải lọc **ở tầng lấy dữ liệu/nghiệp vụ**.

Các khu vực cần kiểm tra:

- Dashboard
- Lớp
- Sinh viên
- Điểm danh
- Nghỉ phép
- Báo cáo tuần
- Issues
- Báo cáo tổng hợp
- Export Excel
- Export PDF
- Thống kê

Ví dụ:

```text
GV A chủ nhiệm lớp A
GV B chủ nhiệm lớp B

GV A:
  thấy lớp A
  thấy SV lớp A
  thấy báo cáo SV lớp A
  thấy nghỉ phép SV lớp A

GV B:
  thấy lớp B
  thấy SV lớp B
  thấy báo cáo SV lớp B
  thấy nghỉ phép SV lớp B

Admin:
  thấy tất cả
```

---

# 10. MIGRATION

Mọi thay đổi schema phải tương thích dữ liệu cũ.

Ví dụ khi thêm:

```js
homeroomTeacherId
```

Nếu dữ liệu cũ:

```js
{
  id: "class_001",
  name: "TC01",
  level: "trungcap"
}
```

thì migration có thể tạo:

```js
{
  id: "class_001",
  name: "TC01",
  level: "trungcap",
  homeroomTeacherId: null
}
```

Không được reset toàn bộ DB.

---

# 11. NĂM HỌC — HỌC KỲ — TUẦN

Hiện có:

```text
config.year
config.term
config.week
```

Nhưng một số logic đang dựa vào ngày hiện tại:

```js
new Date()
```

Điều này gây nguy cơ sai tuần.

### Mục tiêu nghiệp vụ tương lai:

```text
AcademicYear
   ↓
Term
   ↓
AcademicWeek
```

Ví dụ:

```text
Năm học: 2026-2027
Kỳ: Học kỳ 1
Tuần: 8
```

Tất cả chức năng quan trọng nên dùng cùng một nguồn tuần:

- Báo cáo tuần
- Nghỉ phép
- Công việc
- Điểm danh
- Thống kê
- Báo cáo

Không tự ý dùng "ngày hôm nay" làm tuần nếu task đang xử lý academic week.

---

# 12. CÁC VẤN ĐỀ ĐÃ BIẾT

## Kiến trúc

- SPA tĩnh
- Không backend
- Không database server
- localStorage là nguồn dữ liệu
- Mỗi browser là một DB riêng
- Mật khẩu plaintext
- Session plaintext
- Session chưa hết hạn
- app.js quá lớn
- onclick rải trong HTML string
- khó test

## Schema

- `teacher` và `teachers[]` song song
- `config.gmail` có thể là legacy
- Class chưa có GVCN
- schedule dùng subject string
- assigns.teacherIds có thể thiếu trong seed
- issues chưa có lifecycle rõ
- attendance chưa gắn schedule/tiết
- dữ liệu năm học chưa khóa chặt
- tuần ở một số nơi phụ thuộc ngày hiện tại

## UI

- Một số bảng rộng
- Empty state chưa đồng bộ
- Cần tiếp tục cải thiện dashboard
- Mobile đã có một số chuyển đổi bảng → card

## Export

- PDF hiện có vấn đề Unicode/tiếng Việt
- Excel đang dùng SheetJS CDN
- PDF dùng jsPDF CDN

## Email

- Có FormSubmit/mailto
- Phụ thuộc bên ngoài
- Có thể cần xác nhận email
- Không phù hợp production
- Gmail admin đã bỏ khỏi UI nhưng field legacy có thể còn trong DB

## Cache

`vercel.json` đang có cache dài hạn/immutable cho JS.

Có nguy cơ browser giữ `app.js` cũ sau deploy.

Cần xử lý cache khi có task triển khai production.

---

# 13. README

README hiện có thể lệch code.

Các điểm cần kiểm tra khi cập nhật:

- Không còn QR nếu code đã bỏ.
- Gmail admin đã bỏ khỏi UI.
- Cần mô tả tài khoản admin seed nếu vẫn tồn tại.
- Phải phản ánh đúng version/schema hiện tại.

Không tự ý sửa README trong task code nếu người dùng không yêu cầu.

---

# 14. ROADMAP

## PHASE 1 — PHẠM VI GVCN

Ưu tiên cao nhất.

```text
Class
  ↓
homeroomTeacherId
  ↓
Teacher
```

Thực hiện:

- Thêm GVCN cho lớp.
- Admin gán GVCN.
- GV chỉ thấy lớp mình.
- GV chỉ thấy SV lớp mình.
- Dashboard lọc theo lớp mình.
- Báo cáo lọc theo lớp mình.
- Nghỉ phép lọc theo lớp mình.
- Issues lọc theo lớp mình.
- Export lọc đúng phạm vi.

Không làm backend.

---

## PHASE 2 — CHUẨN HÓA SCHEMA

Xử lý:

- teacher legacy
- config.gmail legacy
- schedule.subject → subjectId
- assigns
- issues
- các quan hệ còn thiếu

Luôn migration trước khi loại bỏ legacy.

---

## PHASE 3 — NĂM HỌC / KỲ / TUẦN

Chuẩn hóa:

```text
AcademicYear
Term
AcademicWeek
```

Không để mỗi module tự tính tuần theo cách khác nhau.

---

## PHASE 4 — ĐIỂM DANH

Mục tiêu tương lai:

```text
Schedule
   ↓
Class
   ↓
Subject
   ↓
Teacher
   ↓
Attendance
```

Xem xét gắn:

```text
scheduleId
```

vào attendance nếu nghiệp vụ phù hợp.

---

## PHASE 5 — BÁO CÁO TUẦN / ISSUES

Cần xác định:

```text
Student submits report
       ↓
Weekly report
       ↓
Issue detection
       ↓
GVCN xử lý
       ↓
Status/lifecycle
```

Cần phân biệt:

- báo cáo của sinh viên
- vấn đề được phát hiện
- vấn đề do GVCN nhập
- trạng thái xử lý

---

## PHASE 6 — AUDIT LOG

Theo dõi:

- Ai duyệt phép
- Ai từ chối phép
- Ai reset báo cáo
- Ai sửa thông tin
- Ai import dữ liệu
- Ai xóa dữ liệu

Ví dụ:

```js
{
  id,
  actorId,
  actorRole,
  action,
  entity,
  entityId,
  timestamp,
  detail
}
```

---

## PHASE 7 — IMPORT AN TOÀN

Import Excel cần:

```text
Upload
 ↓
Validate
 ↓
Preview lỗi
 ↓
Confirm
 ↓
Commit
```

Không import một phần dữ liệu nếu có lỗi nghiêm trọng mà không thông báo rõ.

Có thể cần rollback.

---

## PHASE 8 — UI/UX

Sau khi domain/schema ổn định mới tiếp tục:

- Dashboard chuyên nghiệp
- Sidebar
- Cards
- Tables
- Mobile
- Empty states
- Modal
- Form
- Màu sắc
- Typography
- Responsive

Không dùng phong cách "hoạt hình".

Định hướng:

**Professional Education Management System**

Giao diện phải phù hợp một hệ thống quản trị nhà trường.

---

## PHASE 9 — TÁCH MODULE JS

Sau khi domain ổn định:

```text
js/
├── app.js
├── db.js
├── auth.js
├── permissions.js
├── migration.js
├── utils.js
├── views/
│   ├── dashboard.js
│   ├── classes.js
│   ├── students.js
│   ├── attendance.js
│   ├── leaves.js
│   ├── reports.js
│   └── tasks.js
└── components/
```

Không bắt buộc phải làm ngay.

---

# 15. PHASE 10 — BACKEND PRODUCTION

Chỉ thực hiện khi cần triển khai dùng thật nhiều máy / nhiều GV.

Kiến trúc định hướng:

```text
Frontend
Next.js
   ↓
API / Server Actions
   ↓
PostgreSQL / Supabase
   ↓
Auth + Authorization
```

Bảng tối thiểu:

```text
users
faculties
teachers
classes
students
enrollments
subjects
class_subjects
schedules
attendance
leave_requests
weekly_reports
tasks
issues
audit_logs
```

Yêu cầu:

- Password hashing
- Server-side authorization
- Role-based access control
- Database backup
- Archive năm học
- Unicode PDF
- SMTP trường
- File storage
- Audit log

Prototype hiện tại là tài liệu UX/nghiệp vụ/seed.

Không coi localStorage prototype là production database.

---

# 16. QUY TẮC VỀ QUOTA / CHI PHÍ AI

Dự án đang được phát triển bằng AI coding agent.

Do quota có giới hạn, phải tối ưu mỗi lần làm việc.

### Không nên

```text
"Hoàn thiện toàn bộ hệ thống GVCN."
```

### Nên

```text
"Chỉ thực hiện Phase 1."
```

Mỗi task phải:

1. Có phạm vi rõ.
2. Không làm các phase khác.
3. Không refactor không cần thiết.
4. Không sửa UI nếu không liên quan.
5. Không đọc/sửa toàn bộ dự án nếu không cần.
6. Sau khi sửa mới kiểm tra các khu vực bị ảnh hưởng.

---

# 17. FORMAT KHI NHẬN TASK TỪ NGƯỜI DÙNG

Trước khi sửa code, AI nên trả lời ngắn:

```text
PHẠM VI TASK
- ...

FILE DỰ KIẾN ẢNH HƯỞNG
- ...

KHÔNG THAY ĐỔI
- ...

KẾ HOẠCH
1. ...
2. ...
3. ...
```

Nếu task đủ rõ thì không hỏi lại những câu không cần thiết.

Sau khi hoàn thành:

```text
ĐÃ THAY ĐỔI
- ...

MIGRATION
- ...

ĐÃ KIỂM TRA
- ...

CHƯA THỰC HIỆN
- ...
```

---

# 18. QUY TẮC KHÔNG ĐƯỢC PHÁ

### Rule 1

Không biến prototype thành backend trừ khi người dùng yêu cầu.

### Rule 2

Không xóa localStorage để "fix lỗi".

### Rule 3

Không seed lại DB làm mất dữ liệu người dùng.

### Rule 4

Không chỉ ẩn dữ liệu bằng UI để tạo cảm giác phân quyền.

Phải lọc data scope thực tế.

### Rule 5

Không thay đổi schema mà không migration.

### Rule 6

Không sửa nhiều module không liên quan chỉ vì "tiện".

### Rule 7

Không tự ý đổi stack.

### Rule 8

Không tự ý cài thêm framework lớn.

### Rule 9

Không tạo dữ liệu giả để che lỗi.

### Rule 10

Nếu phát hiện vấn đề ngoài phạm vi:

```text
Ghi nhận vấn đề
→ Không tự sửa
→ Báo lại ở phần "Issues phát hiện"
```

---

# 19. TIÊU CHÍ CHẤT LƯỢNG

Một thay đổi chỉ được xem là hoàn thành khi:

- Không có lỗi console nghiêm trọng.
- Không làm mất dữ liệu cũ.
- Login vẫn hoạt động.
- Role vẫn hoạt động.
- CRUD liên quan vẫn hoạt động.
- Dashboard không lỗi.
- Mobile không bị phá.
- Export liên quan vẫn hoạt động.
- Migration hoạt động với schema cũ.
- Không có dữ liệu của lớp A lọt sang phạm vi GVCN lớp B.

---

# 20. ĐỊNH HƯỚNG SẢN PHẨM

Hệ thống không chỉ là:

```text
Danh sách sinh viên
```

Mà là:

```text
                HỆ THỐNG QUẢN TRỊ LỚP HỌC
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       GVCN             SINH VIÊN        ADMIN
          │                │                │
      Dashboard          Hồ sơ           Quản trị
      Lớp                 Đơn phép        Khoa
      Học tập             Báo cáo         GV
      Điểm danh           Tuần            Lớp
      Nghỉ phép                           Năm/Kỳ/Tuần
      Vấn đề
      Công việc
      Báo cáo
```

Mục tiêu cuối cùng:

> GVCN mở hệ thống và có thể biết ngay:
>
> **Lớp đang thế nào?**
> **Sinh viên nào cần quan tâm?**
> **Tuần này có vấn đề gì?**
> **Ai nghỉ?**
> **Ai học tập sa sút?**
> **Việc nào GVCN chưa xử lý?**
> **Có việc gì cần làm hôm nay?**
> **Tình hình lớp thay đổi thế nào theo thời gian?**

Dashboard phải phục vụ các câu hỏi nghiệp vụ này, không chỉ hiển thị các con số cho đẹp.

---

# 21. PHÂN BIỆT PROTOTYPE VÀ PRODUCTION

## Hiện tại

```text
Prototype
SPA
Vanilla JS
localStorage
CDN
Static Vercel
```

Phù hợp:

- Demo
- Phát triển UX
- Kiểm tra nghiệp vụ
- Seed dữ liệu
- Thử nghiệm

Không phù hợp để coi là hệ thống nhà trường dùng chung.

## Tương lai

```text
Production
Frontend
Backend/API
Database
Authentication
Authorization
Backup
Audit
Email
File storage
```

Không triển khai production backend chỉ vì thấy prototype có hạn chế.

Phải có quyết định riêng.

---

# 22. TÀI LIỆU NÀY LÀ SOURCE OF TRUTH

Nếu code hiện tại khác với tài liệu này:

1. Không tự ý sửa hàng loạt.
2. Xác định điểm khác biệt.
3. Báo lại.
4. Nếu task yêu cầu thì mới cập nhật code.
5. Khi code đã thay đổi chính thức, cập nhật context này nếu cần.

Context này mô tả:

- Kiến trúc
- Domain
- Schema
- Vai trò
- Quyền
- Roadmap
- Nguyên tắc phát triển

Không coi đây là yêu cầu phải triển khai toàn bộ ngay lập tức.

---

# 23. TASK HIỆN TẠI ƯU TIÊN

Nếu người dùng chưa chỉ định task khác, ưu tiên:

## PHASE 1

**Chuẩn hóa quan hệ GVCN → Lớp → Sinh viên và phạm vi dữ liệu của giáo viên.**

Không làm Phase 2, 3, 4... trong cùng task nếu người dùng không yêu cầu.

---

**END OF PROJECT CONTEXT**
