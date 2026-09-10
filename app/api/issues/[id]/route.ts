import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { writeAudit } from "@/lib/audit";
import { IssueStatus } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("ADMIN", "TEACHER");
  const { id } = await params;
  const body = await req.json();
  const map: Record<string, IssueStatus> = {
    Pending: IssueStatus.Pending,
    "In Progress": IssueStatus.InProgress,
    InProgress: IssueStatus.InProgress,
    Resolved: IssueStatus.Resolved
  };
  const status = map[body.status];
  if (!status) return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
  const row = await prisma.issue.update({ where: { id }, data: { status } });
  await writeAudit(user, "update_issue", "issue", id, body.status);
  return NextResponse.json(row);
}
