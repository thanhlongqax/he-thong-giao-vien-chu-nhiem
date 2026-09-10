import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Shell from "./shell";

export default async function ShellLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const cfg = await prisma.academicConfig.findUnique({ where: { id: "current" } });
  return (
    <Shell
      name={session.user.name || ""}
      role={session.user.role}
      year={cfg?.year || ""}
      term={cfg?.term || ""}
      week={cfg?.week || 1}
    >
      {children}
    </Shell>
  );
}
