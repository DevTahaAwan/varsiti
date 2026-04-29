"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Bot,
	X,
	Send,
	Clipboard,
	ClipboardCheck,
	Loader2,
	Sparkles,
} from "lucide-react";
import { useAIAssistant } from "@/lib/AIAssistantContext";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Detect code blocks in a message and split into parts
function parseMessage(
	content: string,
): { type: "text" | "code"; content: string; lang?: string }[] {
	const parts: { type: "text" | "code"; content: string; lang?: string }[] =
		[];
	const pattern = /```(\w*)\n?([\s\S]*?)```/g;
	let lastIndex = 0;
	let match;

	while ((match = pattern.exec(content)) !== null) {
		if (match.index > lastIndex) {
			parts.push({
				type: "text",
				content: content.slice(lastIndex, match.index),
			});
		}
		parts.push({
			type: "code",
			content: match[2].trim(),
			lang: match[1] || "cpp",
		});
		lastIndex = match.index + match[0].length;
	}
	if (lastIndex < content.length) {
		parts.push({ type: "text", content: content.slice(lastIndex) });
	}
	return parts;
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
	const [copied, setCopied] = useState(false);
	const { copyToEditor, editorWeekId } = useAIAssistant();

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleCopyToEditor = () => {
		copyToEditor(code);
	};

	return (
		<div className="mt-2 mb-2 rounded-xl overflow-hidden border border-white/10 text-xs">
			<div className="bg-[#111] px-3 py-2 flex items-center justify-between gap-2">
				<span className="text-gray-400 font-mono uppercase tracking-wider text-[10px]">
					{lang}
				</span>
				<div className="flex gap-1.5">
					{editorWeekId &&
						(lang === "cpp" || lang === "c++" || lang === "") && (
							<button
								onClick={handleCopyToEditor}
								className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/20 hover:bg-primary/40 text-primary text-[10px] font-semibold transition-colors"
							>
								<Sparkles size={10} /> Copy to Editor
							</button>
						)}
					<button
						onClick={handleCopy}
						className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
					>
						{copied ? (
							<ClipboardCheck
								size={13}
								className="text-green-400"
							/>
						) : (
							<Clipboard size={13} />
						)}
					</button>
				</div>
			</div>
			<pre className="bg-[#1e1e1e] p-3 overflow-x-auto font-mono text-gray-300 leading-relaxed text-[11px]">
				{code}
			</pre>
		</div>
	);
}

function MessageBubble({
	role,
	content,
}: {
	role: "user" | "assistant";
	content: string;
}) {
	const parts = parseMessage(content);

	if (role === "user") {
		return (
			<div className="flex justify-end">
				<div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[85%] leading-relaxed">
					{content}
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-start gap-2.5">
			<div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
				<Bot size={15} />
			</div>
			<div className="max-w-[90%] space-y-1">
				{parts.map((part, i) => {
					if (part.type === "code") {
						return (
							<CodeBlock
								key={i}
								code={part.content}
								lang={part.lang || "cpp"}
							/>
						);
					}
					return (
						<p
							key={i}
							className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap"
						>
							{part.content}
						</p>
					);
				})}
			</div>
		</div>
	);
}

export default function AIAssistant() {
	const { isOpen, openChat, closeChat, messages, sendMessage, isLoading } =
		useAIAssistant();
	const { userId } = useAuth();
	const router = useRouter();
	const [input, setInput] = useState("");
	const bottomRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const isExpandedComposer = messages.length > 0;
	const hasConversation = isExpandedComposer || input.trim().length > 0;

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isLoading]);

	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "0px";
		const nextHeight = Math.min(el.scrollHeight, 180);
		el.style.height = `${Math.max(nextHeight, 44)}px`;
	}, [input]);

	const handleSend = () => {
		if (!userId) {
			router.push("/sign-in");
			return;
		}
		const msg = input.trim();
		if (!msg || isLoading) return;
		setInput("");
		sendMessage(msg);
	};

	return (
		<>
			{/* Floating trigger button */}
			<AnimatePresence>
				{!isOpen && (
					<motion.button
						id="ai-assistant-btn"
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						onClick={() => openChat()}
						className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
						style={{
							boxShadow:
								"0 0 20px var(--primary), 0 4px 16px rgba(0,0,0,0.3)",
						}}
					>
						<Bot size={26} />
						<span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-background animate-pulse" />
					</motion.button>
				)}
			</AnimatePresence>

			{/* Chat panel */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 40, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 40, scale: 0.95 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
						className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 ${isExpandedComposer ? "sm:w-[42rem] h-[min(52rem,92vh)]" : hasConversation ? "sm:w-[30rem] h-[min(44rem,90vh)]" : "sm:w-96 h-[560px] max-h-[90vh]"} w-auto bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden`}
						style={{
							boxShadow:
								"0 0 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
						}}
					>
						{/* Header */}
						<div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-primary/5 shrink-0">
							<div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
								<Bot size={18} />
							</div>
							<div className="flex-1">
								<p className="font-bold text-sm">Varsiti AI</p>
								<p className="text-[10px] text-muted-foreground">
									C++ Learning Assistant
								</p>
							</div>
							<button
								onClick={closeChat}
								className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
							>
								<X size={18} />
							</button>
						</div>

						{/* Messages */}
						<div className="flex-1 overflow-y-auto p-4 space-y-4">
							{messages.length === 0 && (
								<div className="text-center py-8 space-y-3">
									<div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
										<Bot size={32} />
									</div>
									<p className="font-bold">
										Hi! I&apos;m Varsiti AI 👋
									</p>
									<p className="text-sm text-muted-foreground">
										Ask me anything about C++, OOP, or
										request code examples!
									</p>
								</div>
							)}

							{messages.map((msg, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
								>
									<MessageBubble
										role={msg.role}
										content={msg.content}
									/>
								</motion.div>
							))}

							{isLoading && (
								<div className="flex items-center gap-2.5">
									<div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
										<Bot
											size={15}
											className="text-primary"
										/>
									</div>
									<div className="flex gap-1.5 px-4 py-3 bg-secondary rounded-2xl rounded-tl-sm">
										<span
											className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
											style={{ animationDelay: "0ms" }}
										/>
										<span
											className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
											style={{ animationDelay: "150ms" }}
										/>
										<span
											className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
											style={{ animationDelay: "300ms" }}
										/>
									</div>
								</div>
							)}
							<div ref={bottomRef} />
						</div>

						{/* Input */}
						<div
							className={`p-4 border-t border-border shrink-0 ${isExpandedComposer ? "bg-card/80 backdrop-blur-sm" : ""}`}
						>
							<div
								className={`flex gap-2.5 items-end bg-secondary rounded-2xl px-4 border border-border focus-within:border-primary transition-colors ${isExpandedComposer ? "py-4" : "py-3"}`}
							>
								<textarea
									ref={textareaRef}
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											handleSend();
										}
									}}
									placeholder="Ask about C++ concepts, code..."
									rows={1}
									className={`flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed overflow-y-auto pr-1 ${isExpandedComposer ? "min-h-16 max-h-56" : "min-h-11 max-h-44"}`}
									style={{ scrollbarWidth: "none" }}
								/>
								<button
									onClick={handleSend}
									disabled={!input.trim() || isLoading}
									className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shrink-0"
								>
									{isLoading ? (
										<Loader2
											size={16}
											className="animate-spin"
										/>
									) : (
										<Send size={16} />
									)}
								</button>
							</div>
							<p className="text-[10px] text-muted-foreground text-center mt-2">
								Enter to send · Shift+Enter for newline
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
