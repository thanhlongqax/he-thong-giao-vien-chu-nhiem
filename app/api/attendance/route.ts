import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAttendClass, requireRole } from "@/lib/rbac";
import { writeAudit } from "@/lib/audit";

export async function GET(req: Request) {
  const user = await requireRole("ADMIN", "TEACHER");
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const day = searchParams.get("day");
  const slots = await prisma.schedule.findMany({
    where: day ? { day } : undefined,
    include: { subject: true, class: true }
  });
  const allowed = [];
  for (const s of slots) {
    if (await canAttendClass(user, s.classId, s.subjectId)) allowed.push(s);
  }
  const records = date
    ? await prisma.attendance.findMany({
        where: { date: new Date(date) },
        include: { student: { include: { user: true } } }
      })
    : [];
  return NextResponse.json({ slots: allowed, records });
}

export async function POST(req: Request) {
  const user = await requireRole("ADMIN", "TEACHER");
  const body = await req.json();
  const sch = await prisma.schedule.findUnique({ where: { id: body.scheduleId } });
  if (!sch) return NextResponse.json({ error: "Không có tiết" }, { status: 404 });
  if (!(await canAttendClass(user, sch.classId, sch.subjectId))) {
    return NextResponse.json({ error: "Không có quyền điểm danh tiết này" }, { status: 403 });
  }
  const cfg = await prisma.academicConfig.findUnique({ where: { id: "current" } });
  const date = new Date(body.date);
  for (const row of body.rows as { studentId: string; status: string; note?: string }[]) {
    await prisma.attendance.upsert({
      where: { studentId_scheduleId_date: { studentId: row.studentId, scheduleId: sch.id, date } },
      update: { status: row.status, note: row.note || "" },
      create: {
        studentId: row.studentId,
        scheduleId: sch.id,
        subjectId: sch.subjectId,
        date,
        status: row.status,
        note: row.note || "",
        year: cfg?.year || "",
        term: cfg?.term || "",
        week: cfg?.week || 1
      }
    });
  }
  await writeAudit(user, "save_attendance", "attendance", sch.id, body.date);
  return NextResponse.json({ ok: true });
}
