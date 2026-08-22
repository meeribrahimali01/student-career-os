# CareerOS REST API Documentation

## Overview

CareerOS provides a REST API built on Express and Supabase PostgreSQL. This document outlines the endpoints, request/response formats, authentication, and error handling.

- **Base URL**: `http://localhost:5000/api`
- **Default Content-Type**: `application/json`
- **Multipart Content-Type**: `multipart/form-data` (for resume file uploads and AI resume parsing)

---

## 1. Authentication & Security

CareerOS uses **Supabase Authentication**. Clients obtain a JWT access token upon signing in through Supabase Auth and pass it in the `Authorization` header for protected endpoints:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

### Authorization & Roles
- **`student`**: Can read and modify only their own data (enforced by backend ownership checks).
- **`admin` / `placement_officer` / `faculty`**: Can manage public events, placement opportunities, study resources, and view cross-student data where authorized.

---

## 2. Standard Response Format

### Success (`200 OK`)
```json
{
  "success": true,
  "data": { ... }
}
```

### Creation (`201 Created`)
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": { ... }
}
```

### Validation Error (`400 Bad Request`)
```json
{
  "success": false,
  "message": "Missing required fields: semester, academic_year"
}
```

### Unauthorized (`401 Unauthorized`)
```json
{
  "success": false,
  "message": "Authentication required: Missing or invalid Authorization header"
}
```

### Forbidden (`403 Forbidden`)
```json
{
  "success": false,
  "message": "Forbidden: You do not have permission to access or modify this student's data"
}
```

### Rate Limited (`429 Too Many Requests`)
```json
{
  "success": false,
  "message": "AI request limit exceeded. Please wait a moment before initiating more AI analyses."
}
```

### Conflict (`409 Conflict`)
```json
{
  "success": false,
  "message": "A record with these unique details already exists."
}
```

---

## 3. Endpoints Directory

### 🏥 Health Checks (Public)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status health check |
| `GET` | `/api/health/supabase` | Supabase database connection health check |

---

### 🤖 AI Intelligence Layer (Protected - Gemini Powered)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/resume/parse` | Parse uploaded resume or stored resume into structured JSON |
| `POST` | `/api/ai/skill-gap` | Analyze student's skill gaps against a target role & persist to `skill_gap_analysis` |
| `POST` | `/api/ai/interview/generate` | Generate customized role-specific mock interview questions |
| `POST` | `/api/ai/interview/evaluate` | Evaluate student's interview response & log to `communication_sessions` |

#### 1. AI Resume Parser (`POST /api/ai/resume/parse`)
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data` OR `application/json`
- **Body (Multipart)**:
  - `resume`: File (`.pdf`, `.doc`, `.docx`, max 5MB)
  - `student_id`: `UUID` (optional, verifies ownership)
- **Body (JSON Alternative)**:
  ```json
  {
    "resume_id": "97e68222-1db1-4c60-8f24-2c67cf75cfd5",
    "student_id": "c1f1c6a2-4a5e-49fb-8bb9-d6527fa1bf8b"
  }
  ```
- **Sample Output**:
  ```json
  {
    "success": true,
    "data": {
      "resume_id": "97e68222-1db1-4c60-8f24-2c67cf75cfd5",
      "parsed": {
        "profile": {
          "full_name": "Jane Doe",
          "email": "jane@example.com",
          "summary": "Full stack engineer with React and Node.js expertise..."
        },
        "education": [{ "degree": "B.Tech CS", "institution": "Tech University", "graduation_year": 2026 }],
        "skills": [{ "name": "Node.js", "category": "programming", "proficiency": "advanced" }],
        "experience": [],
        "projects": [{ "title": "CareerOS", "technologies_used": ["Express", "PostgreSQL", "React"] }]
      }
    }
  }
  ```

#### 2. AI Skill Gap Analyzer (`POST /api/ai/skill-gap`)
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
  ```json
  {
    "student_id": "c1f1c6a2-4a5e-49fb-8bb9-d6527fa1bf8b",
    "target_role": "Full Stack Developer",
    "resume_id": "97e68222-1db1-4c60-8f24-2c67cf75cfd5"
  }
  ```
- **Sample Output**:
  ```json
  {
    "success": true,
    "message": "Skill gap analysis completed and saved successfully",
    "data": {
      "analysis_id": "4e7235a9-46f3-4217-91c6-f7fcfb0fbfcb",
      "target_role": "Full Stack Developer",
      "match_score": 78.5,
      "priority": "high",
      "identified_skills": [{ "name": "JavaScript", "category": "programming", "proficiency": "advanced" }],
      "missing_skills": [{ "name": "Docker", "category": "technical", "importance": "high", "reason": "Needed for containerized deployment" }],
      "recommended_skills": [{ "name": "Redis", "priority": "medium", "suggested_timeframe": "2 weeks" }],
      "strengths": ["Strong backend foundations", "Good project track record"],
      "skill_gaps": ["Lacks containerization and caching experience"],
      "recommendations": "Focus on building a microservices project utilizing Docker and Redis...",
      "roadmap_suggestions": [{ "step": 1, "title": "Learn Docker Basics", "target_weeks": 2 }]
    }
  }
  ```

#### 3. AI Mock Interview Generator (`POST /api/ai/interview/generate`)
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
  ```json
  {
    "student_id": "c1f1c6a2-4a5e-49fb-8bb9-d6527fa1bf8b",
    "target_role": "Backend Engineer",
    "interview_type": "technical",
    "difficulty": "intermediate",
    "question_count": 5
  }
  ```
- **Sample Output**:
  ```json
  {
    "success": true,
    "data": {
      "role": "Backend Engineer",
      "interview_type": "technical",
      "difficulty": "intermediate",
      "total_questions": 5,
      "questions": [
        {
          "id": 1,
          "question": "How do indexing strategies in PostgreSQL affect query performance and write overhead?",
          "category": "Databases",
          "difficulty": "intermediate",
          "rationale": "Evaluates database design and optimization comprehension",
          "key_points_to_cover": ["B-tree vs GIN", "Write overhead during insert/updates", "Index selectivity"],
          "sample_answer_outline": "Explain that indexes speed up reads by creating search trees, but incur write overhead on DML operations."
        }
      ]
    }
  }
  ```

#### 4. AI Interview Answer Evaluator (`POST /api/ai/interview/evaluate`)
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body**:
  ```json
  {
    "student_id": "c1f1c6a2-4a5e-49fb-8bb9-d6527fa1bf8b",
    "question": "Explain how indexes work in relational databases.",
    "answer": "Indexes are data structures like B-Trees that allow fast data retrieval without full table scans.",
    "target_role": "Backend Developer",
    "interview_type": "technical",
    "save_session": true
  }
  ```
- **Sample Output**:
  ```json
  {
    "success": true,
    "data": {
      "session_id": "9bc12123-5e2a-4db1-8669-e09214777412",
      "score": 88.0,
      "verdict": "Strong",
      "feedback": {
        "strengths": ["Accurately identified B-Tree structure", "Good conceptual clarity"],
        "improvements": ["Could mention trade-offs with write operations"],
        "clarity_score": 90,
        "technical_accuracy_score": 88,
        "communication_score": 86,
        "ideal_response_summary": "Mention B-Tree structure, fast lookups, and trade-off on inserts/updates."
      }
    }
  }
  ```

---

### 📊 Dashboard (Protected - Student Ownership)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/:studentId` | Aggregated dashboard overview (profile, academics, skills, roadmap, upcoming events, applications, resumes, communication) |

---

### 🎓 Student Profile & Skills (Protected - Student Ownership)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students/:id` | Get student details and linked profile |
| `PUT` | `/api/students/:id` | Update student profile attributes |
| `GET` | `/api/students/:studentId/skills` | List skills mapped to student |
| `POST` | `/api/students/:studentId/skills` | Map skill to student (prevents duplicates) |
| `PUT` | `/api/students/:studentId/skills/:skillId` | Update skill proficiency level |
| `DELETE`| `/api/students/:studentId/skills/:skillId` | Remove skill mapping |

---

### 📚 Academic Records (Protected - Student Ownership)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/academics/:studentId` | Get semester academic history |
| `POST` | `/api/academics/:studentId` | Create semester academic record |
| `PUT` | `/api/academics/:recordId` | Update academic record |
| `DELETE`| `/api/academics/:recordId` | Delete academic record |

---

### 💡 Master Skills Catalog (Public Read)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/skills` | List skills catalog (optional `?category=programming`) |
| `GET` | `/api/skills/:id` | Get single skill details |

---

### 🗺️ Career Roadmaps (Protected - Student Ownership)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/roadmaps/:studentId` | List student career roadmaps |
| `POST` | `/api/roadmaps/:studentId` | Create new career roadmap |
| `GET` | `/api/roadmaps/detail/:roadmapId`| Get roadmap with milestones |
| `PUT` | `/api/roadmaps/:roadmapId` | Update roadmap metadata |
| `DELETE`| `/api/roadmaps/:roadmapId` | Delete roadmap |
| `GET` | `/api/roadmaps/:roadmapId/items` | List milestone items |
| `POST` | `/api/roadmaps/:roadmapId/items` | Add milestone to roadmap |
| `PUT` | `/api/roadmap-items/:itemId` | Update milestone item |
| `DELETE`| `/api/roadmap-items/:itemId` | Delete milestone item |

---

### 📄 Resumes & Storage (Protected - Student Ownership)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resumes/:studentId/upload` | Upload resume file (`multipart/form-data`, field: `resume`) to Supabase Storage & track metadata |
| `GET` | `/api/resumes/:studentId` | List uploaded resume records |
| `GET` | `/api/resumes/detail/:resumeId` | Get resume details & signed storage URL |
| `PUT` | `/api/resumes/:resumeId` | Update resume title/primary status |
| `DELETE`| `/api/resumes/:resumeId` | Delete resume metadata & Supabase Storage object |

---

### 💼 Placement Opportunities & Applications
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/placements` | Public | List active placement opportunities |
| `GET` | `/api/placements/:id` | Public | Get placement opportunity details |
| `POST` | `/api/placements` | Admin/Officer | Create placement opportunity |
| `PUT` | `/api/placements/:id` | Admin/Officer | Update placement opportunity |
| `DELETE`| `/api/placements/:id` | Admin/Officer | Delete placement opportunity |
| `GET` | `/api/placements/applications/:studentId` | Protected | List student placement applications |
| `POST` | `/api/placements/:placementId/apply` | Protected | Apply for opportunity (prevents duplicates) |
| `PUT` | `/api/placements/applications/:applicationId`| Protected | Update application status |

---

### 📅 College Events & Registrations
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/events` | Public | List upcoming events |
| `GET` | `/api/events/:id` | Public | Get event details |
| `POST` | `/api/events` | Admin/Faculty | Create college event |
| `PUT` | `/api/events/:id` | Admin/Faculty | Update event |
| `DELETE`| `/api/events/:id` | Admin/Faculty | Delete event |
| `GET` | `/api/events/:eventId/registrations` | Protected | List event registrations |
| `POST` | `/api/events/:eventId/register` | Protected | Register student for event |
| `DELETE`| `/api/events/:eventId/register/:studentId` | Protected | Cancel event registration |

---

### 📖 Study Resources
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/resources` | Public | List study resources (`?category=&type=&difficulty=`) |
| `GET` | `/api/resources/:id` | Public | Get resource details |
| `POST` | `/api/resources` | Admin/Faculty | Create study resource |
| `PUT` | `/api/resources/:id` | Admin/Faculty | Update study resource |
| `DELETE`| `/api/resources/:id` | Admin/Faculty | Delete study resource |

---

### 🎙️ Communication Practice (Protected - Student Ownership)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/communication/:studentId/sessions` | List communication practice logs |
| `POST` | `/api/communication/:studentId/sessions` | Create practice session record |
| `GET` | `/api/communication/sessions/:sessionId` | Get practice session details |
