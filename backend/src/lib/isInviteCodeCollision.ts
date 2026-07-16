export function isInviteCodeCollision(error: unknown): boolean {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error) ||
    error.code !== "P2002"
  ) {
    return false;
  }

  if (!("meta" in error)) {
    return false;
  }

  const meta = error.meta;

  if (typeof meta !== "object" || meta === null || !("target" in meta)) {
    return false;
  }

  const target = meta.target;

  return Array.isArray(target) && target.includes("inviteCode");
}
