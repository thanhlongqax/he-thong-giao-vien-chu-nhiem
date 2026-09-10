import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/lib/rbac";

export async function GET() {
  await requireSession();
  const cfg = await prisma.academicConfig.findUnique({ where: { id: "current" } });
  return NextResponse.json(cfg);
}

export async function PUT(req: Request) {
  await requireRole("ADMIN");
  const body = await req.json();
  const cfg = await prisma.academicConfig.upsert({
    where: { id: "current" },
    update: {
      year: body.year,
      term: body.term,
      week: Number(body.week) || 1,
      yearStart: body.yearStart ? new Date(body.yearStart) : undefined
    },
    create: {
      id: "current",
      year: body.year || "2025-2026",
      term: body.term || "Học kỳ 1",
      week: Number(body.week) || 1,
      yearStart: new Date(body.yearStart || "2025-09-01")
    }
  });
  return NextResponse.json(cfg);
}
