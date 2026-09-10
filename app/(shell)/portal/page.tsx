import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PortalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user.studentId) redirect("/login");
  const s = await prisma.student.findUnique({
    where: { id: session.user.studentId },
    include: { user: true, class: true }
  });
  if (!s) redirect("/login");
  return (
    <>
      <div className="profile-hero">
        <div className="ava">{s.user.name.slice(-1)}</div>
        <div>
          <div className="muted" style={{ color: "#b7cfc6" }}>{s.class.name}</div>
          <h3>{s.user.name}</h3>
          <p>{s.mssv} · {s.gender}</p>
        </div>
        <span className="badge ok">{s.status}</span>
      </div>
    </>
  );
}
