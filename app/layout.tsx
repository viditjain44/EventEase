import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventEase",
  description: "Event Planning and Management Tool",
};

// This is the required RootLayout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
