import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const rows = await prisma.weeklyReport.findMany({
    include: { student: { include: { user: true, class: true } } },
    orderBy: { createdAt: "desc" }
  });
  return (
    <>
      <div className="topbar"><h2>Báo cáo tuần</h2></div>
      <div className="card">
        {rows.map((r) => (
          <div className="assign-card" key={r.id}>
            <b>{r.student.user.name}</b>
            <div className="muted">{r.student.mssv} · {r.student.class.name} · Tuần {r.week}</div>
          </div>
        ))}
      </div>
    </>
  );
}
