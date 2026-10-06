import { describe, expect, it } from "vitest";
import { abnormalFindings, isAbnormal, latestReading } from "@/lib/vitals";
import type { VitalsReading } from "@/lib/types";

const base: VitalsReading = {
  id: "v1",
  residentId: "r-101",
  takenAt: "2026-10-06T14:00:00.000Z",
  takenBy: "J. Park",
  temperatureF: 98.2,
  pulse: 72,
  spo2: 97,
  systolic: 124,
  diastolic: 78,
};

describe("abnormalFindings", () => {
  it("treats a normal reading as normal", () => {
    expect(isAbnormal(base)).toBe(false);
  });

  it("flags a fever", () => {
    expect(abnormalFindings({ ...base, temperatureF: 101.2 })).toContain("Fever 101.2°F");
  });

  it("does not flag 100.4, the upper limit of normal", () => {
    expect(isAbnormal({ ...base, temperatureF: 100.4 })).toBe(false);
  });

  it("flags a low pulse", () => {
    expect(abnormalFindings({ ...base, pulse: 44 })).toContain("Low pulse 44");
  });

  it("flags low blood pressure", () => {
    expect(isAbnormal({ ...base, systolic: 85 })).toBe(true);
  });

  it("flags low oxygen", () => {
    expect(isAbnormal({ ...base, spo2: 88 })).toBe(true);
  });
});

describe("latestReading", () => {
  it("returns the most recent reading", () => {
    const older = { ...base, id: "a", takenAt: "2026-10-06T09:00:00.000Z" };
    const newer = { ...base, id: "b", takenAt: "2026-10-06T13:00:00.000Z" };
    expect(latestReading([older, newer])?.id).toBe("b");
  });
});
