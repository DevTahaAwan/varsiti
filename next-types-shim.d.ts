export {};

declare global {
	type AppRoutes =
		| "/"
		| "/about"
		| "/sign-in/[[...sign-in]]"
		| "/sign-up/[[...sign-up]]"
		| "/study/[week]";
	type AppRouteHandlerRoutes = "/api/chat" | "/api/evaluate";
	type PageRoutes = never;
	type LayoutRoutes = "/";
	type RedirectRoutes = never;
	type RewriteRoutes = never;
	type Routes =
		| AppRoutes
		| PageRoutes
		| LayoutRoutes
		| RedirectRoutes
		| RewriteRoutes
		| AppRouteHandlerRoutes;

	interface ParamMap {
		"/": Record<string, never>;
		"/about": Record<string, never>;
		"/api/chat": Record<string, never>;
		"/api/evaluate": Record<string, never>;
		"/sign-in/[[...sign-in]]": { "sign-in"?: string[] };
		"/sign-up/[[...sign-up]]": { "sign-up"?: string[] };
		"/study/[week]": { week: string };
	}

	interface LayoutSlotMap {
		"/": never;
	}
}
