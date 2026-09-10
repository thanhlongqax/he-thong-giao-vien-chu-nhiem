/* views/dashboard.js */
function viewDash() {
  const svs = scopedStudents();
  const svIds = new Set(svs.map(s => s.id));
  const ctx = academicContext();
  const wk = academicWeekBounds(ctx.year, ctx.term, ctx.week);
  const weekAtt = DB.attendance.filter(a => svIds.has(a.studentId) && inRange(a.date, wk.from, wk.to));
  const absentMap = {};
  const lateMap = {};
  weekAtt.forEach(a => {
    if (a.status === "Vắng") absentMap[a.studentId] = (absentMap[a.studentId] || 0) + 1;
    if (a.status === "Trễ") lateMap[a.studentId] = (lateMap[a.studentId] || 0) + 1;
  });
  const absentList = Object.keys(absentMap).map(id => ({ s: studentById(id), n: absentMap[id] })).filter(x => x.s);
  const lateList = Object.keys(lateMap).map(id => ({ s: studentById(id), n: lateMap[id] })).filter(x => x.s);
  const pendLeaves = DB.leaves.filter(l => l.status === "Chờ duyệt" && svIds.has(l.studentId));
  const careSv = svs.filter(s => s.status === "Cần quan tâm" || s.status === "Cần theo dõi");
  const todayTasks = DB.tasks.filter(t => t.type === "Hôm nay" || t.date === todayISO());
  const todo = todayTasks.filter(t => !t.done);
  const missingRep = svs.filter(s => !DB.reports.some(r => r.studentId===s.id && r.week===ctx.week && r.year===ctx.year && r.term===ctx.term));
  const dashIssues = DB.issues.filter(i => svIds.has(i.studentId) && i.status !== "Resolved");
  const person = (s, extra) => `<div class="dash-person"><b>${s.name}</b><span class="muted">${s.mssv} · ${className(s.classId)}${extra ? " · " + extra : ""}</span></div>`;
  $("#main").innerHTML = `
    <div class="topbar"><div><h2>Tổng quan lớp chủ nhiệm</h2><p class="muted">${SESSION.name} · Tuần ${ctx.week} · ${ctx.term}</p></div>${topMeta()}</div>
    <div class="grid g-4">
      <div class="stat"><div class="k">Sĩ số</div><div class="v">${svs.length}</div></div>
      <div class="stat"><div class="k">Nghỉ tuần này</div><div class="v">${absentList.length}</div></div>
      <div class="stat"><div class="k">Cần quan tâm</div><div class="v">${careSv.length + dashIssues.length}</div></div>
      <div class="stat"><div class="k">Việc chưa xong</div><div class="v">${todo.length + pendLeaves.length}</div></div>
    </div>
    <div class="grid g-3 dash-q" style="margin-top:14px">
      <div class="card">
        <h3>Ai nghỉ / đi trễ tuần này?</h3>
        ${absentList.length || lateList.length ? `
          ${absentList.map(x => person(x.s, "Vắng " + x.n + " buổi")).join("")}
          ${lateList.map(x => person(x.s, "Trễ " + x.n + " buổi")).join("")}
          <button class="btn btn-sm btn-outline" style="margin-top:10px" onclick="VIEW='attend';paint()">Điểm danh</button>
        ` : emptyBox("Không có vắng / trễ", "Trong tuần học " + ctx.week)}
      </div>
      <div class="card">
        <h3>Ai cần quan tâm?</h3>
        ${careSv.length || dashIssues.length ? `
          ${careSv.map(s => person(s, s.status)).join("")}
          ${dashIssues.map(i => {
            const s = studentById(i.studentId);
            return s ? `<div class="dash-person">
              <b>${s.name}</b> ${issueStatusBadge(i.status)}
              <span class="muted">${i.type} · ${i.text}</span>
              <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
                ${ISSUE_STATUS.map(st => `<button class="btn btn-sm ${i.status===st.id?"btn-primary":"btn-outline"}" onclick="setIssueStatus('${i.id}','${st.id}')">${st.name}</button>`).join("")}
              </div>
            </div>` : "";
          }).join("")}
        ` : emptyBox("Không có học sinh cần theo dõi", "Tình trạng lớp và issue đã đóng")}
      </div>
      <div class="card task-todo">
        <h3>Việc chưa làm?</h3>
        ${todo.length ? todo.map(t => `
          <label class="dash-person" style="display:flex;gap:8px;align-items:center">
            <input type="checkbox" onchange="toggleTask('${t.id}')"> <span>${t.title}${t.time ? " · " + t.time : ""}</span>
          </label>`).join("") : ""}
        ${pendLeaves.length ? `<div class="action-row" onclick="VIEW='leave';paint()"><div><b>Đơn phép chờ</b><div class="muted">${pendLeaves.length} đơn</div></div><span class="badge warn">${pendLeaves.length}</span></div>` : ""}
        ${missingRep.length ? `<div class="action-row" onclick="VIEW='weekReports';paint()"><div><b>Chưa nộp báo cáo tuần ${ctx.week}</b><div class="muted">${missingRep.length} sinh viên</div></div><span class="badge warn">${missingRep.length}</span></div>` : ""}
        ${!todo.length && !pendLeaves.length && !missingRep.length ? emptyBox("Không còn việc tồn", "Phép, báo cáo tuần và việc hôm nay đã xong") : ""}
      </div>
    </div>`;
}
function toggleTask(id) {
  const t = DB.tasks.find(x => x.id === id);
  if (t) { t.done = !t.done; save(DB); paint(); }
}
