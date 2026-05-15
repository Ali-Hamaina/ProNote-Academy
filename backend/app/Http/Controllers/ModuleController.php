<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * Display a listing of modules.
     */
    public function index(Request $request)
    {
        $query = Module::with('class', 'instructor');

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 15);
        $modules = $query->orderBy('order_position')->paginate($perPage);

        return response()->json([
            'data' => $modules->items(),
            'pagination' => [
                'current_page' => $modules->currentPage(),
                'per_page' => $modules->perPage(),
                'total' => $modules->total(),
                'last_page' => $modules->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created module.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'name' => 'required|string|max:255',
            'block_number' => 'required|integer|min:1',
            'hours' => 'required|integer|min:1',
            'description' => 'nullable|string|max:1000',
            'instructor_id' => 'required|exists:users,id',
            'status' => 'nullable|in:draft,published,archived',
        ]);

        $validated['status'] = $validated['status'] ?? 'draft';
        $validated['order_position'] = Module::where('class_id', $validated['class_id'])->max('order_position') + 1;

        $module = Module::create($validated);

        return response()->json([
            'message' => 'Module created successfully',
            'data' => $module->load('class', 'instructor')
        ], 201);
    }

    /**
     * Display the specified module.
     */
    public function show(Module $module)
    {
        return response()->json([
            'data' => $module->load('class', 'instructor', 'grades')
        ]);
    }

    /**
     * Update the specified module.
     */
    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'block_number' => 'sometimes|required|integer|min:1',
            'hours' => 'sometimes|required|integer|min:1',
            'description' => 'nullable|string|max:1000',
            'instructor_id' => 'sometimes|required|exists:users,id',
            'status' => 'sometimes|in:draft,published,archived',
        ]);

        $module->update($validated);

        return response()->json([
            'message' => 'Module updated successfully',
            'data' => $module->load('class', 'instructor')
        ]);
    }

    /**
     * Delete the specified module.
     */
    public function destroy(Module $module)
    {
        $module->delete();

        return response()->json([
            'message' => 'Module deleted successfully'
        ]);
    }

    /**
     * Reorder modules within a class.
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'modules' => 'required|array',
            'modules.*.id' => 'required|integer|exists:modules,id',
            'modules.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['modules'] as $module) {
            Module::where('id', $module['id'])->update(['order_position' => $module['order']]);
        }

        return response()->json([
            'message' => 'Modules reordered successfully'
        ]);
    }
}
