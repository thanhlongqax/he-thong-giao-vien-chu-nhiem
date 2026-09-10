import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LeaveForm from "./form";

export default async function PortalLeavePage() {
  const session = await getServerSession(authOptions);
  const rows = await prisma.leaveRequest.findMany({
    where: { studentId: session?.user.studentId || "" },
    orderBy: { createdAt: "desc" }
  });
  return (
    <>
      <div className="topbar"><h2>Đơn nghỉ phép</h2></div>
      <LeaveForm />
      <div className="card" style={{ marginTop: 14 }}>
        {rows.map((l) => (
          <p key={l.id}>{l.fromDate.toISOString().slice(0, 10)} → {l.toDate.toISOString().slice(0, 10)} · {l.status} · {l.reason}</p>
        ))}
      </div>
    </>
  );
}
