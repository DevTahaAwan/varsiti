import type { NextConfig } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://varsiti.xyz";

function getProductionHost() {
  try {
    return new URL(appUrl).host;
  } catch {
    return "varsiti.xyz";
  }
}

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://img.clerk.com https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.varsiti.xyz https://*.clerk.accounts.dev https://*.clerk.dev https://*.clerk.com https://challenges.cloudflare.com",
  "connect-src 'self' https://*.supabase.co https://clerk.varsiti.xyz https://*.clerk.accounts.dev https://*.clerk.dev https://*.clerk.com https://api.emailjs.com https://api.openrouter.ai",
  "frame-src https://*.clerk.accounts.dev https://*.clerk.dev https://*.clerk.com https://challenges.cloudflare.com",
  "worker-src 'self' blob: https://clerk.varsiti.xyz https://*.clerk.accounts.dev https://*.clerk.dev https://*.clerk.com",
  "media-src 'self' blob:",
  process.env.NODE_ENV === "production" ? "upgrade-insecure-requests" : "",
].filter(Boolean);

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value:
      process.env.NODE_ENV === "production"
        ? "max-age=63072000; includeSubDomains; preload"
        : "max-age=0",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Content-Security-Policy", value: cspDirectives.join("; ") },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: `https://${getProductionHost()}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;