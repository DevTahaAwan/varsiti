import "server-only";

export class ServerConfigurationError extends Error {
  constructor(readonly variableName: string) {
    super(`Missing required server environment variable: ${variableName}`);
    this.name = "ServerConfigurationError";
  }
}

function required(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new ServerConfigurationError(name);
  }
  return value;
}

export function getSupabaseAdminEnv() {
  return {
    supabaseUrl: required("NEXT_PUBLIC_SUPABASE_URL"),
    serviceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function getOpenRouterEnv() {
  return {
    openRouterApiKey: required("OPENROUTER_API_KEY"),
    appUrl: getAppUrl(),
  };
}

export function getEmailJsEnv() {
  return {
    serviceId: required("EMAILJS_SERVICE_ID"),
    templateId: required("EMAILJS_TEMPLATE_ID"),
    publicKey: required("EMAILJS_PUBLIC_KEY"),
    privateKey: required("EMAILJS_PRIVATE_KEY"),
    appUrl: getAppUrl(),
  };
}

export function getClerkWebhookSecret() {
  return required("CLERK_WEBHOOK_SECRET");
}

export function getAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://varsiti.xyz";

  try {
    return new URL(appUrl).origin;
  } catch {
    throw new ServerConfigurationError("NEXT_PUBLIC_APP_URL");
  }
}