import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/event/",              // public event page
  "/api/rsvp",            // public RSVP post
  "/api/public/events/",  // any other public APIs you created
  "/_next", "/favicon.ico", "/images"
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  // Require auth for the rest (adjust to your app needs)
  const token = req.cookies.get("token")?.value;
  if (!token) {
    // redirect to login for pages, or 401 for APIs
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/public).*)"], // let truly public API live under /api/public
};
