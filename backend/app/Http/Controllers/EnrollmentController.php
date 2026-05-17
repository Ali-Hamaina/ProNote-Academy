<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of enrollments.
     */
    public function index(Request $request)
    {
        $query = Enrollment::with('user', 'classModel');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 15);
        $enrollments = $query->paginate($perPage);

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

    /**
     * Store a newly created enrollment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'class_id' => 'required|exists:classes,id',
            'status' => 'nullable|in:active,completed,dropped',
        ]);

        // Check if already enrolled
        $existing = Enrollment::where('user_id', $validated['user_id'])
            ->where('class_id', $validated['class_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'error' => 'User is already enrolled in this class'
            ], 409);
        }

        $validated['status'] = $validated['status'] ?? 'active';
        $validated['progress'] = 0;

        $enrollment = Enrollment::create($validated);

        return response()->json([
            'message' => 'Enrollment created successfully',
            'data' => $enrollment->load('user', 'classModel')
        ], 201);
    }

    /**
     * Display the specified enrollment.
     */
    public function show(Enrollment $enrollment)
    {
        return response()->json([
            'data' => $enrollment->load('user', 'classModel')
        ]);
    }

    /**
     * Update the specified enrollment.
     */
    public function update(Request $request, Enrollment $enrollment)
    {
        $validated = $request->validate([
            'status' => 'sometimes|required|in:active,completed,dropped',
            'progress' => 'sometimes|required|integer|min:0|max:100',
        ]);

        $enrollment->update($validated);

        return response()->json([
            'message' => 'Enrollment updated successfully',
            'data' => $enrollment->load('user', 'classModel')
        ]);
    }

    /**
     * Delete the specified enrollment.
     */
    public function destroy(Enrollment $enrollment)
    {
        $enrollment->delete();

        return response()->json([
            'message' => 'Enrollment deleted successfully'
        ]);
    }
}
