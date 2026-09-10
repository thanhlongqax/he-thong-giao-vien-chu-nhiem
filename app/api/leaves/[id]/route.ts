import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { writeAudit } from "@/lib/audit";
import { LeaveStatus } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("ADMIN", "TEACHER");
  const { id } = await params;
  const body = await req.json();
  const status = body.status === "Approved" ? LeaveStatus.Approved : LeaveStatus.Rejected;
  const row = await prisma.leaveRequest.update({ where: { id }, data: { status } });
  await writeAudit(user, status === LeaveStatus.Approved ? "approve_leave" : "reject_leave", "leave", id);
  return NextResponse.json(row);
}
