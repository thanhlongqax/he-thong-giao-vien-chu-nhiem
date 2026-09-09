/************************************************************
 * HỆ THỐNG QUẢN LÝ LỚP PHÂN HỆ – GVCN
 ************************************************************/
const KEY = "gvcn_system_v1";
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
  { id: "daihoc", name: "Đại học", icon: "🎓" },
  { id: "caodang", name: "Cao đẳng", icon: "🏫" },
  { id: "trungcap", name: "Trung cấp", icon: "📘" }
];

const STATUS = ["Đang học", "Bảo lưu", "Đình chỉ", "Tốt nghiệp", "Nghỉ học", "Cần quan tâm", "Cần theo dõi"];
const ROLES_CS = ["Lớp trưởng", "Lớp phó học tập", "Lớp phó đời sống", "Bí thư", "Thủ quỹ", "Không"];

function uid(p = "id") { return p + "_" + Math.random().toString(36).slice(2, 9); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function validPhone(s) {
  if (!s) return true;
  return /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(String(s).replace(/\s/g, ""));
}

function seed() {
  const classes = [
    { id: "c1", name: "DHKT01", level: "daihoc", year: "2025-2026", note: "Kinh tế - Đại học" },
    { id: "c2", name: "CDCN02", level: "caodang", year: "2025-2026", note: "Công nghệ - Cao đẳng" },
    { id: "c3", name: "TCCN01", level: "trungcap", year: "2025-2026", note: "Công nghệ - Trung cấp" }
  ];
  const students = [
    ["SV001","Nguyễn Minh Anh","Nữ","2005-03-12","c1","0912345001","Nguyễn Văn A","0901111001","Trần Thị B","0901111002","12 Nguyễn Huệ, Q1","KTX A, P.101","Đang học"],
    ["SV002","Trần Quốc Bảo","Nam","2005-07-21","c1","0912345002","Trần Văn C","0901111003","Lê Thị D","0901111004","45 Lê Lợi, Q3","KTX A, P.102","Đang học"],
    ["SV003","Lê Gia Hân","Nữ","2005-01-09","c1","0912345003","Lê Văn E","0901111005","Phạm Thị F","0901111006","8 Pasteur, Q1","Nhà trọ Q.Tân Bình","Cần quan tâm"],
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
    username: r[0].toLowerCase(), password: "123456", officer: i === 0 ? "Lớp trưởng" : i === 4 ? "Lớp trưởng" : i === 7 ? "Lớp trưởng" : "Không"
  }));
  const subjects = [
    { id: "m1", name: "Toán cao cấp", code: "MATH101", credit: 3 },
    { id: "m2", name: "Tin học đại cương", code: "IT101", credit: 3 },
    { id: "m3", name: "Triết học", code: "PHIL101", credit: 2 },
    { id: "m4", name: "Kỹ năng mềm", code: "SS101", credit: 2 },
    { id: "m5", name: "Anh văn 1", code: "ENG101", credit: 3 }
  ];
  const assigns = [
    { id: "a1", subjectId: "m1", classId: "c1", year: "2025-2026", term: "Học kỳ 1" },
    { id: "a2", subjectId: "m2", classId: "c1", year: "2025-2026", term: "Học kỳ 1" },
    { id: "a3", subjectId: "m5", classId: "c1", year: "2025-2026", term: "Học kỳ 1" },
    { id: "a4", subjectId: "m2", classId: "c2", year: "2025-2026", term: "Học kỳ 1" },
    { id: "a5", subjectId: "m4", classId: "c2", year: "2025-2026", term: "Học kỳ 1" },
    { id: "a6", subjectId: "m4", classId: "c3", year: "2025-2026", term: "Học kỳ 1" }
  ];
  const attendance = [
    { id: "at1", studentId: "s3", subjectId: "m1", date: todayISO(), status: "Vắng", note: "Không phép" },
    { id: "at2", studentId: "s2", subjectId: "m1", date: todayISO(), status: "Trễ", note: "15 phút" },
    { id: "at3", studentId: "s5", subjectId: "m2", date: todayISO(), status: "Vắng", note: "Có phép" }
  ];
  const leaves = [
    { id: "lv1", studentId: "s3", from: todayISO(), to: todayISO(), reason: "Ốm, khám bệnh", status: "Chờ duyệt", createdAt: new Date().toISOString() }
  ];
  const reports = [
    { id: "rp1", studentId: "s1", week: 8, year: "2025-2026", term: "Học kỳ 1",
      answers: { ABSENT: "0", LATE: "0", LEARNING: "Tốt", DIFFICULTY: "Không", SUPPORT: "Không", MOTIVATION: "Ổn định" },
      createdAt: new Date().toISOString() }
  ];
  const tasks = [
    { id: "t1", title: "Họp lớp đầu tuần", date: todayISO(), type: "Hôm nay", done: false },
    { id: "t2", title: "Duyệt đơn nghỉ phép", date: todayISO(), type: "Hôm nay", done: false },
    { id: "t3", title: "Nhập điểm danh môn Toán", date: todayISO(), type: "Tuần này", done: false },
    { id: "t4", title: "Nộp báo cáo tuần lên khoa", date: todayISO(), type: "Tuần này", done: false }
  ];
  const schedule = [
    { day: "Thứ 2", slots: "07:30 Toán cao cấp – DHKT01" },
    { day: "Thứ 3", slots: "09:20 Tin học đại cương – DHKT01" },
    { day: "Thứ 4", slots: "13:00 Anh văn 1 – DHKT01" },
    { day: "Thứ 5", slots: "07:30 Kỹ năng mềm – CDCN02" },
    { day: "Thứ 6", slots: "09:20 Tin học – CDCN02 / TCCN01" }
  ];
  return {
    config: {
      year: "2025-2026",
      term: "Học kỳ 1",
      week: 8,
      gmailNotify: true,
      gmail: "gvcn.demo@gmail.com"
    },
    teacher: { name: "Nguyễn Thị Hồng", username: "gv", password: "123456" },
    classes, students, subjects, assigns, attendance, leaves, reports, tasks, schedule,
    issues: [
      { id: "is1", studentId: "s3", type: "Nghiêm trọng", text: "Nghỉ không phép 2 buổi liên tiếp", week: 8, reported: false },
      { id: "is2", studentId: "s5", type: "Cần hỗ trợ", text: "Gia đình khó khăn, hay đi trễ", week: 8, reported: true }
    ]
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { const s = seed(); save(s); return s; }
    return JSON.parse(raw);
  } catch { const s = seed(); save(s); return s; }
}
function save(db) { localStorage.setItem(KEY, JSON.stringify(db)); }

let DB = load();
let SESSION = null;
let VIEW = "dash";
let CLS_LEVEL = null;
let CLS_ID = null;
let editTarget = null;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2400);
}

function className(id) { return DB.classes.find(c => c.id === id)?.name || "—"; }
function studentById(id) { return DB.students.find(s => s.id === id); }
function subjectName(id) { return DB.subjects.find(s => s.id === id)?.name || "—"; }

function phoneOkOrWarn(v, label) {
  if (v && !validPhone(v)) { toast(label + " không hợp lệ (VD: 0912345678)"); return false; }
  return true;
}

/* ================= LOGIN ================= */
function login() {
  const role = $(".role-pills button.active").dataset.role;
  const user = $("#loginUser").value.trim();
  const pass = $("#loginPass").value;
  if (role === "gv") {
    if (user === DB.teacher.username && pass === DB.teacher.password) {
      SESSION = { role: "gv", name: DB.teacher.name };
      enterApp();
      return;
    }
    toast("Sai tài khoản giáo viên (gv / 123456)");
    return;
  }
  const st = DB.students.find(s => (s.username === user.toLowerCase() || s.mssv === user.toUpperCase()) && s.password === pass);
  if (st) {
    SESSION = { role: "sv", studentId: st.id, name: st.name };
    enterApp();
    return;
  }
  toast("Sai MSSV hoặc mật khẩu học sinh");
}

function logout() {
  SESSION = null;
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
  const navGV = [
    ["dash", "🏠", "Tổng quan"],
    ["classes", "🏫", "Lớp chủ nhiệm"],
    ["students", "👨‍🎓", "Sinh viên"],
    ["homeroom", "🌿", "Lớp theo phân hệ"],
    ["subjects", "📚", "Môn học"],
    ["attend", "🗓️", "Điểm danh"],
    ["work", "✅", "Công việc"],
    ["report", "📊", "Báo cáo"],
    ["leave", "📝", "Nghỉ phép"],
    ["config", "⚙️", "Cấu hình"]
  ];
  const navSV = [
    ["svinfo", "👤", "Thông tin"],
    ["svleave", "📝", "Nghỉ phép"],
    ["svweek", "📋", "Báo cáo tuần"]
  ];
  const nav = isGV ? navGV : navSV;
  VIEW = isGV ? "dash" : "svinfo";
  $("#sidebar").innerHTML = `
    <div class="side-brand">
      <div class="logo">🌿</div>
      <div><b>GVCN Hub</b><span>Quản lý lớp phân hệ</span></div>
    </div>
    <div class="nav">
      ${nav.map(([id, ic, lb]) => `<button data-view="${id}">${ic} ${lb}</button>`).join("")}
    </div>
    <div class="side-user">
      <div class="avatar">${SESSION.name.slice(0,1)}</div>
      <div style="flex:1">
        <b style="font-size:13px">${SESSION.name}</b>
        <div class="muted" style="color:#bbf7d0">${isGV ? "Giáo viên chủ nhiệm" : "Học sinh"}</div>
      </div>
      <button class="btn btn-sm btn-ghost" onclick="logout()">Thoát</button>
    </div>`;
  $$("#sidebar .nav button").forEach(b => b.onclick = () => { VIEW = b.dataset.view; paint(); });
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
    subjects: viewSubjects, attend: viewAttend, work: viewWork, report: viewReport,
    leave: viewLeave, config: viewConfig, svinfo: viewSvInfo, svleave: viewSvLeave, svweek: viewSvWeek
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
  $("#main").innerHTML = `
    <div class="topbar"><div><h2>Tổng quan lớp chủ nhiệm</h2><p class="muted">Xin chào, ${SESSION.name}</p></div>${topMeta()}</div>
    <div class="grid g-4">
      <div class="stat"><div class="k">Sinh viên</div><div class="v">${n}</div></div>
      <div class="stat"><div class="k">Đơn phép chờ</div><div class="v">${pend}</div></div>
      <div class="stat"><div class="k">Lượt vắng / trễ</div><div class="v">${abs} / ${late}</div></div>
      <div class="stat"><div class="k">Cần quan tâm</div><div class="v">${care}</div></div>
    </div>
    <div class="grid g-2" style="margin-top:16px">
      <div class="card">
        <h3>Công việc hôm nay</h3>
        ${DB.tasks.filter(t => t.type === "Hôm nay").map(t => `
          <label style="display:flex;gap:8px;align-items:center;margin:8px 0">
            <input type="checkbox" ${t.done?"checked":""} onchange="toggleTask('${t.id}')"> ${t.title}
          </label>`).join("") || "<p class='empty'>Không có việc</p>"}
      </div>
      <div class="card">
        <h3>Cảnh báo</h3>
        ${DB.issues.map(i => {
          const s = studentById(i.studentId);
          return `<div style="padding:8px 0;border-bottom:1px solid #f1f5f9">
            <b>${s?.name}</b> · <span class="badge ${i.type==="Nghiêm trọng"?"bad":"warn"}">${i.type}</span>
            <div class="muted">${i.text}</div></div>`;
        }).join("")}
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
        <button class="btn btn-primary" onclick="openClassModal()">＋ Thêm lớp</button>
      </div>
      <div id="classTable"></div>
    </div>`;
  renderClassTable();
}
function renderClassTable() {
  const q = ($("#qClass")?.value || "").toLowerCase();
  const rows = DB.classes.filter(c => c.name.toLowerCase().includes(q) || c.note.toLowerCase().includes(q));
  $("#classTable").innerHTML = `<table><thead><tr><th>Lớp</th><th>Phân hệ</th><th>Năm học</th><th>Sĩ số</th><th>Ghi chú</th><th></th></tr></thead><tbody>
    ${rows.map(c => {
      const lv = LEVELS.find(l => l.id === c.level)?.name || c.level;
      const n = DB.students.filter(s => s.classId === c.id).length;
      return `<tr><td><b>${c.name}</b></td><td>${lv}</td><td>${c.year}</td><td>${n}</td><td>${c.note||""}</td>
        <td>
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
  const rec = {
    name: $("#fName").value.trim(),
    level: $("#fLevel").value,
    year: $("#fYear").value.trim(),
    note: $("#fNote").value.trim()
  };
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
        <button class="btn btn-primary" onclick="openSvModal()">＋ Thêm SV</button>
        <button class="btn btn-ghost" onclick="document.getElementById('fileImp').click()">⬆ Excel / JSON</button>
        <input type="file" id="fileImp" accept=".xlsx,.xls,.json,.csv" hidden onchange="importFile(event)">
        <button class="btn btn-outline" onclick="exportSvExcel()">⬇ Excel mẫu</button>
      </div>
      <div id="svTable" style="overflow:auto"></div>
    </div>`;
  renderSvTable();
}
function renderSvTable() {
  const q = ($("#qSv")?.value || "").toLowerCase();
  const cf = $("#fClassFilter")?.value || "";
  const rows = DB.students.filter(s => {
    if (cf && s.classId !== cf) return false;
    const blob = [s.mssv, s.name, s.phone, s.status].join(" ").toLowerCase();
    return blob.includes(q);
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
      <div class="field"><label>Ngày sinh</label><input type="date" id="svDob" value="${s.dob}"></div>
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
      <div class="field"><label>Mật khẩu</label><input id="svPass" value="${s.password}"></div>
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
    dob: $("#svDob").value,
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
      const arr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      ingestStudents(arr);
    }
  } catch (err) { toast("File không hợp lệ"); console.error(err); }
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
      <div class="topbar"><h2>Lớp chủ nhiệm theo phân hệ</h2>${topMeta()}</div>
      <p class="muted" style="margin-bottom:12px">Chọn phân hệ → chọn lớp → danh sách sinh viên & bổ nhiệm ban cán sự</p>
      <div class="level-cards">
        ${LEVELS.map(l => {
          const n = DB.classes.filter(c => c.level === l.id).length;
          return `<div class="level-card" onclick="CLS_LEVEL='${l.id}';paint()">
            <div style="font-size:32px">${l.icon}</div><h4>${l.name}</h4>
            <p class="muted">${n} lớp chủ nhiệm</p></div>`;
        }).join("")}
      </div>`;
    return;
  }
  if (!CLS_ID) {
    const list = DB.classes.filter(c => c.level === CLS_LEVEL);
    const lv = LEVELS.find(l => l.id === CLS_LEVEL);
    $("#main").innerHTML = `
      <div class="topbar"><h2>${lv.icon} ${lv.name}</h2>${topMeta()}</div>
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
      <table><thead><tr><th>MSSV</th><th>Họ tên</th><th>SĐT</th><th>Tình trạng</th><th>Ban cán sự</th></tr></thead>
      <tbody>${list.map(s => `<tr>
        <td>${s.mssv}</td><td>${s.name}</td><td>${s.phone}</td><td>${s.status}</td>
        <td><select onchange="setOfficer('${s.id}', this.value)">
          ${ROLES_CS.map(r => `<option ${s.officer===r?"selected":""}>${r}</option>`).join("")}
        </select></td>
      </tr>`).join("")}</tbody></table>
    </div>`;
}
function setOfficer(id, v) {
  studentById(id).officer = v; save(DB); toast("Đã bổ nhiệm " + v);
}

/* ================= SUBJECTS ================= */
function viewSubjects() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Quản lý môn học</h2>${topMeta()}</div>
    <div class="grid g-2">
      <div class="card">
        <h3>Danh mục môn <button class="btn btn-sm btn-primary" onclick="openSubModal()">＋ Môn</button></h3>
        <table><thead><tr><th>Mã</th><th>Tên</th><th>TC</th><th></th></tr></thead>
        <tbody>${DB.subjects.map(m => `<tr>
          <td>${m.code}</td><td>${m.name}</td><td>${m.credit}</td>
          <td>
            <button class="btn btn-sm btn-ghost" onclick="openSubModal('${m.id}')">Sửa</button>
            <button class="btn btn-sm btn-danger" onclick="delSub('${m.id}')">Xóa</button>
          </td></tr>`).join("")}</tbody></table>
      </div>
      <div class="card">
        <h3>Phân môn theo lớp / kỳ
          <button class="btn btn-sm btn-primary" onclick="openAssignModal()">＋ Phân công</button>
        </h3>
        <table><thead><tr><th>Môn</th><th>Lớp</th><th>Năm</th><th>Kỳ</th><th></th></tr></thead>
        <tbody>${DB.assigns.map(a => `<tr>
          <td>${subjectName(a.subjectId)}</td><td>${className(a.classId)}</td>
          <td>${a.year}</td><td>${a.term}</td>
          <td><button class="btn btn-sm btn-danger" onclick="delAssign('${a.id}')">Xóa</button></td>
        </tr>`).join("")}</tbody></table>
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
function openAssignModal() {
  showModal(`<h3>Phân môn cho lớp</h3>
    <div class="form-grid">
      <div class="field"><label>Môn</label><select id="asSub">${DB.subjects.map(s=>`<option value="${s.id}">${s.name}</option>`).join("")}</select></div>
      <div class="field"><label>Lớp</label><select id="asCls">${DB.classes.map(c=>`<option value="${c.id}">${c.name}</option>`).join("")}</select></div>
      <div class="field"><label>Năm học</label><input id="asYear" value="${DB.config.year}"></div>
      <div class="field"><label>Kỳ học</label><input id="asTerm" value="${DB.config.term}"></div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveAssign()">Lưu</button>
    </div>`);
}
function saveAssign() {
  DB.assigns.push({
    id: uid("a"), subjectId: $("#asSub").value, classId: $("#asCls").value,
    year: $("#asYear").value, term: $("#asTerm").value
  });
  save(DB); hideModal(); paint(); toast("Đã phân môn");
}
function delAssign(id) { DB.assigns = DB.assigns.filter(a => a.id !== id); save(DB); paint(); }

/* ================= ATTEND ================= */
function viewAttend() {
  const assigns = DB.assigns.filter(a => a.year === DB.config.year && a.term === DB.config.term);
  $("#main").innerHTML = `
    <div class="topbar"><h2>Điểm danh theo ngày học</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <select id="atAssign">${assigns.map(a => `<option value="${a.id}">${subjectName(a.subjectId)} · ${className(a.classId)}</option>`).join("")}</select>
        <input type="date" id="atDate" value="${todayISO()}">
        <button class="btn btn-primary" onclick="renderAttendSheet()">Mở buổi học</button>
      </div>
      <div id="atSheet"></div>
      <h3 style="margin-top:16px">Lịch sử điểm danh</h3>
      <table><thead><tr><th>Ngày</th><th>Môn</th><th>SV</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead>
      <tbody>${[...DB.attendance].reverse().slice(0,30).map(a => `<tr>
        <td>${a.date}</td><td>${subjectName(a.subjectId)}</td>
        <td>${studentById(a.studentId)?.name||""}</td>
        <td><span class="badge ${a.status==="Có mặt"?"ok":a.status==="Trễ"?"warn":"bad"}">${a.status}</span></td>
        <td>${a.note||""}</td></tr>`).join("")}</tbody></table>
    </div>`;
}
function renderAttendSheet() {
  const as = DB.assigns.find(a => a.id === $("#atAssign").value);
  if (!as) return toast("Chưa có phân môn");
  const date = $("#atDate").value;
  const list = DB.students.filter(s => s.classId === as.classId);
  $("#atSheet").innerHTML = `
    <p class="muted">Buổi ${date} · ${subjectName(as.subjectId)} · ${className(as.classId)}</p>
    <table><thead><tr><th>SV</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead>
    <tbody>${list.map(s => {
      const ex = DB.attendance.find(a => a.studentId===s.id && a.subjectId===as.subjectId && a.date===date);
      return `<tr>
        <td>${s.mssv} · ${s.name}</td>
        <td><select id="st_${s.id}">
          ${["Có mặt","Trễ","Vắng"].map(x=>`<option ${((ex?.status)||"Có mặt")===x?"selected":""}>${x}</option>`).join("")}
        </select></td>
        <td><input id="nt_${s.id}" value="${ex?.note||""}"></td>
      </tr>`;
    }).join("")}</tbody></table>
    <button class="btn btn-primary" style="margin-top:10px" onclick="saveAttend('${as.subjectId}','${date}')">Lưu điểm danh</button>`;
}
function saveAttend(subjectId, date) {
  const as = DB.assigns.find(a => a.subjectId === subjectId && $("#atAssign") && a.id === $("#atAssign").value) || DB.assigns.find(a => a.subjectId === subjectId);
  const list = DB.students.filter(s => s.classId === as.classId);
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
  const days = ["CN","T2","T3","T4","T5","T6","T7"];
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const pads = start.getDay();
  const last = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  let cells = days.map(d => `<div class="d head">${d}</div>`).join("");
  for (let i=0;i<pads;i++) cells += `<div class="d"></div>`;
  for (let d=1; d<=last; d++) {
    const iso = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const isT = iso === todayISO();
    const t = DB.tasks.filter(x => x.date === iso);
    cells += `<div class="d ${isT?"today":""}"><b>${d}</b>${t.map(x=>`<div class="muted">${x.title}</div>`).join("")}</div>`;
  }
  $("#main").innerHTML = `
    <div class="topbar"><h2>Công việc & lịch học</h2>${topMeta()}</div>
    <div class="grid g-2">
      <div class="card">
        <h3>Hôm nay</h3>
        ${DB.tasks.filter(t=>t.type==="Hôm nay").map(t=>taskRow(t)).join("")}
        <h3 style="margin-top:14px">Tuần này</h3>
        ${DB.tasks.filter(t=>t.type==="Tuần này").map(t=>taskRow(t)).join("")}
        <div class="toolbar" style="margin-top:12px">
          <input id="newTask" placeholder="Thêm việc...">
          <select id="newTaskType"><option>Hôm nay</option><option>Tuần này</option></select>
          <button class="btn btn-primary" onclick="addTask()">Thêm</button>
        </div>
      </div>
      <div class="card">
        <h3>Lịch học lớp (kỳ ${DB.config.term})</h3>
        <table><thead><tr><th>Ngày</th><th>Nội dung</th></tr></thead>
        <tbody>${DB.schedule.map(s=>`<tr><td>${s.day}</td><td>${s.slots}</td></tr>`).join("")}</tbody></table>
        <h3 style="margin-top:16px">Lịch tháng</h3>
        <div class="cal">${cells}</div>
      </div>
    </div>`;
}
function taskRow(t) {
  return `<label style="display:flex;gap:8px;align-items:center;margin:8px 0">
    <input type="checkbox" ${t.done?"checked":""} onchange="toggleTask('${t.id}')">
    <span style="${t.done?"text-decoration:line-through;opacity:.6":""}">${t.title}</span>
  </label>`;
}
function addTask() {
  const title = $("#newTask").value.trim();
  if (!title) return;
  DB.tasks.push({ id: uid("t"), title, date: todayISO(), type: $("#newTaskType").value, done: false });
  save(DB); paint();
}

/* ================= REPORT ================= */
function viewReport() {
  const lateMap = {};
  DB.attendance.filter(a => a.status === "Trễ").forEach(a => lateMap[a.studentId] = (lateMap[a.studentId]||0)+1);
  const absMap = {};
  DB.attendance.filter(a => a.status === "Vắng").forEach(a => absMap[a.studentId] = (absMap[a.studentId]||0)+1);
  const weekReports = DB.reports.filter(r => r.week === DB.config.week);
  const reportedIds = new Set(weekReports.map(r => r.studentId));
  const needSupport = DB.reports.filter(r => (r.answers.SUPPORT||"").toLowerCase().includes("có") || (r.answers.DIFFICULTY||"").toLowerCase() === "có");
  const serious = DB.issues.filter(i => i.type === "Nghiêm trọng");
  const care = DB.students.filter(s => s.status === "Cần quan tâm");
  const watch = DB.students.filter(s => s.status === "Cần theo dõi");
  $("#main").innerHTML = `
    <div class="topbar"><h2>Báo cáo & thống kê lớp</h2>${topMeta()}</div>
    <div class="grid g-4">
      <div class="stat"><div class="k">Vấn đề nghiêm trọng</div><div class="v">${serious.length}</div></div>
      <div class="stat"><div class="k">Nghỉ học (lượt)</div><div class="v">${DB.attendance.filter(a=>a.status==="Vắng").length}</div></div>
      <div class="stat"><div class="k">Cần GV hỗ trợ</div><div class="v">${needSupport.length}</div></div>
      <div class="stat"><div class="k">Đã báo cáo tuần</div><div class="v">${weekReports.length}/${DB.students.length}</div></div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="toolbar">
        <button class="btn btn-primary" onclick="exportReportExcel()">⬇ Excel</button>
        <button class="btn btn-ghost" onclick="exportReportPDF()">⬇ PDF tuần</button>
        <button class="btn btn-outline" onclick="exportTermPDF()">⬇ PDF học kỳ</button>
      </div>
      <div class="tabs">
        <button class="active" onclick="showRepTab(this,'repSerious')">Nghiêm trọng</button>
        <button onclick="showRepTab(this,'repAbsent')">Nghỉ học</button>
        <button onclick="showRepTab(this,'repLate')">Tổng lượt trễ</button>
        <button onclick="showRepTab(this,'repCare')">Cần quan tâm</button>
        <button onclick="showRepTab(this,'repWatch')">Cần theo dõi</button>
        <button onclick="showRepTab(this,'repWeek')">Báo cáo tuần</button>
      </div>
      <div id="repSerious">${serious.map(i=>`<p><b>${studentById(i.studentId)?.name}</b> — ${i.text} ${i.reported?'<span class="badge ok">Đã báo tuần</span>':'<span class="badge warn">Chưa báo tuần</span>'}</p>`).join("")||"<p class='empty'>Không có</p>"}</div>
      <div id="repAbsent" hidden><table><thead><tr><th>SV</th><th>Lượt vắng</th></tr></thead><tbody>
        ${Object.keys(absMap).map(id=>`<tr><td>${studentById(id)?.name}</td><td>${absMap[id]}</td></tr>`).join("")||"<tr><td colspan=2>Không có</td></tr>"}
      </tbody></table></div>
      <div id="repLate" hidden><table><thead><tr><th>SV</th><th>Tổng lượt trễ</th></tr></thead><tbody>
        ${Object.keys(lateMap).map(id=>`<tr><td>${studentById(id)?.name}</td><td>${lateMap[id]}</td></tr>`).join("")||"<tr><td colspan=2>Không có</td></tr>"}
      </tbody></table></div>
      <div id="repCare" hidden>${care.map(s=>`<p>${s.mssv} · ${s.name} · ${className(s.classId)}</p>`).join("")||"<p class='empty'>Không có</p>"}</div>
      <div id="repWatch" hidden>${watch.map(s=>`<p>${s.mssv} · ${s.name} · ${className(s.classId)}</p>`).join("")||"<p class='empty'>Không có</p>"}</div>
      <div id="repWeek" hidden>
        <table><thead><tr><th>SV</th><th>Đã nộp tuần ${DB.config.week}?</th><th>Cần hỗ trợ</th></tr></thead>
        <tbody>${DB.students.map(s => {
          const r = weekReports.find(x => x.studentId === s.id);
          return `<tr><td>${s.name}</td><td>${r?'<span class="badge ok">Đã nộp</span>':'<span class="badge warn">Chưa</span>'}</td>
            <td>${r?.answers.SUPPORT||"—"}</td></tr>`;
        }).join("")}</tbody></table>
      </div>
    </div>`;
}
function showRepTab(btn, id) {
  $$(".tabs button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  ["repSerious","repAbsent","repLate","repCare","repWatch","repWeek"].forEach(x => {
    const el = document.getElementById(x); if (el) el.hidden = x !== id;
  });
}
function exportReportExcel() {
  const rows = DB.students.map(s => ({
    mssv: s.mssv, name: s.name, lop: className(s.classId), status: s.status,
    vang: DB.attendance.filter(a => a.studentId===s.id && a.status==="Vắng").length,
    tre: DB.attendance.filter(a => a.studentId===s.id && a.status==="Trễ").length,
    baoCaoTuan: DB.reports.some(r => r.studentId===s.id && r.week===DB.config.week) ? "Đã nộp" : "Chưa"
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "BaoCaoLop");
  XLSX.writeFile(wb, `bao_cao_tuan_${DB.config.week}_${DB.config.year}.xlsx`);
}
function exportReportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(`Bao cao tuan ${DB.config.week} - ${DB.config.year} - ${DB.config.term}`, 14, 16);
  doc.setFontSize(10);
  doc.text(`GVCN: ${DB.teacher.name}`, 14, 24);
  const body = DB.students.map(s => [
    s.mssv, s.name, className(s.classId), s.status,
    String(DB.attendance.filter(a => a.studentId===s.id && a.status==="Vắng").length),
    String(DB.attendance.filter(a => a.studentId===s.id && a.status==="Trễ").length)
  ]);
  doc.autoTable({ startY: 30, head: [["MSSV","Ho ten","Lop","Tinh trang","Vang","Tre"]], body });
  doc.save(`bao_cao_tuan_${DB.config.week}.pdf`);
}
function exportTermPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(`Bao cao hoc ky - ${DB.config.term} ${DB.config.year}`, 14, 16);
  doc.setFontSize(10);
  doc.text(`Tong SV: ${DB.students.length} | Don phep: ${DB.leaves.length} | Can quan tam: ${DB.students.filter(s=>s.status.includes("Cần")).length}`, 14, 24);
  const body = DB.students.map(s => [s.mssv, s.name, s.status, s.officer]);
  doc.autoTable({ startY: 30, head: [["MSSV","Ho ten","Tinh trang","Can su"]], body });
  doc.save(`bao_cao_hoc_ky.pdf`);
}

/* ================= LEAVE GV ================= */
function viewLeave() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Duyệt nghỉ phép</h2>${topMeta()}</div>
    <div class="card">
      <p class="muted" style="margin-bottom:10px">Thông báo Gmail: ${DB.config.gmailNotify ? "BẬT → " + DB.config.gmail : "TẮT"} (cấu hình trong mục Cấu hình)</p>
      <table><thead><tr><th>SV</th><th>Từ ngày</th><th>Đến</th><th>Lý do</th><th>Trạng thái</th><th></th></tr></thead>
      <tbody>${[...DB.leaves].reverse().map(l => {
        const s = studentById(l.studentId);
        return `<tr>
          <td>${s?.name} <div class="muted">${s?.mssv}</div></td>
          <td>${l.from}</td><td>${l.to}</td><td>${l.reason}</td>
          <td><span class="badge ${l.status==="Duyệt"?"ok":l.status==="Từ chối"?"bad":"warn"}">${l.status}</span></td>
          <td>${l.status==="Chờ duyệt" ? `
            <button class="btn btn-sm btn-primary" onclick="decideLeave('${l.id}','Duyệt')">Duyệt</button>
            <button class="btn btn-sm btn-danger" onclick="decideLeave('${l.id}','Từ chối')">Từ chối</button>` : ""}
          </td></tr>`;
      }).join("") || "<tr><td colspan=6>Chưa có đơn</td></tr>"}</tbody></table>
    </div>`;
}
function decideLeave(id, st) {
  const l = DB.leaves.find(x => x.id === id);
  l.status = st;
  save(DB); paint();
  toast(st === "Duyệt" ? "Đã duyệt phép" : "Đã từ chối");
}

/* ================= CONFIG ================= */
function viewConfig() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Cấu hình hệ thống</h2>${topMeta()}</div>
    <div class="card" style="max-width:560px">
      <div class="field"><label>Năm học</label><input id="cfYear" value="${DB.config.year}"></div>
      <div class="field"><label>Kỳ học</label>
        <select id="cfTerm">
          ${["Học kỳ 1","Học kỳ 2","Học kỳ hè"].map(t=>`<option ${DB.config.term===t?"selected":""}>${t}</option>`).join("")}
        </select>
      </div>
      <div class="field"><label>Tuần hiện tại</label><input type="number" id="cfWeek" value="${DB.config.week}" min="1" max="22"></div>
      <div class="field"><label>Gmail nhận thông báo đơn phép</label><input id="cfMail" value="${DB.config.gmail}"></div>
      <label style="display:flex;gap:8px;align-items:center;margin:10px 0">
        <input type="checkbox" id="cfMailOn" ${DB.config.gmailNotify?"checked":""}> Bật thông báo Gmail mỗi khi SV tạo đơn
      </label>
      <button class="btn btn-primary" onclick="saveConfig()">Lưu cấu hình</button>
      <button class="btn btn-outline" onclick="if(confirm('Xóa dữ liệu local và seed lại?')){localStorage.removeItem(KEY);location.reload()}">Reset dữ liệu demo</button>
    </div>`;
}
function saveConfig() {
  const mail = $("#cfMail").value.trim();
  if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return toast("Gmail không hợp lệ");
  DB.config.year = $("#cfYear").value.trim();
  DB.config.term = $("#cfTerm").value;
  DB.config.week = +$("#cfWeek").value || 1;
  DB.config.gmail = mail;
  DB.config.gmailNotify = $("#cfMailOn").checked;
  save(DB); paint(); toast("Đã lưu cấu hình");
}

/* ================= STUDENT VIEWS ================= */
function viewSvInfo() {
  const s = studentById(SESSION.studentId);
  $("#main").innerHTML = `
    <div class="topbar"><h2>Thông tin sinh viên</h2>${topMeta()}</div>
    <div class="grid g-2">
      <div class="card">
        <h3>${s.name}</h3>
        <p>MSSV: <b>${s.mssv}</b></p>
        <p>Lớp: ${className(s.classId)}</p>
        <p>Giới tính: ${s.gender} · Ngày sinh: ${s.dob}</p>
        <p>SĐT: ${s.phone}</p>
        <p>Tình trạng: <span class="badge ok">${s.status}</span></p>
        <p>Ban cán sự: ${s.officer}</p>
        <p>Tài khoản: ${s.username}</p>
      </div>
      <div class="card">
        <h3>Gia đình & địa chỉ</h3>
        <p>Cha: ${s.father || "—"} · ${s.fatherPhone || ""}</p>
        <p>Mẹ: ${s.mother || "—"} · ${s.motherPhone || ""}</p>
        <p>Thường trú: ${s.addrThuongTru || "—"}</p>
        <p>Cư trú: ${s.addrCuTru || "—"}</p>
      </div>
    </div>`;
}
function viewSvLeave() {
  const s = studentById(SESSION.studentId);
  const mine = DB.leaves.filter(l => l.studentId === s.id);
  const payload = JSON.stringify({ t: "leave", mssv: s.mssv, name: s.name });
  $("#main").innerHTML = `
    <div class="topbar"><h2>Nghỉ phép</h2>${topMeta()}</div>
    <div class="grid g-2">
      <div class="card">
        <h3>Tạo đơn nghỉ phép</h3>
        <div class="field"><label>Từ ngày</label><input type="date" id="lvFrom" value="${todayISO()}"></div>
        <div class="field"><label>Đến ngày</label><input type="date" id="lvTo" value="${todayISO()}"></div>
        <div class="field"><label>Lý do</label><textarea id="lvReason" rows="3"></textarea></div>
        <button class="btn btn-primary" onclick="submitLeave()">Gửi đơn</button>
        <p class="muted" style="margin-top:8px">Hoặc quét mã QR bên cạnh để điền nhanh định danh.</p>
      </div>
      <div class="card">
        <h3>Mã QR tạo đơn</h3>
        <div class="qr-box"><canvas id="qrCanvas"></canvas></div>
        <p class="muted">Nội dung QR: MSSV ${s.mssv}. GV / thiết bị quét có thể nhận diện để mở form.</p>
        <button class="btn btn-ghost" onclick="fillFromQR()">Dùng QR để mở form sẵn</button>
        <h3 style="margin-top:16px">Đơn của em</h3>
        ${mine.map(l => `<p>${l.from} → ${l.to} · ${l.reason}
          <span class="badge ${l.status==="Duyệt"?"ok":l.status==="Từ chối"?"bad":"warn"}">${l.status}</span></p>`).join("") || "<p class='empty'>Chưa có đơn</p>"}
      </div>
    </div>`;
  if (window.QRCode) {
    QRCode.toCanvas($("#qrCanvas"), payload, { width: 180, color: { dark: "#14532d", light: "#ffffff" } });
  }
}
function fillFromQR() {
  toast("Đã nhận diện QR · điền sẵn MSSV " + studentById(SESSION.studentId).mssv);
  $("#lvReason")?.focus();
}
function submitLeave() {
  const reason = $("#lvReason").value.trim();
  if (!reason) return toast("Nhập lý do nghỉ");
  const rec = {
    id: uid("lv"), studentId: SESSION.studentId,
    from: $("#lvFrom").value, to: $("#lvTo").value, reason,
    status: "Chờ duyệt", createdAt: new Date().toISOString()
  };
  DB.leaves.push(rec); save(DB);
  if (DB.config.gmailNotify) {
    toast("Đã gửi đơn · thông báo tới " + DB.config.gmail);
  } else toast("Đã gửi đơn nghỉ phép");
  paint();
}

function viewSvWeek() {
  const s = studentById(SESSION.studentId);
  const existed = DB.reports.find(r => r.studentId === s.id && r.week === DB.config.week && r.year === DB.config.year && r.term === DB.config.term);
  $("#main").innerHTML = `
    <div class="topbar"><h2>Báo cáo tuần ${DB.config.week}</h2>${topMeta()}</div>
    <div class="card" style="max-width:720px">
      ${existed ? `<p class="badge ok">Em đã nộp báo cáo tuần này</p>` : ""}
      <div class="field"><label>${QUESTION.STUDENT}</label><input value="${s.name}" disabled></div>
      <div class="field"><label>${QUESTION.WEEK}</label><input value="Tuần ${DB.config.week} · ${DB.config.term} · ${DB.config.year}" disabled></div>
      <div class="form-grid">
        <div class="field"><label>${QUESTION.ABSENT}</label><input type="number" id="qABSENT" min="0" value="${existed?.answers.ABSENT||0}"></div>
        <div class="field"><label>${QUESTION.LATE}</label><input type="number" id="qLATE" min="0" value="${existed?.answers.LATE||0}"></div>
        <div class="field span-2"><label>${QUESTION.ABSENT_SESSION}</label><input id="qABSENT_SESSION" value="${existed?.answers.ABSENT_SESSION||""}" placeholder="VD: Thứ 3 tiết 1-2"></div>
        <div class="field span-2"><label>${QUESTION.ABSENT_REASON}</label><input id="qABSENT_REASON" value="${existed?.answers.ABSENT_REASON||""}"></div>
        <div class="field"><label>${QUESTION.REPORTED}</label>
          <select id="qREPORTED"><option>Chưa</option><option>Đã báo</option></select></div>
        <div class="field"><label>${QUESTION.LEARNING}</label>
          <select id="qLEARNING"><option>Tốt</option><option>Ổn</option><option>Yếu</option><option>Rất tốt</option></select></div>
        <div class="field"><label>${QUESTION.DIFFICULTY}</label>
          <select id="qDIFFICULTY"><option>Không</option><option>Có</option></select></div>
        <div class="field span-2"><label>${QUESTION.DIFFICULTY_DETAIL}</label><input id="qDIFFICULTY_DETAIL" value="${existed?.answers.DIFFICULTY_DETAIL||""}"></div>
        <div class="field"><label>${QUESTION.SUBJECT}</label><input id="qSUBJECT" value="${existed?.answers.SUBJECT||""}"></div>
        <div class="field"><label>${QUESTION.ASSIGNMENT}</label>
          <select id="qASSIGNMENT"><option>Không</option><option>Có</option></select></div>
        <div class="field span-2"><label>${QUESTION.MOTIVATION}</label><input id="qMOTIVATION" value="${existed?.answers.MOTIVATION||""}"></div>
        <div class="field span-2"><label>${QUESTION.IMPACT}</label><input id="qIMPACT" value="${existed?.answers.IMPACT||""}"></div>
        <div class="field"><label>${QUESTION.SUPPORT}</label>
          <select id="qSUPPORT"><option>Không</option><option>Có</option></select></div>
        <div class="field"><label>${QUESTION.PRIVATE}</label>
          <select id="qPRIVATE"><option>Không</option><option>Có</option></select></div>
        <div class="field span-2"><label>${QUESTION.SUPPORT_DETAIL}</label><input id="qSUPPORT_DETAIL" value="${existed?.answers.SUPPORT_DETAIL||""}"></div>
        <div class="field span-2"><label>${QUESTION.OTHER}</label><textarea id="qOTHER" rows="3">${existed?.answers.OTHER||""}</textarea></div>
      </div>
      <button class="btn btn-primary" onclick="submitWeek()">${existed ? "Cập nhật báo cáo" : "Nộp báo cáo tuần"}</button>
    </div>`;
  if (existed) {
    ["REPORTED","LEARNING","DIFFICULTY","ASSIGNMENT","SUPPORT","PRIVATE"].forEach(k => {
      const el = document.getElementById("q" + k);
      if (el && existed.answers[k]) el.value = existed.answers[k];
    });
  }
}
function submitWeek() {
  const answers = {};
  ["ABSENT","LATE","ABSENT_SESSION","ABSENT_REASON","REPORTED","LEARNING","DIFFICULTY","DIFFICULTY_DETAIL","SUBJECT","ASSIGNMENT","MOTIVATION","IMPACT","SUPPORT","PRIVATE","SUPPORT_DETAIL","OTHER"]
    .forEach(k => answers[k] = document.getElementById("q" + k)?.value || "");
  const exist = DB.reports.find(r => r.studentId === SESSION.studentId && r.week === DB.config.week && r.year === DB.config.year && r.term === DB.config.term);
  if (exist) { exist.answers = answers; exist.updatedAt = new Date().toISOString(); }
  else DB.reports.push({
    id: uid("rp"), studentId: SESSION.studentId, week: DB.config.week,
    year: DB.config.year, term: DB.config.term, answers, createdAt: new Date().toISOString()
  });
  if ((answers.SUPPORT === "Có") || Number(answers.ABSENT) > 2) {
    const sid = SESSION.studentId;
    if (!DB.issues.some(i => i.studentId === sid && i.week === DB.config.week)) {
      DB.issues.push({
        id: uid("is"), studentId: sid,
        type: Number(answers.ABSENT) > 2 ? "Nghiêm trọng" : "Cần hỗ trợ",
        text: answers.SUPPORT_DETAIL || answers.DIFFICULTY_DETAIL || "Từ báo cáo tuần",
        week: DB.config.week, reported: true
      });
    }
  }
  save(DB); toast("Đã lưu báo cáo tuần"); paint();
}

/* modal helpers */
function showModal(html) { const o = $("#overlay"); o.classList.add("show"); $("#modal").innerHTML = html; }
function hideModal() { $("#overlay").classList.remove("show"); }

window.addEventListener("DOMContentLoaded", () => {
  $$(".role-pills button").forEach(b => b.onclick = () => {
    $$(".role-pills button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
  });
  $("#btnLogin").onclick = login;
  $("#loginPass").addEventListener("keydown", e => { if (e.key === "Enter") login(); });
});
