/* views/leaves.js */
/* ================= LEAVE GV ================= */
function viewLeave() {
  const p = periodBounds(LV_FILTER.period);
  let list = DB.leaves.filter(l => (inRange(l.from, p.from, p.to) || inRange(l.createdAt, p.from, p.to)) && canAccessStudent(l.studentId));
  if (LV_FILTER.pending) list = list.filter(l => l.status === "Chờ duyệt");
  if (LV_FILTER.classId) list = list.filter(l => studentById(l.studentId)?.classId === LV_FILTER.classId);
  if (LV_FILTER.studentId) list = list.filter(l => l.studentId === LV_FILTER.studentId);
  const svs = scopedStudents().filter(s => !LV_FILTER.classId || s.classId === LV_FILTER.classId);
  const countBySv = {};
  list.forEach(l => { countBySv[l.studentId] = (countBySv[l.studentId] || 0) + 1; });
  $("#main").innerHTML = `
    <div class="topbar"><h2>Nghỉ phép</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <select id="lvPeriod" onchange="LV_FILTER.period=this.value;paint()">
          ${[["day","Theo ngày"],["week","Theo tuần"],["month","Theo tháng"],["quarter","Theo quý"],["year","Theo năm"]].map(([id,lb])=>`<option value="${id}" ${LV_FILTER.period===id?"selected":""}>${lb}</option>`).join("")}
        </select>
        ${LV_FILTER.period==="day"?`<input type="date" id="repDay" value="${defaultAcademicDate()}" onchange="paint()">`:""}
        ${LV_FILTER.period==="week"?`<label class="muted">Tuần</label><input type="number" id="lvWeek" min="1" max="${WEEKS_PER_TERM}" value="${LV_FILTER.week||academicWeek()}" onchange="LV_FILTER.week=+this.value;paint()">`:""}
        <select id="lvClass" onchange="LV_FILTER.classId=this.value;LV_FILTER.studentId='';paint()">
          <option value="">Tất cả lớp</option>
          ${scopedClasses().map(c=>`<option value="${c.id}" ${LV_FILTER.classId===c.id?"selected":""}>${c.name}</option>`).join("")}
        </select>
        <select id="lvSv" onchange="LV_FILTER.studentId=this.value;paint()">
          <option value="">Tất cả sinh viên</option>
          ${svs.map(s=>`<option value="${s.id}" ${LV_FILTER.studentId===s.id?"selected":""}>${s.name}</option>`).join("")}
        </select>
        <label style="display:flex;gap:6px;align-items:center;font-size:13px">
          <input type="checkbox" ${LV_FILTER.pending?"checked":""} onchange="LV_FILTER.pending=this.checked;paint()"> Chưa duyệt
        </label>
        <button class="btn btn-ghost" onclick="LV_FILTER={period:'week',pending:false,classId:'',studentId:'',week:null};paint()">Làm mới</button>
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
  if (!l || (!canAccessStudent(l.studentId) && SESSION.role !== "ad")) return toast("Không có quyền duyệt đơn này");
  l.status = st;
  const sv = studentById(l.studentId);
  audit(st === "Duyệt" ? "approve_leave" : "reject_leave", "leave", l.id,
    (sv ? sv.name + " · " : "") + fmtDate(l.from) + " → " + fmtDate(l.to));
  save(DB); paint();
  toast(st === "Duyệt" ? "Đã duyệt phép" : "Đã từ chối");
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

