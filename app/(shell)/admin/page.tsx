import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [teachers, students, classes, audits] = await Promise.all([
    prisma.teacher.count(),
    prisma.student.count(),
    prisma.class.count(),
    prisma.auditLog.count()
  ]);
  return (
    <>
      <div className="topbar"><h2>Quản trị</h2></div>
      <div className="grid g-4">
        <div className="stat"><div className="k">Giáo viên</div><div className="v">{teachers}</div></div>
        <div className="stat"><div className="k">Sinh viên</div><div className="v">{students}</div></div>
        <div className="stat"><div className="k">Lớp</div><div className="v">{classes}</div></div>
        <div className="stat"><div className="k">Nhật ký</div><div className="v">{audits}</div></div>
      </div>
    </>
  );
}
