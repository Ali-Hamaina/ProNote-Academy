<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    /**
     * Display a listing of grades (formateur view).
     */
    public function index(Request $request)
    {
        // Only formateurs can view all grades
        if (auth()->user()->role !== 'formateur') {
            return response()->json(['error' => 'Only formateurs can view grades list'], 403);
        }

        $query = Grade::with('student', 'module', 'grader');

        if ($request->has('module_id')) {
            $query->where('module_id', $request->module_id);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->ungraded) {
            $query->whereNull('graded_at');
        }

        $perPage = $request->get('per_page', 15);
        $grades = $query->paginate($perPage);

        return response()->json([
            'data' => $grades->items(),
            'pagination' => [
                'current_page' => $grades->currentPage(),
                'per_page' => $grades->perPage(),
                'total' => $grades->total(),
                'last_page' => $grades->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created grade.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'module_id' => 'required|exists:modules,id',
            'grade_value' => 'required|numeric|min:0|max:20',
            'feedback' => 'nullable|string|max:1000',
        ]);

        // Check if grade already exists for this user-module combination
        $existing = Grade::where('user_id', $validated['user_id'])
            ->where('module_id', $validated['module_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'error' => 'Grade already exists for this student and module'
            ], 409);
        }

        $validated['graded_by'] = auth()->id();
        $validated['graded_at'] = now();

        $grade = Grade::create($validated);

        return response()->json([
            'message' => 'Grade posted successfully',
            'data' => $grade->load('student', 'module', 'grader')
        ], 201);
    }

    /**
     * Display the specified grade.
     */
    public function show(Grade $grade)
    {
        // Students can only see their own grades
        if (auth()->user()->role === 'stagiaire' && $grade->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json([
            'data' => $grade->load('student', 'module', 'grader')
        ]);
    }

    /**
     * Update the specified grade.
     */
    public function update(Request $request, Grade $grade)
    {
        // Only the grader or admin can update
        if (auth()->user()->role === 'formateur' && $grade->graded_by !== auth()->id()) {
            return response()->json(['error' => 'You can only update grades you created'], 403);
        }

        $validated = $request->validate([
            'grade_value' => 'sometimes|required|numeric|min:0|max:20',
            'feedback' => 'nullable|string|max:1000',
        ]);

        $grade->update($validated);

        return response()->json([
            'message' => 'Grade updated successfully',
            'data' => $grade->load('student', 'module', 'grader')
        ]);
    }

    /**
     * Get grades for a specific module.
     */
    public function getModuleGrades(Request $request, $moduleId)
    {
        $grades = Grade::where('module_id', $moduleId)
            ->with('student', 'module')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $grades->items(),
            'pagination' => [
                'current_page' => $grades->currentPage(),
                'per_page' => $grades->perPage(),
                'total' => $grades->total(),
                'last_page' => $grades->lastPage(),
            ]
        ]);
    }

    /**
     * Get ungraded assessments.
     */
    public function ungraded(Request $request)
    {
        $ungraded = Grade::whereNull('graded_at')
            ->with('student', 'module')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $ungraded->items(),
            'count' => $ungraded->total(),
            'pagination' => [
                'current_page' => $ungraded->currentPage(),
                'per_page' => $ungraded->perPage(),
                'total' => $ungraded->total(),
                'last_page' => $ungraded->lastPage(),
            ]
        ]);
    }

    /**
     * Get student's grades (stagiaire view).
     */
    public function studentGrades(Request $request)
    {
        $userId = auth()->id();
        $grades = Grade::where('user_id', $userId)
            ->with('module', 'grader')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $grades->items(),
            'pagination' => [
                'current_page' => $grades->currentPage(),
                'per_page' => $grades->perPage(),
                'total' => $grades->total(),
                'last_page' => $grades->lastPage(),
            ]
        ]);
    }

    /**
     * Get grade statistics for student.
     */
    public function studentStatistics()
    {
        $userId = auth()->id();
        $grades = Grade::where('user_id', $userId)->get();

        $average = $grades->avg('grade_value');
        $highest = $grades->max('grade_value');
        $lowest = $grades->min('grade_value');

        return response()->json([
            'data' => [
                'average' => round($average ?? 0, 2),
                'highest' => $highest,
                'lowest' => $lowest,
                'modules_graded' => $grades->count(),
            ]
        ]);
    }

    /**
     * Get grades for a specific user.
     */
    public function userGrades(Request $request, $userId)
    {
        // Allow formateurs to see their students' grades
        // Allow students to see their own grades
        $user = auth()->user();
        if ($user->role === 'stagiaire' && $user->id !== $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $grades = Grade::where('user_id', $userId)
            ->with('module', 'grader')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $grades->items(),
            'pagination' => [
                'current_page' => $grades->currentPage(),
                'per_page' => $grades->perPage(),
                'total' => $grades->total(),
                'last_page' => $grades->lastPage(),
            ]
        ]);
    }
}
