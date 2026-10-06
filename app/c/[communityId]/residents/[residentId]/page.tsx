import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommunity, getResident, getVitalsForResident } from "@/lib/db";
import { abnormalFindings, sortNewestFirst } from "@/lib/vitals";
import { formatTime } from "@/lib/time";
import VitalsForm from "./VitalsForm";

export const dynamic = "force-dynamic";

export default async function ResidentPage({
  params,
}: {
  params: { communityId: string; residentId: string };
}) {
  const community = await getCommunity(params.communityId);
  if (!community) notFound();
  const resident = await getResident(community.id, params.residentId);
  if (!resident) notFound();

  const vitals = sortNewestFirst(await getVitalsForResident(community.id, resident.id));

  return (
    <>
      <p className="sub">
        <Link href={`/c/${community.id}`}>{community.name}</Link>
      </p>
      <h1>{resident.name}</h1>
      <p className="sub">
        Room {resident.room} · {resident.status}
      </p>

      <div className="card">
        <VitalsForm communityId={community.id} residentId={resident.id} />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Taken</th>
              <th>Temp</th>
              <th>Pulse</th>
              <th>SpO2</th>
              <th>BP</th>
              <th>Findings</th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            {vitals.map((v) => (
              <tr key={v.id}>
                <td>{formatTime(v.takenAt, community.timezone)}</td>
                <td>{v.temperatureF}</td>
                <td>{v.pulse}</td>
                <td>{v.spo2}</td>
                <td>
                  {v.systolic}/{v.diastolic}
                </td>
                <td>
                  {abnormalFindings(v).map((f) => (
                    <span key={f} className="badge bad">
                      {f}
                    </span>
                  ))}
                </td>
                <td className="muted">{v.takenBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
