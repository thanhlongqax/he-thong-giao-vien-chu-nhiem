# CONTEXT CHUNG — HỆ THỐNG QUẢN TRỊ LỚP HỌC / GIÁO VIÊN CHỦ NHIỆM

> **Phiên bản context:** 2.0 — sau Phase 1–10 (2026-09-10)  
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

- Không mất dữ liệu production PostgreSQL hiện tại.
- Không mất dữ liệu prototype localStorage nếu vẫn đang dùng bản tĩnh.
- Không phá login / session cookie.
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
migration (Prisma migrate / tương thích dữ liệu)
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

Production dùng `prisma migrate`. Prototype tĩnh dùng `migrate()` trong `js/migration.js`. Không reset DB để "cho nhanh".

---

# 3. KIẾN TRÚC HIỆN TẠI

Hệ thống **production** hiện tại là:

**Next.js App Router — Vercel Serverless — PostgreSQL (Vercel Postgres / Supabase) — Prisma ORM — NextAuth cookie HttpOnly.**

Prototype Vanilla JS / localStorage **vẫn giữ** như tài liệu UX / seed nghiệp vụ. Không coi localStorage là nguồn sự thật production.

## 3.1. Production

Cấu trúc:

```text
app/
  layout.tsx
  login/page.tsx
  (shell)/
    dash/
    classes/
    students/
    attendance/
    leaves/
    reports/
    tasks/
    admin/
    portal/
  api/
    auth/[...nextauth]/
    students/
    leaves/
    attendance/
    reports/
    issues/
    config/
lib/
  prisma.ts
  auth.ts
  rbac.ts
  audit.ts
prisma/
  schema.prisma
  seed.ts
middleware.ts
public/
.env.example
package.json
vercel.json
README.md
```

Luồng hoạt động production:

```text
Browser
   ↓
Next.js App Router (Vercel)
   ↓
middleware.ts  (JWT cookie HttpOnly)
   ↓
Server Component / API Route / Server Action
   ↓
lib/rbac.ts  (role + homeroom scope + assigns)
   ↓
Prisma Client
   ↓
PostgreSQL pooled connection
   DATABASE_URL  = pooler (PgBouncer / Supabase :6543)
   DIRECT_URL    = direct  (migrate / :5432)
```

Auth:

```text
POST credentials
   ↓
bcrypt.compare(passwordHash)
   ↓
NextAuth JWT
   ↓
Cookie HttpOnly + SameSite=Lax + Secure (production)
   ↓
session.user = { id, role, teacherId, studentId }
```

Không dùng:

- SQLite
- File JSON trên disk làm database
- localStorage làm production DB
- mật khẩu plaintext trên production

## 3.2. Prototype tĩnh (tài liệu UX)

Vẫn tồn tại song song:

```text
index.html
css/styles.css
js/
  app.js
  db.js
  auth.js
  migration.js
  utils.js
  views/
assets/
```

Luồng prototype:

```text
Browser
   ↓
index.html
   ↓
script tuần tự (không type=module)
   ↓
load()
   ↓
localStorage["gvcn_system_v3"]
   ↓
migrate()
   ↓
seed() nếu chưa có dữ liệu
   ↓
login/session (SESS_KEY gvcn_session_v3)
   ↓
renderShell() → paint() → viewXxx()
   ↓
save(DB)
```

Mỗi trình duyệt prototype có một bộ dữ liệu riêng. Chỉ dùng để demo / đối chiếu UX.

## 3.3. Deploy

```text
Vercel (framework: nextjs)
   ↓
build: prisma generate && next build
   ↓
runtime Node serverless
   ↓
Postgres + connection pooling
```

Biến môi trường bắt buộc:

```text
DATABASE_URL
DIRECT_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
```

Tùy chọn: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.

---

# 4. CÁC VAI TRÒ

Hiện có 3 vai trò.

Production (Prisma enum `Role`):

```text
TEACHER = Giáo viên / GVCN
STUDENT = Sinh viên
ADMIN   = Quản trị
```

Prototype tĩnh vẫn dùng mã ngắn:

```text
gv = Giáo viên / GVCN
sv = Sinh viên
ad = Quản trị
```

## 4.1. Giáo viên / GVCN

Session production:

```text
id          = User.id
role        = TEACHER
teacherId   = Teacher.id
name
```

### QUY TẮC NGHIỆP VỤ QUAN TRỌNG

> Giáo viên chỉ được xem và thao tác trên dữ liệu thuộc lớp mình chủ nhiệm, trừ những chức năng được đặc tả rõ là dành cho giáo viên bộ môn.

Không được để mọi giáo viên mặc định nhìn thấy toàn bộ lớp.

Điều kiện chủ nhiệm:

```text
Class.homeroomTeacherId === session.teacherId
```

Điều kiện giáo viên bộ môn (điểm danh tiết):

```text
Assignment.year + term hiện tại
AssignmentClass.classId
AssignmentTeacher.teacherId === session.teacherId
Assignment.subjectId === tiết.subjectId
```

## 4.2. Sinh viên

Sinh viên chỉ được xem/thao tác dữ liệu thuộc chính mình:

- Hồ sơ
- Đơn phép
- Báo cáo tuần
- Đổi mật khẩu

`session.studentId === Student.id`.

## 4.3. Admin

Admin có quyền quản trị toàn hệ thống:

- Khoa
- Giáo viên
- Lớp / gán GVCN
- Sinh viên
- Năm học / kỳ / tuần (`AcademicConfig`)
- Cấu hình
- Phân công môn
- Nhật ký (`AuditLog`)
- Dữ liệu toàn trường

---

# 5. MODULE HIỆN CÓ

## Nền tảng

- Prisma schema + migrate
- Seed từ cấu trúc JSON v3 (`prisma/seed.ts`)
- NextAuth + bcrypt
- Middleware RBAC
- `lib/rbac.ts` (homeroom + bộ môn)
- `lib/audit.ts`
- Toast / Modal / Empty state (prototype + một phần Next UI)
- Validation SĐT
- Academic year / term / week thống nhất

## Giáo viên

- Dashboard câu hỏi nghiệp vụ (ai nghỉ, ai cần quan tâm, việc chưa làm)
- Lớp chủ nhiệm
- Sinh viên (CRUD + import 5 bước trên prototype)
- Cấp lại mật khẩu
- Môn học / phân công nhiều lớp + giáo viên
- Điểm danh theo tiết (`scheduleId`)
- Công việc
- Lịch học tuần
- Nghỉ phép (duyệt / từ chối)
- Báo cáo tổng hợp
- Export file (prototype Excel/PDF)
- Báo cáo tuần + reset
- Cấu hình Gmail cá nhân của giảng viên

## Sinh viên

- Hồ sơ
- Đơn phép + trạng thái
- Báo cáo tuần (1 lần / tuần / năm / kỳ)
- Đổi mật khẩu

## Admin

- Khoa (khóa khi còn giáo viên)
- Giáo viên
- Cấu hình năm/kỳ/tuần
- Nhật ký hệ thống
- Gán GVCN cho lớp

---

# 6. SCHEMA HIỆN TẠI

## 6.A. Production — PostgreSQL / Prisma

Nguồn sự thật: `prisma/schema.prisma`.

Datasource:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooled
  directUrl = env("DIRECT_URL")     // migrate
}
```

Enum:

```text
Role          ADMIN | TEACHER | STUDENT
IssueStatus   Pending | InProgress | Resolved
IssueSource   weekly_report | teacher
LeaveStatus   Pending | Approved | Rejected
```

Ghi chú: Prisma không dùng khoảng trắng trong enum. API chấp nhận cả `"In Progress"` rồi map sang `InProgress`. UI có thể hiện "Chờ xử lý / Đang xử lý / Đã xử lý" và "Chờ duyệt / Duyệt / Từ chối".

### 6.1. User

Thay `admin` + `teachers.username/password` + `students.username/password`.

```text
User
  id
  username          unique
  passwordHash      bcrypt
  name
  role              Role
  active
  createdAt
  updatedAt
```

Không lưu mật khẩu plaintext trên production.

### 6.2. AcademicConfig

Thay `config` JSON.

```text
AcademicConfig
  id            = "current"
  year          ví dụ "2025-2026"
  term          ví dụ "Học kỳ 1"
  week          1..weeksPerTerm
  yearStart     date
  weeksPerTerm  mặc định 22
```

Không còn `config.gmail` trên admin. Gmail nằm ở `Teacher.gmail`.

### 6.3. Faculty

```text
Faculty
  id
  name
  locked
```

Không khóa khoa nếu còn giáo viên thuộc khoa.

### 6.4. Teacher

```text
Teacher
  id
  userId              unique → User.id
  facultyId           → Faculty.id
  dob
  position
  title
  gmail
  gmailNotify
  active
```

Object `teacher` legacy của prototype đã được dọn ở Phase 2; production không có bảng `teacher` đơn.

### 6.5. Class

```text
Class
  id
  name
  level               daihoc | caodang | trungcap
  year
  note
  homeroomTeacherId   → Teacher.id | null
```

`homeroomTeacherId` là quan hệ cốt lõi GVCN.

### 6.6. Student

```text
Student
  id
  userId              unique → User.id
  mssv                unique
  classId             → Class.id
  gender
  dob
  phone
  father
  fatherPhone
  mother
  motherPhone
  addrThuongTru
  addrCuTru
  status
  officer
```

Họ tên / username / passwordHash nằm ở `User`, không nhân đôi trên `Student`.

### 6.7. Enrollment

```text
Enrollment
  id
  studentId
  classId
  year
  term
  @@unique([studentId, year, term])
```

### 6.8. Subject

```text
Subject
  id
  name
  code                unique
  credit
```

### 6.9. Assignment (phân môn)

Thay `assigns[]` JSON. Quan hệ nhiều-nhiều qua bảng nối.

```text
Assignment
  id
  subjectId
  year
  term

AssignmentClass
  assignmentId
  classId

AssignmentTeacher
  assignmentId
  teacherId
```

### 6.10. Schedule

```text
Schedule
  id
  day                 Thứ 2 … Chủ nhật
  start
  end
  subjectId           → Subject.id   (không còn string tên môn)
  classId             → Class.id
```

### 6.11. Attendance

```text
Attendance
  id
  studentId
  scheduleId          bắt buộc — gắn tiết lịch
  subjectId
  date
  status              Có mặt | Trễ | Vắng
  note
  year
  term
  week
  @@unique([studentId, scheduleId, date])
```

### 6.12. LeaveRequest

Thay `leaves[]`.

```text
LeaveRequest
  id
  studentId
  fromDate
  toDate
  session             Sáng | Chiều | Cả ngày
  reason
  status              Pending | Approved | Rejected
  source
  createdAt
```

### 6.13. WeeklyReport

Thay `reports[]`.

```text
WeeklyReport
  id
  studentId
  week
  year
  term
  answers             Json
  createdAt
  @@unique([studentId, week, year, term])
```

Mỗi sinh viên chỉ nộp 1 báo cáo / tuần / năm / kỳ.

### 6.14. Issue

```text
Issue
  id
  studentId
  type                Nghiêm trọng | Cần hỗ trợ
  text
  week
  year
  term
  source              weekly_report | teacher
  status              Pending | InProgress | Resolved
  reported
  reportId
  date
  updatedAt
```

Lifecycle: Pending → In Progress → Resolved. GVCN cập nhật tiến độ và đóng issue.

### 6.15. Task

```text
Task
  id
  teacherId
  title
  date
  time
  session
  type
  done
```

### 6.16. AuditLog

```text
AuditLog
  id
  actorId             → User.id
  actorRole
  actorName
  action
  entity
  entityId
  detail
  timestamp
```

Hành vi bắt buộc ghi:

- approve_leave / reject_leave
- reset_week_report
- create_student / update_student / delete_student
- import_students
- delete_class
- save_attendance
- update_issue
- submit_week_report

Không ghi mật khẩu trong `detail`.

## 6.B. Prototype tĩnh — JSON localStorage (di sản, chỉ UX)

Key:

```text
gvcn_system_v3
```

Session key:

```text
gvcn_session_v3
```

Collection prototype (đã migrate Phase 1–7):

```text
config          year, term, week, yearStart, weeksPerTerm
admin           name, username, password          (plaintext — chỉ prototype)
faculties[]     id, name, locked
teachers[]      id, name, dob, position, title, facultyId, username, password, active, gmail, gmailNotify
classes[]       id, name, level, year, note, homeroomTeacherId
students[]      mssv, name, …, username, password, officer
subjects[]      id, name, code, credit
assigns[]       subjectId, classIds[], teacherIds[], year, term
attendance[]    studentId, subjectId, scheduleId, date, status, note
leaves[]
reports[]
tasks[]
schedule[]      day, start, end, subjectId, classId
issues[]        status, source, year, term, reportId
mailLog[]
auditLog[]
```

Đã loại bỏ (Phase 2, prototype):

- object `teacher` legacy
- `config.gmail`
- `schedule.subject` string (đã đổi `subjectId`)

Không coi JSON này là production database.

---

# 7. QUAN HỆ DOMAIN

```text
User
 ├── Teacher
 └── Student

Faculty
   ↓
Teacher
   ↓
Class.homeroomTeacherId
   ↓
Class
   ↓
Student
   ↓
Enrollment (year, term)

Subject
   ↓
Assignment (year, term)
   ├── AssignmentClass → Class
   └── AssignmentTeacher → Teacher

Schedule (subjectId + classId + day + giờ)
   ↓
Attendance (studentId + scheduleId + date)

Student
 ├── Attendance
 ├── LeaveRequest
 ├── WeeklyReport
 └── Issue
      source = weekly_report | teacher
      status = Pending | InProgress | Resolved

Teacher
 └── Task

User
 └── AuditLog
```

Luồng điểm danh:

```text
Ngày học
  ↓
Thứ trong tuần
  ↓
Schedule của lớp
  ↓
Quyền:
  GVCN        → mọi tiết lớp chủ nhiệm
  GV bộ môn   → tiết assigns.teacherIds + classIds + subjectId + năm/kỳ
  Admin       → tất cả
  ↓
Attendance.scheduleId
```

Luồng issue:

```text
Sinh viên nộp WeeklyReport
       ↓
detect (nghỉ > 2, trễ > 2, hỗ trợ, khó khăn, trao đổi riêng, bài chưa xong)
       ↓
Issue source=weekly_report status=Pending
       ↓
GVCN cập nhật InProgress / Resolved
```

---

# 8. LỖI NGHIỆP VỤ ĐÃ XỬ LÝ VÀ CÒN MỞ

## Đã xử lý (Phase 1 + 4 + 10)

Giáo viên không còn mặc định thấy toàn trường.

```text
GV
 ↓
teacherId
 ↓
classes.homeroomTeacherId
 ↓
chỉ lớp chủ nhiệm
 ↓
students.classId
 ↓
chỉ sinh viên lớp mình
```

Điểm danh bộ môn đi qua `Assignment`, không mở toàn bộ lớp.

Phân quyền production nằm ở `lib/rbac.ts` + `middleware.ts` + từng API. Không chỉ ẩn UI.

## Còn mở (vận hành)

- SMTP trường chưa bắt buộc
- File storage (minh chứng đơn phép) chưa có object storage
- PDF Unicode production chưa chuẩn hóa font
- Archive / khóa năm học chưa có job riêng
- Backup Postgres do nhà cung cấp (Vercel/Supabase) — cần quy trình nhà trường

---

# 9. DATA SCOPE — QUY TẮC BẮT BUỘC

Khi triển khai phạm vi GVCN:

```text
Class.homeroomTeacherId === session.teacherId
```

là điều kiện cơ bản.

Không chỉ ẩn menu.

Không chỉ ẩn bảng.

Phải lọc **ở tầng lấy dữ liệu / API / Prisma where**.

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
- API `GET /api/students`, `/api/leaves`, `/api/attendance`

Ví dụ:

```text
GV A chủ nhiệm lớp A
GV B chủ nhiệm lớp B

GV A:
  thấy lớp A
  thấy SV lớp A
  thấy báo cáo SV lớp A
  thấy nghỉ phép SV lớp A
  điểm danh được tiết lớp A (GVCN)
  điểm danh tiết bộ môn nếu có Assignment

GV B:
  thấy lớp B
  thấy SV lớp B
  …

Admin:
  thấy tất cả
```

Hàm prototype: `scopedClasses()`, `scopedStudents()`, `canAccessClass()`, `canAccessStudent()`, `canAttendClass()`, `isSubjectTeacher()`.

Hàm production: `homeroomClassIds()`, `canAccessClass()`, `canAttendClass()` trong `lib/rbac.ts`.

---

# 10. MIGRATION

## Production

```text
prisma migrate dev / prisma migrate deploy
```

Không `db push` lên production nếu có thể tránh. Không xóa bảng để seed lại khi đã có dữ liệu nhà trường.

`DIRECT_URL` dùng cho migrate (không pooler). `DATABASE_URL` dùng runtime pooler (`connection_limit=1`, `pgbouncer=true`).

## Prototype tĩnh

Mọi thay đổi schema JSON phải tương thích dữ liệu cũ trong `js/migration.js`.

Ví dụ `homeroomTeacherId` thiếu thì gán `null`, không xóa `classes[]`.

Không được reset toàn bộ localStorage.

Seed `prisma/seed.ts` map từ JSON v3 sang Postgres (dùng khi môi trường trống, không dùng để ghi đè production đang chạy).

---

# 11. NĂM HỌC — HỌC KỲ — TUẦN

Nguồn chuẩn:

```text
AcademicConfig.year
AcademicConfig.term
AcademicConfig.week
AcademicConfig.yearStart
AcademicConfig.weeksPerTerm
```

Mô hình:

```text
AcademicYear
   ↓
Term
   ↓
AcademicWeek   (suy ra từ yearStart + offset kỳ + số tuần)
```

Ví dụ:

```text
Năm học: 2025-2026
Kỳ: Học kỳ 1
Tuần: 8
yearStart: 2025-09-01
```

Tất cả chức năng quan trọng dùng cùng nguồn tuần:

- Báo cáo tuần
- Nghỉ phép
- Công việc
- Điểm danh
- Thống kê
- Báo cáo
- Issue

Không tự ý dùng `new Date()` làm số tuần học.

Prototype: `academicContext()`, `academicWeekBounds()`, `periodBounds()`, `selectedAcademicWeek()`, `defaultAcademicDate()` trong `js/utils.js` / `js/db.js`.

---

# 12. CÁC VẤN ĐỀ ĐÃ BIẾT

## Kiến trúc

Đã chuyển production sang Next.js + Postgres + NextAuth.

Còn lại:

- Một số màn Next.js mới là luồng chính, chưa port 1:1 mọi modal prototype (import 5 bước UI, lịch tháng chi tiết, export PDF Unicode).
- Prototype vẫn onclick trong HTML string.
- Session JWT mặc định 8 giờ — cần chính sách nhà trường nếu muốn nhớ đăng nhập lâu hơn.

## Schema

Đã xử lý:

- `teacher` legacy
- `config.gmail` legacy
- `Class.homeroomTeacherId`
- `schedule.subjectId`
- `Attendance.scheduleId`
- Issue lifecycle + source
- AuditLog
- passwordHash

Còn lại:

- Archive năm học
- Bảng mail log production nếu SMTP được bật

## UI

- Prototype: dashboard 3 câu hỏi, bảng → card mobile (`enhanceTables` + `data-label`), empty/toast/modal chuẩn hóa.
- Next UI: đủ đăng nhập, dash, lớp, SV, phép, báo cáo, cổng SV, admin audit — cần tiếp tục chỉnh chu theo prototype.

## Export

- Prototype Excel SheetJS / PDF jsPDF (Unicode còn hạn chế).
- Production chưa có route export riêng.

## Email

- Prototype FormSubmit / mailto — không phù hợp production.
- Production: cấu hình SMTP qua env, chưa bắt buộc gửi.

## Cache

- `vercel.json` production là Next.js, không còn cache immutable cho `js/app.js`.
- Prototype nếu vẫn host tĩnh riêng thì mới cần lo cache CDN JS.

---

# 13. README

README phải phản ánh:

- Production = Next.js + Prisma + Postgres pooler
- Bảng biến môi trường
- Lệnh migrate / seed
- Tài khoản seed: `admin` / `gv` / `sv001` mật khẩu `123456` (đã hash trên production)
- Prototype tĩnh chỉ là UX
- Không còn QR tạo đơn nếu code đã bỏ
- Gmail admin không còn; Gmail thuộc giáo viên

Không tự ý sửa README trong task code nếu người dùng không yêu cầu.

---

# 14. ROADMAP

Toàn bộ Phase 1–10 **đã triển khai** trên codebase. Dưới đây là trạng thái, không phải việc chưa làm.

## PHASE 1 — PHẠM VI GVCN — HOÀN THÀNH

```text
Class.homeroomTeacherId → Teacher.id
Admin gán GVCN
GV chỉ thao tác lớp chủ nhiệm (logic, không chỉ UI)
```

## PHASE 2 — CHUẨN HÓA SCHEMA — HOÀN THÀNH

```text
Xóa teacher legacy + config.gmail
schedule.subject → subjectId
Migration không xóa DB cũ (prototype)
```

## PHASE 3 — NĂM HỌC / KỲ / TUẦN — HOÀN THÀNH

```text
AcademicYear → Term → AcademicWeek
yearStart + weeksPerTerm
Cùng nguồn tuần cho báo cáo, điểm danh, phép, issue, thống kê
```

## PHASE 4 — ĐIỂM DANH — HOÀN THÀNH

```text
Attendance.scheduleId
GVCN mọi tiết lớp chủ nhiệm
GV bộ môn qua Assignment
```

## PHASE 5 — BÁO CÁO TUẦN / ISSUES — HOÀN THÀNH

```text
detectIssuesFromReport
source weekly_report | teacher
status Pending | In Progress | Resolved
GVCN cập nhật / đóng
```

## PHASE 6 — AUDIT LOG — HOÀN THÀNH

```text
AuditLog
Ghi duyệt/từ chối phép, reset báo cáo, sửa/xóa/import SV, xóa lớp
Admin xem nhật ký
```

## PHASE 7 — IMPORT AN TOÀN — HOÀN THÀNH (prototype)

```text
Upload → Validate → Preview lỗi → Confirm → Commit
Chặn commit khi lỗi nghiêm trọng
Rollback snapshot students nếu ghi thất bại
```

## PHASE 8 — UI/UX — HOÀN THÀNH (prototype + nền tảng Next)

```text
Dashboard nghiệp vụ
Responsive bảng → card
Empty / Toast / Modal chuyên nghiệp
Định hướng Professional Education Management System
```

## PHASE 9 — TÁCH MODULE JS — HOÀN THÀNH (prototype)

```text
js/utils.js
js/migration.js
js/db.js
js/auth.js
js/views/*
js/app.js (điểm vào)
index.html load script tuần tự
```

## PHASE 10 — BACKEND PRODUCTION — HOÀN THÀNH (nền tảng)

```text
Next.js App Router
API Routes
Prisma + PostgreSQL
Connection pooling
NextAuth HttpOnly + bcrypt
middleware.ts RBAC
prisma/seed.ts từ JSON v3
vercel.json + env
```

## Định hướng vận hành sau Phase 10

Không mở Phase kiến trúc mới nếu chưa có quyết định. Ưu tiên vận hành:

1. Gắn Vercel Postgres / Supabase thật, chạy `migrate deploy` + seed môi trường trống.
2. Port nốt UI prototype còn thiếu sang App Router (import 5 bước, lịch tháng, phân môn UI, export).
3. SMTP trường cho đơn phép.
4. Object storage minh chứng.
5. PDF Unicode.
6. Backup / archive năm học.
7. Chính sách hết hạn session và khóa tài khoản.

Prototype localStorage **không** thay thế production DB.

---

# 15. PHASE 10 — CHI TIẾT PRODUCTION

Kiến trúc đã triển khai:

```text
Frontend Next.js App Router
   ↓
API Routes / Server Components
   ↓
lib/rbac + lib/audit
   ↓
Prisma
   ↓
PostgreSQL (Vercel Postgres / Supabase pooler)
   ↓
Auth NextAuth + Authorization middleware
```

Bảng:

```text
User
Faculty
Teacher
Class
Student
Enrollment
Subject
Assignment
AssignmentClass
AssignmentTeacher
Schedule
Attendance
LeaveRequest
WeeklyReport
Issue
Task
AcademicConfig
AuditLog
```

Yêu cầu đã có:

- Password hashing (bcrypt)
- Server-side authorization
- Role-based access control
- Audit log

Yêu cầu vận hành tiếp (chưa bắt buộc trong code):

- Database backup nhà cung cấp
- Archive năm học
- Unicode PDF
- SMTP trường
- File storage

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
"Chỉ thực hiện hạng mục X trên production Next.js."
```

Mỗi task phải:

1. Có phạm vi rõ.
2. Không làm các hạng mục khác.
3. Không refactor không cần thiết.
4. Không sửa UI nếu không liên quan.
5. Không đọc/sửa toàn bộ dự án nếu không cần.
6. Sau khi sửa mới kiểm tra các khu vực bị ảnh hưởng.
7. Phân biệt rõ đang sửa **prototype** (`js/`, `index.html`) hay **production** (`app/`, `prisma/`, `lib/`).

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

Issues phát hiện (không sửa)
- ...
```

---

# 18. QUY TẮC KHÔNG ĐƯỢC PHÁ

### Rule 1

Không biến prototype thành backend khác stack trừ khi người dùng yêu cầu. Production hiện tại **đã là** Next.js + Postgres theo Phase 10. Không tự ý đổi sang stack thứ ba.

### Rule 2

Không xóa localStorage prototype để "fix lỗi".

Không `DELETE FROM` hàng loạt trên Postgres để "fix lỗi".

### Rule 3

Không seed lại DB production làm mất dữ liệu người dùng.

### Rule 4

Không chỉ ẩn dữ liệu bằng UI để tạo cảm giác phân quyền.

Phải lọc data scope thực tế (Prisma `where` / helper rbac).

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

### Rule 11

Không dùng SQLite, file cục bộ, hay DB không hỗ trợ serverless connection pooling cho production.

---

# 19. TIÊU CHÍ CHẤT LƯỢNG

Một thay đổi chỉ được xem là hoàn thành khi:

- Không có lỗi console / build nghiêm trọng.
- Không làm mất dữ liệu cũ.
- Login vẫn hoạt động (cookie HttpOnly trên production).
- Role vẫn hoạt động.
- CRUD liên quan vẫn hoạt động.
- Dashboard không lỗi.
- Mobile không bị phá.
- Export liên quan vẫn hoạt động nếu đụng tới export.
- Migration hoạt động với schema cũ.
- Không có dữ liệu của lớp A lọt sang phạm vi GVCN lớp B.
- API không trả dữ liệu ngoài scope dù client giả URL.

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
      Vấn đề                              Nhật ký
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

## Prototype (giữ để đối chiếu UX)

```text
SPA
Vanilla JS
localStorage gvcn_system_v3
CDN SheetJS / jsPDF
Có thể mở index.html
```

Phù hợp:

- Demo nhanh
- Phát triển UX
- Kiểm tra nghiệp vụ
- Seed mô tả
- Thử nghiệm không cần Postgres

Không phù hợp để coi là hệ thống nhà trường dùng chung.

## Production (đang là đích triển khai Vercel)

```text
Next.js App Router
API Routes
PostgreSQL + pooling
NextAuth cookie HttpOnly
bcrypt
middleware RBAC
AuditLog
Prisma migrate
```

Mọi dữ liệu dùng chung giữa nhiều máy / nhiều GV phải đi qua production.

Không triển khai thêm backend song song chỉ vì thấy prototype còn hạn chế. Bổ sung trên Next.js / Prisma hiện có.

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

Không coi đây là yêu cầu phải port nốt mọi màn prototype trong một task.

---

# 23. TASK HIỆN TẠI ƯU TIÊN

Nếu người dùng chưa chỉ định task khác, ưu tiên vận hành production:

**Gắn database thật, migrate, hoàn thiện UI Next còn thiếu so với prototype, không đụng stack mới.**

Không làm lại Phase 1–9 trên localStorage trừ khi người dùng yêu cầu sửa prototype.

Không seed đè Postgres đang có dữ liệu thật.

---

**END OF PROJECT CONTEXT**
