import { NextResponse } from "next/server";
import { insertVitals } from "@/lib/db";
import { findResidentById } from "@/lib/residents";
import type { VitalsReading } from "@/lib/types";

export async function POST(req: Request, { params }: { params: { communityId: string } }) {
  try {
    const body = await req.json();

    const found = await findResidentById(body.residentId);
    if (!found) {
      return NextResponse.json({ error: "Resident not found" }, { status: 404 });
    }

    const reading: VitalsReading = {
      id: crypto.randomUUID(),
      residentId: found.resident.id,
      takenAt: body.takenAt,
      takenBy: body.takenBy ?? "unknown",
      temperatureF: body.temperatureF,
      pulse: body.pulse,
      spo2: body.spo2,
      systolic: body.systolic,
      diastolic: body.diastolic,
    };

    await insertVitals(found.communityId, reading);
    return NextResponse.json(reading, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save vitals" }, { status: 500 });
  }
}
