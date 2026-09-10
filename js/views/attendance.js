/* views/attendance.js */
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
  DB.assigns.filter(a => a.year === academicYear() && a.term === academicTerm()).forEach(a => {
    (a.classIds || []).forEach(cid => {
      if (canAttendClass(cid, a.subjectId)) out.push({ assignId: a.id, subjectId: a.subjectId, classId: cid });
    });
  });
  return out;
}
function attendSlotsOn(date) {
  const day = weekdayOf(date);
  return (DB.schedule || []).filter(s => s.day === day && canAttendClass(s.classId, s.subjectId));
}

/* ================= ATTEND ================= */
function viewAttend() {
  const date = $("#atDate")?.value || defaultAcademicDate();
  const slots = attendSlotsOn(date);
  const hist = [...DB.attendance].filter(canViewAttendance).reverse().slice(0, 30);
  $("#main").innerHTML = `
    <div class="topbar"><h2>Điểm danh</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <input type="date" id="atDate" value="${date}" onchange="viewAttend()">
        <select id="atSlot" onchange="renderAttendSheet()">${slots.map(s =>
          `<option value="${s.id}">${s.day} ${s.start}–${s.end} · ${subjectName(s.subjectId)} · ${className(s.classId)}</option>`
        ).join("")}</select>
      </div>
      <div id="atSheet"></div>
      <h3 style="margin-top:16px">Lịch sử điểm danh</h3>
      <div class="table-wrap"><table><thead><tr><th>Ngày</th><th>Tiết</th><th>Môn</th><th>SV</th><th>Trạng thái</th><th>Ghi chú</th></tr></thead>
      <tbody>${hist.map(a => {
        const sch = DB.schedule.find(s => s.id === a.scheduleId);
        return `<tr>
        <td>${fmtDate(a.date)}</td>
        <td>${sch ? `${sch.day} ${sch.start}–${sch.end}` : "—"}</td>
        <td>${subjectName(a.subjectId)}</td>
        <td>${studentById(a.studentId)?.name||""}</td>
        <td><span class="badge ${a.status==="Có mặt"?"ok":a.status==="Trễ"?"warn":"bad"}">${a.status}</span></td>
        <td data-label="Ghi chú">${a.note||""}</td></tr>`;
      }).join("")}</tbody></table></div>
    </div>`;
  if (slots.length) renderAttendSheet();
  else $("#atSheet").innerHTML = `<div class="empty-box"><div class="ico">–</div><p>Không có tiết học bạn được điểm danh trong ngày ${weekdayOf(date)}</p></div>`;
}
function renderAttendSheet() {
  const date = $("#atDate")?.value || defaultAcademicDate();
  const scheduleId = $("#atSlot")?.value;
  const sch = DB.schedule.find(s => s.id === scheduleId);
  if (!sch) return;
  if (!canAttendClass(sch.classId, sch.subjectId)) {
    $("#atSheet").innerHTML = `<div class="empty-box"><div class="ico">–</div><p>Không có quyền điểm danh tiết này</p></div>`;
    return;
  }
  const list = DB.students.filter(s => s.classId === sch.classId);
  const role = attendRoleLabel(sch.classId, sch.subjectId);
  $("#atSheet").innerHTML = `
    <p class="muted" style="margin-bottom:10px">${fmtDate(date)} · ${sch.day} ${sch.start}–${sch.end} · ${subjectName(sch.subjectId)} · ${className(sch.classId)} · <span class="pill">${role}</span></p>
    ${list.length ? list.map(s => {
      const ex = DB.attendance.find(a => a.studentId===s.id && a.scheduleId===sch.id && a.date===date)
        || DB.attendance.find(a => a.studentId===s.id && a.subjectId===sch.subjectId && a.date===date && !a.scheduleId);
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
    <button class="btn btn-primary" style="margin-top:10px" onclick="saveAttend('${sch.id}','${date}')">Lưu điểm danh</button>`;
}
function setAtt(id, status, btn) {
  const hid = document.getElementById("st_" + id);
  if (hid) hid.value = status;
  const wrap = btn.parentElement;
  wrap.querySelectorAll("button").forEach(b => b.className = "");
  btn.className = status==="Có mặt"?"on-ok":status==="Trễ"?"on-warn":"on-bad";
}
function saveAttend(scheduleId, date) {
  const sch = DB.schedule.find(s => s.id === scheduleId);
  if (!sch) return toast("Không tìm thấy tiết học");
  if (!canAttendClass(sch.classId, sch.subjectId)) return toast("Không có quyền điểm danh tiết này");
  const list = DB.students.filter(s => s.classId === sch.classId);
  const ctx = academicContext();
  list.forEach(s => {
    const status = document.getElementById("st_" + s.id)?.value || "Có mặt";
    const note = document.getElementById("nt_" + s.id)?.value || "";
    const ex = DB.attendance.find(a => a.studentId===s.id && a.scheduleId===sch.id && a.date===date)
      || DB.attendance.find(a => a.studentId===s.id && a.subjectId===sch.subjectId && a.date===date && !a.scheduleId);
    if (ex) {
      ex.status = status; ex.note = note;
      ex.scheduleId = sch.id; ex.subjectId = sch.subjectId;
    } else {
      DB.attendance.push({
        id: uid("at"), studentId: s.id, subjectId: sch.subjectId, scheduleId: sch.id,
        date, status, note, year: ctx.year, term: ctx.term, week: ctx.week
      });
    }
  });
  save(DB); paint(); toast("Đã lưu điểm danh tiết " + subjectName(sch.subjectId));
}

