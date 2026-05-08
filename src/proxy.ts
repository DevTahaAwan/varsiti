import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getClientIp, rateLimit, rateLimitHeaders } from "@/lib/rateLimit";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about(.*)",
  "/api/webhooks/clerk(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isAuthPage = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const ip = getClientIp(req);
  const trafficLimit = rateLimit(`traffic:${ip}`, 300, 60000);

  if (!trafficLimit.success) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: rateLimitHeaders(trafficLimit) },
    );
  }

  if (isAuthPage(req)) {
    const authPageLimit = rateLimit(`auth-page:${ip}`, 60, 60000);
    if (!authPageLimit.success) {
      return NextResponse.json(
        { error: "Too many authentication requests." },
        { status: 429, headers: rateLimitHeaders(authPageLimit) },
      );
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};