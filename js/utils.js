/* utils.js — hằng số và hàm thuần */
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
const ISSUE_STATUS = [
  { id: "Pending", name: "Chờ xử lý" },
  { id: "In Progress", name: "Đang xử lý" },
  { id: "Resolved", name: "Đã xử lý" }
];
function issueStatusName(id) {
  return ISSUE_STATUS.find(s => s.id === id)?.name || id || "Chờ xử lý";
}
function issueStatusBadge(id) {
  const cls = id === "Resolved" ? "ok" : id === "In Progress" ? "warn" : "bad";
  return `<span class="badge ${cls}">${issueStatusName(id)}</span>`;
}

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

const TERMS = ["Học kỳ 1", "Học kỳ 2", "Học kỳ hè"];
const WEEKS_PER_TERM = 22;

function toISODate(d) {
  const z = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
function parseISODate(iso) {
  const [y, m, d] = String(iso || "").slice(0, 10).split("-").map(Number);
  return new Date(y || 2025, (m || 1) - 1, d || 1);
}
function addDaysISO(iso, days) {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}
function inferYearStart(yearStr) {
  const y = parseInt(String(yearStr || "").slice(0, 4), 10);
  return `${y && !Number.isNaN(y) ? y : 2025}-09-01`;
}
function academicYear() { return DB.config.year || "2025-2026"; }
function academicTerm() { return DB.config.term || "Học kỳ 1"; }
function academicWeek() { return Math.min(WEEKS_PER_TERM, Math.max(1, +DB.config.week || 1)); }
function academicContext() {
  return { year: academicYear(), term: academicTerm(), week: academicWeek() };
}
function termWeekOffset(term) {
  if (term === "Học kỳ 2") return WEEKS_PER_TERM;
  if (term === "Học kỳ hè") return WEEKS_PER_TERM * 2;
  return 0;
}
function academicWeekBounds(year, term, week) {
  const y = year || academicYear();
  const t = term || academicTerm();
  const w = Math.min(WEEKS_PER_TERM, Math.max(1, +week || academicWeek()));
  const start = DB.config.yearStart || inferYearStart(y);
  const from = addDaysISO(start, (termWeekOffset(t) + (w - 1)) * 7);
  const to = addDaysISO(from, 6);
  return { from, to, year: y, term: t, week: w, label: `Tuần ${w} · ${t} · ${y}` };
}
function academicTermBounds(year, term) {
  const a = academicWeekBounds(year, term, 1);
  const b = academicWeekBounds(year, term, WEEKS_PER_TERM);
  return { from: a.from, to: b.to, year: a.year, term: a.term, label: `${a.term} · ${a.year}` };
}
function academicYearBounds(year) {
  const y = year || academicYear();
  const a = academicWeekBounds(y, "Học kỳ 1", 1);
  const b = academicWeekBounds(y, "Học kỳ hè", WEEKS_PER_TERM);
  return { from: a.from, to: b.to, year: y, label: `Năm học ${y}` };
}
function selectedAcademicWeek() {
  return Math.min(WEEKS_PER_TERM, Math.max(1, +(
    $("#repWeek")?.value || $("#wrWeek")?.value || $("#lvWeek")?.value ||
    WR_FILTER.week || LV_FILTER.week || academicWeek()
  )));
}
function defaultAcademicDate() {
  const { from, to } = academicWeekBounds(academicYear(), academicTerm(), academicWeek());
  const today = todayISO();
  if (today >= from && today <= to) return today;
  return from;
}

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

function toast(msg, kind) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.className = "toast show" + (kind === "ok" ? " toast-ok" : kind === "bad" ? " toast-bad" : "");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}
function emptyBox(title, hint) {
  return `<div class="empty-box"><div class="ico">–</div><p>${title}</p>${hint ? `<p class="muted">${hint}</p>` : ""}</div>`;
}
function enhanceTables() {
  $$("#main table").forEach(tb => {
    const headers = [...tb.querySelectorAll("thead th")].map(th => th.textContent.trim());
    tb.querySelectorAll("tbody tr").forEach(tr => {
      [...tr.children].forEach((td, i) => {
        if (!td.getAttribute("data-label") && headers[i]) td.setAttribute("data-label", headers[i] || " ");
      });
    });
  });
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

function inRange(iso, from, to) {
  if (!iso) return false;
  const d = iso.slice(0, 10);
  return d >= from && d <= to;
}
function periodBounds(mode) {
  const ctx = academicContext();
  const cur = academicWeekBounds(ctx.year, ctx.term, ctx.week);
  if (mode === "day") {
    const pick = $("#repDay")?.value || defaultAcademicDate();
    return { from: pick, to: pick, year: ctx.year, term: ctx.term, week: ctx.week, label: "Ngày " + fmtDate(pick) };
  }
  if (mode === "week") {
    return academicWeekBounds(ctx.year, ctx.term, selectedAcademicWeek());
  }
  if (mode === "month") {
    const val = $("#repMonth")?.value || cur.from.slice(0, 7);
    const [yy, mm] = val.split("-").map(Number);
    const from = `${yy}-${String(mm).padStart(2, "0")}-01`;
    const last = new Date(yy, mm, 0).getDate();
    return { from, to: `${yy}-${String(mm).padStart(2, "0")}-${String(last).padStart(2, "0")}`, year: ctx.year, term: ctx.term, label: "Tháng " + mm + "/" + yy };
  }
  if (mode === "quarter") {
    const qm = parseISODate(cur.from).getMonth();
    const q = +($("#repQuarter")?.value || Math.floor(qm / 3) + 1);
    const startM = (q - 1) * 3;
    const yStart = parseInt(cur.from.slice(0, 4), 10);
    const from = `${yStart}-${String(startM + 1).padStart(2, "0")}-01`;
    const last = new Date(yStart, startM + 3, 0).getDate();
    const to = `${yStart}-${String(startM + 3).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
    return { from, to, year: ctx.year, term: ctx.term, label: "Quý " + q + " · " + ctx.year };
  }
  if (mode === "term") return academicTermBounds(ctx.year, ctx.term);
  return academicYearBounds($("#repYear")?.value || ctx.year);
}

function showModal(html) {
  $("#overlay").classList.add("show");
  $("#modal").innerHTML = html;
  $("#modal").scrollTop = 0;
}
function hideModal() { $("#overlay").classList.remove("show"); $("#modal").innerHTML = ""; }
