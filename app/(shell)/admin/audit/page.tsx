import { prisma } from "@/lib/prisma";

export default async function AuditPage() {
  const rows = await prisma.auditLog.findMany({ orderBy: { timestamp: "desc" }, take: 100 });
  return (
    <>
      <div className="topbar"><h2>Nhật ký hệ thống</h2></div>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Thời gian</th><th>Người</th><th>Hành động</th><th>Chi tiết</th></tr></thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>{x.timestamp.toISOString()}</td>
                <td>{x.actorName}</td>
                <td>{x.action}</td>
                <td>{x.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
