/* views/classes.js */
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
  const rows = scopedClasses().filter(c => (c.name + (c.note || "")).toLowerCase().includes(q));
  $("#classTable").innerHTML = `<table><thead><tr><th>Lớp</th><th>Phân hệ</th><th>GVCN</th><th>Năm học</th><th>Sĩ số</th><th>Ghi chú</th><th></th></tr></thead><tbody>
    ${rows.map(c => {
      const lv = LEVELS.find(l => l.id === c.level)?.name || c.level;
      const n = DB.students.filter(s => s.classId === c.id).length;
      return `<tr><td><b>${c.name}</b></td><td>${lv}</td><td>${teacherName(c.homeroomTeacherId)}</td><td>${c.year}</td><td>${n}</td><td>${c.note||""}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-sm btn-ghost" onclick="openClassModal('${c.id}')">Sửa</button>
          <button class="btn btn-sm btn-danger" onclick="delClass('${c.id}')">Xóa</button>
        </td></tr>`;
    }).join("")}</tbody></table>`;
}
function openClassModal(id) {
  const found = id ? DB.classes.find(c => c.id === id) : null;
  if (id && found && !canAccessClass(found.id) && SESSION.role !== "ad") return toast("Không có quyền với lớp này");
  editTarget = found;
  const c = editTarget || { name: "", level: "daihoc", year: DB.config.year, note: "", homeroomTeacherId: SESSION.role === "gv" ? currentTeacherId() : null };
  const gvOpts = `<option value="">Chưa phân công</option>${(DB.teachers || []).filter(t => t.active !== false).map(t => `<option value="${t.id}" ${c.homeroomTeacherId===t.id?"selected":""}>${t.name}</option>`).join("")}`;
  showModal(`<h3>${id ? "Sửa" : "Thêm"} lớp chủ nhiệm</h3>
    <div class="form-grid">
      <div class="field"><label>Tên lớp</label><input id="fName" value="${c.name}"></div>
      <div class="field"><label>Phân hệ</label>
        <select id="fLevel">${LEVELS.map(l => `<option value="${l.id}" ${c.level===l.id?"selected":""}>${l.name}</option>`).join("")}</select>
      </div>
      <div class="field"><label>Năm học</label><input id="fYear" value="${c.year}"></div>
      <div class="field"><label>Giáo viên chủ nhiệm</label>
        ${SESSION.role === "ad"
          ? `<select id="fHomeroom">${gvOpts}</select>`
          : `<input value="${teacherName(c.homeroomTeacherId)}" disabled><input type="hidden" id="fHomeroom" value="${c.homeroomTeacherId || ""}">`}
      </div>
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
  if (SESSION.role === "ad") rec.homeroomTeacherId = $("#fHomeroom")?.value || null;
  else rec.homeroomTeacherId = editTarget?.homeroomTeacherId || currentTeacherId() || null;
  if (!rec.homeroomTeacherId) rec.homeroomTeacherId = null;
  if (editTarget) {
    if (SESSION.role === "gv" && !canAccessClass(editTarget.id)) return toast("Không có quyền với lớp này");
    Object.assign(editTarget, rec);
  } else {
    DB.classes.push({ id: uid("c"), ...rec });
  }
  save(DB); hideModal(); paint(); toast("Đã lưu lớp");
}
function delClass(id) {
  if (!canAccessClass(id) && SESSION.role !== "ad") return toast("Không có quyền với lớp này");
  if (!confirm("Xóa lớp này?")) return;
  const c = DB.classes.find(x => x.id === id);
  audit("delete_class", "class", id, c ? c.name : id);
  DB.classes = DB.classes.filter(x => x.id !== id);
  save(DB); paint(); toast("Đã xóa lớp");
}


/* ================= HOMEROOM ================= */
function viewHomeroom() {
  if (!CLS_LEVEL) {
    $("#main").innerHTML = `
      <div class="topbar"><h2>Lớp theo phân hệ</h2>${topMeta()}</div>
      <p class="muted" style="margin-bottom:12px">Chọn phân hệ, sau đó chọn lớp để xem danh sách và bổ nhiệm ban cán sự.</p>
      <div class="level-cards">
        ${LEVELS.map(l => {
          const n = scopedClasses().filter(c => c.level === l.id).length;
          return `<div class="level-card" onclick="CLS_LEVEL='${l.id}';paint()">
            <div class="muted">${l.mark}</div><h4 style="margin:6px 0">${l.name}</h4>
            <p class="muted">${n} lớp chủ nhiệm</p></div>`;
        }).join("")}
      </div>`;
    return;
  }
  if (!CLS_ID) {
    const list = scopedClasses().filter(c => c.level === CLS_LEVEL);
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
  if (!canAccessClass(CLS_ID) && SESSION.role !== "ad") { CLS_ID = null; paint(); return; }
  const c = DB.classes.find(x => x.id === CLS_ID);
  const list = scopedStudents().filter(s => s.classId === CLS_ID);
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
  if (!canAccessStudent(id) && SESSION.role !== "ad") return toast("Không có quyền với sinh viên này");
  studentById(id).officer = v; save(DB); toast("Đã bổ nhiệm " + v);
}

