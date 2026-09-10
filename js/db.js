/* db.js — seed, load/save, academic context */
const KEY = "gvcn_system_v3";
const SESS_KEY = "gvcn_session_v3";
function seed() {
  const classes = [
    { id: "c1", name: "DHKT01", level: "daihoc", year: "2025-2026", note: "Kinh tế — Đại học", homeroomTeacherId: "gv1" },
    { id: "c2", name: "CDCN02", level: "caodang", year: "2025-2026", note: "Công nghệ — Cao đẳng", homeroomTeacherId: "gv1" },
    { id: "c3", name: "TCCN01", level: "trungcap", year: "2025-2026", note: "Công nghệ — Trung cấp", homeroomTeacherId: "gv1" }
  ];
  const students = [
    ["SV001","Nguyễn Minh Anh","Nữ","2005-03-12","c1","0912345001","Nguyễn Văn A","0901111001","Trần Thị B","0901111002","12 Nguyễn Huệ, Q.1","KTX A, P.101","Đang học"],
    ["SV002","Trần Quốc Bảo","Nam","2005-07-21","c1","0912345002","Trần Văn C","0901111003","Lê Thị D","0901111004","45 Lê Lợi, Q.3","KTX A, P.102","Đang học"],
    ["SV003","Lê Gia Hân","Nữ","2005-01-09","c1","0912345003","Lê Văn E","0901111005","Phạm Thị F","0901111006","8 Pasteur, Q.1","Nhà trọ Q. Tân Bình","Cần quan tâm"],
    ["SV004","Phạm Đức Huy","Nam","2004-11-02","c1","0912345004","Phạm Văn G","0901111007","Võ Thị H","0901111008","22 Cách Mạng Tháng 8","KTX B","Đang học"],
    ["SV005","Võ Ngọc Lan","Nữ","2005-05-18","c2","0912345005","Võ Văn I","0901111009","Đặng Thị K","0901111010","3 Hoàng Diệu","KTX C","Cần theo dõi"],
    ["SV006","Đặng Nhật Nam","Nam","2006-02-14","c2","0912345006","Đặng Văn L","0901111011","Bùi Thị M","0901111012","19 Nguyễn Trãi","Nhà riêng","Đang học"],
    ["SV007","Bùi Thanh Tâm","Nữ","2006-09-30","c2","0912345007","Bùi Văn N","0901111013","Ngô Thị O","0901111014","77 Điện Biên Phủ","KTX C","Đang học"],
    ["SV008","Ngô Hoàng Phúc","Nam","2007-04-05","c3","0912345008","Ngô Văn P","0901111015","Lý Thị Q","0901111016","5 Hai Bà Trưng","KTX D","Đang học"],
    ["SV009","Lý Mai Chi","Nữ","2007-08-19","c3","0912345009","Lý Văn R","0901111017","Tạ Thị S","0901111018","31 Võ Văn Tần","KTX D","Cần quan tâm"],
    ["SV010","Tạ Minh Khoa","Nam","2007-12-01","c3","0912345010","Tạ Văn T","0901111019","Hồ Thị U","0901111020","9 Nguyễn Đình Chiểu","Nhà trọ","Đang học"]
  ].map((r, i) => ({
    id: "s" + (i + 1), mssv: r[0], name: r[1], gender: r[2], dob: r[3], classId: r[4],
    phone: r[5], father: r[6], fatherPhone: r[7], mother: r[8], motherPhone: r[9],
    addrThuongTru: r[10], addrCuTru: r[11], status: r[12],
    username: r[0].toLowerCase(), password: "123456",
    officer: i === 0 || i === 4 || i === 7 ? "Lớp trưởng" : "Không"
  }));
  const subjects = [
    { id: "m1", name: "Toán cao cấp", code: "MATH101", credit: 3 },
    { id: "m2", name: "Tin học đại cương", code: "IT101", credit: 3 },
    { id: "m3", name: "Triết học", code: "PHIL101", credit: 2 },
    { id: "m4", name: "Kỹ năng mềm", code: "SS101", credit: 2 },
    { id: "m5", name: "Anh văn 1", code: "ENG101", credit: 3 }
  ];
  const assigns = [
    { id: "a1", subjectId: "m1", classIds: ["c1"], teacherIds: ["gv1"], year: "2025-2026", term: "Học kỳ 1" },
    { id: "a2", subjectId: "m2", classIds: ["c1", "c2"], teacherIds: ["gv1"], year: "2025-2026", term: "Học kỳ 1" },
    { id: "a3", subjectId: "m5", classIds: ["c1"], teacherIds: ["gv1"], year: "2025-2026", term: "Học kỳ 1" },
    { id: "a4", subjectId: "m4", classIds: ["c2", "c3"], teacherIds: ["gv1"], year: "2025-2026", term: "Học kỳ 1" }
  ];
  const attendance = [
    { id: "at1", studentId: "s3", subjectId: "m1", scheduleId: "sch1", date: todayISO(), status: "Vắng", note: "Không phép" },
    { id: "at2", studentId: "s2", subjectId: "m1", scheduleId: "sch1", date: todayISO(), status: "Trễ", note: "15 phút" },
    { id: "at3", studentId: "s5", subjectId: "m2", scheduleId: "sch3", date: todayISO(), status: "Vắng", note: "Có phép" }
  ];
  const leaves = [
    { id: "lv1", studentId: "s3", from: todayISO(), to: todayISO(), reason: "Ốm, khám bệnh", status: "Chờ duyệt", source: "Form", createdAt: new Date().toISOString() }
  ];
  return {
    config: {
      year: "2025-2026",
      term: "Học kỳ 1",
      week: 8,
      yearStart: "2025-09-01",
      weeksPerTerm: 22
    },
    admin: { name: "Quản trị hệ thống", username: "admin", password: "123456" },
    faculties: [
      { id: "k1", name: "Kinh tế", locked: false },
      { id: "k2", name: "Công nghệ thông tin", locked: false },
      { id: "k3", name: "Cơ khí", locked: false }
    ],
    teachers: [{
      id: "gv1", name: "Nguyễn Thị Hồng", dob: "1988-05-12",
      position: "Giảng viên", title: "Giáo viên chủ nhiệm", facultyId: "k1",
      username: "gv", password: "123456", active: true, gmail: "", gmailNotify: false
    }],
    classes, students, subjects, assigns, attendance, leaves,
    reports: [{
      id: "rp1", studentId: "s1", week: 8, year: "2025-2026", term: "Học kỳ 1",
      answers: { ABSENT: "0", LATE: "0", LEARNING: "Tốt", DIFFICULTY: "Không", SUPPORT: "Không", MOTIVATION: "Ổn định" },
      createdAt: new Date().toISOString()
    }],
    tasks: [
      { id: "t1", title: "Họp lớp đầu tuần", date: todayISO(), type: "Hôm nay", done: false },
      { id: "t2", title: "Duyệt đơn nghỉ phép", date: todayISO(), type: "Hôm nay", done: false },
      { id: "t3", title: "Nhập điểm danh môn Toán", date: todayISO(), type: "Tuần này", done: false },
      { id: "t4", title: "Nộp báo cáo tuần lên khoa", date: todayISO(), type: "Tuần này", done: false }
    ],
    schedule: [
      { id: "sch1", day: "Thứ 2", start: "07:30", end: "09:15", subjectId: "m1", classId: "c1" },
      { id: "sch2", day: "Thứ 3", start: "09:20", end: "11:00", subjectId: "m2", classId: "c1" },
      { id: "sch3", day: "Thứ 3", start: "09:20", end: "11:00", subjectId: "m2", classId: "c2" },
      { id: "sch4", day: "Thứ 4", start: "13:00", end: "14:40", subjectId: "m5", classId: "c1" },
      { id: "sch5", day: "Thứ 5", start: "07:30", end: "09:15", subjectId: "m4", classId: "c2" },
      { id: "sch6", day: "Thứ 5", start: "07:30", end: "09:15", subjectId: "m4", classId: "c3" },
      { id: "sch7", day: "Thứ 6", start: "09:20", end: "11:00", subjectId: "m2", classId: "c2" }
    ],
    issues: [
      { id: "is1", studentId: "s3", type: "Nghiêm trọng", text: "Nghỉ không phép 2 buổi liên tiếp", week: 8, year: "2025-2026", term: "Học kỳ 1", source: "teacher", status: "Pending", reported: false, date: todayISO() },
      { id: "is2", studentId: "s5", type: "Cần hỗ trợ", text: "Gia đình khó khăn, hay đi trễ", week: 8, year: "2025-2026", term: "Học kỳ 1", source: "teacher", status: "In Progress", reported: true, date: todayISO() }
    ],
    mailLog: [],
    auditLog: []
  };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { const s = seed(); save(s); return s; }
    const db = migrate(JSON.parse(raw));
    save(db);
    return db;
  } catch { const s = seed(); save(s); return s; }
}
function save(db) { localStorage.setItem(KEY, JSON.stringify(db)); }
function audit(action, entity, entityId, detail) {
  if (!DB.auditLog) DB.auditLog = [];
  DB.auditLog.push({
    id: uid("au"),
    actorId: SESSION?.teacherId || SESSION?.studentId || SESSION?.username || "",
    actorRole: SESSION?.role || "",
    actorName: SESSION?.name || "",
    action,
    entity,
    entityId: entityId || "",
    timestamp: new Date().toISOString(),
    detail: detail || ""
  });
}

let DB = load();
