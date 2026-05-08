import { z } from "zod";

export const SUGGESTION_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 1000,
};

function stripControlCharacters(value: string) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

export const suggestionSchema = z.object({
  name: z
    .string()
    .transform(stripControlCharacters)
    .pipe(
      z
        .string()
        .min(SUGGESTION_LIMITS.NAME_MIN)
        .max(SUGGESTION_LIMITS.NAME_MAX)
        .regex(/^[\p{L}\p{N}\s.'-]+$/u, "Name contains unsupported characters."),
    ),
  email: z.string().transform((value) => value.trim().toLowerCase()).pipe(z.string().email().max(254)),
  message: z
    .string()
    .transform(stripControlCharacters)
    .pipe(z.string().min(SUGGESTION_LIMITS.MESSAGE_MIN).max(SUGGESTION_LIMITS.MESSAGE_MAX)),
});

export type SuggestionFieldErrors = z.inferFlattenedErrors<typeof suggestionSchema>["fieldErrors"];

export const validateSuggestionPayload = (data: unknown) => {
  return suggestionSchema.safeParse(data);
};

export const sanitizeSuggestionPayload = (data: Partial<Record<"name" | "email" | "message", string>>) => {
  return {
    name: stripControlCharacters(data.name || ""),
    email: (data.email || "").trim().toLowerCase(),
    message: stripControlCharacters(data.message || ""),
  };
};