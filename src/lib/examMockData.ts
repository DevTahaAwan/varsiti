import type { ExamWeekData } from "@/lib/courseTypes";

export const examMockWeeks: Record<number, ExamWeekData> = {
  9: {
    week: 9,
    type: "exam",
    title: "Midterm Simulation: Weeks 1 to 8",
    outline: [
      "Mock paper covering OOP basics, class design, constructors, memory, operators, inheritance, and relationships",
      "Complete the paper in three timed sections with carry-forward time if you finish early",
      "Attempt it like a real paper: quiz first, then output tracing, then coding",
    ],
    durationMinutes: 60,
    rules: {
      title: "Midterm Exam Rules and Strategy",
      explanation: [
        "This mock paper is designed to feel like a real midterm. Treat it as a focused 50-mark attempt and try to solve it without outside help.",
        "The paper runs in three sections: <strong>Quiz</strong>, <strong>Output Tracing</strong>, and <strong>Coding</strong>. Each section has its own timer, and any unused time is added to the next section.",
        "If a section timer reaches zero, that section becomes read-only automatically and the next section opens with its own time.",
        "Stay calm, start with accuracy, and keep your code clean. Good structure and correct OOP thinking matter as much as raw speed.",
      ],
      keyPoints: [
        "<strong>Total marks:</strong> 50",
        "<strong>Quiz:</strong> 10 questions, 10 marks, 10 minutes",
        "<strong>Output tracing:</strong> 3 questions, 15 marks, 20 minutes",
        "<strong>Coding:</strong> easy 5, medium 10, hard 10 marks, 30 minutes",
        "Submitting a section early carries the remaining time into the next section.",
      ],
    },
    mockTest: {
      totalMarks: 50,
      timers: {
        quizMinutes: 10,
        outputTracingMinutes: 20,
        codingMinutes: 30,
      },
      quiz: [
        { question: "Which OOP idea hides internal details and exposes only a useful interface?", options: ["Abstraction", "Inheritance", "Operator overloading", "Composition"], answer: 0, explanation: "Abstraction hides unnecessary implementation details and keeps the interface simple.", mark: 1 },
        { question: "When an argument is passed by reference in C++, the function:", options: ["Works on a copy", "Can modify the original variable", "Must allocate memory dynamically", "Can only read the value"], answer: 1, explanation: "A reference aliases the caller's variable, so changes affect the original.", mark: 1 },
        { question: "What is the default access level inside a <code>class</code>?", options: ["public", "protected", "private", "friend"], answer: 2, explanation: "Members of a class are private by default.", mark: 1 },
        { question: "Which special member function has the same name as the class and no return type?", options: ["Destructor", "Constructor", "Setter", "Operator function"], answer: 1, explanation: "A constructor initializes an object when it is created.", mark: 1 },
        { question: "The correct partner for <code>new[]</code> is:", options: ["delete", "remove", "delete[]", "free"], answer: 2, explanation: "Arrays allocated with new[] must be released with delete[].", mark: 1 },
        { question: "A shallow copy is dangerous mainly because it:", options: ["Copies too many values", "Duplicates pointer addresses instead of owned data", "Always makes the object const", "Breaks inheritance syntax"], answer: 1, explanation: "Both objects may end up pointing to the same dynamic memory.", mark: 1 },
        { question: "A static data member belongs to:", options: ["Each object separately", "Only the newest object", "The class itself", "Only derived classes"], answer: 2, explanation: "Static members are shared across all instances of the class.", mark: 1 },
        { question: "Which access level lets derived classes use a member while hiding it from unrelated outside code?", options: ["public", "protected", "private", "virtual"], answer: 1, explanation: "protected is meant for base-to-derived reuse.", mark: 1 },
        { question: "Virtual inheritance is mainly used to solve:", options: ["Stack overflow", "The diamond problem", "Memory leaks", "Template deduction"], answer: 1, explanation: "Virtual inheritance prevents duplicate base-class subobjects in diamond hierarchies.", mark: 1 },
        { question: "Composition means that one class:", options: ["Owns another object directly as a part", "Always inherits from another class", "Must use only pointers", "Cannot have constructors"], answer: 0, explanation: "Composition is a strong has-a relationship where the whole owns the part.", mark: 1 },
      ],
      outputTracing: [
        {
          id: "mid-out-1",
          title: "Constructor and Display Trace",
          prompt: "Write the exact output produced by this program.",
          code: `#include <iostream>
using namespace std;

class Box {
    int value;
public:
    Box(int v = 0) : value(v) {}
    void show() const { cout << value << endl; }
};

int main() {
    Box b1(7), b2;
    b1.show();
    b2.show();
    return 0;
}`,
          expectedOutput: `7
0`,
          marks: 5,
        },
        {
          id: "mid-out-2",
          title: "Static Member Trace",
          prompt: "Write the exact output produced by this program.",
          code: `#include <iostream>
using namespace std;

class Counter {
public:
    static int count;
    Counter() { count++; }
};

int Counter::count = 0;

int main() {
    Counter a, b, c;
    cout << Counter::count << endl;
    return 0;
}`,
          expectedOutput: `3`,
          marks: 5,
        },
        {
          id: "mid-out-3",
          title: "Inheritance Trace",
          prompt: "Write the exact output produced by this program.",
          code: `#include <iostream>
using namespace std;

class Parent {
public:
    void show() const { cout << "Parent" << endl; }
};

class Child : public Parent {
public:
    void display() const {
        show();
        cout << "Child" << endl;
    }
};

int main() {
    Child c;
    c.display();
    return 0;
}`,
          expectedOutput: `Parent
Child`,
          marks: 5,
        },
      ],
      coding: [
        {
          id: "mid-code-1",
          title: "Easy: Student Class",
          difficulty: "easy",
          maxScore: 5,
          prompt: "Create a <code>Student</code> class with private <code>name</code> and <code>gpa</code>. Add <code>setData</code> and <code>show</code> member functions. In <code>main</code>, create one object, assign values, and display them.",
          starter: `#include <iostream>
#include <string>
using namespace std;

int main() {
    // write your solution here
    return 0;
}`,
          solution: `class Student {
private:
    string name;
    double gpa;
public:
    void setData(const string& n, double g) {
        name = n;
        gpa = g;
    }

    void show() const {
        cout << name << " " << gpa << endl;
    }
};`,
        },
        {
          id: "mid-code-2",
          title: "Medium: Complex Addition",
          difficulty: "medium",
          maxScore: 10,
          prompt: "Create a <code>Complex</code> class with private <code>real</code> and <code>imag</code> members. Overload the <code>+</code> operator to add two complex numbers and display the result in <code>main</code>.",
          starter: `#include <iostream>
using namespace std;

int main() {
    // write your solution here
    return 0;
}`,
          solution: `class Complex {
private:
    int real, imag;
public:
    Complex(int r = 0, int i = 0) : real(r), imag(i) {}

    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }

    void show() const {
        cout << real << " + " << imag << "i" << endl;
    }
};`,
        },
        {
          id: "mid-code-3",
          title: "Hard: Deep Copy with Dynamic Memory",
          difficulty: "hard",
          maxScore: 10,
          prompt: "Design a class <code>NumberList</code> that dynamically allocates an integer array in its constructor, implements a deep-copy constructor, and releases memory in its destructor. Demonstrate that copying one object does not corrupt the other.",
          starter: `#include <iostream>
using namespace std;

int main() {
    // write your solution here
    return 0;
}`,
          solution: `class NumberList {
private:
    int size;
    int* data;
public:
    NumberList(int s) : size(s), data(new int[s]) {}

    NumberList(const NumberList& other) : size(other.size), data(new int[other.size]) {
        for (int i = 0; i < size; i++) data[i] = other.data[i];
    }

    ~NumberList() {
        delete[] data;
    }
};`,
        },
      ],
    },
  },
  17: {
    week: 17,
    type: "exam",
    title: "Final Exam Simulation: Weeks 10 to 16",
    outline: [
      "Mock paper covering const correctness, polymorphism, abstract classes, templates, exceptions, and file handling",
      "Timed sections mirror a real final exam with automatic locking when time runs out",
      "Use the rules tab first, then attempt the full mock paper in one sitting",
    ],
    durationMinutes: 60,
    rules: {
      title: "Final Exam Rules and Strategy",
      explanation: [
        "This final mock test combines the major OOP topics from the second half of the course into one structured paper.",
        "The exam opens in three stages: <strong>Quiz</strong>, <strong>Output Tracing</strong>, and <strong>Coding</strong>. Finish a stage early to carry its leftover time forward.",
        "If time expires in any stage, that stage locks immediately and the next stage opens with its own timer.",
        "Write clear, const-correct, well-structured C++ and pay attention to virtual behavior, templates, exceptions, and file handling details.",
      ],
      keyPoints: [
        "<strong>Total marks:</strong> 50",
        "<strong>Quiz:</strong> 10 marks in 10 minutes",
        "<strong>Output tracing:</strong> 15 marks in 20 minutes",
        "<strong>Coding:</strong> 25 marks in 30 minutes",
        "The coding section is auto-scored, so complete working structure and good OOP design both matter.",
      ],
    },
    mockTest: {
      totalMarks: 50,
      timers: {
        quizMinutes: 10,
        outputTracingMinutes: 20,
        codingMinutes: 30,
      },
      quiz: [
        { question: "A <code>const</code> member function promises that it:", options: ["Will always return a constant", "Will not modify the object's normal state", "Can be called only once", "Must throw no exceptions"], answer: 1, explanation: "Const member functions should not modify the observable state of the object.", mark: 1 },
        { question: "Deleting a derived object through a base pointer is safest when the base class has:", options: ["A friend function", "A virtual destructor", "A static constructor", "Protected data only"], answer: 1, explanation: "A virtual destructor ensures the correct derived destructor runs.", mark: 1 },
        { question: "A class with at least one pure virtual function is:", options: ["Static", "Abstract", "Final only", "Template-only"], answer: 1, explanation: "A pure virtual function makes the class abstract.", mark: 1 },
        { question: "Template type deduction usually happens from:", options: ["The return type only", "The argument types provided in the call", "The filename", "Access specifiers"], answer: 1, explanation: "The compiler typically infers template types from function arguments.", mark: 1 },
        { question: "A friend function:", options: ["Must be a class member", "Can access private members if declared as a friend", "Cannot return a value", "Replaces inheritance"], answer: 1, explanation: "Friend functions are external functions granted special access by the class.", mark: 1 },
        { question: "Which keyword transfers control to a matching catch block?", options: ["override", "throw", "break", "const"], answer: 1, explanation: "throw raises an exception.", mark: 1 },
        { question: "RAII mainly means:", options: ["Always use raw pointers", "Bind resource cleanup to object lifetime", "Avoid constructors", "Use templates for all classes"], answer: 1, explanation: "RAII releases resources automatically through destructors.", mark: 1 },
        { question: "Which stream class is used to write to a file?", options: ["ifstream", "ostream", "ofstream", "stringstream"], answer: 2, explanation: "ofstream writes data to files.", mark: 1 },
        { question: "Which STL container is usually the default dynamic sequence container?", options: ["vector", "map", "stack", "set"], answer: 0, explanation: "vector is the standard dynamic array-like container.", mark: 1 },
        { question: "The Factory pattern is used to:", options: ["Hide object creation behind a common interface", "Guarantee only one object exists", "Prevent all inheritance", "Replace file handling"], answer: 0, explanation: "Factory centralizes object creation and returns suitable concrete objects.", mark: 1 },
      ],
      outputTracing: [
        {
          id: "final-out-1",
          title: "Virtual Function Trace",
          prompt: "Write the exact output produced by this program.",
          code: `#include <iostream>
using namespace std;

class Base {
public:
    virtual void show() const { cout << "Base" << endl; }
};

class Derived : public Base {
public:
    void show() const override { cout << "Derived" << endl; }
};

int main() {
    Base* ptr = new Derived();
    ptr->show();
    delete ptr;
    return 0;
}`,
          expectedOutput: `Derived`,
          marks: 5,
        },
        {
          id: "final-out-2",
          title: "Template Function Trace",
          prompt: "Write the exact output produced by this program.",
          code: `#include <iostream>
using namespace std;

template <typename T>
T add(T a, T b) {
    return a + b;
}

int main() {
    cout << add(3, 4) << endl;
    cout << add(1.5, 2.5) << endl;
    return 0;
}`,
          expectedOutput: `7
4`,
          marks: 5,
        },
        {
          id: "final-out-3",
          title: "Exception Handling Trace",
          prompt: "Write the exact output produced by this program.",
          code: `#include <iostream>
using namespace std;

int main() {
    try {
        throw 5;
    } catch (int x) {
        cout << "Caught " << x << endl;
    }
    cout << "Done" << endl;
    return 0;
}`,
          expectedOutput: `Caught 5
Done`,
          marks: 5,
        },
      ],
      coding: [
        {
          id: "final-code-1",
          title: "Easy: Custom Exception",
          difficulty: "easy",
          maxScore: 5,
          prompt: "Create a custom exception class <code>MarksError</code> derived from <code>exception</code>. Override <code>what()</code> to return a meaningful error message and demonstrate it in <code>main</code>.",
          starter: `#include <exception>
#include <iostream>
using namespace std;

int main() {
    // write your solution here
    return 0;
}`,
          solution: `class MarksError : public exception {
public:
    const char* what() const noexcept override {
        return "Marks out of valid range";
    }
};`,
        },
        {
          id: "final-code-2",
          title: "Medium: Template Holder",
          difficulty: "medium",
          maxScore: 10,
          prompt: "Create a class template <code>Holder&lt;T&gt;</code> with one private value, a constructor, and a <code>show()</code> member function. Test it with an <code>int</code> and a <code>string</code>.",
          starter: `#include <iostream>
#include <string>
using namespace std;

int main() {
    // write your solution here
    return 0;
}`,
          solution: `template <typename T>
class Holder {
private:
    T value;
public:
    Holder(T v) : value(v) {}

    void show() const {
        cout << value << endl;
    }
};`,
        },
        {
          id: "final-code-3",
          title: "Hard: Abstract Class, Exception, and File Output",
          difficulty: "hard",
          maxScore: 10,
          prompt: "Design an abstract base class <code>Report</code> with a pure virtual <code>write()</code> function. Create a derived class that writes student result data to a file using <code>ofstream</code>. If the marks are outside 0 to 100, throw a custom exception before writing.",
          starter: `#include <exception>
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    // write your solution here
    return 0;
}`,
          solution: `class MarksError : public exception {
public:
    const char* what() const noexcept override {
        return "Invalid marks";
    }
};

class Report {
public:
    virtual void write() const = 0;
    virtual ~Report() = default;
};`,
        },
      ],
    },
  },
};
