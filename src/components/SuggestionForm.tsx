"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import {
	SUGGESTION_LIMITS,
	sanitizeSuggestionPayload,
	validateSuggestionPayload,
	type SuggestionFieldErrors,
} from "@/lib/suggestionValidation";

type FormState = {
	name: string;
	email: string;
	message: string;
};

const INITIAL_FORM_STATE: FormState = {
	name: "",
	email: "",
	message: "",
};

export default function SuggestionForm() {
	const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
	const [fieldErrors, setFieldErrors] = useState<SuggestionFieldErrors>({});
	const [submitError, setSubmitError] = useState<string>("");
	const [submitSuccess, setSubmitSuccess] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const remainingChars = useMemo(
		() => SUGGESTION_LIMITS.MESSAGE_MAX - form.message.length,
		[form.message.length],
	);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitError("");
		setSubmitSuccess("");

		const payload = sanitizeSuggestionPayload(form);
		const validation = validateSuggestionPayload(payload);

		if (!validation.success) {
			setFieldErrors(validation.error.flatten().fieldErrors);
			return;
		}

		setFieldErrors({});
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/suggestion", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const result = (await response.json()) as {
				ok?: boolean;
				message?: string;
				error?: string;
				fieldErrors?: SuggestionFieldErrors;
			};

			if (!response.ok) {
				if (result.fieldErrors) {
					setFieldErrors(result.fieldErrors);
				}
				setSubmitError(
					result.error ||
						"Could not submit your suggestion right now.",
				);
				return;
			}

			setSubmitSuccess(result.message || "Suggestion sent successfully.");
			setForm(INITIAL_FORM_STATE);
		} catch {
			setSubmitError(
				"Network issue while sending suggestion. Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={onSubmit} className="space-y-4" noValidate>
			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-1.5">
					<label
						htmlFor="suggestion-name"
						className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
					>
						Name
					</label>
					<input
						id="suggestion-name"
						type="text"
						value={form.name}
						onChange={(event) =>
							setForm((prev) => ({
								...prev,
								name: event.target.value,
							}))
						}
						className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
						placeholder="Your name"
						autoComplete="name"
						maxLength={SUGGESTION_LIMITS.NAME_MAX}
					/>
					{fieldErrors.name && (
						<p className="text-xs text-destructive">
							{fieldErrors.name}
						</p>
					)}
				</div>

				<div className="space-y-1.5">
					<label
						htmlFor="suggestion-email"
						className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
					>
						Email
					</label>
					<input
						id="suggestion-email"
						type="email"
						value={form.email}
						onChange={(event) =>
							setForm((prev) => ({
								...prev,
								email: event.target.value,
							}))
						}
						className="w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
						placeholder="you@example.com"
						autoComplete="email"
					/>
					{fieldErrors.email && (
						<p className="text-xs text-destructive">
							{fieldErrors.email}
						</p>
					)}
				</div>
			</div>

			<div className="space-y-1.5">
				<label
					htmlFor="suggestion-message"
					className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
				>
					What should we add next?
				</label>
				<textarea
					id="suggestion-message"
					value={form.message}
					onChange={(event) =>
						setForm((prev) => ({
							...prev,
							message: event.target.value,
						}))
					}
					className="min-h-32 w-full resize-y rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
					placeholder="Share your idea for future improvements in Varsiti..."
					maxLength={SUGGESTION_LIMITS.MESSAGE_MAX}
				/>
				<div className="flex items-center justify-between text-xs">
					{fieldErrors.message ? (
						<p className="text-destructive">
							{fieldErrors.message}
						</p>
					) : (
						<p className="text-muted-foreground">
							Minimum {SUGGESTION_LIMITS.MESSAGE_MIN} characters.
						</p>
					)}
					<p
						className={
							remainingChars < 80
								? "text-amber-600 dark:text-amber-400"
								: "text-muted-foreground"
						}
					>
						{remainingChars} left
					</p>
				</div>
			</div>

			{submitError && (
				<p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
					{submitError}
				</p>
			)}
			{submitSuccess && (
				<p className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
					<CheckCircle2 size={16} /> {submitSuccess}
				</p>
			)}

			<button
				type="submit"
				disabled={isSubmitting}
				className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
			>
				{isSubmitting ? (
					<>
						<Loader2 size={15} className="animate-spin" />{" "}
						Sending...
					</>
				) : (
					<>
						<Send size={15} /> Send Suggestion
					</>
				)}
			</button>
		</form>
	);
}
