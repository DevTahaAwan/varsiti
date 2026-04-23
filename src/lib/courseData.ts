import type {
  CourseWeek,
  ExamMockTest,
  ExamRules,
  PracticeQuestion,
  QuizQuestion,
  StudyWeekData,
  TheoryItem,
  ExamWeekData,
} from "@/lib/courseTypes";

// Extracted course data
const studyWeek = (
  week: number,
  title: string,
  outline: string[],
  theory: TheoryItem[],
  practice: PracticeQuestion[],
  quiz: QuizQuestion[],
): StudyWeekData => ({ week, type: "study", title, outline, theory, practice, quiz });

const examWeek = (
  week: number,
  title: string,
  outline: string[],
  durationMinutes: number,
  rules: ExamRules,
  mockTest: ExamMockTest,
): ExamWeekData => ({ week, type: "exam", title, outline, durationMinutes, rules, mockTest });

export const course: Record<number, CourseWeek> = {
  1: studyWeek(1,"OOP Foundations, UML, and PF Revision",
    ["Intro to OOP and why it improves large programs","UML class-diagram overview: attributes, methods, visibility","PF revision: functions, parameter passing, overloading, default arguments"],
    [{title:"Thinking in objects instead of loose functions",
      explanation:[
        "Object-Oriented Programming (OOP) is a design philosophy where you model a program as a collection of <strong>objects</strong> — each object bundles its own <em>data</em> (attributes) and the <em>functions</em> that operate on that data (methods) into a single unit called a <strong>class</strong>.",
        "Before OOP, programs were written as long lists of functions that passed data around as parameters. This worked for small programs but became hard to maintain as projects grew. OOP fixes this by keeping related data and behavior together, so each part of the program is self-contained and responsible for its own state.",
        "The four pillars of OOP are <strong>Encapsulation</strong> (bundling data + behavior), <strong>Abstraction</strong> (hiding complexity behind a simple interface), <strong>Inheritance</strong> (reusing code through parent-child class relationships), and <strong>Polymorphism</strong> (one interface, many forms). You will study all four in depth across these weeks.",
        "In a <strong>UML class diagram</strong>, a class is drawn as a box with three sections: the class name at the top, attributes in the middle, and operations at the bottom. Visibility is shown with <code>+</code> (public), <code>-</code> (private), and <code>#</code> (protected) symbols before each member."
      ],
      keyPoints:[
        "A <strong>class</strong> is a blueprint; an <strong>object</strong> is a concrete instance created from that blueprint.",
        "OOP's four pillars: Encapsulation, Abstraction, Inheritance, Polymorphism.",
        "UML <code>+</code> = public, <code>-</code> = private, <code>#</code> = protected.",
        "Every object has its own copy of non-static data members."
      ],
      code:`#include <iostream>
#include <string>
using namespace std;

class Student {
private:
    string name;    // only accessible inside the class
    int    rollNo;

public:
    // Setter: assigns values to both data members
    void setData(string n, int r) {
        name   = n;
        rollNo = r;
    }

    // const: this function will NOT modify the object
    void show() const {
        cout << name << " (" << rollNo << ")" << endl;
    }
};

int main() {
    Student s1;               // object created from class blueprint
    s1.setData("Ali", 101);   // calling a public method
    s1.show();
    return 0;
}`},
    {title:"PF revision: parameter passing and overloading",
      explanation:[
        "<strong>Pass by value</strong>: A copy of the argument is made and given to the function. Changes inside the function do NOT affect the original variable. This is safe but slightly slower for large objects.",
        "<strong>Pass by reference</strong>: The function receives a reference (alias) to the original variable. Changes inside the function <em>do</em> affect the caller's variable. Use <code>&</code> in the parameter declaration. This is how OOP setter functions typically work.",
        "<strong>Function overloading</strong>: C++ lets you define multiple functions with the same name as long as their parameter lists differ (different number, type, or order of parameters). The compiler picks the right version at compile time based on the arguments you pass — this is compile-time polymorphism.",
        "<strong>Default arguments</strong>: You can assign a default value to a parameter in the function declaration. If the caller doesn't supply that argument, the default is used automatically. Default arguments must appear at the end of the parameter list."
      ],
      keyPoints:[
        "Pass by value: copy is made, original is safe from modification.",
        "Pass by reference (<code>&</code>): function works on the original variable.",
        "Function overloading: same name, different parameter lists — compiler resolves at compile time.",
        "Default arguments: must be placed at the <em>rightmost</em> end of the parameter list."
      ],
      code:`// ── Pass by value vs. pass by reference ──────────────────────
void swapByValue(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    // original variables in main() are NOT changed
}

void swapByReference(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
    // original variables in main() ARE changed
}

// ── Function overloading ──────────────────────────────────────
int area(int side) {
    return side * side;           // square
}

int area(int length, int width) {
    return length * width;        // rectangle
}

// ── Default argument ──────────────────────────────────────────
void greet(string name, string msg = "Hello") {
    cout << msg << ", " << name << endl;
    // greet("Taha")         => "Hello, Taha"
    // greet("Taha","Hi")    => "Hi, Taha"
}`}],
    [{title:"Build a simple Book class",prompt:"Create a `Book` class with private `title` and `pages`. Add `setBook` and `display` functions. In `main`, create one object and test it.",starter:`#include <iostream>
using namespace std;

int main() {
    // create and test Book object here
    return 0;
}`,solution:`#include <iostream>
#include <string>
using namespace std;

class Book {
private:
    string title;
    int pages;
public:
    void setBook(string t, int p) { title = t; pages = p; }
    void display() const {
        cout << "Title: " << title << "\\nPages: " << pages << endl;
    }
};

int main() {
    Book b;
    b.setBook("C++ OOP", 320);
    b.display();
    return 0;
}`},
    {title:"Overload a utility function",prompt:"Write two overloaded `power` functions — one computes `base²`, the other computes `base^exp` using a loop. Test both in `main`.",starter:`#include <iostream>
using namespace std;

// write overloaded power functions here

int main() {
    cout << power(5) << endl;
    cout << power(2, 4) << endl;
}`,solution:`#include <iostream>
using namespace std;

int power(int base) { return base * base; }
int power(int base, int exp) {
    int result = 1;
    for (int i = 0; i < exp; i++) result *= base;
    return result;
}

int main() {
    cout << power(5) << endl;
    cout << power(2, 4) << endl;
}`},
    {title:"Model a Circle class from UML",prompt:"From UML: Circle has private `radius` (double) and public `area()` and `circumference()` methods. Implement it. Use π = 3.14159. Test with radius 7.",starter:`#include <iostream>
using namespace std;

// implement Circle class from UML description

int main() {
    // create Circle with radius 7 and print area and circumference
    return 0;
}`,solution:`#include <iostream>
using namespace std;

class Circle {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}

    double area() const {
        return 3.14159 * radius * radius;
    }

    double circumference() const {
        return 2 * 3.14159 * radius;
    }

    void display() const {
        cout << "Radius: " << radius << endl;
        cout << "Area: " << area() << endl;
        cout << "Circumference: " << circumference() << endl;
    }
};

int main() {
    Circle c(7);
    c.display();
    return 0;
}`}],
    [{question:"Which OOP idea bundles data and functions together inside one unit?",options:["Abstraction","Inheritance","Encapsulation","Overloading"],answer:2,explanation:"Encapsulation means grouping data and the methods that operate on it inside a class."},
     {question:"If a parameter is declared `int &x`, what happens?",options:["A copy is made","The original variable can be modified","The variable becomes constant","The parameter stores an address"],answer:1,explanation:"A reference parameter aliases the original variable — changes inside the function affect the caller."},
     {question:"In UML, which symbol represents a private member?",options:["+","-","#","~"],answer:1,explanation:"The minus sign `-` represents private visibility in UML."},
     {question:"Which of the four OOP pillars hides implementation details behind a simple interface?",options:["Encapsulation","Abstraction","Inheritance","Polymorphism"],answer:1,explanation:"Abstraction exposes only what the user needs and hides the internal complexity behind a clean interface."},
     {question:"In UML, `+` before a member means:",options:["Private","Protected","Public","Static"],answer:2,explanation:"The `+` symbol in UML represents public visibility — accessible from anywhere."},
     {question:"What is the difference between passing by value and by reference?",options:["There is no difference","By value copies the argument; by reference works on the original","By reference copies; by value works on original","Both always copy the argument"],answer:1,explanation:"Pass-by-value creates a copy, leaving the original unchanged. Pass-by-reference aliases the original — changes inside the function affect the caller."},
     {question:"Which statement about default arguments is correct?",options:["They can appear anywhere in the parameter list","They must be at the rightmost end of the parameter list","They replace all other parameters","Default arguments are not allowed in C++"],answer:1,explanation:"Default arguments must be placed at the rightmost end of the parameter list so the compiler can match them unambiguously."}]),

  2: studyWeek(2,"From UML to C++ Classes and Encapsulation",
    ["Translate UML class diagrams into C++ class syntax","Compare `struct` and `class` and understand default access","Apply encapsulation with private data, getters, setters, and validation"],
    [{title:"Reading UML as real C++ code",
      explanation:[
        "A <strong>UML class diagram</strong> is a visual blueprint for a C++ class. The top section holds the class name, the middle section lists attributes (data members) with their types, and the bottom section lists operations (member functions) with their parameter types and return types.",
        "Reading the visibility markers before translating to code: <code>-</code> (minus) means <code>private</code>, <code>+</code> (plus) means <code>public</code>, and <code>#</code> means <code>protected</code>. You translate these markers directly into C++ access specifiers.",
        "The difference between <code>struct</code> and <code>class</code> in C++ is purely about default access. In a <code>struct</code>, all members are <code>public</code> by default. In a <code>class</code>, all members are <code>private</code> by default. Both support functions, constructors, inheritance — they are functionally identical otherwise."
      ],
      keyPoints:[
        "UML box → C++ class: attributes become data members, operations become member functions.",
        "<code>struct</code> defaults to public access; <code>class</code> defaults to private access.",
        "Always translate UML visibility (<code>-</code>, <code>+</code>, <code>#</code>) to C++ access specifiers first.",
        "Read the return type and parameter types from UML to write correct function signatures."
      ],
      code:`// UML description:
//   Account
//   - balance : double          (private attribute)
//   + deposit(amount:double):void   (public operation)
//   + getBalance():double            (public operation)

class Account {
private:
    double balance;    // '-' in UML → private in C++

public:
    // '+' in UML → public in C++
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    double getBalance() const {
        return balance;
    }
};`},
    {title:"Why setters and getters matter",
      explanation:[
        "<strong>Encapsulation</strong> is the practice of keeping data members <code>private</code> and controlling access to them through <code>public</code> getter and setter functions. This protects the object from being put into an invalid state by outside code.",
        "A <strong>getter</strong> (accessor) is a <code>const</code> function that returns the value of a private member without modifying it. A <strong>setter</strong> (mutator) is a function that validates the incoming value <em>before</em> storing it, so invalid data is rejected at the boundary.",
        "Without validation in setters, nothing stops someone from creating a rectangle with negative dimensions or a student with marks above 100. Encapsulation is the first line of defense against such logical errors."
      ],
      keyPoints:[
        "Private data + public getters/setters = encapsulation in practice.",
        "Getters should be <code>const</code> — they read but never modify.",
        "Setters validate: reject invalid values before updating the member.",
        "Never make data members public unless you have a very specific reason."
      ],
      code:`#include <iostream>
using namespace std;

class Rectangle {
private:
    double length;
    double width;

public:
    // Setter with validation — rejects non-positive values
    void setLength(double l) {
        if (l > 0) {
            length = l;
        }
        // negative or zero is silently ignored (could also throw)
    }

    void setWidth(double w) {
        if (w > 0) {
            width = w;
        }
    }

    // Getters are const — they promise not to change the object
    double getLength() const {
        return length;
    }

    double getWidth() const {
        return width;
    }

    double area() const {
        return length * width;
    }
};`}],
    [{title:"Translate UML to `BankAccount`",prompt:"Create a `BankAccount` class: private `owner` and `balance`, public `deposit`, `withdraw`, and `getBalance`. Do not allow the balance to go negative.",starter:`#include <iostream>
#include <string>
using namespace std;

int main() {
    // test BankAccount here
}`,solution:`#include <iostream>
#include <string>
using namespace std;

class BankAccount {
private:
    string owner;
    double balance = 0;
public:
    void setOwner(string o) { owner = o; }
    void deposit(double a) { if (a > 0) balance += a; }
    void withdraw(double a) { if (a > 0 && a <= balance) balance -= a; }
    double getBalance() const { return balance; }
};

int main() {
    BankAccount acc;
    acc.setOwner("Areeba");
    acc.deposit(5000);
    acc.withdraw(1200);
    cout << acc.getBalance() << endl;
}`},
    {title:"Protect rectangle dimensions",prompt:"Write a `Rectangle` class with private `length` and `width`. Add setters that reject negative values, getters, and `area()`.",starter:`#include <iostream>
using namespace std;

// create Rectangle class
int main() { return 0; }`,solution:`#include <iostream>
using namespace std;

class Rectangle {
private:
    double length = 1, width = 1;
public:
    void setLength(double l) { if (l > 0) length = l; }
    void setWidth(double w)  { if (w > 0) width  = w; }
    double getLength() const { return length; }
    double getWidth()  const { return width;  }
    double area()      const { return length * width; }
};

int main() {
    Rectangle r; r.setLength(6.5); r.setWidth(3.2);
    cout << r.area() << endl;
}`},
    {title:"Build a Student class with validation",prompt:"Create a `Student` class with private `name` (string) and `marks` (int, 0–100). Add a setter for marks that rejects values outside the range, a getter, and a `grade()` function that returns 'A' for >=80, 'B' for >=65, 'C' for >=50, 'F' otherwise.",starter:`#include <iostream>
#include <string>
using namespace std;

// implement Student class with validation

int main() {
    // test with valid and invalid marks
    return 0;
}`,solution:`#include <iostream>
#include <string>
using namespace std;

class Student {
private:
    string name;
    int marks;

public:
    Student(string n) : name(n), marks(0) {}

    void setMarks(int m) {
        if (m >= 0 && m <= 100) {
            marks = m;
        } else {
            cout << "Invalid marks: " << m << " (must be 0-100)" << endl;
        }
    }

    int getMarks() const { return marks; }

    char grade() const {
        if (marks >= 80) return 'A';
        if (marks >= 65) return 'B';
        if (marks >= 50) return 'C';
        return 'F';
    }

    void display() const {
        cout << name << ": " << marks << " (" << grade() << ")" << endl;
    }
};

int main() {
    Student s("Taha");
    s.setMarks(85);
    s.display();

    s.setMarks(150);    // rejected
    s.setMarks(45);
    s.display();
    return 0;
}`}],
    [{question:"What is the default access level inside a C++ `class`?",options:["Public","Private","Protected","Friend"],answer:1,explanation:"In a `class`, members are private by default. In a `struct`, they are public by default."},
     {question:"Which member should validate before updating data?",options:["Getter","Setter","Destructor","Constructor overload"],answer:1,explanation:"Setters are the common place to enforce rules before the object's state changes."},
     {question:"Key practical difference between `struct` and `class`?",options:["`struct` cannot contain functions","`class` cannot be inherited","Their default access and inheritance visibility differ","`struct` objects live only on stack"],answer:2,explanation:"Both support OOP, but `struct` defaults to public while `class` defaults to private."},
     {question:"What should a getter function always be declared as?",options:["static","virtual","const","inline"],answer:2,explanation:"Getters read data without modifying the object, so they must be declared `const` to be callable on const objects."},
     {question:"Which UML visibility symbol represents `protected`?",options:["+","-","#","~"],answer:2,explanation:"The `#` symbol in UML represents protected visibility — accessible within the class and its subclasses."},
     {question:"If a setter rejects an invalid value, the data member:",options:["Is set to zero automatically","Retains its previous valid value","Throws an exception always","Is deleted from memory"],answer:1,explanation:"A well-written setter simply does not update the member when validation fails, keeping the previous valid state."},
     {question:"Why make data members private rather than public?",options:["To save memory","To prevent any access to them","To control and validate access through methods","To make the class abstract"],answer:2,explanation:"Private data ensures that all modifications go through controlled setter methods, which can enforce business rules and invariants."}]),

  3: studyWeek(3,"Constructors, Destructors, and the `this` Pointer",
    ["Default and parameterized constructors, constructor overloading","Destructor purpose and automatic cleanup","Using `this` to refer to the current object and resolve shadowing"],
    [{title:"Constructors build valid objects early",
      explanation:[
        "A <strong>constructor</strong> is a special member function that runs <em>automatically</em> the moment an object is created. It has the same name as the class and has <strong>no return type</strong> — not even <code>void</code>. Its job is to initialize the object's data members to valid starting values so the object is never in an undefined state.",
        "The <strong>default constructor</strong> takes no parameters. The <strong>parameterized constructor</strong> accepts arguments so you can supply specific initial values at creation time. You can define both in the same class — this is <strong>constructor overloading</strong>, and C++ automatically picks the matching version based on how you declare the object.",
        "An <strong>initializer list</strong> (<code>: member(value), ...</code>) is written between the constructor's signature and its body. It initializes members <em>before</em> the constructor body runs, which is more efficient for class-type members and is <em>required</em> for <code>const</code> members and references."
      ],
      keyPoints:[
        "Constructor: same name as class, no return type, runs automatically on object creation.",
        "Default constructor = zero parameters. Parameterized = one or more parameters.",
        "Initializer list syntax: <code>ClassName(args) : member1(val1), member2(val2) {}</code>",
        "If you define any constructor, C++ will NOT generate a default constructor implicitly."
      ],
      code:`class Student {
private:
    string name;
    int semester;

public:
    // Default constructor — sets safe starting values
    Student() : name("Unknown"), semester(1) {
        // initializer list is preferred over body assignment
    }

    // Parameterized constructor — initialize with specific values
    Student(string n, int s) : name(n), semester(s) {
        // this->name = n; would also work but list is cleaner
    }

    void show() const {
        cout << name << " — Semester " << semester << endl;
    }
};

int main() {
    Student s1;               // default constructor
    Student s2("Taha", 3);   // parameterized constructor
    s1.show();
    s2.show();
    return 0;
}`},
    {title:"Destructors and the `this` pointer",
      explanation:[
        "A <strong>destructor</strong> is named <code>~ClassName()</code> with no return type and no parameters. It runs automatically when an object goes out of scope (for stack objects) or when <code>delete</code> is called (for heap objects). You <em>cannot</em> call a destructor directly — C++ calls it for you.",
        "The most important use of a destructor is to <strong>free dynamic memory</strong> that was allocated in the constructor. If a class allocates memory with <code>new</code> inside its constructor but doesn't free it in the destructor, you have a <strong>memory leak</strong>.",
        "The <strong><code>this</code> pointer</strong> is implicitly available inside every non-static member function. It points to the object the function was called on. The most common use is to disambiguate when a constructor parameter has the same name as a data member: <code>this->name</code> refers to the data member, while <code>name</code> alone refers to the parameter."
      ],
      keyPoints:[
        "Destructor: <code>~ClassName()</code>, no params, no return, called automatically.",
        "Release <code>new</code>-allocated memory in the destructor with <code>delete</code> or <code>delete[]</code>.",
        "<code>this</code> is a pointer to the current object — available in all non-static member functions.",
        "Use <code>this->member</code> to resolve name shadowing between parameter and data member."
      ],
      code:`#include <iostream>
using namespace std;

class Box {
private:
    int  length;
    int* data;      // pointer to dynamically allocated memory

public:
    Box(int length, int size) {
        this->length = length;   // 'this->' resolves the name shadowing
        data = new int[size];    // allocate array on heap
    }

    // Destructor — frees heap memory when object is destroyed
    ~Box() {
        delete[] data;
        cout << "Box destroyed, memory freed." << endl;
    }

    int getLength() const {
        return length;
    }
};

int main() {
    Box b(10, 5);               // constructor runs, memory allocated
    cout << b.getLength() << endl;
    return 0;                   // destructor runs here automatically
}`}],
    [{title:"Constructor overloading drill",prompt:"Create a `Student` class with private `name` and `age`. Write a default constructor (safe defaults) and a parameterized constructor. Print both in `main`.",starter:`#include <iostream>
#include <string>
using namespace std;

int main() {
    // test both constructors
}`,solution:`#include <iostream>
#include <string>
using namespace std;

class Student {
private:
    string name;
    int age;
public:
    Student() { name = "Unknown"; age = 18; }
    Student(string n, int a) { name = n; age = a; }
    void show() const { cout << name << " - " << age << endl; }
};

int main() {
    Student s1;
    Student s2("Hadi", 20);
    s1.show(); s2.show();
}`},
    {title:"Use `this` to fix name shadowing",prompt:"Make a `Box` class with `length`, `width`, `height`. Write `setDimensions(int length, int width, int height)` using `this` so parameters share the same names as members.",starter:`class Box {
    // complete class here
};`,solution:`#include <iostream>
using namespace std;

class Box {
private:
    int length, width, height;
public:
    Box() : length(0), width(0), height(0) {}
    void setDimensions(int length, int width, int height) {
        this->length = length;
        this->width  = width;
        this->height = height;
    }
    void show() const {
        cout << length << " x " << width << " x " << height << endl;
    }
};`},
    {title:"Destructor trace — observe lifetime",prompt:"Create a `Sensor` class with a `string id`. Write a constructor that prints 'Sensor [id] created' and a destructor that prints 'Sensor [id] destroyed'. Create two objects — one in an inner block, one outside — and observe when destructors fire.",starter:`#include <iostream>
#include <string>
using namespace std;

// implement Sensor class

int main() {
    Sensor s1("A");
    {
        Sensor s2("B");
        cout << "-- inside block --" << endl;
    }
    cout << "-- after block --" << endl;
    return 0;
}`,solution:`#include <iostream>
#include <string>
using namespace std;

class Sensor {
private:
    string id;
public:
    Sensor(string i) : id(i) {
        cout << "Sensor " << id << " created" << endl;
    }

    ~Sensor() {
        cout << "Sensor " << id << " destroyed" << endl;
    }
};

int main() {
    Sensor s1("A");
    {
        Sensor s2("B");
        cout << "-- inside block --" << endl;
    }                       // s2 destructor fires here
    cout << "-- after block --" << endl;
    return 0;               // s1 destructor fires here
}`}],
    [{question:"When is a destructor called for a local object?",options:["Before the constructor","When object goes out of scope","Only if `delete` is used","At start of `main`"],answer:1,explanation:"For local stack objects, the destructor runs automatically when the scope ends."},
     {question:"Which statement about constructors is correct?",options:["A constructor has return type `void`","A constructor must be called manually","A constructor has the same name as the class and no return type","A constructor can only be private"],answer:2,explanation:"Constructors share the class name and declare no return type."},
     {question:"Inside a non-static member function, `this` points to:",options:["The base class","The current object","The constructor","The next object in memory"],answer:1,explanation:"`this` stores the address of the object whose member function is executing."},
     {question:"What is the advantage of using an initializer list over body assignment?",options:["It runs after the constructor body","It is required for all types","It initializes members before the constructor body runs — more efficient","It prevents overloading"],answer:2,explanation:"Initializer lists initialize members directly before the body executes, which is more efficient and required for const members and references."},
     {question:"If you define a parameterized constructor but no default constructor, what happens when you write `ClassName obj;`?",options:["C++ generates a default constructor automatically","Compilation fails — no matching constructor","The object is zero-initialized","The parameterized constructor is called with default values"],answer:1,explanation:"When you provide any constructor, C++ stops generating the implicit default constructor. Declaring an object without arguments then fails compilation."},
     {question:"What does `this->member` mean inside a member function?",options:["Access a static member","Access the member of the next created object","Access the data member of the current object","Call the base class function"],answer:2,explanation:"`this` is a pointer to the current object, so `this->member` explicitly refers to the object's own data member — useful when a parameter has the same name."},
     {question:"A destructor can have:",options:["Parameters and a return type","Parameters but no return type","Neither parameters nor a return type","A return type but no parameters"],answer:2,explanation:"A destructor has the form `~ClassName()` — no parameters, no return type, no overloading."}]),

  4: studyWeek(4,"Dynamic Memory, Object Pointers, References, and Arrays",
    ["Use `new` and `delete` to manage dynamic objects and arrays","Access object members through pointers and references","Work with arrays of objects carefully"],
    [{title:"Dynamic allocation for objects and arrays",
      explanation:[
        "By default, objects declared as local variables live on the <strong>stack</strong> and are destroyed automatically when their scope ends. Sometimes you need an object to outlive its scope, or you don't know at compile time how many objects you'll need — this is where the <strong>heap</strong> (free store) comes in.",
        "Use <code>new ClassName</code> to allocate a single object on the heap. This returns a <strong>pointer</strong> to the object. You must call <code>delete ptr</code> explicitly when you're done, or the memory leaks (it stays allocated even after your program logically doesn't need it anymore).",
        "For arrays, use <code>new Type[n]</code> and release with <code>delete[] ptr</code> — the <code>[]</code> form is mandatory for arrays. Using <code>delete</code> (without brackets) on an array is <em>undefined behavior</em> — it may only destroy the first element or crash."
      ],
      keyPoints:[
        "<code>new</code>: allocates on heap, returns pointer, object persists until <code>delete</code>.",
        "<code>delete ptr</code>: for single objects. <code>delete[] ptr</code>: for arrays. Never mix them.",
        "Forgetting <code>delete</code> = memory leak. Calling <code>delete</code> twice = undefined behavior.",
        "Set the pointer to <code>nullptr</code> after deletion to avoid dangling pointer bugs."
      ],
      code:`#include <iostream>
#include <string>
using namespace std;

class Course {
public:
    string title;

    void show() const {
        cout << title << endl;
    }
};

int main() {
    // ── Single object on the heap ─────────────────────────────
    Course* c = new Course;
    c->title = "OOP";
    c->show();
    delete c;        // must free — otherwise memory leak
    c = nullptr;     // best practice: avoid dangling pointer

    // ── Array of objects on the heap ─────────────────────────
    Course* list = new Course[3];
    list[0].title = "PF";
    list[1].title = "OOP";
    list[2].title = "DSA";

    for (int i = 0; i < 3; i++) {
        list[i].show();
    }

    delete[] list;   // must use delete[] for arrays
    list = nullptr;

    return 0;
}`},
    {title:"Pointers and references to objects",
      explanation:[
        "A <strong>pointer</strong> is a variable that stores a memory address. For objects, you declare it as <code>ClassName *ptr</code>. You access members of the pointed-to object with the <strong>arrow operator</strong> <code>ptr->member</code>, which is shorthand for <code>(*ptr).member</code>.",
        "A <strong>reference</strong> is an alias — another name for an existing variable. You declare it as <code>ClassName &ref = obj</code>. Once bound, a reference cannot be rebound to a different object. You access its members with the normal <strong>dot operator</strong>, exactly as if you were using the original object.",
        "References and pointers are fundamental to polymorphism in C++ — when you later study virtual functions, you'll pass objects through base-class pointers and references to get dynamic dispatch behavior."
      ],
      keyPoints:[
        "Pointer: <code>Type *ptr = &obj;</code> — access with <code>ptr->member</code>.",
        "Reference: <code>Type &ref = obj;</code> — access with <code>ref.member</code> (dot, not arrow).",
        "References must be initialized at declaration; pointers can be reassigned.",
        "Both enable polymorphism — passing derived objects through base pointers/references."
      ],
      code:`class Point {
public:
    int x, y;
};

int main() {
    Point p = {3, 4};

    // Reference — alias for p, uses dot operator
    Point &ref = p;
    ref.x = 10;         // modifies p.x directly

    // Pointer — stores address of p, uses arrow operator
    Point *ptr = &p;
    ptr->y = 20;        // modifies p.y directly
    // equivalent: (*ptr).y = 20;

    cout << p.x << " " << p.y << endl;   // outputs: 10 20

    // Dynamic object accessed through pointer
    Point *heap = new Point;
    heap->x = 5;
    heap->y = 7;
    delete heap;
    return 0;
}`}],
    [{title:"Allocate and destroy a dynamic object",prompt:"Create a `Course` class with `name` and `creditHours`. Allocate it with `new`, assign values, display them, then free the memory correctly.",starter:`#include <iostream>
#include <string>
using namespace std;

int main() { /* solve here */ }`,solution:`#include <iostream>
#include <string>
using namespace std;

class Course {
public:
    string name; int creditHours;
    void show() const { cout << name << " - " << creditHours << " CH" << endl; }
};

int main() {
    Course *oop = new Course;
    oop->name = "OOP"; oop->creditHours = 3;
    oop->show();
    delete oop;
}`},
    {title:"Work with an array of objects",prompt:"Make a `Point` class with `x` and `y`. Create an array of 3 objects, store coordinates, and print them with a loop.",starter:`#include <iostream>
using namespace std;

int main() { /* array of objects */ }`,solution:`#include <iostream>
using namespace std;

class Point { public: int x, y; };

int main() {
    Point points[3] = {{1,2},{3,4},{5,6}};
    for (int i = 0; i < 3; i++)
        cout << "(" << points[i].x << ", " << points[i].y << ")" << endl;
}`},
    {title:"Swap two objects using references",prompt:"Write a `Temperature` class with a private `celsius` value and public getter/setter. Write a standalone `swapTemps(Temperature &a, Temperature &b)` function that swaps the values of two Temperature objects using references.",starter:`#include <iostream>
using namespace std;

// implement Temperature class and swapTemps function

int main() {
    // create two Temperature objects, swap them, print before and after
    return 0;
}`,solution:`#include <iostream>
using namespace std;

class Temperature {
private:
    double celsius;
public:
    Temperature(double c = 0) : celsius(c) {}
    void   set(double c)  { celsius = c; }
    double get()    const { return celsius; }
    void   show()   const { cout << celsius << " C" << endl; }
};

void swapTemps(Temperature &a, Temperature &b) {
    double temp = a.get();
    a.set(b.get());
    b.set(temp);
}

int main() {
    Temperature t1(25.5), t2(100.0);
    cout << "Before: "; t1.show(); t2.show();
    swapTemps(t1, t2);
    cout << "After:  "; t1.show(); t2.show();
    return 0;
}`}],
    [{question:"Which statement correctly deletes an array created by `new`?",options:["`delete arr;`","`delete[] arr;`","`free(arr);`","`remove(arr);`"],answer:1,explanation:"Arrays allocated with `new[]` must be released with `delete[]`."},
     {question:"What is true about a reference to an object?",options:["Can stay uninitialized","Must refer to an existing object","Uses `->` for member access","Always creates a copy"],answer:1,explanation:"A reference must bind to an existing object and acts as an alias for it."},
     {question:"When you have `Student *ptr`, how do you access `name`?",options:["`ptr.name`","`ptr::name`","`ptr->name`","`name.ptr`"],answer:2,explanation:"Pointers to objects use the arrow operator `->` to access members."},
     {question:"What is a memory leak?",options:["Accessing memory after it is freed","Allocating heap memory and never freeing it","Declaring too many local variables","Using `delete` on a stack object"],answer:1,explanation:"A memory leak occurs when heap-allocated memory is never freed with `delete`, so it remains allocated for the program's lifetime."},
     {question:"What is the difference between `ptr->member` and `(*ptr).member`?",options:["They are different operations","They are exactly equivalent","Only `->` works with dynamic objects","Only `(*ptr).` works with pointers"],answer:1,explanation:"`ptr->member` is syntactic sugar for `(*ptr).member` — both dereference the pointer and access the member. They are equivalent."},
     {question:"After `delete ptr;`, what should you do to avoid dangling pointer bugs?",options:["Call `free(ptr)`","Set `ptr = nullptr`","Call `delete ptr` again","Cast ptr to void*"],answer:1,explanation:"Setting a pointer to `nullptr` after deletion prevents accidental use of the now-invalid address."},
     {question:"Which operator is used to access members of an object through a pointer?",options:["`.` (dot)","`::` (scope resolution)","`->` (arrow)","`*` (dereference)"],answer:2,explanation:"The arrow operator `->` is used with pointers to objects. The dot operator `.` is used with objects directly."}]),

  5: studyWeek(5,"Operator Overloading and Copy Constructors",
    ["Overload unary and binary operators for custom classes","Implement stream insertion and extraction operators","Understand copy constructors, shallow copy, and deep copy"],
    [{title:"Making objects behave like built-in types",
      explanation:[
        "<strong>Operator overloading</strong> lets you redefine what standard C++ operators (<code>+</code>, <code>-</code>, <code>==</code>, <code>&lt;&lt;</code>, etc.) do when applied to objects of your class. Without it, writing <code>c1 + c2</code> for two <code>Complex</code> objects would be a compile error. With it, you can make your objects feel as natural as <code>int</code> or <code>double</code>.",
        "Overloaded operators are just functions with special names. A <strong>member operator</strong> like <code>operator+</code> is defined inside the class and takes one parameter (the right-hand operand); the left-hand operand is implicitly <code>this</code>. You return a new object representing the result — do not modify <code>this</code> for arithmetic operators.",
        "Some operators — especially <code>&lt;&lt;</code> (stream insertion) and <code>&gt;&gt;</code> (stream extraction) — must be defined as <strong>non-member friend functions</strong> because the left operand is a stream (<code>ostream</code> or <code>istream</code>), not your class. The friend declaration gives the function access to private members."
      ],
      keyPoints:[
        "Overloaded operator syntax: <code>ReturnType operator+(const ClassName &rhs) const</code>",
        "For arithmetic operators, return a new object — don't modify <code>*this</code>.",
        "<code>&lt;&lt;</code> and <code>&gt;&gt;</code> must be non-member friend functions (stream is the left operand).",
        "Don't overload operators with unexpected behavior — principle of least surprise."
      ],
      code:`#include <iostream>
using namespace std;

class Complex {
private:
    double real;
    double imag;

public:
    // Constructor with default arguments
    Complex(double r = 0, double i = 0) {
        real = r;
        imag = i;
    }

    // Binary operator+ as member function
    // 'this' is left operand, 'other' is right operand
    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }

    // Unary operator- (negation)
    Complex operator-() const {
        return Complex(-real, -imag);
    }

    // Equality comparison operator
    bool operator==(const Complex& other) const {
        return (real == other.real) && (imag == other.imag);
    }

    // Friend: stream insertion operator (cout << obj)
    friend ostream& operator<<(ostream& out, const Complex& c) {
        out << c.real << " + " << c.imag << "i";
        return out;  // return stream to allow chaining
    }
};

int main() {
    Complex c1(2, 3);
    Complex c2(4, 5);
    Complex c3 = c1 + c2;

    cout << c3 << endl;   // calls operator<<
    return 0;
}`},
    {title:"Shallow copy vs. deep copy and the copy constructor",
      explanation:[
        "When you copy an object (via assignment or by passing to a function by value), C++ performs a <strong>memberwise copy</strong> by default. For objects that contain only value-type members (integers, doubles), this is fine. But if a member is a <strong>pointer to heap memory</strong>, the default copy just copies the pointer address — both objects now point to the <em>same</em> block of memory. This is a <strong>shallow copy</strong>.",
        "The problem with shallow copy: when one object's destructor runs, it frees the shared memory. The other object still holds a pointer to that freed memory — a <strong>dangling pointer</strong>. When its destructor also runs, you get a double-delete, which is undefined behavior and often a crash.",
        "The fix is a <strong>deep copy constructor</strong>: <code>ClassName(const ClassName &other)</code>. Inside it, you allocate <em>fresh</em> memory and copy the actual data from the source object. Now each object owns its own copy of the data. The same logic applies to the <strong>copy assignment operator</strong> <code>operator=</code>."
      ],
      keyPoints:[
        "Shallow copy: copies pointer address — two objects share the same heap memory (dangerous).",
        "Deep copy: allocates new memory, copies actual data — each object is independent.",
        "Copy constructor signature: <code>ClassName(const ClassName &other)</code> — must be const reference.",
        "If your class uses <code>new</code>, you almost certainly need: copy constructor + destructor + copy assignment (Rule of Three)."
      ],
      code:`#include <iostream>
#include <cstring>
using namespace std;

class Text {
private:
    char* buffer;   // pointer to heap-allocated string

public:
    // Regular constructor
    Text(const char* src) {
        buffer = new char[strlen(src) + 1];
        strcpy(buffer, src);
    }

    // Deep copy constructor — allocates NEW separate memory
    Text(const Text& other) {
        buffer = new char[strlen(other.buffer) + 1];
        strcpy(buffer, other.buffer);
        // 'this' and 'other' now each have their OWN memory
    }

    // Destructor — each object frees only its own memory
    ~Text() {
        delete[] buffer;
    }

    void show() const {
        cout << buffer << endl;
    }
};

int main() {
    Text t1("Hello");
    Text t2 = t1;    // calls deep copy constructor

    t1.show();       // Hello
    t2.show();       // Hello (independent copy — no sharing)

    return 0;        // both destructors run safely — no double-delete
}`}],
    [{title:"Overload `+` for Complex numbers",prompt:"Create a `Complex` class with `real` and `imag`. Overload `+` so two complex objects can be added directly, then print the result.",starter:`#include <iostream>
using namespace std;

int main() { /* test Complex addition */ }`,solution:`#include <iostream>
using namespace std;

class Complex {
private:
    int real, imag;
public:
    Complex(int r = 0, int i = 0) : real(r), imag(i) {}
    Complex operator+(const Complex &o) const {
        return Complex(real + o.real, imag + o.imag);
    }
    void show() const { cout << real << " + " << imag << "i" << endl; }
};

int main() {
    Complex c1(2,3), c2(4,5);
    (c1 + c2).show();
}`},
    {title:"Write a deep-copy constructor",prompt:"Create `StringBuffer` storing text in a dynamic `char*`. Write constructor, deep-copy constructor, destructor, and `show()` so copies don't share memory.",starter:`#include <iostream>
#include <cstring>
using namespace std;

// create StringBuffer class
`,solution:`#include <iostream>
#include <cstring>
using namespace std;

class StringBuffer {
private:
    char *data;
public:
    StringBuffer(const char *text = "") {
        data = new char[strlen(text) + 1];
        strcpy(data, text);
    }
    StringBuffer(const StringBuffer &other) {
        data = new char[strlen(other.data) + 1];
        strcpy(data, other.data);
    }
    ~StringBuffer() { delete[] data; }
    void show() const { cout << data << endl; }
};`},
    {title:"Overload `==` and `<<` for a Vector2D class",prompt:"Create a `Vector2D` class with `x` and `y` (doubles). Overload `operator==` as a member (returns true if both components match) and `operator<<` as a friend function to print `(x, y)`. Test in `main`.",starter:`#include <iostream>
using namespace std;

// implement Vector2D class

int main() {
    // test == and << operators
    return 0;
}`,solution:`#include <iostream>
using namespace std;

class Vector2D {
private:
    double x, y;

public:
    Vector2D(double x = 0, double y = 0) : x(x), y(y) {}

    bool operator==(const Vector2D &other) const {
        return (x == other.x) && (y == other.y);
    }

    friend ostream& operator<<(ostream &out, const Vector2D &v) {
        out << "(" << v.x << ", " << v.y << ")";
        return out;
    }
};

int main() {
    Vector2D v1(3.0, 4.0), v2(3.0, 4.0), v3(1.0, 2.0);
    cout << v1 << endl;
    cout << "v1 == v2: " << (v1 == v2 ? "true" : "false") << endl;
    cout << "v1 == v3: " << (v1 == v3 ? "true" : "false") << endl;
    return 0;
}`}],
    [{question:"Which operators are commonly overloaded as non-member friend functions?",options:["`+` and `-` only","`<<` and `>>`","`new` and `delete`","`&&` and `||`"],answer:1,explanation:"Stream insertion/extraction often need access to private members and place the stream on the left side."},
     {question:"What is a shallow copy?",options:["A copy that duplicates object code","A copy that only duplicates pointer addresses","A copy that is always safe","A copy made only by constructors"],answer:1,explanation:"A shallow copy copies the raw pointer value, so multiple objects share the same memory."},
     {question:"Standard copy constructor signature?",options:["`ClassName(ClassName other)`","`ClassName(const ClassName &other)`","`void ClassName(ClassName)`","`ClassName(copy other)`"],answer:1,explanation:"Passing by const reference avoids extra copying and matches the usual copy-constructor pattern."},
     {question:"Why is a deep copy necessary when a class contains a pointer?",options:["Because pointers cannot be copied","Because a shallow copy would make two objects share the same heap memory","Because destructors don't run for shallow copies","Because compilers always prohibit shallow copies"],answer:1,explanation:"With a pointer member, a shallow copy duplicates only the address. Both objects then point to the same data — dangerous when one destructor frees it."},
     {question:"For a binary operator `+` overloaded as a member function, how many parameters does it take?",options:["Zero","One (the right-hand operand)","Two (both operands)","Three"],answer:1,explanation:"As a member function, the left operand is `this`. Only the right-hand operand is passed as a parameter."},
     {question:"What is the Rule of Three?",options:["A class should never have more than three members","If you define a destructor, copy constructor, or copy assignment, you likely need all three","You should overload at most three operators","Three objects is the maximum for dynamic allocation"],answer:1,explanation:"If a class manages a resource (like heap memory), defining any one of destructor, copy constructor, or copy assignment operator almost always means you need all three."},
     {question:"Which of the following operators CANNOT be overloaded?",options:["`+`","`==`","`.` (member access)","`<<`"],answer:2,explanation:"The dot operator `.`, scope resolution `::`, ternary `?:`, and `sizeof` cannot be overloaded in C++."}]),

  6: studyWeek(6,"Static Members and Basic Inheritance",
    ["Static data members and static member functions at class level","Base and derived classes with public and protected inheritance","Use inherited behavior instead of duplicating logic"],
    [{title:"Static members belong to the class itself",
      explanation:[
        "Normally, each object of a class gets its own copy of every data member. A <strong>static data member</strong> breaks this rule — there is exactly <em>one copy</em> shared by all objects of the class. It belongs to the class itself, not to any individual object.",
        "You declare a static data member inside the class with the <code>static</code> keyword, but you must also <strong>define and initialize it outside the class</strong>, in global scope: <code>int ClassName::member = 0;</code>. This is a common source of linker errors for beginners who forget the out-of-class definition.",
        "A <strong>static member function</strong> can be called without any object: <code>ClassName::functionName()</code>. Because it has no object, it has no <code>this</code> pointer, and therefore it can only access other static members. It cannot access non-static data members."
      ],
      keyPoints:[
        "Static data member: one shared copy for all objects. Declared in class, defined outside.",
        "Definition syntax outside class: <code>int ClassName::memberName = initialValue;</code>",
        "Static member function: no <code>this</code> pointer, can only access static members.",
        "Call with class name: <code>ClassName::staticFunc()</code> — no object required."
      ],
      code:`class Employee {
private:
    string name;
    static int count;   // ONE copy shared by all Employee objects

public:
    Employee(string n) : name(n) {
        count++;    // increments the single shared counter
    }

    ~Employee() {
        count--;    // decrements when an object is destroyed
    }

    // Static function — called on class, not on object
    static int getCount() {
        return count;
        // cannot access 'name' here — no 'this' pointer
    }
};

// Must define static member outside the class body
int Employee::count = 0;

int main() {
    Employee e1("Ali"), e2("Sana");
    cout << Employee::getCount() << endl;   // 2
    {
        Employee e3("Umar");
        cout << Employee::getCount() << endl;  // 3
    }   // e3 destroyed here
    cout << Employee::getCount() << endl;   // 2
    return 0;
}`},
    {title:"Inheritance reuses stable behavior",
      explanation:[
        "<strong>Inheritance</strong> is one of OOP's four pillars. It allows a new class (the <strong>derived</strong> or child class) to acquire the properties and behaviors of an existing class (the <strong>base</strong> or parent class) without rewriting them. The derived class extends or specializes the base.",
        "In C++, you write <code>class Derived : public Base</code>. The <code>public</code> keyword is the <strong>inheritance access specifier</strong> — with <code>public</code> inheritance, all public members of the base remain public in the derived class, and protected members remain protected. This is the most common and most intuitive form.",
        "The <code>protected</code> access level is specifically designed for inheritance: it is <em>inaccessible from outside code</em> (like <code>private</code>) but <em>accessible inside derived classes</em> (unlike <code>private</code>). Use <code>protected</code> for data you want derived classes to read and use but want to hide from the rest of the world."
      ],
      keyPoints:[
        "Syntax: <code>class Derived : public Base { ... };</code>",
        "<code>public</code> inheritance: public → public, protected → protected (most common form).",
        "<code>protected</code> members: hidden from outside, but accessible in derived classes.",
        "Base class constructor runs <strong>first</strong>, then derived constructor runs."
      ],
      code:`#include <iostream>
#include <string>
using namespace std;

class Vehicle {
protected:
    int    speed;   // accessible in derived classes, hidden from outside
    string brand;

public:
    // Default constructor
    Vehicle() {
        speed = 0;
        brand = "Unknown";
    }

    // Parameterized constructor
    Vehicle(string b, int s) {
        brand = b;
        speed = s;
    }

    void setSpeed(int s) {
        speed = s;
    }

    void showBase() const {
        cout << "Brand: " << brand
             << ", Speed: " << speed << endl;
    }
};

class Car : public Vehicle {
private:
    int doors;

public:
    // Calls base constructor via initializer list
    Car(string b, int s, int d) : Vehicle(b, s) {
        doors = d;
    }

    void show() const {
        // Can access speed and brand because they are protected
        cout << brand   << " — "
             << speed   << " km/h — "
             << doors   << " doors" << endl;
    }
};

int main() {
    Car c("Toyota", 120, 4);
    c.show();

    c.setSpeed(150);   // inherited public method
    c.show();

    return 0;
}`}],
    [{title:"Track objects with a static counter",prompt:"Create an `Employee` class with a static `count` that increments each time an object is created. Provide `getCount()` and show the total in `main`.",starter:`#include <iostream>
using namespace std;

// create Employee class here
`,solution:`#include <iostream>
using namespace std;

class Employee {
private:
    static int count;
public:
    Employee() { count++; }
    static int getCount() { return count; }
};

int Employee::count = 0;

int main() {
    Employee e1, e2, e3;
    cout << Employee::getCount() << endl;
}`},
    {title:"Create a simple derived class",prompt:"Write base class `Vehicle` with protected `speed` and a setter. Derive `Car` from it and print the inherited speed in `display()`.",starter:`#include <iostream>
using namespace std;

// build Vehicle and Car
`,solution:`#include <iostream>
using namespace std;

class Vehicle {
protected:
    int speed;
public:
    Vehicle() : speed(0) {}
    void setSpeed(int s) { speed = s; }
};

class Car : public Vehicle {
public:
    void display() const { cout << "Speed: " << speed << " km/h" << endl; }
};

int main() {
    Car c; c.setSpeed(120); c.display();
}`},
    {title:"Bank with static interest rate",prompt:"Create a `SavingsAccount` class with private `balance` and a `static double interestRate`. Write a static `setRate()` function and a non-static `applyInterest()` that multiplies balance by (1 + rate). Create two accounts and show that changing the rate via the class affects both.",starter:`#include <iostream>
using namespace std;

// implement SavingsAccount

int main() {
    // test static interest rate shared across objects
    return 0;
}`,solution:`#include <iostream>
using namespace std;

class SavingsAccount {
private:
    double balance;
    static double interestRate;

public:
    SavingsAccount(double b) : balance(b) {}

    static void setRate(double r) {
        interestRate = r;
    }

    void applyInterest() {
        balance *= (1.0 + interestRate);
    }

    void show() const {
        cout << "Balance: " << balance << endl;
    }
};

double SavingsAccount::interestRate = 0.05;

int main() {
    SavingsAccount a1(1000), a2(2000);
    cout << "Rate 5%:" << endl;
    a1.applyInterest(); a1.show();
    a2.applyInterest(); a2.show();

    SavingsAccount::setRate(0.10);
    cout << "Rate 10%:" << endl;
    a1.applyInterest(); a1.show();
    a2.applyInterest(); a2.show();
    return 0;
}`}],
    [{question:"A static data member is shared by:",options:["Only one local function","Every object of the class","Only derived classes","Only global code"],answer:1,explanation:"Static members belong to the class as a whole, not to individual objects."},
     {question:"What is special about `protected` members?",options:["Visible everywhere","Visible only in `main`","Accessible in derived classes but hidden from outside","Same as private in every situation"],answer:2,explanation:"`protected` sits between `private` and `public`: derived classes can use it, outside code cannot."},
     {question:"When a derived object is created, which constructor runs first?",options:["Derived constructor only","Base constructor first","Destructor first","Whichever class is larger"],answer:1,explanation:"Construction begins with the base part and then continues into the derived part."},
     {question:"How must a static data member be initialized?",options:["Inside the class constructor","Inside any member function","Outside the class in global scope","It is automatically zero-initialized and needs no definition"],answer:2,explanation:"Static data members must be defined and initialized outside the class body in global scope: `Type ClassName::member = value;`"},
     {question:"Can a static member function access non-static data members?",options:["Yes, always","Only if declared const","No — it has no `this` pointer","Only through a pointer parameter"],answer:2,explanation:"Static member functions have no implicit `this` pointer, so they cannot directly access non-static data members."},
     {question:"Which inheritance access specifier keeps public base members public in the derived class?",options:["private","protected","public","static"],answer:2,explanation:"With `public` inheritance, public members of the base class remain public in the derived class — the most common and natural form."},
     {question:"A derived class object contains:",options:["Only its own members","Only the base class members","Both the base class subobject and its own members","A pointer to the base class only"],answer:2,explanation:"A derived class object physically contains the base class subobject plus its own additional members."}]),

  7: studyWeek(7,"Inheritance Types, Multiple Inheritance, and Virtual Inheritance",
    ["Recognize single, multilevel, and hierarchical inheritance","Model multiple inheritance and its ambiguity issues","Resolve the diamond problem using virtual inheritance"],
    [{title:"Types of inheritance structures",
      explanation:[
        "C++ supports several inheritance patterns. <strong>Single inheritance</strong>: one derived class inherits from one base. <strong>Multilevel inheritance</strong>: a chain — A → B → C. B inherits from A, C inherits from B, so C gets everything from both A and B. <strong>Hierarchical inheritance</strong>: multiple derived classes all inherit from the same single base (a fan-out shape).",
        "<strong>Multiple inheritance</strong>: a single derived class inherits from two or more base classes simultaneously — <code>class TA : public Teacher, public Researcher</code>. This is powerful but introduces the risk of <strong>ambiguity</strong>: if both base classes define a member with the same name, the compiler cannot decide which one you mean without an explicit scope resolution (<code>Teacher::method()</code>).",
        "The golden rule for using inheritance: only use it when the relationship is genuinely <strong>is-a</strong>. A <code>Car</code> is-a <code>Vehicle</code> — inheritance is correct. A <code>Car</code> has-an <code>Engine</code> — this is containment (composition), not inheritance."
      ],
      keyPoints:[
        "Single: one base, one derived. Multilevel: chain A→B→C. Hierarchical: one base, many derived.",
        "Multiple inheritance: <code>class D : public B1, public B2 {};</code>",
        "Ambiguity: two base classes share the same member name — resolve with <code>Base::member</code>.",
        "Use inheritance only for genuine <strong>is-a</strong> relationships, not has-a."
      ],
      code:`#include <iostream>
#include <string>
using namespace std;

// ── Single inheritance ────────────────────────────────────────
class Person {
public:
    string name;
};

class Student : public Person {
public:
    int rollNo;
};

// ── Multilevel inheritance ────────────────────────────────────
class GraduateStudent : public Student {
public:
    string thesis;
    // Has: name (from Person) + rollNo (from Student) + thesis
};

// ── Hierarchical inheritance ──────────────────────────────────
class Teacher : public Person {
public:
    string subject;
};

class Admin : public Person {
public:
    string department;
};

// ── Multiple inheritance ──────────────────────────────────────
class TeachingAssistant : public Teacher, public Student {
    // Gets members from both Teacher and Student
    // Ambiguity: both have 'name' inherited from Person
};

int main() {
    TeachingAssistant ta;

    // ta.name = "Ali";            // ERROR: ambiguous — which 'name'?
    ta.Teacher::name = "Ali";     // OK: scope resolution resolves it

    return 0;
}`},
    {title:"The diamond problem and virtual inheritance",
      explanation:[
        "The <strong>diamond problem</strong> occurs in multiple inheritance when two intermediate base classes both inherit from the same top-level base. The most-derived class ends up with <em>two copies</em> of the top-level base's members — one through each intermediate. This causes ambiguity and wastes memory.",
        "Example: <code>Person</code> → <code>Teacher</code> and <code>Researcher</code> → <code>TA</code>. Without virtual inheritance, <code>TA</code> contains two separate <code>Person</code> subobjects. Accessing <code>ta.name</code> is ambiguous because the compiler doesn't know which copy you mean.",
        "<strong>Virtual inheritance</strong> solves this. By declaring <code>class Teacher : virtual public Person</code> and <code>class Researcher : virtual public Person</code>, you tell C++ to maintain only <em>one shared</em> <code>Person</code> subobject in any further-derived class. <code>TA</code> then has just one <code>name</code>, and there is no ambiguity."
      ],
      keyPoints:[
        "Diamond: A → B, A → C, B+C → D. Without virtual, D has two copies of A.",
        "Fix: add <code>virtual</code> to the intermediate class's inheritance of the common base.",
        "Syntax: <code>class B : virtual public A {};</code>",
        "With virtual inheritance, the most-derived class's constructor must initialize the virtual base directly."
      ],
      code:`#include <iostream>
#include <string>
using namespace std;

// WITHOUT virtual: diamond problem
// ─────────────────────────────────
// class Person   { public: string name; };
// class Teacher    : public Person {};
// class Researcher : public Person {};
// class TA : public Teacher, public Researcher {};
// TA ta;
// ta.name = "Ali";   // ERROR: ambiguous (two 'name' copies exist)

// WITH virtual: problem solved
// ─────────────────────────────
class Person {
public:
    string name;

    Person(string n = "") {
        name = n;
    }
};

class Teacher : virtual public Person {
public:
    string subject;

    Teacher(string s = "") {
        subject = s;
    }
};

class Researcher : virtual public Person {
public:
    string field;

    Researcher(string f = "") {
        field = f;
    }
};

// Only ONE shared Person subobject inside TA
class TA : public Teacher, public Researcher {
public:
    // Most-derived class must initialize the virtual base directly
    TA(string n, string s, string f) : Person(n), Teacher(s), Researcher(f) {
    }

    void show() const {
        cout << "Name:    " << name    << endl;  // no ambiguity
        cout << "Subject: " << subject << endl;
        cout << "Field:   " << field   << endl;
    }
};

int main() {
    TA ta("Hoorain", "Math", "AI");
    ta.show();
    return 0;
}`}],
    [{title:"Build a multilevel hierarchy",prompt:"Model `Person -> Employee -> Manager`. `Person` stores name, `Employee` stores ID, `Manager` adds department. Print all info from the most-derived class.",starter:`#include <iostream>
#include <string>
using namespace std;

// write hierarchy here
`,solution:`#include <iostream>
#include <string>
using namespace std;

class Person {
protected: string name;
public: void setName(string n) { name = n; }
};

class Employee : public Person {
protected: int id;
public: void setId(int i) { id = i; }
};

class Manager : public Employee {
private: string department;
public:
    void setDepartment(string d) { department = d; }
    void show() const {
        cout << name << " | " << id << " | " << department << endl;
    }
};`},
    {title:"Resolve diamond with virtual inheritance",prompt:"Create `Person` as base, `Teacher` and `Researcher` inheriting virtually, then `TA` from both. Show that `name` exists only once.",starter:`#include <iostream>
#include <string>
using namespace std;

// create diamond hierarchy
`,solution:`#include <iostream>
#include <string>
using namespace std;

class Person { public: string name; };
class Teacher    : virtual public Person {};
class Researcher : virtual public Person {};

class TA : public Teacher, public Researcher {
public:
    void show() const { cout << "TA: " << name << endl; }
};

int main() {
    TA assistant;
    assistant.name = "Hoorain";
    assistant.show();
}`},
    {title:"Hierarchical inheritance with shape area",prompt:"Create a base class `Shape` with a protected `color` and a virtual `area()` returning 0. Derive `Square` and `Triangle` from `Shape`. `Square` stores `side`, `Triangle` stores `base` and `height`. Override `area()` in each. Print results.",starter:`#include <iostream>
#include <string>
using namespace std;

// implement Shape, Square, Triangle

int main() {
    // create both shapes and print their areas
    return 0;
}`,solution:`#include <iostream>
#include <string>
using namespace std;

class Shape {
protected:
    string color;
public:
    Shape(string c = "white") : color(c) {}
    virtual double area() const { return 0.0; }
};

class Square : public Shape {
private:
    double side;
public:
    Square(double s, string c) : Shape(c), side(s) {}
    double area() const override { return side * side; }
};

class Triangle : public Shape {
private:
    double base, height;
public:
    Triangle(double b, double h, string c) : Shape(c), base(b), height(h) {}
    double area() const override { return 0.5 * base * height; }
};

int main() {
    Square sq(5.0, "red");
    Triangle tr(6.0, 4.0, "blue");
    cout << "Square area: "   << sq.area() << endl;
    cout << "Triangle area: " << tr.area() << endl;
    return 0;
}`}],
    [{question:"Which inheritance type: one base class has several derived classes?",options:["Single","Multilevel","Hierarchical","Virtual"],answer:2,explanation:"Hierarchical inheritance fans one base class out into multiple derived classes."},
     {question:"Main benefit of virtual inheritance?",options:["Makes all functions virtual","Prevents duplicate base-class subobjects in diamond","Removes need for constructors","Allows only private inheritance"],answer:1,explanation:"Virtual inheritance solves the diamond problem by ensuring only one shared base exists."},
     {question:"Why does ambiguity happen in multiple inheritance?",options:["Classes cannot have constructors","Two parent classes may provide members with the same name","Private members become public","Derived classes cannot add new methods"],answer:1,explanation:"If both parents contribute the same member name, the compiler needs help deciding which one you mean."},
     {question:"In multilevel inheritance A → B → C, what does C inherit?",options:["Only B's members","Only A's members","Members of both A and B (transitively)","Nothing — inheritance does not chain"],answer:2,explanation:"In multilevel inheritance, each level inherits from the one above. C inherits from B, which inherited from A, so C gets everything accessible from both."},
     {question:"How do you resolve ambiguity when two base classes have a method with the same name?",options:["Use `virtual` on the method","Call it normally — C++ resolves automatically","Use scope resolution: `Base::method()`","Rename one of the classes"],answer:2,explanation:"When two base classes have a member with the same name, you explicitly qualify the call with the class name using scope resolution."},
     {question:"What keyword makes a base class inheritance virtual to solve the diamond problem?",options:["`abstract`","`shared`","`virtual`","`override`"],answer:2,explanation:"Adding `virtual` to the inheritance declaration (`class B : virtual public A`) tells the compiler to keep only one shared subobject of A in any further-derived class."},
     {question:"In hierarchical inheritance, how many base classes are there?",options:["One base, one derived","One base, many derived","Many bases, one derived","Many bases, many derived"],answer:1,explanation:"Hierarchical inheritance has one base class from which multiple derived classes inherit independently."}]),

  8: studyWeek(8,"Class Relationships: Association, Aggregation, and Composition",
    ["Differentiate association, aggregation, and composition in code and UML","Use `has-a` and `is-a` correctly when modeling systems","Explain object lifetime ownership in class design"],
    [{title:"Association, aggregation, and composition compared",
      explanation:[
        "These three relationships describe how classes are connected to each other. <strong>Association</strong> is the loosest form — two objects are simply aware of each other and can interact, but neither owns the other. For example, a <code>Student</code> and a <code>Course</code> are associated: a student enrolls in a course, but neither object controls the other's lifetime.",
        "<strong>Aggregation</strong> is a stronger form of association representing a <em>whole-part</em> relationship where the part can exist independently of the whole. In code, this is typically modeled with a <strong>pointer or reference</strong>: the containing class holds a pointer to objects it doesn't own. If the container is destroyed, the parts still exist. Example: a <code>Department</code> holds pointers to <code>Professor</code> objects — professors exist outside the department and can belong to multiple departments.",
        "<strong>Composition</strong> is the strongest relationship — the part <em>cannot</em> exist without the whole. The containing class owns the part as a direct <strong>data member</strong> (not a pointer). When the containing object is destroyed, the contained object is automatically destroyed too. Example: a <code>Car</code> contains an <code>Engine</code> as a data member — the engine only makes sense as part of that specific car."
      ],
      keyPoints:[
        "Association: objects know each other, no ownership, both exist independently.",
        "Aggregation: whole-part, part can exist independently, modeled with pointer/reference.",
        "Composition: whole-part, part CANNOT exist without the whole, modeled with direct member.",
        "In UML: composition uses filled diamond ◆, aggregation uses hollow diamond ◇."
      ],
      code:`#include <iostream>
#include <vector>
#include <string>
using namespace std;

// ── Association: Student uses Course but does NOT own it ─────
class Course {
public:
    string name;
};

class Student {
public:
    void enroll(Course& c) {   // reference — no ownership taken
        cout << "Enrolled in: " << c.name << endl;
    }
};

// ── Aggregation: Department holds Professors via pointer ─────
class Professor {
public:
    string name;

    Professor(string n) {
        name = n;
    }
};

class Department {
private:
    vector<Professor*> faculty;   // pointers — parts NOT owned

public:
    void addFaculty(Professor* p) {
        faculty.push_back(p);
    }
    // Professor objects survive even after Department is destroyed
};

// ── Composition: Car owns Engine as a direct member ──────────
class Engine {
public:
    void start() const {
        cout << "Engine running" << endl;
    }
};

class Car {
private:
    Engine engine;   // direct member — Car OWNS this Engine

public:
    void drive() {
        engine.start();
    }
    // Engine is created and destroyed together with Car
};`},
    {title:"`Has-a` vs `is-a`: choosing composition or inheritance",
      explanation:[
        "The most important design decision in OOP is whether to use <strong>inheritance</strong> or <strong>composition</strong>. The rule of thumb: use inheritance for <strong>is-a</strong> relationships, use composition for <strong>has-a</strong> relationships.",
        "A <code>Car</code> <em>is-a</em> <code>Vehicle</code> → inheritance is appropriate. A <code>Car</code> <em>has-a</em> <code>Engine</code> → composition is appropriate. Getting this wrong leads to fragile designs. For example, making <code>Car</code> inherit from <code>Engine</code> would be a design error — a car is not a specialized engine.",
        "In UML diagrams, inheritance is shown with a solid arrow (→) pointing from derived to base. Composition and aggregation use diamonds. Always read the relationship in plain English before picking a modeling approach — if you can't say '<em>X is a Y</em>' naturally, don't use inheritance."
      ],
      keyPoints:[
        "<strong>is-a</strong> → use inheritance. <strong>has-a</strong> → use composition or aggregation.",
        "Prefer composition over inheritance when in doubt — it is more flexible and easier to change.",
        "Inheritance creates a tightly coupled relationship; changing the base affects all derived classes.",
        "Test: can you substitute the derived object wherever the base is expected? (Liskov substitution)"
      ],
      code:`#include <iostream>
using namespace std;

// ── is-a relationship → use inheritance ──────────────────────
class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {   // Circle IS-A Shape ✓
private:
    double radius;

public:
    Circle(double r) {
        radius = r;
    }

    double area() const override {
        return 3.14159 * radius * radius;
    }
};

// ── has-a relationship → use composition ─────────────────────
class Engine {
public:
    void start() const {
        cout << "Vroom!" << endl;
    }
};

class Car {                // Car HAS-A Engine ✓
private:
    Engine engine;         // direct member — owned by Car

public:
    void drive() {
        engine.start();
    }
};

// ── WRONG design: Car should NOT inherit from Engine ──────────
// class Car : public Engine {};
// A Car is NOT an Engine — this violates the is-a rule`}],
    [{title:"Aggregation with external objects",prompt:"Create `Professor` and `Department`. `Department` stores pointers to professors. Show how professors can exist outside the department — proving this is aggregation, not composition.",starter:`#include <iostream>
#include <vector>
#include <string>
using namespace std;

// solve here
`,solution:`#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Professor {
public:
    string name;
    Professor(string n) : name(n) {}
};

class Department {
private:
    vector<Professor*> faculty;
public:
    void addProfessor(Professor *p) { faculty.push_back(p); }
    void show() const { for (auto p : faculty) cout << p->name << endl; }
};`},
    {title:"Composition with owned parts",prompt:"Create `Engine` and `Car`. Make `Car` contain an `Engine` object directly and expose `startCar()`. The structure itself explains why this is composition.",starter:`#include <iostream>
using namespace std;

// create Engine and Car
`,solution:`#include <iostream>
using namespace std;

class Engine {
public:
    void start() const { cout << "Engine started" << endl; }
};

class Car {
private:
    Engine engine; // owned directly — composition
public:
    void startCar() const { engine.start(); }
};

int main() { Car c; c.startCar(); }`},
    {title:"Library system with association",prompt:"Model a `Library` and `Member` class. A `Member` can `borrow(Book &b)` — just print the member name and book title. This is an association: Member uses Book, but doesn't own it. Create at least one Book class with a title.",starter:`#include <iostream>
#include <string>
using namespace std;

// implement Book, Member, show association

int main() {
    // demonstrate borrowing
    return 0;
}`,solution:`#include <iostream>
#include <string>
using namespace std;

class Book {
public:
    string title;
    Book(string t) : title(t) {}
};

class Member {
private:
    string name;
public:
    Member(string n) : name(n) {}

    // Association: Member USES Book but does NOT own it
    void borrow(const Book &b) {
        cout << name << " borrowed: " << b.title << endl;
    }
};

int main() {
    Book b1("Clean Code"), b2("C++ Primer");
    Member m("Taha");
    m.borrow(b1);
    m.borrow(b2);
    // b1 and b2 exist independently of Member — pure association
    return 0;
}`}],
    [{question:"Which relationship gives strongest ownership and lifetime control?",options:["Association","Aggregation","Composition","Friendship"],answer:2,explanation:"In composition, the containing object owns its parts and controls their creation and destruction."},
     {question:"Which best describes association?",options:["One object fully owns the other","One class inherits another","Objects are related but can exist independently","Forces private inheritance"],answer:2,explanation:"Association is a loose link; neither object necessarily owns the other."},
     {question:"`Car is-a Vehicle` usually suggests:",options:["Composition","Aggregation","Inheritance","Operator overloading"],answer:2,explanation:"`Is-a` relationships usually map to inheritance, while `has-a` maps to containment."},
     {question:"In aggregation, the part object:",options:["Cannot exist without the whole","Is destroyed when the whole is destroyed","Can exist independently of the whole","Must be a private member of the whole"],answer:2,explanation:"In aggregation, the part can exist independently. The whole typically holds a pointer/reference to it rather than owning it outright."},
     {question:"Which code pattern best represents composition?",options:["Storing a pointer to an external object","Storing a direct object as a data member","Inheriting from the part class","Passing the part to a function"],answer:1,explanation:"Composition is modeled by storing the part as a direct data member. It is created and destroyed with the containing object."},
     {question:"The UML diamond symbol (◆ filled) represents:",options:["Inheritance","Association","Aggregation","Composition"],answer:3,explanation:"A filled diamond in UML represents composition — the strongest ownership relationship where the part cannot exist without the whole."},
     {question:"If `Department` is destroyed and `Professor` objects still exist, the relationship is:",options:["Composition","Inheritance","Aggregation","Association"],answer:2,explanation:"When the 'whole' is destroyed but the 'parts' survive independently, the relationship is aggregation, not composition."}]),

  9: examWeek(9,"Midterm Simulation: Weeks 1 to 8",
    ["Mixed exam covering OOP basics, class design, constructors, memory, operators, inheritance, and relationships","MCQs are auto-scored; coding prompts use guided self-check after revealing the model answer","Use topic navigator for quick jumps and submit for a score summary"],
    60,
    [{topic:"Foundations and Class Design",intro:"Warm up with OOP meaning, UML interpretation, functions, and encapsulation-based design choices.",questions:[
      {id:"m1",type:"mcq",prompt:"Which best describes abstraction in OOP?",options:["Hiding low-level details behind a useful interface","Making every member public","Avoiding classes entirely","Copying objects deeply"],answer:0,explanation:"Abstraction exposes essential behavior while hiding unnecessary implementation details."},
      {id:"m2",type:"mcq",prompt:"When a function receives an object by reference, it:",options:["Always creates a temporary copy","Can modify the original object","Cannot call member functions","Must use `new` internally"],answer:1,explanation:"A reference parameter works with the caller's actual object."},
      {id:"m3",type:"coding",prompt:"Write a `Student` class with private `name` and `gpa`, plus `setData` and `show` functions. Create one object in `main`.",starter:`#include <iostream>
#include <string>
using namespace std;
int main() { /* solve here */ }`,solution:`class Student {
private:
    string name; double gpa;
public:
    void setData(string n, double g) { name = n; gpa = g; }
    void show() const { cout << name << " : " << gpa << endl; }
};`},
      {id:"m4",type:"mcq",prompt:"Default access level of members in a `struct`?",options:["Private","Protected","Public","Virtual"],answer:2,explanation:"`struct` defaults to public access, unlike `class` which defaults to private."}
    ]},
    {topic:"Constructors and Dynamic Memory",intro:"Object lifetime, initialization, destruction, and safe allocation patterns.",questions:[
      {id:"m5",type:"mcq",prompt:"Which function has the same name as the class and no return type?",options:["Destructor","Setter","Constructor","Friend function"],answer:2,explanation:"That is the definition of a constructor."},
      {id:"m6",type:"coding",prompt:"Create a `Course` object dynamically with `new`, assign a title, display it, and free memory correctly.",starter:`#include <iostream>
#include <string>
using namespace std;
// write a small Course class and test it`,solution:`class Course {
public:
    string title;
    void show() const { cout << title << endl; }
};

Course *c = new Course;
c->title = "OOP";
c->show();
delete c;`},
      {id:"m7",type:"mcq",prompt:"Correct delete form for `new Type[5]`?",options:["`delete ptr;`","`delete[] ptr;`","`free(ptr);`","`remove(ptr);`"],answer:1,explanation:"Arrays created with `new[]` must be paired with `delete[]`."},
      {id:"m8",type:"mcq",prompt:"The `this` pointer refers to:",options:["The base class","The current object","The previous object created","Only static members"],answer:1,explanation:"`this` stores the address of the current object whose member function is running."}
    ]},
    {topic:"Operators, Copying, and Inheritance",intro:"Custom operators, copy behavior, static members, and inheritance rules.",questions:[
      {id:"m9",type:"mcq",prompt:"A shallow copy is risky because it:",options:["Makes deep copies too slowly","Copies pointer addresses instead of owned data","Always fails to compile","Deletes constructors"],answer:1,explanation:"Shallow copying duplicates the address, so both objects can own the same memory."},
      {id:"m10",type:"coding",prompt:"Overload the `+` operator for a `Complex` class with `real` and `imag` members.",starter:`class Complex {
    // write class here
};`,solution:`class Complex {
private:
    int real, imag;
public:
    Complex(int r = 0, int i = 0) : real(r), imag(i) {}
    Complex operator+(const Complex &o) const {
        return Complex(real + o.real, imag + o.imag);
    }
};`},
      {id:"m11",type:"mcq",prompt:"A static member belongs to:",options:["One object only","The class itself","Only derived classes","Only global scope"],answer:1,explanation:"Static members are shared across all objects of the class."},
      {id:"m12",type:"mcq",prompt:"What access level allows derived classes to use a member but hides it from outside code?",options:["public","private","friend","protected"],answer:3,explanation:"`protected` is designed for base-to-derived reuse without exposing the member publicly."}
    ]},
    {topic:"Advanced Inheritance and Relationships",intro:"Virtual inheritance, relationship design, and UML reasoning.",questions:[
      {id:"m13",type:"mcq",prompt:"Virtual inheritance is mainly used to solve:",options:["Memory leaks","The diamond problem","Operator ambiguity only","Stack overflow"],answer:1,explanation:"Virtual inheritance removes duplicate base-class subobjects in a diamond hierarchy."},
      {id:"m14",type:"coding",prompt:"Model composition by creating `Engine` and `Car`, where `Car` owns an `Engine` object directly.",starter:`#include <iostream>
using namespace std;
// build Engine and Car`,solution:`class Engine {
public:
    void start() const { cout << "Engine on" << endl; }
};
class Car {
private:
    Engine engine;
public:
    void drive() const { engine.start(); }
};`},
      {id:"m15",type:"mcq",prompt:"Which relationship best matches `Department` storing pointers to existing `Professor` objects?",options:["Composition","Aggregation","Inheritance","Operator overloading"],answer:1,explanation:"The department refers to professors but does not fully own their lifetime — aggregation."}
    ]}]),

  10: studyWeek(10,"Const Correctness and Polymorphism Introduction",
    ["Differentiate const and non-const member functions","Understand compile-time vs run-time polymorphism","Use virtual functions and `override` for dynamic dispatch"],
    [{title:"Const correctness — writing trustworthy classes",
      explanation:[
        "Marking a member function <code>const</code> is a <strong>promise to the compiler and to readers</strong> that calling this function will not change the object's observable state. The compiler enforces this — if you try to modify a data member inside a <code>const</code> function, you get a compile error.",
        "Why does this matter? When you have a <code>const</code> object or receive an object as a <code>const</code> reference, you can <em>only</em> call its <code>const</code> member functions. If you forget to mark <code>display()</code> or <code>getBalance()</code> as <code>const</code>, those functions become unavailable on any <code>const</code> object — which is a surprisingly common bug.",
        "Best practice: any member function that reads data but doesn't change the object should be <code>const</code>. Getters are almost always <code>const</code>. This also signals intent to everyone reading your code — <code>const</code> functions are safe to call; non-<code>const</code> functions modify something."
      ],
      keyPoints:[
        "Syntax: <code>ReturnType functionName() const { ... }</code> — <code>const</code> goes after the closing parenthesis.",
        "A <code>const</code> member function cannot modify data members (except <code>mutable</code> ones).",
        "<code>const</code> objects can only call <code>const</code> member functions.",
        "All getters should be <code>const</code>. If a function doesn't modify state, make it <code>const</code>."
      ],
      code:`#include <iostream>
#include <string>
using namespace std;

class BankAccount {
private:
    string owner;
    double balance;

public:
    BankAccount(string o, double b) {
        owner   = o;
        balance = b;
    }

    // Getters are const — they only read, never modify
    string getOwner() const {
        return owner;
    }

    double getBalance() const {
        return balance;
    }

    void display() const {
        cout << owner << ": Rs. " << balance << endl;
    }

    // Mutators are NOT const — they change the object's state
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
        }
    }
};

void printInfo(const BankAccount& acc) {
    acc.display();        // OK — const function on const reference
    // acc.deposit(100);  // ERROR — cannot call non-const on const ref
}`},
    {title:"Compile-time vs run-time polymorphism",
      explanation:[
        "<strong>Compile-time polymorphism</strong> (also called static polymorphism) is resolved by the compiler before the program runs. Function overloading is the main example — the compiler picks the right function based on the argument types. Templates are another form. The decision is fixed at compile time.",
        "<strong>Run-time polymorphism</strong> (dynamic polymorphism) is resolved <em>while the program is running</em>. It depends on the actual type of the object at the time of the call. In C++, this is achieved through <strong>virtual functions</strong> called through a base-class pointer or reference. The compiler doesn't know which function to call until the program actually runs.",
        "You enable run-time polymorphism by: (1) marking a base class function <code>virtual</code>, (2) overriding it in derived classes using the <code>override</code> keyword, and (3) calling it through a base pointer or reference. The <code>override</code> keyword is not strictly required, but it tells the compiler to verify that you're correctly overriding an existing virtual function — preventing silent bugs from signature mismatches."
      ],
      keyPoints:[
        "Compile-time polymorphism: function overloading, resolved at compile time.",
        "Run-time polymorphism: virtual functions + base pointer/reference, resolved at runtime.",
        "Mark base function <code>virtual</code>; use <code>override</code> in derived class.",
        "<code>override</code> catches signature mismatches at compile time — always use it."
      ],
      code:`#include <iostream>
using namespace std;

// ── Compile-time polymorphism: function overloading ──────────
int    add(int a, int b)       { return a + b; }
double add(double a, double b) { return a + b; }
// Compiler picks the correct version based on argument types

// ── Run-time polymorphism: virtual functions ──────────────────
class Shape {
public:
    // 'virtual' enables run-time dispatch through base pointer
    virtual double area() const {
        return 0.0;   // default implementation
    }

    // Always provide virtual destructor in polymorphic base classes
    virtual ~Shape() {}
};

class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) {
        radius = r;
    }

    // 'override' verifies we correctly match a virtual signature
    double area() const override {
        return 3.14159 * radius * radius;
    }
};

class Rectangle : public Shape {
private:
    double length;
    double width;

public:
    Rectangle(double l, double w) {
        length = l;
        width  = w;
    }

    double area() const override {
        return length * width;
    }
};

void printArea(const Shape& s) {
    // Which area() runs? Determined by the actual object type at runtime
    cout << "Area: " << s.area() << endl;
}

int main() {
    Circle    c(5);
    Rectangle r(4, 6);

    printArea(c);   // calls Circle::area()
    printArea(r);   // calls Rectangle::area()

    return 0;
}`}],
    [{title:"Const-correct display function",prompt:"Write a `Product` class with `name` and `price`. Mark `display()` as const and a `setPrice()` as non-const. Test that a `const Product` can only call `display()`.",starter:`#include <iostream>
#include <string>
using namespace std;

// create Product class
`,solution:`#include <iostream>
#include <string>
using namespace std;

class Product {
private:
    string name; double price;
public:
    Product(string n, double p) : name(n), price(p) {}
    void display() const { cout << name << ": " << price << endl; }
    void setPrice(double p) { price = p; }
};

int main() {
    const Product item("Book", 499);
    item.display(); // OK
    // item.setPrice(600); // error!
}`},
    {title:"Override virtual area in derived class",prompt:"Create an abstract `Shape` base with virtual `area()`. Derive `Rectangle` and override `area()`. Call it through a base pointer.",starter:`#include <iostream>
using namespace std;

// build Shape and Rectangle
`,solution:`#include <iostream>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() = default;
};

class Rectangle : public Shape {
private:
    double l, w;
public:
    Rectangle(double l, double w) : l(l), w(w) {}
    double area() const override { return l * w; }
};

int main() {
    Shape *s = new Rectangle(5, 3);
    cout << s->area() << endl;
    delete s;
}`},
    {title:"Demonstrate compile-time vs run-time polymorphism",prompt:"Write an overloaded function `describe(int)` and `describe(double)` (compile-time polymorphism). Then write a base class `Animal` with virtual `sound()` and derive `Cat` and `Dog` from it. Call `sound()` through a base pointer (run-time polymorphism). Show both in `main`.",starter:`#include <iostream>
using namespace std;

// overloaded describe functions (compile-time)
// Animal hierarchy with virtual sound() (run-time)

int main() {
    // demonstrate both types of polymorphism
    return 0;
}`,solution:`#include <iostream>
using namespace std;

// ── Compile-time polymorphism: overloading ────────────────────
void describe(int x)    { cout << "Integer: " << x << endl; }
void describe(double x) { cout << "Double:  " << x << endl; }

// ── Run-time polymorphism: virtual functions ──────────────────
class Animal {
public:
    virtual void sound() const { cout << "..." << endl; }
    virtual ~Animal() = default;
};

class Dog : public Animal {
public:
    void sound() const override { cout << "Woof!" << endl; }
};

class Cat : public Animal {
public:
    void sound() const override { cout << "Meow!" << endl; }
};

int main() {
    // Compile-time — resolved by compiler based on argument type
    describe(42);
    describe(3.14);

    // Run-time — resolved at runtime based on actual object type
    Animal *a1 = new Dog();
    Animal *a2 = new Cat();
    a1->sound();   // Woof!
    a2->sound();   // Meow!
    delete a1;
    delete a2;
    return 0;
}`}],
    [{question:"What does a const member function guarantee?",options:["Returns only const data","Will not modify the object's normal state","Can only be called by templates","Can never throw exceptions"],answer:1,explanation:"Const member functions promise not to modify the object's observable state."},
     {question:"Run-time polymorphism requires:",options:["Function overloading","`static` keyword","Virtual functions and base pointers or references","Template specialization"],answer:2,explanation:"Dynamic dispatch depends on virtual functions called through base pointers or references."},
     {question:"Why is `override` useful in derived classes?",options:["Makes the function static","Forces base constructor to run twice","Compiler verifies you are correctly overriding a virtual function","Removes the need for inheritance"],answer:2,explanation:"If the signature doesn't match a base virtual function, the compiler reports an error."},
     {question:"Which type of polymorphism is function overloading?",options:["Run-time polymorphism","Dynamic polymorphism","Compile-time polymorphism","Virtual polymorphism"],answer:2,explanation:"Function overloading is resolved at compile time by the compiler based on argument types — it is compile-time (static) polymorphism."},
     {question:"What happens if you call a non-const member function on a const object?",options:["It runs normally","A runtime error occurs","Compilation fails","The function is skipped"],answer:2,explanation:"A non-const function may modify the object, which is forbidden on a const object. The compiler rejects this at compile time."},
     {question:"Which keyword at the end of a function signature means it won't modify the object?",options:["`static`","`virtual`","`const`","`override`"],answer:2,explanation:"The `const` keyword after the closing parenthesis of a member function declaration promises the function will not modify the object's state."},
     {question:"Can a const member function call a non-const member function of the same object?",options:["Yes, always","No — it would violate the const promise","Only if the non-const function is static","Only through a pointer"],answer:1,explanation:"A const member function cannot call non-const member functions on `*this`, because non-const functions might modify the object — violating the const guarantee."}]),

  11: studyWeek(11,"Base-Class Pointers, References, and Polymorphic Hierarchies",
    ["Call derived behavior through base-class pointers and references","Design class hierarchies from UML with a polymorphic base","Use virtual destructors for safe cleanup through base pointers"],
    [{title:"Base pointers and references — the engine of polymorphism",
      explanation:[
        "A pointer or reference to a base class can point to <em>any</em> derived class object. This is called the <strong>Liskov Substitution Principle</strong> in practice — wherever you expect a <code>Shape*</code>, you can provide a <code>Circle*</code> or <code>Rectangle*</code>. The compiler allows this because a derived object <em>is</em> a base object.",
        "The power of this becomes real with virtual functions. When you call <code>ptr->area()</code> through a <code>Shape*</code>, C++ looks up the actual type of the object at <em>runtime</em> using the <strong>vtable</strong> (virtual function table) — a hidden lookup table the compiler builds for each class with virtual functions. This lookup selects the correct overriding function automatically.",
        "Without virtual functions, C++ uses <strong>static dispatch</strong> — it always calls the function based on the <em>pointer's declared type</em>, not the actual object type. So <code>ptr->area()</code> on a <code>Shape*</code> would call <code>Shape::area()</code> even if the object is actually a <code>Circle</code>. Adding <code>virtual</code> switches to dynamic dispatch."
      ],
      keyPoints:[
        "Base pointer/reference can hold any derived object — core of runtime polymorphism.",
        "Virtual functions trigger dynamic dispatch (vtable lookup) at runtime.",
        "Non-virtual functions use static dispatch — calls depend on pointer type, not object type.",
        "Always declare the base destructor <code>virtual</code> if you delete through base pointers."
      ],
      code:`#include <iostream>
using namespace std;

class Animal {
public:
    // 'virtual' enables runtime dispatch — right version is called
    virtual void speak() const {
        cout << "Some animal sound" << endl;
    }

    // Virtual destructor ensures derived destructor also runs on delete
    virtual ~Animal() {
        cout << "Animal destroyed" << endl;
    }
};

class Dog : public Animal {
public:
    void speak() const override {
        cout << "Woof!" << endl;
    }

    ~Dog() {
        cout << "Dog destroyed" << endl;
    }
};

class Cat : public Animal {
public:
    void speak() const override {
        cout << "Meow!" << endl;
    }
};

void makeSound(const Animal& a) {
    a.speak();   // runtime dispatch: calls Dog::speak or Cat::speak
}

int main() {
    Dog d;
    Cat c;

    makeSound(d);   // Woof!
    makeSound(c);   // Meow!

    // Polymorphic array accessed through base pointer
    Animal* zoo[2] = { &d, &c };
    for (Animal* a : zoo) {
        a->speak();   // correct version chosen at runtime each time
    }

    // Dynamic allocation through base pointer
    Animal* ptr = new Dog();
    ptr->speak();    // Woof! — runtime dispatch
    delete ptr;      // Dog destructor runs (because ~Animal is virtual)

    return 0;
}`},
    {title:"Designing polymorphic hierarchies from UML",
      explanation:[
        "When translating a UML hierarchy to C++, the process is systematic. Identify the root class (the one all others specialize) — this becomes your <strong>abstract base class</strong> with pure virtual functions for operations that every derived class must implement. Concrete classes derive from it and provide implementations.",
        "A <strong>virtual destructor</strong> in the base class is non-negotiable in any polymorphic hierarchy. Without it, deleting a derived object through a base pointer only runs the base destructor — the derived destructor is skipped. This leaks any resources the derived class managed. Always add <code>virtual ~Base() = default;</code> to your base class.",
        "The <code>= default</code> syntax tells the compiler to generate the default destructor implementation. For pure virtual classes that only define an interface, you'll often write <code>virtual ~Base() = default;</code> — this is the correct pattern that allows the base to be abstract while still having a properly callable destructor for cleanup."
      ],
      keyPoints:[
        "Abstract base: defines interface with pure virtual functions, cannot be instantiated.",
        "Always add <code>virtual ~Base() = default;</code> to any class with virtual functions.",
        "Concrete derived class: overrides ALL pure virtual functions from base.",
        "One base pointer type can manage many different derived objects — open/closed principle."
      ],
      code:`#include <iostream>
#include <string>
using namespace std;

// UML-to-code: Payment hierarchy
// ┌─────────────┐
// │   Payment   │  (abstract base)
// │  +process() │  (pure virtual)
// └──────┬──────┘
//    ┌───┴────┐
//  Cash     Card

class Payment {
public:
    // Pure virtual — every concrete class MUST override this
    virtual void process() const = 0;

    virtual void printReceipt() const {
        cout << "Processing payment..." << endl;
    }

    // Must be virtual — we will delete through a base pointer
    virtual ~Payment() = default;
};

class CashPayment : public Payment {
private:
    double amount;

public:
    CashPayment(double a) {
        amount = a;
    }

    void process() const override {
        cout << "Cash payment of Rs." << amount << " received." << endl;
    }
};

class CardPayment : public Payment {
private:
    string cardNumber;
    double amount;

public:
    CardPayment(string card, double a) {
        cardNumber = card;
        amount     = a;
    }

    void process() const override {
        cout << "Card " << cardNumber
             << ": Rs." << amount << " charged." << endl;
    }
};

void checkout(Payment& p) {
    p.process();        // runtime dispatch — correct class runs
    p.printReceipt();   // uses base class default
}

int main() {
    CashPayment cash(500);
    CardPayment card("4321-xxxx", 1200);

    checkout(cash);
    checkout(card);

    return 0;
}`}],
    [{title:"Store multiple derived objects together",prompt:"Create `Animal`, `Dog`, and `Cat`. Store them in an `Animal*` array and call `speak()` on each through the base pointer.",starter:`#include <iostream>
using namespace std;

// write classes here
`,solution:`#include <iostream>
using namespace std;

class Animal {
public:
    virtual void speak() const { cout << "Animal" << endl; }
    virtual ~Animal() = default;
};
class Dog : public Animal {
public: void speak() const override { cout << "Woof" << endl; }
};
class Cat : public Animal {
public: void speak() const override { cout << "Meow" << endl; }
};

int main() {
    Dog d; Cat c;
    Animal *pets[2] = {&d, &c};
    for (Animal *pet : pets) pet->speak();
}`},
    {title:"Process payments polymorphically",prompt:"Build base class `Payment` and derived `CashPayment` and `CardPayment`. Call `process()` through a base reference.",starter:`class Payment {
    // complete hierarchy
};`,solution:`#include <iostream>
using namespace std;

class Payment {
public:
    virtual void process() const = 0;
    virtual ~Payment() = default;
};
class CashPayment : public Payment {
public: void process() const override { cout << "Cash processed" << endl; }
};
class CardPayment : public Payment {
public: void process() const override { cout << "Card processed" << endl; }
};

void finalize(const Payment &p) { p.process(); }`},
    {title:"Demonstrate virtual destructor necessity",prompt:"Create base class `Resource` with a non-virtual destructor that prints 'Resource destroyed'. Derive `FileResource` with a destructor that prints 'FileResource destroyed'. Allocate a `FileResource` with `new`, store it as `Resource*`, then `delete` it. Observe which destructor fires. Then fix the base destructor to be `virtual` and show both fire.",starter:`#include <iostream>
using namespace std;

// implement Resource and FileResource
// test with and without virtual destructor

int main() {
    return 0;
}`,solution:`#include <iostream>
using namespace std;

class Resource {
public:
    // Change to non-virtual to see the problem:
    // ~Resource() { cout << "Resource destroyed" << endl; }

    // Correct: virtual destructor ensures derived destructor runs
    virtual ~Resource() { cout << "Resource destroyed" << endl; }
};

class FileResource : public Resource {
public:
    ~FileResource() { cout << "FileResource destroyed" << endl; }
};

int main() {
    Resource *r = new FileResource();
    delete r;
    // With virtual ~Resource(): both destructors fire (correct)
    // Without virtual:          only Resource::~Resource fires (leak!)
    return 0;
}`}],
    [{question:"Base pointer calls non-virtual function overridden in derived — which version runs?",options:["Derived version","Base version","Both versions","Compilation fails"],answer:1,explanation:"Without `virtual`, the call resolves to the pointer type, so the base version runs."},
     {question:"A base reference can bind to:",options:["Only another base object","Any derived object of that base","Only static objects","Only const objects"],answer:1,explanation:"References and pointers to a base type can refer to derived objects."},
     {question:"Why should a polymorphic base class have a virtual destructor?",options:["Allow operator overloading","Avoid slicing only","Make deletion through a base pointer safe","Force objects onto heap"],answer:2,explanation:"A virtual destructor ensures the derived destructor runs when deleting through a base pointer."},
     {question:"What is the vtable?",options:["A table of variable names in a class","A hidden per-class table of virtual function pointers used for runtime dispatch","A list of all base classes","A table built only for abstract classes"],answer:1,explanation:"The vtable (virtual function table) is a hidden structure the compiler creates for each class with virtual functions. At runtime, the correct function is looked up through this table."},
     {question:"What is object slicing?",options:["Splitting a class into multiple files","Copying a derived object into a base object, losing the derived members","Accessing private members via a pointer","Deleting part of an object's memory"],answer:1,explanation:"Object slicing occurs when a derived object is assigned to a base object by value — the derived-specific members are 'sliced off' and lost."},
     {question:"If `speak()` is declared virtual in Animal and overridden in Dog, which version runs when you call `ptr->speak()` through an `Animal*` pointing to a `Dog`?",options:["Animal::speak()","Dog::speak()","Compilation error","Both run simultaneously"],answer:1,explanation:"The `virtual` keyword causes runtime dispatch. The actual object type (Dog) determines which function runs, not the pointer type (Animal*)."},
     {question:"Which statement about virtual functions is correct?",options:["Virtual functions cannot have a body","Every virtual function must be pure virtual","A virtual function in the base can still have an implementation","Virtual functions can only be in abstract classes"],answer:2,explanation:"Virtual functions can have a default implementation in the base class. Only pure virtual functions (= 0) must be overridden and have no default implementation."}]),

  12: studyWeek(12,"Abstract Classes and Function Templates",
    ["Use pure virtual functions to create abstract interfaces","Prevent direct instantiation of incomplete base classes","Write function templates that work across multiple data types"],
    [{title:"Abstract classes — defining contracts, not implementations",
      explanation:[
        "A <strong>pure virtual function</strong> is declared with <code>= 0</code> at the end: <code>virtual void draw() const = 0;</code>. A class containing at least one pure virtual function becomes an <strong>abstract class</strong> — the compiler prevents you from creating objects of it directly. It exists solely as an interface contract.",
        "Why would you want a class you can't instantiate? Because it forces every derived class to provide a concrete implementation. If a derived class fails to override all pure virtual functions, it also becomes abstract and cannot be instantiated. This is the C++ way of enforcing that every concrete class in the hierarchy must fulfill the full contract.",
        "Abstract classes are powerful architectural tools. They let you write code that works against the <em>interface</em> (base class), not the <em>implementation</em> (derived class). A function that accepts a <code>Shape&</code> works correctly with any class that inherits from <code>Shape</code> and implements <code>area()</code> — today's shapes and any shapes you add in the future."
      ],
      keyPoints:[
        "Pure virtual: <code>virtual ReturnType func() const = 0;</code> — must be overridden.",
        "A class with any pure virtual function is abstract — cannot be instantiated.",
        "Derived class must override ALL pure virtual functions, or it also becomes abstract.",
        "Abstract classes define interfaces — code against them for maximum flexibility."
      ],
      code:`#include <iostream>
#include <string>
using namespace std;

// Abstract base class — defines the interface contract
class Shape {
public:
    // Pure virtual — every concrete Shape MUST compute its area
    virtual double area() const = 0;

    // Pure virtual — every concrete Shape MUST be able to draw
    virtual void draw() const = 0;

    // Non-pure virtual — has a default, can be overridden
    virtual string describe() const {
        return "Shape with area " + to_string(area());
    }

    virtual ~Shape() = default;
};

// Shape s;  // ERROR: cannot instantiate an abstract class

class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) {
        radius = r;
    }

    // Must override ALL pure virtual functions
    double area() const override {
        return 3.14159 * radius * radius;
    }

    void draw() const override {
        cout << "Drawing circle with radius " << radius << endl;
    }
};

class Rectangle : public Shape {
private:
    double w;
    double h;

public:
    Rectangle(double width, double height) {
        w = width;
        h = height;
    }

    double area() const override {
        return w * h;
    }

    void draw() const override {
        cout << "Drawing " << w << " x " << h << " rectangle" << endl;
    }
};

void renderAll(Shape* shapes[], int n) {
    for (int i = 0; i < n; i++) {
        shapes[i]->draw();
        cout << "Area: " << shapes[i]->area() << endl;
    }
}`},
    {title:"Function templates — write once, use with any type",
      explanation:[
        "A <strong>function template</strong> is a blueprint for a function. Instead of writing separate <code>max</code> functions for <code>int</code>, <code>double</code>, and <code>char</code>, you write one template and the compiler generates the specific versions it needs. The type is replaced by a <strong>type parameter</strong> — conventionally named <code>T</code> or <code>typename T</code>.",
        "The syntax is <code>template &lt;typename T&gt;</code> placed before the function definition. When you call <code>maxValue(3, 5)</code>, the compiler deduces <code>T = int</code> and generates the <code>int</code> version. When you call <code>maxValue(2.5, 7.1)</code>, it deduces <code>T = double</code>. You can also specify the type explicitly: <code>maxValue&lt;int&gt;(3, 5)</code>.",
        "Templates achieve <strong>generic programming</strong> — writing algorithms that are independent of data type. They are resolved entirely at compile time (no runtime overhead from indirection), making them more efficient than runtime polymorphism for cases where all types are known at compile time."
      ],
      keyPoints:[
        "Syntax: <code>template &lt;typename T&gt;</code> before the function definition.",
        "Compiler deduces <code>T</code> from the argument types automatically.",
        "Templates are resolved at compile time — zero runtime overhead.",
        "All types used must support the operators the template uses (e.g., <code>&gt;</code> for comparisons)."
      ],
      code:`// ── Basic function template ───────────────────────────────────
template <typename T>
T maxValue(T a, T b) {
    return (a > b) ? a : b;
    // Works for any type T that supports operator>
}

// ── Template with two type parameters ────────────────────────
template <typename T, typename U>
void printPair(T first, U second) {
    cout << first << " : " << second << endl;
}

// ── Template used as a swap utility ──────────────────────────
template <typename T>
void swapValues(T &a, T &b) {
    T temp = a;
    a = b;
    b = temp;
}

int main() {
    // Compiler generates int version automatically
    cout << maxValue(9, 4) << endl;        // 9

    // Compiler generates double version
    cout << maxValue(2.5, 7.1) << endl;    // 7.1

    // Works with char too
    cout << maxValue('a', 'z') << endl;    // z

    // Two-parameter template
    printPair("Score", 95);                // Score : 95

    // Swap template
    int x = 10, y = 20;
    swapValues(x, y);
    cout << x << " " << y << endl;         // 20 10
    return 0;
}`}],
    [{title:"Design an abstract appliance hierarchy",prompt:"Make abstract class `Appliance` with pure virtual `powerUsage()`. Derive `Fan` and `Heater`, override the function, call it through a base pointer.",starter:`#include <iostream>
using namespace std;

// build Appliance hierarchy
`,solution:`#include <iostream>
using namespace std;

class Appliance {
public:
    virtual int powerUsage() const = 0;
    virtual ~Appliance() = default;
};
class Fan : public Appliance {
public: int powerUsage() const override { return 75; }
};
class Heater : public Appliance {
public: int powerUsage() const override { return 1200; }
};`},
    {title:"Write a reusable max template",prompt:"Create function template `maxValue(T a, T b)` returning the larger value. Test with `int`, `double`, and `char`.",starter:`#include <iostream>
using namespace std;

// write template
`,solution:`#include <iostream>
using namespace std;

template <typename T>
T maxValue(T a, T b) { return (a > b) ? a : b; }

int main() {
    cout << maxValue(9, 4) << endl;
    cout << maxValue(2.5, 7.1) << endl;
    cout << maxValue('a', 'z') << endl;
}`},
    {title:"Abstract Printable interface",prompt:"Define an abstract class `Printable` with a pure virtual `print() const`. Make `Invoice` and `Report` concrete classes that inherit from it. Each overrides `print()` with a meaningful message. Write a function `printAll(Printable *items[], int n)` that calls `print()` on each element polymorphically.",starter:`#include <iostream>
using namespace std;

// define Printable interface, Invoice, Report classes
// write printAll function

int main() {
    // demonstrate polymorphic printing
    return 0;
}`,solution:`#include <iostream>
using namespace std;

class Printable {
public:
    virtual void print() const = 0;
    virtual ~Printable() = default;
};

class Invoice : public Printable {
private:
    int id;
    double amount;
public:
    Invoice(int i, double a) : id(i), amount(a) {}
    void print() const override {
        cout << "Invoice #" << id << " — Rs." << amount << endl;
    }
};

class Report : public Printable {
private:
    string title;
public:
    Report(string t) : title(t) {}
    void print() const override {
        cout << "Report: " << title << endl;
    }
};

void printAll(Printable *items[], int n) {
    for (int i = 0; i < n; i++) {
        items[i]->print();
    }
}

int main() {
    Invoice inv(101, 4500.0);
    Report  rep("Q3 Sales Summary");
    Printable *docs[2] = {&inv, &rep};
    printAll(docs, 2);
    return 0;
}`}],
    [{question:"What does `= 0` at end of a virtual function declaration mean?",options:["Function always returns zero","Function is static","Function is pure virtual","Function is deleted"],answer:2,explanation:"Adding `= 0` makes the virtual function pure and the class abstract."},
     {question:"Can an abstract class be instantiated directly?",options:["Yes, always","Only on the heap","No","Only if it has a destructor"],answer:2,explanation:"An abstract class cannot be instantiated because it has incomplete required behavior."},
     {question:"Main advantage of a function template?",options:["Avoids inheritance","Lets one algorithm work with multiple types","Replaces all virtual functions","Forces dynamic allocation"],answer:1,explanation:"Templates generalize code while staying type-safe and efficient."},
     {question:"What happens if a derived class does NOT override all pure virtual functions?",options:["It compiles but crashes at runtime","The base implementations are used","The derived class also becomes abstract","Only the unimplemented functions are skipped"],answer:2,explanation:"If a derived class leaves any pure virtual function unimplemented, it is itself abstract and cannot be instantiated."},
     {question:"Templates are resolved at:",options:["Runtime only","Link time","Compile time","Load time"],answer:2,explanation:"Templates are a compile-time mechanism. The compiler generates specific concrete versions of the template code when it sees how the template is used."},
     {question:"What is the syntax for a function template type parameter?",options:["`class<T>`","`template T`","`template <typename T>`","`T template`"],answer:2,explanation:"The correct syntax is `template <typename T>` placed before the function definition. The keyword `class` can also be used in place of `typename`."},
     {question:"Can a function template deduce its type parameter automatically?",options:["No — you must always specify the type explicitly","Yes — the compiler infers T from the argument types","Only for primitive types","Only when there is a single parameter"],answer:1,explanation:"The compiler can usually deduce the template type parameter from the argument types. For example, `maxValue(3, 5)` automatically deduces `T = int`."}]),

  13: studyWeek(13,"Class Templates and Friend Access",
    ["Build reusable class templates for generic data structures","Use friend functions and friend classes carefully","Understand how friendship grants controlled access to private members"],
    [{title:"Class templates — one blueprint, many types",
      explanation:[
        "A <strong>class template</strong> is a blueprint for an entire class where one or more types are left as parameters. You define the structure once, and the compiler generates a concrete class for each specific type you use. <code>Stack&lt;int&gt;</code>, <code>Stack&lt;double&gt;</code>, and <code>Stack&lt;string&gt;</code> are all generated from the same template definition.",
        "The syntax is <code>template &lt;typename T&gt;</code> placed before the class definition. Inside the class, use <code>T</code> wherever the generic type should appear. When you declare an object, you supply the actual type in angle brackets: <code>PairBox&lt;int&gt; p(3, 5);</code>. Unlike function templates, the compiler cannot always deduce the type for class templates — you usually need to specify it explicitly.",
        "Class templates are the foundation of the entire C++ Standard Template Library (STL). <code>vector&lt;T&gt;</code>, <code>stack&lt;T&gt;</code>, <code>queue&lt;T&gt;</code>, and <code>map&lt;K,V&gt;</code> are all class templates. Understanding how to write them is essential for understanding how the STL works."
      ],
      keyPoints:[
        "Syntax: <code>template &lt;typename T&gt; class MyClass { ... };</code>",
        "Instantiate with: <code>MyClass&lt;int&gt; obj;</code> — type must be specified explicitly.",
        "Multiple type parameters: <code>template &lt;typename K, typename V&gt;</code>",
        "Member functions defined outside the class body must repeat the template header."
      ],
      code:`#include <iostream>
#include <string>
#include <stdexcept>
using namespace std;

template <typename T>
class Stack {
private:
    T   data[100];
    int top;

public:
    Stack() {
        top = -1;
    }

    void push(T value) {
        if (top < 99) {
            data[++top] = value;
        }
    }

    T pop() {
        if (top >= 0) {
            return data[top--];
        }
        throw runtime_error("Stack is empty");
    }

    bool isEmpty() const {
        return top == -1;
    }

    int size() const {
        return top + 1;
    }
};

int main() {
    // int version — generated by compiler from template
    Stack<int> intStack;
    intStack.push(10);
    intStack.push(20);
    cout << intStack.pop() << endl;   // 20

    // string version — same template code, different type
    Stack<string> strStack;
    strStack.push("Hello");
    strStack.push("World");
    cout << strStack.pop() << endl;   // World

    return 0;
}`},
    {title:"Friend functions and friend classes",
      explanation:[
        "<strong>Friendship</strong> in C++ is a mechanism that grants a specific external function or class direct access to <code>private</code> and <code>protected</code> members of a class. You declare it inside the class using the <code>friend</code> keyword. Friendship is explicit, selective, and does not violate encapsulation as long as it is used thoughtfully.",
        "The most common use case for friend functions is <strong>symmetric binary operators</strong> — especially the stream operators <code>&lt;&lt;</code> and <code>&gt;&gt;</code>. These operators need the stream (<code>ostream</code>) as the left operand, so they cannot be member functions. By declaring them as friends, they gain access to private data without the class exposing public getters just for this purpose.",
        "Important: <strong>friendship is not inherited</strong>. If <code>class B</code> is a friend of <code>class A</code>, a class derived from <code>B</code> does not automatically become a friend of <code>A</code>. Friendship is also not transitive — if B is a friend of A, and C is a friend of B, C is not automatically a friend of A."
      ],
      keyPoints:[
        "Declare inside class: <code>friend ReturnType functionName(params);</code>",
        "Friend function: not a member, but has access to private/protected members.",
        "Friendship is NOT inherited and NOT transitive.",
        "Best use cases: stream operators (<code>&lt;&lt;</code>, <code>&gt;&gt;</code>) and symmetric comparison operators."
      ],
      code:`#include <iostream>
#include <cmath>
using namespace std;

class Point {
private:
    double x;
    double y;

public:
    Point(double x = 0, double y = 0) {
        this->x = x;
        this->y = y;
    }

    // Friend: stream insertion — cannot be member (stream is left operand)
    friend ostream& operator<<(ostream& out, const Point& p) {
        out << "(" << p.x << ", " << p.y << ")";
        return out;   // return stream to allow chaining
    }

    // Friend: distance helper accesses private x and y of both points
    friend double distance(const Point& a, const Point& b) {
        double dx = a.x - b.x;
        double dy = a.y - b.y;
        return sqrt(dx * dx + dy * dy);
    }
};

// ── Friend class example ──────────────────────────────────────
class Engine {
private:
    int horsepower;
    friend class Car;   // Car is granted access to Engine's private members

public:
    Engine(int hp) {
        horsepower = hp;
    }
};

class Car {
private:
    Engine engine;

public:
    Car(int hp) : engine(hp) {
    }

    void showPower() const {
        // Allowed because Car is declared as a friend of Engine
        cout << "HP: " << engine.horsepower << endl;
    }
};

int main() {
    Point p1(1, 2);
    Point p2(4, 6);

    cout << p1 << " to " << p2 << endl;
    cout << "Distance: " << distance(p1, p2) << endl;

    return 0;
}`}],
    [{title:"Create a generic pair container",prompt:"Write class template `Pair<T>` storing two values of the same type. Add `swapValues()` and `show()`. Test with `int` and `string`.",starter:`#include <iostream>
#include <string>
using namespace std;

// create Pair template
`,solution:`#include <iostream>
#include <string>
using namespace std;

template <typename T>
class Pair {
private:
    T first, second;
public:
    Pair(T a, T b) : first(a), second(b) {}
    void swapValues() { T temp = first; first = second; second = temp; }
    void show() const { cout << first << ", " << second << endl; }
};`},
    {title:"Use a friend function for comparison",prompt:"Create `Box` class with private `volume`. Write a friend function that compares two boxes and returns the larger one.",starter:`class Box {
    // write class and friend function
};`,solution:`#include <iostream>
using namespace std;

class Box {
private:
    int volume;
public:
    Box(int v = 0) : volume(v) {}
    friend Box largerBox(const Box &a, const Box &b);
    void show() const { cout << volume << endl; }
};

Box largerBox(const Box &a, const Box &b) {
    return (a.volume > b.volume) ? a : b;
}`},
    {title:"Generic MinMax class template",prompt:"Write a class template `MinMax<T>` that stores a dynamic array of T values (use a vector). Add `add(T val)`, `getMin()`, and `getMax()` methods. Test with integers and doubles.",starter:`#include <iostream>
#include <vector>
using namespace std;

// implement MinMax template class

int main() {
    // test with int and double
    return 0;
}`,solution:`#include <iostream>
#include <vector>
using namespace std;

template <typename T>
class MinMax {
private:
    vector<T> values;

public:
    void add(T val) {
        values.push_back(val);
    }

    T getMin() const {
        T minVal = values[0];
        for (const T &v : values) {
            if (v < minVal) minVal = v;
        }
        return minVal;
    }

    T getMax() const {
        T maxVal = values[0];
        for (const T &v : values) {
            if (v > maxVal) maxVal = v;
        }
        return maxVal;
    }
};

int main() {
    MinMax<int> mi;
    mi.add(5); mi.add(2); mi.add(9); mi.add(1);
    cout << "Min: " << mi.getMin() << ", Max: " << mi.getMax() << endl;

    MinMax<double> md;
    md.add(3.14); md.add(2.71); md.add(1.41);
    cout << "Min: " << md.getMin() << ", Max: " << md.getMax() << endl;
    return 0;
}`}],
    [{question:"A class template becomes usable only when it is:",options:["Declared as friend","Instantiated with a concrete type","Inherited publicly","Given a virtual destructor"],answer:1,explanation:"Templates are patterns until you instantiate them with actual types like `int` or `string`."},
     {question:"A friend function is:",options:["Always a member function","A global or external function granted private access","Inherited automatically by derived classes","A template keyword"],answer:1,explanation:"Friend functions are not members, but can access private data if declared as friends."},
     {question:"Which statement about friendship is correct?",options:["Friendship is inherited automatically","Friendship always breaks compilation","Friendship grants controlled access to private members","Friend functions cannot return objects"],answer:2,explanation:"Friendship is an explicit access-granting mechanism used selectively where it makes design sense."},
     {question:"How do you instantiate a class template `Stack` for type `double`?",options:["`Stack s;`","`Stack<double> s;`","`double Stack s;`","`template Stack<double>;`"],answer:1,explanation:"Class templates require explicit type specification in angle brackets: `Stack<double> s;`"},
     {question:"Is friendship between classes transitive?",options:["Yes — friends of friends are also friends","No — friendship is not transitive","Only if declared with `virtual`","Only within the same namespace"],answer:1,explanation:"Friendship is not transitive. If B is a friend of A, and C is a friend of B, C does NOT automatically become a friend of A."},
     {question:"Why are `<<` and `>>` operators typically declared as friend functions?",options:["Because they are binary operators","Because the stream object is the left operand, so they cannot be member functions","Because C++ requires all operators to be friends","Because they need access to static members"],answer:1,explanation:"Stream operators take an `ostream` or `istream` as the left operand. Since the left operand isn't the class itself, they cannot be member functions — they must be non-member friends."},
     {question:"What happens if two class templates with the same name but different type arguments are created?",options:["Compilation error — names must be unique","They are independent — each is a separate concrete class","They share the same vtable","One overwrites the other"],answer:1,explanation:"Each instantiation like `Pair<int>` and `Pair<string>` generates a completely separate concrete class. They are independent types."}]),

  14: studyWeek(14,"Exception Handling Basics",
    ["Use `try`, `throw`, and `catch` to manage exceptional situations","Work with standard exceptions such as `invalid_argument`","Throw and handle exceptions inside functions cleanly"],
    [{title:"How exceptions change the flow of execution",
      explanation:[
        "Before exceptions, error handling was done with return codes — functions would return <code>-1</code> or <code>false</code> to signal failure, and the caller had to check every return value. This approach is error-prone: developers forget to check, and error-handling code gets tangled with normal logic throughout the program.",
        "<strong>Exception handling</strong> separates the normal execution path from the error-handling path. When an error occurs, you <code>throw</code> an exception object. Execution immediately stops and C++ starts <strong>stack unwinding</strong> — it unwinds the call stack, calling destructors for all local objects, until it finds a matching <code>catch</code> block. If none is found, <code>terminate()</code> is called.",
        "The three keywords: <code>try</code> wraps code that might throw. <code>throw</code> raises an exception (can throw any type — typically a class derived from <code>std::exception</code>). <code>catch</code> handles the exception; it matches by type, so <code>catch(const invalid_argument &e)</code> only catches <code>invalid_argument</code> exceptions. Use <code>catch(...)</code> to catch any exception type as a fallback."
      ],
      keyPoints:[
        "<code>try { }</code>: wraps potentially failing code.",
        "<code>throw value;</code>: raises an exception, immediately stops normal execution.",
        "<code>catch(const ExType &e) { }</code>: handles exception of type ExType.",
        "Stack unwinding: destructors of local objects run automatically as the stack is unwound."
      ],
      code:`#include <iostream>
#include <stdexcept>
using namespace std;

// Function that can throw
double divide(double a, double b) {
    if (b == 0.0) {
        throw invalid_argument("Cannot divide by zero");
        // Execution stops here — control jumps to catch
    }
    return a / b;
}

int convertAge(const string &s) {
    // stoi throws std::invalid_argument if s is not a number
    // stoi throws std::out_of_range if the number is too large
    return stoi(s);
}

int main() {
    // ── Catching a specific exception ────────────────────────
    try {
        double result = divide(10, 0);
        cout << result << endl;    // never reached
    } catch (const invalid_argument &e) {
        cout << "Error: " << e.what() << endl;
        // e.what() returns the message string from the throw
    }

    // ── Catching multiple exception types ────────────────────
    try {
        int age = convertAge("abc");
        cout << age << endl;
    } catch (const invalid_argument &e) {
        cout << "Not a number: " << e.what() << endl;
    } catch (const out_of_range &e) {
        cout << "Number too large: " << e.what() << endl;
    } catch (...) {
        cout << "Unknown error occurred" << endl;
    }

    cout << "Program continues normally after catch" << endl;
    return 0;
}`},
    {title:"Standard exceptions, exception hierarchy, and rethrowing",
      explanation:[
        "The C++ standard library provides a hierarchy of exception classes under <code>&lt;stdexcept&gt;</code> and <code>&lt;exception&gt;</code>. All derive from <code>std::exception</code>, which provides the <code>what()</code> method returning a C-string message. Common standard exceptions: <code>invalid_argument</code> (bad input), <code>out_of_range</code> (value out of valid range), <code>runtime_error</code> (general runtime error), <code>bad_alloc</code> (memory allocation failure).",
        "Catching by <code>const exception &</code> catches any standard exception (because all standard exceptions derive from <code>exception</code>). This is useful as a catch-all for standard exceptions. Catching by reference (<code>&</code>) is important — catching by value would slice polymorphic exception objects.",
        "<strong>Rethrowing</strong>: inside a catch block, you can rethrow the current exception using bare <code>throw;</code> (with no argument). This lets you log or do partial cleanup and then pass the exception up to a higher-level handler. Do not write <code>throw e;</code> to rethrow — that creates a copy and may lose type information."
      ],
      keyPoints:[
        "All standard exceptions derive from <code>std::exception</code> — catch with <code>const exception &</code>.",
        "Always catch by <code>const reference</code> (<code>&</code>) — never by value.",
        "Rethrow with bare <code>throw;</code> — preserves original exception type and information.",
        "Order of <code>catch</code> blocks matters: put specific types before general ones."
      ],
      code:`#include <iostream>
#include <stdexcept>
#include <new>        // for bad_alloc
using namespace std;

void riskyOperation(int x) {
    if (x < 0)  throw invalid_argument("Negative value not allowed");
    if (x > 100) throw out_of_range("Value exceeds maximum of 100");
    if (x == 0)  throw runtime_error("Zero causes a runtime issue");
    cout << "Processing: " << x << endl;
}

void middleware(int x) {
    try {
        riskyOperation(x);
    } catch (const exception &e) {
        // Log the error, then rethrow for the caller to handle
        cout << "[LOG] Exception caught: " << e.what() << endl;
        throw;    // bare throw — rethrows the SAME exception unchanged
        // DO NOT write: throw e;  (that would lose derived type info)
    }
}

int main() {
    // Specific catches first, general catch last
    try {
        middleware(-5);
    } catch (const invalid_argument &e) {
        cout << "Input error: " << e.what() << endl;
    } catch (const out_of_range &e) {
        cout << "Range error: " << e.what() << endl;
    } catch (const exception &e) {
        cout << "General error: " << e.what() << endl;
    }

    // bad_alloc: thrown when new fails to allocate memory
    try {
        int *huge = new int[999999999999LL];
        delete[] huge;
    } catch (const bad_alloc &e) {
        cout << "Memory allocation failed: " << e.what() << endl;
    }

    return 0;
}`}],
    [{title:"Safe divide function",prompt:"Write `divide` that throws `invalid_argument` if denominator is zero. Call inside a `try` block and print the message in `catch`.",starter:`#include <iostream>
#include <stdexcept>
using namespace std;

// write divide
`,solution:`#include <iostream>
#include <stdexcept>
using namespace std;

double divide(double a, double b) {
    if (b == 0) throw invalid_argument("division by zero");
    return a / b;
}

int main() {
    try {
        cout << divide(12, 0) << endl;
    } catch (const invalid_argument &e) {
        cout << e.what() << endl;
    }
}`},
    {title:"Catch a conversion failure",prompt:"Take a string age value and convert with `stoi`. If conversion fails, catch the standard exception and show a friendly message.",starter:`#include <iostream>
#include <string>
using namespace std;

int main() { /* solve here */ }`,solution:`#include <iostream>
#include <string>
using namespace std;

int main() {
    string ageText = "abc";
    try {
        int age = stoi(ageText);
        cout << age << endl;
    } catch (const exception &e) {
        cout << "Invalid input: " << e.what() << endl;
    }
}`},
    {title:"Multiple catch blocks with rethrow",prompt:"Write a function `processInput(int val)` that throws `out_of_range` if val > 100, `invalid_argument` if val < 0, and `runtime_error` if val == 0. In `main`, call it in a try block catching each exception type specifically. Add a middleware function that catches any exception, logs it, then rethrows.",starter:`#include <iostream>
#include <stdexcept>
using namespace std;

// write processInput function
// write middleware function that logs and rethrows

int main() {
    // call middleware with values: -5, 0, 50, 200
    return 0;
}`,solution:`#include <iostream>
#include <stdexcept>
using namespace std;

void processInput(int val) {
    if (val < 0)   throw invalid_argument("Value cannot be negative");
    if (val == 0)  throw runtime_error("Value cannot be zero");
    if (val > 100) throw out_of_range("Value exceeds maximum of 100");
    cout << "Processing: " << val << endl;
}

void middleware(int val) {
    try {
        processInput(val);
    } catch (const exception &e) {
        cout << "[LOG] Exception: " << e.what() << endl;
        throw;    // rethrow for caller to handle
    }
}

int main() {
    int testValues[] = {-5, 0, 50, 200};
    for (int v : testValues) {
        try {
            middleware(v);
        } catch (const invalid_argument &e) {
            cout << "Input error: " << e.what() << endl;
        } catch (const runtime_error &e) {
            cout << "Runtime error: " << e.what() << endl;
        } catch (const out_of_range &e) {
            cout << "Range error: " << e.what() << endl;
        }
    }
    return 0;
}`}],
    [{question:"Where should risky code that may throw be placed?",options:["Inside `catch`","Inside `try`","Only inside constructors","Only inside templates"],answer:1,explanation:"A `try` block wraps the code that may throw, while `catch` handles matching exceptions."},
     {question:"What does a `catch` block do?",options:["Throws an exception","Allocates memory","Handles a matching thrown exception","Creates a template instance"],answer:2,explanation:"A catch block reacts to a thrown exception of the appropriate type."},
     {question:"What does `throw;` do inside a catch block?",options:["Throws a new integer","Terminates the program immediately","Rethrows the current exception","Ignores the error"],answer:2,explanation:"Bare `throw;` forwards the currently handled exception outward."},
     {question:"What is stack unwinding?",options:["Removing elements from a stack data structure","The process of calling destructors for local objects when an exception propagates","Freeing all global memory on exit","Reverting all variable changes when an exception occurs"],answer:1,explanation:"Stack unwinding is the process of automatically calling destructors for all local objects in scope as an exception propagates up the call stack looking for a handler."},
     {question:"Which catch block catches ALL standard exceptions?",options:["`catch(exception e)`","`catch(const exception &e)`","`catch(...)`","`catch(std::error &e)`"],answer:1,explanation:"`catch(const exception &e)` catches any exception derived from `std::exception`. `catch(...)` catches truly anything including non-exception types."},
     {question:"What is the correct order for multiple catch blocks?",options:["Any order — C++ picks the best match","Most specific (derived) exceptions first, most general last","Most general exceptions first","Alphabetical order by exception name"],answer:1,explanation:"Catch blocks are checked top to bottom. If you put `catch(exception &)` first, it catches everything and the specific blocks below are never reached. Always put specific types first."},
     {question:"What header must you include to use `invalid_argument` and `out_of_range`?",options:["`<exception>`","`<stdexcept>`","`<errors>`","`<throw>`"],answer:1,explanation:"`<stdexcept>` contains the standard exception classes like `invalid_argument`, `out_of_range`, and `runtime_error`. The base `exception` class is in `<exception>`."}]),

  15: studyWeek(15,"Custom Exceptions and Exception-Safe Code",
    ["Build custom exception classes using `std::exception`","Use RAII and destructors to stay safe during stack unwinding","Write code that avoids leaks and half-updated state after failure"],
    [{title:"Building custom exception classes",
      explanation:[
        "Standard exception types like <code>invalid_argument</code> are generic. When you're writing a banking system, throwing <code>invalid_argument</code> for an insufficient balance or an invalid account number is technically valid but semantically poor. <strong>Custom exception classes</strong> let you express errors in the vocabulary of your specific domain.",
        "Create a custom exception by inheriting from <code>std::exception</code> (from <code>&lt;exception&gt;</code>) and overriding the <code>what()</code> method. The <code>what()</code> signature is <code>const char* what() const noexcept override</code> — the <code>noexcept</code> guarantees that <code>what()</code> itself will never throw, which is important since it's often called inside error-handling paths.",
        "You can make custom exceptions more informative by storing additional data — for example, the actual balance and the attempted withdrawal amount. Use a constructor that accepts these values and store them as members. Then format a meaningful message in <code>what()</code>. For dynamic messages, store a <code>std::string</code> and return <code>msg.c_str()</code> from <code>what()</code>."
      ],
      keyPoints:[
        "Inherit from <code>std::exception</code> and override <code>what()</code>.",
        "Signature: <code>const char* what() const noexcept override</code>",
        "For dynamic messages, store a <code>string</code> member and return <code>.c_str()</code>.",
        "Create a hierarchy of custom exceptions for fine-grained catching."
      ],
      code:`#include <iostream>
#include <exception>
#include <string>
using namespace std;

// ── Simple custom exception ───────────────────────────────────
class InsufficientFundsError : public exception {
public:
    const char* what() const noexcept override {
        return "Insufficient funds for this transaction";
    }
};

// ── Custom exception with a dynamic message ───────────────────
class ValidationError : public exception {
private:
    string message;

public:
    ValidationError(const string& field, const string& reason) {
        message = "Validation failed for '" + field + "': " + reason;
    }

    const char* what() const noexcept override {
        return message.c_str();
    }
};

// ── Custom exception hierarchy ────────────────────────────────
class AppError : public exception {
    // base class for all application errors
};

class NetworkError : public AppError {
    // network-specific errors
};

class DatabaseError : public AppError {
    // database-specific errors
};

class BankAccount {
private:
    double balance;

public:
    BankAccount(double b) {
        balance = b;
    }

    void withdraw(double amount) {
        if (amount <= 0) {
            throw ValidationError("amount", "must be positive");
        }

        if (amount > balance) {
            throw InsufficientFundsError();
        }

        balance -= amount;
    }
};

int main() {
    BankAccount acc(500);

    try {
        acc.withdraw(-100);   // throws ValidationError
    } catch (const ValidationError& e) {
        cout << e.what() << endl;
    }

    try {
        acc.withdraw(1000);   // throws InsufficientFundsError
    } catch (const InsufficientFundsError& e) {
        cout << e.what() << endl;
    } catch (const exception& e) {
        cout << "Unexpected: " << e.what() << endl;
    }

    return 0;
}`},
    {title:"RAII — resource safety through object lifetime",
      explanation:[
        "<strong>RAII</strong> stands for <em>Resource Acquisition Is Initialization</em>. The core idea: acquire a resource in a constructor and release it in the destructor. Because destructors run <em>automatically</em> — both when scope ends normally and when an exception causes stack unwinding — RAII guarantees that resources are always released, even in the presence of exceptions.",
        "Without RAII, you might write: allocate memory, do some work that throws, oops — the memory is never freed because the code after the throw is skipped. With RAII, you wrap the resource in an object. The destructor runs automatically during stack unwinding and frees the resource — no leak, no manual cleanup code.",
        "RAII is not just about memory. It applies to <em>any</em> resource that needs cleanup: file handles (<code>fclose</code>), mutex locks (<code>unlock</code>), database connections (disconnect), network sockets (close). The C++ standard library implements RAII extensively: <code>unique_ptr</code> and <code>shared_ptr</code> are RAII wrappers for heap memory, <code>lock_guard</code> is RAII for mutexes, and file streams auto-close in their destructors."
      ],
      keyPoints:[
        "RAII: acquire resource in constructor, release in destructor.",
        "Destructor runs automatically — even during exception-induced stack unwinding.",
        "RAII prevents leaks, double-frees, and partially-initialized state.",
        "Smart pointers (<code>unique_ptr</code>, <code>shared_ptr</code>) are RAII for heap memory."
      ],
      code:`#include <iostream>
#include <stdexcept>
using namespace std;

// ── RAII wrapper for a raw integer array ─────────────────────
class IntBuffer {
private:
    int* data;
    int  size;

public:
    IntBuffer(int n) {
        size = n;
        data = new int[n];   // acquire: allocate on heap
        cout << "Buffer allocated (" << n << " ints)" << endl;
    }

    // Destructor runs automatically — even during exception unwinding
    ~IntBuffer() {
        delete[] data;       // release: free the memory
        cout << "Buffer freed" << endl;
    }

    int& operator[](int i) {
        return data[i];
    }
};

// ── RAII file guard ───────────────────────────────────────────
class FileGuard {
private:
    FILE* file;

public:
    FileGuard(const char* name, const char* mode) {
        file = fopen(name, mode);
        if (!file) {
            throw runtime_error("Cannot open file");
        }
    }

    ~FileGuard() {
        if (file) {
            fclose(file);   // always closed, even if an exception occurred
            cout << "File closed" << endl;
        }
    }

    FILE* get() {
        return file;
    }
};

void riskyWork() {
    IntBuffer buf(10);   // constructor allocates memory

    buf[0] = 42;

    throw runtime_error("Something went wrong");
    // buf's destructor fires here automatically — no memory leak
}

int main() {
    try {
        riskyWork();
    } catch (const exception& e) {
        cout << "Caught: " << e.what() << endl;
    }
    // "Buffer freed" prints BEFORE "Caught" — RAII is working correctly
    return 0;
}`}],
    [{title:"Throw a custom banking exception",prompt:"Create custom exception class `BankError`. In `withdraw`, throw it when amount exceeds balance. Catch in `main` and print the message.",starter:`#include <iostream>
#include <exception>
using namespace std;

// build custom exception example
`,solution:`#include <iostream>
#include <exception>
using namespace std;

class BankError : public exception {
public:
    const char* what() const noexcept override {
        return "Insufficient balance";
    }
};

void withdraw(double balance, double amount) {
    if (amount > balance) throw BankError();
}

int main() {
    try { withdraw(100, 500); }
    catch (const BankError &e) { cout << e.what() << endl; }
}`},
    {title:"Use RAII for safe cleanup",prompt:"Write a class that allocates an integer array in its constructor and frees it in its destructor. Explain in code structure how this prevents leaks if an exception is thrown after allocation.",starter:`#include <iostream>
using namespace std;

// build RAII holder
`,solution:`#include <iostream>
using namespace std;

class IntBuffer {
private:
    int *data;
public:
    IntBuffer(int size) { data = new int[size]; }
    ~IntBuffer() { delete[] data; }
    // destructor runs even during stack unwinding
};`},
    {title:"Custom exception with dynamic message",prompt:"Create a custom `RangeError` exception class that stores both the invalid value and the allowed range. The `what()` message should include all three values. Test by throwing it from a `setAge(int)` function that only accepts 0–120.",starter:`#include <iostream>
#include <exception>
#include <string>
using namespace std;

// implement RangeError exception class
// implement setAge function

int main() {
    // test valid and invalid ages
    return 0;
}`,solution:`#include <iostream>
#include <exception>
#include <string>
using namespace std;

class RangeError : public exception {
private:
    string message;
public:
    RangeError(int value, int minVal, int maxVal) {
        message = "Value " + to_string(value) +
                  " out of range [" + to_string(minVal) +
                  ", " + to_string(maxVal) + "]";
    }
    const char* what() const noexcept override {
        return message.c_str();
    }
};

void setAge(int age) {
    if (age < 0 || age > 120) {
        throw RangeError(age, 0, 120);
    }
    cout << "Age set to: " << age << endl;
}

int main() {
    try { setAge(25);  } catch (const RangeError &e) { cout << e.what() << endl; }
    try { setAge(-5);  } catch (const RangeError &e) { cout << e.what() << endl; }
    try { setAge(200); } catch (const RangeError &e) { cout << e.what() << endl; }
    return 0;
}`},
    {title:"Exception-safe resource management",prompt:"Write a `NetworkConnection` class that 'connects' in the constructor (prints 'Connected') and 'disconnects' in the destructor (prints 'Disconnected'). Write a function `doWork()` that uses this class and throws a `runtime_error` midway. Show in `main` that the destructor still fires even when the exception propagates.",starter:`#include <iostream>
#include <stdexcept>
using namespace std;

// implement NetworkConnection (RAII)
// implement doWork() that throws mid-way

int main() {
    try {
        doWork();
    } catch (const exception &e) {
        cout << "Caught: " << e.what() << endl;
    }
    return 0;
}`,solution:`#include <iostream>
#include <stdexcept>
using namespace std;

class NetworkConnection {
public:
    NetworkConnection()  { cout << "Connected to server"    << endl; }
    ~NetworkConnection() { cout << "Disconnected from server" << endl; }
};

void doWork() {
    NetworkConnection conn;   // RAII: connects here
    cout << "Sending data..." << endl;
    throw runtime_error("Network timeout");
    cout << "This line is never reached" << endl;
    // conn destructor fires automatically before exception propagates
}

int main() {
    try {
        doWork();
    } catch (const exception &e) {
        cout << "Caught: " << e.what() << endl;
    }
    return 0;
}`}],
    [{question:"Why do custom exceptions often override `what()`?",options:["To create templates","To provide a readable C-string message","To allow multiple inheritance","To replace constructors"],answer:1,explanation:"`what()` is the standard way to expose a human-readable message from exception types."},
     {question:"What does RAII help prevent during exceptions?",options:["Inheritance","Polymorphism","Resource leaks","Operator overloading"],answer:2,explanation:"RAII ensures destructors release resources even when control leaves due to an exception."},
     {question:"Exception-safe code should mainly avoid:",options:["Using classes","Templates","Leaks and inconsistent state","Virtual functions"],answer:2,explanation:"A strong exception-safety mindset is about preserving correctness and cleanup when failures happen."},
     {question:"What is the correct signature for overriding `what()` in a custom exception?",options:["`string what() const`","`const char* what() const noexcept override`","`void what() override`","`char* what()`"],answer:1,explanation:"The standard `what()` returns `const char*`, is `const` (doesn't modify the object), `noexcept` (never throws), and uses `override` to verify the virtual signature matches."},
     {question:"Why should `what()` be declared `noexcept`?",options:["To make it run faster","To prevent throwing from within error-handling code","To allow multiple return types","Because all const functions must be noexcept"],answer:1,explanation:"`what()` is called inside catch blocks and error handlers. If it could throw, it would trigger `terminate()`. Declaring it `noexcept` guarantees it never throws."},
     {question:"What is the full name of RAII?",options:["Runtime Allocation and Initialization","Resource Acquisition Is Initialization","Reference and Address In Instance","Random Access Is Initialized"],answer:1,explanation:"RAII stands for Resource Acquisition Is Initialization — the idiom of tying resource lifetime to object lifetime, acquired in constructor and released in destructor."},
     {question:"During exception-induced stack unwinding, which objects get their destructors called?",options:["Only heap-allocated objects","Only static objects","All local (stack) objects in the unwound scopes","No objects — destructors are skipped during exceptions"],answer:2,explanation:"During stack unwinding, C++ guarantees that destructors for all local objects in the scopes being unwound are called. This is what makes RAII safe and reliable."}]),

  16: studyWeek(16,"File Handling, STL, Serialization, and Design Patterns",
    ["Read and write text and binary files in C++","Review STL containers such as `vector` and `map`","Understand object serialization and introductory Singleton and Factory patterns"],
    [{title:"File I/O — text files, binary files, and serialization",
      explanation:[
        "C++ provides file stream classes in <code>&lt;fstream&gt;</code>: <code>ofstream</code> for writing output to a file, <code>ifstream</code> for reading input from a file, and <code>fstream</code> for both. They work exactly like <code>cout</code> and <code>cin</code> — you use <code>&lt;&lt;</code> to write and <code>&gt;&gt;</code> to read. Always check if the file opened successfully with <code>if (!stream)</code> before using it.",
        "<strong>Text files</strong> store data as human-readable characters. They are easy to inspect and debug in any text editor. <code>getline(in, str)</code> reads an entire line. <code>in &gt;&gt; value</code> reads whitespace-delimited tokens. Text files are the right choice when readability matters.",
        "<strong>Binary files</strong> store raw bytes — the exact in-memory representation of your data. They are compact, fast to read/write, and type-safe. Use <code>file.write(reinterpret_cast&lt;char*&gt;(&obj), sizeof(obj))</code> to write and <code>file.read(...)</code> to read back. <strong>Serialization</strong> is the process of converting an object's state into a storable byte sequence. Binary serialization is the simplest form — it works well for plain structs, but is not portable across different architectures or compilers."
      ],
      keyPoints:[
        "<code>ofstream</code>: write to file. <code>ifstream</code>: read from file. Always check if open succeeded.",
        "Text file write: <code>out &lt;&lt; data;</code>. Text file read: <code>in &gt;&gt; var;</code> or <code>getline(in, str);</code>",
        "Binary write: <code>file.write(reinterpret_cast&lt;char*&gt;(&obj), sizeof(obj));</code>",
        "Always <code>close()</code> the file when done (or let the destructor close it automatically)."
      ],
      code:`#include <iostream>
#include <fstream>
#include <string>
#include <cstring>
using namespace std;

struct Student {
    char name[30];
    int  marks;
};

int main() {
    // ── Text file: write ──────────────────────────────────────
    {
        ofstream out("students.txt");

        if (!out) {
            cerr << "Cannot open file!" << endl;
            return 1;
        }

        out << "Ali 85"  << endl;
        out << "Sana 92" << endl;
        out << "Umar 78" << endl;

        // 'out' closes automatically when it goes out of scope (RAII)
    }

    // ── Text file: read ───────────────────────────────────────
    {
        ifstream in("students.txt");
        string name;
        int    marks;

        while (in >> name >> marks) {
            cout << name << ": " << marks << endl;
        }
    }

    // ── Binary file: write a struct ───────────────────────────
    {
        Student s;
        strncpy(s.name, "Taha", 30);
        s.marks = 95;

        ofstream bout("student.bin", ios::binary);
        bout.write(reinterpret_cast<char*>(&s), sizeof(s));
    }

    // ── Binary file: read back the struct ────────────────────
    {
        Student loaded;
        ifstream bin("student.bin", ios::binary);
        bin.read(reinterpret_cast<char*>(&loaded), sizeof(loaded));

        cout << loaded.name << ": " << loaded.marks << endl;
    }

    return 0;
}`},
    {title:"STL containers and introductory design patterns",
      explanation:[
        "The <strong>Standard Template Library (STL)</strong> provides ready-made data structures (containers) and algorithms. The most commonly used containers: <code>vector&lt;T&gt;</code> — dynamic array that grows automatically; <code>map&lt;K,V&gt;</code> — sorted key-value store; <code>set&lt;T&gt;</code> — sorted unique elements; <code>stack&lt;T&gt;</code> and <code>queue&lt;T&gt;</code> — LIFO and FIFO adapters. STL algorithms like <code>sort()</code>, <code>find()</code>, and <code>count()</code> work with any container through iterators.",
        "The <strong>Singleton pattern</strong> ensures that a class has exactly one instance throughout the program's lifetime, and provides a global access point to it. It is implemented by making the constructor private and providing a static method that returns a reference (or pointer) to the one shared instance. The <code>static Logger obj;</code> inside the method is initialized once and lives for the program's duration.",
        "The <strong>Factory pattern</strong> encapsulates object creation behind a factory method. Instead of calling <code>new ConcreteType()</code> directly in client code, you call a factory function that decides which concrete class to instantiate based on a parameter. This decouples the client from specific class names, making the code easier to extend — add new types without changing existing calling code."
      ],
      keyPoints:[
        "<code>vector&lt;T&gt;</code>: go-to dynamic array. <code>map&lt;K,V&gt;</code>: sorted key-value store.",
        "Singleton: private constructor, static instance method, one shared object.",
        "Factory: hides <code>new ConcreteType()</code> behind a function — returns base pointer.",
        "Use <code>= delete</code> on copy constructor and assignment operator to prevent Singleton copies."
      ],
      code:`#include <iostream>
#include <vector>
#include <map>
#include <string>
using namespace std;

// ── STL: vector and map ───────────────────────────────────────
void stlDemo() {
    vector<int> scores = { 85, 92, 78, 95, 88 };
    scores.push_back(100);

    for (int s : scores) {
        cout << s << " ";
    }
    cout << endl;

    map<string, int> grades;
    grades["Ali"]  = 85;
    grades["Sana"] = 92;

    for (auto& entry : grades) {
        cout << entry.first << ": " << entry.second << endl;
    }
}

// ── Singleton pattern ─────────────────────────────────────────
class Logger {
private:
    Logger() {
        // private: cannot be constructed from outside
    }

    Logger(const Logger&)            = delete;   // no copying
    Logger& operator=(const Logger&) = delete;   // no assignment

public:
    static Logger& instance() {
        static Logger obj;   // created once, lives for the program
        return obj;
    }

    void log(const string& msg) {
        cout << "[LOG] " << msg << endl;
    }
};

// ── Factory pattern ───────────────────────────────────────────
class Shape {
public:
    virtual void draw() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
public:
    void draw() const override {
        cout << "Drawing Circle" << endl;
    }
};

class Rectangle : public Shape {
public:
    void draw() const override {
        cout << "Drawing Rectangle" << endl;
    }
};

Shape* createShape(const string& type) {
    if (type == "circle")    return new Circle();
    if (type == "rectangle") return new Rectangle();
    return nullptr;
}

int main() {
    stlDemo();

    Logger::instance().log("Application started");
    Logger::instance().log("Processing data...");
    // Both calls return the SAME Logger instance

    Shape* s = createShape("circle");
    if (s != nullptr) {
        s->draw();
        delete s;
    }

    return 0;
}`}],
    [{title:"Save and load student records",prompt:"Write code that stores a student's name and marks in a text file using `ofstream`, then reads them back using `ifstream` and prints the values.",starter:`#include <iostream>
#include <fstream>
#include <string>
using namespace std;

// solve file handling task
`,solution:`#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    ofstream out("student.txt");
    out << "Ayesha 91";
    out.close();

    ifstream in("student.txt");
    string name; int marks;
    in >> name >> marks;
    cout << name << " " << marks << endl;
}`},
    {title:"Singleton pattern",prompt:"Implement a `Logger` class using the Singleton pattern so that only one instance can ever be created. Access the instance through a static method.",starter:`class Logger {
    // implement Singleton
};`,solution:`class Logger {
private:
    Logger() {}
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;
public:
    static Logger& instance() {
        static Logger obj;
        return obj;
    }
    void log(const string &msg) { cout << "[LOG] " << msg << endl; }
};`},
    {title:"STL vector and map together",prompt:"Create a `Gradebook` that stores student names and their marks using a `map<string, int>`. Add at least 4 students, then iterate and print anyone with marks >= 80. Also find the highest mark using a loop.",starter:`#include <iostream>
#include <map>
#include <string>
using namespace std;

// implement Gradebook using map

int main() {
    // add students and demonstrate filtering and max-finding
    return 0;
}`,solution:`#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> gradebook;
    gradebook["Ali"]    = 85;
    gradebook["Sana"]   = 92;
    gradebook["Umar"]   = 74;
    gradebook["Hoorain"]= 88;
    gradebook["Hadi"]   = 61;

    cout << "High achievers (>= 80):" << endl;
    for (auto &entry : gradebook) {
        if (entry.second >= 80) {
            cout << "  " << entry.first << ": " << entry.second << endl;
        }
    }

    // Find highest mark
    string topStudent;
    int topMark = -1;
    for (auto &entry : gradebook) {
        if (entry.second > topMark) {
            topMark    = entry.second;
            topStudent = entry.first;
        }
    }
    cout << "Top student: " << topStudent << " with " << topMark << endl;
    return 0;
}`}],
    [{question:"Which STL container is a good default dynamic sequence structure?",options:["`vector`","`ofstream`","`exception`","`virtual`"],answer:0,explanation:"`vector` is the standard dynamic array-like container in the STL."},
     {question:"What does the Singleton pattern guarantee?",options:["Multiple instances per thread","Exactly one shared instance","No constructors","Only derived classes can be created"],answer:1,explanation:"Singleton ensures only one instance of the class exists throughout the program."},
     {question:"The Factory pattern is mainly used to:",options:["Hide object creation behind a common interface","Guarantee one instance forever","Replace inheritance with arrays","Catch exceptions automatically"],answer:0,explanation:"Factory centralizes creation logic and returns the right concrete object for the requested type."},
     {question:"Which class is used to write data to a file in C++?",options:["`ifstream`","`fstream` only","`ofstream`","`fileout`"],answer:2,explanation:"`ofstream` (output file stream) is used to write data to files. `ifstream` is for reading, `fstream` supports both."},
     {question:"What does `ios::binary` do when opening a file?",options:["Encrypts the file","Opens the file in binary mode — no text translation occurs","Compresses the file","Makes the file read-only"],answer:1,explanation:"`ios::binary` opens the file in binary mode, preventing any character translation (like newline conversion). Required for raw binary reads/writes."},
     {question:"How do you prevent copies of a Singleton class?",options:["Make the class abstract","Delete the copy constructor and copy assignment operator","Use `protected` inheritance","Declare all members as `static`"],answer:1,explanation:"To enforce the single-instance guarantee, delete the copy constructor and copy assignment operator with `= delete`. This prevents any accidental copying of the singleton object."},
     {question:"What does `map<string, int>` store?",options:["A list of strings","Key-value pairs where keys are strings and values are ints, sorted by key","A list of integers indexed by position","Pairs of the same type only"],answer:1,explanation:"`map<K, V>` stores key-value pairs in sorted order by key. `map<string, int>` maps string keys to integer values — useful for things like gradebooks or word counters."}]),

  17: examWeek(17,"Final Exam Simulation: Weeks 10 to 16",
    ["Mixed exam covering const correctness, polymorphism, abstract classes, templates, exceptions, and file handling","MCQs auto-scored; coding prompts use guided self-check after revealing model answer","Use topic navigator for quick jumps and submit for a score summary"],
    90,
    [{topic:"Const and Polymorphism",intro:"Start with const-correct interfaces, virtual dispatch, and safe base-class design.",questions:[
      {id:"f1",type:"mcq",prompt:"Main promise of a const member function?",options:["Always returns const data","Will not modify the object's normal state","Can only be called by templates","Can never throw exceptions"],answer:1,explanation:"Const member functions promise not to modify the object's observable state."},
      {id:"f2",type:"coding",prompt:"Create a polymorphic `Shape` base class with virtual `area()`, then override it in `Rectangle`.",starter:`class Shape {
    // solve here
};`,solution:`class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() = default;
};

class Rectangle : public Shape {
private:
    double length, width;
public:
    Rectangle(double l, double w) : length(l), width(w) {}
    double area() const override { return length * width; }
};`},
      {id:"f3",type:"mcq",prompt:"Deleting a derived object through a base pointer is safest when base class has:",options:["A friend function","A static member","A virtual destructor","A default argument"],answer:2,explanation:"A virtual destructor guarantees the correct derived destructor runs."},
      {id:"f4",type:"mcq",prompt:"Run-time polymorphism depends on the actual:",options:["Variable name","Pointer address format","Object type behind a base pointer or reference","Size of the class only"],answer:2,explanation:"Dynamic dispatch chooses the function implementation based on the real object type."}
    ]},
    {topic:"Abstract Classes, Templates, and Friends",intro:"Interface-based design with generic programming and controlled access patterns.",questions:[
      {id:"f5",type:"mcq",prompt:"A class with at least one pure virtual function is:",options:["Static","Abstract","Final only","A template"],answer:1,explanation:"Any class with a pure virtual function becomes abstract."},
      {id:"f6",type:"coding",prompt:"Write a function template `swapTwo(T &a, T &b)` and test it with integers.",starter:`template <typename T>
// complete function`,solution:`template <typename T>
void swapTwo(T &a, T &b) {
    T temp = a; a = b; b = temp;
}`},
      {id:"f7",type:"mcq",prompt:"Which statement about friend functions is correct?",options:["Always member functions","Can access private members when declared as friends","Cannot return values","Replace inheritance"],answer:1,explanation:"Friend functions are external functions granted special access by the class."},
      {id:"f8",type:"coding",prompt:"Create a class template `Holder<T>` with one private value and a `show()` function.",starter:`template <typename T>
class Holder {
    // solve here
};`,solution:`template <typename T>
class Holder {
private:
    T value;
public:
    Holder(T v) : value(v) {}
    void show() const { cout << value << endl; }
};`}
    ]},
    {topic:"Exceptions and Safe Design",intro:"Standard exceptions, custom exception classes, and RAII.",questions:[
      {id:"f9",type:"mcq",prompt:"Which keyword transfers control to a catch block?",options:["`throw`","`break`","`const`","`override`"],answer:0,explanation:"The `throw` keyword raises an exception."},
      {id:"f10",type:"coding",prompt:"Create custom exception `MarksError` derived from `exception` and override `what()`.",starter:`#include <exception>
using namespace std;

// create MarksError`,solution:`class MarksError : public exception {
public:
    const char* what() const noexcept override {
        return "Marks out of valid range";
    }
};`},
      {id:"f11",type:"mcq",prompt:"RAII is mainly about:",options:["Using only references","Binding resource cleanup to object lifetime","Avoiding STL","Making all code const"],answer:1,explanation:"RAII ensures resources are released automatically in destructors."},
      {id:"f12",type:"mcq",prompt:"Which standard member provides a message from an exception object?",options:["`size()`","`what()`","`type()`","`throw()`"],answer:1,explanation:"Many exception types expose a human-readable message through `what()`."}
    ]},
    {topic:"Files, STL, and Patterns",intro:"Persistence, standard containers, and common object-creation patterns.",questions:[
      {id:"f13",type:"mcq",prompt:"Which STL container is a good default dynamic sequence structure?",options:["`vector`","`ofstream`","`exception`","`virtual`"],answer:0,explanation:"`vector` is the standard dynamic array-like container in the STL."},
      {id:"f14",type:"coding",prompt:"Write a short snippet that opens `notes.txt` with `ofstream` and writes one line to it.",starter:`#include <fstream>
using namespace std;

// write snippet`,solution:`ofstream out("notes.txt");
out << "OOP final revision complete" << endl;
out.close();`},
      {id:"f15",type:"mcq",prompt:"The Factory pattern is mainly used to:",options:["Hide object creation behind a common interface","Guarantee one instance forever","Replace inheritance with arrays","Catch exceptions automatically"],answer:0,explanation:"Factory centralizes creation logic and returns the right concrete object for the requested type."}
    ]}])
};

// Mid topics use string keys; final weeks use numbers
const MID_TOPICS  = ["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11","t12","t13","t14"];
const MID_WEEKS   = [1,2,3,4,5,6,7,8,9]; // kept for exam week 9 reference
const FINAL_WEEKS = [10,11,12,13,14,15,16,17];
const KEY = "cpp-oop-lgu-v2";
const THEME_KEY = "cpp-oop-theme-v1";
const MOTIVATION_QUOTES = [
  "Small progress every day builds unstoppable momentum.",
  "Discipline beats motivation when it comes to mastery.",
  "You are not behind; you are building real depth.",
  "One solved concept today saves hours in the exam.",
  "Consistency is your superpower in programming.",
  "You are one focused session away from a breakthrough.",
  "Keep stacking wins. Your future self is watching.",
  "Every concept mastered today becomes confidence tomorrow.",
  "Progress is quiet at first, then suddenly obvious."
];

// ─── STATE ────────────────────────────────────────────────────────────────────

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s) {
      if (!s.topic) s.topic = "t1";
      if (!s.quiz) s.quiz = {};
      if (!s.practice) s.practice = {};
      if (!s.exams) s.exams = {};
      if (!s.celebrated) s.celebrated = {};
      if (typeof s.lastQuoteIndex !== "number") s.lastQuoteIndex = -1;
      return s;
    }
  } catch(_) {}
  return { mode:"mid", week:1, topic:"t1", quiz:{}, practice:{}, exams:{}, celebrated:{}, lastQuoteIndex:-1 };
}

function saveState() { localStorage.setItem(KEY, JSON.stringify(state)); }


export type WeekData = CourseWeek;
