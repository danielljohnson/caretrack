import type { VitalsReading } from "@/lib/types";

export function abnormalFindings(v: VitalsReading): string[] {
  const findings: string[] = [];

  if (v.temperatureF !== undefined) {
    if (v.temperatureF > 100.4) findings.push(`Fever ${v.temperatureF}°F`);
    if (v.temperatureF < 95) findings.push(`Low temp ${v.temperatureF}°F`);
  }
  if (v.pulse !== undefined) {
    if (v.pulse < 50) findings.push(`Low pulse ${v.pulse}`);
    if (v.pulse > 120) findings.push(`High pulse ${v.pulse}`);
  }
  if (v.spo2 !== undefined && v.spo2 < 90) {
    findings.push(`Low SpO2 ${v.spo2}%`);
  }
  if (v.systolic !== undefined) {
    if (v.systolic < 90) findings.push(`Low BP ${v.systolic}/${v.diastolic}`);
    if (v.systolic > 180) findings.push(`High BP ${v.systolic}/${v.diastolic}`);
  }

  return findings;
}

export function isAbnormal(v: VitalsReading): boolean {
  return abnormalFindings(v).length > 0;
}

export function sortNewestFirst(readings: VitalsReading[]): VitalsReading[] {
  return [...readings].sort((a, b) => b.takenAt.localeCompare(a.takenAt));
}

export function latestReading(readings: VitalsReading[]): VitalsReading | undefined {
  return sortNewestFirst(readings)[0];
}
