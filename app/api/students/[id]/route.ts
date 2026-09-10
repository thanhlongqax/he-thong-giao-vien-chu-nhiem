import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { writeAudit } from "@/lib/audit";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole("ADMIN", "TEACHER");
    const { id } = await params;
    const body = await req.json();
    const st = await prisma.student.update({
      where: { id },
      data: {
        gender: body.gender,
        phone: body.phone,
        father: body.father,
        fatherPhone: body.fatherPhone,
        mother: body.mother,
        motherPhone: body.motherPhone,
        addrThuongTru: body.addrThuongTru,
        addrCuTru: body.addrCuTru,
        status: body.status,
        officer: body.officer,
        classId: body.classId,
        user: body.name ? { update: { name: body.name } } : undefined
      }
    });
    await writeAudit(user, "update_student", "student", id, st.mssv);
    return NextResponse.json(st);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole("ADMIN", "TEACHER");
    const { id } = await params;
    const st = await prisma.student.delete({ where: { id } });
    await writeAudit(user, "delete_student", "student", id, st.mssv);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
