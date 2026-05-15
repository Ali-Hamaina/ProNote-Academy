# PRONote Academy - Backend Requirements Report

## Overview
This document outlines all backend endpoints, database models, and functionality needed to support the PRONote Academy frontend application. The frontend is built with React + Vite and uses Laravel Sanctum for authentication.

---

## Tech Stack & Authentication

### Recommended Backend Stack
- **Framework**: Laravel 11 (with Sanctum for API authentication)
- **Database**: PostgreSQL/MySQL
- **Authentication**: Laravel Sanctum (Bearer Token)
- **API Style**: RESTful JSON API

### Authentication Flow
1. Get CSRF cookie: `GET /sanctum/csrf-cookie`
2. Login: `POST /api/login` → returns token + user
3. Requests include: `Authorization: Bearer {token}` header
4. On 401 response: redirect to `/login?session_expired=true`

---

## Database Models & Schema

### 1. **Users Table**
```
- id (PK)
- name (string)
- email (string, unique)
- password (string, hashed)
- role (enum: 'admin', 'formateur', 'stagiaire')
- avatar_url (nullable)
- status (enum: 'active', 'inactive')
- email_verified_at (timestamp, nullable)
- created_at / updated_at
```

### 2. **Classes Table**
```
- id (PK)
- name (string) - e.g., "Web Design & Dev 2024"
- code (string, unique) - e.g., "DEV-101"
- description (text, nullable)
- instructor_id (FK → Users)
- max_students (integer)
- status (enum: 'active', 'inactive', 'archived')
- created_at / updated_at
```

### 3. **Modules Table**
```
- id (PK)
- name (string) - e.g., "HTML5 & Semantic Web"
- class_id (FK → Classes)
- block_number (integer) - curriculum sequence
- hours (integer) - total hours
- description (text, nullable)
- instructor_id (FK → Users)
- status (enum: 'draft', 'published', 'archived')
- order (integer) - for drag-and-drop ordering
- created_at / updated_at
```

### 4. **Enrollments Table**
```
- id (PK)
- user_id (FK → Users) - the student
- class_id (FK → Classes)
- status (enum: 'active', 'completed', 'dropped')
- progress (integer, 0-100) - completion percentage
- enrolled_at (timestamp)
- completed_at (timestamp, nullable)
- created_at / updated_at
```

### 5. **Grades Table**
```
- id (PK)
- user_id (FK → Users) - the student
- module_id (FK → Modules)
- grade_value (decimal: 0-20)
- feedback (text, nullable)
- graded_by (FK → Users) - formateur who graded
- graded_at (timestamp)
- created_at / updated_at
```

### 6. **Attendance Table**
```
- id (PK)
- user_id (FK → Users)
- class_id (FK → Classes)
- session_date (date)
- status (enum: 'present', 'absent', 'excused')
- marked_by (FK → Users) - formateur who marked
- notes (text, nullable)
- created_at / updated_at
```

### 7. **Schedule/Sessions Table**
```
- id (PK)
- class_id (FK → Classes)
- module_id (FK → Modules, nullable)
- title (string)
- start_time (datetime)
- end_time (datetime)
- location (string)
- room (string, nullable)
- is_online (boolean)
- meeting_link (string, nullable)
- instructor_id (FK → Users)
- created_at / updated_at
```

### 8. **Announcements Table**
```
- id (PK)
- title (string)
- description (text)
- type (enum: 'grade', 'schedule', 'general', 'workshop')
- posted_by (FK → Users)
- class_id (FK → Classes, nullable) - if class-specific
- target_role (enum: 'all', 'admin', 'formateur', 'stagiaire')
- is_read (boolean, through pivot table)
- created_at / updated_at
```

### 9. **Resources Table**
```
- id (PK)
- title (string)
- description (text, nullable)
- type (enum: 'cheat_sheet', 'article', 'video', 'pdf', 'code')
- file_url (string, nullable)
- external_url (string, nullable)
- resource_type (string) - e.g., "Tailwind CSS v3 Guide"
- created_by (FK → Users)
- created_at / updated_at
```

### 10. **Notifications Table** (for database persistence)
```
- id (PK)
- user_id (FK → Users)
- title (string)
- message (text)
- type (enum: 'announcement', 'grade', 'schedule', 'system')
- is_read (boolean)
- read_at (timestamp, nullable)
- created_at / updated_at
```

### 11. **Tasks Table** (for formateurs)
```
- id (PK)
- user_id (FK → Users)
- title (string)
- description (text, nullable)
- status (enum: 'pending', 'completed')
- priority (enum: 'low', 'medium', 'high')
- due_date (date, nullable)
- created_at / updated_at
```

---

## API Endpoints

### Authentication Endpoints

#### POST `/api/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```
**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "formateur",
    "avatar": null
  },
  "token": "1|abc123xyz..."
}
```

#### POST `/api/logout`
**Headers:** `Authorization: Bearer {token}`
**Response:** `{ "message": "Logged out successfully" }`

#### POST `/api/forgot-password`
**Request:**
```json
{
  "email": "user@example.com"
}
```
**Response:** `{ "message": "Password reset link sent to email" }`

#### POST `/api/reset-password`
**Request:**
```json
{
  "email": "user@example.com",
  "token": "reset_token_from_email",
  "password": "new_password",
  "password_confirmation": "new_password"
}
```

#### GET `/api/user`
**Headers:** `Authorization: Bearer {token}`
**Response:** Returns authenticated user object

#### PUT `/api/user/password`
**Headers:** `Authorization: Bearer {token}`
**Request:**
```json
{
  "current_password": "old_pass",
  "password": "new_pass",
  "password_confirmation": "new_pass"
}
```

---

### User Management Endpoints (Admin Only)

#### GET `/api/users`
**Query Params:** `role=formateur&status=active&page=1&per_page=10`
**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Jean Dupont",
      "email": "jean@example.com",
      "role": "formateur",
      "department": "Web Dev 101",
      "status": "active",
      "avatar": null
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "per_page": 10,
    "last_page": 10
  }
}
```

#### GET `/api/users/{id}`
**Response:** Single user object with detailed info

#### POST `/api/users`
**Request:**
```json
{
  "first_name": "Jean",
  "last_name": "Dupont",
  "email": "jean@example.com",
  "role": "formateur",
  "class_id": 1
}
```
**Response:** Created user object + temporary password

#### PUT `/api/users/{id}`
**Request:** Any user fields to update
**Response:** Updated user object

#### DELETE `/api/users/{id}`
**Response:** `{ "message": "User deleted" }`

---

### Admin Dashboard Endpoints

#### GET `/api/admin/statistics`
**Response:**
```json
{
  "total_students": 1240,
  "total_formateurs": 86,
  "active_classes": 42,
  "avg_performance": 84,
  "total_students_change": "+5.2%",
  "total_formateurs_change": "+2.1%",
  "active_classes_change": "-1.4%",
  "avg_performance_change": "+3.8%"
}
```

#### GET `/api/admin/enrollment-trends`
**Query Params:** `period=6months` (6months, 1year)
**Response:**
```json
{
  "total": 15420,
  "change_percent": 12,
  "monthly_data": [
    {"month": "Jan", "count": 1200},
    {"month": "Feb", "count": 1100},
    ...
  ]
}
```

#### GET `/api/admin/recent-activities`
**Response:**
```json
{
  "activities": [
    {
      "id": 1,
      "type": "student_registered",
      "title": "New student registered",
      "description": "Sarah Jenkins • Level 2 Web Dev",
      "timestamp": "2 mins ago"
    },
    ...
  ]
}
```

#### GET `/api/admin/classes`
**Query Params:** `page=1&per_page=10`
**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Web Design & Dev 2024",
      "formateur": "Marc Dupont",
      "student_count": 24,
      "completion_rate": 85,
      "status": "Active"
    }
  ],
  "pagination": {...}
}
```

---

### Classes & Modules Endpoints

#### GET `/api/classes`
**Query Params:** `filter=true&page=1&per_page=20`
**Response:** List of all classes with metadata

#### GET `/api/classes/{id}`
**Response:** Class details with enrolled students, modules

#### POST `/api/classes`
**Request:**
```json
{
  "name": "Advanced JavaScript",
  "code": "JS-301",
  "description": "...",
  "instructor_id": 1,
  "max_students": 30
}
```

#### PUT `/api/classes/{id}`
**Request:** Class update fields

#### DELETE `/api/classes/{id}`

#### GET `/api/classes/{id}/modules`
**Response:** All modules for a class with order preserved

#### POST `/api/classes/{id}/modules`
**Request:**
```json
{
  "name": "JavaScript ES6 Fundamentals",
  "block_number": 3,
  "hours": 50,
  "instructor_id": 1,
  "status": "draft"
}
```

#### PUT `/api/modules/{id}`
**Request:** Module update fields

#### DELETE `/api/modules/{id}`

#### POST `/api/modules/reorder`
**Request:**
```json
{
  "modules": [
    {"id": 1, "order": 1},
    {"id": 2, "order": 2}
  ]
}
```
**Purpose:** Handle drag-and-drop reordering

---

### Grades Endpoints

#### GET `/api/grades`
**Query Params:** `module_id=1&user_id=2&page=1`
**Response:** Paginated list of grades

#### GET `/api/grades/user/{user_id}`
**Response:** All grades for a specific student (with statistics)

#### GET `/api/grades/module/{module_id}`
**Response:** All grades for a specific module

#### POST `/api/grades`
**Request (Formateur only):**
```json
{
  "user_id": 1,
  "module_id": 2,
  "grade_value": 17.5,
  "feedback": "Excellent work!"
}
```

#### PUT `/api/grades/{id}`
**Request:** Update grade_value or feedback

#### GET `/api/grades/statistics`
**Response:**
```json
{
  "overall_average": 15.7,
  "highest_grade": 18,
  "lowest_grade": 12,
  "modules_graded": 5,
  "performance_trend": "improving"
}
```

---

### Attendance Endpoints

#### GET `/api/attendance`
**Query Params:** `class_id=1&date_range=month&page=1`
**Response:** Paginated attendance records

#### GET `/api/attendance/user/{user_id}`
**Response:** Attendance rate and history for student

#### POST `/api/attendance`
**Request (Formateur only):**
```json
{
  "class_id": 1,
  "session_date": "2024-10-15",
  "records": [
    {"user_id": 1, "status": "present"},
    {"user_id": 2, "status": "absent"}
  ]
}
```

#### GET `/api/attendance/class/{class_id}/rate`
**Response:**
```json
{
  "class_id": 1,
  "attendance_rate": 94,
  "total_sessions": 20,
  "attended": 19
}
```

---

### Schedule/Sessions Endpoints

#### GET `/api/schedule`
**Query Params:** `date=2024-10-15&class_id=1`
**Response:**
```json
{
  "sessions": [
    {
      "id": 1,
      "time": "09:00 AM",
      "title": "UX/UI Foundations",
      "location": "Room 302 • Group B",
      "attendance": "24/25 Present",
      "is_active": true,
      "is_online": false,
      "meeting_link": null
    },
    ...
  ]
}
```

#### GET `/api/schedule/user/{user_id}`
**Response:** Schedule filtered for specific user's classes

#### POST `/api/schedule`
**Request (Formateur/Admin):**
```json
{
  "class_id": 1,
  "module_id": 2,
  "title": "Color Theory Lab",
  "start_time": "2024-10-15 11:30:00",
  "end_time": "2024-10-15 13:00:00",
  "location": "Room 205",
  "is_online": false
}
```

#### PUT `/api/schedule/{id}`
**Request:** Update session details

#### DELETE `/api/schedule/{id}`

---

### Announcements/Notifications Endpoints

#### GET `/api/announcements`
**Query Params:** `page=1&unread=false`
**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "New Grade Posted in Math",
      "description": "The results for your midterm exam are now available...",
      "type": "grade",
      "posted_at": "2 hours ago",
      "color": "primary",
      "is_read": false
    },
    ...
  ]
}
```

#### POST `/api/announcements`
**Request (Admin/Formateur):**
```json
{
  "title": "Class Rescheduled",
  "description": "The Tuesday 10 AM session has been moved...",
  "type": "schedule",
  "class_id": 1,
  "target_role": "all"
}
```

#### PUT `/api/announcements/{id}/read`
**Response:** Mark notification as read

#### PUT `/api/announcements/mark-all-read`
**Response:** Mark all notifications as read

#### GET `/api/notifications/unread-count`
**Response:**
```json
{
  "count": 5
}
```

---

### Resources Endpoints

#### GET `/api/resources`
**Query Params:** `type=article&page=1&per_page=12`
**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Tailwind CSS v3 Guide",
      "type": "cheat_sheet",
      "file_url": "https://...",
      "external_url": null
    },
    ...
  ]
}
```

#### POST `/api/resources`
**Request (Admin/Formateur):**
```json
{
  "title": "React Patterns Guide",
  "type": "pdf",
  "file_url": "s3://bucket/file.pdf",
  "description": "..."
}
```

---

### Formateur Dashboard Endpoints

#### GET `/api/formateur/dashboard`
**Response:**
```json
{
  "active_modules": 4,
  "active_modules_change": "+2 this week",
  "ungraded_assessments": 12,
  "ungraded_change": "+2",
  "class_success_rate": 85,
  "class_success_change": "+5% vs last semester",
  "student_breakdown": {
    "passing": 142,
    "at_risk": 18,
    "failing": 7,
    "inactive": 2
  }
}
```

#### GET `/api/formateur/classes`
**Response:** Classes taught by this formateur

#### GET `/api/formateur/students`
**Query Params:** `class_id=1&page=1`
**Response:** Students in formateur's classes with performance

#### GET `/api/formateur/tasks`
**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "label": "Verify Group B labs",
      "done": false
    },
    ...
  ]
}
```

#### POST `/api/formateur/tasks`
**Request:**
```json
{
  "label": "Update Reading List",
  "priority": "high"
}
```

#### PUT `/api/formateur/tasks/{id}`
**Request:**
```json
{
  "done": true
}
```

#### DELETE `/api/formateur/tasks/{id}`

---

### Stagiaire (Student) Dashboard Endpoints

#### GET `/api/stagiaire/dashboard`
**Response:**
```json
{
  "semester_average": 16.5,
  "attendance_rate": 94,
  "attendance_change": "+2%",
  "modules_completed": 12,
  "modules_total": 16,
  "modules": [
    {
      "name": "Advanced Web Design (UI/UX)",
      "progress": 85
    },
    ...
  ],
  "upcoming_assignment": {
    "title": "UI Prototype Submission",
    "due_in_days": 2
  },
  "latest_grade": {
    "module": "Project Architecture Quiz",
    "grade": 18,
    "max": 20,
    "status": "Excellent"
  }
}
```

#### GET `/api/stagiaire/grades`
**Response:** All grades for authenticated student

#### GET `/api/stagiaire/attendance`
**Response:** Attendance record and rate for student

#### GET `/api/stagiaire/modules`
**Response:** Enrolled modules with progress

#### GET `/api/stagiaire/announcements`
**Response:** Announcements relevant to student

---

### Enrollment Endpoints

#### GET `/api/enrollments`
**Query Params:** `class_id=1&user_id=1`
**Response:** Enrollment records

#### POST `/api/enrollments`
**Request (Admin only):**
```json
{
  "user_id": 1,
  "class_id": 2
}
```

#### PUT `/api/enrollments/{id}`
**Request:**
```json
{
  "status": "completed",
  "progress": 100
}
```

#### DELETE `/api/enrollments/{id}`

---

### Profile Endpoints

#### GET `/api/profile`
**Response:** Current user's full profile

#### PUT `/api/profile`
**Request:**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "avatar": "data:image/jpeg;base64,..."
}
```

#### POST `/api/profile/avatar`
**Request:** multipart/form-data with `avatar` file
**Response:** Updated avatar URL

---

## Business Logic & Features

### 1. **Authentication & Authorization**
- [ ] Register endpoint (optional public registration)
- [ ] Role-based access control (Admin, Formateur, Stagiaire)
- [ ] Sanctum token management
- [ ] Password reset via email
- [ ] Email verification

### 2. **Admin Features**
- [ ] Dashboard with KPIs (student count, formateur count, class count, avg performance)
- [ ] User management (CRUD operations)
- [ ] Class management
- [ ] Module/curriculum setup with drag-and-drop support
- [ ] View system statistics and trends
- [ ] Manage announcements

### 3. **Formateur (Instructor) Features**
- [ ] View assigned classes and students
- [ ] Post grades for assignments/assessments
- [ ] Mark attendance
- [ ] Create/manage schedule and sessions
- [ ] View student performance analytics
- [ ] Post announcements
- [ ] Manage tasks/to-do list
- [ ] Upload course materials
- [ ] Generate performance reports

### 4. **Stagiaire (Student) Features**
- [ ] View enrolled classes and modules
- [ ] View grades and performance history
- [ ] Check attendance record
- [ ] View schedule and upcoming classes
- [ ] Receive announcements and notifications
- [ ] Access course resources
- [ ] View progress on modules

### 5. **General Features**
- [ ] Real-time notifications (optional: WebSockets)
- [ ] Activity logging
- [ ] Email notifications
- [ ] Export functionality (CSV, PDF)
- [ ] Dark mode support (theme preference in DB)
- [ ] Search functionality

---

## Data Validation Rules

### User Registration
- Email: unique, valid format
- Password: min 8 chars, must contain uppercase, lowercase, number
- Name: required, 2-100 chars
- Role: must be one of (admin, formateur, stagiaire)

### Grade Submission
- Grade value: 0-20
- Must be submitted by assigned formateur
- Can be edited within 7 days (configurable)

### Class Creation
- Name: required, unique
- Code: required, unique
- Max students: 1-500
- Instructor: must be a Formateur user

### Schedule
- Start time must be before end time
- No overlapping sessions in same room
- Sufficient notice for rescheduling

---

## Response Formats

### Success Response (200/201)
```json
{
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response (400/422)
```json
{
  "error": "Validation failed",
  "errors": {
    "email": ["Email already exists"],
    "grade": ["Grade must be between 0 and 20"]
  }
}
```

### Unauthorized (401)
```json
{
  "error": "Unauthorized",
  "message": "Token expired or invalid"
}
```

### Forbidden (403)
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

---

## Caching & Performance Optimization

- [ ] Cache dashboard statistics (1 hour)
- [ ] Cache class/module list (15 minutes)
- [ ] Cache user role permissions
- [ ] Implement pagination (default 15 items/page)
- [ ] Add query optimization with eager loading

---

## Security Considerations

- [ ] All endpoints behind authentication (except /login, /forgot-password, /reset-password)
- [ ] CORS configured for frontend domain
- [ ] CSRF protection via Sanctum
- [ ] Rate limiting on auth endpoints
- [ ] Password hashing (bcrypt)
- [ ] Input sanitization
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention

---

## Summary Table

| Feature | Endpoints Count | Models | Priority |
|---------|-----------------|---------|----------|
| Authentication | 6 | 1 (Users) | CRITICAL |
| Admin Management | 8 | 2 (Users, temp) | HIGH |
| Classes & Modules | 8 | 2 | HIGH |
| Grades | 6 | 1 | HIGH |
| Attendance | 4 | 1 | HIGH |
| Schedule | 5 | 1 | MEDIUM |
| Announcements | 5 | 1 | MEDIUM |
| Resources | 2 | 1 | MEDIUM |
| Formateur Dashboard | 5 | 1 (Tasks) | MEDIUM |
| Stagiaire Dashboard | 5 | - | MEDIUM |
| Profile | 3 | - | LOW |

**Total Database Models: 11**
**Total API Endpoints: ~60+**

---

## Next Steps

1. **Phase 1**: Setup database and implement auth (Users, Sanctum)
2. **Phase 2**: Implement core CRUD (Classes, Modules, Enrollments)
3. **Phase 3**: Add business logic (Grades, Attendance, Schedule)
4. **Phase 4**: Admin & Dashboard features
5. **Phase 5**: Notifications & Announcements
6. **Phase 6**: Testing & Optimization

