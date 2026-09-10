/************************************************************
 * HỆ THỐNG QUẢN LÝ LỚP HỌC / GVCN — điểm vào SPA
 * Tải module tuần tự (không type=module) để onclick toàn cục vẫn chạy.
 ************************************************************/
let SESSION = null;
let VIEW = "dash";
let CLS_LEVEL = null;
let CLS_ID = null;
let editTarget = null;
let REP_MODE = "week";
let CAL_CURSOR = new Date();
let LV_FILTER = { period: "week", pending: false, classId: "", studentId: "", week: null };
let TASK_FILTER = "today";
let TASK_DATE = "";
let WR_FILTER = { classId: "", q: "", period: "week", week: null };
let IMP = { step: 1, fileName: "", raw: [], ready: [], issues: [] };
let WEEK_STEP = 1;
let WEEK_DRAFT = {};

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
    ["Quản trị", [["teachers","Giáo viên"],["faculties","Khoa"],["classes","Lớp / GVCN"],["config","Cấu hình"],["audit","Nhật ký"],["pw","Đổi mật khẩu"]]]
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
    svinfo: viewSvInfo, svleave: viewSvLeave, svweek: viewSvWeek, audit: viewAudit
  };
  (map[VIEW] || viewDash)();
  enhanceTables();
}

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
