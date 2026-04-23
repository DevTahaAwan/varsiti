/**
 * monacoProviders.ts
 * Registers rich C++ language providers for Monaco Editor:
 *   - Completion (IntelliSense) with snippets & keyword suggestions
 *   - Hover documentation (MDN-style reference cards)
 *   - Signature help for common stdlib functions
 */

import type { Monaco } from "@monaco-editor/react";
import type * as MonacoType from "monaco-editor";

// ─────────────────────────────────────────────────────────────
// Reference data
// ─────────────────────────────────────────────────────────────

interface HoverDoc {
  signature: string;
  doc: string;
  link?: string;
}

const CPP_HOVER_DOCS: Record<string, HoverDoc> = {
  // --- I/O ---
  cout: {
    signature: "std::ostream std::cout",
    doc: "Standard output stream. Write data with the `<<` operator.\n\n**Example:**\n```cpp\nstd::cout << \"Hello, World!\" << std::endl;\n```",
    link: "https://en.cppreference.com/w/cpp/io/cout",
  },
  cin: {
    signature: "std::istream std::cin",
    doc: "Standard input stream. Read data with the `>>` operator.\n\n**Example:**\n```cpp\nint n;\nstd::cin >> n;\n```",
    link: "https://en.cppreference.com/w/cpp/io/cin",
  },
  cerr: {
    signature: "std::ostream std::cerr",
    doc: "Standard error stream (unbuffered). Use for error messages.\n\n**Example:**\n```cpp\nstd::cerr << \"Error: file not found\" << std::endl;\n```",
    link: "https://en.cppreference.com/w/cpp/io/cerr",
  },
  endl: {
    signature: "std::ostream& std::endl(std::ostream& os)",
    doc: "Output newline and flush the stream.\n\n> **Tip:** Prefer `'\\n'` over `endl` for performance — `endl` flushes the buffer.",
    link: "https://en.cppreference.com/w/cpp/io/manip/endl",
  },

  // --- Memory ---
  new: {
    signature: "void* operator new(std::size_t size)",
    doc: "Allocates heap memory and constructs an object. Pairs with `delete`.\n\n**Example:**\n```cpp\nint* p = new int(42);\ndelete p;\n```",
    link: "https://en.cppreference.com/w/cpp/language/new",
  },
  delete: {
    signature: "void operator delete(void* ptr)",
    doc: "Destroys an object and frees its heap memory. Always pair with `new` to avoid leaks.\n\n**Example:**\n```cpp\ndelete ptr;       // for single object\ndelete[] arr;     // for arrays\n```",
    link: "https://en.cppreference.com/w/cpp/language/delete",
  },
  malloc: {
    signature: "void* malloc(std::size_t size)",
    doc: "Allocates `size` bytes of uninitialised memory. Returns `nullptr` on failure.\n\n> Prefer `new` in C++ — it also calls the constructor.",
    link: "https://en.cppreference.com/w/c/memory/malloc",
  },
  free: {
    signature: "void free(void* ptr)",
    doc: "Releases memory previously allocated by `malloc`, `calloc`, or `realloc`.\n\n> Prefer `delete` in C++ when using `new`.",
    link: "https://en.cppreference.com/w/c/memory/free",
  },

  // --- OOP keywords ---
  class: {
    signature: "class ClassName { ... };",
    doc: "Defines a class. Members are **private** by default.\n\n**Example:**\n```cpp\nclass Dog {\npublic:\n    std::string name;\n    void bark() { std::cout << \"Woof!\"; }\n};\n```",
    link: "https://en.cppreference.com/w/cpp/language/class",
  },
  struct: {
    signature: "struct StructName { ... };",
    doc: "Like `class` but members are **public** by default. Commonly used for plain data.",
    link: "https://en.cppreference.com/w/cpp/language/class",
  },
  public: {
    signature: "public:",
    doc: "Access specifier — members accessible from anywhere.",
    link: "https://en.cppreference.com/w/cpp/language/access",
  },
  private: {
    signature: "private:",
    doc: "Access specifier — members accessible only from within the same class.",
    link: "https://en.cppreference.com/w/cpp/language/access",
  },
  protected: {
    signature: "protected:",
    doc: "Access specifier — members accessible from within the class and derived classes.",
    link: "https://en.cppreference.com/w/cpp/language/access",
  },
  virtual: {
    signature: "virtual ReturnType functionName();",
    doc: "Marks a member function for **runtime polymorphism** (dynamic dispatch).\nOverride in derived classes with `override`.\n\n**Example:**\n```cpp\nclass Shape {\npublic:\n    virtual double area() const = 0; // pure virtual\n};\n```",
    link: "https://en.cppreference.com/w/cpp/language/virtual",
  },
  override: {
    signature: "ReturnType functionName() override;",
    doc: "Explicitly marks a virtual function as overriding a base class version. Causes a **compile error** if no matching base function exists — catches typos.",
    link: "https://en.cppreference.com/w/cpp/language/override",
  },
  abstract: {
    signature: "virtual ReturnType fn() = 0;",
    doc: "A pure virtual function (`= 0`) makes the class abstract — it cannot be instantiated directly.",
    link: "https://en.cppreference.com/w/cpp/language/abstract_class",
  },
  this: {
    signature: "ClassName* this",
    doc: "Pointer to the current object. Use inside member functions to refer to the instance.\n\n**Example:**\n```cpp\nvoid setName(std::string name) {\n    this->name = name; // disambiguate\n}\n```",
    link: "https://en.cppreference.com/w/cpp/language/this",
  },
  static: {
    signature: "static type member;",
    doc: "When used in a class, `static` members belong to the class itself, not to any instance. Shared across all objects.",
    link: "https://en.cppreference.com/w/cpp/language/static",
  },
  const: {
    signature: "const type variable;",
    doc: "Marks a variable or method as immutable. A `const` member function cannot modify the object's state.",
    link: "https://en.cppreference.com/w/cpp/language/cv",
  },
  friend: {
    signature: "friend class/function;",
    doc: "Grants another class or function access to private/protected members.",
    link: "https://en.cppreference.com/w/cpp/language/friend",
  },
  inline: {
    signature: "inline ReturnType functionName() { ... }",
    doc: "Suggests to the compiler to expand the function body at the call site. Reduces function-call overhead for small functions.",
    link: "https://en.cppreference.com/w/cpp/language/inline",
  },
  namespace: {
    signature: "namespace Name { ... }",
    doc: "Groups related declarations to prevent name collisions.\n\n**Example:**\n```cpp\nnamespace math {\n    double pi = 3.14159;\n}\n```",
    link: "https://en.cppreference.com/w/cpp/language/namespace",
  },
  template: {
    signature: "template<typename T>",
    doc: "Enables **generic programming** — write code that works with any type.\n\n**Example:**\n```cpp\ntemplate<typename T>\nT max(T a, T b) { return a > b ? a : b; }\n```",
    link: "https://en.cppreference.com/w/cpp/language/templates",
  },
  typename: {
    signature: "typename T",
    doc: "Used in templates to declare a type parameter.",
    link: "https://en.cppreference.com/w/cpp/language/typename",
  },

  // --- Control flow ---
  if: { signature: "if (condition) { ... }", doc: "Executes the block only when `condition` is true." },
  else: { signature: "else { ... }", doc: "Executes when the preceding `if` condition is false." },
  for: { signature: "for (init; condition; increment) { ... }", doc: "Counted loop. Also support range-based: `for (auto& x : container)`." },
  while: { signature: "while (condition) { ... }", doc: "Loops as long as `condition` is true. Checks condition before each iteration." },
  do: { signature: "do { ... } while (condition);", doc: "Like `while` but checks condition *after* executing the body at least once." },
  switch: { signature: "switch (expr) { case val: ... break; }", doc: "Selects from multiple code paths based on the value of `expr`." },
  break: { signature: "break;", doc: "Exits the nearest enclosing loop or switch statement." },
  continue: { signature: "continue;", doc: "Skips the rest of the current loop iteration and moves to the next." },
  return: { signature: "return value;", doc: "Exits the current function and optionally returns a value to the caller." },

  // --- Types ---
  int: { signature: "int", doc: "Signed 32-bit integer. Range: −2,147,483,648 to 2,147,483,647.", link: "https://en.cppreference.com/w/cpp/language/types" },
  float: { signature: "float", doc: "Single-precision 32-bit floating-point number (~7 significant digits).", link: "https://en.cppreference.com/w/cpp/language/types" },
  double: { signature: "double", doc: "Double-precision 64-bit floating-point number (~15 significant digits).", link: "https://en.cppreference.com/w/cpp/language/types" },
  char: { signature: "char", doc: "Single character (8-bit). Use single quotes: `'A'`.", link: "https://en.cppreference.com/w/cpp/language/types" },
  bool: { signature: "bool", doc: "Boolean value: `true` or `false`.", link: "https://en.cppreference.com/w/cpp/language/types" },
  void: { signature: "void", doc: "Represents the absence of a type. Used for functions that return nothing.", link: "https://en.cppreference.com/w/cpp/language/types" },
  auto: { signature: "auto", doc: "Automatically deduces the variable's type from its initializer (C++11+).\n\n**Example:** `auto x = 3.14;` → `double`", link: "https://en.cppreference.com/w/cpp/language/auto" },
  nullptr: { signature: "nullptr", doc: "A null pointer constant (C++11+). Prefer over the legacy `NULL` macro.", link: "https://en.cppreference.com/w/cpp/language/nullptr" },

  // --- STL containers ---
  vector: {
    signature: "std::vector<T>",
    doc: "A dynamic array that automatically resizes.\n\n**Common methods:**\n- `push_back(val)` — append\n- `pop_back()` — remove last\n- `size()` — element count\n- `at(i)` — bounds-checked access\n- `begin() / end()` — iterators",
    link: "https://en.cppreference.com/w/cpp/container/vector",
  },
  map: {
    signature: "std::map<Key, Value>",
    doc: "Ordered key-value store (red-black tree, O(log n)).\n\n**Example:**\n```cpp\nstd::map<std::string, int> scores;\nscores[\"Alice\"] = 95;\n```",
    link: "https://en.cppreference.com/w/cpp/container/map",
  },
  unordered_map: {
    signature: "std::unordered_map<Key, Value>",
    doc: "Hash-map key-value store (O(1) average). Faster than `std::map` but unordered.",
    link: "https://en.cppreference.com/w/cpp/container/unordered_map",
  },
  set: {
    signature: "std::set<T>",
    doc: "Ordered collection of unique elements (red-black tree, O(log n)).",
    link: "https://en.cppreference.com/w/cpp/container/set",
  },
  stack: {
    signature: "std::stack<T>",
    doc: "LIFO (Last In, First Out) adapter.\n\n**Methods:** `push()`, `pop()`, `top()`, `empty()`.",
    link: "https://en.cppreference.com/w/cpp/container/stack",
  },
  queue: {
    signature: "std::queue<T>",
    doc: "FIFO (First In, First Out) adapter.\n\n**Methods:** `push()`, `pop()`, `front()`, `back()`, `empty()`.",
    link: "https://en.cppreference.com/w/cpp/container/queue",
  },
  string: {
    signature: "std::string",
    doc: "Dynamic character string.\n\n**Common methods:**\n- `length()` / `size()`\n- `substr(pos, len)`\n- `find(str)`\n- `append(str)` / `+` operator\n- `c_str()` — C-style string pointer",
    link: "https://en.cppreference.com/w/cpp/string/basic_string",
  },
  pair: {
    signature: "std::pair<T1, T2>",
    doc: "Stores two heterogeneous values as `.first` and `.second`.\n\n**Example:**\n```cpp\nstd::pair<int,std::string> p = {1, \"hello\"};\nstd::cout << p.first; // 1\n```",
    link: "https://en.cppreference.com/w/cpp/utility/pair",
  },

  // --- Algorithms ---
  sort: {
    signature: "std::sort(first, last [, comp])",
    doc: "Sorts elements in `[first, last)` in ascending order (O(n log n)).\n\n**Example:**\n```cpp\nstd::vector<int> v = {3,1,2};\nstd::sort(v.begin(), v.end());\n```",
    link: "https://en.cppreference.com/w/cpp/algorithm/sort",
  },
  find: {
    signature: "std::find(first, last, value)",
    doc: "Returns an iterator to the first element equal to `value`, or `last` if not found.",
    link: "https://en.cppreference.com/w/cpp/algorithm/find",
  },
  max: {
    signature: "std::max(a, b [, comp])",
    doc: "Returns the greater of two values.",
    link: "https://en.cppreference.com/w/cpp/algorithm/max",
  },
  min: {
    signature: "std::min(a, b [, comp])",
    doc: "Returns the smaller of two values.",
    link: "https://en.cppreference.com/w/cpp/algorithm/min",
  },
  swap: {
    signature: "std::swap(a, b)",
    doc: "Exchanges the values of `a` and `b`.",
    link: "https://en.cppreference.com/w/cpp/algorithm/swap",
  },
  reverse: {
    signature: "std::reverse(first, last)",
    doc: "Reverses the elements in the range `[first, last)`.",
    link: "https://en.cppreference.com/w/cpp/algorithm/reverse",
  },
  accumulate: {
    signature: "std::accumulate(first, last, init [, op])",
    doc: "Computes the sum (or result of `op`) of elements in `[first, last)` starting with `init`.\n\nRequires `#include <numeric>`.",
    link: "https://en.cppreference.com/w/cpp/algorithm/accumulate",
  },

  // --- Smart pointers ---
  unique_ptr: {
    signature: "std::unique_ptr<T>",
    doc: "Exclusive-ownership smart pointer. Object is destroyed when pointer goes out of scope.\n\n**Example:**\n```cpp\nauto p = std::make_unique<Dog>(\"Rex\");\n```",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr",
  },
  shared_ptr: {
    signature: "std::shared_ptr<T>",
    doc: "Reference-counted smart pointer. Object lives until the last `shared_ptr` to it is destroyed.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr",
  },
  make_unique: {
    signature: "std::make_unique<T>(args...)",
    doc: "Creates a `unique_ptr<T>` — preferred over `new`.\n\n**Example:**\n```cpp\nauto dog = std::make_unique<Dog>(\"Rex\", 3);\n```",
    link: "https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique",
  },
  make_shared: {
    signature: "std::make_shared<T>(args...)",
    doc: "Creates a `shared_ptr<T>`. More efficient than `shared_ptr<T>(new T(...))`.",
    link: "https://en.cppreference.com/w/cpp/memory/shared_ptr/make_shared",
  },

  // --- Math ---
  sqrt: { signature: "double sqrt(double x)", doc: "Returns the square root of `x`. Requires `#include <cmath>`.", link: "https://en.cppreference.com/w/cpp/numeric/math/sqrt" },
  pow: { signature: "double pow(double base, double exp)", doc: "Returns `base` raised to the power `exp`. Requires `#include <cmath>`.", link: "https://en.cppreference.com/w/cpp/numeric/math/pow" },
  abs: { signature: "T abs(T x)", doc: "Returns the absolute value of `x`. For integers use `<cstdlib>`, for floats `<cmath>`.", link: "https://en.cppreference.com/w/cpp/numeric/math/abs" },
  floor: { signature: "double floor(double x)", doc: "Rounds `x` downward. Requires `#include <cmath>`.", link: "https://en.cppreference.com/w/cpp/numeric/math/floor" },
  ceil: { signature: "double ceil(double x)", doc: "Rounds `x` upward. Requires `#include <cmath>`.", link: "https://en.cppreference.com/w/cpp/numeric/math/ceil" },
  round: { signature: "double round(double x)", doc: "Rounds `x` to the nearest integer. Requires `#include <cmath>`.", link: "https://en.cppreference.com/w/cpp/numeric/math/round" },

  // --- String utils ---
  stoi: { signature: "int stoi(const std::string& str, size_t* pos = nullptr, int base = 10)", doc: "Converts a string to `int`. Throws `std::invalid_argument` or `std::out_of_range` on failure.", link: "https://en.cppreference.com/w/cpp/string/basic_string/stol" },
  stod: { signature: "double stod(const std::string& str)", doc: "Converts a string to `double`.", link: "https://en.cppreference.com/w/cpp/string/basic_string/stof" },
  to_string: { signature: "std::string to_string(val)", doc: "Converts a numeric value to its `std::string` representation.", link: "https://en.cppreference.com/w/cpp/string/basic_string/to_string" },
  getline: { signature: "std::istream& getline(std::istream& is, std::string& str)", doc: "Reads a full line from the stream into `str` (including spaces).\n\n**Example:**\n```cpp\nstd::string line;\nstd::getline(std::cin, line);\n```", link: "https://en.cppreference.com/w/cpp/string/basic_string/getline" },

  // --- exceptions ---
  try: { signature: "try { ... } catch (ExType& e) { ... }", doc: "Starts a block that may throw exceptions. Pair with `catch`." },
  catch: { signature: "catch (ExceptionType& e) { ... }", doc: "Handles exceptions thrown in the preceding `try` block." },
  throw: { signature: "throw expression;", doc: "Throws an exception. Control transfers to the nearest matching `catch` block.", link: "https://en.cppreference.com/w/cpp/language/throw" },
  exception: { signature: "std::exception", doc: "Base class for all standard library exceptions. Override `what()` for custom messages.", link: "https://en.cppreference.com/w/cpp/error/exception" },
  runtime_error: { signature: "std::runtime_error(const std::string& msg)", doc: "Standard exception for runtime errors. Requires `#include <stdexcept>`.", link: "https://en.cppreference.com/w/cpp/error/runtime_error" },
};

// ─────────────────────────────────────────────────────────────
// Completion items
// ─────────────────────────────────────────────────────────────

interface CompletionSnippet {
  label: string;
  kind: "keyword" | "function" | "class" | "snippet" | "variable" | "module";
  detail?: string;
  doc?: string;
  insertText: string;
  isSnippet?: boolean;
}

const CPP_COMPLETIONS: CompletionSnippet[] = [
  // — Keywords (non-snippet) —
  ...(["return", "break", "continue", "this", "nullptr", "true", "false",
    "const", "static", "inline", "friend", "explicit", "mutable",
    "enum", "union", "operator", "delete", "new", "class", "struct",
    "for", "while", "if", "else", "try", "catch", "template", "typename",
    "virtual", "override", "public", "private", "protected", "namespace", "using"] as const).map(kw => ({
    label: kw,
    kind: "keyword" as const,
    insertText: kw,
  })),

  // — Types —
  ...["int", "float", "double", "char", "bool", "void", "auto",
    "long", "short", "unsigned", "signed", "wchar_t",
    "size_t", "ptrdiff_t", "uint8_t", "uint16_t", "uint32_t", "uint64_t",
    "int8_t", "int16_t", "int32_t", "int64_t"].map(t => ({
    label: t,
    kind: "keyword" as const,
    detail: "Built-in type",
    insertText: t,
  })),

  // — STL types —
  ...["std::string", "std::vector", "std::map", "std::unordered_map",
    "std::set", "std::unordered_set", "std::stack", "std::queue",
    "std::deque", "std::list", "std::array", "std::pair", "std::tuple",
    "std::optional", "std::variant", "std::any",
    "std::unique_ptr", "std::shared_ptr", "std::weak_ptr",
    "std::cout", "std::cin", "std::cerr", "std::endl",
    "std::sort", "std::find", "std::max", "std::min", "std::swap",
    "std::move", "std::forward", "std::make_unique", "std::make_shared",
    "std::to_string", "std::stoi", "std::stod", "std::getline",
    "std::exception", "std::runtime_error", "std::logic_error",
    "std::overflow_error", "std::out_of_range"
  ].map(s => ({
    label: s,
    kind: "class" as const,
    detail: "C++ Standard Library",
    insertText: s,
  })),

  // — Common headers —
  ...["iostream", "string", "vector", "map", "unordered_map", "set",
    "algorithm", "numeric", "cmath", "cstdlib", "cassert",
    "fstream", "sstream", "stdexcept", "memory", "functional",
    "utility", "tuple", "array", "stack", "queue", "deque",
    "iterator", "limits", "chrono", "thread", "mutex",
    "type_traits", "initializer_list"
  ].map(h => ({
    label: `#include <${h}>`,
    kind: "module" as const,
    detail: "Standard header",
    insertText: `#include <${h}>`,
  })),
];

// ─────────────────────────────────────────────────────────────
// Signature help data
// ─────────────────────────────────────────────────────────────

interface SigData {
  label: string;
  doc: string;
  params: Array<{ label: string; doc: string }>;
}

const SIGNATURES: Record<string, SigData> = {
  printf: {
    label: "printf(const char* format, ...)",
    doc: "Prints formatted output. Requires `#include <cstdio>`.",
    params: [
      { label: "format", doc: "Format string with `%d`, `%s`, `%f`, etc." },
      { label: "...", doc: "Values to substitute into the format string." },
    ],
  },
  scanf: {
    label: "scanf(const char* format, ...)",
    doc: "Reads formatted input. Requires `#include <cstdio>`.",
    params: [
      { label: "format", doc: "Format string with `%d`, `%s`, `%f`, etc." },
      { label: "...", doc: "Pointers to variables where values are stored." },
    ],
  },
  push_back: {
    label: "push_back(const value_type& val)",
    doc: "Appends `val` to the end of the container.",
    params: [{ label: "val", doc: "The value to append." }],
  },
  sort2: {
    label: "sort(RandomIt first, RandomIt last [, Compare comp])",
    doc: "Sorts elements in [first, last). O(n log n).",
    params: [
      { label: "first", doc: "Iterator to the beginning of the range." },
      { label: "last", doc: "Iterator past the end of the range." },
      { label: "comp", doc: "Optional comparator function." },
    ],
  },
  substr: {
    label: "substr(size_t pos = 0, size_t len = npos)",
    doc: "Returns a substring starting at `pos` with length `len`.",
    params: [
      { label: "pos", doc: "Start position (0-indexed)." },
      { label: "len", doc: "Number of characters to include. Default = rest of string." },
    ],
  },
  find2: {
    label: "find(const string& str, size_t pos = 0)",
    doc: "Finds the first occurrence of `str` starting from `pos`. Returns `npos` if not found.",
    params: [
      { label: "str", doc: "Substring to find." },
      { label: "pos", doc: "Start position for the search." },
    ],
  },
  stoi2: {
    label: "stoi(const string& str, size_t* pos = nullptr, int base = 10)",
    doc: "Converts `str` to an `int`.",
    params: [
      { label: "str", doc: "Input string." },
      { label: "pos", doc: "If provided, set to the position of the first non-converted character." },
      { label: "base", doc: "Numeric base (default 10)." },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// Custom editor theme
// ─────────────────────────────────────────────────────────────

export function defineVarsitiTheme(monaco: Monaco) {
  monaco.editor.defineTheme("varsiti-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword",            foreground: "C792EA", fontStyle: "bold" },
      { token: "keyword.control",    foreground: "F07178", fontStyle: "bold" },
      { token: "storage.type",       foreground: "C792EA" },
      { token: "string",             foreground: "C3E88D" },
      { token: "string.escape",      foreground: "FFCB6B" },
      { token: "comment",            foreground: "546E7A", fontStyle: "italic" },
      { token: "number",             foreground: "F78C6C" },
      { token: "type",               foreground: "FFCB6B" },
      { token: "identifier",         foreground: "EEFFFF" },
      { token: "delimiter",          foreground: "89DDFF" },
      { token: "operator",           foreground: "89DDFF" },
      { token: "namespace",          foreground: "FFCB6B" },
      { token: "preprocessor",       foreground: "C3E88D" },
    ],
    colors: {
      "editor.background":            "#0F111A",
      "editor.foreground":            "#EEFFFF",
      "editorLineNumber.foreground":  "#3B4261",
      "editorLineNumber.activeForeground": "#C792EA",
      "editor.selectionBackground":   "#717CB425",
      "editor.lineHighlightBackground": "#1A1C25",
      "editorCursor.foreground":      "#FFCC00",
      "editorBracketMatch.background":"#C792EA33",
      "editorBracketMatch.border":    "#C792EA",
      "editorSuggestWidget.background": "#1A1C25",
      "editorSuggestWidget.border":   "#2D3151",
      "editorSuggestWidget.selectedBackground": "#C792EA22",
      "editorHoverWidget.background": "#1A1C25",
      "editorHoverWidget.border":     "#2D3151",
      "editorWidget.background":      "#1A1C25",
      "input.background":             "#0F111A",
      "scrollbar.shadow":             "#00000000",
      "scrollbarSlider.background":   "#2D315144",
      "scrollbarSlider.hoverBackground": "#2D315188",
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Provider registration (call once per Monaco instance)
// ─────────────────────────────────────────────────────────────


const MONACO_KIND: Record<CompletionSnippet["kind"], number> = {
  keyword:  14,  // Keyword
  function: 1,   // Function  (unused here)
  class:    5,   // Class
  snippet:  27,  // Snippet
  variable: 4,   // Variable
  module:   8,   // Module
};

let _registered = false;

export function registerCppProviders(monaco: Monaco) {
  if (_registered) return;
  _registered = true;

  const lang = "cpp";

  // ── 1. Completion provider ──────────────────────────────────
  monaco.languages.registerCompletionItemProvider(lang, {
    triggerCharacters: [".", ":", "#", "<", "\"", " "],
    provideCompletionItems(model: MonacoType.editor.ITextModel, position: MonacoType.Position) {
      const wordInfo = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber:   position.lineNumber,
        startColumn:     wordInfo.startColumn,
        endColumn:       wordInfo.endColumn,
      };

      const lineText = model.getLineContent(position.lineNumber);
      const textBefore = lineText.slice(0, position.column - 1);

      const fullText = model.getValue();
      const hasUsingNamespaceStd = /using\s+namespace\s+std\s*;/.test(fullText);

      // Context-aware: after "std::" suggest only std members
      if (textBefore.endsWith("std::")) {
        const stdItems = CPP_COMPLETIONS.filter(c => c.label.startsWith("std::")).map(c => ({
          label: c.label.replace("std::", ""),
          kind:  MONACO_KIND[c.kind],
          detail: c.detail,
          insertText: c.insertText.replace("std::", ""),
          range,
        }));
        return { suggestions: stdItems };
      }

      const suggestions = CPP_COMPLETIONS.map(c => {
        let label = c.label;
        let insertText = c.insertText;

        if (label.startsWith("std::")) {
           label = label.replace("std::", "");
           insertText = hasUsingNamespaceStd ? label : c.label;
        }

        const hoverInfo = CPP_HOVER_DOCS[c.label] || CPP_HOVER_DOCS[c.label.replace("std::", "")];
        return {
          label:  label,
          kind:   MONACO_KIND[c.kind],
          detail: c.detail || hoverInfo?.signature,
          documentation: {
            value: hoverInfo
              ? `${hoverInfo.doc}${hoverInfo.link ? `\n\n[📖 cppreference](${hoverInfo.link})` : ""}`
              : (c.doc || ""),
            isTrusted: true,
            supportHtml: false,
          },
          insertText:       insertText,
          insertTextRules:  c.isSnippet ? 4 : 0, // 4 = InsertAsSnippet
          range,
          sortText: c.isSnippet ? "0" + label : "1" + label, // snippets first
        };
      });

      return { suggestions };
    },
  });

  // ── 2. Hover provider ───────────────────────────────────────
  monaco.languages.registerHoverProvider(lang, {
    provideHover(model: MonacoType.editor.ITextModel, position: MonacoType.Position) {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      // Try the word as-is, or with std:: prefix
      const info =
        CPP_HOVER_DOCS[word.word] ||
        CPP_HOVER_DOCS[`std::${word.word}`];

      if (!info) return null;

      const mdContent = [
        "```cpp",
        info.signature,
        "```",
        "",
        info.doc,
        info.link ? `\n\n---\n[📖 View on cppreference.com](${info.link})` : "",
      ].join("\n");

      return {
        range: new monaco.Range(
          position.lineNumber, word.startColumn,
          position.lineNumber, word.endColumn
        ),
        contents: [{ value: mdContent, isTrusted: true }],
      };
    },
  });

  // ── 3. Signature help provider ──────────────────────────────
  monaco.languages.registerSignatureHelpProvider(lang, {
    signatureHelpTriggerCharacters:   ["(", ","],
    signatureHelpRetriggerCharacters: [","],
    provideSignatureHelp(model: MonacoType.editor.ITextModel, position: MonacoType.Position) {
      const lineText = model.getLineContent(position.lineNumber).slice(0, position.column - 1);
      const match    = lineText.match(/(\w+)\s*\(([^)]*)$/);
      if (!match) return null;

      const fnName = match[1];
      const sig    = SIGNATURES[fnName] ||
                     SIGNATURES[fnName + "2"] as SigData | undefined;
      if (!sig) return null;

      // Count commas to figure out active parameter
      const argsText   = match[2];
      const activeParam = (argsText.match(/,/g) || []).length;

      return {
        dispose() {},
        value: {
          activeSignature: 0,
          activeParameter: Math.min(activeParam, sig.params.length - 1),
          signatures: [{
            label: sig.label,
            documentation: { value: sig.doc },
            parameters: sig.params.map(p => ({
              label:         p.label,
              documentation: { value: p.doc },
            })),
          }],
        },
      };
    },
  });

  // ── 4. Extra editor configuration ──────────────────────────
  // Bracket colorization & auto-closing are handled via editor options
}
