import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/rateLimit";
import { getClerkWebhookSecret, ServerConfigurationError } from "@/lib/serverEnv";
import { logApiError, logSecurityEvent } from "@/lib/securityLogger";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = getClientIp(req);

  try {
    const limit = checkRateLimit("webhook:clerk:ip", [ip], 60, 60000);
    if (!limit.success) {
      logSecurityEvent("clerk_webhook_rate_limited", req, { ip }, "warn");
      return new Response("Too many requests", { status: 429, headers: rateLimitHeaders(limit) });
    }

    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      logSecurityEvent("clerk_webhook_missing_svix_headers", req, { ip }, "warn");
      return new Response("Bad request", { status: 400 });
    }

    const body = await req.text();
    const webhook = new Webhook(getClerkWebhookSecret());

    let event: WebhookEvent;
    try {
      event = webhook.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (error) {
      logSecurityEvent(
        "clerk_webhook_verification_failed",
        req,
        { ip, errorMessage: error instanceof Error ? error.message : String(error) },
        "warn",
      );
      return new Response("Bad request", { status: 400 });
    }

    if (event.type === "user.created" || event.type === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;

      const email = email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : "";
      const fullName = [first_name, last_name].filter(Boolean).join(" ");

      const { error } = await getSupabaseAdmin()
        .from("users")
        .upsert(
          {
            id,
            email,
            full_name: fullName,
            avatar_url: image_url,
          },
          { onConflict: "id" },
        );

      if (error) {
        logApiError("clerk_webhook_user_upsert_failed", error, req, { clerkUserId: id, eventType: event.type });
        return new Response("Server error", { status: 500 });
      }

      logSecurityEvent("clerk_user_synced", req, { clerkUserId: id, eventType: event.type });
    }

    return new Response("", { status: 200 });
  } catch (error: unknown) {
    logApiError("clerk_webhook_error", error, req, { ip });
    return new Response(error instanceof ServerConfigurationError ? "Server configuration error" : "Server error", {
      status: 500,
    });
  }
}