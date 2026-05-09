"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

// Keep AIMessage so other files don't break
interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantContextType {
  isOpen: boolean;
  openChat: (initialMessage?: string) => void;
  closeChat: () => void;
  registerEditorSetter: (setter: (code: string) => void, weekId: number) => void;
  copyToEditor: (code: string) => void;
  editorWeekId: number | null;
  // Dummy types to prevent TypeScript errors in other files
  messages: AIMessage[];
  sendMessage: (msg: string) => Promise<void>;
  isLoading: boolean;
  // New property to pass prompt to the UI
  externalPrompt: string | null;
  clearExternalPrompt: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType>({
  isOpen: false,
  openChat: () => {},
  closeChat: () => {},
  registerEditorSetter: () => {},
  copyToEditor: () => {},
  editorWeekId: null,
  messages: [],
  sendMessage: async () => {},
  isLoading: false,
  externalPrompt: null,
  clearExternalPrompt: () => {},
});

export function AIAssistantProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editorWeekId, setEditorWeekId] = useState<number | null>(null);
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  const editorSetterRef = useRef<((code: string) => void) | null>(null);

  const registerEditorSetter = useCallback((setter: (code: string) => void, weekId: number) => {
    editorSetterRef.current = setter;
    setEditorWeekId(weekId);
  }, []);

  const copyToEditor = useCallback((code: string) => {
    editorSetterRef.current?.(code);
  }, []);

  const openChat = useCallback((initialMessage?: string) => {
    setIsOpen(true);
    if (initialMessage) {
      setExternalPrompt(initialMessage);
    }
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);
  const clearExternalPrompt = useCallback(() => setExternalPrompt(null), []);

  return (
    <AIAssistantContext.Provider value={{
      isOpen, openChat, closeChat, registerEditorSetter, copyToEditor, editorWeekId,
      externalPrompt, clearExternalPrompt,
      // Pass dummy values so other files relying on them don't crash
      messages: [], isLoading: false, sendMessage: async () => {} 
    }}>
      {children}
    </AIAssistantContext.Provider>
  );
}

export const useAIAssistant = () => useContext(AIAssistantContext);