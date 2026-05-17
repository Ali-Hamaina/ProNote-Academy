<?php

namespace App\Http\Controllers;

use App\Models\Session;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    /**
     * Display a listing of sessions.
     */
    public function index(Request $request)
    {
        $query = Session::with('classModel', 'module', 'instructor');

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->has('date')) {
            $query->whereDate('start_time', $request->date);
        }

        $perPage = $request->get('per_page', 15);
        $sessions = $query->orderBy('start_time')->paginate($perPage);

        return response()->json([
            'data' => $sessions->items(),
            'pagination' => [
                'current_page' => $sessions->currentPage(),
                'per_page' => $sessions->perPage(),
                'total' => $sessions->total(),
                'last_page' => $sessions->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created session.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'module_id' => 'nullable|exists:modules,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'start_time' => 'required|date_format:Y-m-d H:i:s',
            'end_time' => 'required|date_format:Y-m-d H:i:s|after:start_time',
            'location' => 'nullable|string|max:255',
            'room' => 'nullable|string|max:50',
            'is_online' => 'boolean',
            'meeting_link' => 'nullable|url',
        ]);

        $validated['instructor_id'] = auth()->id();
        $session = Session::create($validated);

        return response()->json([
            'message' => 'Session created successfully',
            'data' => $session->load('classModel', 'module', 'instructor')
        ], 201);
    }

    /**
     * Display the specified session.
     */
    public function show(Session $session)
    {
        return response()->json([
            'data' => $session->load('classModel', 'module', 'instructor')
        ]);
    }

    /**
     * Update the specified session.
     */
    public function update(Request $request, Session $session)
    {
        // Only instructor can update their sessions
        if ($session->instructor_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'start_time' => 'sometimes|required|date_format:Y-m-d H:i:s',
            'end_time' => 'sometimes|required|date_format:Y-m-d H:i:s|after:start_time',
            'location' => 'nullable|string|max:255',
            'room' => 'nullable|string|max:50',
            'is_online' => 'boolean',
            'meeting_link' => 'nullable|url',
        ]);

        $session->update($validated);

        return response()->json([
            'message' => 'Session updated successfully',
            'data' => $session->load('classModel', 'module', 'instructor')
        ]);
    }

    /**
     * Delete the specified session.
     */
    public function destroy(Session $session)
    {
        // Only instructor can delete their sessions
        if ($session->instructor_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $session->delete();

        return response()->json([
            'message' => 'Session deleted successfully'
        ]);
    }

    /**
     * Get user's schedule (for all roles).
     */
    public function userSchedule(Request $request)
    {
        $user = auth()->user();
        $date = $request->get('date', now()->toDateString());

        if ($user->role === 'formateur') {
            // Formateur sees sessions they teach
            $sessions = Session::where('instructor_id', $user->id)
                ->whereDate('start_time', $date)
                ->with('classModel', 'module')
                ->orderBy('start_time')
                ->get();
        } else if ($user->role === 'stagiaire') {
            // Student sees sessions for enrolled classes
            $enrolledClassIds = $user->enrolledClasses()->pluck('classes.id');
            $sessions = Session::whereIn('class_id', $enrolledClassIds)
                ->whereDate('start_time', $date)
                ->with('classModel', 'module', 'instructor')
                ->orderBy('start_time')
                ->get();
        } else {
            // Admin sees all sessions
            $sessions = Session::whereDate('start_time', $date)
                ->with('classModel', 'module', 'instructor')
                ->orderBy('start_time')
                ->get();
        }

        return response()->json([
            'data' => $sessions
        ]);
    }
}
