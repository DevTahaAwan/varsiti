import type {
  CodingQuestion,
  CourseWeek,
  ExamWeekData,
  OutputTracingQuestion,
  PracticeQuestion,
  QuizQuestion,
  StudyWeekData,
  TheoryItem,
} from "@/lib/courseTypes";

const CPP_STARTER = `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`;

function studyWeek(input: Omit<StudyWeekData, "type">): StudyWeekData {
  return { ...input, type: "study" };
}

function examWeek(input: Omit<ExamWeekData, "type">): ExamWeekData {
  return { ...input, type: "exam" };
}

function theory(title: string, explanation: string[], keyPoints: string[], code?: string): TheoryItem {
  return { title, explanation, keyPoints, code };
}

function practice(title: string, prompt: string, starter = CPP_STARTER): PracticeQuestion {
  return { title, prompt, starter };
}

function quiz(question: string, options: string[], answer: number, explanation: string): QuizQuestion {
  return { question, options, answer, explanation };
}

function trace(
  id: string,
  title: string,
  prompt: string,
  code: string,
  expectedOutput: string,
): OutputTracingQuestion {
  return { id, title, prompt, code, expectedOutput, marks: 5 };
}

function coding(
  id: string,
  title: string,
  prompt: string,
  difficulty: "easy" | "medium" | "hard",
  maxScore: number,
  starter = CPP_STARTER,
): CodingQuestion {
  return { id, title, prompt, difficulty, maxScore, starter };
}

export const fundamentalsData: CourseWeek[] = [
  studyWeek({
    week: 1,
    title: "Introduction to Programming and Environment Setup",
    outline: [
      "What programming is and how C++ programs run",
      "Compiler, editor, terminal, and source file setup",
      "Writing, compiling, and running Hello World",
      "Basic program structure and comments",
    ],
    theory: [
      theory(
        "What Is Programming?",
        [
          "Programming is the process of writing step-by-step instructions that a computer can execute.",
          "A C++ program starts as human-readable source code, then a compiler translates it into a program the machine can run.",
          "Good programs solve a clear problem, use readable names, and produce predictable output.",
        ],
        [
          "A program is a sequence of instructions.",
          "Source code must be compiled before it runs in C++.",
          "Small, testable programs are easier to debug than large unplanned programs.",
        ],
      ),
      theory(
        "C++ Program Structure",
        [
          "Most beginner C++ programs include a header, use the standard namespace, and define a main function.",
          "`main` is the entry point. Statements inside it run from top to bottom.",
          "Curly braces group code, semicolons end statements, and comments explain intent.",
        ],
        [
          "`#include <iostream>` enables console input and output.",
          "`int main()` is where execution begins.",
          "`return 0;` signals successful completion.",
        ],
        `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Varsiti!" << endl;
    return 0;
}`,
      ),
      theory(
        "Environment Setup Workflow",
        [
          "A beginner workflow has three parts: write code, compile code, and run the executable.",
          "Compiler errors happen before the program runs. Runtime errors happen while the program is executing.",
          "Build the habit of saving, compiling, reading errors carefully, and testing with small changes.",
        ],
        [
          "Use a `.cpp` file for C++ source code.",
          "Compiler messages usually point to the line and type of mistake.",
          "Fix the first clear error before chasing the rest.",
        ],
      ),
    ],
    practice: [
      practice(
        "Hello Varsiti",
        "Write a C++ program that prints your name on the first line and `I am learning Programming Fundamentals` on the second line.",
      ),
      practice(
        "Program Skeleton",
        "Create a complete C++ program with a comment above `main`, one `cout` statement, and `return 0;`.",
      ),
    ],
    quiz: [
      quiz("Which function is the entry point of a C++ program?", ["start", "main", "run", "execute"], 1, "`main` is where a C++ program begins execution."),
      quiz("What does a compiler do?", ["Runs the keyboard", "Translates source code", "Stores variables only", "Formats output"], 1, "The compiler translates C++ source code into machine-executable code."),
      quiz("Which header is commonly used for `cout` and `cin`?", ["<math.h>", "<fstream>", "<iostream>", "<string.h>"], 2, "`iostream` provides standard input and output streams."),
      quiz("What ends most C++ statements?", ["Colon", "Semicolon", "Comma", "Period"], 1, "Most C++ statements end with a semicolon."),
      quiz("What is the purpose of comments?", ["To explain code", "To compile faster", "To allocate memory", "To replace variables"], 0, "Comments help humans understand the code and are ignored by the compiler."),
    ],
  }),
  studyWeek({
    week: 2,
    title: "Variables, Data Types, and Basic I/O",
    outline: [
      "Variables and memory locations",
      "Primitive data types: int, float, double, char, bool",
      "Input with cin and output with cout",
      "Formatting readable console output",
    ],
    theory: [
      theory(
        "Variables and Data Types",
        [
          "A variable is a named memory location used to store a value while a program runs.",
          "The data type tells C++ what kind of value can be stored and how much memory is needed.",
          "Choosing the right type helps avoid wasted memory, incorrect calculations, and unclear code.",
        ],
        [
          "`int` stores whole numbers.",
          "`double` stores decimal values with better precision than `float`.",
          "`char` stores a single character and `bool` stores true or false.",
        ],
      ),
      theory(
        "Console Input and Output",
        [
          "`cout` sends data from the program to the console.",
          "`cin` reads data from the keyboard into variables.",
          "Prompts should tell the user exactly what value to enter.",
        ],
        [
          "Use `<<` with `cout`.",
          "Use `>>` with `cin`.",
          "Declare variables before reading input into them.",
        ],
        `int age;
cout << "Enter your age: ";
cin >> age;
cout << "Age: " << age << endl;`,
      ),
      theory(
        "Readable Output",
        [
          "Output formatting makes program results easier to understand.",
          "Labels, spaces, and line breaks matter because users do not see your variable names.",
          "Use `endl` or `\\n` to move output to a new line.",
        ],
        [
          "Combine text and variables in one output statement.",
          "Use clear labels before values.",
          "Avoid printing multiple unrelated values with no spacing.",
        ],
      ),
    ],
    practice: [
      practice(
        "Student Profile",
        "Ask the user for their name initial, age, and CGPA. Print the values back with clear labels.",
      ),
      practice(
        "Rectangle Area",
        "Read the length and width of a rectangle as decimal values, then print its area.",
      ),
    ],
    quiz: [
      quiz("Which type is best for a whole number count?", ["char", "int", "bool", "string"], 1, "`int` is the standard whole-number type."),
      quiz("Which operator is used with `cin`?", ["<<", ">>", "==", "&&"], 1, "`cin >> variable` extracts input into a variable."),
      quiz("Which type stores true or false?", ["double", "char", "bool", "float"], 2, "`bool` stores logical true or false values."),
      quiz("What should happen before using `cin >> age`?", ["Declare age", "Delete age", "Return age", "Comment age"], 0, "The destination variable must already be declared."),
      quiz("Why use labels in output?", ["To slow the program", "To explain values to users", "To create variables", "To import headers"], 1, "Labels make printed results understandable."),
    ],
  }),
  studyWeek({
    week: 3,
    title: "Operators and Expressions",
    outline: [
      "Arithmetic operators and integer division",
      "Relational and logical operators",
      "Assignment, increment, and decrement",
      "Precedence, associativity, and type casting",
    ],
    theory: [
      theory(
        "Arithmetic Expressions",
        [
          "An expression combines values, variables, and operators to produce a result.",
          "C++ supports addition, subtraction, multiplication, division, and remainder.",
          "Integer division discards the decimal part when both operands are integers.",
        ],
        [
          "`%` gives the remainder after integer division.",
          "`/` behaves differently for integers and decimals.",
          "Parentheses make complex expressions clearer.",
        ],
      ),
      theory(
        "Relational and Logical Operators",
        [
          "Relational operators compare two values and produce a bool result.",
          "Logical operators combine conditions to make bigger decisions.",
          "These operators become essential when writing conditions in later weeks.",
        ],
        [
          "`==` compares equality; `=` assigns a value.",
          "`&&` means both conditions must be true.",
          "`||` means at least one condition must be true.",
        ],
        `int marks = 82;
bool passed = marks >= 50;
bool excellent = marks >= 80 && marks <= 100;`,
      ),
      theory(
        "Precedence and Casting",
        [
          "Precedence decides which operators run first in an expression.",
          "Casting converts a value from one type to another when needed.",
          "Use casts intentionally, especially when you need decimal division from integer values.",
        ],
        [
          "Multiplication and division run before addition and subtraction.",
          "Parentheses override default precedence.",
          "`static_cast<double>(value)` is preferred for explicit conversion.",
        ],
      ),
    ],
    practice: [
      practice("Bill Calculator", "Read item price and quantity. Print subtotal, 10 percent tax, and final total."),
      practice("Even or Odd Expression", "Read an integer and print the remainder when divided by 2. Use this to explain whether it is even or odd."),
    ],
    quiz: [
      quiz("What does `%` calculate?", ["Power", "Remainder", "Average", "Comparison"], 1, "`%` returns the remainder of integer division."),
      quiz("What is the result of `7 / 2` with integers?", ["3", "3.5", "4", "2"], 0, "Integer division removes the decimal part."),
      quiz("Which operator means logical AND?", ["||", "&&", "!", "=="], 1, "`&&` requires both conditions to be true."),
      quiz("Which operator compares equality?", ["=", "==", "!=", "<="], 1, "`==` compares; `=` assigns."),
      quiz("Why use parentheses in expressions?", ["To import libraries", "To control order", "To declare types", "To end statements"], 1, "Parentheses make the intended order explicit."),
    ],
  }),
  studyWeek({
    week: 4,
    title: "Selection Structures (If/Else, Switch)",
    outline: [
      "if, if-else, and else-if ladders",
      "Nested selection structures",
      "switch statements for menu-style choices",
      "Ternary operator and common condition mistakes",
    ],
    theory: [
      theory(
        "If and Else",
        [
          "Selection structures let a program choose different paths based on conditions.",
          "An `if` block runs only when its condition is true.",
          "`else if` handles additional cases, and `else` handles everything left over.",
        ],
        [
          "Conditions must evaluate to true or false.",
          "Order matters in an else-if ladder.",
          "Use braces consistently, even for one-line blocks.",
        ],
      ),
      theory(
        "Switch Statements",
        [
          "A `switch` is useful when one variable is compared against multiple constant choices.",
          "Each `case` handles one possible value.",
          "`break` prevents execution from falling into the next case.",
        ],
        [
          "Switch works well for menus and exact integral choices.",
          "`default` handles unexpected values.",
          "For ranges, use if/else instead of switch.",
        ],
        `int choice;
cin >> choice;

switch (choice) {
    case 1:
        cout << "Start";
        break;
    default:
        cout << "Invalid";
}`,
      ),
      theory(
        "Condition Pitfalls",
        [
          "A common beginner mistake is using assignment instead of comparison inside conditions.",
          "Another mistake is writing range checks in mathematical shorthand that C++ does not understand.",
          "Test boundary values because most selection bugs appear at the edges.",
        ],
        [
          "Write `marks >= 0 && marks <= 100`, not `0 <= marks <= 100`.",
          "Use `==` for equality checks.",
          "Check exact boundary values like 49, 50, and 100.",
        ],
      ),
    ],
    practice: [
      practice("Grade Calculator", "Read marks from 0 to 100 and print a grade using an if/else-if ladder."),
      practice("Simple Menu", "Read a menu choice from 1 to 4 and use switch to print the selected operation."),
    ],
    quiz: [
      quiz("Which block runs when all previous conditions are false?", ["if", "else", "case", "include"], 1, "`else` handles the remaining case."),
      quiz("What prevents switch fall-through?", ["continue", "return type", "break", "namespace"], 2, "`break` exits the switch case."),
      quiz("Which is correct for marks between 0 and 100?", ["0 <= marks <= 100", "marks >= 0 && marks <= 100", "marks => 0", "marks = 100"], 1, "C++ requires two comparisons joined with `&&`."),
      quiz("When is switch usually best?", ["Range checks", "Many exact choices", "Decimal comparison", "Loop counting"], 1, "Switch is ideal for exact menu-style choices."),
      quiz("What does `=` do in C++?", ["Compares", "Assigns", "Divides", "Loops"], 1, "`=` assigns a value."),
    ],
  }),
  studyWeek({
    week: 5,
    title: "Repetition Structures (While and Do-While Loops)",
    outline: [
      "Why loops are used",
      "while loop syntax and dry runs",
      "do-while loops for at-least-once execution",
      "Sentinel values and input validation",
    ],
    theory: [
      theory(
        "Loop Thinking",
        [
          "Loops repeat a block of code while a condition remains true.",
          "Every loop needs a clear start, condition, body, and update.",
          "Dry running a loop by hand is one of the best ways to catch logic errors.",
        ],
        [
          "Initialization sets the starting state.",
          "The condition decides whether to repeat.",
          "The update moves the loop toward stopping.",
        ],
      ),
      theory(
        "While Loops",
        [
          "A `while` loop checks the condition before running the body.",
          "If the condition is false at the beginning, the loop body may never execute.",
          "While loops are useful when the number of repetitions is not known in advance.",
        ],
        [
          "Use while for sentinel-controlled input.",
          "Update loop variables inside the body.",
          "Missing updates often cause infinite loops.",
        ],
        `int n = 1;
while (n <= 5) {
    cout << n << endl;
    n++;
}`,
      ),
      theory(
        "Do-While Loops",
        [
          "A `do-while` loop runs the body first and checks the condition afterward.",
          "This is useful for menus because the menu should appear at least once.",
          "The condition still controls whether the loop repeats.",
        ],
        [
          "Do-while always executes at least once.",
          "It ends with a semicolon after the condition.",
          "It is commonly used for retry prompts and menus.",
        ],
      ),
    ],
    practice: [
      practice("Password Retry", "Use a while loop to keep asking for a numeric PIN until the user enters 1234."),
      practice("Menu Until Exit", "Use a do-while loop to show a menu until the user chooses 0."),
    ],
    quiz: [
      quiz("Which loop may run zero times?", ["do-while", "while", "Both always run", "Neither"], 1, "A while loop checks before the first run."),
      quiz("Which loop always runs at least once?", ["while", "do-while", "for", "switch"], 1, "Do-while checks the condition after the body."),
      quiz("What can cause an infinite loop?", ["A missing update", "A semicolon after return", "A correct condition", "A header file"], 0, "Without progress toward stopping, the condition may stay true forever."),
      quiz("What is a sentinel value?", ["A value that stops input", "A compiler", "A data type", "A comment"], 0, "A sentinel is a special value used to end repeated input."),
      quiz("Where is the condition checked in do-while?", ["Before body", "After body", "Inside include", "Never"], 1, "The condition appears after the loop body."),
    ],
  }),
  studyWeek({
    week: 6,
    title: "Advanced Loops (For Loops and Nested Loops)",
    outline: [
      "for loop syntax and counting loops",
      "Nested loops and pattern printing",
      "break and continue",
      "Avoiding off-by-one loop errors",
    ],
    theory: [
      theory(
        "For Loops",
        [
          "A `for` loop keeps initialization, condition, and update in one compact line.",
          "It is commonly used when the number of repetitions is known.",
          "Counting loops are the foundation for array traversal and pattern problems.",
        ],
        [
          "Use for loops for fixed counts.",
          "Loop counters often start at 0 or 1 depending on the task.",
          "Keep loop conditions simple and test boundaries.",
        ],
        `for (int i = 1; i <= 5; i++) {
    cout << i << " ";
}`,
      ),
      theory(
        "Nested Loops",
        [
          "A nested loop is a loop inside another loop.",
          "The outer loop usually controls rows, and the inner loop controls columns.",
          "Nested loops are used for tables, grids, matrices, and patterns.",
        ],
        [
          "For every one outer iteration, the inner loop may run completely.",
          "Total work is often rows multiplied by columns.",
          "Use clear counter names like `row` and `col`.",
        ],
      ),
      theory(
        "Break and Continue",
        [
          "`break` exits the nearest loop immediately.",
          "`continue` skips the rest of the current iteration and moves to the next one.",
          "Both are useful, but overusing them can make logic harder to read.",
        ],
        [
          "`break` is often used after finding a target value.",
          "`continue` is useful for skipping invalid items.",
          "They affect only the nearest loop unless combined with extra logic.",
        ],
      ),
    ],
    practice: [
      practice("Multiplication Table", "Read a number and print its multiplication table from 1 to 10 using a for loop."),
      practice("Star Triangle", "Read the number of rows and print a left-aligned triangle of stars using nested loops."),
    ],
    quiz: [
      quiz("Which loop is usually best for known counts?", ["if", "switch", "for", "do-while"], 2, "For loops are ideal for fixed repetition counts."),
      quiz("In pattern printing, what does the outer loop often control?", ["Rows", "Compiler", "Header", "Return type"], 0, "The outer loop commonly controls rows."),
      quiz("What does `break` do?", ["Skips current iteration only", "Exits nearest loop", "Creates a loop", "Declares a variable"], 1, "`break` exits the nearest loop or switch."),
      quiz("What does `continue` do?", ["Stops program", "Skips to next iteration", "Deletes a variable", "Prints output"], 1, "`continue` skips the remaining body for the current iteration."),
      quiz("What is an off-by-one error?", ["Wrong header", "Loop runs one too many or too few times", "Missing namespace", "Wrong file name"], 1, "Boundary mistakes often make loops repeat one extra or one fewer time."),
    ],
  }),
  studyWeek({
    week: 7,
    title: "Introduction to Functions and Scope",
    outline: [
      "Why functions are used",
      "Function declaration, definition, and call",
      "Parameters and return values",
      "Local and global scope",
    ],
    theory: [
      theory(
        "Function Basics",
        [
          "A function is a named block of code that performs a specific task.",
          "Functions reduce repetition and make programs easier to test.",
          "A good function has one clear responsibility.",
        ],
        [
          "Function calls transfer control to the function body.",
          "A return value sends a result back to the caller.",
          "Function names should describe the task.",
        ],
      ),
      theory(
        "Parameters and Return Values",
        [
          "Parameters are inputs that a function receives.",
          "The return type tells what kind of result the function sends back.",
          "`void` means the function does not return a value.",
        ],
        [
          "Arguments are the actual values passed during a function call.",
          "Return values can be stored, printed, or used in expressions.",
          "Parameter order matters.",
        ],
        `int square(int n) {
    return n * n;
}

int main() {
    cout << square(5);
    return 0;
}`,
      ),
      theory(
        "Scope",
        [
          "Scope is the region of the program where a name can be used.",
          "Local variables exist inside the block or function where they are declared.",
          "Global variables are accessible widely, but beginners should use them sparingly.",
        ],
        [
          "Local scope prevents accidental changes from other parts of the program.",
          "Variables with the same name in different scopes are different variables.",
          "Prefer passing data through parameters instead of using globals.",
        ],
      ),
    ],
    practice: [
      practice("Area Function", "Write a function `double area(double length, double width)` and call it from `main`."),
      practice("Even Checker", "Write a function `bool isEven(int n)` and use it to print whether a user-entered number is even."),
    ],
    quiz: [
      quiz("Why use functions?", ["To make code reusable", "To remove all variables", "To skip compilation", "To avoid input"], 0, "Functions package reusable logic."),
      quiz("What does `void` mean?", ["Returns an int", "Returns nothing", "Runs twice", "Creates a variable"], 1, "`void` functions do not return a value."),
      quiz("What are parameters?", ["Function inputs", "Compiler errors", "Output streams", "Header files"], 0, "Parameters receive input values for a function."),
      quiz("Where can a local variable be used?", ["Every file", "Only in its scope", "Only in comments", "Only before main"], 1, "Local variables are visible only in their declared scope."),
      quiz("What keyword sends a value back?", ["cout", "include", "return", "namespace"], 2, "`return` sends a result back to the caller."),
    ],
  }),
  examWeek({
    week: 8,
    title: "Midterm Exam Simulation Week",
    outline: [
      "Review of weeks 1-7",
      "Timed quiz, output tracing, and coding practice",
      "Programming problems using variables, conditions, loops, and functions",
    ],
    durationMinutes: 90,
    rules: {
      title: "Midterm Mock Test Rules",
      explanation: [
        "This simulation covers Programming Fundamentals weeks 1 through 7.",
        "Complete the sections in order: quiz, output tracing, then coding.",
        "Submit each section carefully. Early submission carries remaining time forward.",
      ],
      keyPoints: ["Quiz: 10 marks", "Output tracing: 15 marks", "Coding: 25 marks", "Total: 50 marks"],
    },
    mockTest: {
      timers: { quizMinutes: 20, outputTracingMinutes: 25, codingMinutes: 45 },
      totalMarks: 50,
      quiz: [
        quiz("Which symbol ends most C++ statements?", [";", ":", ".", "#"], 0, "Most statements end with a semicolon."),
        quiz("Which operator reads input with cin?", ["<<", ">>", "&&", "=="], 1, "`cin` uses the extraction operator `>>`."),
        quiz("What is `7 % 3`?", ["1", "2", "3", "0"], 0, "7 divided by 3 leaves remainder 1."),
        quiz("Which condition means x is between 1 and 10 inclusive?", ["1 <= x <= 10", "x >= 1 && x <= 10", "x = 10", "x > 1 || x < 10"], 1, "C++ needs two comparisons joined by `&&`."),
        quiz("Which statement exits a switch case?", ["continue", "break", "include", "using"], 1, "`break` prevents switch fall-through."),
        quiz("Which loop runs at least once?", ["while", "do-while", "for", "if"], 1, "Do-while checks after running."),
        quiz("What does `continue` do inside a loop?", ["Ends program", "Skips to next iteration", "Deletes counter", "Imports iostream"], 1, "`continue` skips the rest of the current iteration."),
        quiz("What is a function return type?", ["The function name", "The type of value returned", "A comment", "A loop condition"], 1, "The return type declares the result type."),
        quiz("Where is a local variable visible?", ["Inside its scope", "In every program", "Only in headers", "Inside the compiler"], 0, "Local variables are limited to their block or function."),
        quiz("Which type stores true or false?", ["int", "char", "bool", "double"], 2, "`bool` stores true or false."),
      ],
      outputTracing: [
        trace(
          "mid-trace-1",
          "Loop Counter",
          "Write the exact output.",
          `#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 4; i++) {
        cout << i * 2 << " ";
    }
    return 0;
}`,
          "2 4 6 8",
        ),
        trace(
          "mid-trace-2",
          "Condition Path",
          "Trace the if/else output.",
          `#include <iostream>
using namespace std;

int main() {
    int marks = 76;
    if (marks >= 80) cout << "A";
    else if (marks >= 70) cout << "B";
    else cout << "C";
    return 0;
}`,
          "B",
        ),
        trace(
          "mid-trace-3",
          "Function Call",
          "Trace the function result.",
          `#include <iostream>
using namespace std;

int addBonus(int score) {
    return score + 5;
}

int main() {
    cout << addBonus(12);
    return 0;
}`,
          "17",
        ),
      ],
      coding: [
        coding("mid-code-1", "Maximum of Three", "Read three integers and print the largest value.", "easy", 5),
        coding("mid-code-2", "Sum of Even Numbers", "Read `n`, then print the sum of all even numbers from 1 to `n`.", "medium", 8),
        coding("mid-code-3", "Prime Checker Function", "Write and use a function that returns whether a number is prime. Read one integer and print `Prime` or `Not Prime`.", "hard", 12),
      ],
    },
  }),
  studyWeek({
    week: 9,
    title: "Functions: Pass-by-Value vs. Pass-by-Reference",
    outline: [
      "How function arguments are copied",
      "Pass-by-value and when to use it",
      "Pass-by-reference using `&`",
      "Updating multiple values through function parameters",
    ],
    theory: [
      theory("Pass-by-Value", ["Pass-by-value gives a function its own copy of the argument.", "Changes inside the function do not affect the original variable.", "This is safe for calculations that should not modify caller data."], ["The function receives a copy.", "Original values stay unchanged.", "Use it when the function only needs to read data."]),
      theory("Pass-by-Reference", ["Pass-by-reference allows a function parameter to refer to the original variable.", "Changes inside the function affect the caller's variable.", "References are useful for swaps, updates, and returning multiple results."], ["Use `&` in the parameter declaration.", "No copy is made for the referenced variable.", "Be careful because the function can change caller data."], `void addTen(int &value) {
    value += 10;
}`),
      theory("Choosing the Right Passing Style", ["Use value for small data that should not change.", "Use reference when the function must update the original variable.", "For larger data later, references can also avoid expensive copies."], ["Prefer value by default for beginner safety.", "Use reference intentionally.", "Name mutating functions clearly."]),
    ],
    practice: [
      practice("Swap Two Numbers", "Write a `swapValues(int &a, int &b)` function and use it to swap two user-entered numbers."),
      practice("Apply Discount", "Write a function that receives a price by reference and applies a 15 percent discount."),
    ],
    quiz: [
      quiz("What does pass-by-value send?", ["The original variable", "A copy", "A file", "A header"], 1, "Pass-by-value sends a copy."),
      quiz("What symbol marks a reference parameter?", ["*", "&", "%", "#"], 1, "`&` marks a reference parameter."),
      quiz("Can pass-by-value change the caller's variable?", ["Yes always", "No", "Only with cout", "Only in loops"], 1, "The function changes only its copy."),
      quiz("Which task needs pass-by-reference?", ["Printing a greeting", "Swapping two values", "Calculating square only", "Reading a header"], 1, "Swapping must modify caller variables."),
      quiz("Why use references carefully?", ["They cannot compile", "They can modify original data", "They remove all types", "They stop input"], 1, "References can change caller data."),
    ],
  }),
  studyWeek({
    week: 10,
    title: "Introduction to 1D Arrays",
    outline: [
      "Array purpose and fixed-size storage",
      "Declaring, initializing, and indexing arrays",
      "Looping through array elements",
      "Finding sum, average, min, and max",
    ],
    theory: [
      theory("Why Arrays Matter", ["An array stores multiple values of the same type under one name.", "Arrays are useful when a program must process lists of marks, prices, temperatures, or IDs.", "Each element is accessed by an index."], ["C++ array indexes start at 0.", "All elements in a basic array share one type.", "The array size is fixed for beginner static arrays."]),
      theory("Declaration and Indexing", ["Declare an array by giving its type, name, and size.", "Use square brackets to access elements.", "Accessing outside the valid index range is a serious bug."], ["For size 5, valid indexes are 0 to 4.", "Use loops to avoid repetitive element access.", "Initialize arrays before using their values."], `int marks[5] = {80, 75, 90, 68, 88};
cout << marks[0];`),
      theory("Array Processing Patterns", ["Most array problems use a loop from index 0 to size minus 1.", "Common patterns include summing values, counting matches, and finding the largest value.", "Track intermediate results in separate variables."], ["Initialize sum to 0.", "Initialize max from the first element when possible.", "Use the same size consistently in loops."]),
    ],
    practice: [
      practice("Average Marks", "Read 5 marks into an array, calculate their sum, and print the average."),
      practice("Largest Element", "Read 6 integers into an array and print the largest value."),
    ],
    quiz: [
      quiz("What is the first index of a C++ array?", ["1", "0", "-1", "size"], 1, "C++ arrays are zero-indexed."),
      quiz("For `int a[4]`, which index is invalid?", ["0", "1", "3", "4"], 3, "Valid indexes are 0 through 3."),
      quiz("What type of values can one basic array store?", ["Mixed unrelated types", "Same type", "Only strings", "Only bools"], 1, "A basic C++ array has one element type."),
      quiz("Why use loops with arrays?", ["To process elements efficiently", "To remove indexes", "To change the compiler", "To skip input"], 0, "Loops avoid repeated code for each element."),
      quiz("What should happen before reading an array value?", ["Initialize or assign it", "Delete it", "Close program", "Use namespace twice"], 0, "Uninitialized values are unsafe to use."),
    ],
  }),
  studyWeek({
    week: 11,
    title: "2D Arrays and Matrix Operations",
    outline: [
      "Rows, columns, and table-style data",
      "Declaring and initializing 2D arrays",
      "Nested loops for traversal",
      "Matrix sum, row totals, and diagonal processing",
    ],
    theory: [
      theory("2D Array Model", ["A 2D array stores values in rows and columns.", "It is useful for matrices, seating charts, grids, and tabular marks.", "Two indexes are required: row index and column index."], ["First index selects the row.", "Second index selects the column.", "Both indexes start at 0."]),
      theory("Nested Loop Traversal", ["Nested loops are the natural way to visit every cell in a 2D array.", "The outer loop usually controls rows, and the inner loop controls columns.", "Consistent row and column limits prevent out-of-bounds access."], ["Use `matrix[row][col]`.", "Rows and columns may have different sizes.", "Print a newline after each row."], `int a[2][3] = {{1, 2, 3}, {4, 5, 6}};
for (int row = 0; row < 2; row++) {
    for (int col = 0; col < 3; col++) {
        cout << a[row][col] << " ";
    }
    cout << endl;
}`),
      theory("Matrix Operations", ["Common matrix tasks include adding two matrices, calculating row sums, and finding diagonal totals.", "Diagonal logic applies only to square matrices.", "Matrix problems become easier when you identify rows, columns, and the needed condition."], ["Same-sized matrices can be added element by element.", "Main diagonal cells have `row == col`.", "Nested loops keep matrix code organized."]),
    ],
    practice: [
      practice("Matrix Input and Print", "Read a 3x3 integer matrix and print it in row-column format."),
      practice("Matrix Addition", "Read two 2x2 matrices and print their sum matrix."),
    ],
    quiz: [
      quiz("How many indexes access a 2D array element?", ["1", "2", "3", "0"], 1, "2D arrays use row and column indexes."),
      quiz("In `a[row][col]`, what does `row` select?", ["Column", "Row", "Header", "Type"], 1, "The first index selects the row."),
      quiz("Which loops are commonly used for matrix traversal?", ["Nested loops", "Only switch", "Only if", "No loops"], 0, "Rows and columns are naturally handled with nested loops."),
      quiz("When does main diagonal logic apply?", ["Any rectangle", "Square matrices", "Only 1D arrays", "Only strings"], 1, "A main diagonal requires equal row and column dimensions."),
      quiz("Which condition identifies the main diagonal?", ["row == col", "row > col", "row + col == 1", "col == 0"], 0, "Main diagonal cells have equal row and column indexes."),
    ],
  }),
  studyWeek({
    week: 12,
    title: "Character Arrays and String Manipulation",
    outline: [
      "C-style strings and null terminator",
      "Character arrays vs std::string",
      "Reading words and full lines",
      "Basic string traversal and manipulation",
    ],
    theory: [
      theory("Character Arrays", ["A character array can store a sequence of characters.", "C-style strings end with the null character `\\0`.", "The array must be large enough for all characters plus the null terminator."], ["`char name[20]` can store up to 19 visible characters.", "The null terminator marks the end.", "Going past the array size is unsafe."]),
      theory("std::string Basics", ["`std::string` is easier and safer for most beginner string tasks.", "It grows dynamically and has useful operations such as length and indexing.", "You can still traverse a string with a loop."], ["Include `<string>` when using `string`.", "`getline` reads a full line with spaces.", "`text.length()` returns the number of characters."], `string name;
getline(cin, name);
cout << name.length();`),
      theory("String Processing", ["String processing often means counting, searching, or transforming characters.", "Loops can inspect one character at a time.", "Character checks help solve tasks like vowel counting and palindrome detection."], ["Use indexes from 0 to length minus 1.", "Compare characters with single quotes.", "Be mindful of uppercase and lowercase differences."]),
    ],
    practice: [
      practice("Vowel Counter", "Read a word and count how many lowercase vowels it contains."),
      practice("Reverse a String", "Read a string without spaces and print it in reverse order."),
    ],
    quiz: [
      quiz("What ends a C-style string?", ["\\0", "\\n", "0 as int only", "#"], 0, "C-style strings end with a null character."),
      quiz("Which function reads a full line into a string?", ["cin only", "getline", "cout", "return"], 1, "`getline` reads spaces until the line ends."),
      quiz("Which header is commonly needed for `string`?", ["<string>", "<arrayonly>", "<switch>", "<bool>"], 0, "`<string>` provides `std::string`."),
      quiz("What does `text.length()` return?", ["First character", "Number of characters", "Last index always", "Compiler version"], 1, "It returns the string length."),
      quiz("How are character literals written?", ["Double quotes only", "Single quotes", "Angle brackets", "Square brackets"], 1, "Single quotes represent one character, like `'a'`."),
    ],
  }),
  studyWeek({
    week: 13,
    title: "Introduction to Pointers and Memory",
    outline: [
      "Addresses and pointer variables",
      "Dereferencing pointers",
      "Pointers and arrays",
      "Dynamic memory with new and delete",
    ],
    theory: [
      theory("Pointer Concept", ["A pointer is a variable that stores the memory address of another variable.", "Pointers help explain how arrays, references, and dynamic memory work underneath.", "They are powerful but require careful handling."], ["`&variable` gets an address.", "`*pointer` accesses the value at an address.", "A pointer should be initialized before use."]),
      theory("Dereferencing", ["Dereferencing means using a pointer to access or change the value it points to.", "If a pointer points to invalid memory, dereferencing it can crash the program.", "Use clear pointer initialization and avoid dangling pointers."], ["`int *p` declares a pointer to int.", "`p = &x` stores x's address.", "`*p = 10` changes x."], `int x = 5;
int *p = &x;
cout << *p;`),
      theory("Dynamic Memory", ["Dynamic memory is requested while the program runs.", "`new` allocates memory and returns an address.", "`delete` releases memory when it is no longer needed."], ["Every `new` should have a matching `delete`.", "Set pointers to `nullptr` when they point nowhere.", "Prefer beginner static arrays until dynamic memory is required."]),
    ],
    practice: [
      practice("Address and Value", "Declare an integer, store its address in a pointer, and print both the value and address."),
      practice("Pointer Update", "Use a pointer to change an integer value from 10 to 50 and print the result."),
    ],
    quiz: [
      quiz("What does a pointer store?", ["A memory address", "Only text", "A compiler", "A namespace"], 0, "Pointers store addresses."),
      quiz("Which operator gets a variable address?", ["*", "&", "%", "&&"], 1, "`&x` gives x's address."),
      quiz("What does dereferencing do?", ["Gets value at address", "Imports file", "Starts loop", "Ends program"], 0, "`*p` accesses the value pointed to by p."),
      quiz("What value represents no valid address?", ["nullptr", "main", "endl", "cin"], 0, "`nullptr` is the null pointer value."),
      quiz("What releases memory allocated with `new`?", ["remove", "delete", "freefile", "break"], 1, "`delete` releases dynamically allocated memory."),
    ],
  }),
  studyWeek({
    week: 14,
    title: "Structures (Structs) and User-Defined Types",
    outline: [
      "Grouping related fields with structs",
      "Declaring struct variables",
      "Arrays of structs",
      "Passing structs to functions",
    ],
    theory: [
      theory("Struct Purpose", ["A struct groups related data into one user-defined type.", "It is useful for records such as students, books, products, and employees.", "Structs make code clearer when multiple values belong to the same object."], ["A struct defines a new type.", "Fields are accessed with the dot operator.", "Struct variables can be stored in arrays."]),
      theory("Declaring and Using Structs", ["Define the struct layout first, then create variables of that type.", "Each variable has its own copy of the fields.", "The dot operator accesses or updates a field."], ["Use meaningful field names.", "Initialize fields before printing.", "Keep related fields together."], `struct Student {
    string name;
    int marks;
};

Student s;
s.name = "Ali";
s.marks = 85;`),
      theory("Structs with Functions", ["Structs can be passed to functions like other types.", "Use pass-by-value when only reading small structs.", "Use pass-by-reference when a function should update the struct."], ["Functions can print a struct record.", "Reference parameters can update fields.", "Arrays of structs model lists of records."]),
    ],
    practice: [
      practice("Student Record", "Create a `Student` struct with name and marks. Read one student and print the record."),
      practice("Top Student", "Read 3 students into an array of structs and print the name of the student with highest marks."),
    ],
    quiz: [
      quiz("What does a struct group?", ["Related fields", "Only loops", "Compiler settings", "Headers"], 0, "Structs group related data."),
      quiz("Which operator accesses struct fields?", [".", "-> only", "::", "#"], 0, "The dot operator accesses fields of a struct variable."),
      quiz("Can arrays store structs?", ["Yes", "No", "Only chars", "Only pointers"], 0, "Arrays can store user-defined struct values."),
      quiz("When use reference for a struct parameter?", ["When updating original", "Never", "Only for cout", "Only for int"], 0, "Reference parameters allow updates to the original struct."),
      quiz("What is a struct definition?", ["A new type layout", "A loop", "A file stream", "A compiler command"], 0, "A struct definition describes fields for a new type."),
    ],
  }),
  studyWeek({
    week: 15,
    title: "Introduction to File Handling",
    outline: [
      "Why programs read and write files",
      "ofstream for output files",
      "ifstream for input files",
      "Checking file open errors",
    ],
    theory: [
      theory("File Streams", ["File handling lets programs store data after the program ends.", "`ofstream` writes data to files, and `ifstream` reads data from files.", "The `<fstream>` header provides file stream classes."], ["Use `ofstream` for writing.", "Use `ifstream` for reading.", "Close files when done."]),
      theory("Writing Files", ["Open an output file, write data using `<<`, then close it.", "If the file does not exist, output streams can create it.", "Writing can overwrite existing content unless append mode is used."], ["Check that the file opened successfully.", "Use clear file names.", "Write line breaks for readable files."], `ofstream out("notes.txt");
if (out.is_open()) {
    out << "Hello file";
    out.close();
}`),
      theory("Reading Files", ["Input files must exist before they can be read.", "Use loops to read repeated values from a file.", "Always handle the case where the file cannot be opened."], ["`ifstream` reads from files.", "Use `is_open()` for checks.", "Read data in the same structure it was written."]),
    ],
    practice: [
      practice("Write Marks File", "Write three integer marks to a file named `marks.txt`, one per line."),
      practice("Read Sum File", "Read integers from `numbers.txt` and print their sum. Include an error message if the file cannot open."),
    ],
    quiz: [
      quiz("Which header supports file streams?", ["<fstream>", "<iostream-only>", "<switch>", "<filehandle>"], 0, "`<fstream>` provides file stream classes."),
      quiz("Which stream writes to a file?", ["ifstream", "ofstream", "cin", "switch"], 1, "`ofstream` is for output files."),
      quiz("Which stream reads from a file?", ["ifstream", "ofstream", "cout", "endl"], 0, "`ifstream` is for input files."),
      quiz("Why check `is_open()`?", ["To verify file opened", "To compile faster", "To create a loop", "To delete variables"], 0, "File operations can fail, so check before reading or writing."),
      quiz("What should you do after finishing file work?", ["Close the file", "Open it forever", "Delete main", "Ignore errors"], 0, "Closing releases file resources."),
    ],
  }),
  examWeek({
    week: 16,
    title: "Final Exam Simulation Week",
    outline: [
      "Comprehensive review of weeks 1-15",
      "Timed final quiz, tracing, and coding simulation",
      "Integrated problems with arrays, strings, pointers, structs, and files",
    ],
    durationMinutes: 120,
    rules: {
      title: "Final Mock Test Rules",
      explanation: [
        "This simulation covers the full Programming Fundamentals curriculum.",
        "Attempt all three sections without external help.",
        "Use the final score to identify which weeks need revision before the real exam.",
      ],
      keyPoints: ["Quiz: 10 marks", "Output tracing: 15 marks", "Coding: 25 marks", "Total: 50 marks"],
    },
    mockTest: {
      timers: { quizMinutes: 25, outputTracingMinutes: 30, codingMinutes: 65 },
      totalMarks: 50,
      quiz: [
        quiz("For `int a[5]`, what is the last valid index?", ["5", "4", "1", "0"], 1, "A size-5 array has indexes 0 through 4."),
        quiz("Which nested-loop condition identifies a main diagonal cell?", ["row == col", "row < col", "row + col == 0", "col == 1"], 0, "Main diagonal cells have equal row and column indexes."),
        quiz("What marks the end of a C-style string?", ["\\0", "\\n", "space", "#"], 0, "The null terminator ends a C-style string."),
        quiz("What does `&x` produce?", ["Value of x", "Address of x", "Size of x", "Type of x"], 1, "`&` gets the address."),
        quiz("Which operator accesses fields on a struct variable?", [".", "*", "&", "%"], 0, "The dot operator accesses struct fields."),
        quiz("Which stream reads from files?", ["ofstream", "ifstream", "iostream", "cout"], 1, "`ifstream` reads files."),
        quiz("What should match every `new` allocation?", ["delete", "break", "continue", "return 0 only"], 0, "`delete` releases memory allocated with `new`."),
        quiz("Why use pass-by-reference?", ["To modify caller data", "To block input", "To remove functions", "To skip compilation"], 0, "References can update the original variable."),
        quiz("What is a struct?", ["A user-defined grouped data type", "A loop", "An operator", "A compiler"], 0, "Structs group related fields into a new type."),
        quiz("Which function can read spaces into a string?", ["getline", "cin >> only", "sizeof", "delete"], 0, "`getline` reads a whole line."),
      ],
      outputTracing: [
        trace(
          "final-trace-1",
          "Array Sum",
          "Trace the array-processing output.",
          `#include <iostream>
using namespace std;

int main() {
    int a[4] = {3, 1, 4, 2};
    int sum = 0;
    for (int i = 0; i < 4; i++) {
        sum += a[i];
    }
    cout << sum;
    return 0;
}`,
          "10",
        ),
        trace(
          "final-trace-2",
          "Pointer Update",
          "Trace the pointer output.",
          `#include <iostream>
using namespace std;

int main() {
    int x = 8;
    int *p = &x;
    *p = *p + 7;
    cout << x;
    return 0;
}`,
          "15",
        ),
        trace(
          "final-trace-3",
          "Struct Field",
          "Trace the struct output.",
          `#include <iostream>
using namespace std;

struct Box {
    int width;
    int height;
};

int main() {
    Box b = {4, 5};
    cout << b.width * b.height;
    return 0;
}`,
          "20",
        ),
      ],
      coding: [
        coding("final-code-1", "Array Average", "Read 5 integers into an array and print their average as a decimal value.", "easy", 5),
        coding("final-code-2", "Student Struct Ranking", "Create a `Student` struct with name and marks. Read 3 students and print the name with highest marks.", "medium", 8),
        coding("final-code-3", "String Palindrome Checker", "Read a word and print `Palindrome` if it reads the same forward and backward; otherwise print `Not Palindrome`.", "hard", 12),
      ],
    },
  }),
];
