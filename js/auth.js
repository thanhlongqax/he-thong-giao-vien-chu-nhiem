/* auth.js — phiên đăng nhập và phạm vi GVCN / bộ môn */
function persistSession() {
  if (SESSION) localStorage.setItem(SESS_KEY, JSON.stringify(SESSION));
  else localStorage.removeItem(SESS_KEY);
}
function restoreSession() {
  try {
    const raw = localStorage.getItem(SESS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}
function currentTeacher() {
  if (SESSION?.role !== "gv") return null;
  return DB.teachers.find(t => t.id === SESSION.teacherId || t.username === SESSION.username) || null;
}
function currentTeacherId() {
  if (SESSION?.role !== "gv") return null;
  return SESSION.teacherId || currentTeacher()?.id || null;
}
function teacherName(id) {
  return (DB.teachers || []).find(t => t.id === id)?.name || "Chưa phân công";
}
function scopedClassIds() {
  if (!SESSION || SESSION.role === "ad") return (DB.classes || []).map(c => c.id);
  if (SESSION.role !== "gv") return [];
  const tid = currentTeacherId();
  if (!tid) return [];
  return (DB.classes || []).filter(c => c.homeroomTeacherId === tid).map(c => c.id);
}
function scopedClasses() {
  const allow = new Set(scopedClassIds());
  return (DB.classes || []).filter(c => allow.has(c.id));
}
function scopedStudents() {
  const allow = new Set(scopedClassIds());
  return (DB.students || []).filter(s => allow.has(s.classId));
}
function scopedStudentIds() {
  return scopedStudents().map(s => s.id);
}
function canAccessClass(classId) {
  if (SESSION?.role === "ad") return true;
  if (SESSION?.role !== "gv") return false;
  return scopedClassIds().includes(classId);
}
function canAccessStudent(studentId) {
  if (SESSION?.role === "ad") return true;
  const s = (DB.students || []).find(x => x.id === studentId);
  return !!(s && canAccessClass(s.classId));
}
function isSubjectTeacher(classId, subjectId) {
  if (SESSION?.role !== "gv") return false;
  const tid = currentTeacherId();
  if (!tid) return false;
  return (DB.assigns || []).some(a =>
    a.year === academicYear() &&
    a.term === academicTerm() &&
    a.subjectId === subjectId &&
    (a.classIds || []).includes(classId) &&
    (a.teacherIds || []).includes(tid)
  );
}
function canAttendClass(classId, subjectId) {
  if (SESSION?.role === "ad") return true;
  if (SESSION?.role !== "gv") return false;
  if (canAccessClass(classId)) return true;
  return isSubjectTeacher(classId, subjectId);
}
function attendRoleLabel(classId, subjectId) {
  if (SESSION?.role === "ad") return "Quản trị";
  const hr = canAccessClass(classId);
  const sub = isSubjectTeacher(classId, subjectId);
  if (hr && sub) return "GVCN · Bộ môn";
  if (hr) return "GVCN";
  if (sub) return "Giáo viên bộ môn";
  return "Không có quyền";
}
function canViewAttendance(rec) {
  if (!rec) return false;
  if (SESSION?.role === "ad") return true;
  if (canAccessStudent(rec.studentId)) return true;
  const st = studentById(rec.studentId);
  return !!(st && canAttendClass(st.classId, rec.subjectId));
}
/* ================= LOGIN ================= */
function loginFail() {
  const err = $("#loginErr");
  if (err) err.classList.add("show");
  toast("Tài khoản hoặc mật khẩu không đúng");
}
function tryAdmin(user, pass) {
  return user === DB.admin.username && pass === DB.admin.password
    ? { role: "ad", name: DB.admin.name, username: DB.admin.username } : null;
}
function tryTeacher(user, pass) {
  const gv = DB.teachers.find(t => t.username === user && t.password === pass);
  if (!gv) return null;
  if (gv.active === false) { toast("Tài khoản giáo viên đang không hoạt động"); return "inactive"; }
  return { role: "gv", name: gv.name, username: gv.username, teacherId: gv.id };
}
function tryStudent(user, pass) {
  const st = DB.students.find(s => (s.username === user.toLowerCase() || s.mssv === user.toUpperCase()) && s.password === pass);
  return st ? { role: "sv", studentId: st.id, name: st.name } : null;
}
function login() {
  $("#loginErr")?.classList.remove("show");
  const role = $(".role-pills button.active")?.dataset.role || "auto";
  const user = $("#loginUser").value.trim();
  const pass = $("#loginPass").value;
  if (!user || !pass) { loginFail(); return; }
  let sess = null;
  if (role === "auto") sess = tryAdmin(user, pass) || tryTeacher(user, pass) || tryStudent(user, pass);
  else if (role === "ad") sess = tryAdmin(user, pass);
  else if (role === "gv") sess = tryTeacher(user, pass);
  else sess = tryStudent(user, pass);
  if (sess === "inactive") return;
  if (sess) { SESSION = sess; persistSession(); enterApp(); return; }
  loginFail();
}
function logout() {
  SESSION = null;
  persistSession();
  closeSidebar();
  $("#app").classList.add("app-hidden");
  $("#loginScreen").classList.remove("app-hidden");
}
function enterApp() {
  $("#loginScreen").classList.add("app-hidden");
  $("#app").classList.remove("app-hidden");
  renderShell();
}
