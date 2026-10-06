import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommunity, getResidents, getVitalsForResident } from "@/lib/db";
import { abnormalFindings, latestReading } from "@/lib/vitals";
import { formatTime, startOfToday } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function CommunityPage({ params }: { params: { communityId: string } }) {
  const community = await getCommunity(params.communityId);
  if (!community) notFound();

  const residents = (await getResidents(community.id)).filter((r) => r.status !== "Discharged");

  const rows = [];
  for (const resident of residents) {
    const vitals = await getVitalsForResident(community.id, resident.id);
    const latest = latestReading(vitals);
    const takenToday = vitals.filter((v) => new Date(v.takenAt) >= startOfToday()).length;
    rows.push({ resident, latest, takenToday });
  }

  return (
    <>
      <p className="sub">
        <Link href="/">All communities</Link>
      </p>
      <h1>{community.name}</h1>
      <p className="sub">{residents.length} residents</p>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Room</th>
              <th>Latest vitals</th>
              <th>Status</th>
              <th>Readings today</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ resident, latest, takenToday }) => {
              const findings = latest ? abnormalFindings(latest) : [];
              return (
                <tr key={resident.id}>
                  <td>
                    <Link href={`/c/${community.id}/residents/${resident.id}`}>{resident.name}</Link>
                  </td>
                  <td>{resident.room}</td>
                  <td className="muted">{latest ? formatTime(latest.takenAt, community.timezone) : "None"}</td>
                  <td>
                    {findings.length === 0 ? (
                      <span className="badge ok">Normal</span>
                    ) : (
                      findings.map((f) => (
                        <span key={f} className="badge bad">
                          {f}
                        </span>
                      ))
                    )}
                  </td>
                  <td>{takenToday}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
