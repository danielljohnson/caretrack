import type { Community, Resident, VitalsReading } from "@/lib/types";

export type CommunityDb = {
  community: Community;
  residents: Resident[];
  vitals: VitalsReading[];
};

// Small deterministic PRNG so the seed looks the same on every run.
function prng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const FIRST = ["Margaret", "Harold", "Dorothy", "Walter", "Ruth", "Eugene", "Betty", "Frank", "Helen", "George", "Mildred", "Arthur", "Evelyn", "Raymond", "Lois", "Clarence", "Jean", "Howard", "Shirley", "Albert"];
const LAST = ["H.", "B.", "K.", "M.", "S.", "T.", "W.", "R.", "L.", "P.", "D.", "G.", "C.", "F.", "N."];
const STAFF = ["J. Park", "A. Ruiz", "T. Okafor", "L. Chen", "M. Brooks"];

function buildCommunity(community: Community, residentCount: number, seed: number): CommunityDb {
  const rand = prng(seed);
  const now = Date.now();
  const residents: Resident[] = [];
  const vitals: VitalsReading[] = [];

  for (let i = 0; i < residentCount; i++) {
    // Each community database numbers its residents from 101.
    const id = `r-${101 + i}`;
    let status = "active";
    if (i % 23 === 7) status = "discharged";
    else if (i % 31 === 12) status = "hospital";

    residents.push({
      id,
      name: `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`,
      room: String(100 + Math.floor(i / 2) + 1) + (i % 2 === 0 ? "A" : "B"),
      status,
    });

    const skipsRecent = i % 17 === 5; // a few residents have nothing in the last ~14h
    for (let k = 0; k < 10; k++) {
      const hoursAgo = k * 4 + rand() * 1.5;
      if (skipsRecent && hoursAgo < 14) continue;

      const abnormal = rand() < 0.08;
      const r: VitalsReading = {
        id: `${id}-v${k}`,
        residentId: id,
        takenAt: new Date(now - hoursAgo * 3600_000).toISOString(),
        takenBy: STAFF[Math.floor(rand() * STAFF.length)],
        temperatureF: Math.round((97.2 + rand() * 1.8) * 10) / 10,
        pulse: Math.round(60 + rand() * 35),
        spo2: Math.round(94 + rand() * 5),
        systolic: Math.round(110 + rand() * 35),
        diastolic: Math.round(65 + rand() * 20),
      };

      if (abnormal) {
        const which = Math.floor(rand() * 5);
        if (which === 0) r.temperatureF = 100.4; // right on the line
        if (which === 1) r.temperatureF = 101.6;
        if (which === 2) r.spo2 = 91;
        if (which === 3) r.pulse = 128;
        if (which === 4) r.systolic = 86;
      }

      vitals.push(r);
    }
  }

  return { community, residents, vitals };
}

export function buildSeed(): Map<string, CommunityDb> {
  const dbs = new Map<string, CommunityDb>();
  dbs.set(
    "oak-ridge",
    buildCommunity({ id: "oak-ridge", name: "Oak Ridge Senior Living", timezone: "America/Chicago" }, 120, 42),
  );
  dbs.set(
    "harbor-view",
    buildCommunity({ id: "harbor-view", name: "Harbor View Assisted Living", timezone: "America/Los_Angeles" }, 35, 7),
  );
  return dbs;
}
