/* views/reports.js */
function viewReport() {
  const cur = academicWeekBounds(academicYear(), academicTerm(), academicWeek());
  const monthVal = cur.from.slice(0, 7);
  const qNow = Math.floor(parseISODate(cur.from).getMonth() / 3) + 1;
  $("#main").innerHTML = `
    <div class="topbar"><h2>Báo cáo lớp</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <select id="repMode" onchange="REP_MODE=this.value;paint()">
          ${[["day","Theo ngày"],["week","Theo tuần"],["month","Theo tháng"],["quarter","Theo quý"],["year","Theo năm học"]].map(([id,lb]) =>
            `<option value="${id}" ${REP_MODE===id?"selected":""}>${lb}</option>`).join("")}
        </select>
        ${REP_MODE==="day" ? `<input type="date" id="repDay" value="${defaultAcademicDate()}" onchange="paintReportBody()">` : ""}
        ${REP_MODE==="week" ? `<label class="muted">Tuần</label><input type="number" id="repWeek" min="1" max="${WEEKS_PER_TERM}" value="${academicWeek()}" onchange="paintReportBody()">` : ""}
        ${REP_MODE==="month" ? `<input type="month" id="repMonth" value="${monthVal}" onchange="paintReportBody()">` : ""}
        ${REP_MODE==="quarter" ? `<select id="repQuarter" onchange="paintReportBody()">${[1,2,3,4].map(q=>`<option ${q===qNow?"selected":""} value="${q}">Quý ${q}</option>`).join("")}</select>` : ""}
        ${REP_MODE==="year" ? `<input id="repYear" value="${academicYear()}" onchange="paintReportBody()">` : ""}
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
  const att = DB.attendance.filter(a => inRange(a.date, p.from, p.to) && canAccessStudent(a.studentId));
  const leaves = DB.leaves.filter(l => (inRange(l.from, p.from, p.to) || inRange(l.createdAt, p.from, p.to)) && canAccessStudent(l.studentId));
  const reports = (REP_MODE === "week"
    ? DB.reports.filter(r => r.week === p.week && r.year === p.year && r.term === p.term)
    : DB.reports.filter(r => inRange(r.createdAt, p.from, p.to))
  ).filter(r => canAccessStudent(r.studentId));
  const issues = DB.issues.filter(i => (
    inRange(i.date, p.from, p.to) || (REP_MODE === "week" && i.week === p.week)
  ) && canAccessStudent(i.studentId));
  return { p, att, leaves, reports, issues };
}

function paintReportBody() {
  const { p, att, leaves, reports, issues } = collectPeriod();
  const late = att.filter(a => a.status === "Trễ");
  const abs = att.filter(a => a.status === "Vắng");
  const support = reports.filter(r => (r.answers.SUPPORT || "").toLowerCase() === "có");
  const care = scopedStudents().filter(s => s.status === "Cần quan tâm");
  const watch = scopedStudents().filter(s => s.status === "Cần theo dõi");
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
          ${scopedStudents().map(s => {
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
        <p style="font-size:22px;font-weight:700;color:var(--green-2)">${reports.length}<span class="muted" style="font-size:14px"> / ${scopedStudents().length}</span></p>
        <div class="leave-list" style="margin-top:8px">
          ${scopedStudents().map(s => {
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
  const rows = scopedStudents().map(s => ([
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
  const body = scopedStudents().map(s => [
    s.mssv, s.name, className(s.classId), s.status,
    String(att.filter(a => a.studentId===s.id && a.status==="Vắng").length),
    String(att.filter(a => a.studentId===s.id && a.status==="Trễ").length),
    String(leaves.filter(l => l.studentId===s.id).length),
    reports.some(r => r.studentId===s.id) ? "Da nop" : "Chua nop"
  ]);
  doc.autoTable({ startY: 52, head: [["MSSV","Ho va ten","Lop","Tinh trang","Vang","Tre","Don phep","Bao cao tuan"]], body, styles: { fontSize: 8 } });
  doc.save(`bao_cao_${REP_MODE}.pdf`);
}


function viewWeekReports() {
  const p = periodBounds(WR_FILTER.period);
  let list = DB.reports.filter(r => r.year === DB.config.year && r.term === DB.config.term && canAccessStudent(r.studentId));
  if (WR_FILTER.period === "week") list = list.filter(r => r.week === selectedAcademicWeek());
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
          ${scopedClasses().map(c=>`<option value="${c.id}" ${WR_FILTER.classId===c.id?"selected":""}>${c.name}</option>`).join("")}
        </select>
        <input class="search" placeholder="Tìm tên sinh viên" value="${WR_FILTER.q||""}" oninput="WR_FILTER.q=this.value;paint()">
        <select onchange="WR_FILTER.period=this.value;paint()">
          ${[["week","Theo tuần"],["day","Theo ngày"],["month","Theo tháng"],["quarter","Theo quý"],["year","Theo năm"]].map(([id,lb])=>`<option value="${id}" ${WR_FILTER.period===id?"selected":""}>${lb}</option>`).join("")}
        </select>
        ${WR_FILTER.period==="week"?`<input type="number" id="wrWeek" min="1" max="${WEEKS_PER_TERM}" value="${WR_FILTER.week||academicWeek()}" onchange="WR_FILTER.week=+this.value;paint()">`:""}
        ${WR_FILTER.period==="day"?`<input type="date" id="repDay" value="${defaultAcademicDate()}" onchange="paint()">`:""}
        ${WR_FILTER.period==="month"?`<input type="month" id="repMonth" onchange="paint()">`:""}
      </div>
      <div class="assign-list">
        ${list.length ? list.map(r => {
          const s = studentById(r.studentId);
          const iss = DB.issues.find(i => i.reportId === r.id || (i.studentId===r.studentId && i.week===r.week && i.year===r.year && i.term===r.term && i.source==="weekly_report"));
          return `<div class="assign-card">
            <div class="head">
              <div>
                <b>${s?.name||""}</b>
                <div class="muted">${s?.mssv} · ${className(s?.classId)} · Tuần ${r.week} · ${fmtDate(r.createdAt)}</div>
                <div class="muted">Nghỉ ${r.answers?.ABSENT||0} · Trễ ${r.answers?.LATE||0} · Hỗ trợ: ${r.answers?.SUPPORT||"—"}</div>
                ${iss ? `<div class="muted" style="margin-top:4px">${iss.type} · ${issueStatusName(iss.status)} · ${iss.text}</div>` : ""}
              </div>
              <button class="btn btn-sm btn-outline" onclick="resetWeekReport('${r.id}')">Reset để nhập lại</button>
            </div>
            ${iss ? `<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${ISSUE_STATUS.map(st => `<button class="btn btn-sm ${iss.status===st.id?"btn-primary":"btn-outline"}" onclick="setIssueStatus('${iss.id}','${st.id}')">${st.name}</button>`).join("")}</div>` : ""}
          </div>`;
        }).join("") : "<p class='empty'>Không có báo cáo phù hợp</p>"}
      </div>
    </div>`;
}
function resetWeekReport(id) {
  const r = DB.reports.find(x => x.id === id);
  if (!r || (!canAccessStudent(r.studentId) && SESSION.role !== "ad")) return toast("Không có quyền reset báo cáo này");
  if (!confirm("Xóa báo cáo tuần này để sinh viên nhập lại?")) return;
  const sv = studentById(r.studentId);
  audit("reset_week_report", "report", id, (sv ? sv.name + " · " : "") + "Tuần " + r.week + " · " + (r.year || ""));
  DB.reports = DB.reports.filter(x => x.id !== id);
  save(DB); paint(); toast("Đã reset báo cáo tuần");
}


function stashWeek() {
  $$("#main [id^='q']").forEach(el => { WEEK_DRAFT[el.id] = el.value; });
}
function detectIssuesFromReport(report) {
  const a = report.answers || {};
  const yes = v => String(v || "").trim().toLowerCase() === "có";
  const reasons = [];
  let type = "Cần hỗ trợ";
  const absent = Number(a.ABSENT) || 0;
  const late = Number(a.LATE) || 0;
  if (absent > 2) { reasons.push("Nghỉ " + absent + " buổi" + (a.ABSENT_REASON ? " (" + a.ABSENT_REASON + ")" : "")); type = "Nghiêm trọng"; }
  if (late > 2) reasons.push("Đi trễ " + late + " buổi");
  if (yes(a.SUPPORT)) reasons.push("Cần GVCN hỗ trợ" + (a.SUPPORT_DETAIL ? ": " + a.SUPPORT_DETAIL : ""));
  if (yes(a.DIFFICULTY) || a.LEARNING === "Yếu") reasons.push("Khó khăn học tập" + (a.DIFFICULTY_DETAIL || a.SUBJECT ? ": " + (a.DIFFICULTY_DETAIL || a.SUBJECT) : ""));
  if (yes(a.PRIVATE)) reasons.push("Muốn trao đổi riêng với GVCN");
  if (yes(a.ASSIGNMENT)) reasons.push("Còn bài tập / nhiệm vụ chưa hoàn thành");
  if (!reasons.length) return null;
  return { type, text: reasons.join("; "), source: "weekly_report", reportId: report.id };
}
function applyIssuesFromReport(report) {
  const found = detectIssuesFromReport(report);
  if (!found) return false;
  const open = DB.issues.find(i =>
    i.studentId === report.studentId &&
    i.week === report.week && i.year === report.year && i.term === report.term &&
    i.source === "weekly_report" && i.status !== "Resolved"
  );
  if (open) {
    open.type = found.type;
    open.text = found.text;
    open.reportId = report.id;
    open.updatedAt = new Date().toISOString();
    return false;
  }
  DB.issues.push({
    id: uid("is"),
    studentId: report.studentId,
    type: found.type,
    text: found.text,
    week: report.week, year: report.year, term: report.term,
    source: "weekly_report",
    reportId: report.id,
    status: "Pending",
    reported: true,
    date: defaultAcademicDate(),
    updatedAt: new Date().toISOString()
  });
  return true;
}
function setIssueStatus(id, status) {
  const i = DB.issues.find(x => x.id === id);
  if (!i) return toast("Không tìm thấy vấn đề");
  if (!canAccessStudent(i.studentId) && SESSION.role !== "ad") return toast("Không có quyền cập nhật vấn đề này");
  if (!ISSUE_STATUS.some(s => s.id === status)) return;
  i.status = status;
  i.updatedAt = new Date().toISOString();
  if (status === "Resolved") i.reported = true;
  save(DB); paint();
  toast(status === "Resolved" ? "Đã đóng vấn đề" : "Đã cập nhật: " + issueStatusName(status));
}
function submitWeek() {
  const answers = {};
  ["ABSENT","LATE","ABSENT_SESSION","ABSENT_REASON","REPORTED","LEARNING","DIFFICULTY","DIFFICULTY_DETAIL","SUBJECT","ASSIGNMENT","MOTIVATION","IMPACT","SUPPORT","PRIVATE","SUPPORT_DETAIL","OTHER"]
    .forEach(k => answers[k] = document.getElementById("q" + k)?.value || "");
  const ctx = academicContext();
  const exist = DB.reports.find(r => r.studentId === SESSION.studentId && r.week === ctx.week && r.year === ctx.year && r.term === ctx.term);
  if (exist) { toast("Tuần này em đã nộp báo cáo. Mỗi tuần chỉ gửi một lần."); return; }
  const report = {
    id: uid("rp"), studentId: SESSION.studentId, week: ctx.week,
    year: ctx.year, term: ctx.term, answers, createdAt: new Date().toISOString()
  };
  DB.reports.push(report);
  applyIssuesFromReport(report);
  WEEK_DRAFT = {}; WEEK_STEP = 1;
  save(DB); toast("Đã lưu báo cáo tuần"); paint();
}
