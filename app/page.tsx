import Link from "next/link";
import { listCommunities } from "@/lib/db";

export default function Home() {
  const communities = listCommunities();
  return (
    <>
      <h1>CareTrack Vitals</h1>
      <p className="sub">Choose a community</p>
      <div className="card">
        <table>
          <tbody>
            {communities.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link href={`/c/${c.id}`}>{c.name}</Link>
                </td>
                <td className="muted">{c.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
