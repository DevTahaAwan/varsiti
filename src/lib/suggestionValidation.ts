import { z } from "zod";

export const SUGGESTION_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 1000,
};

export const suggestionSchema = z.object({
  name: z.string().min(SUGGESTION_LIMITS.NAME_MIN).max(SUGGESTION_LIMITS.NAME_MAX),
  email: z.string().email(),
  message: z.string().min(SUGGESTION_LIMITS.MESSAGE_MIN).max(SUGGESTION_LIMITS.MESSAGE_MAX),
});

export type SuggestionFieldErrors = z.inferFlatErrors<typeof suggestionSchema>['fieldErrors'];

export const validateSuggestionPayload = (data: unknown) => {
  return suggestionSchema.safeParse(data);
};

export const sanitizeSuggestionPayload = (data: any) => {
  return {
    name: data.name?.trim(),
    email: data.email?.trim().toLowerCase(),
    message: data.message?.trim(),
  };
};
