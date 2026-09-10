import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { homeroomClassIds } from "@/lib/rbac";
import LeaveActions from "./actions";

export default async function LeavesPage() {
  const session = await getServerSession(authOptions);
  const classIds = session?.user.role === "ADMIN" ? undefined : await homeroomClassIds(session?.user.teacherId || null);
  const rows = await prisma.leaveRequest.findMany({
    where: classIds ? { student: { classId: { in: classIds } } } : undefined,
    include: { student: { include: { user: true, class: true } } },
    orderBy: { createdAt: "desc" }
  });
  return (
    <>
      <div className="topbar"><h2>Nghỉ phép</h2></div>
      <div className="leave-list">
        {rows.map((l) => (
          <div className="leave-item" key={l.id}>
            <div>
              <b>{l.student.user.name}</b>
              <div className="muted">{l.student.mssv} · {l.student.class.name} · {l.status}</div>
              <div className="muted">{l.reason}</div>
            </div>
            {l.status === "Pending" ? <LeaveActions id={l.id} /> : <span className="badge ok">{l.status}</span>}
          </div>
        ))}
      </div>
    </>
  );
}
