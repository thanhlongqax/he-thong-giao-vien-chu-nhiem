/* views/schedule.js */
function viewSchedule() {
  const byDay = WEEKDAYS.map(day => ({ day, items: DB.schedule.filter(s => s.day === day) }));
  $("#main").innerHTML = `
    <div class="topbar"><h2>Lịch học theo tuần</h2>${topMeta()}</div>
    <div class="card">
      <div class="toolbar">
        <select id="schClassFilter" onchange="paint()">
          <option value="">Tất cả lớp</option>
          ${DB.classes.map(c=>`<option value="${c.id}" ${window._schCls===c.id?"selected":""}>${c.name}</option>`).join("")}
        </select>
        <button class="btn btn-primary" onclick="openWeekSchModal()">Phân lịch cả tuần</button>
      </div>
      <div class="assign-list">
        ${byDay.map(g => {
          const items = g.items.filter(s => !window._schCls || s.classId === window._schCls);
          return `<div class="assign-card">
            <b>${g.day}</b>
            ${items.length ? items.map(s => `<div class="head" style="margin-top:8px">
              <div>${s.start} – ${s.end} · ${subjectName(s.subjectId)} · <span class="pill">${className(s.classId)}</span></div>
              <div>
                <button class="btn btn-sm btn-ghost" onclick="openSchModal('${s.id}')">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="delSch('${s.id}')">Xóa</button>
              </div>
            </div>`).join("") : "<p class='muted'>Trống</p>"}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  $("#schClassFilter").onchange = () => { window._schCls = $("#schClassFilter").value; paint(); };
}
function subjectOptions(sel) {
  return DB.subjects.map(m => `<option value="${m.id}" ${sel===m.id?"selected":""}>${m.name}</option>`).join("");
}
function sessionTimes(ses) {
  return ses === "Chiều" ? { start: "13:00", end: "16:30" } : { start: "07:30", end: "11:00" };
}
function openSchModal(id) {
  const s = id ? DB.schedule.find(x => x.id === id) : { day: "Thứ 2", start: "07:30", end: "11:00", subjectId: DB.subjects[0]?.id, classId: DB.classes[0]?.id };
  editTarget = id || null;
  showModal(`<h3>${id?"Sửa":"Thêm"} buổi học</h3>
    <div class="form-grid">
      <div class="field"><label>Thứ</label><select id="scDay">${WEEKDAYS.map(d=>`<option ${s.day===d?"selected":""}>${d}</option>`).join("")}</select></div>
      <div class="field"><label>Lớp</label><select id="scCls">${DB.classes.map(c=>`<option value="${c.id}" ${s.classId===c.id?"selected":""}>${c.name}</option>`).join("")}</select></div>
      <div class="field"><label>Môn học</label><select id="scSub">${subjectOptions(s.subjectId)}</select></div>
      <div class="field"><label>Buổi</label>
        <select id="scSes" onchange="const t=sessionTimes(this.value);document.getElementById('scStart').value=t.start;document.getElementById('scEnd').value=t.end;">
          <option>Sáng</option><option>Chiều</option>
        </select>
      </div>
      <div class="field"><label>Bắt đầu</label><input id="scStart" value="${s.start||"07:30"}"></div>
      <div class="field"><label>Kết thúc</label><input id="scEnd" value="${s.end||"11:00"}"></div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveSch()">Lưu</button>
    </div>`);
}
function saveSch() {
  const rec = { day: $("#scDay").value, classId: $("#scCls").value, start: $("#scStart").value, end: $("#scEnd").value, subjectId: $("#scSub").value };
  if (!rec.subjectId) return toast("Chọn môn học");
  if (editTarget) Object.assign(DB.schedule.find(s => s.id === editTarget), rec);
  else DB.schedule.push({ id: uid("sch"), ...rec });
  save(DB); hideModal(); paint(); toast("Đã lưu lịch học");
}
function openWeekSchModal() {
  const subSel = subjectOptions();
  showModal(`<h3>Phân lịch cả tuần</h3>
    <p class="muted" style="margin-bottom:10px">Mỗi thứ chọn môn và giờ riêng. Bỏ trống môn nếu ngày đó không học.</p>
    <div class="field"><label>Lớp</label><select id="wkCls">${DB.classes.map(c=>`<option value="${c.id}">${c.name}</option>`).join("")}</select></div>
    ${WEEKDAYS.map((d,i) => `<div class="form-grid" style="margin-bottom:8px;align-items:end">
      <div class="field"><label>${d}</label>
        <select id="wkSub_${i}"><option value="">— Không xếp —</option>${subSel}</select>
      </div>
      <div class="field"><label>Giờ bắt đầu</label><input type="time" id="wkSt_${i}" value="07:30"></div>
      <div class="field"><label>Giờ kết thúc</label><input type="time" id="wkEn_${i}" value="09:15"></div>
    </div>`).join("")}
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveWeekSch()">Lưu lịch tuần</button>
    </div>`);
}
function saveWeekSch() {
  const classId = $("#wkCls").value;
  let n = 0;
  WEEKDAYS.forEach((day, i) => {
    const subjectId = document.getElementById("wkSub_" + i)?.value;
    if (!subjectId) return;
    DB.schedule.push({
      id: uid("sch"), day, classId, subjectId,
      start: document.getElementById("wkSt_" + i).value,
      end: document.getElementById("wkEn_" + i).value
    });
    n++;
  });
  if (!n) return toast("Chọn ít nhất một môn trong tuần");
  save(DB); hideModal(); paint(); toast("Đã lưu " + n + " buổi học");
}
function delSch(id) { DB.schedule = DB.schedule.filter(s => s.id !== id); save(DB); paint(); }
