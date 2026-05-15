<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AnnouncementRead;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of announcements.
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = Announcement::query()
            ->where('target_role', 'all')
            ->orWhere('target_role', $user->role);

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('class_id')) {
            $query->orWhere('class_id', $request->class_id);
        }

        $perPage = $request->get('per_page', 15);
        $announcements = $query->with('postedBy')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Add read status for current user
        $announcements->getCollection()->transform(function ($announcement) use ($user) {
            $announcement->is_read = $announcement->isReadBy($user->id);
            return $announcement;
        });

        return response()->json([
            'data' => $announcements->items(),
            'pagination' => [
                'current_page' => $announcements->currentPage(),
                'per_page' => $announcements->perPage(),
                'total' => $announcements->total(),
                'last_page' => $announcements->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created announcement.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'type' => 'required|in:grade,schedule,general,workshop',
            'class_id' => 'nullable|exists:classes,id',
            'target_role' => 'required|in:all,admin,formateur,stagiaire',
        ]);

        $validated['posted_by'] = auth()->id();
        $announcement = Announcement::create($validated);

        return response()->json([
            'message' => 'Announcement posted successfully',
            'data' => $announcement->load('postedBy')
        ], 201);
    }

    /**
     * Update the specified announcement.
     */
    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);

        // Only creator or admin can update
        if ($announcement->posted_by !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:5000',
            'type' => 'sometimes|required|in:grade,schedule,general,workshop',
            'target_role' => 'sometimes|required|in:all,admin,formateur,stagiaire',
        ]);

        $announcement->update($validated);

        return response()->json([
            'message' => 'Announcement updated successfully',
            'data' => $announcement->load('postedBy')
        ]);
    }

    /**
     * Delete the specified announcement.
     */
    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);

        // Only creator or admin can delete
        if ($announcement->posted_by !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $announcement->delete();

        return response()->json([
            'message' => 'Announcement deleted successfully'
        ]);
    }

    /**
     * Mark announcement as read.
     */
    public function markAsRead($id)
    {
        $announcement = Announcement::findOrFail($id);
        $userId = auth()->id();

        AnnouncementRead::updateOrCreate(
            ['user_id' => $userId, 'announcement_id' => $announcement->id],
            ['read_at' => now()]
        );

        return response()->json([
            'message' => 'Announcement marked as read'
        ]);
    }

    /**
     * Mark all announcements as read.
     */
    public function markAllAsRead()
    {
        $userId = auth()->id();
        $announcements = Announcement::all();

        foreach ($announcements as $announcement) {
            AnnouncementRead::updateOrCreate(
                ['user_id' => $userId, 'announcement_id' => $announcement->id],
                ['read_at' => now()]
            );
        }

        return response()->json([
            'message' => 'All announcements marked as read'
        ]);
    }
}
