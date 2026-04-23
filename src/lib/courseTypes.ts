export type TheoryItem = {
  title: string;
  explanation: string[];
  keyPoints: string[];
  code?: string;
};

export type PracticeQuestion = {
  title: string;
  prompt: string;
  starter?: string;
  template?: string;
  solution?: string;
  question?: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
  mark?: number;
  q?: string;
  correct?: number;
};

export type ExamRules = {
  title: string;
  explanation: string[];
  keyPoints: string[];
};

export type OutputTracingQuestion = {
  id: string;
  title: string;
  prompt: string;
  code: string;
  expectedOutput: string;
  marks: number;
};

export type CodingQuestion = {
  id: string;
  title: string;
  prompt: string;
  starter: string;
  solution?: string;
  difficulty: "easy" | "medium" | "hard";
  maxScore: number;
};

export type MockTestSectionTimers = {
  quizMinutes: number;
  outputTracingMinutes: number;
  codingMinutes: number;
};

export type ExamMockTest = {
  quiz: QuizQuestion[];
  outputTracing: OutputTracingQuestion[];
  coding: CodingQuestion[];
  timers: MockTestSectionTimers;
  totalMarks: number;
};

export type StudyWeekData = {
  week: number;
  type: "study";
  title: string;
  outline: string[];
  theory: TheoryItem[];
  practice: PracticeQuestion[];
  quiz: QuizQuestion[];
};

export type ExamWeekData = {
  week: number;
  type: "exam";
  title: string;
  outline: string[];
  durationMinutes: number;
  rules: ExamRules;
  mockTest: ExamMockTest;
  theory?: TheoryItem[];
  practice?: PracticeQuestion[];
  quiz?: QuizQuestion[];
};

export type CourseWeek = StudyWeekData | ExamWeekData;
