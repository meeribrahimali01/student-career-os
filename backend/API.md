# CareerOS REST API Documentation

## Overview

CareerOS provides a REST API built on Express and Supabase PostgreSQL. This document outlines the endpoints, request/response formats, authentication, and error handling.

- **Base URL**: `http://localhost:5000/api`
- **Default Content-Type**: `application/json`
- **Multipart Content-Type**: `multipart/form-data` (for resume file uploads)

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

### 📊 Dashboard (Protected - Student Ownership)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/:studentId` | Aggregated dashboard overview (profile, academics, skills, roadmap, upcoming events, applications, resumes, communication) |

**Sample Response**:
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "c1f1c6a2-4a5e-49fb-8bb9-d6527fa1bf8b",
      "full_name": "Jane Doe",
      "college": "Tech University",
      "branch": "Computer Science",
      "semester": 6,
      "placement_status": "seeking"
    },
    "career_summary": {
      "readiness_score": 85,
      "metrics": { ... }
    },
    "academics": { "current_cgpa": "8.75", "recent_semesters": [] },
    "skills": { "total": 8, "verified_count": 5 },
    "roadmap": { "active_roadmap": { "title": "Full Stack Engineer", "completed_items": 4, "total_items": 10 } },
    "events": [],
    "placements": { "total_applications": 2 },
    "resume": { "total_resumes": 1 },
    "communication": { "total_sessions": 3 }
  }
}
```

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

**Sample Upload (`multipart/form-data`)**:
- Field `resume`: `[PDF / DOC / DOCX File]` (Max 5MB)
- Field `is_primary`: `true`
- Field `resume_title`: `Software_Engineer_Resume_2026.pdf`

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
