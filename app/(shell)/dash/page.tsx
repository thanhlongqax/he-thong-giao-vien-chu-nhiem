import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { homeroomClassIds } from "@/lib/rbac";

export default async function DashPage() {
  const session = await getServerSession(authOptions);
  const teacherId = session?.user.teacherId || null;
  const classIds = session?.user.role === "ADMIN"
    ? (await prisma.class.findMany({ select: { id: true } })).map((c) => c.id)
    : await homeroomClassIds(teacherId);
  const students = await prisma.student.findMany({
    where: { classId: { in: classIds } },
    include: { user: true }
  });
  const ids = students.map((s) => s.id);
  const cfg = await prisma.academicConfig.findUnique({ where: { id: "current" } });
  const pendingLeaves = await prisma.leaveRequest.count({
    where: { status: "Pending", studentId: { in: ids } }
  });
  const issues = await prisma.issue.findMany({
    where: { studentId: { in: ids }, status: { not: "Resolved" } },
    include: { student: { include: { user: true } } }
  });
  const tasks = await prisma.task.findMany({
    where: { teacherId: teacherId || undefined, done: false },
    orderBy: { date: "asc" }
  });
  const care = students.filter((s) => s.status === "Cần quan tâm" || s.status === "Cần theo dõi");

  return (
    <>
      <div className="topbar">
        <div>
          <h2>Tổng quan lớp chủ nhiệm</h2>
          <p className="muted">{session?.user.name} · Tuần {cfg?.week}</p>
        </div>
      </div>
      <div className="grid g-4">
        <div className="stat"><div className="k">Sĩ số</div><div className="v">{students.length}</div></div>
        <div className="stat"><div className="k">Đơn phép chờ</div><div className="v">{pendingLeaves}</div></div>
        <div className="stat"><div className="k">Cần quan tâm</div><div className="v">{care.length + issues.length}</div></div>
        <div className="stat"><div className="k">Việc chưa xong</div><div className="v">{tasks.length}</div></div>
      </div>
      <div className="grid g-2" style={{ marginTop: 14 }}>
        <div className="card">
          <h3>Ai cần quan tâm?</h3>
          {care.length || issues.length ? (
            <>
              {care.map((s) => (
                <p key={s.id}><b>{s.user.name}</b> <span className="muted">{s.mssv} · {s.status}</span></p>
              ))}
              {issues.map((i) => (
                <p key={i.id}><b>{i.student.user.name}</b> <span className="badge warn">{i.status}</span> <span className="muted">{i.text}</span></p>
              ))}
            </>
          ) : <div className="empty-box"><p>Không có học sinh cần theo dõi</p></div>}
        </div>
        <div className="card task-todo">
          <h3>Việc chưa làm</h3>
          {tasks.length ? tasks.map((t) => <p key={t.id}>{t.title}</p>) : <div className="empty-box"><p>Không còn việc tồn</p></div>}
        </div>
      </div>
    </>
  );
}
