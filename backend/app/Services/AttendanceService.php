<?php

namespace App\Services;

use App\Models\Attendance;

class AttendanceService
{
    /**
     * Mark attendance for a session.
     */
    public function markAttendance(array $data): Attendance
    {
        $attendance = Attendance::updateOrCreate(
            [
                'user_id' => $data['user_id'],
                'class_id' => $data['class_id'],
                'session_date' => $data['session_date'],
            ],
            [
                'status' => $data['status'],
                'notes' => $data['notes'] ?? null,
                'marked_by' => auth()->id(),
            ]
        );

        return $attendance->load('user', 'class', 'markedBy');
    }

    /**
     * Get student attendance rate.
     */
    public function getStudentAttendanceRate(int $userId): float
    {
        $total = Attendance::where('user_id', $userId)->count();
        if ($total === 0) return 0;

        $present = Attendance::where('user_id', $userId)
            ->where('status', 'present')
            ->count();

        return round(($present / $total) * 100, 2);
    }

    /**
     * Get class attendance rate.
     */
    public function getClassAttendanceRate(int $classId): array
    {
        $total = Attendance::where('class_id', $classId)->count();

        if ($total === 0) {
            return [
                'present' => 0,
                'absent' => 0,
                'excused' => 0,
                'rate' => 0,
            ];
        }

        $present = Attendance::where('class_id', $classId)->where('status', 'present')->count();
        $absent = Attendance::where('class_id', $classId)->where('status', 'absent')->count();
        $excused = Attendance::where('class_id', $classId)->where('status', 'excused')->count();

        return [
            'present' => $present,
            'absent' => $absent,
            'excused' => $excused,
            'total' => $total,
            'rate' => round(($present / $total) * 100, 2),
        ];
    }

    /**
     * Get attendance summary for a period.
     */
    public function getAttendanceSummary(int $userId, string $startDate, string $endDate): array
    {
        $records = Attendance::where('user_id', $userId)
            ->whereBetween('session_date', [$startDate, $endDate])
            ->get();

        return [
            'period_start' => $startDate,
            'period_end' => $endDate,
            'total_sessions' => $records->count(),
            'present' => $records->where('status', 'present')->count(),
            'absent' => $records->where('status', 'absent')->count(),
            'excused' => $records->where('status', 'excused')->count(),
            'attendance_rate' => $records->count() > 0
                ? round(($records->where('status', 'present')->count() / $records->count()) * 100, 2)
                : 0,
        ];
    }
}
