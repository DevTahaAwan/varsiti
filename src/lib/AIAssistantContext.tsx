"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantContextType {
  isOpen: boolean;
  messages: AIMessage[];
  openChat: (initialMessage?: string) => void;
  closeChat: () => void;
  sendMessage: (msg: string) => Promise<void>;
  isLoading: boolean;
  registerEditorSetter: (setter: (code: string) => void, weekId: number) => void;
  copyToEditor: (code: string) => void;
  editorWeekId: number | null;
}

const CHAT_REQUEST_TIMEOUT_MS = 35000;

const AIAssistantContext = createContext<AIAssistantContextType>({
  isOpen: false,
  messages: [],
  openChat: () => {},
  closeChat: () => {},
  sendMessage: async () => {},
  isLoading: false,
  registerEditorSetter: () => {},
  copyToEditor: () => {},
  editorWeekId: null,
});

export function AIAssistantProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editorWeekId, setEditorWeekId] = useState<number | null>(null);

  // Use refs to avoid stale closures in callbacks
  const messagesRef = useRef<AIMessage[]>([]);
  const editorSetterRef = useRef<((code: string) => void) | null>(null);
  const isLoadingRef = useRef(false);

  const registerEditorSetter = useCallback((setter: (code: string) => void, weekId: number) => {
    editorSetterRef.current = setter;
    setEditorWeekId(weekId);
  }, []);

  const copyToEditor = useCallback((code: string) => {
    editorSetterRef.current?.(code);
  }, []);

  // sendMessage uses ref — never stale, no dependency array needed
  const sendMessage = useCallback(async (userContent: string) => {
    if (isLoadingRef.current) return;

    // Append user message using the ref for latest state
    const userMsg: AIMessage = { role: "user", content: userContent };
    const newMessages = [...messagesRef.current, userMsg];
    messagesRef.current = newMessages;
    setMessages([...newMessages]);

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CHAT_REQUEST_TIMEOUT_MS);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "Sorry, I could not generate a response.";

      const assistantMsg: AIMessage = { role: "assistant", content: reply };
      const finalMessages = [...newMessages, assistantMsg];
      messagesRef.current = finalMessages;
      setMessages([...finalMessages]);

    } catch (err: unknown) {
      const message = err instanceof Error
        ? (err.name === "AbortError"
          ? "AI response timed out. Please try again."
          : err.message)
        : "Could not connect to AI.";
      const errorMsg: AIMessage = {
        role: "assistant",
        content: `⚠️ Error: ${message}`
      };
      const failedMessages = [...newMessages, errorMsg];
      messagesRef.current = failedMessages;
      setMessages([...failedMessages]);
    }

    isLoadingRef.current = false;
    setIsLoading(false);
  }, []); // stable — no deps needed since we use refs

  const openChat = useCallback((initialMessage?: string) => {
    setIsOpen(true);
    if (initialMessage) {
      // Small delay so panel animates in first
      setTimeout(() => sendMessage(initialMessage), 200);
    }
  }, [sendMessage]);

  const closeChat = useCallback(() => setIsOpen(false), []);

  return (
    <AIAssistantContext.Provider value={{
      isOpen, messages, openChat, closeChat, sendMessage, isLoading,
      registerEditorSetter, copyToEditor, editorWeekId,
    }}>
      {children}
    </AIAssistantContext.Provider>
  );
}

export const useAIAssistant = () => useContext(AIAssistantContext);
