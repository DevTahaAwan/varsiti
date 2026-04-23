"use client";

import { useEffect, useRef, useState } from "react";

type CursorType =
	| "default"
	| "pointer"
	| "text"
	| "grab"
	| "grabbing"
	| "ns-resize"
	| "ew-resize"
	| "not-allowed"
	| "wait"
	| "help"
	| "copy"
	| "crosshair";

// Walk up the DOM tree to figure out what cursor state to show
function detectCursorType(el: Element | null, isDown: boolean): CursorType {
	if (!el) return "default";
	let node: Element | null = el;
	while (node) {
		if (!(node instanceof HTMLElement)) {
			node = node.parentElement;
			continue;
		}
		const h = node as HTMLElement;
		const tag = h.tagName.toLowerCase();
		const role = h.getAttribute("role") || "";
		const dc = h.dataset.cursor as CursorType | undefined;
		if (dc) return dc;
		if (
			h.hasAttribute("disabled") ||
			h.getAttribute("aria-disabled") === "true"
		)
			return "not-allowed";
		if (tag === "a" && h.hasAttribute("href")) return "pointer";
		if (tag === "button") return "pointer";
		if (
			[
				"button",
				"link",
				"menuitem",
				"option",
				"tab",
				"checkbox",
				"radio",
				"combobox",
			].includes(role)
		)
			return "pointer";
		if (tag === "select") return "pointer";
		if (tag === "input") {
			const t = (h as HTMLInputElement).type?.toLowerCase() || "text";
			if (
				[
					"text",
					"email",
					"password",
					"number",
					"search",
					"tel",
					"url",
					"",
				].includes(t)
			)
				return "text";
			if (
				[
					"submit",
					"button",
					"checkbox",
					"radio",
					"image",
					"file",
				].includes(t)
			)
				return "pointer";
		}
		if (tag === "textarea") return "text";
		if (h.contentEditable === "true") return "text";
		if (h.draggable) return isDown ? "grabbing" : "grab";

		const cls = typeof h.className === "string" ? h.className : "";
		if (/\b(ns-resize|row-resize)\b/.test(cls)) return "ns-resize";
		if (/\b(ew-resize|col-resize)\b/.test(cls)) return "ew-resize";
		if (/\bcursor-grab\b/.test(cls)) return isDown ? "grabbing" : "grab";
		if (/\bcursor-crosshair\b/.test(cls)) return "crosshair";
		if (/\bcursor-not-allowed\b/.test(cls)) return "not-allowed";
		if (/\bcursor-help\b/.test(cls)) return "help";
		if (/\bcursor-copy\b/.test(cls)) return "copy";
		if (/\bcursor-wait\b/.test(cls)) return "wait";
		node = node.parentElement;
	}
	return "default";
}

// Each cursor shape as a small 24×24 SVG
function CursorShape({ type }: { type: CursorType }) {
	const base = {
		fill: "var(--primary)",
		stroke: "white",
		strokeWidth: "1.5",
		strokeLinejoin: "round" as const,
	};
	const props = {
		width: 36,
		height: 36,
		viewBox: "0 0 24 24",
		xmlns: "http://www.w3.org/2000/svg",
		style: { imageRendering: "pixelated" as const, display: "block" },
	};

	switch (type) {
		case "pointer":
			return (
				<svg {...props}>
					{/* Hand with pointing index finger */}
					<path
						d="M9 15 L9 7.5 Q9 6.5 10 6.5 Q11 6.5 11 7.5 L11 10.5 Q11.5 9.8 12.2 9.8 Q13 9.8 13 10.8 L13 11.2 Q13.5 10.5 14.2 10.5 Q15 10.5 15 11.5 L15 12.2 Q15.5 11.8 16 11.8 Q17 11.8 17 12.8 L17 16 Q17 19 14 19 L11 19 Q8.5 19 8.5 16.5 L8.5 15 Z"
						{...base}
					/>
				</svg>
			);
		case "text":
			return (
				<svg {...props}>
					{/* I-beam */}
					<path
						d="M8 4 L16 4 M12 4 L12 20 M8 20 L16 20"
						fill="none"
						stroke="var(--primary)"
						strokeWidth="3"
						strokeLinecap="round"
					/>
					<path
						d="M8 4 L16 4 M12 4 L12 20 M8 20 L16 20"
						fill="none"
						stroke="white"
						strokeWidth="1"
						strokeLinecap="round"
					/>
				</svg>
			);
		case "grab":
			return (
				<svg {...props}>
					{/* Open hand */}
					<path
						d="M8 16 L8 9 Q8 8 9 8 Q10 8 10 9 L10 7 Q10 6 11 6 Q12 6 12 7 L12 6.5 Q12 5.5 13 5.5 Q14 5.5 14 6.5 L14 8 Q14 7 15 7 Q16 7 16 8 L16 14 L15.5 17 Q15 19 12 19 L10 19 Q7 19 7 16.5 L8 16 Z"
						{...base}
					/>
				</svg>
			);
		case "grabbing":
			return (
				<svg {...props}>
					{/* Closed fist */}
					<path
						d="M7 14 L7 11 Q7 9 10 9 L15 9 Q17 9 17 11 L17 14 Q17 18 13 18 L10 18 Q7 18 7 14 Z"
						{...base}
					/>
					<path
						d="M7 11 L17 11"
						stroke="white"
						strokeWidth="1"
						fill="none"
					/>
				</svg>
			);
		case "ns-resize":
			return (
				<svg {...props}>
					<path
						d="M12 2 L8.5 7 L11 7 L11 17 L8.5 17 L12 22 L15.5 17 L13 17 L13 7 L15.5 7 Z"
						{...base}
					/>
				</svg>
			);
		case "ew-resize":
			return (
				<svg {...props}>
					<path
						d="M2 12 L7 8.5 L7 11 L17 11 L17 8.5 L22 12 L17 15.5 L17 13 L7 13 L7 15.5 Z"
						{...base}
					/>
				</svg>
			);
		case "not-allowed":
			return (
				<svg {...props}>
					<circle
						cx="12"
						cy="12"
						r="8.5"
						fill="none"
						stroke="var(--primary)"
						strokeWidth="2.5"
					/>
					<line
						x1="5.5"
						y1="18.5"
						x2="18.5"
						y2="5.5"
						stroke="var(--primary)"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>
					<circle
						cx="12"
						cy="12"
						r="8.5"
						fill="none"
						stroke="white"
						strokeWidth="0.75"
					/>
					<line
						x1="5.5"
						y1="18.5"
						x2="18.5"
						y2="5.5"
						stroke="white"
						strokeWidth="0.75"
						strokeLinecap="round"
					/>
				</svg>
			);
		case "wait":
			return (
				<svg {...props}>
					<circle
						cx="12"
						cy="12"
						r="8.5"
						fill="none"
						stroke="var(--border)"
						strokeWidth="2.5"
					/>
					<circle
						cx="12"
						cy="12"
						r="8.5"
						fill="none"
						stroke="var(--primary)"
						strokeWidth="2.5"
						strokeDasharray="14 40"
						strokeLinecap="round"
					>
						<animateTransform
							attributeName="transform"
							type="rotate"
							from="0 12 12"
							to="360 12 12"
							dur="0.75s"
							repeatCount="indefinite"
						/>
					</circle>
				</svg>
			);
		case "help":
			return (
				<svg {...props}>
					{/* Arrow */}
					<path
						d="M3 2 L3 14 L6.5 10.5 L9.5 17.5 L11.5 16.5 L8.5 9.5 L13 9.5 Z"
						{...base}
					/>
					{/* ? badge */}
					<circle
						cx="18"
						cy="18"
						r="5"
						fill="var(--primary)"
						stroke="white"
						strokeWidth="1"
					/>
					<text
						x="18"
						y="22"
						textAnchor="middle"
						fontSize="8"
						fontWeight="bold"
						fill="white"
					>
						?
					</text>
				</svg>
			);
		case "copy":
			return (
				<svg {...props}>
					{/* Arrow */}
					<path
						d="M3 2 L3 14 L6.5 10.5 L9.5 17.5 L11.5 16.5 L8.5 9.5 L13 9.5 Z"
						{...base}
					/>
					{/* + badge */}
					<circle
						cx="18"
						cy="18"
						r="5"
						fill="var(--primary)"
						stroke="white"
						strokeWidth="1"
					/>
					<path
						d="M18 15 L18 21 M15 18 L21 18"
						stroke="white"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			);
		case "crosshair":
			return (
				<svg {...props}>
					<line
						x1="12"
						y1="2"
						x2="12"
						y2="10"
						stroke="var(--primary)"
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<line
						x1="12"
						y1="14"
						x2="12"
						y2="22"
						stroke="var(--primary)"
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<line
						x1="2"
						y1="12"
						x2="10"
						y2="12"
						stroke="var(--primary)"
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<line
						x1="14"
						y1="12"
						x2="22"
						y2="12"
						stroke="var(--primary)"
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<circle
						cx="12"
						cy="12"
						r="2.5"
						fill="var(--primary)"
						stroke="white"
						strokeWidth="1"
					/>
				</svg>
			);
		default: // arrow
			return (
				<svg {...props}>
					<path
						d="M4 2 L4 18 L8 14 L12 22 L15 21 L11 13 L17 13 Z"
						{...base}
					/>
				</svg>
			);
	}
}

export default function CustomCursor() {
	const mainRef = useRef<HTMLDivElement>(null);
	const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
	const TRAIL = 9;
	const positions = useRef(
		Array.from({ length: TRAIL + 1 }, () => ({ x: -200, y: -200 })),
	);
	const mouse = useRef({ x: -200, y: -200 });
	const rafRef = useRef<number>(0);
	const isDown = useRef(false);
	const [isEnabled, setIsEnabled] = useState(false);
	const [cursorType, setCursorType] = useState<CursorType>("default");

	useEffect(() => {
		const isTouchDevice =
			window.matchMedia("(any-pointer: coarse)").matches ||
			window.matchMedia("(hover: none)").matches ||
			navigator.maxTouchPoints > 0;

		setIsEnabled(!isTouchDevice);
	}, []);

	useEffect(() => {
		const root = document.documentElement;

		if (!isEnabled) {
			root.classList.remove("custom-cursor-enabled");
			return;
		}

		root.classList.add("custom-cursor-enabled");

		const update = (e: MouseEvent) => {
			mouse.current = { x: e.clientX, y: e.clientY };
			const el = document.elementFromPoint(e.clientX, e.clientY);
			setCursorType(detectCursorType(el, isDown.current));
		};
		const onDown = (e: MouseEvent) => {
			isDown.current = true;
			const el = document.elementFromPoint(e.clientX, e.clientY);
			setCursorType(detectCursorType(el, true));
		};
		const onUp = (e: MouseEvent) => {
			isDown.current = false;
			const el = document.elementFromPoint(e.clientX, e.clientY);
			setCursorType(detectCursorType(el, false));
		};

		window.addEventListener("mousemove", update, { passive: true });
		window.addEventListener("mousedown", onDown, { passive: true });
		window.addEventListener("mouseup", onUp, { passive: true });

		const animate = () => {
			positions.current[0] = { ...mouse.current };
			for (let i = 1; i <= TRAIL; i++) {
				const p = positions.current[i - 1],
					c = positions.current[i];
				positions.current[i] = {
					x: c.x + (p.x - c.x) * 0.22,
					y: c.y + (p.y - c.y) * 0.22,
				};
			}
			if (mainRef.current) {
				const { x, y } = positions.current[0];
				mainRef.current.style.transform = `translate(${x}px, ${y}px)`;
			}
			trailRefs.current.forEach((el, i) => {
				if (!el) return;
				const { x, y } = positions.current[i + 1];
				const f = (TRAIL - i) / TRAIL;
				const sz = Math.max(3, 14 * f);
				el.style.transform = `translate(${x - sz / 2}px, ${y - sz / 2}px)`;
				el.style.width = `${sz}px`;
				el.style.height = `${sz}px`;
				el.style.opacity = String(f * 0.45);
			});
			rafRef.current = requestAnimationFrame(animate);
		};
		rafRef.current = requestAnimationFrame(animate);

		return () => {
			root.classList.remove("custom-cursor-enabled");
			window.removeEventListener("mousemove", update);
			window.removeEventListener("mousedown", onDown);
			window.removeEventListener("mouseup", onUp);
			cancelAnimationFrame(rafRef.current);
		};
	}, [isEnabled]);

	if (!isEnabled) return null;

	return (
		<>
			<div
				ref={mainRef}
				className="fixed top-0 left-0 pointer-events-none z-[999999]"
				style={{ willChange: "transform" }}
			>
				<CursorShape type={cursorType} />
			</div>
			{Array.from({ length: TRAIL }, (_, i) => (
				<div
					key={i}
					ref={(el) => {
						trailRefs.current[i] = el;
					}}
					className="fixed top-0 left-0 pointer-events-none z-[999998] rounded-full"
					style={{
						backgroundColor: "var(--primary)",
						willChange: "transform, opacity, width, height",
					}}
				/>
			))}
		</>
	);
}
