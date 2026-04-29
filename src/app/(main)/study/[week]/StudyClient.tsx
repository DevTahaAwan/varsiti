"use client";

import { use, useCallback, useEffect, useState, useRef } from "react";
import { saveProgress } from "@/app/actions/progress";
import { AnimatePresence, motion } from "framer-motion";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code,
  FileQuestion,
  Key,
  Loader2,
  PlayCircle,
  Share2,
  TimerReset,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";

import { course } from "@/lib/courseData";
import { examMockWeeks } from "@/lib/examMockData";
import type {
  CodingQuestion,
  CourseWeek,
  ExamWeekData,
  PracticeQuestion,
  StudyWeekData,
  TheoryItem,
} from "@/lib/courseTypes";
import { useAIAssistant } from "@/lib/AIAssistantContext";
import { defineVarsitiTheme, registerCppProviders } from "@/lib/monacoProviders";

type EvalStatus = "correct" | "incorrect" | "partial" | "error";

type EvalResult = {
  status: EvalStatus;
  feedback: string;
  expectedOutput?: string;
  score?: number;
  maxScore?: number;
};

type StudyTab = "theory" | "practice" | "quiz";
type ExamTab = "rules" | "mockTest";
type SectionId = "quiz" | "outputTracing" | "coding";
type SectionStatus = "locked" | "active" | "completed" | "timed_out";

type ExamScores = {
  quiz: number;
  outputTracing: number;
  coding: number;
  total: number;
};

type ExamState = {
  started: boolean;
  finalized: boolean;
  currentSection: SectionId;
  sectionStatus: Record<SectionId, SectionStatus>;
  remainingSeconds: number;
  carrySeconds: number;
  lastUpdatedAt: number | null;
  quizAnswers: Record<number, number>;
  outputAnswers: Record<number, string>;
  codingAnswers: Record<string, string>;
  codingResults: Record<string, EvalResult>;
  scores: ExamScores;
};

const DEFAULT_STARTER = `#include <iostream>
using namespace std;

int main() {
    // your code here
    return 0;
}`;

const EXAM_SECTION_ORDER: SectionId[] = ["quiz", "outputTracing", "coding"];

function getPracticeStarter(question?: PracticeQuestion) {
  return question?.starter || question?.template || DEFAULT_STARTER;
}

function generateQuestions(theory?: TheoryItem): string[] {
  if (!theory) return [];

  const questions: string[] = [];
  const { title, keyPoints, explanation } = theory;

  questions.push(`Explain the concept of "${title}" in your own words with a C++ example.`);

  if (keyPoints.length > 0) {
    const point = keyPoints[0].replace(/<[^>]*>/g, "").replace(/`[^`]*`/g, "").trim();
    questions.push(`What does this mean in practice: "${point.slice(0, 80)}..."?`);
  }

  if (keyPoints.length > 1) {
    const point = keyPoints[1].replace(/<[^>]*>/g, "").replace(/`[^`]*`/g, "").trim();
    questions.push(`Can you give a real-world analogy for: "${point.slice(0, 80)}..."?`);
  }

  if (explanation.length > 0) {
    questions.push(`What are the most common mistakes beginners make when learning ${title}?`);
  }

  questions.push(`Write a short C++ program that demonstrates ${title} clearly.`);

  return questions.slice(0, 5);
}

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safeSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function normalizeOutput(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
    .join("\n")
    .trim();
}

function getSectionDurationSeconds(weekData: ExamWeekData, section: SectionId) {
  if (section === "quiz") return weekData.mockTest.timers.quizMinutes * 60;
  if (section === "outputTracing") return weekData.mockTest.timers.outputTracingMinutes * 60;
  return weekData.mockTest.timers.codingMinutes * 60;
}

function calculateExamScores(
  state: Pick<ExamState, "quizAnswers" | "outputAnswers" | "codingResults">,
  weekData: ExamWeekData,
): ExamScores {
  const quiz = weekData.mockTest.quiz.reduce((sum, question, index) => {
    const mark = question.mark ?? 1;
    return sum + (state.quizAnswers[index] === question.answer ? mark : 0);
  }, 0);

  const outputTracing = weekData.mockTest.outputTracing.reduce((sum, question, index) => {
    const given = normalizeOutput(state.outputAnswers[index] ?? "");
    const expected = normalizeOutput(question.expectedOutput);
    return sum + (given !== "" && given === expected ? question.marks : 0);
  }, 0);

  const coding = weekData.mockTest.coding.reduce((sum, question) => {
    const score = state.codingResults[question.id]?.score;
    return sum + (typeof score === "number" ? score : 0);
  }, 0);

  return {
    quiz,
    outputTracing,
    coding,
    total: quiz + outputTracing + coding,
  };
}

function buildInitialExamState(weekData: ExamWeekData): ExamState {
  const codingAnswers = Object.fromEntries(
    weekData.mockTest.coding.map((question) => [question.id, question.starter || DEFAULT_STARTER]),
  );

  return {
    started: false,
    finalized: false,
    currentSection: "quiz",
    sectionStatus: {
      quiz: "active",
      outputTracing: "locked",
      coding: "locked",
    },
    remainingSeconds: getSectionDurationSeconds(weekData, "quiz"),
    carrySeconds: 0,
    lastUpdatedAt: null,
    quizAnswers: {},
    outputAnswers: {},
    codingAnswers,
    codingResults: {},
    scores: {
      quiz: 0,
      outputTracing: 0,
      coding: 0,
      total: 0,
    },
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finalizeSectionState(
  state: ExamState,
  weekData: ExamWeekData,
  reason: "manual" | "timeout",
): ExamState {
  const currentIndex = EXAM_SECTION_ORDER.indexOf(state.currentSection);
  const currentSection = state.currentSection;
  const nextStatus: Record<SectionId, SectionStatus> = {
    ...state.sectionStatus,
    [currentSection]: reason === "timeout" ? "timed_out" : "completed",
  };
  const scores = calculateExamScores(state, weekData);

  if (currentIndex === EXAM_SECTION_ORDER.length - 1) {
    return {
      ...state,
      finalized: true,
      sectionStatus: nextStatus,
      remainingSeconds: 0,
      carrySeconds: 0,
      lastUpdatedAt: null,
      scores,
    };
  }

  const nextSection = EXAM_SECTION_ORDER[currentIndex + 1];
  const carrySeconds = reason === "manual" ? state.remainingSeconds : 0;

  return {
    ...state,
    currentSection: nextSection,
    sectionStatus: {
      ...nextStatus,
      [nextSection]: "active",
    },
    remainingSeconds: getSectionDurationSeconds(weekData, nextSection) + carrySeconds,
    carrySeconds,
    lastUpdatedAt: Date.now(),
    scores,
  };
}

function advanceExamClock(state: ExamState, weekData: ExamWeekData, now = Date.now()) {
  if (!state.started || state.finalized || state.lastUpdatedAt === null) {
    return state;
  }

  let elapsedSeconds = Math.floor((now - state.lastUpdatedAt) / 1000);
  if (elapsedSeconds <= 0) return state;

  let nextState = { ...state };

  while (elapsedSeconds > 0 && !nextState.finalized) {
    if (elapsedSeconds < nextState.remainingSeconds) {
      nextState = {
        ...nextState,
        remainingSeconds: nextState.remainingSeconds - elapsedSeconds,
        lastUpdatedAt: now,
        scores: calculateExamScores(nextState, weekData),
      };
      elapsedSeconds = 0;
      break;
    }

    elapsedSeconds -= nextState.remainingSeconds;
    nextState = finalizeSectionState(
      {
        ...nextState,
        remainingSeconds: 0,
      },
      weekData,
      "timeout",
    );
  }

  if (!nextState.finalized && nextState.started) {
    nextState = {
      ...nextState,
      lastUpdatedAt: now,
      scores: calculateExamScores(nextState, weekData),
    };
  }

  return nextState;
}

function loadExamState(weekData: ExamWeekData, weekId: number, userId: string) {
  const initialState = buildInitialExamState(weekData);

  if (typeof window === "undefined") {
    return initialState;
  }

    try {
      const raw = window.localStorage.getItem(`varsiti-exam-${userId}-${weekId}`);
      if (!raw) return initialState;

    const saved = JSON.parse(raw) as unknown;
    if (!isPlainObject(saved)) return initialState;

    const merged: ExamState = {
      ...initialState,
      started: typeof saved.started === "boolean" ? saved.started : initialState.started,
      finalized: typeof saved.finalized === "boolean" ? saved.finalized : initialState.finalized,
      currentSection:
        saved.currentSection === "quiz" ||
        saved.currentSection === "outputTracing" ||
        saved.currentSection === "coding"
          ? saved.currentSection
          : initialState.currentSection,
      remainingSeconds:
        typeof saved.remainingSeconds === "number"
          ? saved.remainingSeconds
          : initialState.remainingSeconds,
      carrySeconds:
        typeof saved.carrySeconds === "number" ? saved.carrySeconds : initialState.carrySeconds,
      lastUpdatedAt:
        typeof saved.lastUpdatedAt === "number" ? saved.lastUpdatedAt : initialState.lastUpdatedAt,
      sectionStatus: {
        ...initialState.sectionStatus,
        ...(isPlainObject(saved.sectionStatus)
          ? (saved.sectionStatus as Record<SectionId, SectionStatus>)
          : {}),
      },
      quizAnswers: isPlainObject(saved.quizAnswers)
        ? Object.fromEntries(
            Object.entries(saved.quizAnswers).map(([key, value]) => [Number(key), Number(value)]),
          )
        : initialState.quizAnswers,
      outputAnswers: isPlainObject(saved.outputAnswers)
        ? Object.fromEntries(
            Object.entries(saved.outputAnswers).map(([key, value]) => [Number(key), String(value)]),
          )
        : initialState.outputAnswers,
      codingAnswers: {
        ...initialState.codingAnswers,
        ...(isPlainObject(saved.codingAnswers)
          ? Object.fromEntries(
              Object.entries(saved.codingAnswers).map(([key, value]) => [key, String(value)]),
            )
          : {}),
      },
      codingResults: isPlainObject(saved.codingResults)
        ? Object.fromEntries(
            Object.entries(saved.codingResults).map(([key, value]) => [key, value as EvalResult]),
          )
        : initialState.codingResults,
      scores: initialState.scores,
    };

    return advanceExamClock(
      {
        ...merged,
        scores: calculateExamScores(merged, weekData),
      },
      weekData,
      Date.now(),
    );
  } catch {
    return initialState;
  }
}

function getStatusTone(status: SectionStatus) {
  if (status === "active") return "bg-primary text-primary-foreground";
  if (status === "completed") return "bg-green-500/15 text-green-700 dark:text-green-300";
  if (status === "timed_out") return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
  return "bg-secondary text-muted-foreground";
}

function getEvalTone(status: EvalStatus) {
  if (status === "correct") return "text-green-500";
  if (status === "partial") return "text-amber-500";
  if (status === "incorrect") return "text-red-500";
  return "text-muted-foreground";
}

export default function StudyClient({ 
  params, 
  initialElapsedSeconds, 
  userId 
}: { 
  params: Promise<{ week: string }>;
  initialElapsedSeconds: number;
  userId: string;
}) {
  const { week } = use(params);
  const weekId = Number.parseInt(week, 10);
  const rawWeekData = course[weekId] as CourseWeek | undefined;
  const effectiveWeekData = rawWeekData?.type === "exam" ? examMockWeeks[weekId] || rawWeekData : rawWeekData;

  const { openChat, registerEditorSetter } = useAIAssistant();

  const handleBeforeMount: BeforeMount = useCallback((monaco) => {
    defineVarsitiTheme(monaco);
    registerCppProviders(monaco);
  }, []);

  const handleEditorMount: OnMount = useCallback((editor) => {
    editor.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem(`varsiti-last-week-${userId}`, String(weekId));

    try {
      const raw = localStorage.getItem(`varsiti-completed-weeks-${userId}`);
      const parsed = raw ? (JSON.parse(raw) as number[]) : [];
      const merged = Array.from(new Set([...(Array.isArray(parsed) ? parsed : []), weekId]));
      localStorage.setItem(`varsiti-completed-weeks-${userId}`, JSON.stringify(merged));
    } catch {
      localStorage.setItem(`varsiti-completed-weeks-${userId}`, JSON.stringify([weekId]));
    }
  }, [weekId, userId]);

  const fallbackWeekData = course[1] as CourseWeek;
  const weekData = effectiveWeekData || fallbackWeekData;
  const isExamWeek = weekData.type === "exam";
  const studyWeek = isExamWeek ? null : (weekData as StudyWeekData);
  const examWeek = isExamWeek ? (weekData as ExamWeekData) : null;

  const [activeTab, setActiveTab] = useState<StudyTab | ExamTab>(isExamWeek ? "rules" : "theory");
  const [theoryIndex, setTheoryIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [studyUserCode, setStudyUserCode] = useState(() =>
    getPracticeStarter(studyWeek?.practice[0]),
  );
  const [studyEvalResult, setStudyEvalResult] = useState<EvalResult | null>(null);
  const [studyTerminalVisible, setStudyTerminalVisible] = useState(false);
  const [isStudyEvaluating, setIsStudyEvaluating] = useState(false);
  const [studyQuizAnswers, setStudyQuizAnswers] = useState<Record<number, number>>({});
  const [examState, setExamState] = useState<ExamState | null>(() =>
    examWeek ? loadExamState(examWeek, weekId, userId) : null,
  );
  
  // Timer State
  const [globalElapsedSeconds, setGlobalElapsedSeconds] = useState(initialElapsedSeconds);
  const elapsedRef = useRef(globalElapsedSeconds);
  
  useEffect(() => {
    elapsedRef.current = globalElapsedSeconds;
  }, [globalElapsedSeconds]);
  const [activeCodingIndex, setActiveCodingIndex] = useState(0);
  const [evaluatingCodingId, setEvaluatingCodingId] = useState<string | null>(null);

  const theories = studyWeek?.theory ?? [];
  const practices = studyWeek?.practice ?? [];
  const quizzes = studyWeek?.quiz ?? [];
  const currentTheory = theories[theoryIndex];
  const currentPractice = practices[practiceIndex];
  const theoryQuestions = generateQuestions(currentTheory);
  const currentCodingQuestion = examWeek?.mockTest.coding[activeCodingIndex];

  useEffect(() => {
    if (!studyWeek) return;

    registerEditorSetter(
      (code: string) => {
        setStudyUserCode(code);
        setActiveTab("practice");
      },
      weekId,
    );
  }, [registerEditorSetter, studyWeek, weekId]);

  useEffect(() => {
    if (!examWeek || !examState) return;
    localStorage.setItem(`varsiti-exam-${userId}-${weekId}`, JSON.stringify(examState));
  }, [examState, examWeek, weekId, userId]);

  useEffect(() => {
    if (!examWeek || !examState?.started || examState.finalized) return;

    // Advance exam state
    const stateTimer = window.setInterval(() => {
      setExamState((current) => {
        if (!current) return current;
        return advanceExamClock(current, examWeek, Date.now());
      });
    }, 1000);

    // Global elapsed timer (for Supabase)
    const elapsedTimer = window.setInterval(() => {
      setGlobalElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Auto-save every 60 seconds
    const autoSaveTimer = window.setInterval(() => {
      saveProgress(weekId, elapsedRef.current).catch(console.error);
    }, 60000);

    return () => {
      window.clearInterval(stateTimer);
      window.clearInterval(elapsedTimer);
      window.clearInterval(autoSaveTimer);
      // Final save on unmount if exam is active
      saveProgress(weekId, elapsedRef.current).catch(console.error);
    };
  }, [examState?.finalized, examState?.started, examWeek, weekId]);

  if (!effectiveWeekData) return notFound();

  const goToPractice = (nextIndex: number) => {
    const safeIndex = Math.max(0, Math.min(nextIndex, practices.length - 1));
    setPracticeIndex(safeIndex);
    setStudyUserCode(getPracticeStarter(practices[safeIndex]));
    setStudyEvalResult(null);
    setStudyTerminalVisible(false);
  };

  const handleRunStudyCode = async () => {
    if (!studyUserCode.trim()) return;

    setStudyTerminalVisible(true);
    setIsStudyEvaluating(true);
    setStudyEvalResult(null);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: studyUserCode,
          questionNumber: practiceIndex + 1,
          weekId,
          prompt: currentPractice?.prompt,
          maxScore: 1,
          difficulty: "easy",
        }),
      });

      const data = (await response.json()) as EvalResult & { error?: string };
      setStudyEvalResult(
        data.error
          ? { status: "error", feedback: data.error }
          : {
              status: data.status,
              feedback: data.feedback,
              expectedOutput: data.expectedOutput,
              score: data.score,
              maxScore: data.maxScore,
            },
      );
    } catch {
      setStudyEvalResult({
        status: "error",
        feedback: "Failed to reach the evaluation server.",
      });
    } finally {
      setIsStudyEvaluating(false);
    }
  };

  const startMockTest = () => {
    if (!examState) return;
    setActiveTab("mockTest");
    setExamState({
      ...examState,
      started: true,
      lastUpdatedAt: Date.now(),
      scores: calculateExamScores(examState, examWeek!),
    });
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    if (!examState || examState.sectionStatus.quiz !== "active") return;

    const nextState = {
      ...examState,
      quizAnswers: {
        ...examState.quizAnswers,
        [questionIndex]: answerIndex,
      },
    };

    setExamState({
      ...nextState,
      scores: calculateExamScores(nextState, examWeek!),
    });
  };

  const handleOutputChange = (questionIndex: number, value: string) => {
    if (!examState || examState.sectionStatus.outputTracing !== "active") return;

    const nextState = {
      ...examState,
      outputAnswers: {
        ...examState.outputAnswers,
        [questionIndex]: value,
      },
    };

    setExamState({
      ...nextState,
      scores: calculateExamScores(nextState, examWeek!),
    });
  };

  const handleCodingChange = (questionId: string, value: string) => {
    if (!examState || examState.sectionStatus.coding !== "active") return;

    setExamState({
      ...examState,
      codingAnswers: {
        ...examState.codingAnswers,
        [questionId]: value,
      },
    });
  };

  const handleEvaluateCoding = async (question: CodingQuestion) => {
    if (!examState || examState.sectionStatus.coding !== "active") return;

    const code = examState.codingAnswers[question.id];
    if (!code?.trim()) return;

    setEvaluatingCodingId(question.id);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          questionNumber: activeCodingIndex + 1,
          weekId,
          prompt: question.prompt,
          maxScore: question.maxScore,
          difficulty: question.difficulty,
          questionTitle: question.title,
        }),
      });

      const data = (await response.json()) as EvalResult & { error?: string };
      const result: EvalResult = data.error
        ? { status: "error", feedback: data.error, score: 0, maxScore: question.maxScore }
        : {
            status: data.status,
            feedback: data.feedback,
            expectedOutput: data.expectedOutput,
            score: data.score,
            maxScore: data.maxScore,
          };

      setExamState((current) => {
        if (!current) return current;

        const nextState = {
          ...current,
          codingResults: {
            ...current.codingResults,
            [question.id]: result,
          },
        };

        return {
          ...nextState,
          scores: calculateExamScores(nextState, examWeek!),
        };
      });
    } catch {
      setExamState((current) => {
        if (!current) return current;

        const nextState = {
          ...current,
          codingResults: {
            ...current.codingResults,
            [question.id]: {
              status: "error" as const,
              feedback: "Failed to reach the evaluation server.",
              score: 0,
              maxScore: question.maxScore,
            },
          },
        };

        return {
          ...nextState,
          scores: calculateExamScores(nextState, examWeek!),
        };
      });
    } finally {
      setEvaluatingCodingId(null);
    }
  };

  const advanceExamSection = (reason: "manual" | "timeout") => {
    if (!examState || !examWeek) return;
    setExamState(finalizeSectionState(examState, examWeek, reason));
  };

  const resetMockTest = () => {
    if (!examWeek) return;
    const initialState = buildInitialExamState(examWeek);
    setExamState(initialState);
    setActiveCodingIndex(0);
  };

  const allQuizAnswered = examWeek
    ? examWeek.mockTest.quiz.every((_, index) => examState?.quizAnswers[index] !== undefined)
    : false;
  const allOutputAnswered = examWeek
    ? examWeek.mockTest.outputTracing.every(
        (_, index) => normalizeOutput(examState?.outputAnswers[index] ?? "") !== "",
      )
    : false;
  const allCodingEvaluated = examWeek
    ? examWeek.mockTest.coding.every((question) => examState?.codingResults[question.id])
    : false;

  const tabs: Array<{ id: StudyTab | ExamTab; label: string; icon: React.ReactNode }> = isExamWeek
    ? [
        { id: "rules", label: "Rules", icon: <BookOpen size={16} /> },
        { id: "mockTest", label: "Mock Test", icon: <FileQuestion size={16} /> },
      ]
    : [
        { id: "theory", label: "Theory", icon: <BookOpen size={16} /> },
        { id: "practice", label: "Practice", icon: <Code size={16} /> },
        { id: "quiz", label: "Quiz", icon: <FileQuestion size={16} /> },
      ];

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <span className="mb-0.5 block text-xs font-bold uppercase tracking-widest text-primary">
              Week {weekId}
            </span>
            <h1 className="text-xl font-extrabold tracking-tight leading-tight">{weekData.title}</h1>
          </div>
        </div>

        <div className="flex self-start rounded-2xl border border-border/50 bg-secondary p-1 sm:self-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={activeTab === tab.id ? "text-primary" : ""}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isExamWeek && activeTab === "theory" && (
          <motion.div
            key="theory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-3xl border border-border bg-card"
          >
            {theories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-6 pb-4 pt-5">
                {theories.map((item, index) => (
                  <button
                    key={item.title}
                    onClick={() => setTheoryIndex(index)}
                    className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                      index === theoryIndex
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-secondary hover:bg-card"
                    }`}
                  >
                    {index + 1}. {item.title}
                  </button>
                ))}
              </div>
            )}

            <div className="p-6 md:p-10">
              {currentTheory ? (
                <div className="mx-auto max-w-3xl">
                  <h2 className="mb-6 text-2xl font-extrabold tracking-tight">{currentTheory.title}</h2>

                  <div className="mb-8 space-y-5">
                    {currentTheory.explanation.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base leading-relaxed text-foreground/90"
                        dangerouslySetInnerHTML={{ __html: paragraph }}
                      />
                    ))}
                  </div>

                  {currentTheory.keyPoints.length > 0 && (
                    <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                        <Key size={14} /> Key Points
                      </h3>
                      <ul className="space-y-2.5">
                        {currentTheory.keyPoints.map((point) => (
                          <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed">
                            <span className="mt-1 shrink-0 text-primary">-</span>
                            <span dangerouslySetInnerHTML={{ __html: point }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentTheory.code && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-border shadow-sm">
                      <div className="flex items-center gap-2 bg-[#1e1e1e] px-4 py-2.5">
                        <div className="h-3 w-3 rounded-full bg-red-500/80" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                        <div className="h-3 w-3 rounded-full bg-green-500/80" />
                        <span className="ml-2 font-mono text-xs text-gray-400">example.cpp</span>
                      </div>
                      <Editor
                        height={Math.min(40 + currentTheory.code.split("\n").length * 21, 500)}
                        defaultLanguage="cpp"
                        theme="varsiti-dark"
                        value={currentTheory.code}
                        beforeMount={handleBeforeMount}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 13,
                          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                          fontLigatures: true,
                          padding: { top: 16, bottom: 16 },
                          scrollBeyondLastLine: false,
                          lineNumbers: "on",
                          scrollbar: { vertical: "hidden", horizontal: "hidden" },
                          renderLineHighlight: "none",
                          folding: true,
                          bracketPairColorization: { enabled: true },
                        }}
                      />
                    </div>
                  )}

                  {theoryQuestions.length > 0 && (
                    <div className="border-t border-border pt-8">
                      <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
                        <Zap size={16} className="text-primary" />
                        Practice Questions - ask the AI
                      </h3>
                      <div className="space-y-2.5">
                        {theoryQuestions.map((question, index) => (
                          <button
                            key={question}
                            onClick={() => openChat(question)}
                            className="group flex w-full items-start gap-3 rounded-2xl border border-border p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                          >
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                              {index + 1}
                            </span>
                            <span className="flex-1 text-sm leading-relaxed text-foreground/80">{question}</span>
                            <ArrowUpRight
                              size={16}
                              className="mt-0.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="py-16 text-center text-muted-foreground">No theory content available.</p>
              )}
            </div>

            {theories.length > 1 && (
              <div className="flex items-center justify-between border-t border-border px-8 py-4">
                <button
                  disabled={theoryIndex === 0}
                  onClick={() => setTheoryIndex((current) => current - 1)}
                  className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-40"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-xs font-medium text-muted-foreground">
                  {theoryIndex + 1} / {theories.length}
                </span>
                <button
                  disabled={theoryIndex === theories.length - 1}
                  onClick={() => setTheoryIndex((current) => current + 1)}
                  className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-40"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {!isExamWeek && activeTab === "practice" && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="overflow-hidden rounded-3xl border border-border bg-card"
            style={{ height: "calc(100vh - 12rem)" }}
          >
            <div className="flex h-full flex-col md:flex-row">
              <div className="w-full shrink-0 border-r border-border bg-secondary/20 md:w-80 lg:w-96">
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                      {practiceIndex + 1}
                    </div>
                    <h3 className="text-base font-bold leading-tight">{currentPractice?.title || "Challenge"}</h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed text-foreground/80"
                    dangerouslySetInnerHTML={{
                      __html:
                        currentPractice?.prompt ||
                        currentPractice?.question ||
                        "Complete the coding challenge.",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-border bg-card p-4">
                  <button
                    disabled={practiceIndex === 0}
                    onClick={() => goToPractice(practiceIndex - 1)}
                    className="rounded-xl border border-border p-2 transition-colors hover:bg-secondary disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {practiceIndex + 1} / {practices.length}
                  </span>
                  <button
                    disabled={practiceIndex === practices.length - 1}
                    onClick={() => goToPractice(practiceIndex + 1)}
                    className="rounded-xl border border-border p-2 transition-colors hover:bg-secondary disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 bg-[#1e1e1e] px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-mono text-xs text-gray-400">solution.cpp</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        openChat(
                          `I need help with this practice question:\n\n${
                            currentPractice?.prompt ||
                            currentPractice?.question ||
                            "Complete the coding challenge."
                          }`,
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-[#2d2d2d] px-3 py-1 sm:px-6 sm:py-2 text-sm sm:text-base font-bold text-white transition-colors hover:bg-[#3d3d3d]"
                    >
                      <Zap size={13} className="text-[#a855f7]" />
                      Ask AI
                    </button>
                    <button
                      onClick={handleRunStudyCode}
                      disabled={isStudyEvaluating}
                      className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1 sm:px-6 sm:py-2 text-sm sm:text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-60"
                    >
                      {isStudyEvaluating ? <Loader2 size={13} className="animate-spin" /> : <Code size={13} />}
                      {isStudyEvaluating ? "Analyzing..." : "Run Code"}
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 bg-[#1e1e1e]">
                  <Editor
                    height="100%"
                    defaultLanguage="cpp"
                    theme="varsiti-dark"
                    value={studyUserCode}
                    onChange={(value) => setStudyUserCode(value || "")}
                    beforeMount={handleBeforeMount}
                    onMount={handleEditorMount}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      fontLigatures: true,
                      lineHeight: 22,
                      padding: { top: 16, bottom: 16 },
                      smoothScrolling: true,
                      cursorBlinking: "smooth",
                      cursorSmoothCaretAnimation: "on",
                      mouseWheelZoom: true,
                      quickSuggestions: { other: true, comments: false, strings: false },
                      suggestOnTriggerCharacters: true,
                      acceptSuggestionOnEnter: "on",
                      parameterHints: { enabled: true, cycle: true },
                      wordBasedSuggestions: "matchingDocuments",
                      bracketPairColorization: { enabled: true },
                      guides: { bracketPairs: true },
                      autoClosingBrackets: "always",
                      autoClosingQuotes: "always",
                      autoSurround: "languageDefined",
                      formatOnPaste: true,
                      renderLineHighlight: "gutter",
                      scrollBeyondLastLine: false,
                      folding: true,
                      foldingHighlight: true,
                      showFoldingControls: "always",
                      scrollbar: {
                        vertical: "auto",
                        horizontal: "auto",
                        verticalScrollbarSize: 6,
                        horizontalScrollbarSize: 6,
                      },
                      tabSize: 4,
                      insertSpaces: true,
                      detectIndentation: true,
                    }}
                  />
                </div>

                {studyTerminalVisible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 192, opacity: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex shrink-0 flex-col overflow-hidden border-t border-white/10 bg-[#0d0d0d]"
                  >
                    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <span className="font-mono text-xs text-gray-500">AI Terminal</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
                      {isStudyEvaluating && (
                        <span className="animate-pulse text-yellow-400">Analyzing your code...</span>
                      )}
                      {studyEvalResult && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                          <div className="flex items-center gap-2">
                            {studyEvalResult.status === "correct" ? (
                              <CheckCircle2 size={14} className="text-green-400" />
                            ) : studyEvalResult.status === "partial" ? (
                              <TimerReset size={14} className="text-amber-400" />
                            ) : (
                              <XCircle size={14} className="text-red-400" />
                            )}
                            <span className={`text-sm font-bold ${getEvalTone(studyEvalResult.status)}`}>
                              {studyEvalResult.status.toUpperCase()}
                            </span>
                          </div>
                          {studyEvalResult.expectedOutput && (
                            <div>
                              <div className="mb-1 text-gray-500">Expected Output:</div>
                              <pre className="whitespace-pre-wrap rounded border border-white/5 bg-black/50 p-2 text-gray-300">
                                {studyEvalResult.expectedOutput}
                              </pre>
                            </div>
                          )}
                          <div>
                            <div className="mb-1 text-gray-500">AI Feedback:</div>
                            <p className="leading-relaxed text-[#34d399]">{studyEvalResult.feedback}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {!isExamWeek && activeTab === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-3xl border border-border bg-card p-6 md:p-8"
          >
            {quizzes.length === 0 ? (
              <div className="py-16 text-center">
                <FileQuestion size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
                <p className="text-muted-foreground">No quiz available for this week.</p>
              </div>
            ) : (
              <div className="mx-auto max-w-2xl space-y-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-2xl font-extrabold">
                    <Zap className="text-primary" size={22} /> Concept Check
                  </h2>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {quizzes.length} Questions
                  </span>
                </div>

                {quizzes.map((quiz, quizIndex) => {
                  const chosen = studyQuizAnswers[quizIndex];
                  const answered = chosen !== undefined;
                  const correctIndex = quiz.answer ?? quiz.correct ?? 0;

                  return (
                    <div key={`${quiz.question}-${quizIndex}`} className="space-y-4 rounded-2xl border border-border bg-secondary/40 p-5">
                      <p className="flex items-start gap-3 text-base font-semibold">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                          {quizIndex + 1}
                        </span>
                        <span dangerouslySetInnerHTML={{ __html: quiz.question || quiz.q || "" }} />
                      </p>
                      <div className="grid grid-cols-1 gap-2.5 pl-9 sm:grid-cols-2">
                        {quiz.options.map((option, optionIndex) => {
                          let className =
                            "rounded-xl border p-3.5 text-left text-sm font-medium transition-all ";

                          if (!answered) {
                            className += "border-border bg-card hover:border-primary/50 hover:bg-primary/5";
                          } else if (optionIndex === correctIndex) {
                            className +=
                              "border-green-500 bg-green-500/15 text-green-700 dark:text-green-400";
                          } else if (optionIndex === chosen) {
                            className += "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400";
                          } else {
                            className += "cursor-not-allowed border-border bg-card opacity-40";
                          }

                          return (
                            <button
                              key={`${option}-${optionIndex}`}
                              disabled={answered}
                              onClick={() =>
                                setStudyQuizAnswers((current) => ({ ...current, [quizIndex]: optionIndex }))
                              }
                              className={className}
                            >
                              <span dangerouslySetInnerHTML={{ __html: option }} />
                            </button>
                          );
                        })}
                      </div>
                      {answered && quiz.explanation && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="rounded-xl border border-border bg-card p-3 pl-9 text-sm text-muted-foreground"
                        >
                          Hint: {quiz.explanation}
                        </motion.p>
                      )}
                    </div>
                  );
                })}

                {Object.keys(studyQuizAnswers).length === quizzes.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-primary/20 bg-primary/10 p-6 text-center"
                  >
                    <p className="mb-1 text-3xl font-black">
                      {
                        Object.entries(studyQuizAnswers).filter(([questionIndex, answerIndex]) => {
                          const quiz = quizzes[Number(questionIndex)];
                          return answerIndex === (quiz.answer ?? quiz.correct ?? 0);
                        }).length
                      }{" "}
                      / {quizzes.length}
                    </p>
                    <p className="mb-4 text-sm text-muted-foreground">Questions Correct</p>
                    <button
                      onClick={() => setStudyQuizAnswers({})}
                      className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Retry Quiz
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {isExamWeek && activeTab === "rules" && examWeek && (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-3xl border border-border bg-card p-6 md:p-10"
          >
            <div className="mx-auto max-w-4xl space-y-8">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">Exam Mode</p>
                <h2 className="text-3xl font-extrabold tracking-tight">{examWeek.rules.title}</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <InfoCard
                  icon={<FileQuestion size={18} />}
                  title="Quiz"
                  value={`${examWeek.mockTest.quiz.length} questions`}
                  subtext={`${examWeek.mockTest.timers.quizMinutes} minutes • 10 marks`}
                />
                <InfoCard
                  icon={<TimerReset size={18} />}
                  title="Output Tracing"
                  value={`${examWeek.mockTest.outputTracing.length} questions`}
                  subtext={`${examWeek.mockTest.timers.outputTracingMinutes} minutes • 15 marks`}
                />
                <InfoCard
                  icon={<Code size={18} />}
                  title="Coding"
                  value={`${examWeek.mockTest.coding.length} problems`}
                  subtext={`${examWeek.mockTest.timers.codingMinutes} minutes • 25 marks`}
                />
              </div>

              <div className="space-y-4">
                {examWeek.rules.explanation.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-foreground/85"
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}
              </div>

              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                  <Key size={14} /> Important Rules
                </h3>
                <ul className="space-y-3">
                  {examWeek.rules.keyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-relaxed">
                      <span className="mt-1 text-primary">-</span>
                      <span dangerouslySetInnerHTML={{ __html: point }} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={startMockTest}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  <PlayCircle size={16} />
                  {examState?.started ? "Continue Mock Test" : "Start Mock Test"}
                </button>
                <button
                  onClick={() => setActiveTab("mockTest")}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  Open Mock Test Layout
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {isExamWeek && activeTab === "mockTest" && examWeek && examState && (
          <motion.div
            key="mock-test"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">Mock Test</p>
                    <h2 className="text-2xl font-extrabold tracking-tight">Full Exam Paper</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Total marks: {examWeek.mockTest.totalMarks}. Finish sections in order to unlock the next stage.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {!examState.started ? (
                      <button
                        onClick={startMockTest}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
                      >
                        <PlayCircle size={16} />
                        Start Mock Test
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-bold text-primary">
                        <Clock3 size={16} />
                        {examState.finalized ? "Exam Finished" : formatTime(examState.remainingSeconds)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6 grid gap-3 md:grid-cols-3">
                  {EXAM_SECTION_ORDER.map((section) => (
                    <div key={section} className="rounded-2xl border border-border bg-secondary/30 p-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <p className="font-bold capitalize">
                          {section === "outputTracing" ? "Output Tracing" : section}
                        </p>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusTone(examState.sectionStatus[section])}`}>
                          {examState.sectionStatus[section].replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {section === "quiz"
                          ? "10 MCQs • 10 marks"
                          : section === "outputTracing"
                            ? "3 traces • 15 marks"
                            : "3 coding tasks • 25 marks"}
                      </p>
                    </div>
                  ))}
                </div>

                {examState.started && !examState.finalized && (
                  <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
                    <div className="flex items-center gap-2 font-semibold">
                      <Clock3 size={16} />
                      Active Section:{" "}
                      {examState.currentSection === "outputTracing" ? "Output Tracing" : examState.currentSection}
                    </div>
                    {examState.carrySeconds > 0 && examState.currentSection !== "quiz" && (
                      <p className="mt-2">
                        Carried over time added to this section: {formatTime(examState.carrySeconds)}
                      </p>
                    )}
                  </div>
                )}

                {!examState.started && (
                  <div className="rounded-3xl border border-dashed border-border bg-secondary/20 p-8 text-center">
                    <h3 className="text-xl font-bold">Ready to begin?</h3>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      Once you start, the timer begins with the quiz section. Any unfinished section will lock automatically
                      when time ends.
                    </p>
                  </div>
                )}

                {examState.started && (
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-border bg-card p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold">Section 1: Quiz</h3>
                          <p className="text-sm text-muted-foreground">10 questions, 1 mark each</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${getStatusTone(examState.sectionStatus.quiz)}`}>
                          {examState.sectionStatus.quiz.replace("_", " ")}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {examWeek.mockTest.quiz.map((question, questionIndex) => {
                          const chosen = examState.quizAnswers[questionIndex];
                          const answered = chosen !== undefined;
                          const revealAnswer = examState.sectionStatus.quiz !== "active";

                          return (
                            <div key={`${question.question}-${questionIndex}`} className="rounded-2xl border border-border bg-secondary/30 p-4">
                              <p className="mb-3 font-semibold">
                                {questionIndex + 1}.{" "}
                                <span dangerouslySetInnerHTML={{ __html: question.question }} />
                              </p>
                              <div className="grid gap-2">
                                {question.options.map((option, optionIndex) => {
                                  const disabled = examState.sectionStatus.quiz !== "active";
                                  let optionClass =
                                    "rounded-xl border px-3 py-3 text-left text-sm transition-colors ";

                                  if (disabled && optionIndex === question.answer) {
                                    optionClass +=
                                      "border-green-500 bg-green-500/15 text-green-700 dark:text-green-300";
                                  } else if (disabled && optionIndex === chosen) {
                                    optionClass += "border-red-500 bg-red-500/10 text-red-600 dark:text-red-300";
                                  } else if (chosen === optionIndex) {
                                    optionClass += "border-primary bg-primary/10 text-foreground";
                                  } else {
                                    optionClass += "border-border bg-card hover:border-primary/30";
                                  }

                                  return (
                                    <button
                                      key={`${option}-${optionIndex}`}
                                      disabled={disabled}
                                      onClick={() => handleQuizAnswer(questionIndex, optionIndex)}
                                      className={optionClass}
                                    >
                                      <span dangerouslySetInnerHTML={{ __html: option }} />
                                    </button>
                                  );
                                })}
                              </div>
                              {revealAnswer && question.explanation && (
                                <p className="mt-3 text-sm text-muted-foreground">{question.explanation}</p>
                              )}
                              {answered && !revealAnswer && (
                                <p className="mt-3 text-xs font-semibold text-primary">Answer saved.</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {examState.sectionStatus.quiz === "active" && (
                        <div className="mt-5 flex justify-end">
                          <button
                            disabled={!allQuizAnswered}
                            onClick={() => advanceExamSection("manual")}
                            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Submit Quiz and Continue
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold">Section 2: Output Tracing</h3>
                          <p className="text-sm text-muted-foreground">3 questions, 5 marks each</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${getStatusTone(examState.sectionStatus.outputTracing)}`}>
                          {examState.sectionStatus.outputTracing.replace("_", " ")}
                        </span>
                      </div>
                      <div className="space-y-6">
                        {examWeek.mockTest.outputTracing.map((question, questionIndex) => {
                          const disabled = examState.sectionStatus.outputTracing !== "active";
                          const revealAnswer = examState.sectionStatus.outputTracing !== "active";
                          const givenOutput = examState.outputAnswers[questionIndex] ?? "";
                          const isCorrect =
                            normalizeOutput(givenOutput) !== "" &&
                            normalizeOutput(givenOutput) === normalizeOutput(question.expectedOutput);

                          return (
                            <div key={question.id} className="rounded-2xl border border-border bg-secondary/30 p-4">
                              <div className="mb-4 flex items-start justify-between gap-3">
                                <div>
                                  <h4 className="font-bold">{question.title}</h4>
                                  <p className="mt-1 text-sm text-muted-foreground">{question.prompt}</p>
                                </div>
                                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                                  {question.marks} marks
                                </span>
                              </div>

                              <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
                                <div className="flex items-center gap-2 bg-[#1e1e1e] px-4 py-2.5">
                                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                                  <span className="ml-2 font-mono text-xs text-gray-400">trace.cpp</span>
                                </div>
                                <Editor
                                  height={Math.min(40 + question.code.split("\n").length * 21, 360)}
                                  defaultLanguage="cpp"
                                  theme="varsiti-dark"
                                  value={question.code}
                                  beforeMount={handleBeforeMount}
                                  options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 13,
                                    scrollBeyondLastLine: false,
                                    lineNumbers: "on",
                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                  }}
                                />
                              </div>

                              <div className="mt-4 space-y-2">
                                <label className="text-sm font-semibold">Result</label>
                                <textarea
                                  value={givenOutput}
                                  onChange={(event) => handleOutputChange(questionIndex, event.target.value)}
                                  disabled={disabled}
                                  className="min-h-[110px] w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:bg-secondary/40"
                                  placeholder="Write the exact output here..."
                                />
                              </div>

                              {revealAnswer && (
                                <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm">
                                  <p className={`font-semibold ${isCorrect ? "text-green-600 dark:text-green-300" : "text-amber-600 dark:text-amber-300"}`}>
                                    {isCorrect ? "Correct output." : "Expected output"}
                                  </p>
                                  <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-muted-foreground">
                                    {question.expectedOutput}
                                  </pre>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {examState.sectionStatus.outputTracing === "active" && (
                        <div className="mt-5 flex justify-end">
                          <button
                            disabled={!allOutputAnswered}
                            onClick={() => advanceExamSection("manual")}
                            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Submit Output Tracing and Continue
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold">Section 3: Coding</h3>
                          <p className="text-sm text-muted-foreground">Easy, medium, and hard problems</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${getStatusTone(examState.sectionStatus.coding)}`}>
                          {examState.sectionStatus.coding.replace("_", " ")}
                        </span>
                      </div>

                      <div className="mb-5 flex flex-wrap gap-2">
                        {examWeek.mockTest.coding.map((question, index) => {
                          const result = examState.codingResults[question.id];
                          return (
                            <button
                              key={question.id}
                              onClick={() => setActiveCodingIndex(index)}
                              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                                activeCodingIndex === index
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-secondary/30 hover:bg-secondary"
                              }`}
                            >
                              {question.difficulty} • {question.maxScore}
                              {typeof result?.score === "number" ? ` • ${result.score}/${question.maxScore}` : ""}
                            </button>
                          );
                        })}
                      </div>

                      {currentCodingQuestion && (
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <h4 className="font-bold">{currentCodingQuestion.title}</h4>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  Difficulty: {currentCodingQuestion.difficulty} • Max marks: {currentCodingQuestion.maxScore}
                                </p>
                              </div>
                              {examState.codingResults[currentCodingQuestion.id] && (
                                <span className={`text-sm font-bold ${getEvalTone(examState.codingResults[currentCodingQuestion.id].status)}`}>
                                  {examState.codingResults[currentCodingQuestion.id].score ?? 0}/{currentCodingQuestion.maxScore}
                                </span>
                              )}
                            </div>
                            <div
                              className="text-sm leading-relaxed text-foreground/85"
                              dangerouslySetInnerHTML={{ __html: currentCodingQuestion.prompt }}
                            />
                          </div>

                          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
                              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1e1e1e] px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                                <span className="ml-2 font-mono text-xs text-gray-400">
                                  {currentCodingQuestion.id}.cpp
                                </span>
                              </div>
                              <button
                                onClick={() => handleEvaluateCoding(currentCodingQuestion)}
                                disabled={
                                  examState.sectionStatus.coding !== "active" ||
                                  evaluatingCodingId === currentCodingQuestion.id
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1 sm:px-6 sm:py-2 text-sm sm:text-base font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {evaluatingCodingId === currentCodingQuestion.id ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <Zap size={13} />
                                )}
                                {evaluatingCodingId === currentCodingQuestion.id ? "Scoring..." : "Evaluate Code"}
                              </button>
                            </div>
                            <Editor
                              height="420px"
                              defaultLanguage="cpp"
                              theme="varsiti-dark"
                              value={examState.codingAnswers[currentCodingQuestion.id]}
                              onChange={(value) =>
                                handleCodingChange(currentCodingQuestion.id, value || DEFAULT_STARTER)
                              }
                              beforeMount={handleBeforeMount}
                              onMount={handleEditorMount}
                              options={{
                                readOnly: examState.sectionStatus.coding !== "active",
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                fontLigatures: true,
                                scrollBeyondLastLine: false,
                                padding: { top: 16, bottom: 16 },
                                lineNumbers: "on",
                              }}
                            />
                          </div>

                          {examState.codingResults[currentCodingQuestion.id] && (
                            <div className="rounded-2xl border border-border bg-card p-4">
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <p className={`font-bold ${getEvalTone(examState.codingResults[currentCodingQuestion.id].status)}`}>
                                  {examState.codingResults[currentCodingQuestion.id].status.toUpperCase()}
                                </p>
                                <p className="text-sm font-semibold text-muted-foreground">
                                  Score: {examState.codingResults[currentCodingQuestion.id].score ?? 0}/
                                  {examState.codingResults[currentCodingQuestion.id].maxScore ?? currentCodingQuestion.maxScore}
                                </p>
                              </div>
                              <p className="text-sm leading-relaxed text-foreground/85">
                                {examState.codingResults[currentCodingQuestion.id].feedback}
                              </p>
                              {examState.codingResults[currentCodingQuestion.id].expectedOutput && (
                                <div className="mt-3">
                                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Expected Output / Notes
                                  </p>
                                  <pre className="whitespace-pre-wrap rounded-xl border border-border bg-secondary/30 p-3 text-xs">
                                    {examState.codingResults[currentCodingQuestion.id].expectedOutput}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {examState.sectionStatus.coding === "active" && (
                        <div className="mt-5 flex justify-end">
                          <button
                            disabled={!allCodingEvaluated}
                            onClick={() => advanceExamSection("manual")}
                            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Finish Exam
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-border bg-card p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Trophy size={18} className="text-primary" />
                    <h3 className="font-bold">Score Summary</h3>
                  </div>
                  <div className="space-y-3">
                    <ScoreRow label="Quiz" value={`${examState.scores.quiz}/10`} />
                    <ScoreRow label="Output Tracing" value={`${examState.scores.outputTracing}/15`} />
                    <ScoreRow label="Coding" value={`${examState.scores.coding}/25`} />
                    <div className="border-t border-border pt-3">
                      <ScoreRow label="Total" value={`${examState.scores.total}/${examWeek.mockTest.totalMarks}`} strong />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Clock3 size={18} className="text-primary" />
                    <h3 className="font-bold">Timer Rules</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li>Finish early to carry remaining time forward.</li>
                    <li>If time ends, the active section freezes automatically.</li>
                    <li>Refreshing the page keeps your saved progress and timer state.</li>
                  </ul>
                </div>

                {(examState.finalized || examState.started) && (
                  <button
                    onClick={resetMockTest}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-bold transition-colors hover:bg-secondary"
                  >
                    <TimerReset size={16} />
                    Reset Mock Test
                  </button>
                )}
              </div>
            </div>

            {examState.finalized && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">Completed</p>
                    <h3 className="text-2xl font-extrabold tracking-tight">Mock Test Finished</h3>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                      Review your section scores, check the revealed outputs, and revisit any coding feedback before your real exam.
                    </p>
                    {/* LinkedIn Share Button */}
                    <a
                      id="linkedin-share-btn"
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://varsiti.xyz")}&summary=${encodeURIComponent(`I scored ${examState.scores.total}/${examWeek!.mockTest.totalMarks} on a C++ OOP Mock Test on Varsiti — Pakistan's premier student coding hub! 🚀 #CppProgramming #OOP #Varsiti`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
                      style={{ backgroundColor: "#0077B5" }}
                    >
                      <Share2 size={15} />
                      Share on LinkedIn
                    </a>
                  </div>
                  <div className="rounded-3xl bg-card px-6 py-5 text-center shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Final Score</p>
                    <p className="mt-1 text-4xl font-black text-primary">
                      {examState.scores.total}/{examWeek!.mockTest.totalMarks}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-secondary/30 p-5">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <p className="mt-2 text-lg font-extrabold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{subtext}</p>
    </div>
  );
}

function ScoreRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={strong ? "font-bold" : "text-sm text-muted-foreground"}>{label}</span>
      <span className={strong ? "text-lg font-black text-primary" : "font-semibold"}>{value}</span>
    </div>
  );
}
