/* views/student.js */
/* ================= STUDENT INFO ================= */
function viewSvInfo() {
  const s = studentById(SESSION.studentId);
  $("#main").innerHTML = `
    <div class="topbar"><h2>Hồ sơ sinh viên</h2>${topMeta()}</div>
    <div class="profile-hero">
      <div class="ava">${s.name.split(" ").slice(-1)[0].slice(0,1)}</div>
      <div>
        <div class="muted" style="color:#b7cfc6;letter-spacing:.12em;text-transform:uppercase;font-size:11px">Sinh viên · ${className(s.classId)}</div>
        <h3>${s.name}</h3>
        <p style="color:#d5ebe3;margin-top:4px">${s.mssv} · ${s.gender} · ${fmtDate(s.dob)}</p>
      </div>
      <span class="badge ok">${s.status}</span>
    </div>
    <div class="grid g-2" style="margin-top:14px">
      <div class="card">
        <h3>Thông tin học tập</h3>
        <div class="kv">
          <b>Mã số</b><span>${s.mssv}</span>
          <b>Lớp</b><span>${className(s.classId)}</span>
          <b>Ban cán sự</b><span>${s.officer}</span>
          <b>Tài khoản</b><span>${s.username}</span>
          <b>Số điện thoại</b><span>${s.phone || "—"}</span>
        </div>
      </div>
      <div class="card">
        <h3>Gia đình và nơi ở</h3>
        <div class="kv">
          <b>Họ tên cha</b><span>${s.father || "—"} · ${s.fatherPhone || ""}</span>
          <b>Họ tên mẹ</b><span>${s.mother || "—"} · ${s.motherPhone || ""}</span>
          <b>Thường trú</b><span>${s.addrThuongTru || "—"}</span>
          <b>Cư trú</b><span>${s.addrCuTru || "—"}</span>
        </div>
      </div>
    </div>`;
}


/* ================= WEEKLY REPORT UI ================= */
function viewSvWeek() {
  const s = studentById(SESSION.studentId);
  const existed = DB.reports.find(r => r.studentId === s.id && r.week === DB.config.week && r.year === DB.config.year && r.term === DB.config.term);
  const a = existed?.answers || {};
  const ro = existed ? "disabled" : "";
  $("#main").innerHTML = `
    <div class="topbar"><h2>Báo cáo tuần</h2>${topMeta()}</div>
    <div class="card report-sheet">
      <div class="report-head">
        <div class="org">${DB.config.year}</div>
        <h3>Báo cáo tuần ${DB.config.week}</h3>
        <p class="muted">${DB.config.term} · ${s.name} · ${s.mssv} · ${className(s.classId)}</p>
        ${existed ? `<p style="margin-top:8px"><span class="badge ok">Đã nộp — mỗi tuần chỉ gửi một lần</span></p>` : `<p class="muted" style="margin-top:8px">Mỗi tuần chỉ được gửi một lần</p>`}
      </div>
      <div class="steps">
        <div class="step ${WEEK_STEP===1?"on":""}">1. Chuyên cần</div>
        <div class="step ${WEEK_STEP===2?"on":""}">2. Học tập</div>
        <div class="step ${WEEK_STEP===3?"on":""}">3. Hỗ trợ</div>
      </div>
      <div class="q-block">
        <h4>1. Chuyên cần</h4>
        <div class="form-grid">
          <div class="field"><label>${QUESTION.ABSENT}</label><input type="number" id="qABSENT" min="0" value="${a.ABSENT||0}" ${ro}></div>
          <div class="field"><label>${QUESTION.LATE}</label><input type="number" id="qLATE" min="0" value="${a.LATE||0}" ${ro}></div>
          <div class="field span-2"><label>${QUESTION.ABSENT_SESSION}</label><input id="qABSENT_SESSION" value="${a.ABSENT_SESSION||""}" ${ro}></div>
          <div class="field span-2"><label>${QUESTION.ABSENT_REASON}</label><input id="qABSENT_REASON" value="${a.ABSENT_REASON||""}" ${ro}></div>
          <div class="field"><label>${QUESTION.REPORTED}</label>
            <select id="qREPORTED" ${ro}><option>Chưa</option><option>Đã báo</option></select></div>
        </div>
      </div>
      <div class="q-block">
        <h4>2. Học tập</h4>
        <div class="form-grid">
          <div class="field"><label>${QUESTION.LEARNING}</label>
            <select id="qLEARNING" ${ro}><option>Tốt</option><option>Ổn</option><option>Yếu</option><option>Rất tốt</option></select></div>
          <div class="field"><label>${QUESTION.DIFFICULTY}</label>
            <select id="qDIFFICULTY" ${ro}><option>Không</option><option>Có</option></select></div>
          <div class="field span-2"><label>${QUESTION.DIFFICULTY_DETAIL}</label><input id="qDIFFICULTY_DETAIL" value="${a.DIFFICULTY_DETAIL||""}" ${ro}></div>
          <div class="field"><label>${QUESTION.SUBJECT}</label><input id="qSUBJECT" value="${a.SUBJECT||""}" ${ro}></div>
          <div class="field"><label>${QUESTION.ASSIGNMENT}</label>
            <select id="qASSIGNMENT" ${ro}><option>Không</option><option>Có</option></select></div>
          <div class="field span-2"><label>${QUESTION.MOTIVATION}</label><input id="qMOTIVATION" value="${a.MOTIVATION||""}" ${ro}></div>
        </div>
      </div>
      <div class="q-block">
        <h4>3. Hỗ trợ từ giáo viên chủ nhiệm</h4>
        <div class="form-grid">
          <div class="field span-2"><label>${QUESTION.IMPACT}</label><input id="qIMPACT" value="${a.IMPACT||""}" ${ro}></div>
          <div class="field"><label>${QUESTION.SUPPORT}</label>
            <select id="qSUPPORT" ${ro}><option>Không</option><option>Có</option></select></div>
          <div class="field"><label>${QUESTION.PRIVATE}</label>
            <select id="qPRIVATE" ${ro}><option>Không</option><option>Có</option></select></div>
          <div class="field span-2"><label>${QUESTION.SUPPORT_DETAIL}</label><input id="qSUPPORT_DETAIL" value="${a.SUPPORT_DETAIL||""}" ${ro}></div>
          <div class="field span-2"><label>${QUESTION.OTHER}</label><textarea id="qOTHER" rows="3" ${ro}>${a.OTHER||""}</textarea></div>
        </div>
      </div>
      ${existed ? "" : `<div class="modal-actions">
        ${WEEK_STEP>1?`<button class="btn btn-outline" onclick="stashWeek();WEEK_STEP--;paint()">Quay lại</button>`:""}
        ${WEEK_STEP<3?`<button class="btn btn-primary" onclick="stashWeek();WEEK_STEP++;paint()">Tiếp tục</button>`:`<button class="btn btn-primary" onclick="submitWeek()">Nộp báo cáo tuần</button>`}
      </div>`}
    </div>`;
  $$(".q-block").forEach((el, i) => { el.style.display = (i + 1) === WEEK_STEP || existed ? "" : "none"; });
  ["REPORTED","LEARNING","DIFFICULTY","ASSIGNMENT","SUPPORT","PRIVATE"].forEach(k => {
    const el = document.getElementById("q" + k);
    if (el && a[k]) el.value = a[k];
  });
  Object.entries(WEEK_DRAFT).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
}

function viewPassword() {
  $("#main").innerHTML = `
    <div class="topbar"><h2>Đổi mật khẩu</h2>${topMeta()}</div>
    <div class="card" style="max-width:460px">
      <div class="field"><label>Mật khẩu hiện tại</label>
        <div class="pw-wrap">
          <input id="pwOld" type="password">
          ${pwToggleBtn("pwOld")}
        </div>
      </div>
      <div class="field"><label>Mật khẩu mới</label>
        <div class="pw-wrap">
          <input id="pwNew" type="password">
          ${pwToggleBtn("pwNew")}
        </div>
      </div>
      <div class="field"><label>Nhập lại mật khẩu mới</label>
        <div class="pw-wrap">
          <input id="pwNew2" type="password">
          ${pwToggleBtn("pwNew2")}
        </div>
      </div>
      <button class="btn btn-primary" onclick="changePassword()">Cập nhật mật khẩu</button>
    </div>`;
}
function changePassword() {
  const oldP = $("#pwOld").value, n1 = $("#pwNew").value, n2 = $("#pwNew2").value;
  if (!n1 || n1 !== n2) return toast("Mật khẩu mới không khớp");
  if (SESSION.role === "ad") {
    if (oldP !== DB.admin.password) return toast("Mật khẩu hiện tại không đúng");
    DB.admin.password = n1;
  } else if (SESSION.role === "gv") {
    const t = currentTeacher();
    if (!t || oldP !== t.password) return toast("Mật khẩu hiện tại không đúng");
    t.password = n1;
  } else {
    const s = studentById(SESSION.studentId);
    if (!s || oldP !== s.password) return toast("Mật khẩu hiện tại không đúng");
    s.password = n1;
  }
  save(DB); toast("Đã đổi mật khẩu"); paint();
}

