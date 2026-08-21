# CareerOS Database Foundation & Architecture

This document describes the database schema, entity relationships, security model, and architectural decisions for the CareerOS platform.

---

## 1. Architectural Overview

CareerOS leverages **Supabase PostgreSQL** as its primary relational database and **Supabase Auth** for identity management.

### Identity Flow
```
Supabase Auth (auth.users)
        ↓
    profiles (public.profiles)
        ↓
    students (public.students)
        ↓
Feature Modules (academic, skills, roadmaps, placement, resumes, events, communication)
```

- **Authentication**: All authentication credentials (passwords, OAuth tokens, email verification) are securely handled by Supabase Auth (`auth.users`).
- **No Password Duplication**: The database never stores passwords or raw authentication secrets.
- **Service Role**: Backend operations using the Supabase Service Role key run server-side only and are never exposed to clients.

---

## 2. Table Catalog (15 Core Tables)

| # | Table Name | Purpose | Primary Key | Foreign Keys / References |
|---|---|---|---|---|
| 1 | `profiles` | Base user profiles (synced with Supabase Auth) | `id` (UUID) | `auth.users(id)` (ON DELETE CASCADE) |
| 2 | `students` | Student-specific attributes & academic profile | `id` (UUID) | `profiles(id)` (ON DELETE CASCADE, UNIQUE) |
| 3 | `academic_records` | Historical semester-by-semester academic data | `id` (UUID) | `students(id)` (ON DELETE CASCADE) |
| 4 | `skills` | Master catalog of categorized skills | `id` (UUID) | None (Master Catalog) |
| 5 | `student_skills` | Junction table for student proficiencies | `id` (UUID) | `students(id)`, `skills(id)` (CASCADE) |
| 6 | `roadmaps` | Student personalized career roadmaps | `id` (UUID) | `students(id)` (ON DELETE CASCADE) |
| 7 | `roadmap_items` | Individual milestones & tasks in a roadmap | `id` (UUID) | `roadmaps(id)` (ON DELETE CASCADE) |
| 8 | `study_resources` | Curated articles, courses, videos, and books | `id` (UUID) | `profiles(id)` (`created_by`, SET NULL) |
| 9 | `events` | College drives, hackathons, seminars, workshops | `id` (UUID) | None |
| 10 | `event_registrations` | Student event registration & attendance junction | `id` (UUID) | `students(id)`, `events(id)` (CASCADE) |
| 11 | `placement_opportunities` | Job and internship listings | `id` (UUID) | None |
| 12 | `placement_applications` | Student job application tracking lifecycle | `id` (UUID) | `students(id)`, `placement_opportunities(id)` |
| 13 | `resumes` | Resume versions and metadata (Supabase Storage) | `id` (UUID) | `students(id)` (ON DELETE CASCADE) |
| 14 | `skill_gap_analysis` | AI-driven skill gap & career readiness analyses | `id` (UUID) | `students(id)`, `resumes(id)` (SET NULL) |
| 15 | `communication_sessions` | Mock interview & verbal practice session logs | `id` (UUID) | `students(id)` (ON DELETE CASCADE) |

---

## 3. Relational Design & Constraints

- **Primary Keys**: UUID primary keys default to `gen_random_uuid()` (or match `auth.users.id` for `profiles`).
- **Unique Constraints**:
  - `skills.name`: Ensures skill names are unique in the master catalog.
  - `(student_id, semester)` on `academic_records`: Prevents duplicate semester records.
  - `(student_id, skill_id)` on `student_skills`: Prevents duplicate skill mappings.
  - `(student_id, event_id)` on `event_registrations`: Prevents duplicate event registrations.
  - `(student_id, opportunity_id)` on `placement_applications`: Prevents duplicate applications for the same job.
  - `students.profile_id`: Strict 1-to-1 relationship between user profile and student profile.
- **Check Constraints**:
  - CGPA and SGPA fields: Enforced between `0.00` and `10.00`.
  - Percentage: Enforced between `0.00` and `100.00`.
  - Match scores & test scores: Enforced between `0.00` and `100.00`.
  - Enum checks: Restricted to valid categories, statuses, and employment types.
- **Timestamps & Automation**:
  - `created_at` and `updated_at` on all tables.
  - PostgreSQL trigger `tr_<table_name>_updated_at` automatically updates `updated_at` on every `UPDATE` query.
  - Supabase Auth trigger `on_auth_user_created` automatically creates a corresponding `public.profiles` row upon user signup.

---

## 4. Row Level Security (RLS) Matrix

Row Level Security is enabled on **all 15 tables**:

1. **Student-Owned Data** (`profiles`, `students`, `academic_records`, `student_skills`, `roadmaps`, `roadmap_items`, `event_registrations`, `placement_applications`, `resumes`, `skill_gap_analysis`, `communication_sessions`):
   - Only accessible by the authenticated user whose `auth.uid()` matches the owner (`profile_id` or student relationship).
2. **Catalog / Public Content** (`skills`, `study_resources`, `events`, `placement_opportunities`):
   - Authenticated users can view active / published resources.
   - Insert / Update / Delete is restricted to administrative roles or the backend service role.

---

## 5. Indexes for Performance

Targeted B-tree indexes are implemented for:
- Foreign keys (`student_id`, `profile_id`, `roadmap_id`, `opportunity_id`, `event_id`, `resume_id`, `skill_id`).
- High-cardinality filters (`status`, `category`, `event_type`, `resource_type`, `placement_status`).
- Ordering & range lookups (`event_date`, `application_deadline`, `sequence_order`).

---

## 6. Storage Considerations

- Resumes and grade sheets store Supabase Storage bucket file paths (e.g. `resumes/{student_id}/{filename}`) rather than large binary blobs in PostgreSQL.
