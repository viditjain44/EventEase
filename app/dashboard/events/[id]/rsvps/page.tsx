"use client";

import { useEffect, useState } from "react";

export default function RSVPsPage({ params }: { params: { id: string } }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/events/${params.id}/rsvps`, { cache: "no-store" });
      const data = await res.json();
      setRows(data);
      setLoading(false);
    })();
  }, [params.id]);

  if (loading) return <p className="p-4">Loading RSVPs…</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Attendees</h1>
        <a
          href={`/api/events/${params.id}/rsvps/export`}
          className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Export CSV
        </a>
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">RSVP Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.email}</td>
                <td className="px-3 py-2">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={3}>
                  No RSVPs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
