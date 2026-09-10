/* views/students.js */
/* ================= STUDENTS ================= */
function viewStudents() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Quản lý sinh viên</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <input class="search" id="qSv" placeholder="Tìm tên, MSSV, SĐT..." oninput="renderSvTable()">
        <select id="fClassFilter" onchange="renderSvTable()">
          <option value="">Tất cả lớp</option>
          ${scopedClasses().map(c => `<option value="${c.id}">${c.name}</option>`).join("")}
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
  const rows = scopedStudents().filter(s => {
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
    mssv:"", name:"", gender:"Nam", dob:"", classId: scopedClasses()[0]?.id || "",
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
        <select id="svClass">${scopedClasses().map(c=>`<option value="${c.id}" ${s.classId===c.id?"selected":""}>${c.name}</option>`).join("")}</select>
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
  if (!canAccessClass(rec.classId) && SESSION.role !== "ad") return toast("Không được gán sinh viên vào lớp ngoài phạm vi chủ nhiệm");
  if (editTarget && !canAccessStudent(editTarget.id) && SESSION.role !== "ad") return toast("Không có quyền sửa sinh viên này");
  if (!phoneOkOrWarn(rec.phone, "SĐT sinh viên")) return;
  if (!phoneOkOrWarn(rec.fatherPhone, "SĐT cha")) return;
  if (!phoneOkOrWarn(rec.motherPhone, "SĐT mẹ")) return;
  if (editTarget) {
    audit("update_student", "student", editTarget.id, rec.mssv + " · " + rec.name);
    Object.assign(editTarget, rec);
  } else {
    if (DB.students.some(s => s.mssv === rec.mssv)) return toast("MSSV đã tồn tại");
    const nid = uid("s");
    DB.students.push({ id: nid, ...rec });
    audit("create_student", "student", nid, rec.mssv + " · " + rec.name);
  }
  save(DB); hideModal(); paint(); toast("Đã lưu sinh viên");
}
function delSv(id) {
  if (!canAccessStudent(id) && SESSION.role !== "ad") return toast("Không có quyền với sinh viên này");
  if (!confirm("Xóa sinh viên?")) return;
  const s = studentById(id);
  audit("delete_student", "student", id, s ? s.mssv + " · " + s.name : id);
  DB.students = DB.students.filter(x => x.id !== id);
  save(DB); paint(); toast("Đã xóa");
}
function resetPw(id) {
  if (!canAccessStudent(id) && SESSION.role !== "ad") return toast("Không có quyền với sinh viên này");
  const s = studentById(id);
  const nw = "Sv@" + Math.random().toString(36).slice(2, 8);
  s.password = nw;
  save(DB);
  alert("Mật khẩu mới của " + s.name + ":\n\n" + nw);
  toast("Đã cấp lại mật khẩu");
}
function exportSvExcel() {
  const rows = scopedStudents().map(s => ({
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
    let arr = [];
    if (file.name.toLowerCase().endsWith(".json")) {
      const text = await file.text();
      const parsed = JSON.parse(text);
      arr = Array.isArray(parsed) ? parsed : parsed.students || [];
    } else {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      arr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    }
    startStudentImport(arr, file.name);
  } catch {
    toast("File không hợp lệ — không đọc được Excel/JSON");
  }
  e.target.value = "";
}
function ingestStudents(arr) {
  startStudentImport(arr, "dữ liệu dán");
}
function startStudentImport(arr, fileName) {
  IMP = { step: 2, fileName: fileName || "file", raw: Array.isArray(arr) ? arr : [], ready: [], issues: [] };
  validateStudentImport();
  IMP.step = 3;
  renderImportWizard();
}
function pickImportField(r, keys) {
  for (const k of keys) {
    if (r[k] !== undefined && r[k] !== null && String(r[k]).trim() !== "") return String(r[k]).trim();
  }
  return "";
}
function validateStudentImport() {
  const pool = SESSION.role === "ad" ? DB.classes : scopedClasses();
  const seen = {};
  const issues = [];
  const ready = [];
  if (!IMP.raw.length) {
    issues.push({ line: 0, level: "error", mssv: "", name: "", msgs: ["File không có dòng dữ liệu"] });
    IMP.issues = issues; IMP.ready = [];
    return;
  }
  IMP.raw.forEach((r, i) => {
    const line = i + 2;
    const errs = [], warns = [];
    const mssv = pickImportField(r, ["mssv", "MSSV", "Mã SV"]).toUpperCase();
    const name = pickImportField(r, ["name", "họ và tên", "hoten", "Họ và tên", "hoTen"]);
    const phone = pickImportField(r, ["phone", "sdt", "sdt sinh viên", "SĐT"]);
    const clsName = pickImportField(r, ["class", "lop", "lớp", "Lớp"]);
    const fatherPhone = pickImportField(r, ["fatherPhone", "sdt cha", "SĐT cha"]);
    const motherPhone = pickImportField(r, ["motherPhone", "sdt mẹ", "SĐT mẹ"]);
    if (!mssv) errs.push("Thiếu MSSV");
    if (!name) errs.push("Thiếu họ tên");
    if (mssv && seen[mssv]) errs.push("Trùng MSSV trong file (dòng " + seen[mssv] + ")");
    if (mssv) seen[mssv] = line;
    if (phone && !validPhone(phone)) errs.push("SĐT sinh viên không hợp lệ");
    if (fatherPhone && !validPhone(fatherPhone)) errs.push("SĐT cha không hợp lệ");
    if (motherPhone && !validPhone(motherPhone)) errs.push("SĐT mẹ không hợp lệ");
    let cls = clsName ? pool.find(c => c.name.toLowerCase() === clsName.toLowerCase()) : null;
    if (clsName && !cls) errs.push("Lớp không tồn tại hoặc ngoài phạm vi: " + clsName);
    if (!clsName) {
      cls = pool[0];
      if (cls) warns.push("Không có cột lớp — sẽ gán " + cls.name);
      else errs.push("Không có lớp để gán sinh viên");
    }
    const exist = mssv ? DB.students.find(s => s.mssv === mssv) : null;
    if (exist && SESSION.role === "gv" && !canAccessStudent(exist.id)) errs.push("MSSV đã thuộc lớp ngoài phạm vi chủ nhiệm");
    if (exist) warns.push("MSSV đã có — sẽ cập nhật hồ sơ");
    const rec = {
      mssv, name,
      gender: pickImportField(r, ["gender", "giới tính", "Gioi tinh"]) || "Nam",
      dob: pickImportField(r, ["dob", "ngày sinh", "ngay sinh"]).slice(0, 10),
      classId: cls?.id || "",
      phone, father: pickImportField(r, ["father", "họ tên cha"]),
      fatherPhone, mother: pickImportField(r, ["mother", "họ tên mẹ"]),
      motherPhone,
      addrThuongTru: pickImportField(r, ["addrThuongTru", "địa chỉ thường trú"]),
      addrCuTru: pickImportField(r, ["addrCuTru", "địa chỉ cư trú"]),
      status: pickImportField(r, ["status", "tình trạng"]) || "Đang học",
      username: (pickImportField(r, ["username"]) || mssv).toLowerCase(),
      password: pickImportField(r, ["password", "mật khẩu"]) || "123456",
      officer: pickImportField(r, ["officer"]) || "Không",
      _line: line, _update: !!exist
    };
    if (errs.length) issues.push({ line, level: "error", mssv, name, msgs: errs });
    else {
      if (warns.length) issues.push({ line, level: "warn", mssv, name, msgs: warns });
      ready.push(rec);
    }
  });
  IMP.issues = issues;
  IMP.ready = ready;
}
function renderImportWizard() {
  const errors = IMP.issues.filter(x => x.level === "error");
  const warns = IMP.issues.filter(x => x.level === "warn");
  const blocked = errors.length > 0 || !IMP.ready.length;
  const steps = ["Tải file", "Kiểm tra", "Xem lỗi", "Xác nhận", "Ghi dữ liệu"];
  showModal(`<h3>Nhập sinh viên</h3>
    <p class="muted">${IMP.fileName} · ${IMP.raw.length} dòng</p>
    <div class="steps">${steps.map((lb, i) => `<div class="step ${IMP.step===i+1?"on":""}">${i+1}. ${lb}</div>`).join("")}</div>
    <div class="card" style="margin-top:10px">
      <p><b>${errors.length}</b> lỗi nghiêm trọng · <b>${warns.length}</b> cảnh báo · <b>${IMP.ready.length}</b> dòng hợp lệ</p>
      ${blocked ? `<p class="muted">Không thể ghi khi còn lỗi nghiêm trọng hoặc không còn dòng hợp lệ.</p>` : `<p class="muted">Các dòng hợp lệ sẽ được thêm mới hoặc cập nhật theo MSSV.</p>`}
      <div class="table-wrap" style="max-height:240px;overflow:auto;margin-top:8px">
        <table><thead><tr><th>Dòng</th><th>Mức</th><th>MSSV</th><th>Họ tên</th><th>Chi tiết</th></tr></thead>
        <tbody>${IMP.issues.length ? IMP.issues.map(x => `<tr>
          <td>${x.line || "—"}</td>
          <td><span class="badge ${x.level==="error"?"bad":"warn"}">${x.level==="error"?"Lỗi":"Cảnh báo"}</span></td>
          <td>${x.mssv || "—"}</td><td>${x.name || "—"}</td>
          <td>${x.msgs.join("; ")}</td>
        </tr>`).join("") : `<tr><td colspan="5">Không có lỗi</td></tr>`}</tbody></table>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="cancelStudentImport()">Hủy</button>
      ${blocked
        ? `<button class="btn btn-primary" disabled>Không thể xác nhận</button>`
        : `<button class="btn btn-primary" onclick="confirmStudentImport()">Xác nhận và ghi ${IMP.ready.length} dòng</button>`}
    </div>`);
}
function cancelStudentImport() {
  IMP = { step: 1, fileName: "", raw: [], ready: [], issues: [] };
  hideModal();
}
function confirmStudentImport() {
  if (IMP.issues.some(x => x.level === "error") || !IMP.ready.length) {
    toast("Còn lỗi nghiêm trọng — không ghi dữ liệu");
    IMP.step = 3;
    renderImportWizard();
    return;
  }
  IMP.step = 4;
  commitStudentImport();
}
function commitStudentImport() {
  IMP.step = 5;
  const snap = JSON.parse(JSON.stringify(DB.students));
  try {
    let added = 0, updated = 0;
    IMP.ready.forEach(rec => {
      const row = { ...rec };
      delete row._line; delete row._update;
      const exist = DB.students.find(s => s.mssv === row.mssv);
      if (exist) { Object.assign(exist, row); updated++; }
      else { DB.students.push({ id: uid("s"), ...row }); added++; }
    });
    audit("import_students", "student", "", "Nhập " + IMP.ready.length + " dòng (thêm " + added + ", cập nhật " + updated + ") · " + IMP.fileName);
    save(DB);
    hideModal();
    paint();
    toast("Đã ghi " + added + " mới, cập nhật " + updated);
    IMP = { step: 1, fileName: "", raw: [], ready: [], issues: [] };
  } catch (err) {
    DB.students = snap;
    try { save(DB); } catch (_) {}
    toast("Ghi dữ liệu thất bại — đã hoàn tác, không đổi danh sách sinh viên");
    IMP.step = 3;
    renderImportWizard();
  }
}

