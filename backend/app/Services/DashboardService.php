<?php

namespace App\Services;

use App\Models\User;
use App\Models\ClassModel;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Module;

class DashboardService
{
    /**
     * Get admin dashboard data.
     */
    public function getAdminDashboard(): array
    {
        return [
            'statistics' => [
                'total_students' => User::where('role', 'stagiaire')->count(),
                'total_formateurs' => User::where('role', 'formateur')->count(),
                'active_classes' => ClassModel::where('status', 'active')->count(),
                'avg_performance' => round(Grade::avg('grade_value') ?? 0, 2),
            ],
            'enrollment_trends' => $this->getEnrollmentTrends(),
            'recent_activities' => $this->getRecentActivities(),
        ];
    }

    /**
     * Get formateur dashboard data.
     */
    public function getFormateurDashboard(int $formateurId): array
    {
        return [
            'active_modules' => Module::where('instructor_id', $formateurId)
                ->where('status', 'published')
                ->count(),
            'ungraded_assessments' => Grade::where('graded_by', $formateurId)
                ->whereNull('graded_at')
                ->count(),
            'classes_taught' => ClassModel::where('instructor_id', $formateurId)->count(),
            'total_students' => User::whereHas('enrollments.class', function ($query) use ($formateurId) {
                $query->where('instructor_id', $formateurId);
            })->count(),
            'class_success_rate' => $this->getFormateurSuccessRate($formateurId),
        ];
    }

    /**
     * Get student dashboard data.
     */
    public function getStudentDashboard(int $studentId): array
    {
        $grades = Grade::where('user_id', $studentId)->get();
        $enrollments = Enrollment::where('user_id', $studentId)->get();

        return [
            'semester_average' => round($grades->avg('grade_value') ?? 0, 2),
            'modules_completed' => $enrollments->where('status', 'completed')->count(),
            'modules_in_progress' => $enrollments->where('status', 'active')->count(),
            'attendance_rate' => $this->getStudentAttendanceRate($studentId),
            'grades_count' => $grades->count(),
        ];
    }

    /**
     * Get enrollment trends (monthly).
     */
    public function getEnrollmentTrends(): array
    {
        return Enrollment::selectRaw('DATE_TRUNC(\'month\', created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get()
            ->map(fn($item) => [
                'month' => $item->month,
                'enrollments' => $item->count,
            ])
            ->toArray();
    }

    /**
     * Get recent activities.
     */
    public function getRecentActivities(): array
    {
        return [
            [
                'type' => 'student_enrolled',
                'count' => Enrollment::where('created_at', '>=', now()->subDays(7))->count(),
                'description' => 'Students enrolled this week',
            ],
            [
                'type' => 'grades_posted',
                'count' => Grade::where('graded_at', '>=', now()->subDays(7))->count(),
                'description' => 'Grades posted this week',
            ],
            [
                'type' => 'classes_created',
                'count' => ClassModel::where('created_at', '>=', now()->subDays(7))->count(),
                'description' => 'Classes created this week',
            ],
        ];
    }

    /**
     * Get formateur class success rate.
     */
    public function getFormateurSuccessRate(int $formateurId): float
    {
        $students = User::whereHas('enrollments.class', function ($query) use ($formateurId) {
            $query->where('instructor_id', $formateurId);
        })->pluck('id');

        if ($students->isEmpty()) return 0;

        $passCount = Grade::whereIn('user_id', $students)
            ->where('grade_value', '>=', 12)
            ->distinct('user_id')
            ->count();

        return round(($passCount / $students->count()) * 100, 2);
    }

    /**
     * Get student attendance rate.
     */
    public function getStudentAttendanceRate(int $studentId): float
    {
        $total = \App\Models\Attendance::where('user_id', $studentId)->count();
        if ($total === 0) return 0;

        $present = \App\Models\Attendance::where('user_id', $studentId)
            ->where('status', 'present')
            ->count();

        return round(($present / $total) * 100, 2);
    }
}
