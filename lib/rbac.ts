import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

export type SessionUser = {
  id: string;
  name?: string | null;
  role: string;
  teacherId: string | null;
  studentId: string | null;
};

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user as SessionUser;
}

export async function requireRole(...roles: string[]) {
  const user = await requireSession();
  if (!roles.includes(user.role)) throw new Error("FORBIDDEN");
  return user;
}

export async function homeroomClassIds(teacherId: string | null) {
  if (!teacherId) return [] as string[];
  const rows = await prisma.class.findMany({
    where: { homeroomTeacherId: teacherId },
    select: { id: true }
  });
  return rows.map((c) => c.id);
}

export async function canAccessClass(user: SessionUser, classId: string) {
  if (user.role === "ADMIN") return true;
  if (user.role !== "TEACHER") return false;
  const ids = await homeroomClassIds(user.teacherId);
  return ids.includes(classId);
}

export async function canAttendClass(user: SessionUser, classId: string, subjectId: string) {
  if (user.role === "ADMIN") return true;
  if (user.role !== "TEACHER" || !user.teacherId) return false;
  if (await canAccessClass(user, classId)) return true;
  const cfg = await prisma.academicConfig.findUnique({ where: { id: "current" } });
  const hit = await prisma.assignment.findFirst({
    where: {
      subjectId,
      year: cfg?.year,
      term: cfg?.term,
      classes: { some: { classId } },
      teachers: { some: { teacherId: user.teacherId } }
    }
  });
  return !!hit;
}
