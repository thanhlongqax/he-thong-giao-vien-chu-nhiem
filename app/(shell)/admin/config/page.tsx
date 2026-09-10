import { prisma } from "@/lib/prisma";

export default async function ConfigPage() {
  const cfg = await prisma.academicConfig.findUnique({ where: { id: "current" } });
  return (
    <>
      <div className="topbar"><h2>Cấu hình năm học</h2></div>
      <div className="card">
        <p>Năm: <b>{cfg?.year}</b></p>
        <p>Kỳ: <b>{cfg?.term}</b></p>
        <p>Tuần: <b>{cfg?.week}</b></p>
        <p className="muted">Cập nhật qua PUT /api/config (quyền ADMIN).</p>
      </div>
    </>
  );
}
