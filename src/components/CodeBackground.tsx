"use client";

// Static floating C++ code symbols in the background
// Hardcoded positions prevent hydration mismatches
const SYMBOLS = [
  // [symbol, left%, top%, size(rem), opacity, animDuration(s), animDelay(s)]
  ["{}",    5,  8, 1.8, 0.13, 18, 0],
  ["}",    12, 72, 1.4, 0.11, 22, 3],
  ["{",    90, 15, 2.2, 0.14, 20, 1],
  ["()",   22, 45, 1.6, 0.12, 24, 5],
  [";",    78, 80, 2.0, 0.15, 16, 2],
  ["<<",   55, 12, 1.5, 0.12, 19, 4],
  [">>",   38, 88, 1.3, 0.11, 21, 0],
  ["::",    8, 55, 1.7, 0.12, 23, 6],
  ["[]",   65, 35, 1.4, 0.12, 17, 1],
  ["&&",   85, 60, 1.6, 0.13, 25, 3],
  ["||",   30, 25, 1.3, 0.11, 20, 5],
  ["++",   48, 65, 1.9, 0.13, 18, 2],
  ["*",    72,  8, 2.4, 0.14, 22, 4],
  ["#",    18, 92, 1.5, 0.12, 19, 0],
  ["<T>",  93, 45, 1.4, 0.11, 21, 6],
  ["//",   42, 18, 1.6, 0.13, 24, 3],
  ["!=",   60, 75, 1.5, 0.11, 17, 1],
  ["->",   25, 38, 1.8, 0.13, 20, 5],
  ["class",82, 28, 1.2, 0.10, 26, 2],
  ["void", 15, 18, 1.1, 0.10, 23, 4],
  ["int",  50, 92, 1.1, 0.10, 18, 0],
  ["return",70,50, 1.0, 0.09, 21, 6],
  ["=",    35, 60, 2.0, 0.12, 16, 3],
  ["0xFF",  6, 38, 1.2, 0.10, 22, 1],
  ["~",    88, 90, 1.8, 0.12, 19, 5],
] as const;

export default function CodeBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none" aria-hidden>
      {SYMBOLS.map(([sym, left, top, size, opacity, dur, delay], i) => (
        <span
          key={i}
          className="absolute font-mono font-bold"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            fontSize: `${size}rem`,
            opacity: Math.min(opacity * 8, 0.82),
            color: "var(--primary)",
            textShadow: "0 0 10px color-mix(in oklab, var(--primary) 55%, transparent)",
            animation: `float-code ${dur}s ease-in-out ${delay}s infinite`,
            willChange: "transform",
          }}
        >
          {sym}
        </span>
      ))}
    </div>
  );
}
