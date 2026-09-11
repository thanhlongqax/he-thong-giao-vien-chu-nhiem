import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/lib/rbac";
import { ACADEMIC_CONFIG_KEY, ACADEMIC_CONFIG_TTL, redis } from "@/lib/redis";

export async function GET() {
  await requireSession();
  if (redis) {
    const cached = await redis.get(ACADEMIC_CONFIG_KEY);
    if (cached) return NextResponse.json(cached);
  }
  const cfg = await prisma.academicConfig.findUnique({ where: { id: "current" } });
  if (cfg && redis) {
    await redis.set(ACADEMIC_CONFIG_KEY, cfg, { ex: ACADEMIC_CONFIG_TTL });
  }
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
  if (redis) {
    await redis.set(ACADEMIC_CONFIG_KEY, cfg, { ex: ACADEMIC_CONFIG_TTL });
  }
  return NextResponse.json(cfg);
}
