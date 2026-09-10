import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { homeroomClassIds } from "@/lib/rbac";

export default async function ClassesPage() {
  const session = await getServerSession(authOptions);
  const ids = session?.user.role === "ADMIN" ? undefined : await homeroomClassIds(session?.user.teacherId || null);
  const rows = await prisma.class.findMany({
    where: ids ? { id: { in: ids } } : undefined,
    include: { homeroomTeacher: { include: { user: true } }, _count: { select: { students: true } } }
  });
  return (
    <>
      <div className="topbar"><h2>Lớp chủ nhiệm</h2></div>
      <div className="card">
        <table>
          <thead><tr><th>Lớp</th><th>Phân hệ</th><th>GVCN</th><th>Sĩ số</th></tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.level}</td>
                <td>{c.homeroomTeacher?.user.name || "—"}</td>
                <td>{c._count.students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
