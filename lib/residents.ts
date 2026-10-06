import { getResident, listCommunities } from "@/lib/db";
import type { Resident } from "@/lib/types";

// Convenience lookup for when all you have is a resident id.
export async function findResidentById(
  residentId: string,
): Promise<{ communityId: string; resident: Resident } | null> {
  for (const c of listCommunities()) {
    const resident = await getResident(c.id, residentId);
    if (resident) return { communityId: c.id, resident };
  }
  return null;
}
