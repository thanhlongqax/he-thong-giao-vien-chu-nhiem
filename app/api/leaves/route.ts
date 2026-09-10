import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { homeroomClassIds, requireRole, requireSession } from "@/lib/rbac";
import { writeAudit } from "@/lib/audit";

export async function GET() {
  const user = await requireSession();
  if (user.role === "STUDENT") {
    const rows = await prisma.leaveRequest.findMany({
      where: { studentId: user.studentId || "" },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(rows);
  }
  await requireRole("ADMIN", "TEACHER");
  const classIds = user.role === "ADMIN" ? undefined : await homeroomClassIds(user.teacherId);
  const rows = await prisma.leaveRequest.findMany({
    where: classIds ? { student: { classId: { in: classIds } } } : undefined,
    include: { student: { include: { user: true, class: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const user = await requireSession();
  const body = await req.json();
  const studentId = user.role === "STUDENT" ? user.studentId : body.studentId;
  if (!studentId) return NextResponse.json({ error: "Thiếu sinh viên" }, { status: 400 });
  const row = await prisma.leaveRequest.create({
    data: {
      studentId,
      fromDate: new Date(body.fromDate),
      toDate: new Date(body.toDate),
      session: body.session || "Cả ngày",
      reason: body.reason,
      source: "Form"
    }
  });
  await writeAudit(user, "create_leave", "leave", row.id, body.reason);
  return NextResponse.json(row);
}
