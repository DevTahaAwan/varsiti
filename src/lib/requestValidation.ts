import "server-only";

import { NextResponse } from "next/server";
import { z } from "zod";

type ParseOptions = {
  maxBytes?: number;
};

type ParseJsonResult<T extends z.ZodTypeAny> =
  | { success: true; data: z.infer<T> }
  | { success: false; response: NextResponse };

function validationMessage(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) return "Invalid request payload.";
  const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
  return `${path}${issue.message}`;
}

export async function parseJsonRequest<T extends z.ZodTypeAny>(
  request: Request,
  schema: T,
  options: ParseOptions = {},
): Promise<ParseJsonResult<T>> {
  const maxBytes = options.maxBytes ?? 64 * 1024;
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return {
      success: false,
      response: NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 }),
    };
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return {
      success: false,
      response: NextResponse.json({ error: "Request body is too large." }, { status: 413 }),
    };
  }

  let rawBody = "";
  try {
    rawBody = await request.text();
  } catch {
    return {
      success: false,
      response: NextResponse.json({ error: "Could not read request body." }, { status: 400 }),
    };
  }

  if (rawBody.length > maxBytes) {
    return {
      success: false,
      response: NextResponse.json({ error: "Request body is too large." }, { status: 413 }),
    };
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return {
      success: false,
      response: NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 }),
    };
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return {
      success: false,
      response: NextResponse.json({ error: validationMessage(parsed.error) }, { status: 400 }),
    };
  }

  return { success: true, data: parsed.data };
}