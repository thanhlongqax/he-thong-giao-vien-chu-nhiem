import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/lib/rbac";
import { writeAudit } from "@/lib/audit";
import { IssueSource, IssueStatus } from "@prisma/client";

export async function GET() {
  const user = await requireSession();
  if (user.role === "STUDENT") {
    return NextResponse.json(await prisma.weeklyReport.findMany({
      where: { studentId: user.studentId || "" },
      orderBy: { createdAt: "desc" }
    }));
  }
  await requireRole("ADMIN", "TEACHER");
  const rows = await prisma.weeklyReport.findMany({
    include: { student: { include: { user: true, class: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const user = await requireSession();
  if (user.role !== "STUDENT" || !user.studentId) {
    return NextResponse.json({ error: "Chỉ sinh viên nộp báo cáo tuần" }, { status: 403 });
  }
  const cfg = await prisma.academicConfig.findUnique({ where: { id: "current" } });
  if (!cfg) return NextResponse.json({ error: "Chưa cấu hình năm học" }, { status: 400 });
  const answers = await req.json();
  try {
    const report = await prisma.weeklyReport.create({
      data: {
        studentId: user.studentId,
        week: cfg.week,
        year: cfg.year,
        term: cfg.term,
        answers
      }
    });
    const absent = Number(answers.ABSENT) || 0;
    const support = String(answers.SUPPORT || "").toLowerCase() === "có";
    if (absent > 2 || support) {
      await prisma.issue.create({
        data: {
          studentId: user.studentId,
          type: absent > 2 ? "Nghiêm trọng" : "Cần hỗ trợ",
          text: answers.SUPPORT_DETAIL || answers.DIFFICULTY_DETAIL || "Từ báo cáo tuần",
          week: cfg.week,
          year: cfg.year,
          term: cfg.term,
          source: IssueSource.weekly_report,
          status: IssueStatus.Pending,
          reported: true,
          reportId: report.id,
          date: new Date()
        }
      });
    }
    await writeAudit(user, "submit_week_report", "report", report.id);
    return NextResponse.json(report);
  } catch {
    return NextResponse.json({ error: "Tuần này đã nộp báo cáo" }, { status: 409 });
  }
}
