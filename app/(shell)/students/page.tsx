import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { homeroomClassIds } from "@/lib/rbac";

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);
  const classIds = session?.user.role === "ADMIN"
    ? undefined
    : await homeroomClassIds(session?.user.teacherId || null);
  const rows = await prisma.student.findMany({
    where: classIds ? { classId: { in: classIds } } : undefined,
    include: { user: true, class: true },
    orderBy: { mssv: "asc" }
  });
  return (
    <>
      <div className="topbar"><h2>Sinh viên</h2></div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>MSSV</th><th>Họ tên</th><th>Lớp</th><th>SĐT</th><th>Tình trạng</th></tr></thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td>{s.mssv}</td>
                  <td>{s.user.name}</td>
                  <td>{s.class.name}</td>
                  <td>{s.phone}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
