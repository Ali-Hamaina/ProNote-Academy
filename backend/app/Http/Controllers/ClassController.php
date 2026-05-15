<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    /**
     * Display a listing of classes.
     */
    public function index(Request $request)
    {
        $query = ClassModel::with('instructor', 'enrollments')
            ->when($request->search, fn($q) => $q->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('code', 'like', '%' . $request->search . '%'));

        $perPage = $request->get('per_page', 15);
        $classes = $query->paginate($perPage);

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
     * Store a newly created class.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:classes,code|max:50',
            'description' => 'nullable|string|max:1000',
            'instructor_id' => 'required|exists:users,id',
            'max_students' => 'nullable|integer|min:1|max:500',
            'status' => 'nullable|in:active,inactive,archived',
        ]);

        $validated['status'] = $validated['status'] ?? 'active';
        $class = ClassModel::create($validated);

        return response()->json([
            'message' => 'Class created successfully',
            'data' => $class->load('instructor')
        ], 201);
    }

    /**
     * Display the specified class.
     */
    public function show(ClassModel $class)
    {
        return response()->json([
            'data' => $class->load('instructor', 'modules', 'enrollments')
        ]);
    }

    /**
     * Update the specified class.
     */
    public function update(Request $request, ClassModel $class)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|unique:classes,code,' . $class->id . '|max:50',
            'description' => 'nullable|string|max:1000',
            'instructor_id' => 'sometimes|required|exists:users,id',
            'max_students' => 'nullable|integer|min:1|max:500',
            'status' => 'sometimes|in:active,inactive,archived',
        ]);

        $class->update($validated);

        return response()->json([
            'message' => 'Class updated successfully',
            'data' => $class->load('instructor')
        ]);
    }

    /**
     * Delete the specified class.
     */
    public function destroy(ClassModel $class)
    {
        $class->delete();

        return response()->json([
            'message' => 'Class deleted successfully'
        ]);
    }

    /**
     * Get modules for a specific class.
     */
    public function modules(ClassModel $class)
    {
        $modules = $class->modules()->with('instructor')->orderBy('order_position')->get();

        return response()->json([
            'data' => $modules
        ]);
    }

    /**
     * Get classes taught by authenticated formateur.
     */
    public function formateurClasses(Request $request)
    {
        $formateurId = auth()->id();
        $classes = ClassModel::where('instructor_id', $formateurId)
            ->with('modules', 'enrollments')
            ->paginate($request->get('per_page', 15));

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
}
