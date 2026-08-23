# 🌌 MERIDIAN LEARNING ORBIT

<div align="center">

**The AI-Powered Student Career Intelligence, Academic Telemetry & Placement Command Center**

*A Next-Generation Full-Stack Web Platform Engineered for University Students to Master Core Computer Science, Accelerate Placements, and Navigate Campus Life.*

[![React](https://img.shields.io/badge/Frontend-React_18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_6.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node_24_/_Express_5.2-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_3.6_Flash-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Spline](https://img.shields.io/badge/3D-Spline_Runtime-FF4081?logo=spline&logoColor=white)](https://spline.design/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

</div>

---

## 📑 Table of Contents

1. [Executive Summary & Vision](#-executive-summary--vision)
2. [Full System Architecture](#-full-system-architecture)
3. [Complete Technology Stack](#-complete-technology-stack)
4. [Feature Ecosystem & Technical Solutions](#-feature-ecosystem--technical-solutions)
   - [1. Spline 3D Interactive Authentication Orbit](#1-spline-3d-interactive-authentication-orbit)
   - [2. iOS-Inspired Liquid Glass Design System](#2-ios-inspired-liquid-glass-design-system)
   - [3. Intelligent Student Dashboard & Placement Telemetry](#3-intelligent-student-dashboard--placement-telemetry)
   - [4. 4-Year Personalized Learning Roadmap](#4-4-year-personalized-learning-roadmap)
   - [5. Assessment & Mastery Recalculation Engine](#5-assessment--mastery-recalculation-engine)
   - [6. Spaced Repetition Revision Scheduler](#6-spaced-repetition-revision-scheduler)
   - [7. Academic Tracker & Attendance Risk Engine](#7-academic-tracker--attendance-risk-engine)
   - [8. Verified Smart Resources Hub (41 Curated Assets)](#8-verified-smart-resources-hub-41-curated-assets)
   - [9. AI Career Gap Analyzer](#9-ai-career-gap-analyzer)
   - [10. Interactive AI Mock Interview Studio](#10-interactive-ai-mock-interview-studio)
   - [11. Contextual AI Doubt Solver & Tutor](#11-contextual-ai-doubt-solver--tutor)
   - [12. Placement Command Center & Tier-1 Prep](#12-placement-command-center--tier-1-prep)
   - [13. Productivity Coach & Deep Work Sprints](#13-productivity-coach--deep-work-sprints)
   - [14. Explainable Next-Best-Action (NBA) Engine](#14-explainable-next-best-action-nba-engine)
   - [15. 3D Campus Spatial Navigator](#15-3d-campus-spatial-navigator)
   - [16. College Event Hub & Workshop Registrar](#16-college-event-hub--workshop-registrar)
5. [Database Architecture & PostgreSQL Schema](#-database-architecture--postgresql-schema)
6. [Complete REST API Reference](#-complete-rest-api-reference)
7. [AI Resilience Engine & Multi-Tier Fallbacks](#-ai-resilience-engine--multi-tier-fallbacks)
8. [Design System & Visual Tokens](#-design-system--visual-tokens)
9. [Repository & Codebase Structure](#-repository--codebase-structure)
10. [Getting Started & Local Installation](#-getting-started--local-installation)
11. [Environment Configuration](#-environment-configuration)
12. [Verification, E2E Testing & Test Suites](#-verification-e2e-testing--test-suites)
13. [Security, Ownership & Rate Limiting](#-security-ownership--rate-limiting)
14. [Troubleshooting Guide](#-troubleshooting-guide)

---

## 🌟 Executive Summary & Vision

University engineering students navigate fragmented systems: academic portals for grades, coding platforms for DSA, scattered YouTube playlists for theory, spreadsheets for placement tracking, and generic chatbots for interview practice.

**Meridian Learning Orbit** solves this by uniting all university career and academic workflows into a single **high-performance, data-driven intelligence platform**:
- **Real-Time Academic Telemetry**: SGPA/CGPA projection, subject internal/end-semester mark distributions, and 75% attendance threshold monitoring.
- **Autonomous Spaced Repetition**: Dynamic mastery tracking with Ebbinghaus memory decay modeling.
- **Precision AI Career Intelligence**: Powered by Google Gemini 3.6 Flash, analyzing student resumes and skill sets against Tier-1 Super Dream standards (FAANG, top product firms, quantitative funds).
- **Interactive 3D UI & Liquid Glass Aesthetics**: Aerospace-grade visual hierarchy built with React 18, Framer Motion, and Spline 3D.

---

## 🏛 Full System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT APPLICATION (React + Vite)                            │
│                                                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │   Meridian Auth Orbit   │  │   Dashboard & Orbit 3D  │  │   Personalized Roadmap      │  │
│  │ (Spline 3D + Robot)     │  │ (Mastery & NBA Engine)  │  │ (4-Year Nodes & Questions)  │  │
│  └────────────┬────────────┘  └────────────┬────────────┘  └──────────────┬──────────────┘  │
│               │                            │                              │                 │
│  ┌────────────┴────────────┐  ┌────────────┴────────────┐  ┌──────────────┴──────────────┐  │
│  │   Smart Resources Hub   │  │   AI Interview Studio   │  │   Academic & Productivity   │  │
│  │ (41 Verified Materials) │  │ (7 Tracks + AI Rubric)  │  │ (Gradebook & Pomodoro)      │  │
│  └────────────┬────────────┘  └────────────┬────────────┘  └──────────────┬──────────────┘  │
│               │                            │                              │                 │
│               └────────────────────────────┼──────────────────────────────┘                 │
│                                            ▼                                                │
│                    meridianDataService.ts / apiClient.ts (Typed Data Layer)                 │
└────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                             │ HTTP/REST (Bearer JWT)
                                             ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND SERVER (Express 5.2 / Node 24)                         │
│                                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Middlewares: Request Logger | CORS Allowlist | Rate Limiter | JWT Auth | Ownership    │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                                │
│     ┌──────────────────┬───────────────────┼───────────────────┬───────────────────┐        │
│     ▼                  ▼                   ▼                   ▼                   ▼        │
│ ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐ │
│ │ Auth & User  │ │  Curriculum  │ │ Student Mastery │ │  Academics   │ │ AI & Interviews │ │
│ │ Controller   │ │  Controller  │ │  & NBA Service  │ │  Controller  │ │ Service (Gemini)│ │
│ └──────┬───────┘ └──────┬───────┘ └────────┬────────┘ └──────┬───────┘ └────────┬────────┘ │
│        │                │                  │                 │                  │          │
│        └────────────────┴──────────────────┼─────────────────┴──────────────────┘          │
│                                            │                                                │
│                      ┌─────────────────────┴─────────────────────┐                          │
│                      ▼                                           ▼                          │
│         Supabase Client SDK (@supabase/js)          Google GenAI SDK (@google/genai)        │
└──────────────────────┬───────────────────────────────────────────┬──────────────────────────┘
                       │                                           │
                       ▼                                           ▼
┌──────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐
│      SUPABASE INFRASTRUCTURE (Cloud)        │ │        GOOGLE GEMINI INTELLIGENCE          │
│  - PostgreSQL 15 Database (23 Tables)        │ │  - Primary: gemini-3.6-flash (v1beta)      │
│  - Row Level Security (RLS) Data Isolation   │ │  - 3.5s Timeout Racing & Quota Failover    │
│  - Supabase Storage (Resumes & Uploads)      │ │  - Heuristic Offline Domain Fallbacks      │
│  - Supabase Auth (JWT Management & Triggers) │ │  - JSON Schema Structural Enforcement      │
└──────────────────────────────────────────────┘ └────────────────────────────────────────────┘
```

---

## 💻 Complete Technology Stack

### Frontend Ecosystem
| Technology | Version | Purpose |
|---|:---:|---|
| **React** | `18.3.1` | Declarative component UI engine |
| **Vite** | `6.3.5` | Next-generation frontend build tool and HMR server |
| **TypeScript** | `5.x` | Strict compile-time type safety across models and API clients |
| **Tailwind CSS** | `4.1.12` | Utility-first responsive CSS styling with custom theme variables |
| **Motion (Framer Motion)** | `12.23.24` | High-fidelity physics-based layout animations, page transitions, and spring gestures |
| **Spline React & Runtime** | `4.1.0` / `2.0.5` | Interactive real-time WebGL 3D scene rendering and mouse-deformation events |
| **Recharts** | `2.15.2` | Data visualization for SGPA trends, weekly study distributions, and skill radars |
| **Lucide React** | `0.487.0` | Modern, consistent vector iconography |
| **Radix UI Primitives** | Various | Accessible unstyled primitives (Accordion, Dialog, Popover, Tooltip, Tabs) |
| **Canvas Confetti** | `1.9.4` | Milestone celebration particles upon quiz completion and streak extensions |

### Backend Ecosystem
| Technology | Version | Purpose |
|---|:---:|---|
| **Node.js** | `24.x` | High-performance asynchronous JavaScript runtime |
| **Express.js** | `5.2.1` | REST API routing and middleware framework |
| **@google/genai** | `2.18.0` | Official Google Gemini API client SDK |
| **@supabase/supabase-js** | `2.112.3` | Supabase PostgreSQL client with connection pooling and auth verification |
| **Multer** | `2.2.0` | Multipart/form-data handler for resume document uploads |
| **dotenv** | `17.4.2` | Environment variable management with multi-file loading |
| **CORS** | `2.8.6` | Cross-Origin Resource Sharing with localhost and client domain allowlists |

### Database & Storage Infrastructure
| Technology | Description |
|---|---|
| **Supabase PostgreSQL 15** | Relational data store with JSONB columns, generated UUIDs, and foreign key cascades |
| **PostgreSQL Row Level Security (RLS)** | Kernel-level multi-tenant student data isolation |
| **Supabase Storage** | Object storage with signed expiring download URLs for student resumes |
| **Supabase Auth** | Cryptographic user authentication with auto-profile initialization triggers |

---

## 🚀 Feature Ecosystem & Technical Solutions

### 1. Spline 3D Interactive Authentication Orbit
- **Interactive "Boxes Hover" 3D Matrix**: A tactile 3D surface where nearby cubes raise and deform smoothly as the cursor moves across the screen.
- **Interactive 3D Robot & Orbit Scene**: Responsive 3D mascot reacting to authentication states.
- **Full Auth Lifecycle**: Real-time sign-up, sign-in, session preservation, password visibility toggles, and instant **"Quick Demo Access"** mode for offline showcases.

### 2. iOS-Inspired Liquid Glass Design System
- **Refractive Glass Surfaces**: Multi-tiered glass layers (`GlassSurface`, `GlassButton`, `GlassBadge`, `GlassMetric`) with calculated backdrop filters (`backdrop-blur-md`, `backdrop-saturate-150`).
- **Elimination of "Box Inside Box"**: Uses floating translucent surfaces, structural dividing gradients, and optical depth over solid nested cards.
- **Deep Slate & Technical Azure Color Tokens**: `#0B0F19` deep void slate with `#4F46E5` precision indigo and `#7C3AED` AI accents.

### 3. Intelligent Student Dashboard & Placement Telemetry
- **Concentric Orbital Readiness Gauge**: Dual-band SVG radial ring computing real-time Tier-1 Super Dream placement readiness (0–100%).
- **Interactive 3D Orbit Canvas**: Visualizes mastery progression across 4 learning stages (Foundations → Core CS → High-Scale Systems → Placements).
- **Weekly Study Momentum**: 7-day and 30-day interactive study charts with daily targets.
- **Urgent Revision Alert Center**: Identifies decaying topics and prompts immediate retrieval quizzes.

### 4. 4-Year Personalized Learning Roadmap
- **Curriculum Stages**:
  - **Year 1**: Engineering Foundations, Computational Logic & Low-Level Memory
  - **Year 2**: Core CS (Operating Systems, DBMS, Networks, Algorithmic Foundations)
  - **Year 3**: Advanced Systems, Microservices, Distributed Design & Cloud DevOps
  - **Year 4**: Placement Sprints, System Design Architecture & Capstone Systems
- **Milestone Navigation**: Interactive milestone path with progress indicators, topic difficulty badges, and estimated hours.

### 5. Assessment & Mastery Recalculation Engine
- **Multi-Format Assessment Bank**: MCQs, multiple-correct, boolean, and code snippet comprehension.
- **Dynamic Mastery Scoring**: Instant scoring upon quiz submission. Recalculates mastery score (0–100%) and updates status (`CRITICAL` < 40%, `WEAK` < 60%, `AVERAGE` < 75%, `IMPROVING` < 90%, `STRONG` ≥ 90%).
- **Attempt History Tracking**: Logs time taken, selected choices, score delta, and timestamp.

### 6. Spaced Repetition Revision Scheduler
- **Modified SM-2 / Ebbinghaus Algorithm**: Calculates retention decay intervals based on student performance.
- **Status Pipeline**: `CRITICAL` → `OVERDUE` → `TODAY` → `SCHEDULED` → `MASTERED`.
- **Interval Expansion**: Successful revisions expand intervals (1d → 3d → 7d → 14d → 30d); failures immediately flag the topic for next-day review.

### 7. Academic Tracker & Attendance Risk Engine
- **Semester Gradebook**: Semester-wise SGPA and cumulative CGPA tracking with target trajectory graphs.
- **Course Telemetry**: Tracks internal marks (out of 50), end-semester marks (out of 100), total grade (S, A+, A, B, C, D, E, F, N), and credit weighting.
- **75% Attendance Safe-Zone Monitor**: Alerts students when attendance falls near or below mandatory university thresholds.

### 8. Verified Smart Resources Hub (41 Curated Assets)
- **100% Verified Openable URLs**: 41 production-grade resources covering all 15 curriculum topics verified via automated HTTP HEAD testing.
- **Multimodal Formats**: Full YouTube masterclasses (Abdul Bari, Striver, NeetCode, Jenny's Lectures, Gate Smashers, Neso Academy, MIT OCW), documentation (PostgreSQL, MDN, OSTEP, Docker, Kubernetes), and practice hubs (LeetCode, NeetCode 150, Striver A2Z).
- **Smart Weak-Topic Priority**: Detects topics where student mastery is below 60% and automatically pins recommended resources to the top.
- **Local Persistence**: Bookmarking and "Visited/Opened" tracking persisted via `localStorage`.

### 9. AI Career Gap Analyzer
- **Target Role Profiling**: Compares current student capabilities against target job descriptions (e.g., SDE II, Backend Architect, Quant Developer).
- **Match Score & Skill Breakdown**: Radar match score, identified competencies, missing core prerequisites, and importance weightings.
- **30-Day Step-by-Step Learning Plan**: Daily schedule with actionable deliverables, project recommendations, and portfolio guidance.

### 10. Interactive AI Mock Interview Studio
- **7 Specialized Tracks**: Technical (General), DSA & Problem Solving, Core CS (OS, DBMS, CN), System Design & Architecture, Object-Oriented Design (OOP), HR & Behavioral (STAR), and Aptitude & Logic.
- **Customizable Interview Depth**: Select 2, 3, 5, or 10 questions across Beginner, Intermediate, or Advanced difficulties.
- **Real-Time AI Answer Evaluation**: Provides technical accuracy scores (0–100%), communication clarity ratings, missing key concepts, and sample answer outlines.
- **Zero-Failure Fallback Engine**: If the Gemini API hits rate limits or latency thresholds, high-quality curated domain rubrics activate in <1s.

### 11. Contextual AI Doubt Solver & Tutor
- **24/7 Subject-Aware Resolution**: Answers technical queries with full context of the student's current curriculum and weak topics.
- **Code Highlighting & Formatting**: Markdown syntax highlighting for C++, Python, Java, Go, Rust, and SQL snippets.

### 12. Placement Command Center & Tier-1 Prep
- **Opportunity Pipeline**: Tracks applications across stages: *Applied* → *Shortlisted* → *OA Assessment* → *Technical Rounds* → *HR* → *Offer Accepted*.
- **Eligibility Checking**: Validates CGPA criteria, maximum allowed backlogs, and branch eligibility against job openings.
- **Package / CTC Telemetry**: Visualizes compensation packages, company tiers (Super Dream, Dream, Regular), and application deadlines.

### 13. Productivity Coach & Deep Work Sprints
- **Integrated Pomodoro Engine**: 25m Focus / 5m Break / 15m Long Break intervals with SVG progress stopwatch.
- **Task Management**: Create, prioritize (High/Medium/Low), and complete study tasks linked directly to roadmap topics.
- **Focus Session Telemetry**: Logs completed minutes to Supabase and increments weekly focus scores.

### 14. Explainable Next-Best-Action (NBA) Engine
- **Ranked Intelligence Recommendations**: Dynamically evaluates the student's database state to generate high-leverage suggestions:
  - *"Revise Graphs (Mastery 45% - overdue for 2 days)"*
  - *"Practice 3 Dynamic Programming Medium MCQs"*
  - *"Attendance warning in Operating Systems (74.2%)"*
- **Direct Action Dispatch**: One-click navigation launches the target quiz, study resource, or review session.

### 15. 3D Campus Spatial Navigator
- **Interactive Campus Model**: Spatial layout of VIT Chennai academic blocks, libraries, research centers, auditoriums, and labs.
- **Point of Interest Telemetry**: Searchable directory with department locations, opening hours, and faculty chambers.

### 16. College Event Hub & Workshop Registrar
- **Hackathons & Technical Symposia**: Official university listings with event dates, prize pools, and registration limits.
- **One-Click RSVP**: Enforces single-registration constraints per student with duplicate prevention.

---

## 🗄 Database Architecture & PostgreSQL Schema

The database consists of **23 normalized relational tables** in PostgreSQL managed through Supabase with Row Level Security (RLS) enabled across every table:

```
                                  ┌────────────────────────┐
                                  │      auth.users        │
                                  └───────────┬────────────┘
                                              │ 1:1
                                  ┌───────────▼────────────┐
                                  │        profiles        │
                                  └───────────┬────────────┘
                                              │ 1:1
                                  ┌───────────▼────────────┐
                                  │        students        │
                                  └───────────┬────────────┘
         ┌──────────────────┬─────────────────┼──────────────────┬──────────────────┐
         │ 1:N              │ 1:N             │ 1:N              │ 1:N              │ 1:N
┌────────▼────────┐ ┌───────▼────────┐ ┌──────▼────────┐ ┌───────▼────────┐ ┌───────▼────────┐
│ student_subject │ │ student_topic  │ │  question     │ │ spaced_revision│ │  productivity  │
│     _grades     │ │    _mastery    │ │   _attempts   │ │   _schedules   │ │     _tasks     │
└────────┬────────┘ └───────┬────────┘ └──────┬────────┘ └───────┬────────┘ └────────────────┘
         │ N:1              │ N:1             │ N:1              │ N:1
┌────────▼────────┐ ┌───────▼─────────────────┴────────┐ ┌───────▼────────┐
│academic_courses │ │    roadmap_curriculum_topics     │ │ focus_sessions │
└─────────────────┘ └───────┬──────────────────────────┘ └────────────────┘
                            │ 1:N
                    ┌───────▼────────┐
                    │roadmap_subtopics│
                    └───────┬────────┘
                            │ 1:N
                    ┌───────▼────────┐
                    │   assessment   │
                    │   _questions   │
                    └────────────────┘
```

### Table Dictionary

| # | Table Name | Key Columns | Description |
|---|---|---|---|
| 1 | `profiles` | `id`, `full_name`, `email`, `avatar_url`, `role` | Base user identity linked to Supabase Auth |
| 2 | `students` | `id`, `profile_id`, `college`, `branch`, `cgpa`, `semester` | Core university student attributes |
| 3 | `academic_courses` | `id`, `code`, `name`, `credits`, `semester_recommended` | Official curriculum course master |
| 4 | `student_subject_grades` | `id`, `student_id`, `course_id`, `semester`, `attendance_percentage` | Semester grades and attendance telemetry |
| 5 | `roadmap_years` | `id`, `year_number`, `title`, `focus_theme` | 4-Year curriculum structure |
| 6 | `roadmap_curriculum_topics` | `id`, `year_id`, `topic_key`, `title`, `difficulty`, `estimated_hours` | Detailed roadmap topic nodes |
| 7 | `roadmap_subtopics` | `id`, `topic_id`, `name`, `difficulty`, `key_concepts` | Granular subtopics within each topic |
| 8 | `student_topic_mastery` | `id`, `student_id`, `topic_id`, `mastery_score`, `status` | Real-time topic mastery (0–100%) |
| 9 | `assessment_questions` | `id`, `topic_id`, `question_text`, `options`, `correct_answer` | Multi-format assessment bank |
| 10 | `question_attempts` | `id`, `student_id`, `question_id`, `selected_answer`, `is_correct` | Student quiz attempt records |
| 11 | `spaced_revision_schedules` | `id`, `student_id`, `topic_id`, `next_revision_due`, `ease_factor` | SM-2 spaced repetition schedules |
| 12 | `curated_coding_problems` | `id`, `topic_id`, `title`, `platform`, `problem_url`, `youtube_solution_url` | Curated DSA & system problems |
| 13 | `student_coding_submissions`| `id`, `student_id`, `problem_id`, `status`, `solved_at` | Problem completion and bookmarks |
| 14 | `productivity_tasks` | `id`, `student_id`, `title`, `priority`, `completed`, `due_date` | Task manager entries |
| 15 | `focus_sessions` | `id`, `student_id`, `duration_minutes`, `session_mode` | Logged Pomodoro focus sprints |
| 16 | `next_best_actions` | `id`, `student_id`, `title`, `reason`, `urgency`, `action_type` | Prioritized intelligent recommendations |
| 17 | `skills` | `id`, `name`, `category`, `description` | Master skill catalog |
| 18 | `student_skills` | `id`, `student_id`, `skill_id`, `proficiency_level` | Student skill competencies |
| 19 | `study_resources` | `id`, `title`, `category`, `type`, `url`, `is_recommended` | Study resources repository |
| 20 | `placement_opportunities` | `id`, `company_name`, `role_title`, `package_lpa`, `deadline` | Active campus placements |
| 21 | `placement_applications` | `id`, `student_id`, `placement_id`, `status` | Student job applications |
| 22 | `events` | `id`, `title`, `event_type`, `event_date`, `venue`, `capacity` | Campus events & hackathons |
| 23 | `event_registrations` | `id`, `student_id`, `event_id`, `registered_at` | Student event registrations |

---

## 📡 Complete REST API Reference

**Base URL**: `http://localhost:5000/api`

### 1. Authentication & System Health
```http
GET  /api/health                     # Returns backend operational status
GET  /api/health/supabase            # Validates Supabase database connectivity
POST /api/auth/signup                # Registers new student (Body: { email, password, fullName })
POST /api/auth/login                 # Authenticates student & returns JWT (Body: { email, password })
POST /api/auth/logout                # Invalidates student session
```

### 2. AI Intelligence & Interview Studio
```http
POST /api/ai/interview/generate      # Generates 2–10 questions across 7 tracks (Gemini 3.6 + fallback)
POST /api/ai/interview/evaluate      # Evaluates answer with scoring rubric, clarity & sample outline
POST /api/ai/skill-gap               # Computes career skill gap & 30-day learning roadmap
POST /api/ai/resume/parse            # Multimodal PDF/DOC extraction into structured JSON
```

### 3. Curriculum & Question Bank
```http
GET  /api/roadmaps/curriculum        # Retrieves full 4-year curriculum with topics and subtopics
GET  /api/roadmaps/questions/:topicId# Retrieves assessment questions for a specific topic
POST /api/roadmaps/questions/attempt # Submits quiz answer & recalculates mastery score (Bearer Auth)
GET  /api/roadmaps/resources         # Retrieves all 41 curated study resources
GET  /api/roadmaps/resources/:topicId# Retrieves curated resources for a specific topic
```

### 4. Student Intelligence & Spaced Repetition
```http
GET  /api/students/profile/me        # Fetches current authenticated student profile (Bearer Auth)
PUT  /api/students/profile/me        # Updates CGPA, branch, target role (Bearer Auth)
GET  /api/students/mastery           # Fetches mastery status for all topics (Bearer Auth)
POST /api/students/revisions/:topicId/schedule # Schedules spaced revision with interval days (Bearer Auth)
GET  /api/dashboard/next-actions     # Fetches prioritized Next-Best-Action recommendations (Bearer Auth)
POST /api/dashboard/next-actions/:id/complete # Marks recommendation completed (Bearer Auth)
```

### 5. Academics, Productivity & Campus
```http
GET  /api/academics/grades           # Fetches semester gradebook and attendance (Query: ?semester=5)
GET  /api/productivity/tasks         # Fetches student's productivity tasks (Bearer Auth)
POST /api/productivity/tasks         # Creates a new study task (Bearer Auth)
PATCH /api/productivity/tasks/:id    # Toggles task completion (Bearer Auth)
POST /api/productivity/focus-session # Logs completed Pomodoro focus duration (Bearer Auth)
GET  /api/resources/coding-problems  # Fetches curated LeetCode/DSA problems
POST /api/resources/coding-problems/:id/status # Updates problem status: solved / bookmarked (Bearer Auth)
GET  /api/events                     # Lists campus events and hackathons
POST /api/events/:id/register        # Registers student for a campus event (Bearer Auth)
```

---

## 🛡 AI Resilience Engine & Multi-Tier Fallbacks

The backend AI service (`backend/src/services/ai.service.js`) incorporates a **zero-downtime resilience architecture**:

```
Client Interview Request
         │
         ▼
[Express Controller] ──> Normalized Request (dsa, system_design, core_cs, etc.)
         │
         ▼
[AIService._generateWithRetry]
         │
         ├────────────────────────────────────────────────┐
         │ Primary: Gemini 3.6 Flash (v1beta API)         │
         │ Timeout Race: 3,500 ms                         │
         │ Rate-Limit Quota Catch: 429 / RESOURCE_EXHAUSTED│
         │ Deprecation Catch: 404 Model Not Found         │
         │                                                │
         ▼ (If timeout or quota exceeded)                 ▼ (If fast success)
[Heuristic Domain Generator]                     [Return Gemini Response]
  - Algorithms & Graph Theory                      - Structured JSON questions
  - Distributed Systems & Caching                  - Key points to cover
  - Database Storage & B+ Trees                    - Model answer outline
  - OS Concurrency & Race Conditions
  - Computer Networks & Protocols
  - Behavioral STAR Format
         │
         ▼
Client Receives 200 OK (<1,000 ms)
```

---

## 🎨 Design System & Visual Tokens

The user interface follows the **Deep Slate & Technical Azure** design specification:

- **Background Canvas**: `#0B0F19` (Dark) / `#F8FAFC` (Light)
- **Primary Elevation**: `#111827` / `#FFFFFF` with `backdrop-filter: blur(16px)`
- **Interactive Indigo**: `#4F46E5` (Light) / `#6366F1` (Dark)
- **AI Signature Glow**: Linear gradient `from-indigo-500/20 to-purple-500/20`
- **Typography Hierarchy**:
  - **Display / Headings**: `Plus Jakarta Sans` / `Inter Display`
  - **Interface & Body**: `Inter`
  - **Metrics & Code**: `JetBrains Mono`

---

## 📂 Repository & Codebase Structure

```
CareerOS/
├── frontend/                                # React 18 + Vite Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx                      # Root Application Component & State Hub
│   │   │   └── components/
│   │   │       ├── AcademicTracker.tsx      # Semester Gradebook & Attendance Visualizer
│   │   │       ├── AIDoubtSolver.tsx        # 24/7 Contextual AI Tutor Interface
│   │   │       ├── CampusMap.tsx            # 3D Campus Spatial Map
│   │   │       ├── CollegeEventHub.tsx      # Hackathons & Campus Event Registrar
│   │   │       ├── DashboardIntelligence.tsx# Command Center Telemetry & Metrics
│   │   │       ├── MeridianNavRail.tsx      # Collapsible Liquid Glass Navigation
│   │   │       ├── MeridianOrbit3D.tsx      # 3D Canvas Orbital Mastery Engine
│   │   │       ├── NextBestActionBanner.tsx # Dynamic NBA Recommendation Banner
│   │   │       ├── PersonalizedRoadmap.tsx  # 4-Year Curriculum & Question Nodes
│   │   │       ├── PlacementPrep.tsx        # Super Dream Placement Pipeline
│   │   │       ├── ProductivityCoach.tsx    # Pomodoro Timer & Task Manager
│   │   │       ├── SmartResources.tsx       # 41 Verified Materials with Search/Filters
│   │   │       ├── StudentProfile.tsx       # Student Identity, CGPA & Skills
│   │   │       ├── auth/
│   │   │       │   ├── MeridianAuthOrbit.tsx    # Authentication Hub with 3D Canvas
│   │   │       │   ├── MeridianBoxesHover3D.tsx # Spline 3D "Boxes Hover" Deformation
│   │   │       │   ├── MeridianLearningRobot.tsx# Interactive Mascot
│   │   │       │   └── MeridianOrbitScene3D.tsx # 3D Orbit Scene
│   │   │       └── ui/
│   │   │           └── LiquidGlass.tsx      # Reusable Glass Morphism Component Library
│   │   ├── data/
│   │   │   ├── meridianStudyResourcesData.ts# 41 Curated Study Resources
│   │   │   └── studentIntelligence.ts       # Fallback Mastery Models & Types
│   │   ├── services/
│   │   │   ├── apiClient.ts                 # Typed HTTP Client
│   │   │   └── meridianDataService.ts       # Unified API Data Service
│   │   └── styles/
│   │       ├── theme.css                    # Liquid Glass Design Tokens & Gradients
│   │       └── index.css                    # Tailwind Directives & Base Rules
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                                 # Express 5.2 REST API Server
│   ├── src/
│   │   ├── server.js                        # Express App, Middleware Chain & Port 5000 Server
│   │   ├── config/
│   │   │   ├── env.js                       # Environment Config & Strict Validation
│   │   │   └── supabase.js                  # Supabase Client Initialization
│   │   ├── controllers/
│   │   │   ├── academic.controller.js       # Gradebook & Attendance Endpoints
│   │   │   ├── ai.controller.js             # Mock Interviews & AI Scoring Endpoints
│   │   │   ├── codingResources.controller.js# DSA Problem Endpoints
│   │   │   ├── curriculum.controller.js     # Roadmap Topics, Questions & Resources
│   │   │   ├── intelligence.controller.js   # Dashboard Intelligence Endpoints
│   │   │   ├── productivity.controller.js   # Tasks & Pomodoro Sprints Endpoints
│   │   │   └── student.controller.js        # Student Profiles & Mastery Endpoints
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js           # JWT Verification & Optional Auth
│   │   │   ├── error.middleware.js          # Centralized Exception Handler
│   │   │   ├── ownership.middleware.js      # Student Data Ownership Checks
│   │   │   └── rateLimit.middleware.js      # In-Memory Rate Limiter
│   │   ├── routes/
│   │   │   ├── index.js                     # Root API Router Registry
│   │   │   ├── academic.routes.js           # /api/academics/*
│   │   │   ├── ai.routes.js                 # /api/ai/*
│   │   │   ├── curriculum.routes.js         # /api/roadmaps/*
│   │   │   └── student.routes.js            # /api/students/*
│   │   └── services/
│   │       ├── academic.service.js          # Grade Calculations & Attendance Logic
│   │       ├── ai.service.js                # Gemini 3.6 Flash & Fallback Rubrics
│   │       ├── curriculum.service.js        # Curriculum, Question Bank & Resource Queries
│   │       ├── productivity.service.js      # Task CRUD & Focus Session Logger
│   │       └── studentIntelligence.service.js# Mastery Score & NBA Recommendation Engine
│   ├── database/
│   │   ├── schema.sql                       # Base PostgreSQL Schema (541 Lines)
│   │   ├── migration_meridian_learning_orbit.sql # Full Normalized Schema (292 Lines)
│   │   └── seed_meridian_data.sql           # Curriculum & Question Bank Seed Data
│   └── package.json
│
├── DESIGN_SYSTEM.md                         # Visual Tokens & Optical Specifications
└── README.md                                # Master System Documentation
```

---

## 🛠 Getting Started & Local Installation

### Prerequisites
- **Node.js**: `v18.x` or higher (`v24.x` recommended)
- **npm**: `v9.x` or higher
- **Supabase Account**: A free cloud Supabase project at [supabase.com](https://supabase.com)
- **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/meeribrahimali01/student-career-os.git
cd student-career-os
```

### Step 2: Install Backend & Frontend Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Database Migration & Seeding
1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Run `backend/database/migration_meridian_learning_orbit.sql` to generate all 23 normalized tables, foreign keys, and RLS policies.
3. Run `backend/database/seed_meridian_data.sql` to populate the 4-year curriculum, assessment bank, and coding challenges.

### Step 4: Configure Environment Variables
Create a `.env` file inside `backend/`:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash
CLIENT_URL=http://localhost:5173
```

### Step 5: Start the Development Servers
```bash
# Terminal 1: Launch Backend Server (Port 5000)
cd backend
node src/server.js

# Terminal 2: Launch Frontend Application (Port 5173)
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Verification, E2E Testing & Test Suites

The project includes an automated test suite verifying database connectivity, AI endpoints, URL health, and multi-tenant security isolation.

### 1. Run Complete 14-Flow End-to-End Regression Suite
```bash
node scratch/test_complete_e2e_suite.js
```
**Coverage**:
- [x] Student Registration & Auth
- [x] Session Login & Logout
- [x] Dashboard Mastery Telemetry
- [x] 4-Year Roadmap Navigation
- [x] Question Attempts & Real-Time Mastery Scoring
- [x] Spaced Repetition Scheduling
- [x] Academic Tracker & Gradebook
- [x] Curated Coding Challenges & Problem Bookmarking
- [x] Productivity Tasks & Focus Session Logging
- [x] Explainable Next-Best Actions
- [x] Student Profile Mutations
- [x] Campus Events Integration

### 2. Run Multi-Student Data Isolation Audit
```bash
node scratch/test_multi_user_isolation.js
```
**Verification**: Confirms Student A (Alice) and Student B (Bob) have zero data leakage across tasks, mastery records, and profiles under PostgreSQL RLS.

### 3. Run AI Mock Interview & Study Resources Audit
```bash
node scratch/test_comprehensive_interview_and_resources.js
```
**Verification**: Confirms all 7 mock interview tracks generate questions within 3.5s and all resource endpoints respond with 200 OK.

### 4. Verify 100% Resource URL Reachability
```bash
node scratch/validate_all_meridian_resources.js
```
**Verification**: Issues live HTTP HEAD requests to all 41 study resources (100% valid).

### 5. Run Frontend Production Build
```bash
cd frontend && npm run build
# Output: ✓ built in ~9.8s (0 errors)
```

---

## 🔒 Security, Ownership & Rate Limiting

- **Kernel-Level Multi-Tenancy**: All student tables enforce PostgreSQL Row Level Security (`RLS`) using `auth.uid()` checks.
- **Ownership Verification**: Backend middleware (`ownership.middleware.js`) validates token payload `sub` against URL parameter `student_id` before mutating any student record.
- **Intelligent Rate Limiting**:
  - Global API: `150 requests / minute / IP`
  - AI Generation: `10 requests / minute / IP` with client `Retry-After` response headers.
- **Zero-Secret Client Exposure**: All Google Gemini API keys and Supabase Service Role keys reside exclusively on the Express backend server.

---

## ❓ Troubleshooting Guide

| Issue | Root Cause | Resolution |
|---|---|---|
| `Port 5000 in use` | Lingering Node process | Run: `netstat -ano \| findstr :5000` and terminate the PID via `taskkill /F /PID <pid>`. |
| `Gemini 429 Rate Limit` | Exceeded free-tier quota | The backend automatically activates the heuristic question generator in <1s. No action required. |
| `401 Unauthorized on API` | Missing or expired JWT token | Sign in via `/api/auth/login` to receive a fresh Bearer token. |
| `Resource CORS Error` | Frontend origin mismatch | Ensure `CLIENT_URL` in `backend/.env` matches your Vite dev server port (default: `http://localhost:5173`). |

---

<div align="center">

**MERIDIAN LEARNING ORBIT**  
*Engineered with precision for university students.*

</div>
