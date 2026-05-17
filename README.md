# ProNote Academy - Pedagogical Management System

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![Laravel](https://img.shields.io/badge/Laravel-12.0-red)
![React](https://img.shields.io/badge/React-19.2-blue)
![PHP](https://img.shields.io/badge/PHP-8.2+-purple)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [User Roles & Permissions](#user-roles--permissions)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [Development Commands](#development-commands)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

---

## 🎯 Project Overview

**ProNote Academy** is a comprehensive pedagogical management platform designed for educational institutions. It provides a complete solution for managing:

- 👥 **User Management**: Admin, Formateur (Instructors), and Stagiaire (Students)
- 📚 **Classes & Modules**: Organize courses and learning materials
- 📊 **Grades & Assessments**: Track student performance
- 📍 **Attendance**: Monitor student attendance records
- 📢 **Announcements**: Communicate with students and staff
- 📅 **Schedule & Sessions**: Manage class schedules
- 📝 **Tasks & Resources**: Assign tasks and share educational materials
- 📈 **Analytics Dashboard**: View key performance indicators and trends

The system uses a **modern, scalable architecture** with:
- **Backend**: Laravel 12 RESTful API with Sanctum authentication
- **Frontend**: React 19 SPA with Vite and Tailwind CSS
- **Database**: MySQL/Laravel migrations
- **Real-time**: Support for notifications and announcements

---

## ✨ Key Features

### 1. **Role-Based Access Control**
- **Admin**: Full system control, user management, class creation
- **Formateur**: Class management, grade posting, attendance tracking
- **Stagiaire**: Grade viewing, attendance check, resource access

### 2. **Academic Management**
- Create and manage classes with instructors
- Organize modules within classes
- Track student enrollments
- Reorder modules by priority

### 3. **Assessment System**
- Post grades for students (0-20 scale)
- Provide grade feedback
- View grade statistics and distributions
- Track student performance across modules

### 4. **Attendance Management**
- Mark student attendance
- Calculate attendance rates
- Generate attendance reports by date range
- View class-wide attendance statistics

### 5. **Communication System**
- Create and manage announcements
- Target announcements by role
- Mark announcements as read
- Push notifications to students

### 6. **Schedule & Planning**
- Create class sessions with date/time
- Assign resources to sessions
- View personal schedule
- Manage formateur schedules

### 7. **Task Management**
- Create tasks with priorities
- Update task status
- Assign to students
- Track task completion

### 8. **Resource Management**
- Upload educational materials (max 10MB)
- Share resources with students
- Organize resources by module
- Download resources

### 9. **Dashboard & Analytics**
- **Admin Dashboard**: System-wide KPIs, enrollment trends, recent activities
- **Formateur Dashboard**: Module overview, pending grades, student statistics
- **Student Dashboard**: Grades, progress tracking, attendance summary

### 10. **Profile Management**
- Update profile information
- Change password securely
- Upload avatar
- View personal details

---

## 💻 Technology Stack

### Backend
```
Framework:      Laravel 12.0
Language:       PHP 8.2+
Authentication: Laravel Sanctum 4.3
ORM:           Eloquent
Validation:    Laravel Request classes
Routing:       Laravel API routes
Queue:         Laravel Queue
Testing:       PHPUnit 11.5
```

### Frontend
```
Framework:      React 19.2.0
Build Tool:     Vite 7.2.4
Routing:        React Router DOM 7.12.0
State Mgmt:     Context API + React Query
HTTP Client:    Axios 1.13.2
Styling:        Tailwind CSS 4.1.18
Icons:          Lucide React 0.562.0
Linting:        ESLint 9.39.1
```

### Database & Infrastructure
```
Database:       MySQL / MariaDB
Authentication: Token-based (Sanctum)
CORS:          Enabled for API requests
File Storage:  Local filesystem (storage/app)
Email:         Configurable mail service
Queue:         Database-backed queue
Caching:       Redis/File-based
```

---

## 📁 Project Structure

```
ProNote-Academy/
├── backend/                          # Laravel API Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/          # 14+ API Controllers
│   │   │   ├── Middleware/           # Role & Auth middleware
│   │   │   └── Requests/             # 17+ Validation request classes
│   │   ├── Models/                   # 12 Eloquent Models
│   │   │   ├── User.php              # User (Admin, Formateur, Stagiaire)
│   │   │   ├── ClassModel.php        # Class/Course
│   │   │   ├── Module.php            # Course modules
│   │   │   ├── Enrollment.php        # Student enrollments
│   │   │   ├── Grade.php             # Student grades
│   │   │   ├── Attendance.php        # Attendance records
│   │   │   ├── Task.php              # Tasks
│   │   │   ├── Session.php           # Class sessions/schedule
│   │   │   ├── Announcement.php      # Announcements
│   │   │   ├── Notification.php      # Notifications
│   │   │   ├── Resource.php          # Educational resources
│   │   │   └── AnnouncementRead.php  # Read status tracking
│   │   ├── Services/                 # Business Logic Services
│   │   │   ├── GradeService.php      # Grade management
│   │   │   ├── AttendanceService.php # Attendance tracking
│   │   │   ├── EnrollmentService.php # Enrollment logic
│   │   │   ├── NotificationService.php # Notifications
│   │   │   └── DashboardService.php  # Dashboard data aggregation
│   │   ├── Helpers/                  # Utility helpers
│   │   │   ├── ApiResponse.php       # Standardized API responses
│   │   │   └── QueryHelper.php       # Query utilities
│   │   ├── Mail/                     # Mailable classes
│   │   │   ├── EnrollmentConfirmationMail.php
│   │   │   ├── GradePostedMail.php
│   │   │   ├── LowAttendanceAlertMail.php
│   │   │   └── AnnouncementMail.php
│   │   ├── Traits/                   # Reusable traits
│   │   │   └── Searchable.php        # Search functionality
│   │   └── Providers/
│   │       └── AppServiceProvider.php
│   ├── config/                       # Configuration files
│   │   ├── database.php
│   │   ├── auth.php
│   │   ├── cors.php
│   │   ├── mail.php
│   │   └── sanctum.php
│   ├── database/
│   │   ├── migrations/               # Database migrations
│   │   ├── seeders/                  # Database seeders
│   │   └── factories/                # Model factories
│   ├── routes/
│   │   └── api.php                   # API routes (60+ endpoints)
│   ├── tests/                        # Unit & Feature tests
│   ├── storage/                      # File storage
│   ├── public/
│   │   └── index.php
│   ├── composer.json
│   ├── phpunit.xml
│   └── README.md
│
├── frontEnd/                         # React Vite Frontend
│   ├── src/
│   │   ├── App.jsx                   # Root component
│   │   ├── main.jsx                  # Entry point
│   │   ├── App.css
│   │   ├── index.css                 # Tailwind imports
│   │   ├── components/               # Reusable UI components
│   │   ├── pages/                    # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── GradesPage.jsx
│   │   │   ├── AttendancePage.jsx
│   │   │   ├── ClassesPage.jsx
│   │   │   ├── AnnouncementsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── more...
│   │   ├── routes/                   # Route definitions
│   │   ├── context/                  # React Context (Auth, App state)
│   │   ├── services/                 # API service layer
│   │   │   └── api.js                # Axios configuration
│   │   └── assets/                   # Images, fonts, etc.
│   ├── public/                       # Static files
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── README.md
│
├── memory/                           # Project notes & documentation
├── PHASE_4_SUMMARY.md                # Latest implementation summary
├── TECHNICAL_ANALYSIS_REPORT.md      # Detailed technical docs
├── api_endpoint_audit_report.md      # API documentation
├── integration_plan.md                # Integration guide
└── README.md (THIS FILE)            # Main project documentation
```

---

## 👥 User Roles & Permissions

### 1. **Admin**
**Permissions:**
- ✅ Create, read, update, delete users
- ✅ Manage all classes and modules
- ✅ View system statistics and trends
- ✅ Create/manage announcements
- ✅ View enrollment reports
- ✅ Access admin dashboard with KPIs

**Dashboard Features:**
- System-wide statistics
- Enrollment trends
- Recent activities
- Class overview

### 2. **Formateur (Instructor)**
**Permissions:**
- ✅ Manage their own classes
- ✅ Post and update grades
- ✅ Mark and track attendance
- ✅ Create sessions/schedule
- ✅ Create and manage tasks
- ✅ Upload educational resources
- ✅ Create announcements
- ✅ View class statistics

**Dashboard Features:**
- Module overview
- Pending grades count
- Student list with progress
- Class performance metrics

### 3. **Stagiaire (Student)**
**Permissions:**
- ✅ View own grades
- ✅ View own attendance
- ✅ View enrolled modules
- ✅ View announcements
- ✅ Download resources
- ✅ View grade statistics
- ✅ Update profile

**Dashboard Features:**
- Grade summary
- Progress tracking
- Attendance status
- Upcoming classes
- Recent announcements

---

## 🗄️ Database Models

### Core Models & Relationships

```
User (12 fields)
├── Has Many → Class (as instructor)
├── Has Many → Enrollment
├── Has Many → Grade (as recipient)
├── Has Many → Attendance
├── Has Many → Task
├── Has Many → Session
├── Has Many → Notification
└── Has Many → Task (assigned)

ClassModel (7 fields)
├── Belongs To → User (instructor)
├── Has Many → Module
├── Has Many → Enrollment
├── Has Many → Session
├── Has Many → Grade (through Module)
└── Has Many → Announcement

Module (9 fields)
├── Belongs To → ClassModel
├── Has Many → Task
├── Has Many → Grade
├── Has Many → Session
└── Has Many → Resource

Enrollment (5 fields)
├── Belongs To → User
└── Belongs To → ClassModel

Grade (6 fields)
├── Belongs To → User (student)
├── Belongs To → Module
└── Belongs To → User (posted by formateur)

Attendance (6 fields)
├── Belongs To → User
├── Belongs To → ClassModel
└── Belongs To → Session (optional)

Session (8 fields)
├── Belongs To → ClassModel
├── Belongs To → Module
├── Has Many → Attendance
└── Has Many → Resource

Task (6 fields)
├── Belongs To → User (assigned_to)
├── Belongs To → Module
└── Belongs To → User (created_by)

Announcement (5 fields)
├── Belongs To → User (created_by)
├── Has Many → AnnouncementRead
└── Targets → Roles

Notification (6 fields)
├── Belongs To → User
├── Polymorphic → Notifiable model
└── Tracks read status

Resource (6 fields)
├── Belongs To → Module
├── Belongs To → Session
└── Stored locally in storage/app

AnnouncementRead (3 fields)
├── Belongs To → User
└── Belongs To → Announcement
```

---

## 🔌 API Endpoints

### Authentication (Public)
```
POST   /api/login                    # User login
POST   /api/forgot-password          # Request password reset
POST   /api/reset-password           # Reset password with token
POST   /api/logout                   # User logout
GET    /api/user                     # Get current user info
```

### Profile Management (Authenticated)
```
GET    /api/profile                  # Get user profile
PUT    /api/profile                  # Update profile
POST   /api/profile/avatar           # Upload avatar
PUT    /api/user/password            # Change password
```

### User Management (Admin Only)
```
GET    /api/users                    # List all users
POST   /api/users                    # Create new user
GET    /api/users/{id}               # Get user details
PUT    /api/users/{id}               # Update user
DELETE /api/users/{id}               # Delete user
```

### Class Management (Admin)
```
GET    /api/classes                  # List all classes
POST   /api/classes                  # Create class
GET    /api/classes/{id}             # Get class details
PUT    /api/classes/{id}             # Update class
DELETE /api/classes/{id}             # Delete class
GET    /api/classes/{id}/modules     # Get class modules
GET    /api/formateur/classes        # Get classes taught by formateur
```

### Module Management (Admin)
```
GET    /api/modules                  # List modules
POST   /api/modules                  # Create module
GET    /api/modules/{id}             # Get module details
PUT    /api/modules/{id}             # Update module
DELETE /api/modules/{id}             # Delete module
POST   /api/modules/reorder          # Reorder modules
```

### Enrollment Management (Admin)
```
GET    /api/enrollments              # List enrollments
POST   /api/enrollments              # Enroll student
GET    /api/enrollments/{id}         # Get enrollment
PUT    /api/enrollments/{id}         # Update enrollment
DELETE /api/enrollments/{id}         # Remove enrollment
```

### Grade Management (Formateur)
```
GET    /api/grades                   # List grades (for formateur)
POST   /api/grades                   # Post grade
PUT    /api/grades/{id}              # Update grade
GET    /api/grades/module/{id}       # Get grades for module
GET    /api/grades/ungraded          # Get ungraded submissions
GET    /api/stagiaire/grades         # Get student's grades
GET    /api/grades/statistics        # Get student grade stats
GET    /api/grades/user/{id}         # Get user's grades
```

### Attendance Management (Formateur)
```
POST   /api/attendance               # Mark attendance
GET    /api/attendance               # Get attendance records
GET    /api/attendance/class/{id}/rate   # Get class attendance rate
GET    /api/stagiaire/attendance     # Get student attendance
GET    /api/attendance/user/{id}     # Get user attendance
```

### Session/Schedule Management
```
GET    /api/formateur/schedule       # List formateur sessions
POST   /api/formateur/schedule       # Create session
PUT    /api/formateur/schedule/{id}  # Update session
DELETE /api/formateur/schedule/{id}  # Delete session
GET    /api/schedule                 # Get personal schedule
```

### Task Management (Formateur)
```
GET    /api/formateur/tasks          # List tasks
POST   /api/formateur/tasks          # Create task
PUT    /api/formateur/tasks/{id}     # Update task
DELETE /api/formateur/tasks/{id}     # Delete task
```

### Announcement Management
```
GET    /api/announcements            # Get announcements (role-filtered)
POST   /api/announcements            # Create announcement (Admin/Formateur)
PUT    /api/announcements/{id}       # Update announcement (Admin only)
PUT    /api/announcements/{id}/read  # Mark as read
PUT    /api/announcements/mark-all-read  # Mark all as read
DELETE /api/announcements/{id}       # Delete announcement (Admin only)
```

### Notification Management
```
GET    /api/notifications/unread-count  # Get unread count
```

### Resource Management
```
POST   /api/resources                # Upload resource (Formateur)
GET    /api/resources                # List resources (Student)
GET    /api/resources/{id}           # Get resource (Student)
```

### Dashboard Routes (Role-Specific)
```
GET    /api/admin/statistics         # Admin KPIs
GET    /api/admin/enrollment-trends  # Enrollment trends
GET    /api/admin/recent-activities  # Recent activities
GET    /api/admin/classes            # Admin class overview

GET    /api/formateur/dashboard      # Formateur dashboard data
GET    /api/formateur/students       # Formateur's students

GET    /api/stagiaire/modules        # Student's modules
GET    /api/stagiaire/dashboard      # Student dashboard data
```

---

## 📦 Installation & Setup

### Prerequisites

**System Requirements:**
- PHP 8.2 or higher
- Node.js 16+ and npm
- MySQL 8.0+ or MariaDB 10.4+
- Git
- Composer
- XAMPP/WAMP/LAMP stack (for local development)

### Windows/XAMPP Setup

#### 1. Clone the Repository
```bash
# Navigate to your XAMPP htdocs folder
cd C:\xampp\htdocs

# Clone the project
git clone <repository-url> ProNote-Academy
cd ProNote-Academy
```

#### 2. Backend Setup

```bash
cd backend

# 1. Install PHP dependencies
composer install

# 2. Create environment file
copy .env.example .env

# 3. Generate app key
php artisan key:generate

# 4. Configure database in .env
# Edit .env file with your database details:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=pronote_academy
# DB_USERNAME=root
# DB_PASSWORD=

# 5. Create database
# Open phpMyAdmin (http://localhost/phpmyadmin)
# Create new database: pronote_academy

# 6. Run migrations
php artisan migrate

# 7. (Optional) Seed database with sample data
php artisan db:seed

# 8. Clear cache
php artisan config:clear
php artisan cache:clear
```

#### 3. Frontend Setup

```bash
cd ../frontEnd

# 1. Install Node dependencies
npm install

# 2. Build frontend assets
npm run build

# 3. Or for development with hot reload
npm run dev
```

---

## 🚀 Running the Project

### Option 1: Using Composer Script (Recommended)

```bash
cd backend

# Run setup once
composer run setup
```

This will:
- Install all dependencies (PHP & Node)
- Generate `.env` file
- Generate application key
- Run migrations
- Seed database
- Build frontend assets

### Option 2: Manual In Development

**Terminal 1 - Backend API Server:**
```bash
cd backend
php artisan serve
# Runs on http://localhost:8000
```

**Terminal 2 - Queue Worker (Optional):**
```bash
cd backend
php artisan queue:listen
```

**Terminal 3 - Frontend Dev Server:**
```bash
cd frontEnd
npm run dev
# Runs on http://localhost:5173
```

**Terminal 4 - Logs (Optional):**
```bash
cd backend
php artisan pail
```

### Option 3: Using Concurrently (All in One)

```bash
cd backend
composer run dev
```

This runs everything concurrently:
- Laravel API server (port 8000)
- Queue listener
- Frontend Vite dev (port 5173)
- Tail logs

### Option 4: Production Build

```bash
cd backend
composer require deployer/deployer

# Build frontend
npm run build

# Or use provided setup script
composer run setup
```

---

## 🛠️ Development Commands

### Backend Commands

```bash
cd backend

# Artisan Commands
php artisan migrate              # Run migrations
php artisan migrate:rollback     # Rollback migrations
php artisan db:seed              # Seed database
php artisan db:seed --class=UsersSeeder  # Seed specific table
php artisan cache:clear          # Clear cache
php artisan config:clear         # Clear config
php artisan tinker               # PHP REPL
php artisan serve                # Start dev server
php artisan queue:listen         # Start queue worker

# Testing
php artisan test                 # Run all tests
php artisan test tests/Feature/AuthTest.php  # Run specific test

# Code Style
php artisan pint                 # Auto-fix code style

# Make Commands (Generate files)
php artisan make:controller ControllerName
php artisan make:model ModelName
php artisan make:migration create_table_name
php artisan make:request StoreRequestName
php artisan make:mail MailClassName
php artisan make:policy PolicyName
```

### Frontend Commands

```bash
cd frontEnd

npm run dev          # Start dev server (hot reload)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run lint -- --fix  # Auto-fix linting issues
```

---

## ⚙️ Environment Configuration

### Backend `.env` Configuration

```env
# Application
APP_NAME="ProNote Academy"
APP_ENV=local|production
APP_KEY=base64:xxxxxxxxxxxx
APP_DEBUG=true|false
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pronote_academy
DB_USERNAME=root
DB_PASSWORD=

# Mail (for notifications)
MAIL_MAILER=smtp|mailgun|sendgrid
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@pronote-academy.com

# Authentication
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
SESSION_DOMAIN=localhost

# Redis (optional, for caching/sessions)
REDIS_URL=
REDIS_CACHE=redis

# Queue
QUEUE_CONNECTION=database|redis|sync
```

### Frontend API Configuration

**File: `frontEnd/src/services/api.js`**

```javascript
// Configure API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Axios instance configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});
```

---

## 📚 API Documentation

### Authentication Flow

```
1. GET /sanctum/csrf-cookie        # Get CSRF token
2. POST /api/login                 # Login with email/password
   Response: { user: {...}, token: "Bearer token" }
3. Use token in Authorization header: "Bearer {token}"
4. POST /api/logout                # Logout and invalidate token
```

### Example API Calls

#### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pronote.com",
    "password": "password"
  }'
```

#### Get Classes
```bash
curl -X GET http://localhost:8000/api/classes \
  -H "Authorization: Bearer {token}"
```

#### Create Grade
```bash
curl -X POST http://localhost:8000/api/grades \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 5,
    "module_id": 2,
    "score": 16,
    "feedback": "Good work"
  }'
```

#### Mark Attendance
```bash
curl -X POST http://localhost:8000/api/attendance \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 5,
    "class_id": 1,
    "status": "present",
    "date": "2026-05-17"
  }'
```

---

## 📊 Database Schema Overview

### Key Tables

| Table | Purpose | Records |
|-------|---------|---------|
| `users` | All users (admin, formateur, stagiaire) | ~50+ |
| `classes` | Classes/Courses | ~10+ |
| `modules` | Modules within classes | ~30+ |
| `enrollments` | Student enrollments | ~100+ |
| `grades` | Student grades | Unlimited |
| `attendance` | Attendance records | Daily |
| `tasks` | Assignments | ~50+ |
| `sessions` | Class sessions/schedule | Unlimited |
| `announcements` | Announcements | ~100+ |
| `notifications` | User notifications | Unlimited |
| `resources` | Educational materials | ~200+ |

---

## 🔐 Security Features

✅ **Authentication**: Laravel Sanctum (token-based)
✅ **Authorization**: Role-based middleware (Admin, Formateur, Stagiaire)
✅ **Validation**: Form request classes with custom rules
✅ **Password Security**: Hashed with bcrypt
✅ **CORS**: Configured for frontend domain
✅ **CSRF Protection**: Enabled for web routes
✅ **SQL Injection**: Protected via Eloquent ORM
✅ **File Uploads**: Size limit validation (10MB max)
✅ **Rate Limiting**: Configurable throttle middleware
✅ **Sensitive Data**: Hidden in responses via cast/hiding

---

## 🧪 Testing

### Run Tests

```bash
cd backend

# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/AuthTest.php

# Run with coverage
php artisan test --coverage

# Run only unit tests
php artisan test tests/Unit
```

### Test Files Location
- Feature Tests: `backend/tests/Feature/`
- Unit Tests: `backend/tests/Unit/`

---

## 📝 Project Documentation

### Additional Documentation Files

- **PHASE_4_SUMMARY.md** - Latest implementation details
- **TECHNICAL_ANALYSIS_REPORT.md** - Comprehensive technical analysis
- **api_endpoint_audit_report.md** - Detailed API documentation
- **integration_plan.md** - Integration guidelines
- **BACKEND_REQUIREMENTS.md** - Backend specifications
- **COMPREHENSIVE_TECHNICAL_REPORT.md** - Frontend technical docs

---

## 🤝 Contributing

### Code Standards
- Follow PSR-12 (PHP)
- Follow Airbnb ESLint (JavaScript)
- Write tests for new features
- Document public APIs

### Development Workflow
1. Create feature branch: `git checkout -b feature/description`
2. Make changes following code standards
3. Write/update tests
4. Commit with clear messages
5. Push and create pull request
6. Wait for code review
7. Merge after approval

### Reporting Issues
- Use GitHub Issues
- Include error messages and logs
- Describe steps to reproduce
- Include your environment details

---

## 📧 Email Notifications

The system sends automated emails for:

1. **Enrollment Confirmation**
   - Sent when student enrolls in class
   - Contains class details and start date

2. **Grade Posted**
   - Sent when grade is posted
   - Includes grade, feedback, module info

3. **Low Attendance Alert**
   - Sent when attendance drops below threshold
   - Shows attendance summary

4. **Announcement**
   - Sent when new announcement targets user
   - Includes announcement content and link

---

## 🐛 Troubleshooting

### Common Issues & Solutions

**Issue**: "PDOException: SQLSTATE[HY000] [1045]"
```
Solution: Check database credentials in .env
- Ensure MySQL is running
- Verify DB_USERNAME and DB_PASSWORD
```

**Issue**: CORS errors in browser console
```
Solution: Update SANCTUM_STATEFUL_DOMAINS in .env
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

**Issue**: "Class not found" error
```
Solution: Run composer autoload dump
composer dump-autoload
```

**Issue**: Frontend can't connect to API
```
Solution: 
- Check API is running on port 8000
- Verify API_BASE_URL in frontend config
- Check CORS configuration
```

**Issue**: Migrations fail
```
Solution:
- Check database exists
- Drop and recreate database
- php artisan migrate:refresh
```

---

## 📞 Support & Contact

For questions or support:
- 📧 Email: support@pronote-academy.com
- 🐛 Issues: GitHub Issues
- 💬 Discussion: GitHub Discussions

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 🙏 Acknowledgments

- **Laravel Team** - For the excellent framework
- **React Team** - For the amazing UI library
- **Community Contributors** - For improvements and bug reports
- **Educational Community** - For feedback and requirements

---

## 📈 Project Statistics

```
Backend:
- Controllers: 14+
- Models: 12
- Services: 5
- Validation Classes: 17+
- API Endpoints: 60+
- Mail Classes: 4

Frontend:
- Pages: 15+
- Components: 30+
- Routes: 20+
- Services: Multiple API services

Database:
- Tables: 12+
- Relationships: 30+
```

---

**Last Updated**: May 17, 2026
**Version**: 1.0.0
**Status**: Active Development

For the latest updates and changes, refer to the project's Git history and documentation files.

---

## 🎓 Getting Started Quick Reference

```bash
# 1. Clone & enter project
git clone <url>
cd ProNote-Academy

# 2. Backend setup
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Update .env with database config
php artisan migrate
php artisan serve

# 3. Frontend setup (new terminal)
cd frontEnd
npm install
npm run dev

# 4. Access application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000/api
# Database: http://localhost/phpmyadmin
```

---

**Enjoy building with ProNote Academy! 🚀**
