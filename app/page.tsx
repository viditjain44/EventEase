"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-bold">Welcome to EventEase 🎉</h1>
      <p className="text-gray-600">Plan and manage events with ease</p>

      <div className="flex gap-4">
        {/* Register Button */}
        <Link
          href="/register"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Register
        </Link>

        {/* Login Button */}
        <Link
          href="/login"
          className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
