<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    /**
     * Display a listing of resources.
     */
    public function index(Request $request)
    {
        $query = Resource::with('creator');

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $perPage = $request->get('per_page', 15);
        $resources = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $resources->items(),
            'pagination' => [
                'current_page' => $resources->currentPage(),
                'per_page' => $resources->perPage(),
                'total' => $resources->total(),
                'last_page' => $resources->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'type' => 'required|in:cheat_sheet,article,video,pdf,code',
            'file' => 'nullable|file|max:10240',
            'external_url' => 'nullable|url',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('resources', 'public');
            $validated['file_url'] = $filePath;
        }

        $validated['created_by'] = auth()->id();
        $resource = Resource::create($validated);

        return response()->json([
            'message' => 'Resource created successfully',
            'data' => $resource->load('creator')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Resource $resource)
    {
        return response()->json([
            'data' => $resource->load('creator')
        ]);
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, Resource $resource)
    {
        // Only creator or admin can update
        if ($resource->created_by !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'type' => 'sometimes|required|in:cheat_sheet,article,video,pdf,code',
            'external_url' => 'nullable|url',
        ]);

        $resource->update($validated);

        return response()->json([
            'message' => 'Resource updated successfully',
            'data' => $resource->load('creator')
        ]);
    }

    /**
     * Delete the specified resource.
     */
    public function destroy(Resource $resource)
    {
        // Only creator or admin can delete
        if ($resource->created_by !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Delete file if exists
        if ($resource->file_url && \Storage::exists('public/' . $resource->file_url)) {
            \Storage::delete('public/' . $resource->file_url);
        }

        $resource->delete();

        return response()->json([
            'message' => 'Resource deleted successfully'
        ]);
    }
}
