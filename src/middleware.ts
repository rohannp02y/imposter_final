import { NextRequest, NextResponse } from "next/server";

// The admin panel lives on its own domain. Nested subdomains of vercel.app
// are not possible (TLS covers one level only), so the panel gets a separate
// *.vercel.app domain pointed at this same deployment.
const ADMIN_HOST = process.env.NEXT_PUBLIC_ADMIN_HOST || "nepali-imposter-admin.vercel.app";

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  const { pathname } = req.nextUrl;
  const isAdminHost = host === ADMIN_HOST;
  const isLocalhost = host === "localhost" || host === "127.0.0.1";

  if (isAdminHost) {
    // The admin domain serves only the admin panel. Redirect (not rewrite) so
    // the browser path is /admin and the main-site navbar stays hidden.
    if (!pathname.startsWith("/admin")) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // On the public site the admin panel does not exist.
  // localhost is exempt so the panel can be developed locally.
  if (pathname.startsWith("/admin") && !isLocalhost) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals and any file with an extension (static assets).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
