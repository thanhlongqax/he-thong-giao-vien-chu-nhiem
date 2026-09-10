import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  const rows = await prisma.task.findMany({
    where: session?.user.role === "ADMIN" ? undefined : { teacherId: session?.user.teacherId || undefined },
    orderBy: { date: "asc" }
  });
  return (
    <>
      <div className="topbar"><h2>Công việc</h2></div>
      <div className="card">
        {rows.map((t) => (
          <p key={t.id}>{t.done ? "✓" : "○"} {t.title} <span className="muted">{t.date.toISOString().slice(0, 10)}</span></p>
        ))}
      </div>
    </>
  );
}
