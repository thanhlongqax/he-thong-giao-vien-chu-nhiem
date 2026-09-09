/************************************************************
 * HỆ THỐNG QUẢN LÝ LỚP PHÂN HỆ – GVCN  v2
 ************************************************************/
const KEY = "gvcn_system_v3";
const SESS_KEY = "gvcn_session_v3";
const MONTHS_VI = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
const WEEKDAYS = ["Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7","Chủ nhật"];
const ICO_DOTS = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="2.1" fill="#111"/><circle cx="12" cy="12" r="2.1" fill="#111"/><circle cx="18" cy="12" r="2.1" fill="#111"/></svg>';
const ICO_EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3" fill="#111"/></svg>';
function pwToggleBtn(id) {
  return `<button class="pw-toggle" type="button" onclick="togglePw('${id}', this)" aria-label="Hiện mật khẩu">${ICO_DOTS}</button>`;
}
const QUESTION = {
  STUDENT: "Họ và tên",
  WEEK: "Tuần học",
  ABSENT: "Trong tuần này, em nghỉ bao nhiêu buổi?",
  LATE: "Trong tuần này, em đi trễ bao nhiêu buổi?",
  ABSENT_SESSION: "Nếu có nghỉ, em nghỉ buổi nào?",
  ABSENT_REASON: "Lý do nghỉ hoặc đi trễ",
  REPORTED: "Nếu nghỉ hoặc đi trễ, em đã báo giáo viên chưa?",
  LEARNING: "Tự đánh giá tình hình học tập tuần này",
  DIFFICULTY: "Em có gặp khó khăn trong học tập không?",
  DIFFICULTY_DETAIL: "Em đang gặp khó khăn gì?",
  SUBJECT: "Môn học nào đang gặp khó khăn?",
  ASSIGNMENT: "Em có bài tập hoặc nhiệm vụ chưa hoàn thành không?",
  MOTIVATION: "Tình trạng học tập và động lực của em",
  IMPACT: "Có vấn đề nào đang ảnh hưởng đến việc học của em không?",
  SUPPORT: "Em có cần GVCN hỗ trợ không?",
  PRIVATE: "Em có muốn trao đổi riêng với GVCN không?",
  SUPPORT_DETAIL: "Em muốn GVCN hỗ trợ vấn đề gì?",
  OTHER: "Điều gì khác em muốn GVCN biết?"
};

const LEVELS = [
  { id: "daihoc", name: "Đại học", mark: "ĐH" },
  { id: "caodang", name: "Cao đẳng", mark: "CĐ" },
  { id: "trungcap", name: "Trung cấp", mark: "TC" }
];
const STATUS = ["Đang học", "Bảo lưu", "Đình chỉ", "Tốt nghiệp", "Nghỉ học", "Cần quan tâm", "Cần theo dõi"];
const ROLES_CS = ["Lớp trưởng", "Lớp phó học tập", "Lớp phó đời sống", "Bí thư", "Thủ quỹ", "Không"];

function uid(p = "id") { return p + "_" + Math.random().toString(36).slice(2, 9); }
function todayISO() {
  const d = new Date();
  const z = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
function validPhone(s) {
  if (!s) return true;
  return /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(String(s).replace(/\s/g, ""));
}
function validEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
}
function fmtDate(s) {
  if (!s) return "—";
  const [y, m, d] = String(s).slice(0, 10).split("-");
  return d && m && y ? `${d}/${m}/${y}` : s;
}

function seed() {
  const classes = [
    { id: "c1", name: "DHKT01", level: "daihoc", year: "2025-2026", note: "Kinh tế — Đại học" },
    { id: "c2", name: "CDCN02", level: "caodang", year: "2025-2026", note: "Công nghệ — Cao đẳng" },
    { id: "c3", name: "TCCN01", level: "trungcap", year: "2025-2026", note: "Công nghệ — Trung cấp" }
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
    { id: "a1", subjectId: "m1", classIds: ["c1"], year: "2025-2026", term: "Học kỳ 1" },
    { id: "a2", subjectId: "m2", classIds: ["c1", "c2"], year: "2025-2026", term: "Học kỳ 1" },
    { id: "a3", subjectId: "m5", classIds: ["c1"], year: "2025-2026", term: "Học kỳ 1" },
    { id: "a4", subjectId: "m4", classIds: ["c2", "c3"], year: "2025-2026", term: "Học kỳ 1" }
  ];
  const attendance = [
    { id: "at1", studentId: "s3", subjectId: "m1", date: todayISO(), status: "Vắng", note: "Không phép" },
    { id: "at2", studentId: "s2", subjectId: "m1", date: todayISO(), status: "Trễ", note: "15 phút" },
    { id: "at3", studentId: "s5", subjectId: "m2", date: todayISO(), status: "Vắng", note: "Có phép" }
  ];
  const leaves = [
    { id: "lv1", studentId: "s3", from: todayISO(), to: todayISO(), reason: "Ốm, khám bệnh", status: "Chờ duyệt", source: "Form", createdAt: new Date().toISOString() }
  ];
  return {
    config: {
      year: "2025-2026",
      term: "Học kỳ 1",
      week: 8,
      gmailNotify: true,
      gmail: ""
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
    teacher: { name: "Nguyễn Thị Hồng", username: "gv", password: "123456" },
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
      { id: "sch1", day: "Thứ 2", start: "07:30", end: "09:15", subject: "Toán cao cấp", classId: "c1" },
      { id: "sch2", day: "Thứ 3", start: "09:20", end: "11:00", subject: "Tin học đại cương", classId: "c1" },
      { id: "sch3", day: "Thứ 3", start: "09:20", end: "11:00", subject: "Tin học đại cương", classId: "c2" },
      { id: "sch4", day: "Thứ 4", start: "13:00", end: "14:40", subject: "Anh văn 1", classId: "c1" },
      { id: "sch5", day: "Thứ 5", start: "07:30", end: "09:15", subject: "Kỹ năng mềm", classId: "c2" },
      { id: "sch6", day: "Thứ 5", start: "07:30", end: "09:15", subject: "Kỹ năng mềm", classId: "c3" },
      { id: "sch7", day: "Thứ 6", start: "09:20", end: "11:00", subject: "Tin học đại cương", classId: "c2" }
    ],
    issues: [
      { id: "is1", studentId: "s3", type: "Nghiêm trọng", text: "Nghỉ không phép 2 buổi liên tiếp", week: 8, reported: false, date: todayISO() },
      { id: "is2", studentId: "s5", type: "Cần hỗ trợ", text: "Gia đình khó khăn, hay đi trễ", week: 8, reported: true, date: todayISO() }
    ],
    mailLog: []
  };
}

function migrate(db) {
  if (!db.config) db.config = seed().config;
  if (!Array.isArray(db.mailLog)) db.mailLog = [];
  if (!db.admin) db.admin = { name: "Quản trị hệ thống", username: "admin", password: "123456" };
  if (!Array.isArray(db.faculties) || !db.faculties.length) {
    db.faculties = [
      { id: "k1", name: "Kinh tế", locked: false },
      { id: "k2", name: "Công nghệ thông tin", locked: false },
      { id: "k3", name: "Cơ khí", locked: false }
    ];
  }
  if (!Array.isArray(db.teachers)) {
    db.teachers = [{
      id: "gv1",
      name: db.teacher?.name || "Nguyễn Thị Hồng",
      dob: "1988-05-12",
      position: "Giảng viên",
      title: "Giáo viên chủ nhiệm",
      faculty: "Kinh tế",
      username: db.teacher?.username || "gv",
      password: db.teacher?.password || "123456",
      facultyId: "k1",
      active: true
    }];
  }
  db.teachers.forEach(t => {
    if (!t.facultyId) {
      const f = (db.faculties || []).find(x => x.name === t.faculty);
      t.facultyId = f?.id || (db.faculties?.[0]?.id || "");
    }
    if (t.active === undefined) t.active = true;
    if (t.gmail === undefined) t.gmail = "";
    if (t.gmailNotify === undefined) t.gmailNotify = false;
  });
  (db.assigns || []).forEach(a => {
    if (!a.teacherIds) a.teacherIds = [];
  });
  (db.tasks || []).forEach(t => { if (!t.session) t.session = "Cả ngày"; });
  (db.leaves || []).forEach(l => { if (!l.session) l.session = "Cả ngày"; });
  (db.assigns || []).forEach(a => {
    if (!a.classIds) a.classIds = a.classId ? [a.classId] : [];
  });
  if (Array.isArray(db.schedule) && db.schedule.length && !db.schedule[0].id) {
    db.schedule = db.schedule.map((s, i) => ({
      id: "sch" + (i + 1), day: s.day, start: "07:30", end: "09:15",
      subject: String(s.slots || "").replace(/^\d.?\d*\s*/, ""), classId: "c1"
    }));
  }
  return db;
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { const s = seed(); save(s); return s; }
    return migrate(JSON.parse(raw));
  } catch { const s = seed(); save(s); return s; }
}
function save(db) { localStorage.setItem(KEY, JSON.stringify(db)); }

let DB = load();
let SESSION = null;
let VIEW = "dash";
let CLS_LEVEL = null;
let CLS_ID = null;
let editTarget = null;
let REP_MODE = "week";
let CAL_CURSOR = new Date();
let LV_FILTER = { period: "week", pending: false, classId: "", studentId: "" };
let TASK_FILTER = "today";
let TASK_DATE = "";
let WR_FILTER = { classId: "", q: "", period: "week" };
let WEEK_STEP = 1;
let WEEK_DRAFT = {};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function togglePw(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  el.type = el.type === "password" ? "text" : "password";
  if (btn) {
    const hidden = el.type === "password";
    btn.innerHTML = hidden ? ICO_DOTS : ICO_EYE;
    btn.setAttribute("aria-label", hidden ? "Hiện mật khẩu" : "Ẩn mật khẩu");
  }
}
function weekdayOf(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return ["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"][d.getDay()];
}
function facultyName(id) {
  return (DB.faculties || []).find(f => f.id === id)?.name || id || "—";
}
function dateSelectHTML(prefix, value) {
  const [yy, mm, dd] = String(value || "").split("-");
  const yNow = new Date().getFullYear();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 60 }, (_, i) => yNow - 10 - i);
  return `<div class="date-row">
    <select id="${prefix}D"><option value="">Ngày</option>${days.map(d => `<option value="${String(d).padStart(2,"0")}" ${dd===String(d).padStart(2,"0")?"selected":""}>Ngày ${d}</option>`).join("")}</select>
    <select id="${prefix}M"><option value="">Tháng</option>${MONTHS_VI.map((m,i)=>`<option value="${String(i+1).padStart(2,"0")}" ${mm===String(i+1).padStart(2,"0")?"selected":""}>${m}</option>`).join("")}</select>
    <select id="${prefix}Y"><option value="">Năm</option>${years.map(y=>`<option ${yy===String(y)?"selected":""}>${y}</option>`).join("")}</select>
  </div>`;
}
function readDateSelect(prefix) {
  const d = document.getElementById(prefix + "D")?.value;
  const m = document.getElementById(prefix + "M")?.value;
  const y = document.getElementById(prefix + "Y")?.value;
  if (!d || !m || !y) return "";
  return `${y}-${m}-${d}`;
}
function persistSession() {
  if (SESSION) localStorage.setItem(SESS_KEY, JSON.stringify(SESSION));
  else localStorage.removeItem(SESS_KEY);
}
function restoreSession() {
  try {
    const raw = localStorage.getItem(SESS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}
function currentTeacher() {
  if (SESSION?.role !== "gv") return null;
  return DB.teachers.find(t => t.id === SESSION.teacherId || t.username === SESSION.username) || DB.teachers[0];
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}
function className(id) { return DB.classes.find(c => c.id === id)?.name || "—"; }
function studentById(id) { return DB.students.find(s => s.id === id); }
function subjectName(id) { return DB.subjects.find(s => s.id === id)?.name || "—"; }
function classNames(ids) { return (ids || []).map(className).join(", "); }
function phoneOkOrWarn(v, label) {
  if (v && !validPhone(v)) { toast(label + " không hợp lệ (VD: 0912345678)"); return false; }
  return true;
}
function closeSidebar() {
  $("#sidebar")?.classList.remove("open");
  $("#backdrop")?.classList.remove("show");
}

/* ================= LOGIN ================= */
function loginFail() {
  const err = $("#loginErr");
  if (err) err.classList.add("show");
  toast("Tài khoản hoặc mật khẩu không đúng");
}
function tryAdmin(user, pass) {
  return user === DB.admin.username && pass === DB.admin.password
    ? { role: "ad", name: DB.admin.name, username: DB.admin.username } : null;
}
function tryTeacher(user, pass) {
  const gv = DB.teachers.find(t => t.username === user && t.password === pass);
  if (!gv) return null;
  if (gv.active === false) { toast("Tài khoản giáo viên đang không hoạt động"); return "inactive"; }
  return { role: "gv", name: gv.name, username: gv.username, teacherId: gv.id };
}
function tryStudent(user, pass) {
  const st = DB.students.find(s => (s.username === user.toLowerCase() || s.mssv === user.toUpperCase()) && s.password === pass);
  return st ? { role: "sv", studentId: st.id, name: st.name } : null;
}
function login() {
  $("#loginErr")?.classList.remove("show");
  const role = $(".role-pills button.active")?.dataset.role || "auto";
  const user = $("#loginUser").value.trim();
  const pass = $("#loginPass").value;
  if (!user || !pass) { loginFail(); return; }
  let sess = null;
  if (role === "auto") sess = tryAdmin(user, pass) || tryTeacher(user, pass) || tryStudent(user, pass);
  else if (role === "ad") sess = tryAdmin(user, pass);
  else if (role === "gv") sess = tryTeacher(user, pass);
  else sess = tryStudent(user, pass);
  if (sess === "inactive") return;
  if (sess) { SESSION = sess; persistSession(); enterApp(); return; }
  loginFail();
}
function logout() {
  SESSION = null;
  persistSession();
  closeSidebar();
  $("#app").classList.add("app-hidden");
  $("#loginScreen").classList.remove("app-hidden");
}
function enterApp() {
  $("#loginScreen").classList.add("app-hidden");
  $("#app").classList.remove("app-hidden");
  renderShell();
}

function renderShell() {
  const isGV = SESSION.role === "gv";
  const isAD = SESSION.role === "ad";
  const groupsGV = [
    ["Lớp & sinh viên", [["dash","Tổng quan"],["classes","Lớp chủ nhiệm"],["students","Sinh viên"],["homeroom","Phân hệ"]]],
    ["Giảng dạy", [["subjects","Môn học"],["schedule","Lịch học"],["attend","Điểm danh"]]],
    ["Theo dõi", [["work","Công việc"],["leave","Nghỉ phép"],["weekReports","Báo cáo tuần"],["report","Báo cáo"]]],
    ["Cá nhân", [["gvconfig","Cấu hình"],["pw","Đổi mật khẩu"]]]
  ];
  const groupsSV = [
    ["Cổng sinh viên", [["svinfo","Thông tin"],["svleave","Nghỉ phép"],["svweek","Báo cáo tuần"],["pw","Đổi mật khẩu"]]]
  ];
  const groupsAD = [
    ["Quản trị", [["teachers","Giáo viên"],["faculties","Khoa"],["config","Cấu hình"],["pw","Đổi mật khẩu"]]]
  ];
  const groups = isAD ? groupsAD : isGV ? groupsGV : groupsSV;
  const nav = groups.flatMap(g => g[1]);
  if (!nav.some(x => x[0] === VIEW)) VIEW = nav[0][0];
  const brandTitle = isAD ? "Hệ thống quản lý lớp học" : isGV ? "Hệ thống quản lý lớp học" : "Hệ thống quản lý lớp học hỗ trợ sinh viên";
  const brandSub = isAD ? "Quản trị" : isGV ? "Giáo viên chủ nhiệm" : "Cổng sinh viên";
  if ($("#mobileTitle")) $("#mobileTitle").textContent = isAD ? "Quản trị" : isGV ? "Quản lý lớp học" : "Hỗ trợ sinh viên";
  $("#sidebar").innerHTML = `
    <div class="side-brand">
      <img class="logo-img" src="assets/logo.svg" alt="Logo">
      <div><b>${brandTitle}</b><span>${brandSub}</span></div>
    </div>
    <div class="nav">${groups.map(([label, items]) =>
      `<div class="nav-label">${label}</div>${items.map(([id, lb]) => `<button data-view="${id}">${lb}</button>`).join("")}`
    ).join("")}</div>
    <div class="side-user">
      <div class="avatar">${SESSION.name.slice(0,1)}</div>
      <div style="flex:1">
        <b style="font-size:13px;color:#fff">${SESSION.name}</b>
        <div class="muted" style="color:#dcfce7">${isAD ? "Quản trị" : isGV ? "Giáo viên chủ nhiệm" : "Sinh viên"}</div>
      </div>
      <button class="btn btn-sm btn-ghost" onclick="logout()">Thoát</button>
    </div>`;
  $$("#sidebar .nav button").forEach(b => b.onclick = () => {
    VIEW = b.dataset.view;
    closeSidebar();
    paint();
  });
  paint();
}

function topMeta() {
  return `<div class="chips">
    <div class="chip">Năm học: <strong>${DB.config.year}</strong></div>
    <div class="chip">Kỳ hiện tại: <strong>${DB.config.term}</strong></div>
    <div class="chip">Tuần: <strong>${DB.config.week}</strong></div>
  </div>`;
}

function paint() {
  $$("#sidebar .nav button").forEach(b => b.classList.toggle("active", b.dataset.view === VIEW));
  const map = {
    dash: viewDash, classes: viewClasses, students: viewStudents, homeroom: viewHomeroom,
    subjects: viewSubjects, attend: viewAttend, work: viewWork, schedule: viewSchedule,
    report: viewReport, leave: viewLeave, config: viewConfig, teachers: viewTeachers,
    pw: viewPassword, faculties: viewFaculties, gvconfig: viewGvConfig, weekReports: viewWeekReports,
    svinfo: viewSvInfo, svleave: viewSvLeave, svweek: viewSvWeek
  };
  (map[VIEW] || viewDash)();
}

/* ================= DASH ================= */
function viewDash() {
  const n = DB.students.length;
  const late = DB.attendance.filter(a => a.status === "Trễ").length;
  const abs = DB.attendance.filter(a => a.status === "Vắng").length;
  const pend = DB.leaves.filter(l => l.status === "Chờ duyệt").length;
  const care = DB.students.filter(s => s.status === "Cần quan tâm" || s.status === "Cần theo dõi").length;
  const todayTasks = DB.tasks.filter(t => t.type === "Hôm nay" || t.date === todayISO());
  const todo = todayTasks.filter(t => !t.done);
  const done = todayTasks.filter(t => t.done);
  const missingRep = DB.students.filter(s => !DB.reports.some(r => r.studentId===s.id && r.week===DB.config.week && r.year===DB.config.year && r.term===DB.config.term));
  $("#main").innerHTML = `
    <div class="topbar"><div><h2>Tổng quan</h2><p class="muted">Xin chào, ${SESSION.name}</p></div>${topMeta()}</div>
    <div class="grid g-4">
      <div class="stat"><div class="k">Sinh viên</div><div class="v">${n}</div></div>
      <div class="stat"><div class="k">Đơn phép chờ</div><div class="v">${pend}</div></div>
      <div class="stat"><div class="k">Vắng / trễ</div><div class="v">${abs} / ${late}</div></div>
      <div class="stat"><div class="k">Cần quan tâm</div><div class="v">${care}</div></div>
    </div>
    <div class="grid g-2" style="margin-top:14px">
      <div class="card task-todo">
        <h3>Hôm nay · Chưa hoàn thành <span class="badge warn">${todo.length}</span></h3>
        ${todo.map(t => `
          <label style="display:flex;gap:8px;align-items:center;margin:8px 0">
            <input type="checkbox" onchange="toggleTask('${t.id}')"> ${t.title}
          </label>`).join("") || "<p class='empty'>Đã xong hết việc hôm nay</p>"}
      </div>
      <div class="card task-done">
        <h3>Hôm nay · Hoàn thành <span class="badge ok">${done.length}</span></h3>
        ${done.map(t => `
          <label style="display:flex;gap:8px;align-items:center;margin:8px 0;opacity:.8">
            <input type="checkbox" checked onchange="toggleTask('${t.id}')"> ${t.title}
          </label>`).join("") || "<p class='empty'>Chưa có việc hoàn thành</p>"}
      </div>
    </div>
    <div class="card" style="margin-top:14px">
      <h3>Việc cần xử lý hôm nay</h3>
      <div class="action-row" onclick="VIEW='leave';paint()">
        <div><b>Đơn phép chờ duyệt</b><div class="muted">Duyệt hoặc từ chối đơn mới</div></div>
        <span class="badge ${pend?"warn":"ok"}">${pend}</span>
      </div>
      <div class="action-row" onclick="VIEW='work';paint()">
        <div><b>Công việc chưa hoàn thành</b><div class="muted">Việc đã đặt cho hôm nay</div></div>
        <span class="badge ${todo.length?"warn":"ok"}">${todo.length}</span>
      </div>
      <div class="action-row" onclick="VIEW='weekReports';paint()">
        <div><b>Chưa nộp báo cáo tuần ${DB.config.week}</b><div class="muted">Sinh viên còn thiếu báo cáo</div></div>
        <span class="badge ${missingRep.length?"warn":"ok"}">${missingRep.length}</span>
      </div>
    </div>
    <div class="grid g-2" style="margin-top:14px">
      <div class="card">
        <h3>Cảnh báo lớp</h3>
        ${DB.issues.length ? DB.issues.map(i => {
          const s = studentById(i.studentId);
          return `<div style="padding:8px 0;border-bottom:1px solid var(--line)">
            <b>${s?.name}</b> · <span class="badge ${i.type==="Nghiêm trọng"?"bad":"warn"}">${i.type}</span>
            <div class="muted">${i.text}</div></div>`;
        }).join("") : `<div class="empty-box"><div class="ico">✓</div><p>Không có cảnh báo</p></div>`}
      </div>
      <div class="card">
        <h3>Hôm nay đã xong</h3>
        ${done.length ? done.map(t => `<p class="muted">✓ ${t.title}</p>`).join("") : `<div class="empty-box"><div class="ico">–</div><p>Chưa có việc hoàn thành</p></div>`}
      </div>
    </div>`;
}
function toggleTask(id) {
  const t = DB.tasks.find(x => x.id === id);
  if (t) { t.done = !t.done; save(DB); paint(); }
}

/* ================= CLASSES ================= */
function viewClasses() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Quản lý lớp chủ nhiệm</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <input class="search" id="qClass" placeholder="Tìm lớp..." oninput="renderClassTable()">
        <button class="btn btn-primary" onclick="openClassModal()">Thêm lớp</button>
      </div>
      <div id="classTable" class="table-wrap"></div>
    </div>`;
  renderClassTable();
}
function renderClassTable() {
  const q = ($("#qClass")?.value || "").toLowerCase();
  const rows = DB.classes.filter(c => (c.name + c.note).toLowerCase().includes(q));
  $("#classTable").innerHTML = `<table><thead><tr><th>Lớp</th><th>Phân hệ</th><th>Năm học</th><th>Sĩ số</th><th>Ghi chú</th><th></th></tr></thead><tbody>
    ${rows.map(c => {
      const lv = LEVELS.find(l => l.id === c.level)?.name || c.level;
      const n = DB.students.filter(s => s.classId === c.id).length;
      return `<tr><td><b>${c.name}</b></td><td>${lv}</td><td>${c.year}</td><td>${n}</td><td>${c.note||""}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-sm btn-ghost" onclick="openClassModal('${c.id}')">Sửa</button>
          <button class="btn btn-sm btn-danger" onclick="delClass('${c.id}')">Xóa</button>
        </td></tr>`;
    }).join("")}</tbody></table>`;
}
function openClassModal(id) {
  editTarget = id ? DB.classes.find(c => c.id === id) : null;
  const c = editTarget || { name: "", level: "daihoc", year: DB.config.year, note: "" };
  showModal(`<h3>${id ? "Sửa" : "Thêm"} lớp chủ nhiệm</h3>
    <div class="form-grid">
      <div class="field"><label>Tên lớp</label><input id="fName" value="${c.name}"></div>
      <div class="field"><label>Phân hệ</label>
        <select id="fLevel">${LEVELS.map(l => `<option value="${l.id}" ${c.level===l.id?"selected":""}>${l.name}</option>`).join("")}</select>
      </div>
      <div class="field"><label>Năm học</label><input id="fYear" value="${c.year}"></div>
      <div class="field span-2"><label>Ghi chú</label><input id="fNote" value="${c.note||""}"></div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveClass()">Lưu</button>
    </div>`);
}
function saveClass() {
  const rec = { name: $("#fName").value.trim(), level: $("#fLevel").value, year: $("#fYear").value.trim(), note: $("#fNote").value.trim() };
  if (!rec.name) return toast("Nhập tên lớp");
  if (editTarget) Object.assign(editTarget, rec);
  else DB.classes.push({ id: uid("c"), ...rec });
  save(DB); hideModal(); paint(); toast("Đã lưu lớp");
}
function delClass(id) {
  if (!confirm("Xóa lớp này?")) return;
  DB.classes = DB.classes.filter(c => c.id !== id);
  save(DB); paint(); toast("Đã xóa lớp");
}

/* ================= STUDENTS ================= */
function viewStudents() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Quản lý sinh viên</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <input class="search" id="qSv" placeholder="Tìm tên, MSSV, SĐT..." oninput="renderSvTable()">
        <select id="fClassFilter" onchange="renderSvTable()">
          <option value="">Tất cả lớp</option>
          ${DB.classes.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}
        </select>
        <button class="btn btn-primary" onclick="openSvModal()">Thêm SV</button>
        <button class="btn btn-ghost" onclick="document.getElementById('fileImp').click()">Nhập Excel / JSON</button>
        <input type="file" id="fileImp" accept=".xlsx,.xls,.json,.csv" hidden onchange="importFile(event)">
        <button class="btn btn-outline" onclick="exportSvExcel()">Xuất Excel mẫu</button>
      </div>
      <div id="svTable" class="table-wrap"></div>
    </div>`;
  renderSvTable();
}
function renderSvTable() {
  const q = ($("#qSv")?.value || "").toLowerCase();
  const cf = $("#fClassFilter")?.value || "";
  const rows = DB.students.filter(s => {
    if (cf && s.classId !== cf) return false;
    return [s.mssv, s.name, s.phone, s.status].join(" ").toLowerCase().includes(q);
  });
  $("#svTable").innerHTML = `<table><thead><tr>
    <th>MSSV</th><th>Họ tên</th><th>GT</th><th>Lớp</th><th>SĐT</th><th>Tình trạng</th><th>Cán sự</th><th></th>
  </tr></thead><tbody>
    ${rows.map(s => `<tr>
      <td>${s.mssv}</td><td><b>${s.name}</b><div class="muted">${s.username}</div></td>
      <td>${s.gender}</td><td>${className(s.classId)}</td><td>${s.phone}</td>
      <td><span class="badge ${s.status.includes("Cần")?"warn":s.status==="Đang học"?"ok":"info"}">${s.status}</span></td>
      <td>${s.officer !== "Không" ? s.officer : "—"}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-sm btn-ghost" onclick="openSvModal('${s.id}')">Sửa</button>
        <button class="btn btn-sm btn-outline" onclick="resetPw('${s.id}')">Cấp lại MK</button>
        <button class="btn btn-sm btn-danger" onclick="delSv('${s.id}')">Xóa</button>
      </td>
    </tr>`).join("")}
  </tbody></table>
  <p class="muted" style="margin-top:8px">${rows.length} sinh viên</p>`;
}
function openSvModal(id) {
  editTarget = id ? DB.students.find(s => s.id === id) : null;
  const s = editTarget || {
    mssv:"", name:"", gender:"Nam", dob:"", classId: DB.classes[0]?.id || "",
    phone:"", father:"", fatherPhone:"", mother:"", motherPhone:"",
    addrThuongTru:"", addrCuTru:"", status:"Đang học", username:"", password:"123456", officer:"Không"
  };
  showModal(`<h3>${id ? "Sửa" : "Thêm"} sinh viên</h3>
    <div class="form-grid">
      <div class="field"><label>MSSV</label><input id="svMssv" value="${s.mssv}"></div>
      <div class="field"><label>Họ và tên</label><input id="svName" value="${s.name}"></div>
      <div class="field"><label>Giới tính</label>
        <select id="svGender"><option ${s.gender==="Nam"?"selected":""}>Nam</option><option ${s.gender==="Nữ"?"selected":""}>Nữ</option></select>
      </div>
      <div class="field span-2"><label>Ngày sinh</label>${dateSelectHTML("svDob", s.dob)}</div>
      <div class="field"><label>Lớp</label>
        <select id="svClass">${DB.classes.map(c=>`<option value="${c.id}" ${s.classId===c.id?"selected":""}>${c.name}</option>`).join("")}</select>
      </div>
      <div class="field"><label>SĐT sinh viên</label><input id="svPhone" value="${s.phone}" placeholder="0912345678"></div>
      <div class="field"><label>Họ tên cha</label><input id="svFa" value="${s.father||""}"></div>
      <div class="field"><label>SĐT cha</label><input id="svFaP" value="${s.fatherPhone||""}"></div>
      <div class="field"><label>Họ tên mẹ</label><input id="svMo" value="${s.mother||""}"></div>
      <div class="field"><label>SĐT mẹ</label><input id="svMoP" value="${s.motherPhone||""}"></div>
      <div class="field span-2"><label>Địa chỉ thường trú</label><input id="svTT" value="${s.addrThuongTru||""}"></div>
      <div class="field span-2"><label>Địa chỉ cư trú</label><input id="svCT" value="${s.addrCuTru||""}"></div>
      <div class="field"><label>Tình trạng</label>
        <select id="svSt">${STATUS.map(x=>`<option ${s.status===x?"selected":""}>${x}</option>`).join("")}</select>
      </div>
      <div class="field"><label>Ban cán sự</label>
        <select id="svOff">${ROLES_CS.map(x=>`<option ${s.officer===x?"selected":""}>${x}</option>`).join("")}</select>
      </div>
      <div class="field"><label>Tài khoản</label><input id="svUser" value="${s.username}"></div>
      <div class="field"><label>Mật khẩu</label>
        <div class="pw-wrap">
          <input id="svPass" type="password" value="${s.password}">
          ${pwToggleBtn("svPass")}
        </div>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveSv()">Lưu</button>
    </div>`);
}
function saveSv() {
  const rec = {
    mssv: $("#svMssv").value.trim().toUpperCase(),
    name: $("#svName").value.trim(),
    gender: $("#svGender").value,
    dob: readDateSelect("svDob"),
    classId: $("#svClass").value,
    phone: $("#svPhone").value.trim(),
    father: $("#svFa").value.trim(),
    fatherPhone: $("#svFaP").value.trim(),
    mother: $("#svMo").value.trim(),
    motherPhone: $("#svMoP").value.trim(),
    addrThuongTru: $("#svTT").value.trim(),
    addrCuTru: $("#svCT").value.trim(),
    status: $("#svSt").value,
    officer: $("#svOff").value,
    username: ($("#svUser").value.trim() || $("#svMssv").value.trim()).toLowerCase(),
    password: $("#svPass").value || "123456"
  };
  if (!rec.mssv || !rec.name) return toast("Nhập MSSV và họ tên");
  if (!phoneOkOrWarn(rec.phone, "SĐT sinh viên")) return;
  if (!phoneOkOrWarn(rec.fatherPhone, "SĐT cha")) return;
  if (!phoneOkOrWarn(rec.motherPhone, "SĐT mẹ")) return;
  if (editTarget) Object.assign(editTarget, rec);
  else {
    if (DB.students.some(s => s.mssv === rec.mssv)) return toast("MSSV đã tồn tại");
    DB.students.push({ id: uid("s"), ...rec });
  }
  save(DB); hideModal(); paint(); toast("Đã lưu sinh viên");
}
function delSv(id) {
  if (!confirm("Xóa sinh viên?")) return;
  DB.students = DB.students.filter(s => s.id !== id);
  save(DB); paint(); toast("Đã xóa");
}
function resetPw(id) {
  const s = studentById(id);
  const nw = "Sv@" + Math.random().toString(36).slice(2, 8);
  s.password = nw;
  save(DB);
  alert("Mật khẩu mới của " + s.name + ":\n\n" + nw);
  toast("Đã cấp lại mật khẩu");
}
function exportSvExcel() {
  const rows = DB.students.map(s => ({
    mssv: s.mssv, name: s.name, gender: s.gender, dob: s.dob, class: className(s.classId),
    phone: s.phone, father: s.father, fatherPhone: s.fatherPhone, mother: s.mother, motherPhone: s.motherPhone,
    addrThuongTru: s.addrThuongTru, addrCuTru: s.addrCuTru, status: s.status, username: s.username, password: s.password
  }));
  const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{
    mssv:"SV011", name:"Nguyễn Văn Mẫu", gender:"Nam", dob:"2005-01-01", class:"DHKT01",
    phone:"0912345678", father:"", fatherPhone:"", mother:"", motherPhone:"",
    addrThuongTru:"", addrCuTru:"", status:"Đang học", username:"sv011", password:"123456"
  }]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SinhVien");
  XLSX.writeFile(wb, "danh_sach_sinh_vien.xlsx");
}
async function importFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    if (file.name.endsWith(".json")) {
      const text = await file.text();
      const arr = JSON.parse(text);
      ingestStudents(Array.isArray(arr) ? arr : arr.students || []);
    } else {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      ingestStudents(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
    }
  } catch { toast("File không hợp lệ"); }
  e.target.value = "";
}
function ingestStudents(arr) {
  let n = 0;
  arr.forEach(r => {
    const mssv = String(r.mssv || r.MSSV || "").trim().toUpperCase();
    const name = String(r.name || r["họ và tên"] || r.hoten || r["Họ và tên"] || "").trim();
    if (!mssv || !name) return;
    const phone = String(r.phone || r.sdt || r["sdt sinh viên"] || "");
    if (phone && !validPhone(phone)) return;
    const clsName = String(r.class || r.lop || r.lớp || "");
    const cls = DB.classes.find(c => c.name.toLowerCase() === clsName.toLowerCase()) || DB.classes[0];
    const exist = DB.students.find(s => s.mssv === mssv);
    const rec = {
      mssv, name,
      gender: r.gender || r["giới tính"] || "Nam",
      dob: String(r.dob || r["ngày sinh"] || "").slice(0,10),
      classId: cls?.id || "",
      phone,
      father: r.father || r["họ tên cha"] || "",
      fatherPhone: r.fatherPhone || r["sdt cha"] || "",
      mother: r.mother || r["họ tên mẹ"] || "",
      motherPhone: r.motherPhone || r["sdt mẹ"] || "",
      addrThuongTru: r.addrThuongTru || r["địa chỉ thường trú"] || "",
      addrCuTru: r.addrCuTru || r["địa chỉ cư trú"] || "",
      status: r.status || r["tình trạng"] || "Đang học",
      username: String(r.username || mssv).toLowerCase(),
      password: String(r.password || r["mật khẩu"] || "123456"),
      officer: r.officer || "Không"
    };
    if (exist) Object.assign(exist, rec);
    else DB.students.push({ id: uid("s"), ...rec });
    n++;
  });
  save(DB); paint(); toast("Đã nhập " + n + " sinh viên");
}

/* ================= HOMEROOM ================= */
function viewHomeroom() {
  if (!CLS_LEVEL) {
    $("#main").innerHTML = `
      <div class="topbar"><h2>Lớp theo phân hệ</h2>${topMeta()}</div>
      <p class="muted" style="margin-bottom:12px">Chọn phân hệ, sau đó chọn lớp để xem danh sách và bổ nhiệm ban cán sự.</p>
      <div class="level-cards">
        ${LEVELS.map(l => {
          const n = DB.classes.filter(c => c.level === l.id).length;
          return `<div class="level-card" onclick="CLS_LEVEL='${l.id}';paint()">
            <div class="muted">${l.mark}</div><h4 style="margin:6px 0">${l.name}</h4>
            <p class="muted">${n} lớp chủ nhiệm</p></div>`;
        }).join("")}
      </div>`;
    return;
  }
  if (!CLS_ID) {
    const list = DB.classes.filter(c => c.level === CLS_LEVEL);
    const lv = LEVELS.find(l => l.id === CLS_LEVEL);
    $("#main").innerHTML = `
      <div class="topbar"><h2>${lv.name}</h2>${topMeta()}</div>
      <div class="breadcrumb" onclick="CLS_LEVEL=null;paint()">← Tất cả phân hệ</div>
      <div class="grid g-3">
        ${list.map(c => `<div class="class-card" onclick="CLS_ID='${c.id}';paint()">
          <h4>${c.name}</h4><p class="muted">${c.note||""}</p>
          <p><b>${DB.students.filter(s=>s.classId===c.id).length}</b> sinh viên</p>
        </div>`).join("") || "<p class='empty'>Chưa có lớp</p>"}
      </div>`;
    return;
  }
  const c = DB.classes.find(x => x.id === CLS_ID);
  const list = DB.students.filter(s => s.classId === CLS_ID);
  $("#main").innerHTML = `
    <div class="topbar"><h2>Lớp ${c.name}</h2>${topMeta()}</div>
    <div class="breadcrumb" onclick="CLS_ID=null;paint()">← Danh sách lớp ${LEVELS.find(l=>l.id===c.level).name}</div>
    <div class="card">
      <h3>Danh sách sinh viên · Bổ nhiệm ban cán sự</h3>
      <div class="table-wrap"><table><thead><tr><th>MSSV</th><th>Họ tên</th><th>SĐT</th><th>Tình trạng</th><th>Ban cán sự</th></tr></thead>
      <tbody>${list.map(s => `<tr>
        <td>${s.mssv}</td><td>${s.name}</td><td>${s.phone}</td><td>${s.status}</td>
        <td><select onchange="setOfficer('${s.id}', this.value)">
          ${ROLES_CS.map(r => `<option ${s.officer===r?"selected":""}>${r}</option>`).join("")}
        </select></td>
      </tr>`).join("")}</tbody></table></div>
    </div>`;
}
function setOfficer(id, v) {
  studentById(id).officer = v; save(DB); toast("Đã bổ nhiệm " + v);
}

/* ================= SUBJECTS — nhiều lớp ================= */
function viewSubjects() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Quản lý môn học</h2>${topMeta()}</div>
    <div class="grid g-2">
      <div class="card">
        <h3>Danh mục môn <button class="btn btn-sm btn-primary" onclick="openSubModal()">Thêm môn</button></h3>
        <div class="assign-list">
          ${DB.subjects.map(m => `<div class="assign-card">
            <div class="head">
              <div><b>${m.name}</b><div class="muted">${m.code} · ${m.credit} tín chỉ</div></div>
              <div>
                <button class="btn btn-sm btn-ghost" onclick="openSubModal('${m.id}')">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="delSub('${m.id}')">Xóa</button>
              </div>
            </div>
          </div>`).join("")}
        </div>
      </div>
      <div class="card">
        <h3>Phân môn
          <button class="btn btn-sm btn-primary" onclick="openAssignModal()">Phân công</button>
        </h3>
        <div class="assign-list">
          ${DB.assigns.map(a => `<div class="assign-card">
            <div class="head">
              <div>
                <b>${subjectName(a.subjectId)}</b>
                <div class="muted">${a.term} · ${a.year}</div>
              </div>
              <div>
                <button class="btn btn-sm btn-ghost" onclick="openAssignModal('${a.id}')">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="delAssign('${a.id}')">Xóa</button>
              </div>
            </div>
            <div class="pill-row" style="margin-top:8px">
              ${(a.classIds||[]).map(id => `<span class="pill">${className(id)}</span>`).join("")}
              ${(a.teacherIds||[]).map(id => `<span class="pill">${DB.teachers.find(t=>t.id===id)?.name||id}</span>`).join("")}
            </div>
          </div>`).join("") || "<p class='empty'>Chưa phân môn</p>"}
        </div>
      </div>
    </div>`;
}
function openSubModal(id) {
  const m = id ? DB.subjects.find(x => x.id === id) : { name:"", code:"", credit: 2 };
  editTarget = id || null;
  showModal(`<h3>${id?"Sửa":"Thêm"} môn học</h3>
    <div class="form-grid">
      <div class="field"><label>Mã môn</label><input id="mCode" value="${m.code}"></div>
      <div class="field"><label>Tên môn</label><input id="mName" value="${m.name}"></div>
      <div class="field"><label>Tín chỉ</label><input type="number" id="mCr" value="${m.credit}"></div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveSub()">Lưu</button>
    </div>`);
}
function saveSub() {
  const rec = { code: $("#mCode").value.trim(), name: $("#mName").value.trim(), credit: +$("#mCr").value || 0 };
  if (!rec.name) return toast("Nhập tên môn");
  if (editTarget) Object.assign(DB.subjects.find(s => s.id === editTarget), rec);
  else DB.subjects.push({ id: uid("m"), ...rec });
  save(DB); hideModal(); paint(); toast("Đã lưu môn");
}
function delSub(id) { DB.subjects = DB.subjects.filter(s => s.id !== id); save(DB); paint(); }
function openAssignModal(id) {
  const a = id ? DB.assigns.find(x => x.id === id) : { subjectId: DB.subjects[0]?.id, classIds: [], year: DB.config.year, term: DB.config.term };
  editTarget = id || null;
  showModal(`<h3>${id ? "Sửa phân công" : "Phân môn"}</h3>
    <div class="form-grid">
      <div class="field"><label>Năm học</label><input id="asYear" value="${a.year}"></div>
      <div class="field"><label>Kỳ học</label><input id="asTerm" value="${a.term}"></div>
      <div class="field span-2"><label>Chọn môn</label>
        <div class="check-list">
          ${DB.subjects.map(s => `<label class="check-item"><input type="checkbox" class="asSub" value="${s.id}" ${a.subjectId===s.id?"checked":""}> ${s.name}</label>`).join("")}
        </div>
      </div>
      <div class="field span-2"><label>Chọn lớp</label>
        <div class="check-list">
          ${DB.classes.map(c => `<label class="check-item"><input type="checkbox" class="asCls" value="${c.id}" ${(a.classIds||[]).includes(c.id)?"checked":""}> ${c.name}</label>`).join("")}
        </div>
      </div>
      <div class="field span-2"><label>Phân công giáo viên</label>
        <div class="check-list">
          ${DB.teachers.filter(t=>t.active!==false).map(t => `<label class="check-item"><input type="checkbox" class="asGv" value="${t.id}" ${(a.teacherIds||[]).includes(t.id)?"checked":""}> ${t.name}</label>`).join("")}
        </div>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveAssign()">Lưu</button>
    </div>`);
}
function saveAssign() {
  const classIds = $$(".asCls").filter(x => x.checked).map(x => x.value);
  const subjectIds = $$(".asSub").filter(x => x.checked).map(x => x.value);
  const teacherIds = $$(".asGv").filter(x => x.checked).map(x => x.value);
  if (!subjectIds.length) return toast("Chọn ít nhất một môn");
  if (!classIds.length) return toast("Chọn ít nhất một lớp");
  const year = $("#asYear").value, term = $("#asTerm").value;
  if (editTarget) {
    const cur = DB.assigns.find(a => a.id === editTarget);
    Object.assign(cur, { subjectId: subjectIds[0], classIds, teacherIds, year, term });
    subjectIds.slice(1).forEach(sid => DB.assigns.push({ id: uid("a"), subjectId: sid, classIds: [...classIds], teacherIds: [...teacherIds], year, term }));
  } else {
    subjectIds.forEach(sid => DB.assigns.push({ id: uid("a"), subjectId: sid, classIds: [...classIds], teacherIds: [...teacherIds], year, term }));
  }
  save(DB); hideModal(); paint(); toast("Đã phân " + subjectIds.length + " môn cho " + classIds.length + " lớp");
}
function delAssign(id) { DB.assigns = DB.assigns.filter(a => a.id !== id); save(DB); paint(); }

function flattenAssignOptions() {
  const out = [];
  DB.assigns.filter(a => a.year === DB.config.year && a.term === DB.config.term).forEach(a => {
    (a.classIds || []).forEach(cid => out.push({ assignId: a.id, subjectId: a.subjectId, classId: cid }));
  });
  return out;
}

/* ================= ATTEND ================= */
function viewAttend() {
  const opts = flattenAssignOptions();
  $("#main").innerHTML = `
    <div class="topbar"><h2>Điểm danh</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <select id="atAssign" onchange="renderAttendSheet()">${opts.map((a,i) => `<option value="${i}">${subjectName(a.subjectId)} · ${className(a.classId)}</option>`).join("")}</select>
        <input type="date" id="atDate" value="${todayISO()}" onchange="renderAttendSheet()">
      </div>
      <div id="atSheet"></div>
      <h3 style="margin-top:16px">Lịch sử điểm danh</h3>
      <div class="table-wrap"><table><thead><tr><th>Ngày</th><th>Môn</th><th>SV</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead>
      <tbody>${[...DB.attendance].reverse().slice(0,30).map(a => `<tr>
        <td>${fmtDate(a.date)}</td><td>${subjectName(a.subjectId)}</td>
        <td>${studentById(a.studentId)?.name||""}</td>
        <td><span class="badge ${a.status==="Có mặt"?"ok":a.status==="Trễ"?"warn":"bad"}">${a.status}</span></td>
        <td data-label="Ghi chú">${a.note||""}</td></tr>`).join("")}</tbody></table></div>
    </div>`;
  if (opts.length) renderAttendSheet();
}
function renderAttendSheet() {
  const opts = flattenAssignOptions();
  const as = opts[+$("#atAssign").value];
  if (!as) return toast("Chưa có phân môn");
  const date = $("#atDate").value;
  const list = DB.students.filter(s => s.classId === as.classId);
  $("#atSheet").innerHTML = `
    <p class="muted" style="margin-bottom:10px">${fmtDate(date)} · ${subjectName(as.subjectId)} · ${className(as.classId)}</p>
    ${list.length ? list.map(s => {
      const ex = DB.attendance.find(a => a.studentId===s.id && a.subjectId===as.subjectId && a.date===date);
      const st = ex?.status || "Có mặt";
      return `<div class="att-card">
        <b>${s.name}</b> <span class="muted">${s.mssv}</span>
        <input type="hidden" id="st_${s.id}" value="${st}">
        <div class="att-btns">
          <button type="button" class="${st==="Có mặt"?"on-ok":""}" onclick="setAtt('${s.id}','Có mặt',this)">Có mặt</button>
          <button type="button" class="${st==="Trễ"?"on-warn":""}" onclick="setAtt('${s.id}','Trễ',this)">Trễ</button>
          <button type="button" class="${st==="Vắng"?"on-bad":""}" onclick="setAtt('${s.id}','Vắng',this)">Vắng</button>
        </div>
        <input id="nt_${s.id}" value="${ex?.note||""}" placeholder="Ghi chú">
      </div>`;
    }).join("") : `<div class="empty-box"><div class="ico">–</div><p>Lớp chưa có sinh viên</p></div>`}
    <button class="btn btn-primary" style="margin-top:10px" onclick="saveAttend('${as.subjectId}','${as.classId}','${date}')">Lưu điểm danh</button>`;
}
function setAtt(id, status, btn) {
  const hid = document.getElementById("st_" + id);
  if (hid) hid.value = status;
  const wrap = btn.parentElement;
  wrap.querySelectorAll("button").forEach(b => b.className = "");
  btn.className = status==="Có mặt"?"on-ok":status==="Trễ"?"on-warn":"on-bad";
}
function saveAttend(subjectId, classId, date) {
  const list = DB.students.filter(s => s.classId === classId);
  list.forEach(s => {
    const status = $("#st_" + s.id).value;
    const note = $("#nt_" + s.id).value;
    const ex = DB.attendance.find(a => a.studentId===s.id && a.subjectId===subjectId && a.date===date);
    if (ex) { ex.status = status; ex.note = note; }
    else DB.attendance.push({ id: uid("at"), studentId: s.id, subjectId, date, status, note });
  });
  save(DB); paint(); toast("Đã lưu điểm danh");
}

/* ================= WORK ================= */
function viewWork() {
  const y = CAL_CURSOR.getFullYear(), m = CAL_CURSOR.getMonth();
  const start = new Date(y, m, 1);
  const pads = (start.getDay() + 6) % 7;
  const last = new Date(y, m + 1, 0).getDate();
  const prevLast = new Date(y, m, 0).getDate();
  let cells = ["T2","T3","T4","T5","T6","T7","CN"].map(d => `<div class="d head">${d}</div>`).join("");
  for (let i = 0; i < pads; i++) cells += `<div class="d mute"><span class="num">${prevLast - pads + 1 + i}</span></div>`;
  for (let d = 1; d <= last; d++) {
    const iso = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const t = DB.tasks.filter(x => x.date === iso);
    cells += `<div class="d ${iso===todayISO()?"today":""}" onclick="TASK_DATE='${iso}';TASK_FILTER='date';paint()" style="cursor:pointer"><span class="num">${d}</span>${t.map(x=>`<div class="ev">${x.done?"✓ ":""}${x.title}</div>`).join("")}</div>`;
  }
  const trail = (7 - ((pads + last) % 7)) % 7;
  for (let i = 1; i <= trail; i++) cells += `<div class="d mute"><span class="num">${i}</span></div>`;
  $("#main").innerHTML = `
    <div class="topbar"><h2>Công việc</h2>${topMeta()}</div>
    <div class="grid g-2">
      <div class="card">
        <h3>Danh sách công việc hôm nay <button class="btn btn-sm btn-primary" onclick="openTaskModal()">Tạo việc</button></h3>
        <div class="toolbar">
          <input type="date" id="taskDate" value="${TASK_DATE || todayISO()}" onchange="TASK_DATE=this.value;TASK_FILTER='date';paint()">
          <button class="btn btn-sm ${TASK_FILTER==="today"?"btn-primary":"btn-outline"}" onclick="TASK_FILTER='today';TASK_DATE=todayISO();paint()">Hôm nay</button>
          <button class="btn btn-sm ${TASK_FILTER==="date"?"btn-primary":"btn-outline"}" onclick="TASK_FILTER='date';paint()">Theo ngày</button>
          <button class="btn btn-sm ${TASK_FILTER==="todo"?"btn-primary":"btn-outline"}" onclick="TASK_FILTER='todo';paint()">Chưa hoàn thành</button>
          <button class="btn btn-sm ${TASK_FILTER==="done"?"btn-primary":"btn-outline"}" onclick="TASK_FILTER='done';paint()">Hoàn thành</button>
        </div>
        ${DB.tasks.filter(t => {
          const pick = TASK_DATE || todayISO();
          if (TASK_FILTER === "today") return t.date === todayISO() || t.type === "Hôm nay";
          if (TASK_FILTER === "date") return t.date === pick;
          if (TASK_FILTER === "todo") return !t.done;
          if (TASK_FILTER === "done") return t.done;
          return true;
        }).map(t => `
          <div class="assign-card ${t.done?"task-done":"task-todo"}" style="margin-bottom:8px">
            <div class="head">
              <label style="display:flex;gap:8px;align-items:center">
                <input type="checkbox" ${t.done?"checked":""} onchange="toggleTask('${t.id}')">
                <span style="${t.done?"text-decoration:line-through":""}"><b>${t.title}</b>
                  <div class="muted">${fmtDate(t.date)} ${t.time||""} · ${t.session||"Cả ngày"} · ${t.done?"Hoàn thành":"Chưa hoàn thành"}</div>
                </span>
              </label>
              <div>
                <button class="btn btn-sm btn-ghost" onclick="openTaskModal('${t.id}')">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="delTask('${t.id}')">Xóa</button>
              </div>
            </div>
          </div>`).join("") || "<p class='empty'>Chưa có công việc</p>"}
      </div>
      <div class="card">
        <div class="cal-wrap">
          <div class="cal-title">
            <button class="btn btn-sm btn-ghost" onclick="shiftCal(-1)">‹</button>
            <span>${MONTHS_VI[m]} năm ${y}</span>
            <button class="btn btn-sm btn-ghost" onclick="shiftCal(1)">›</button>
          </div>
          <div class="cal">${cells}</div>
        </div>
      </div>
    </div>`;
}
function shiftCal(n) { CAL_CURSOR = new Date(CAL_CURSOR.getFullYear(), CAL_CURSOR.getMonth() + n, 1); paint(); }
function openTaskModal(id) {
  const t = id ? DB.tasks.find(x => x.id === id) : { title: "", date: todayISO(), session: "Sáng", done: false };
  editTarget = id || null;
  showModal(`<h3>${id?"Sửa":"Tạo"} công việc</h3>
    <div class="field"><label>Tiêu đề</label><input id="tkTitle" value="${t.title||""}"></div>
    <div class="form-grid">
      <div class="field"><label>Ngày</label><input type="date" id="tkDate" value="${t.date||todayISO()}"></div>
      <div class="field"><label>Buổi</label>
        <select id="tkSes">
          ${["Sáng","Chiều","Cả ngày"].map(x=>`<option ${ (t.session||"Sáng")===x?"selected":""}>${x}</option>`).join("")}
        </select>
      </div>
      <div class="field"><label>Giờ</label><input type="time" id="tkTime" value="${t.time||"08:00"}"></div>
    </div>
    <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="tkDone" ${t.done?"checked":""}> Đánh dấu hoàn thành</label>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveTask()">Lưu</button>
    </div>`);
}
function saveTask() {
  const rec = { title: $("#tkTitle").value.trim(), date: $("#tkDate").value, time: $("#tkTime").value, session: $("#tkSes").value, type: $("#tkDate").value===todayISO()?"Hôm nay":"Tuần này", done: $("#tkDone").checked };
  if (!rec.title) return toast("Nhập tiêu đề");
  if (editTarget) Object.assign(DB.tasks.find(t => t.id === editTarget), rec);
  else DB.tasks.push({ id: uid("t"), ...rec });
  save(DB); hideModal(); paint(); toast("Đã lưu công việc");
}
function delTask(id) { DB.tasks = DB.tasks.filter(t => t.id !== id); save(DB); paint(); }

function viewSchedule() {
  const byDay = WEEKDAYS.map(day => ({ day, items: DB.schedule.filter(s => s.day === day) }));
  $("#main").innerHTML = `
    <div class="topbar"><h2>Lịch học theo tuần</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <select id="schClassFilter" onchange="paint()">
          <option value="">Tất cả lớp</option>
          ${DB.classes.map(c=>`<option value="${c.id}" ${window._schCls===c.id?"selected":""}>${c.name}</option>`).join("")}
        </select>
        <button class="btn btn-primary" onclick="openWeekSchModal()">Phân lịch cả tuần</button>
      </div>
      <div class="assign-list">
        ${byDay.map(g => {
          const items = g.items.filter(s => !window._schCls || s.classId === window._schCls);
          return `<div class="assign-card">
            <b>${g.day}</b>
            ${items.length ? items.map(s => `<div class="head" style="margin-top:8px">
              <div>${s.start} – ${s.end} · ${s.subject} · <span class="pill">${className(s.classId)}</span></div>
              <div>
                <button class="btn btn-sm btn-ghost" onclick="openSchModal('${s.id}')">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="delSch('${s.id}')">Xóa</button>
              </div>
            </div>`).join("") : "<p class='muted'>Trống</p>"}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  $("#schClassFilter").onchange = () => { window._schCls = $("#schClassFilter").value; paint(); };
}
function subjectOptions(sel) {
  return DB.subjects.map(m => `<option value="${m.name}" ${sel===m.name?"selected":""}>${m.name}</option>`).join("");
}
function sessionTimes(ses) {
  return ses === "Chiều" ? { start: "13:00", end: "16:30" } : { start: "07:30", end: "11:00" };
}
function openSchModal(id) {
  const s = id ? DB.schedule.find(x => x.id === id) : { day: "Thứ 2", start: "07:30", end: "11:00", subject: DB.subjects[0]?.name, classId: DB.classes[0]?.id };
  editTarget = id || null;
  showModal(`<h3>${id?"Sửa":"Thêm"} buổi học</h3>
    <div class="form-grid">
      <div class="field"><label>Thứ</label><select id="scDay">${WEEKDAYS.map(d=>`<option ${s.day===d?"selected":""}>${d}</option>`).join("")}</select></div>
      <div class="field"><label>Lớp</label><select id="scCls">${DB.classes.map(c=>`<option value="${c.id}" ${s.classId===c.id?"selected":""}>${c.name}</option>`).join("")}</select></div>
      <div class="field"><label>Môn học</label><select id="scSub">${subjectOptions(s.subject)}</select></div>
      <div class="field"><label>Buổi</label>
        <select id="scSes" onchange="const t=sessionTimes(this.value);document.getElementById('scStart').value=t.start;document.getElementById('scEnd').value=t.end;">
          <option>Sáng</option><option>Chiều</option>
        </select>
      </div>
      <div class="field"><label>Bắt đầu</label><input id="scStart" value="${s.start||"07:30"}"></div>
      <div class="field"><label>Kết thúc</label><input id="scEnd" value="${s.end||"11:00"}"></div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveSch()">Lưu</button>
    </div>`);
}
function saveSch() {
  const rec = { day: $("#scDay").value, classId: $("#scCls").value, start: $("#scStart").value, end: $("#scEnd").value, subject: $("#scSub").value };
  if (!rec.subject) return toast("Chọn môn học");
  if (editTarget) Object.assign(DB.schedule.find(s => s.id === editTarget), rec);
  else DB.schedule.push({ id: uid("sch"), ...rec });
  save(DB); hideModal(); paint(); toast("Đã lưu lịch học");
}
function openWeekSchModal() {
  const subSel = subjectOptions();
  showModal(`<h3>Phân lịch cả tuần</h3>
    <p class="muted" style="margin-bottom:10px">Mỗi thứ chọn môn và giờ riêng. Bỏ trống môn nếu ngày đó không học.</p>
    <div class="field"><label>Lớp</label><select id="wkCls">${DB.classes.map(c=>`<option value="${c.id}">${c.name}</option>`).join("")}</select></div>
    ${WEEKDAYS.map((d,i) => `<div class="form-grid" style="margin-bottom:8px;align-items:end">
      <div class="field"><label>${d}</label>
        <select id="wkSub_${i}"><option value="">— Không xếp —</option>${subSel}</select>
      </div>
      <div class="field"><label>Giờ bắt đầu</label><input type="time" id="wkSt_${i}" value="07:30"></div>
      <div class="field"><label>Giờ kết thúc</label><input type="time" id="wkEn_${i}" value="09:15"></div>
    </div>`).join("")}
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveWeekSch()">Lưu lịch tuần</button>
    </div>`);
}
function saveWeekSch() {
  const classId = $("#wkCls").value;
  let n = 0;
  WEEKDAYS.forEach((day, i) => {
    const subject = document.getElementById("wkSub_" + i)?.value;
    if (!subject) return;
    DB.schedule.push({
      id: uid("sch"), day, classId, subject,
      start: document.getElementById("wkSt_" + i).value,
      end: document.getElementById("wkEn_" + i).value
    });
    n++;
  });
  if (!n) return toast("Chọn ít nhất một môn trong tuần");
  save(DB); hideModal(); paint(); toast("Đã lưu " + n + " buổi học");
}
function delSch(id) { DB.schedule = DB.schedule.filter(s => s.id !== id); save(DB); paint(); }

/* ================= REPORT theo ngày/tuần/tháng/quý/năm ================= */
function inRange(iso, from, to) {
  if (!iso) return false;
  const d = iso.slice(0, 10);
  return d >= from && d <= to;
}
function periodBounds(mode) {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth(), day = now.getDate();
  const iso = d => {
    const z = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`;
  };
  if (mode === "day") {
    const pick = $("#repDay")?.value || todayISO();
    return { from: pick, to: pick, label: "Ngày " + fmtDate(pick) };
  }
  if (mode === "week") {
    const w = +($("#repWeek")?.value || DB.config.week);
    return { from: todayISO(), to: todayISO(), week: w, label: "Tuần " + w + " · " + DB.config.term };
  }
  if (mode === "month") {
    const val = $("#repMonth")?.value || `${y}-${String(m+1).padStart(2,"0")}`;
    const [yy, mm] = val.split("-").map(Number);
    const from = `${yy}-${String(mm).padStart(2,"0")}-01`;
    const last = new Date(yy, mm, 0).getDate();
    return { from, to: `${yy}-${String(mm).padStart(2,"0")}-${String(last).padStart(2,"0")}`, label: "Tháng " + mm + "/" + yy };
  }
  if (mode === "quarter") {
    const q = +($("#repQuarter")?.value || Math.floor(m / 3) + 1);
    const startM = (q - 1) * 3;
    const from = `${y}-${String(startM+1).padStart(2,"0")}-01`;
    const last = new Date(y, startM + 3, 0).getDate();
    const to = `${y}-${String(startM+3).padStart(2,"0")}-${String(last).padStart(2,"0")}`;
    return { from, to, label: "Quý " + q + " năm " + y };
  }
  return { from: `${y}-01-01`, to: `${y}-12-31`, label: "Năm " + y };
}

function viewReport() {
  const now = new Date();
  const monthVal = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const qNow = Math.floor(now.getMonth() / 3) + 1;
  $("#main").innerHTML = `
    <div class="topbar"><h2>Báo cáo lớp</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <select id="repMode" onchange="REP_MODE=this.value;paint()">
          ${[["day","Theo ngày"],["week","Theo tuần"],["month","Theo tháng"],["quarter","Theo quý"],["year","Theo năm"]].map(([id,lb]) =>
            `<option value="${id}" ${REP_MODE===id?"selected":""}>${lb}</option>`).join("")}
        </select>
        ${REP_MODE==="day" ? `<input type="date" id="repDay" value="${todayISO()}" onchange="paintReportBody()">` : ""}
        ${REP_MODE==="week" ? `<label class="muted">Tuần</label><input type="number" id="repWeek" min="1" max="22" value="${DB.config.week}" onchange="paintReportBody()">` : ""}
        ${REP_MODE==="month" ? `<input type="month" id="repMonth" value="${monthVal}" onchange="paintReportBody()">` : ""}
        ${REP_MODE==="quarter" ? `<select id="repQuarter" onchange="paintReportBody()">${[1,2,3,4].map(q=>`<option ${q===qNow?"selected":""} value="${q}">Quý ${q}</option>`).join("")}</select>` : ""}
        ${REP_MODE==="year" ? `<input type="number" id="repYear" value="${now.getFullYear()}" onchange="paintReportBody()">` : ""}
        <button class="btn btn-ghost" onclick="paint()">Làm mới</button>
        <button class="btn btn-primary" onclick="exportReportExcel()">Xuất Excel</button>
        <button class="btn btn-outline" onclick="exportReportPDF()">Xuất PDF</button>
      </div>
      <div id="repBody"></div>
    </div>`;
  paintReportBody();
}

function collectPeriod() {
  const p = periodBounds(REP_MODE);
  if (REP_MODE === "year") {
    const y = $("#repYear")?.value || new Date().getFullYear();
    p.from = `${y}-01-01`; p.to = `${y}-12-31`; p.label = "Năm " + y;
  }
  const att = DB.attendance.filter(a => inRange(a.date, p.from, p.to));
  const leaves = DB.leaves.filter(l => inRange(l.from, p.from, p.to) || inRange(l.createdAt, p.from, p.to));
  const reports = REP_MODE === "week"
    ? DB.reports.filter(r => r.week === (p.week || DB.config.week) && r.year === DB.config.year)
    : DB.reports.filter(r => inRange(r.createdAt, p.from, p.to));
  const issues = DB.issues.filter(i => inRange(i.date, p.from, p.to) || (REP_MODE === "week" && i.week === DB.config.week));
  return { p, att, leaves, reports, issues };
}

function paintReportBody() {
  const { p, att, leaves, reports, issues } = collectPeriod();
  const late = att.filter(a => a.status === "Trễ");
  const abs = att.filter(a => a.status === "Vắng");
  const support = reports.filter(r => (r.answers.SUPPORT || "").toLowerCase() === "có");
  const care = DB.students.filter(s => s.status === "Cần quan tâm");
  const watch = DB.students.filter(s => s.status === "Cần theo dõi");
  const lateMap = {}, absMap = {};
  late.forEach(a => lateMap[a.studentId] = (lateMap[a.studentId] || 0) + 1);
  abs.forEach(a => absMap[a.studentId] = (absMap[a.studentId] || 0) + 1);
  $("#repBody").innerHTML = `
    <p style="margin-bottom:12px"><b>${p.label}</b> <span class="muted">(${fmtDate(p.from)} – ${fmtDate(p.to)})</span></p>
    <div class="grid g-4">
      <div class="stat"><div class="k">Vấn đề nghiêm trọng</div><div class="v">${issues.filter(i=>i.type==="Nghiêm trọng").length}</div></div>
      <div class="stat"><div class="k">Lượt nghỉ</div><div class="v">${abs.length}</div></div>
      <div class="stat"><div class="k">Lượt trễ</div><div class="v">${late.length}</div></div>
      <div class="stat"><div class="k">Cần hỗ trợ</div><div class="v">${support.length}</div></div>
    </div>
    <div class="grid g-2" style="margin-top:14px">
      <div>
        <h3>Nghỉ học / đi trễ</h3>
        <div class="table-wrap"><table><thead><tr><th>Sinh viên</th><th>Vắng</th><th>Trễ</th></tr></thead><tbody>
          ${DB.students.map(s => {
            const v = absMap[s.id] || 0, t = lateMap[s.id] || 0;
            if (!v && !t) return "";
            return `<tr><td>${s.name}</td><td>${v}</td><td>${t}</td></tr>`;
          }).join("") || "<tr><td colspan=3>Không phát sinh</td></tr>"}
        </tbody></table></div>
      </div>
    </div>
    <div class="grid g-3" style="margin-top:14px">
      <div class="card">
        <h3>Đơn phép</h3>
        <div class="leave-list">
          ${leaves.length ? leaves.map(l => `<div class="leave-item">
            <div><b>${studentById(l.studentId)?.name}</b>
              <div class="muted">${fmtDate(l.from)} → ${fmtDate(l.to)} · ${l.session||"Cả ngày"}</div>
            </div>
            <span class="badge ${l.status==="Duyệt"?"ok":l.status==="Từ chối"?"bad":"warn"}">${l.status}</span>
          </div>`).join("") : "<p class='empty'>Không có đơn</p>"}
        </div>
      </div>
      <div class="card">
        <h3>Học sinh cần quan tâm</h3>
        ${[...care, ...watch].length ? [...care, ...watch].map(s => `<div class="assign-card" style="margin-bottom:8px">
          <b>${s.name}</b><div class="muted">${s.mssv} · ${className(s.classId)}</div>
          <span class="badge warn">${s.status}</span>
        </div>`).join("") : "<p class='empty'>Không có</p>"}
      </div>
      <div class="card">
        <h3>Báo cáo đã nộp</h3>
        <p style="font-size:22px;font-weight:700;color:var(--green-2)">${reports.length}<span class="muted" style="font-size:14px"> / ${DB.students.length}</span></p>
        <div class="leave-list" style="margin-top:8px">
          ${DB.students.map(s => {
            const ok = reports.some(r => r.studentId === s.id);
            return `<div class="leave-item"><span>${s.name}</span><span class="badge ${ok?"ok":"warn"}">${ok?"Đã nộp":"Chưa nộp"}</span></div>`;
          }).join("")}
        </div>
      </div>
    </div>`;
}

const SCHOOL = "Trường Cao đẳng Công nghệ và Kinh tế Bảo Lộc";
const NATION = "Cộng hòa xã hội chủ nghĩa Việt Nam";
const MOTTO = "Độc lập - Tự do - Hạnh phúc";

function exportReportExcel() {
  const { p, att, leaves, reports } = collectPeriod();
  const gv = currentTeacher()?.name || SESSION.name;
  const weekNo = $("#repWeek")?.value || DB.config.week;
  const header = [
    [NATION],
    [MOTTO],
    [SCHOOL],
    [`Giáo viên chủ nhiệm: ${gv}`],
    [`Học kỳ: ${DB.config.term}    Năm học: ${DB.config.year}    ${REP_MODE==="week"?"Tuần: "+weekNo:p.label}`],
    [],
    ["MSSV","Họ và tên","Lớp","Giới tính","Ngày sinh","Tình trạng","Số buổi vắng","Số buổi trễ","Số đơn phép","Báo cáo tuần"]
  ];
  const rows = DB.students.map(s => ([
    s.mssv, s.name, className(s.classId), s.gender, s.dob, s.status,
    att.filter(a => a.studentId===s.id && a.status==="Vắng").length,
    att.filter(a => a.studentId===s.id && a.status==="Trễ").length,
    leaves.filter(l => l.studentId===s.id).length,
    reports.some(r => r.studentId===s.id) ? "Đã nộp" : "Chưa nộp"
  ]));
  const ws = XLSX.utils.aoa_to_sheet([...header, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "BaoCao");
  XLSX.writeFile(wb, `bao_cao_${REP_MODE}.xlsx`);
}
function exportReportPDF() {
  const { p, att, leaves, reports } = collectPeriod();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const gv = currentTeacher()?.name || SESSION.name;
  const weekNo = $("#repWeek")?.value || DB.config.week;
  doc.setFontSize(11);
  doc.text("CONG HOA XA HOI CHU NGHIA VIET NAM", 105, 14, { align: "center" });
  doc.setFontSize(10);
  doc.text("Doc lap - Tu do - Hanh phuc", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text("Truong Cao dang Cong nghe va Kinh te Bao Loc", 105, 30, { align: "center" });
  doc.setFontSize(10);
  doc.text(`Giao vien chu nhiem: ${gv}`, 14, 40);
  doc.text(`Hoc ky: ${DB.config.term}  |  Nam hoc: ${DB.config.year}  |  ${REP_MODE==="week"?"Tuan "+weekNo:p.label}`, 14, 46);
  const body = DB.students.map(s => [
    s.mssv, s.name, className(s.classId), s.status,
    String(att.filter(a => a.studentId===s.id && a.status==="Vắng").length),
    String(att.filter(a => a.studentId===s.id && a.status==="Trễ").length),
    String(leaves.filter(l => l.studentId===s.id).length),
    reports.some(r => r.studentId===s.id) ? "Da nop" : "Chua nop"
  ]);
  doc.autoTable({ startY: 52, head: [["MSSV","Ho va ten","Lop","Tinh trang","Vang","Tre","Don phep","Bao cao tuan"]], body, styles: { fontSize: 8 } });
  doc.save(`bao_cao_${REP_MODE}.pdf`);
}

/* ================= LEAVE GV ================= */
function viewLeave() {
  const p = periodBounds(LV_FILTER.period);
  let list = DB.leaves.filter(l => inRange(l.from, p.from, p.to) || inRange(l.createdAt, p.from, p.to));
  if (LV_FILTER.pending) list = list.filter(l => l.status === "Chờ duyệt");
  if (LV_FILTER.classId) list = list.filter(l => studentById(l.studentId)?.classId === LV_FILTER.classId);
  if (LV_FILTER.studentId) list = list.filter(l => l.studentId === LV_FILTER.studentId);
  const svs = DB.students.filter(s => !LV_FILTER.classId || s.classId === LV_FILTER.classId);
  const countBySv = {};
  list.forEach(l => { countBySv[l.studentId] = (countBySv[l.studentId] || 0) + 1; });
  $("#main").innerHTML = `
    <div class="topbar"><h2>Nghỉ phép</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <select id="lvPeriod" onchange="LV_FILTER.period=this.value;paint()">
          ${[["day","Theo ngày"],["week","Theo tuần"],["month","Theo tháng"],["quarter","Theo quý"],["year","Theo năm"]].map(([id,lb])=>`<option value="${id}" ${LV_FILTER.period===id?"selected":""}>${lb}</option>`).join("")}
        </select>
        ${LV_FILTER.period==="day"?`<input type="date" id="repDay" value="${todayISO()}" onchange="paint()">`:""}
        <select id="lvClass" onchange="LV_FILTER.classId=this.value;LV_FILTER.studentId='';paint()">
          <option value="">Tất cả lớp</option>
          ${DB.classes.map(c=>`<option value="${c.id}" ${LV_FILTER.classId===c.id?"selected":""}>${c.name}</option>`).join("")}
        </select>
        <select id="lvSv" onchange="LV_FILTER.studentId=this.value;paint()">
          <option value="">Tất cả sinh viên</option>
          ${svs.map(s=>`<option value="${s.id}" ${LV_FILTER.studentId===s.id?"selected":""}>${s.name}</option>`).join("")}
        </select>
        <label style="display:flex;gap:6px;align-items:center;font-size:13px">
          <input type="checkbox" ${LV_FILTER.pending?"checked":""} onchange="LV_FILTER.pending=this.checked;paint()"> Chưa duyệt
        </label>
        <button class="btn btn-ghost" onclick="LV_FILTER={period:'week',pending:false,classId:'',studentId:''};paint()">Làm mới</button>
      </div>
      ${LV_FILTER.studentId ? `<p class="muted" style="margin-bottom:10px">${studentById(LV_FILTER.studentId)?.name} có <b>${list.length}</b> đơn trong kỳ lọc.</p>` : ""}
      <div class="leave-list">
        ${list.length ? [...list].reverse().map(l => {
          const s = studentById(l.studentId);
          return `<div class="leave-item">
            <div>
              <b>${s?.name}</b> <span class="muted">${s?.mssv} · ${className(s?.classId)}</span>
              <div class="muted">${fmtDate(l.from)} (${weekdayOf(l.from)}) → ${fmtDate(l.to)} (${weekdayOf(l.to)}) · ${l.session||"Cả ngày"} · ${l.reason}</div>
              <div style="margin-top:6px"><span class="badge ${l.status==="Duyệt"?"ok":l.status==="Từ chối"?"bad":"warn"}">${l.status}</span>
                ${countBySv[l.studentId] ? `<span class="muted"> · ${countBySv[l.studentId]} đơn trong kỳ</span>` : ""}
              </div>
            </div>
            <div class="leave-actions">
              ${l.status==="Chờ duyệt" ? `
                <button class="btn btn-sm btn-primary" onclick="decideLeave('${l.id}','Duyệt')">Duyệt</button>
                <button class="btn btn-sm btn-danger" onclick="decideLeave('${l.id}','Từ chối')">Từ chối</button>` : ""}
            </div>
          </div>`;
        }).join("") : "<p class='empty'>Không có đơn phù hợp bộ lọc</p>"}
      </div>
    </div>`;
}
function decideLeave(id, st) {
  const l = DB.leaves.find(x => x.id === id);
  l.status = st;
  save(DB); paint();
  toast(st === "Duyệt" ? "Đã duyệt phép" : "Đã từ chối");
}

/* ================= CONFIG + Gmail ================= */
function viewConfig() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Cấu hình hệ thống</h2>${topMeta()}</div>
    <div class="grid g-2">
      <div class="card">
        <h3>Năm học — kỳ — tuần</h3>
        <div class="field"><label>Năm học</label><input id="cfYear" value="${DB.config.year}"></div>
        <div class="field"><label>Kỳ học</label>
          <select id="cfTerm">${["Học kỳ 1","Học kỳ 2","Học kỳ hè"].map(t=>`<option ${DB.config.term===t?"selected":""}>${t}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Tuần hiện tại</label><input type="number" id="cfWeek" value="${DB.config.week}" min="1" max="22"></div>
        <button class="btn btn-primary" onclick="saveConfig()">Lưu cấu hình</button>
        <button class="btn btn-outline" onclick="if(confirm('Khôi phục dữ liệu ban đầu?')){localStorage.removeItem(KEY);localStorage.removeItem(SESS_KEY);location.reload()}">Khôi phục dữ liệu ban đầu</button>
      </div>
    </div>`;
}
function saveConfig() {
  DB.config.year = $("#cfYear").value.trim();
  DB.config.term = $("#cfTerm").value;
  DB.config.week = +$("#cfWeek").value || 1;
  save(DB); paint(); toast("Đã lưu cấu hình");
}
function viewGvConfig() {
  const t = currentTeacher();
  if (!t) return toast("Không tìm thấy giáo viên");
  $("#main").innerHTML = `
    <div class="topbar"><h2>Cấu hình giáo viên</h2>${topMeta()}</div>
    <div class="card" style="max-width:520px">
      <h3>Gmail nhận đơn nghỉ phép</h3>
      <p class="muted">Mỗi giáo viên dùng Gmail riêng. Khi sinh viên nộp đơn, hệ thống gửi tới địa chỉ này.</p>
      <div class="field"><label>Gmail</label><input id="gvMail" value="${t.gmail||""}" placeholder="email@gmail.com"></div>
      <label style="display:flex;gap:8px;align-items:center;margin:10px 0">
        <input type="checkbox" id="gvMailOn" ${t.gmailNotify?"checked":""}> Bật thông báo khi có đơn mới
      </label>
      <button class="btn btn-primary" onclick="saveGvMail()">Lưu</button>
    </div>`;
}
function saveGvMail() {
  const t = currentTeacher();
  const mail = $("#gvMail").value.trim();
  if (mail && !validEmail(mail)) return toast("Gmail không hợp lệ");
  t.gmail = mail;
  t.gmailNotify = $("#gvMailOn").checked;
  save(DB); toast("Đã lưu Gmail giáo viên");
}
function teacherMailTarget(student) {
  const assigned = DB.assigns.find(a => (a.classIds||[]).includes(student.classId) && (a.teacherIds||[]).length);
  if (assigned) {
    const gv = DB.teachers.find(t => assigned.teacherIds.includes(t.id) && t.gmailNotify && validEmail(t.gmail));
    if (gv) return gv;
  }
  return DB.teachers.find(t => t.gmailNotify && validEmail(t.gmail)) || currentTeacher();
}
async function sendLeaveMail(leave, student) {
  const gv = teacherMailTarget(student);
  if (!gv || !gv.gmailNotify || !validEmail(gv.gmail)) return;
  const subject = `[GVCN] Don nghi phep moi — ${student.mssv} ${student.name}`;
  const text = [
    `Sinh viên: ${student.name} (${student.mssv})`,
    `Lớp: ${className(student.classId)}`,
    `Từ ngày: ${leave.from}`,
    `Đến ngày: ${leave.to}`,
    `Buổi: ${leave.session||"Cả ngày"}`,
    `Lý do: ${leave.reason}`,
    `Trạng thái: ${leave.status}`
  ].join("\n");
  let ok = false, note = "";
  try {
    const res = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(gv.gmail), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _subject: subject, name: student.name, mssv: student.mssv, message: text })
    });
    ok = res.ok;
    if (!ok) note = "FormSubmit chưa xác nhận hoặc bị chặn";
  } catch {
    note = "Không gửi được qua máy chủ, đã mở mailto";
    location.href = `mailto:${gv.gmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  }
  DB.mailLog.push({ id: uid("ml"), at: todayISO(), to: gv.gmail, subject, ok, note });
  save(DB);
  toast(ok ? "Đã gửi thông báo tới " + gv.gmail : (note || "Đã ghi nhận thông báo Gmail"));
}
function testMail() {
  const st = { name: currentTeacher()?.name || "GV", mssv: "TEST", classId: DB.classes[0]?.id };
  sendLeaveMail({ from: todayISO(), to: todayISO(), reason: "Thu kiem tra cau hinh Gmail", status: "Chờ duyệt", source: "Hệ thống" }, st);
}

function viewWeekReports() {
  const p = periodBounds(WR_FILTER.period);
  let list = DB.reports.filter(r => r.year === DB.config.year && r.term === DB.config.term);
  if (WR_FILTER.period === "week") list = list.filter(r => r.week === (+$("#wrWeek")?.value || DB.config.week));
  else list = list.filter(r => inRange(r.createdAt, p.from, p.to));
  if (WR_FILTER.classId) list = list.filter(r => studentById(r.studentId)?.classId === WR_FILTER.classId);
  if (WR_FILTER.q) {
    const q = WR_FILTER.q.toLowerCase();
    list = list.filter(r => (studentById(r.studentId)?.name || "").toLowerCase().includes(q));
  }
  $("#main").innerHTML = `
    <div class="topbar"><h2>Báo cáo tuần sinh viên</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <select onchange="WR_FILTER.classId=this.value;paint()">
          <option value="">Tất cả lớp</option>
          ${DB.classes.map(c=>`<option value="${c.id}" ${WR_FILTER.classId===c.id?"selected":""}>${c.name}</option>`).join("")}
        </select>
        <input class="search" placeholder="Tìm tên sinh viên" value="${WR_FILTER.q||""}" oninput="WR_FILTER.q=this.value;paint()">
        <select onchange="WR_FILTER.period=this.value;paint()">
          ${[["week","Theo tuần"],["day","Theo ngày"],["month","Theo tháng"],["quarter","Theo quý"],["year","Theo năm"]].map(([id,lb])=>`<option value="${id}" ${WR_FILTER.period===id?"selected":""}>${lb}</option>`).join("")}
        </select>
        ${WR_FILTER.period==="week"?`<input type="number" id="wrWeek" min="1" max="22" value="${DB.config.week}" onchange="paint()">`:""}
        ${WR_FILTER.period==="day"?`<input type="date" id="repDay" value="${todayISO()}" onchange="paint()">`:""}
        ${WR_FILTER.period==="month"?`<input type="month" id="repMonth" onchange="paint()">`:""}
      </div>
      <div class="assign-list">
        ${list.length ? list.map(r => {
          const s = studentById(r.studentId);
          return `<div class="assign-card">
            <div class="head">
              <div>
                <b>${s?.name||""}</b>
                <div class="muted">${s?.mssv} · ${className(s?.classId)} · Tuần ${r.week} · ${fmtDate(r.createdAt)}</div>
                <div class="muted">Nghỉ ${r.answers?.ABSENT||0} · Trễ ${r.answers?.LATE||0} · Hỗ trợ: ${r.answers?.SUPPORT||"—"}</div>
              </div>
              <button class="btn btn-sm btn-outline" onclick="resetWeekReport('${r.id}')">Reset để nhập lại</button>
            </div>
          </div>`;
        }).join("") : "<p class='empty'>Không có báo cáo phù hợp</p>"}
      </div>
    </div>`;
}
function resetWeekReport(id) {
  if (!confirm("Xóa báo cáo tuần này để sinh viên nhập lại?")) return;
  DB.reports = DB.reports.filter(r => r.id !== id);
  save(DB); paint(); toast("Đã reset báo cáo tuần");
}

/* ================= STUDENT INFO ================= */
function viewSvInfo() {
  const s = studentById(SESSION.studentId);
  $("#main").innerHTML = `
    <div class="topbar"><h2>Hồ sơ sinh viên</h2>${topMeta()}</div>
    <div class="profile-hero">
      <div class="ava">${s.name.split(" ").slice(-1)[0].slice(0,1)}</div>
      <div>
        <div class="muted" style="color:#b7cfc6;letter-spacing:.12em;text-transform:uppercase;font-size:11px">Sinh viên · ${className(s.classId)}</div>
        <h3>${s.name}</h3>
        <p style="color:#d5ebe3;margin-top:4px">${s.mssv} · ${s.gender} · ${fmtDate(s.dob)}</p>
      </div>
      <span class="badge ok">${s.status}</span>
    </div>
    <div class="grid g-2" style="margin-top:14px">
      <div class="card">
        <h3>Thông tin học tập</h3>
        <div class="kv">
          <b>Mã số</b><span>${s.mssv}</span>
          <b>Lớp</b><span>${className(s.classId)}</span>
          <b>Ban cán sự</b><span>${s.officer}</span>
          <b>Tài khoản</b><span>${s.username}</span>
          <b>Số điện thoại</b><span>${s.phone || "—"}</span>
        </div>
      </div>
      <div class="card">
        <h3>Gia đình và nơi ở</h3>
        <div class="kv">
          <b>Họ tên cha</b><span>${s.father || "—"} · ${s.fatherPhone || ""}</span>
          <b>Họ tên mẹ</b><span>${s.mother || "—"} · ${s.motherPhone || ""}</span>
          <b>Thường trú</b><span>${s.addrThuongTru || "—"}</span>
          <b>Cư trú</b><span>${s.addrCuTru || "—"}</span>
        </div>
      </div>
    </div>`;
}

function viewSvLeave() {
  const s = studentById(SESSION.studentId);
  const mine = DB.leaves.filter(l => l.studentId === s.id).reverse();
  $("#main").innerHTML = `
    <div class="topbar"><h2>Nghỉ phép</h2>${topMeta()}</div>
    <div class="grid g-2">
      <div class="card">
        <h3>Tạo đơn nghỉ phép</h3>
        <div class="field"><label>Từ ngày</label><input type="date" id="lvFrom" value="${todayISO()}" onchange="syncLeaveDays()"></div>
        <p class="muted" id="lvFromWd">Thứ: ${weekdayOf(todayISO())}</p>
        <div class="field"><label>Đến ngày</label><input type="date" id="lvTo" value="${todayISO()}" onchange="syncLeaveDays()"></div>
        <p class="muted" id="lvToWd">Thứ: ${weekdayOf(todayISO())}</p>
        <p class="muted" id="lvDays"><b>Số ngày nghỉ: 1</b></p>
        <div class="field"><label>Buổi nghỉ</label>
          <select id="lvSes"><option>Sáng</option><option>Chiều</option><option selected>Cả ngày</option></select>
        </div>
        <div class="field"><label>Lý do</label><textarea id="lvReason" rows="3" placeholder="Nêu rõ lý do nghỉ"></textarea></div>
        <button class="btn btn-primary" onclick="submitLeave()">Gửi đơn</button>
      </div>
      <div class="card">
        <h3>Danh sách đơn</h3>
        <div class="leave-list">
          ${mine.length ? mine.map(l => `
            <div class="leave-item">
              <div>
                <b>${fmtDate(l.from)} → ${fmtDate(l.to)}</b>
                <div class="muted">${l.session || "Cả ngày"} · ${l.reason}</div>
                <div class="muted">${weekdayOf(l.from)} → ${weekdayOf(l.to)} · Gửi ${fmtDate(l.createdAt)}</div>
                <div class="timeline">
                  <span class="tl on">Đã gửi</span>
                  <span class="tl ${l.status!=="Chờ duyệt"?"on":""}">Chờ duyệt</span>
                  <span class="tl ${l.status==="Duyệt"||l.status==="Từ chối"?"on":""}">${l.status==="Từ chối"?"Từ chối":"Duyệt"}</span>
                </div>
              </div>
              <span class="badge ${l.status==="Duyệt"?"ok":l.status==="Từ chối"?"bad":"warn"}">${l.status}</span>
            </div>`).join("") : "<p class='empty'>Chưa có đơn nghỉ phép</p>"}
        </div>
      </div>
    </div>`;
}

async function submitLeave() {
  const s = studentById(SESSION.studentId);
  const reason = $("#lvReason").value.trim();
  if (!reason) return toast("Nhập lý do nghỉ");
  const rec = {
    id: uid("lv"), studentId: SESSION.studentId,
    from: $("#lvFrom").value, to: $("#lvTo").value, reason,
    session: $("#lvSes")?.value || "Cả ngày",
    fromWeekday: weekdayOf($("#lvFrom").value), toWeekday: weekdayOf($("#lvTo").value),
    status: "Chờ duyệt", source: "Form", createdAt: new Date().toISOString()
  };
  DB.leaves.push(rec);
  save(DB);
  toast("Đã gửi đơn — trạng thái: Chờ duyệt");
  await sendLeaveMail(rec, s);
  paint();
}
function syncLeaveDays() {
  const a = $("#lvFrom")?.value, b = $("#lvTo")?.value;
  if ($("#lvFromWd")) $("#lvFromWd").textContent = a ? ("Thứ: " + weekdayOf(a)) : "";
  if ($("#lvToWd")) $("#lvToWd").textContent = b ? ("Thứ: " + weekdayOf(b)) : "";
  if ($("#lvDays") && a && b) {
    const n = Math.round((new Date(b+"T00:00:00") - new Date(a+"T00:00:00")) / 86400000) + 1;
    $("#lvDays").innerHTML = n > 0 ? `<b>Số ngày nghỉ: ${n}</b>` : "<b>Khoảng ngày không hợp lệ</b>";
  }
}

/* ================= WEEKLY REPORT UI ================= */
function viewSvWeek() {
  const s = studentById(SESSION.studentId);
  const existed = DB.reports.find(r => r.studentId === s.id && r.week === DB.config.week && r.year === DB.config.year && r.term === DB.config.term);
  const a = existed?.answers || {};
  const ro = existed ? "disabled" : "";
  $("#main").innerHTML = `
    <div class="topbar"><h2>Báo cáo tuần</h2>${topMeta()}</div>
    <div class="card report-sheet">
      <div class="report-head">
        <div class="org">${DB.config.year}</div>
        <h3>Báo cáo tuần ${DB.config.week}</h3>
        <p class="muted">${DB.config.term} · ${s.name} · ${s.mssv} · ${className(s.classId)}</p>
        ${existed ? `<p style="margin-top:8px"><span class="badge ok">Đã nộp — mỗi tuần chỉ gửi một lần</span></p>` : `<p class="muted" style="margin-top:8px">Mỗi tuần chỉ được gửi một lần</p>`}
      </div>
      <div class="steps">
        <div class="step ${WEEK_STEP===1?"on":""}">1. Chuyên cần</div>
        <div class="step ${WEEK_STEP===2?"on":""}">2. Học tập</div>
        <div class="step ${WEEK_STEP===3?"on":""}">3. Hỗ trợ</div>
      </div>
      <div class="q-block">
        <h4>1. Chuyên cần</h4>
        <div class="form-grid">
          <div class="field"><label>${QUESTION.ABSENT}</label><input type="number" id="qABSENT" min="0" value="${a.ABSENT||0}" ${ro}></div>
          <div class="field"><label>${QUESTION.LATE}</label><input type="number" id="qLATE" min="0" value="${a.LATE||0}" ${ro}></div>
          <div class="field span-2"><label>${QUESTION.ABSENT_SESSION}</label><input id="qABSENT_SESSION" value="${a.ABSENT_SESSION||""}" ${ro}></div>
          <div class="field span-2"><label>${QUESTION.ABSENT_REASON}</label><input id="qABSENT_REASON" value="${a.ABSENT_REASON||""}" ${ro}></div>
          <div class="field"><label>${QUESTION.REPORTED}</label>
            <select id="qREPORTED" ${ro}><option>Chưa</option><option>Đã báo</option></select></div>
        </div>
      </div>
      <div class="q-block">
        <h4>2. Học tập</h4>
        <div class="form-grid">
          <div class="field"><label>${QUESTION.LEARNING}</label>
            <select id="qLEARNING" ${ro}><option>Tốt</option><option>Ổn</option><option>Yếu</option><option>Rất tốt</option></select></div>
          <div class="field"><label>${QUESTION.DIFFICULTY}</label>
            <select id="qDIFFICULTY" ${ro}><option>Không</option><option>Có</option></select></div>
          <div class="field span-2"><label>${QUESTION.DIFFICULTY_DETAIL}</label><input id="qDIFFICULTY_DETAIL" value="${a.DIFFICULTY_DETAIL||""}" ${ro}></div>
          <div class="field"><label>${QUESTION.SUBJECT}</label><input id="qSUBJECT" value="${a.SUBJECT||""}" ${ro}></div>
          <div class="field"><label>${QUESTION.ASSIGNMENT}</label>
            <select id="qASSIGNMENT" ${ro}><option>Không</option><option>Có</option></select></div>
          <div class="field span-2"><label>${QUESTION.MOTIVATION}</label><input id="qMOTIVATION" value="${a.MOTIVATION||""}" ${ro}></div>
        </div>
      </div>
      <div class="q-block">
        <h4>3. Hỗ trợ từ giáo viên chủ nhiệm</h4>
        <div class="form-grid">
          <div class="field span-2"><label>${QUESTION.IMPACT}</label><input id="qIMPACT" value="${a.IMPACT||""}" ${ro}></div>
          <div class="field"><label>${QUESTION.SUPPORT}</label>
            <select id="qSUPPORT" ${ro}><option>Không</option><option>Có</option></select></div>
          <div class="field"><label>${QUESTION.PRIVATE}</label>
            <select id="qPRIVATE" ${ro}><option>Không</option><option>Có</option></select></div>
          <div class="field span-2"><label>${QUESTION.SUPPORT_DETAIL}</label><input id="qSUPPORT_DETAIL" value="${a.SUPPORT_DETAIL||""}" ${ro}></div>
          <div class="field span-2"><label>${QUESTION.OTHER}</label><textarea id="qOTHER" rows="3" ${ro}>${a.OTHER||""}</textarea></div>
        </div>
      </div>
      ${existed ? "" : `<div class="modal-actions">
        ${WEEK_STEP>1?`<button class="btn btn-outline" onclick="stashWeek();WEEK_STEP--;paint()">Quay lại</button>`:""}
        ${WEEK_STEP<3?`<button class="btn btn-primary" onclick="stashWeek();WEEK_STEP++;paint()">Tiếp tục</button>`:`<button class="btn btn-primary" onclick="submitWeek()">Nộp báo cáo tuần</button>`}
      </div>`}
    </div>`;
  $$(".q-block").forEach((el, i) => { el.style.display = (i + 1) === WEEK_STEP || existed ? "" : "none"; });
  ["REPORTED","LEARNING","DIFFICULTY","ASSIGNMENT","SUPPORT","PRIVATE"].forEach(k => {
    const el = document.getElementById("q" + k);
    if (el && a[k]) el.value = a[k];
  });
  Object.entries(WEEK_DRAFT).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
}
function stashWeek() {
  $$("#main [id^='q']").forEach(el => { WEEK_DRAFT[el.id] = el.value; });
}
function submitWeek() {
  const answers = {};
  ["ABSENT","LATE","ABSENT_SESSION","ABSENT_REASON","REPORTED","LEARNING","DIFFICULTY","DIFFICULTY_DETAIL","SUBJECT","ASSIGNMENT","MOTIVATION","IMPACT","SUPPORT","PRIVATE","SUPPORT_DETAIL","OTHER"]
    .forEach(k => answers[k] = document.getElementById("q" + k)?.value || "");
  const exist = DB.reports.find(r => r.studentId === SESSION.studentId && r.week === DB.config.week && r.year === DB.config.year && r.term === DB.config.term);
  if (exist) { toast("Tuần này em đã nộp báo cáo. Mỗi tuần chỉ gửi một lần."); return; }
  DB.reports.push({
    id: uid("rp"), studentId: SESSION.studentId, week: DB.config.week,
    year: DB.config.year, term: DB.config.term, answers, createdAt: new Date().toISOString()
  });
  if (answers.SUPPORT === "Có" || Number(answers.ABSENT) > 2) {
    const sid = SESSION.studentId;
    if (!DB.issues.some(i => i.studentId === sid && i.week === DB.config.week)) {
      DB.issues.push({
        id: uid("is"), studentId: sid,
        type: Number(answers.ABSENT) > 2 ? "Nghiêm trọng" : "Cần hỗ trợ",
        text: answers.SUPPORT_DETAIL || answers.DIFFICULTY_DETAIL || "Từ báo cáo tuần",
        week: DB.config.week, reported: true, date: todayISO()
      });
    }
  }
  WEEK_DRAFT = {}; WEEK_STEP = 1;
  save(DB); toast("Đã lưu báo cáo tuần"); paint();
}

function viewFaculties() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Quản lý khoa</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar"><button class="btn btn-primary" onclick="openFacModal()">Tạo khoa</button></div>
      <div class="assign-list">
        ${(DB.faculties||[]).map(f => {
          const n = DB.teachers.filter(t => t.facultyId === f.id).length;
          return `<div class="assign-card">
            <div class="head">
              <div>
                <b>${f.name}</b>
                <div class="muted">${n} giáo viên · ${f.locked ? "Đã khóa" : "Đang mở"}</div>
              </div>
              <div>
                <button class="btn btn-sm btn-ghost" onclick="openFacModal('${f.id}')">Sửa</button>
                <button class="btn btn-sm ${f.locked?"btn-outline":"btn-danger"}" onclick="toggleFacLock('${f.id}')">${f.locked?"Mở khóa":"Khóa"}</button>
              </div>
            </div>
          </div>`;
        }).join("")}
      </div>
    </div>`;
}
function openFacModal(id) {
  const f = id ? DB.faculties.find(x => x.id === id) : { name: "" };
  editTarget = id || null;
  showModal(`<h3>${id?"Sửa":"Tạo"} khoa</h3>
    <div class="field"><label>Tên khoa</label><input id="facName" value="${f.name||""}"></div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveFac()">Lưu</button>
    </div>`);
}
function saveFac() {
  const name = $("#facName").value.trim();
  if (!name) return toast("Nhập tên khoa");
  if (editTarget) DB.faculties.find(f => f.id === editTarget).name = name;
  else DB.faculties.push({ id: uid("k"), name, locked: false });
  save(DB); hideModal(); paint(); toast("Đã lưu khoa");
}
function toggleFacLock(id) {
  const f = DB.faculties.find(x => x.id === id);
  if (!f.locked) {
    const n = DB.teachers.filter(t => t.facultyId === id).length;
    if (n) return toast("Không thể khóa khoa đang có giáo viên");
    f.locked = true;
  } else f.locked = false;
  save(DB); paint();
}

function viewTeachers() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Quản lý giáo viên</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar"><button class="btn btn-primary" onclick="openGvModal()">Thêm giáo viên</button></div>
      <div class="assign-list">
        ${DB.teachers.map(t => `<div class="assign-card">
          <div class="head">
            <div>
              <b>${t.name}</b>
              <div class="muted">${t.title || ""} · ${t.position || ""} · ${facultyName(t.facultyId)}</div>
              <div class="muted">Ngày sinh: ${fmtDate(t.dob)} · Tài khoản: ${t.username}</div>
              <div style="margin-top:6px"><span class="badge ${t.active!==false?"ok":"warn"}">${t.active!==false?"Hoạt động":"Không hoạt động"}</span></div>
            </div>
            <div>
              <button class="btn btn-sm btn-ghost" onclick="openGvModal('${t.id}')">Sửa</button>
              <button class="btn btn-sm btn-outline" onclick="resetGvPw('${t.id}')">Cấp lại MK</button>
              <button class="btn btn-sm btn-danger" onclick="delGv('${t.id}')">Xóa</button>
            </div>
          </div>
        </div>`).join("")}
      </div>
    </div>`;
}
function openGvModal(id) {
  const t = id ? DB.teachers.find(x => x.id === id) : { name:"", dob:"", position:"Giảng viên", title:"Giáo viên chủ nhiệm", facultyId: DB.faculties[0]?.id, username:"", password:"123456", active: true };
  editTarget = id || null;
  showModal(`<h3>${id?"Sửa":"Thêm"} giáo viên</h3>
    <div class="form-grid">
      <div class="field"><label>Họ và tên</label><input id="gvName" value="${t.name||""}"></div>
      <div class="field"><label>Vị trí</label><input id="gvPos" value="${t.position||""}"></div>
      <div class="field span-2"><label>Ngày sinh</label>${dateSelectHTML("gvDob", t.dob)}</div>
      <div class="field"><label>Chức vụ</label><input id="gvTitle" value="${t.title||""}"></div>
      <div class="field"><label>Khoa</label>
        <select id="gvFac">${(DB.faculties||[]).filter(f=>!f.locked || f.id===t.facultyId).map(f=>`<option value="${f.id}" ${t.facultyId===f.id?"selected":""}>${f.name}${f.locked?" (đã khóa)":""}</option>`).join("")}</select>
      </div>
      <div class="field"><label>Trạng thái</label>
        <select id="gvActive"><option value="1" ${t.active!==false?"selected":""}>Hoạt động</option><option value="0" ${t.active===false?"selected":""}>Không hoạt động</option></select>
      </div>
      <div class="field"><label>Tài khoản</label><input id="gvUser" value="${t.username||""}"></div>
      <div class="field"><label>Mật khẩu</label>
        <div class="pw-wrap">
          <input id="gvPass" type="password" value="${t.password||""}">
          ${pwToggleBtn("gvPass")}
        </div>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveGv()">Lưu</button>
    </div>`);
}
function saveGv() {
  const rec = {
    name: $("#gvName").value.trim(),
    dob: readDateSelect("gvDob"),
    position: $("#gvPos").value.trim(),
    title: $("#gvTitle").value.trim(),
    facultyId: $("#gvFac").value,
    active: $("#gvActive").value === "1",
    username: $("#gvUser").value.trim(),
    password: $("#gvPass").value || "123456"
  };
  if (!rec.name || !rec.username) return toast("Nhập họ tên và tài khoản");
  if (editTarget) Object.assign(DB.teachers.find(t => t.id === editTarget), rec);
  else DB.teachers.push({ id: uid("gv"), ...rec });
  save(DB); hideModal(); paint(); toast("Đã lưu giáo viên");
}
function delGv(id) {
  if (DB.teachers.length === 1) return toast("Cần giữ ít nhất một giáo viên");
  if (!confirm("Xóa giáo viên này?")) return;
  DB.teachers = DB.teachers.filter(t => t.id !== id); save(DB); paint();
}
function resetGvPw(id) {
  const t = DB.teachers.find(x => x.id === id);
  t.password = "Gv@" + Math.random().toString(36).slice(2, 8);
  save(DB);
  alert("Mật khẩu mới của " + t.name + ":\n\n" + t.password);
}

function viewPassword() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Đổi mật khẩu</h2>${topMeta()}</div>
    <div class="card" style="max-width:460px">
      <div class="field"><label>Mật khẩu hiện tại</label>
        <div class="pw-wrap">
          <input id="pwOld" type="password">
          ${pwToggleBtn("pwOld")}
        </div>
      </div>
      <div class="field"><label>Mật khẩu mới</label>
        <div class="pw-wrap">
          <input id="pwNew" type="password">
          ${pwToggleBtn("pwNew")}
        </div>
      </div>
      <div class="field"><label>Nhập lại mật khẩu mới</label>
        <div class="pw-wrap">
          <input id="pwNew2" type="password">
          ${pwToggleBtn("pwNew2")}
        </div>
      </div>
      <button class="btn btn-primary" onclick="changePassword()">Cập nhật mật khẩu</button>
    </div>`;
}
function changePassword() {
  const oldP = $("#pwOld").value, n1 = $("#pwNew").value, n2 = $("#pwNew2").value;
  if (!n1 || n1 !== n2) return toast("Mật khẩu mới không khớp");
  if (SESSION.role === "ad") {
    if (oldP !== DB.admin.password) return toast("Mật khẩu hiện tại không đúng");
    DB.admin.password = n1;
  } else if (SESSION.role === "gv") {
    const t = currentTeacher();
    if (!t || oldP !== t.password) return toast("Mật khẩu hiện tại không đúng");
    t.password = n1;
  } else {
    const s = studentById(SESSION.studentId);
    if (!s || oldP !== s.password) return toast("Mật khẩu hiện tại không đúng");
    s.password = n1;
  }
  save(DB); toast("Đã đổi mật khẩu"); paint();
}

function showModal(html) { $("#overlay").classList.add("show"); $("#modal").innerHTML = html; }
function hideModal() { $("#overlay").classList.remove("show"); }

window.addEventListener("DOMContentLoaded", () => {
  $$(".role-pills button").forEach(b => b.onclick = () => {
    $$(".role-pills button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
  });
  $("#btnLogin").onclick = login;
  const loginPwBtn = document.querySelector("#loginPass")?.parentElement?.querySelector(".pw-toggle");
  if (loginPwBtn) loginPwBtn.innerHTML = ICO_DOTS;
  $("#loginPass").addEventListener("keydown", e => { if (e.key === "Enter") login(); });
  const saved = restoreSession();
  if (saved && saved.role) { SESSION = saved; enterApp(); }
  $("#btnMenu")?.addEventListener("click", () => {
    $("#sidebar").classList.toggle("open");
    $("#backdrop").classList.toggle("show");
  });
  $("#backdrop")?.addEventListener("click", closeSidebar);
});
