import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { homeroomClassIds, requireRole } from "@/lib/rbac";
import { writeAudit } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const user = await requireRole("ADMIN", "TEACHER");
    const where = user.role === "ADMIN"
      ? {}
      : { classId: { in: await homeroomClassIds(user.teacherId) } };
    const rows = await prisma.student.findMany({
      where,
      include: { user: { select: { name: true, username: true } }, class: true },
      orderBy: { mssv: "asc" }
    });
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireRole("ADMIN", "TEACHER");
    const body = await req.json();
    const hash = await bcrypt.hash(body.password || "123456", 12);
    const acc = await prisma.user.create({
      data: {
        username: String(body.username || body.mssv).toLowerCase(),
        passwordHash: hash,
        name: body.name,
        role: "STUDENT"
      }
    });
    const st = await prisma.student.create({
      data: {
        userId: acc.id,
        mssv: String(body.mssv).toUpperCase(),
        classId: body.classId,
        gender: body.gender || "Nam",
        dob: body.dob ? new Date(body.dob) : null,
        phone: body.phone || "",
        father: body.father || "",
        fatherPhone: body.fatherPhone || "",
        mother: body.mother || "",
        motherPhone: body.motherPhone || "",
        addrThuongTru: body.addrThuongTru || "",
        addrCuTru: body.addrCuTru || "",
        status: body.status || "Đang học",
        officer: body.officer || "Không"
      }
    });
    await writeAudit(user, "create_student", "student", st.id, st.mssv);
    return NextResponse.json(st);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
