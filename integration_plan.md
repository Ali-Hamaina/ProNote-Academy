# ProNote Academy — Frontend ↔ Backend Integration Plan

## Project Status Summary

| Layer | Status |
|-------|--------|
| **Backend** (Laravel) | ✅ 95% complete — 13 controllers, 60+ API endpoints, 17 validation requests, 5 services |
| **Frontend** (React/Vite) | ⚠️ ~40% — UI shells exist but ALL use **hardcoded mock data**, no real API calls |
| **Integration** | ❌ 0% — `AuthContext` uses mock login, every page has inline static arrays |

---

## Current Frontend Audit

### ✅ Infrastructure Ready (no changes needed)
- [api.js](file:///c:/xampp/htdocs/ProNote-Academy/frontEnd/src/services/api.js) — Axios instance with Bearer token interceptor
- [authService.js](file:///c:/xampp/htdocs/ProNote-Academy/frontEnd/src/services/authService.js) — Login/logout/password API calls
- [ProtectedRoute.jsx](file:///c:/xampp/htdocs/ProNote-Academy/frontEnd/src/routes/ProtectedRoute.jsx) — Role guard
- React Query (`@tanstack/react-query`) already installed but **unused**

### ⚠️ Pages Using Mock Data (need integration)

| Page | File | Mock Data |
|------|------|-----------|
| **Login** | `pages/auth/Login.jsx` | Uses `AuthContext.login()` which sets a fake user object |
| **ForgotPassword** | `pages/auth/ForgotPassword.jsx` | `setTimeout` simulates API |
| **ResetPassword** | `pages/auth/ResetPassword.jsx` | `setTimeout` simulates API |
| **Admin Dashboard** | `pages/admin/Dashboard.jsx` | Hardcoded stats, activities, classes arrays |
| **User Management** | `pages/admin/UserManagement.jsx` | Hardcoded 5-user array, no CRUD wired |
| **Academic Setup** | `pages/admin/AcademicSetup.jsx` | Hardcoded classes & modules arrays |
| **Formateur Dashboard** | `pages/formateur/Dashboard.jsx` | Hardcoded schedule, tasks, stats |
| **Stagiaire Dashboard** | `pages/stagiaire/Dashboard.jsx` | Hardcoded KPIs, modules, announcements |
| **My Grades** | `pages/stagiaire/MyGrades.jsx` | Hardcoded 5-grade array |
| **Profile** | `pages/Profile.jsx` | No API save, reads from `AuthContext` only |
| **Notifications** | `pages/Notifications.jsx` | Hardcoded 5-notification array |

### ❌ Missing Pages (backend endpoints exist, no frontend page)

| Missing Page | Backend Endpoints | Needed For |
|-------------|-------------------|------------|
| **Formateur Grades** | `POST/PUT /grades`, `GET /grades/module/{id}` | Grade entry & editing |
| **Formateur Attendance** | `POST /attendance`, `GET /attendance/class/{id}/rate` | Mark & view attendance |
| **Formateur Schedule** | `CRUD /schedule` | Session management |
| **Formateur Students** | `GET /formateur/students` | Student list |
| **Stagiaire Attendance** | `GET /stagiaire/attendance` | View own attendance |
| **Stagiaire Resources** | `GET /resources` | Download resources |
| **Admin Enrollments** | `CRUD /enrollments` | Manage enrollments |
| **Admin Announcements** | `POST/PUT/DELETE /announcements` | Create announcements |

---

## Phase 1 — Foundation (Services + Auth)

> **Goal:** Real authentication, API service layer, React Query setup

### Task 1.1 — Fix AuthContext for real Sanctum login
- Replace mock `login()` in [AuthContext.jsx](file:///c:/xampp/htdocs/ProNote-Academy/frontEnd/src/context/AuthContext.jsx) with `authService.login()`
- Store real token from `response.data.token`
- On mount, call `GET /user` to validate stored token
- Wire `logout()` to `authService.logout()`

### Task 1.2 — Setup React Query Provider
- Wrap app in `QueryClientProvider` in [main.jsx](file:///c:/xampp/htdocs/ProNote-Academy/frontEnd/src/main.jsx)
- Configure default staleTime, retry, error handling

### Task 1.3 — Create API Service Files
Create these files in `src/services/`:

| Service File | Methods | Backend Endpoints |
|-------------|---------|-------------------|
| `userService.js` | `getAll`, `create`, `update`, `delete` | `CRUD /users` |
| `classService.js` | `getAll`, `create`, `update`, `delete`, `getModules` | `CRUD /classes` |
| `moduleService.js` | `getAll`, `create`, `update`, `delete`, `reorder` | `CRUD /modules` |
| `gradeService.js` | `getAll`, `create`, `update`, `getStudentGrades`, `getStats` | Grade endpoints |
| `attendanceService.js` | `mark`, `getAll`, `getClassRate`, `getStudentAttendance` | Attendance endpoints |
| `sessionService.js` | `getAll`, `create`, `update`, `delete`, `getUserSchedule` | `CRUD /schedule` |
| `enrollmentService.js` | `getAll`, `create`, `update`, `delete` | `CRUD /enrollments` |
| `announcementService.js` | `getAll`, `create`, `update`, `delete`, `markRead` | Announcement endpoints |
| `notificationService.js` | `getUnreadCount` | `GET /notifications/unread-count` |
| `dashboardService.js` | `getAdminStats`, `getFormateurDashboard`, `getStudentDashboard` | Dashboard endpoints |
| `resourceService.js` | `getAll`, `getOne`, `upload` | Resource endpoints |
| `profileService.js` | `get`, `update`, `uploadAvatar`, `changePassword` | Profile endpoints |

### Task 1.4 — Create Custom Hooks
Create `src/hooks/` directory with reusable hooks:

```
useUsers.js        → useQuery + useMutation wrapping userService
useClasses.js      → useQuery + useMutation wrapping classService
useGrades.js       → useQuery + useMutation wrapping gradeService
useAttendance.js   → useQuery + useMutation wrapping attendanceService
useDashboard.js    → useQuery wrapping dashboardService
useNotifications.js → useQuery wrapping notificationService
```

---

## Phase 2 — Auth Pages Integration

### Task 2.1 — Login Page
- Remove `demoRole` selector (was for testing only)
- Call `authService.login(email, password)`
- Parse role from API response, redirect accordingly
- Handle validation errors from backend (422)

### Task 2.2 — Forgot Password
- Replace `setTimeout` with `authService.forgotPassword(email)`
- Show real success/error messages

### Task 2.3 — Reset Password
- Wire to `authService.resetPassword(token, email, password, confirmation)`
- Read token from URL params

---

## Phase 3 — Admin Pages Integration

### Task 3.1 — Admin Dashboard
**File:** `pages/admin/Dashboard.jsx`

| Section | Current | Replace With |
|---------|---------|-------------|
| Stats cards | Hardcoded array | `GET /admin/statistics` |
| Enrollment chart | Static bars | `GET /admin/enrollment-trends` |
| Recent activities | Hardcoded array | `GET /admin/recent-activities` |
| Class table | Hardcoded 3 rows | `GET /admin/classes` |

### Task 3.2 — User Management
**File:** `pages/admin/UserManagement.jsx`

- Fetch users: `GET /users` with filters (role, status) & pagination
- Create user modal: `POST /users` with form validation
- Edit user: `PUT /users/{id}` (add edit modal)
- Delete user: `DELETE /users/{id}` with confirmation dialog
- Wire filter dropdowns to API query params
- Wire pagination to API `page` param

### Task 3.3 — Academic Setup (Classes + Modules)
**File:** `pages/admin/AcademicSetup.jsx`

- Left pane: Fetch classes from `GET /classes`
- Right pane: Fetch modules from `GET /classes/{id}/modules`
- Create class: `POST /classes`
- Create/assign module: `POST /modules`
- Edit/delete: wire to `PUT/DELETE` endpoints
- Drag reorder: `POST /modules/reorder`

### Task 3.4 — New: Enrollment Management Page
**Create:** `pages/admin/Enrollments.jsx`

- Table of all enrollments from `GET /enrollments`
- Enroll student form: `POST /enrollments`
- Update/remove enrollment: `PUT/DELETE /enrollments/{id}`
- Add route in App.jsx: `/admin/enrollments`

### Task 3.5 — New: Announcement Management Page
**Create:** `pages/admin/Announcements.jsx`

- List from `GET /announcements`
- Create form: `POST /announcements`
- Edit/delete: `PUT/DELETE /announcements/{id}`
- Add route: `/admin/announcements`

---

## Phase 4 — Formateur Pages Integration

### Task 4.1 — Formateur Dashboard
**File:** `pages/formateur/Dashboard.jsx`

| Section | Replace With |
|---------|-------------|
| Stats (Active Modules, Ungraded) | `GET /formateur/dashboard` |
| Class Success Rate | `GET /formateur/dashboard` |
| Daily Schedule | `GET /schedule` (today filter) |
| Quick Tasks | `GET /formateur/tasks` |

### Task 4.2 — New: Grade Management Page
**Create:** `pages/formateur/Grades.jsx`

- Select class → `GET /formateur/classes`
- View grades by module → `GET /grades/module/{id}`
- Enter grade → `POST /grades`
- Update grade → `PUT /grades/{id}`
- Ungraded count → `GET /grades/ungraded`
- Add route: `/formateur/grades`

### Task 4.3 — New: Attendance Page
**Create:** `pages/formateur/Attendance.jsx`

- Select class → `GET /formateur/classes`
- Mark attendance → `POST /attendance`
- View history → `GET /attendance`
- Class rate chart → `GET /attendance/class/{id}/rate`
- Add route: `/formateur/attendance`

### Task 4.4 — New: Schedule Management Page
**Create:** `pages/formateur/Schedule.jsx`

- Week/day view → `GET /schedule`
- Create session → `POST /schedule`
- Edit session → `PUT /schedule/{id}`
- Delete session → `DELETE /schedule/{id}`
- Add route: `/formateur/schedule`

### Task 4.5 — New: Students Page
**Create:** `pages/formateur/Students.jsx`

- Student list → `GET /formateur/students`
- View per-student grades/attendance
- Add route: `/formateur/students`

---

## Phase 5 — Stagiaire Pages Integration

### Task 5.1 — Stagiaire Dashboard
**File:** `pages/stagiaire/Dashboard.jsx`

| Section | Replace With |
|---------|-------------|
| KPIs (Average, Attendance) | `GET /stagiaire/dashboard` |
| Module progress bars | `GET /stagiaire/modules` |
| Upcoming assignment | `GET /stagiaire/dashboard` |
| Latest grade | `GET /stagiaire/dashboard` |
| Announcements | `GET /announcements` |

### Task 5.2 — My Grades
**File:** `pages/stagiaire/MyGrades.jsx`

- Fetch grades: `GET /stagiaire/grades`
- Statistics: `GET /grades/statistics`
- Calculate summary cards from API response

### Task 5.3 — New: My Attendance Page
**Create:** `pages/stagiaire/MyAttendance.jsx`

- Attendance records → `GET /stagiaire/attendance`
- Calendar/list view of attendance history
- Add route: `/stagiaire/attendance`

### Task 5.4 — New: Resources Page
**Create:** `pages/stagiaire/Resources.jsx`

- Resource list → `GET /resources`
- View/download → `GET /resources/{id}`
- Add route: `/stagiaire/resources`

---

## Phase 6 — Shared Pages + Polish

### Task 6.1 — Profile Page
- Fetch profile: `GET /profile`
- Save profile: `PUT /profile`
- Avatar upload: `POST /profile/avatar`
- Change password: `PUT /user/password` (add modal)

### Task 6.2 — Notifications Page
- Fetch: `GET /announcements`
- Mark read: `PUT /announcements/{id}/read`
- Mark all read: `PUT /announcements/mark-all-read`
- Unread badge in Navbar: `GET /notifications/unread-count` (polling or interval)

### Task 6.3 — Update Sidebar Navigation
Add missing nav items for new pages in [Sidebar.jsx](file:///c:/xampp/htdocs/ProNote-Academy/frontEnd/src/components/layout/Sidebar.jsx):

| Role | Add Nav Items |
|------|--------------|
| Admin | Enrollments, Announcements |
| Formateur | Grades, Attendance, Schedule, Students |
| Stagiaire | Attendance, Resources |

### Task 6.4 — Update App.jsx Routes
Add all new page routes to [App.jsx](file:///c:/xampp/htdocs/ProNote-Academy/frontEnd/src/App.jsx).

### Task 6.5 — Global Error & Loading States
- Add `<ErrorBoundary>` wrapper
- Create `LoadingSpinner` component
- Create `EmptyState` component for zero-data scenarios
- Toast notifications for success/error feedback

---

## Execution Order & Estimates

| Phase | Tasks | Est. Time | Priority |
|-------|-------|-----------|----------|
| **Phase 1** — Foundation | 1.1–1.4 | 3-4 hours | 🔴 Critical |
| **Phase 2** — Auth | 2.1–2.3 | 1-2 hours | 🔴 Critical |
| **Phase 3** — Admin | 3.1–3.5 | 4-5 hours | 🟡 High |
| **Phase 4** — Formateur | 4.1–4.5 | 5-6 hours | 🟡 High |
| **Phase 5** — Stagiaire | 5.1–5.4 | 3-4 hours | 🟡 High |
| **Phase 6** — Shared/Polish | 6.1–6.5 | 3-4 hours | 🟢 Medium |
| **Total** | **24 tasks** | **~20-25 hrs** | |

---

## Files to Create (Summary)

```
frontEnd/src/
├── services/           (12 new service files)
│   ├── userService.js
│   ├── classService.js
│   ├── moduleService.js
│   ├── gradeService.js
│   ├── attendanceService.js
│   ├── sessionService.js
│   ├── enrollmentService.js
│   ├── announcementService.js
│   ├── notificationService.js
│   ├── dashboardService.js
│   ├── resourceService.js
│   └── profileService.js
├── hooks/              (6 new hook files)
│   ├── useUsers.js
│   ├── useClasses.js
│   ├── useGrades.js
│   ├── useAttendance.js
│   ├── useDashboard.js
│   └── useNotifications.js
├── pages/admin/        (2 new pages)
│   ├── Enrollments.jsx
│   └── Announcements.jsx
├── pages/formateur/    (4 new pages)
│   ├── Grades.jsx
│   ├── Attendance.jsx
│   ├── Schedule.jsx
│   └── Students.jsx
└── pages/stagiaire/    (2 new pages)
    ├── MyAttendance.jsx
    └── Resources.jsx
```

## Files to Modify (Summary)

| File | Changes |
|------|---------|
| `main.jsx` | Add QueryClientProvider |
| `AuthContext.jsx` | Replace mock login with real API |
| `App.jsx` | Add 8 new routes |
| `Sidebar.jsx` | Add nav items for new pages |
| `Login.jsx` | Remove demo role picker, use real auth |
| `ForgotPassword.jsx` | Wire to API |
| `ResetPassword.jsx` | Wire to API |
| `admin/Dashboard.jsx` | Replace mock data with API hooks |
| `admin/UserManagement.jsx` | Wire CRUD + pagination |
| `admin/AcademicSetup.jsx` | Wire CRUD + reorder |
| `formateur/Dashboard.jsx` | Replace mock data with API hooks |
| `stagiaire/Dashboard.jsx` | Replace mock data with API hooks |
| `stagiaire/MyGrades.jsx` | Fetch from API |
| `Profile.jsx` | Wire save/upload/password |
| `Notifications.jsx` | Fetch from API + mark read |

> [!IMPORTANT]
> **Start with Phase 1 + Phase 2** — nothing else works until real auth is functional.
