/* views/admin.js */
/* ================= CONFIG + Gmail ================= */
function viewConfig() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Cấu hình hệ thống</h2>${topMeta()}</div>
    <div class="grid g-2">
      <div class="card">
        <h3>Năm học — kỳ — tuần</h3>
        <div class="field"><label>Năm học</label><input id="cfYear" value="${DB.config.year}"></div>
        <div class="field"><label>Kỳ học</label>
          <select id="cfTerm">${TERMS.map(t=>`<option ${DB.config.term===t?"selected":""}>${t}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Tuần hiện tại</label><input type="number" id="cfWeek" value="${academicWeek()}" min="1" max="${WEEKS_PER_TERM}"></div>
        <div class="field"><label>Ngày bắt đầu tuần 1 — Học kỳ 1</label><input type="date" id="cfYearStart" value="${DB.config.yearStart || inferYearStart(DB.config.year)}"></div>
        <button class="btn btn-primary" onclick="saveConfig()">Lưu cấu hình</button>
        <button class="btn btn-outline" onclick="if(confirm('Khôi phục dữ liệu ban đầu?')){localStorage.removeItem(KEY);localStorage.removeItem(SESS_KEY);location.reload()}">Khôi phục dữ liệu ban đầu</button>
      </div>
    </div>`;
}
function viewAudit() {
  if (SESSION?.role !== "ad") { toast("Chỉ quản trị được xem nhật ký"); VIEW = "teachers"; paint(); return; }
  const q = ($("#auQ")?.value || "").toLowerCase();
  const act = $("#auAct")?.value || "";
  const roleName = r => r === "ad" ? "Quản trị" : r === "gv" ? "Giáo viên" : r === "sv" ? "Sinh viên" : r || "—";
  const actName = {
    approve_leave: "Duyệt phép", reject_leave: "Từ chối phép",
    reset_week_report: "Reset báo cáo tuần",
    update_student: "Sửa sinh viên", create_student: "Thêm sinh viên",
    delete_student: "Xóa sinh viên", import_students: "Nhập sinh viên",
    delete_class: "Xóa lớp"
  };
  let rows = [...(DB.auditLog || [])].reverse();
  if (act) rows = rows.filter(x => x.action === act);
  if (q) rows = rows.filter(x => [x.actorName, x.detail, x.entity, x.action].join(" ").toLowerCase().includes(q));
  $("#main").innerHTML = `
    <div class="topbar"><h2>Nhật ký hệ thống</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <input class="search" id="auQ" placeholder="Tìm người thao tác, nội dung..." oninput="viewAudit()">
        <select id="auAct" onchange="viewAudit()">
          <option value="">Tất cả hành động</option>
          ${Object.entries(actName).map(([id, lb]) => `<option value="${id}" ${act===id?"selected":""}>${lb}</option>`).join("")}
        </select>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Thời gian</th><th>Người thao tác</th><th>Vai trò</th><th>Hành động</th><th>Đối tượng</th><th>Chi tiết</th></tr></thead>
        <tbody>${rows.length ? rows.map(x => `<tr>
          <td>${fmtDate(x.timestamp)} ${String(x.timestamp||"").slice(11,16)}</td>
          <td>${x.actorName || x.actorId || "—"}</td>
          <td>${roleName(x.actorRole)}</td>
          <td>${actName[x.action] || x.action}</td>
          <td>${x.entity || "—"}</td>
          <td>${x.detail || ""}</td>
        </tr>`).join("") : `<tr><td colspan="6">Chưa có nhật ký</td></tr>`}</tbody>
      </table></div>
    </div>`;
  if ($("#auQ") && q) { $("#auQ").value = q; $("#auQ").focus(); $("#auQ").setSelectionRange(q.length, q.length); }
}
function saveConfig() {
  DB.config.year = $("#cfYear").value.trim();
  DB.config.term = $("#cfTerm").value;
  DB.config.week = Math.min(WEEKS_PER_TERM, Math.max(1, +$("#cfWeek").value || 1));
  DB.config.yearStart = $("#cfYearStart")?.value || inferYearStart(DB.config.year);
  DB.config.weeksPerTerm = WEEKS_PER_TERM;
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

