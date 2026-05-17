<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public routes (no authentication required)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Profile management (all authenticated users)
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
    Route::put('/user/password', [ProfileController::class, 'changePassword']);

    // Announcements & Notifications (all users)
    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::post('/announcements', [AnnouncementController::class, 'store'])->middleware('role:admin,formateur');
    Route::put('/announcements/{id}/read', [AnnouncementController::class, 'markAsRead']);
    Route::put('/announcements/mark-all-read', [AnnouncementController::class, 'markAllAsRead']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);

    // Admin routes (admin only)
    Route::middleware('role:admin')->group(function () {
        // User management
        Route::apiResource('users', UserController::class);

        // Class management
        Route::apiResource('classes', ClassController::class);
        Route::get('/classes/{class}/modules', [ClassController::class, 'modules']);

        // Module management
        Route::apiResource('modules', ModuleController::class);
        Route::post('/modules/reorder', [ModuleController::class, 'reorder']);

        // Enrollment management
        Route::apiResource('enrollments', EnrollmentController::class);

        // Announcements (update/delete)
        Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
        Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);

        // Dashboard
        Route::get('/admin/statistics', [DashboardController::class, 'adminStatistics']);
        Route::get('/admin/enrollment-trends', [DashboardController::class, 'enrollmentTrends']);
        Route::get('/admin/recent-activities', [DashboardController::class, 'recentActivities']);
        Route::get('/admin/classes', [DashboardController::class, 'adminClasses']);
    });

    // Formateur routes (formateur only)
    Route::middleware('role:formateur')->group(function () {
        // Classes taught by this formateur
        Route::get('/formateur/classes', [ClassController::class, 'formateurClasses']);

        // Grades
        Route::post('/grades', [GradeController::class, 'store']);
        Route::put('/grades/{grade}', [GradeController::class, 'update']);
        Route::get('/grades', [GradeController::class, 'index'])->middleware('role:formateur');
        Route::get('/grades/module/{moduleId}', [GradeController::class, 'getModuleGrades']);
        Route::get('/grades/ungraded', [GradeController::class, 'ungraded']);

        // Attendance
        Route::post('/attendance', [AttendanceController::class, 'store']);
        Route::get('/attendance', [AttendanceController::class, 'index']);
        Route::get('/attendance/class/{classId}/rate', [AttendanceController::class, 'classRate']);

        // Sessions/Schedule CRUD for formateurs
        Route::apiResource('formateur/schedule', SessionController::class);

        // Tasks
        Route::apiResource('formateur/tasks', TaskController::class);

        // Dashboard
        Route::get('/formateur/dashboard', [DashboardController::class, 'formateurDashboard']);
        Route::get('/formateur/students', [DashboardController::class, 'formateurStudents']);

        // Resources upload
        Route::post('/resources', [ResourceController::class, 'store']);
    });

    // Stagiaire (Student) routes
    Route::middleware('role:stagiaire')->group(function () {
        // View own grades
        Route::get('/stagiaire/grades', [GradeController::class, 'studentGrades']);
        Route::get('/grades/statistics', [GradeController::class, 'studentStatistics']);

        // View own attendance
        Route::get('/stagiaire/attendance', [AttendanceController::class, 'studentAttendance']);

        // View enrolled modules
        Route::get('/stagiaire/modules', [DashboardController::class, 'studentModules']);

        // Dashboard
        Route::get('/stagiaire/dashboard', [DashboardController::class, 'studentDashboard']);

        // Resources (view/download)
        Route::get('/resources', [ResourceController::class, 'index']);
        Route::get('/resources/{resource}', [ResourceController::class, 'show']);
    });

    // Common accessible by multiple roles (but with appropriate filtering)
    Route::get('/schedule', [SessionController::class, 'userSchedule']);
    Route::get('/attendance/user/{userId}', [AttendanceController::class, 'userAttendance']);
    Route::get('/grades/user/{userId}', [GradeController::class, 'userGrades']);
});
