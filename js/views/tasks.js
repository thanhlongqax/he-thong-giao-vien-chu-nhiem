/* views/tasks.js */
/* ================= WORK ================= */
function viewWork() {
  const y = CAL_CURSOR.getFullYear(), m = CAL_CURSOR.getMonth();
  const start = new Date(y, m, 1);
  const pads = (start.getDay() + 6) % 7;
  const last = new Date(y, m + 1, 0).getDate();
  const prevLast = new Date(y, m, 0).getDate();
  let cells = ["T2","T3","T4","T5","T6","T7","CN"].map(d => `<div class="d head">${d}</div>`).join("");
  for (let i = 0; i < pads; i++) cells += `<div class="d mute"><span class="num">${prevLast - pads + 1 + i}</span></div>`;
  for (let d = 1; d <= last; d++) {
    const iso = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const t = DB.tasks.filter(x => x.date === iso);
    cells += `<div class="d ${iso===todayISO()?"today":""}" onclick="TASK_DATE='${iso}';TASK_FILTER='date';paint()" style="cursor:pointer"><span class="num">${d}</span>${t.map(x=>`<div class="ev">${x.done?"✓ ":""}${x.title}</div>`).join("")}</div>`;
  }
  const trail = (7 - ((pads + last) % 7)) % 7;
  for (let i = 1; i <= trail; i++) cells += `<div class="d mute"><span class="num">${i}</span></div>`;
  $("#main").innerHTML = `
    <div class="topbar"><h2>Công việc</h2>${topMeta()}</div>
    <div class="grid g-2">
      <div class="card">
        <h3>Danh sách công việc hôm nay <button class="btn btn-sm btn-primary" onclick="openTaskModal()">Tạo việc</button></h3>
        <div class="toolbar">
          <input type="date" id="taskDate" value="${TASK_DATE || todayISO()}" onchange="TASK_DATE=this.value;TASK_FILTER='date';paint()">
          <button class="btn btn-sm ${TASK_FILTER==="today"?"btn-primary":"btn-outline"}" onclick="TASK_FILTER='today';TASK_DATE=todayISO();paint()">Hôm nay</button>
          <button class="btn btn-sm ${TASK_FILTER==="date"?"btn-primary":"btn-outline"}" onclick="TASK_FILTER='date';paint()">Theo ngày</button>
          <button class="btn btn-sm ${TASK_FILTER==="todo"?"btn-primary":"btn-outline"}" onclick="TASK_FILTER='todo';paint()">Chưa hoàn thành</button>
          <button class="btn btn-sm ${TASK_FILTER==="done"?"btn-primary":"btn-outline"}" onclick="TASK_FILTER='done';paint()">Hoàn thành</button>
        </div>
        ${DB.tasks.filter(t => {
          const pick = TASK_DATE || todayISO();
          if (TASK_FILTER === "today") return t.date === todayISO() || t.type === "Hôm nay";
          if (TASK_FILTER === "date") return t.date === pick;
          if (TASK_FILTER === "todo") return !t.done;
          if (TASK_FILTER === "done") return t.done;
          return true;
        }).map(t => `
          <div class="assign-card ${t.done?"task-done":"task-todo"}" style="margin-bottom:8px">
            <div class="head">
              <label style="display:flex;gap:8px;align-items:center">
                <input type="checkbox" ${t.done?"checked":""} onchange="toggleTask('${t.id}')">
                <span style="${t.done?"text-decoration:line-through":""}"><b>${t.title}</b>
                  <div class="muted">${fmtDate(t.date)} ${t.time||""} · ${t.session||"Cả ngày"} · ${t.done?"Hoàn thành":"Chưa hoàn thành"}</div>
                </span>
              </label>
              <div>
                <button class="btn btn-sm btn-ghost" onclick="openTaskModal('${t.id}')">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="delTask('${t.id}')">Xóa</button>
              </div>
            </div>
          </div>`).join("") || "<p class='empty'>Chưa có công việc</p>"}
      </div>
      <div class="card">
        <div class="cal-wrap">
          <div class="cal-title">
            <button class="btn btn-sm btn-ghost" onclick="shiftCal(-1)">‹</button>
            <span>${MONTHS_VI[m]} năm ${y}</span>
            <button class="btn btn-sm btn-ghost" onclick="shiftCal(1)">›</button>
          </div>
          <div class="cal">${cells}</div>
        </div>
      </div>
    </div>`;
}
function shiftCal(n) { CAL_CURSOR = new Date(CAL_CURSOR.getFullYear(), CAL_CURSOR.getMonth() + n, 1); paint(); }
function openTaskModal(id) {
  const t = id ? DB.tasks.find(x => x.id === id) : { title: "", date: todayISO(), session: "Sáng", done: false };
  editTarget = id || null;
  showModal(`<h3>${id?"Sửa":"Tạo"} công việc</h3>
    <div class="field"><label>Tiêu đề</label><input id="tkTitle" value="${t.title||""}"></div>
    <div class="form-grid">
      <div class="field"><label>Ngày</label><input type="date" id="tkDate" value="${t.date||todayISO()}"></div>
      <div class="field"><label>Buổi</label>
        <select id="tkSes">
          ${["Sáng","Chiều","Cả ngày"].map(x=>`<option ${ (t.session||"Sáng")===x?"selected":""}>${x}</option>`).join("")}
        </select>
      </div>
      <div class="field"><label>Giờ</label><input type="time" id="tkTime" value="${t.time||"08:00"}"></div>
    </div>
    <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="tkDone" ${t.done?"checked":""}> Đánh dấu hoàn thành</label>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="hideModal()">Hủy</button>
      <button class="btn btn-primary" onclick="saveTask()">Lưu</button>
    </div>`);
}
function saveTask() {
  const rec = { title: $("#tkTitle").value.trim(), date: $("#tkDate").value, time: $("#tkTime").value, session: $("#tkSes").value, type: $("#tkDate").value===todayISO()?"Hôm nay":"Tuần này", done: $("#tkDone").checked };
  if (!rec.title) return toast("Nhập tiêu đề");
  if (editTarget) Object.assign(DB.tasks.find(t => t.id === editTarget), rec);
  else DB.tasks.push({ id: uid("t"), ...rec });
  save(DB); hideModal(); paint(); toast("Đã lưu công việc");
}
function delTask(id) { DB.tasks = DB.tasks.filter(t => t.id !== id); save(DB); paint(); }

