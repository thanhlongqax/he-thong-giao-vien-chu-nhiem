import { prisma } from "./prisma";
import type { SessionUser } from "./rbac";

export async function writeAudit(
  user: SessionUser | null,
  action: string,
  entity: string,
  entityId = "",
  detail = ""
) {
  await prisma.auditLog.create({
    data: {
      actorId: user?.id,
      actorRole: user?.role || "",
      actorName: user?.name || "",
      action,
      entity,
      entityId,
      detail
    }
  });
}
