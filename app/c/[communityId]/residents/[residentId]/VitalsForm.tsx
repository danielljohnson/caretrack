"use client";

import { useEffect, useState, type FormEvent } from "react";

function localNowForInput(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

export default function VitalsForm({ communityId, residentId }: { communityId: string; residentId: string }) {
  const [takenAt, setTakenAt] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => setTakenAt(localNowForInput()), []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch(`/api/c/${communityId}/vitals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ residentId, takenBy: "J. Park", ...Object.fromEntries(form) }),
    });
    setStatus("Saved");
  }

  return (
    <form className="vitals" onSubmit={onSubmit}>
      <label>
        Taken at
        <input type="datetime-local" name="takenAt" value={takenAt} onChange={(e) => setTakenAt(e.target.value)} />
      </label>
      <label>
        Temperature (°F)
        <input name="temperatureF" inputMode="decimal" />
      </label>
      <label>
        Pulse
        <input name="pulse" inputMode="numeric" />
      </label>
      <label>
        SpO2 (%)
        <input name="spo2" inputMode="numeric" />
      </label>
      <label>
        Systolic
        <input name="systolic" inputMode="numeric" />
      </label>
      <label>
        Diastolic
        <input name="diastolic" inputMode="numeric" />
      </label>
      <div className="actions">
        <button type="submit">Save vitals</button>
        {status && <span className="muted">{status}</span>}
      </div>
    </form>
  );
}
