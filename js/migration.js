/* migration.js — nâng schema localStorage, không xóa dữ liệu */
function resolveSubjectIdForDb(db, raw) {
  if (!raw) return null;
  if (!Array.isArray(db.subjects)) db.subjects = [];
  const hitId = db.subjects.find(s => s.id === raw);
  if (hitId) return hitId.id;
  const name = String(raw).trim();
  if (!name) return null;
  const hitName = db.subjects.find(s => String(s.name).toLowerCase() === name.toLowerCase());
  if (hitName) return hitName.id;
  const id = uid("m");
  db.subjects.push({ id, name, code: name.replace(/\s+/g, "").slice(0, 8).toUpperCase() || "MON", credit: 0 });
  return id;
}

function migrate(db) {
  if (!db.config) db.config = seed().config;
  if (!Array.isArray(db.mailLog)) db.mailLog = [];
  if (!Array.isArray(db.auditLog)) db.auditLog = [];
  if (!db.admin) db.admin = { name: "Quản trị hệ thống", username: "admin", password: "123456" };
  if (!Array.isArray(db.faculties) || !db.faculties.length) {
    db.faculties = [
      { id: "k1", name: "Kinh tế", locked: false },
      { id: "k2", name: "Công nghệ thông tin", locked: false },
      { id: "k3", name: "Cơ khí", locked: false }
    ];
  }
  if (!Array.isArray(db.teachers)) {
    db.teachers = [{
      id: "gv1",
      name: db.teacher?.name || "Nguyễn Thị Hồng",
      dob: "1988-05-12",
      position: "Giảng viên",
      title: "Giáo viên chủ nhiệm",
      faculty: "Kinh tế",
      username: db.teacher?.username || "gv",
      password: db.teacher?.password || "123456",
      facultyId: "k1",
      active: true
    }];
  }
  db.teachers.forEach(t => {
    if (!t.facultyId) {
      const f = (db.faculties || []).find(x => x.name === t.faculty);
      t.facultyId = f?.id || (db.faculties?.[0]?.id || "");
    }
    if (t.active === undefined) t.active = true;
    if (t.gmail === undefined) t.gmail = "";
    if (t.gmailNotify === undefined) t.gmailNotify = false;
  });
  (db.assigns || []).forEach(a => {
    if (!a.teacherIds) a.teacherIds = [];
  });
  (db.tasks || []).forEach(t => { if (!t.session) t.session = "Cả ngày"; });
  (db.leaves || []).forEach(l => { if (!l.session) l.session = "Cả ngày"; });
  (db.assigns || []).forEach(a => {
    if (!a.classIds) a.classIds = a.classId ? [a.classId] : [];
  });
  if (Array.isArray(db.schedule) && db.schedule.length && !db.schedule[0].id) {
    db.schedule = db.schedule.map((s, i) => ({
      id: "sch" + (i + 1), day: s.day, start: "07:30", end: "09:15",
      subject: String(s.slots || s.subject || "").replace(/^\d.?\d*\s*/, ""), classId: s.classId || "c1"
    }));
  }
  (db.classes || []).forEach(c => {
    if (!Object.prototype.hasOwnProperty.call(c, "homeroomTeacherId")) c.homeroomTeacherId = null;
    if (c.homeroomTeacherId === "") c.homeroomTeacherId = null;
  });
  if (db.teacher && typeof db.teacher === "object") {
    if (!Array.isArray(db.teachers)) db.teachers = [];
    const u = db.teacher.username;
    let t = u ? db.teachers.find(x => x.username === u) : null;
    if (!t) {
      db.teachers.push({
        id: uid("gv"),
        name: db.teacher.name || "Giáo viên",
        dob: db.teacher.dob || "",
        position: db.teacher.position || "Giảng viên",
        title: db.teacher.title || "Giáo viên chủ nhiệm",
        facultyId: db.faculties?.[0]?.id || "",
        username: u || "gv",
        password: db.teacher.password || "123456",
        active: true,
        gmail: db.teacher.gmail || "",
        gmailNotify: !!db.teacher.gmailNotify
      });
    } else {
      if (!t.name && db.teacher.name) t.name = db.teacher.name;
      if (!t.password && db.teacher.password) t.password = db.teacher.password;
    }
    delete db.teacher;
  }
  if (db.config && ("gmail" in db.config || "gmailNotify" in db.config)) {
    const mail = db.config.gmail || "";
    const notify = !!db.config.gmailNotify;
    (db.teachers || []).forEach(t => {
      if (mail && !t.gmail) t.gmail = mail;
      if (t.gmailNotify === undefined) t.gmailNotify = notify;
    });
    delete db.config.gmail;
    delete db.config.gmailNotify;
  }
  (db.schedule || []).forEach(s => {
    if (s.subjectId && (db.subjects || []).some(m => m.id === s.subjectId)) {
      delete s.subject;
      return;
    }
    const raw = s.subjectId || s.subject || "";
    const sid = resolveSubjectIdForDb(db, raw);
    if (sid) s.subjectId = sid;
    delete s.subject;
  });
  if (!db.config) db.config = {};
  if (!db.config.year) db.config.year = "2025-2026";
  if (!db.config.term || !TERMS.includes(db.config.term)) db.config.term = "Học kỳ 1";
  if (!db.config.week) db.config.week = 1;
  db.config.week = Math.min(WEEKS_PER_TERM, Math.max(1, +db.config.week || 1));
  if (!db.config.yearStart) db.config.yearStart = inferYearStart(db.config.year);
  if (!db.config.weeksPerTerm) db.config.weeksPerTerm = WEEKS_PER_TERM;
  (db.issues || []).forEach(i => {
    if (!i.status || !ISSUE_STATUS.some(s => s.id === i.status)) {
      i.status = i.reported ? "In Progress" : "Pending";
    }
    if (!i.source) i.source = i.reported ? "weekly_report" : "teacher";
    if (!i.year) i.year = db.config?.year || "";
    if (!i.term) i.term = db.config?.term || "";
  });
  (db.attendance || []).forEach(a => {
    if (a.scheduleId === undefined) a.scheduleId = null;
    if (a.scheduleId) return;
    const st = (db.students || []).find(s => s.id === a.studentId);
    if (!st || !a.date) return;
    const day = weekdayOf(a.date);
    const subNm = (id) => (db.subjects || []).find(m => m.id === id)?.name;
    const hit = (db.schedule || []).find(s =>
      s.classId === st.classId &&
      (s.subjectId === a.subjectId || (a.subject && subNm(s.subjectId) === a.subject)) &&
      s.day === day
    );
    if (hit) {
      a.scheduleId = hit.id;
      if (!a.subjectId) a.subjectId = hit.subjectId;
    }
  });
  return db;
}
