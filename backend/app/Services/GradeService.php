<?php

namespace App\Services;

use App\Models\Grade;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class GradeService
{
    /**
     * Post a grade for a student.
     */
    public function postGrade(array $data): Grade
    {
        $grade = Grade::create([
            'user_id' => $data['user_id'],
            'module_id' => $data['module_id'],
            'grade_value' => $data['grade_value'],
            'feedback' => $data['feedback'] ?? null,
            'graded_by' => auth()->id(),
            'graded_at' => now(),
        ]);

        return $grade->load('student', 'module', 'grader');
    }

    /**
     * Get student grade statistics.
     */
    public function getStudentStatistics(int $userId): array
    {
        $grades = Grade::where('user_id', $userId)->get();

        return [
            'average' => round($grades->avg('grade_value') ?? 0, 2),
            'highest' => $grades->max('grade_value'),
            'lowest' => $grades->min('grade_value'),
            'modules_graded' => $grades->count(),
            'total_points' => $grades->sum('grade_value'),
        ];
    }

    /**
     * Get ungraded assessments count with deadline info.
     */
    public function getUngradedCount(int $formateurId): int
    {
        return Grade::where('graded_by', $formateurId)
            ->whereNull('graded_at')
            ->count();
    }

    /**
     * Get class average grade.
     */
    public function getClassAverage(int $classId): float
    {
        return Grade::whereHas('module', function ($query) use ($classId) {
            $query->where('class_id', $classId);
        })->avg('grade_value') ?? 0;
    }

    /**
     * Get grade distribution for a module.
     */
    public function getModuleDistribution(int $moduleId): array
    {
        $grades = Grade::where('module_id', $moduleId)->get();

        return [
            'excellent' => $grades->filter(fn($g) => $g->grade_value >= 16)->count(),
            'good' => $grades->filter(fn($g) => $g->grade_value >= 12 && $g->grade_value < 16)->count(),
            'average' => $grades->filter(fn($g) => $g->grade_value >= 8 && $g->grade_value < 12)->count(),
            'poor' => $grades->filter(fn($g) => $g->grade_value < 8)->count(),
        ];
    }
}
