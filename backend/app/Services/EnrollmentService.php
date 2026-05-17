<?php

namespace App\Services;

use App\Models\Enrollment;
use App\Events\UserEnrolled;

class EnrollmentService
{
    /**
     * Enroll a student in a class.
     */
    public function enroll(int $userId, int $classId): Enrollment
    {
        $enrollment = Enrollment::create([
            'user_id' => $userId,
            'class_id' => $classId,
            'status' => 'active',
            'progress' => 0,
        ]);

        event(new UserEnrolled($enrollment));

        return $enrollment->load('user', 'classModel');
    }

    /**
     * Get student's enrollment progress.
     */
    public function getStudentProgress(int $userId): array
    {
        $enrollments = Enrollment::where('user_id', $userId)
            ->with('classModel.modules')
            ->get();

        $totalProgress = 0;
        $count = $enrollments->count();

        foreach ($enrollments as $enrollment) {
            $totalProgress += $enrollment->progress;
        }

        return [
            'enrollments' => $enrollments->count(),
            'average_progress' => $count > 0 ? round($totalProgress / $count, 2) : 0,
            'completed' => $enrollments->where('status', 'completed')->count(),
            'active' => $enrollments->where('status', 'active')->count(),
            'dropped' => $enrollments->where('status', 'dropped')->count(),
        ];
    }

    /**
     * Update enrollment progress.
     */
    public function updateProgress(int $enrollmentId, int $progress): Enrollment
    {
        $enrollment = Enrollment::find($enrollmentId);
        $enrollment->update(['progress' => min($progress, 100)]);

        // Auto-complete if progress reaches 100
        if ($progress >= 100) {
            $enrollment->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);
        }

        return $enrollment;
    }

    /**
     * Get class enrollment stats.
     */
    public function getClassEnrollmentStats(int $classId): array
    {
        $enrollments = Enrollment::where('class_id', $classId)->get();

        return [
            'total' => $enrollments->count(),
            'active' => $enrollments->where('status', 'active')->count(),
            'completed' => $enrollments->where('status', 'completed')->count(),
            'dropped' => $enrollments->where('status', 'dropped')->count(),
            'average_progress' => round($enrollments->avg('progress'), 2),
        ];
    }

    /**
     * Check if student is enrolled in class.
     */
    public function isEnrolled(int $userId, int $classId): bool
    {
        return Enrollment::where('user_id', $userId)
            ->where('class_id', $classId)
            ->exists();
    }
}
