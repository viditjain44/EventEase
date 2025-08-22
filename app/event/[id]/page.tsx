"use client";

import { useState, useEffect } from "react";

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  // Fetch event details
  useEffect(() => {
    async function fetchEvent() {
      const res = await fetch(`/api/events/${params.id}`);
      const data = await res.json();
      setEvent(data);
      setLoading(false);
    }
    fetchEvent();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, eventId: params.id }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage("🎉 RSVP successful!");
      setForm({ name: "", email: "" });
    } else {
      setMessage("❌ Failed: " + data.error);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-gray-600">{event.description}</p>
      <p className="mt-2">📍 {event.location}</p>
      <p>📅 {new Date(event.date).toLocaleString()}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          RSVP
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
