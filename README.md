# Varsiti

> A programming learning platform built for university students who find existing
> resources either too shallow or too overwhelming.

**Live → [varsiti.xyz](https://varsiti.xyz)**

---

## What is Varsiti?

I built Varsiti after noticing a gap while preparing for my own OOP exam — structured,
beginner-friendly resources for university-level CS topics barely exist for Pakistani
students. Varsiti covers the core curriculum with structured lessons and an AI assistant
that generates explanations and practice problems on demand.

**Topics covered:** C++, Python, JavaScript fundamentals · Object-Oriented Programming · Data Structures & Algorithms

---

## Features

- **Structured curriculum** — University-aligned topics with clear progression
- **AI Assistant** — On-demand theory, code examples and practice problems per topic
- **Auth + Progress tracking** — Users sign in and track completed lessons
- **Responsive UI** — Works on desktop and mobile

---

## Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Frontend     | Next.js (App Router), React, Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL + Auth)            |
| Deployment   | Vercel                                  |
| AI           | LLM API integration                     |

---

## Local Development

```bash
git clone https://github.com/DevTahaAwan/varsiti.git
cd varsiti
npm install
cp .env.example .env.local   # fill in your Supabase + AI keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Required environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# add your AI API key here
```

---

## Author

**Hafiz Muhammad Taha Ali**
[varsiti.xyz](https://varsiti.xyz) · [LinkedIn](https://linkedin.com/in/dev-tahawan) · [GitHub](https://github.com/DevTahaAwan)
