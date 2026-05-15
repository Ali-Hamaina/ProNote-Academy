<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ClassModel;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Module;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get admin dashboard statistics.
     */
    public function adminStatistics()
    {
        $totalStudents = User::where('role', 'stagiaire')->count();
        $totalFormateurs = User::where('role', 'formateur')->count();
        $activeClasses = ClassModel::where('status', 'active')->count();
        $avgPerformance = Grade::avg('grade_value') ?? 0;

        return response()->json([
            'data' => [
                'total_students' => $totalStudents,
                'total_formateurs' => $totalFormateurs,
                'active_classes' => $activeClasses,
                'avg_performance' => round($avgPerformance, 2),
            ]
        ]);
    }

    /**
     * Get enrollment trends.
     */
    public function enrollmentTrends(Request $request)
    {
        $period = $request->get('period', '6months');

        // Simple monthly enrollment data
        $trends = Enrollment::selectRaw('DATE_TRUNC(\'month\', created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->limit(6)
            ->get();

        return response()->json([
            'data' => $trends
        ]);
    }

    /**
     * Get recent activities.
     */
    public function recentActivities()
    {
        // Activities: new students, grades posted, classes created
        $activities = [
            [
                'type' => 'student_registered',
                'title' => 'New student registered',
                'description' => 'Recent student enrollments',
                'timestamp' => now(),
            ],
            [
                'type' => 'grade_posted',
                'title' => 'Grades posted',
                'description' => 'Recent grade submissions',
                'timestamp' => now(),
            ],
            [
                'type' => 'class_created',
                'title' => 'New class created',
                'description' => 'Recently created classes',
                'timestamp' => now(),
            ],
        ];

        return response()->json([
            'data' => $activities
        ]);
    }

    /**
     * Get admin class dashboard.
     */
    public function adminClasses(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $classes = ClassModel::with('instructor')
            ->paginate($perPage);

        return response()->json([
            'data' => $classes->items(),
            'pagination' => [
                'current_page' => $classes->currentPage(),
                'per_page' => $classes->perPage(),
                'total' => $classes->total(),
                'last_page' => $classes->lastPage(),
            ]
        ]);
    }

    /**
     * Get formateur dashboard.
     */
    public function formateurDashboard()
    {
        $formateurId = auth()->id();

        $activeModules = Module::where('instructor_id', $formateurId)
            ->where('status', 'published')
            ->count();

        $ungradedCount = Grade::where('graded_by', $formateurId)
            ->whereNull('graded_at')
            ->count();

        // Class success rate (simplified)
        $classes = ClassModel::where('instructor_id', $formateurId)->count();

        return response()->json([
            'data' => [
                'active_modules' => $activeModules,
                'ungraded_assessments' => $ungradedCount,
                'classes_taught' => $classes,
            ]
        ]);
    }

    /**
     * Get formateur's students.
     */
    public function formateurStudents(Request $request)
    {
        $formateurId = auth()->id();

        $students = User::whereHas('enrollments.class', function ($query) use ($formateurId) {
            $query->where('instructor_id', $formateurId);
        })
        ->with('enrollments')
        ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $students->items(),
            'pagination' => [
                'current_page' => $students->currentPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
                'last_page' => $students->lastPage(),
            ]
        ]);
    }

    /**
     * Get student dashboard.
     */
    public function studentDashboard()
    {
        $studentId = auth()->id();

        // Get grades
        $grades = Grade::where('user_id', $studentId)->get();
        $semesterAverage = $grades->avg('grade_value') ?? 0;

        // Get enrollments
        $enrollments = Enrollment::where('user_id', $studentId)->count();
        $modulesCompleted = Module::count(); // Simplified

        return response()->json([
            'data' => [
                'semester_average' => round($semesterAverage, 2),
                'enrollments' => $enrollments,
                'modules_completed' => $modulesCompleted,
            ]
        ]);
    }

    /**
     * Get student's modules.
     */
    public function studentModules(Request $request)
    {
        $studentId = auth()->id();

        $enrollments = Enrollment::where('user_id', $studentId)
            ->with('class.modules')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $enrollments->items(),
            'pagination' => [
                'current_page' => $enrollments->currentPage(),
                'per_page' => $enrollments->perPage(),
                'total' => $enrollments->total(),
                'last_page' => $enrollments->lastPage(),
            ]
        ]);
    }
}
