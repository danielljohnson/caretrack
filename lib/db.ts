import { buildSeed, type CommunityDb } from "@/data/seed";
import type { Community, Resident, VitalsReading } from "@/lib/types";

// Each community has its own database (single-tenant). This module simulates
// that with one in-memory store per community. Every call pays a simulated
// round trip, roughly what we see against SQL Server in production.
const LATENCY_MS = 20;

const g = globalThis as unknown as { __caretrackDbs?: Map<string, CommunityDb> };
const dbs: Map<string, CommunityDb> = g.__caretrackDbs ?? (g.__caretrackDbs = buildSeed());

const roundTrip = () => new Promise((r) => setTimeout(r, LATENCY_MS));

function dbFor(communityId: string): CommunityDb {
  const db = dbs.get(communityId);
  if (!db) throw new Error(`Unknown community: ${communityId}`);
  return db;
}

export function listCommunities(): Community[] {
  return [...dbs.values()].map((d) => d.community);
}

export async function getCommunity(communityId: string): Promise<Community | null> {
  await roundTrip();
  return dbs.get(communityId)?.community ?? null;
}

export async function getResidents(communityId: string): Promise<Resident[]> {
  await roundTrip();
  return [...dbFor(communityId).residents];
}

export async function getResident(communityId: string, residentId: string): Promise<Resident | null> {
  await roundTrip();
  return dbFor(communityId).residents.find((r) => r.id === residentId) ?? null;
}

export async function getVitalsForResident(communityId: string, residentId: string): Promise<VitalsReading[]> {
  await roundTrip();
  return dbFor(communityId).vitals.filter((v) => v.residentId === residentId);
}

// Returns all readings for the community taken at or after `sinceIso`.
export async function getVitalsSince(communityId: string, sinceIso: string): Promise<VitalsReading[]> {
  await roundTrip();
  return dbFor(communityId).vitals.filter((v) => v.takenAt >= sinceIso);
}

export async function insertVitals(communityId: string, reading: VitalsReading): Promise<void> {
  await roundTrip();
  dbFor(communityId).vitals.push(reading);
}
