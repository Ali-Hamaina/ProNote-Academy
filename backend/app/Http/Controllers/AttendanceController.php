<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    /**
     * Display a listing of attendance records (formateur view).
     */
    public function index(Request $request)
    {
        $query = Attendance::with('user', 'classModel', 'marker');

        // Formateurs can only see attendance for their own classes
        if (auth()->user()->role === 'formateur') {
            $formateurClassIds = \App\Models\ClassModel::where('instructor_id', auth()->id())->pluck('id');
            $query->whereIn('class_id', $formateurClassIds);
        }

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->has('session_date')) {
            $query->where('session_date', $request->session_date);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 15);
        $attendance = $query->paginate($perPage);

        return response()->json([
            'data' => $attendance->items(),
            'pagination' => [
                'current_page' => $attendance->currentPage(),
                'per_page' => $attendance->perPage(),
                'total' => $attendance->total(),
                'last_page' => $attendance->lastPage(),
            ]
        ]);
    }

    /**
     * Store attendance record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'class_id' => 'required|exists:classes,id',
            'session_date' => 'required|date',
            'status' => 'required|in:present,absent,excused',
            'notes' => 'nullable|string|max:500',
        ]);

        // Check if attendance already marked for this user on this date
        $existing = Attendance::where('user_id', $validated['user_id'])
            ->where('class_id', $validated['class_id'])
            ->where('session_date', $validated['session_date'])
            ->first();

        if ($existing) {
            // Update instead of creating duplicate
            $existing->update([
                'status' => $validated['status'],
                'notes' => $validated['notes'] ?? $existing->notes,
                'marked_by' => auth()->id(),
            ]);

            return response()->json([
                'message' => 'Attendance updated successfully',
                'data' => $existing->load('user', 'classModel', 'marker')
            ]);
        }

        $validated['marked_by'] = auth()->id();
        $attendance = Attendance::create($validated);

        return response()->json([
            'message' => 'Attendance marked successfully',
            'data' => $attendance->load('user', 'classModel', 'marker')
        ], 201);
    }

    /**
     * Get attendance for a specific user.
     */
    public function userAttendance(Request $request, $userId)
    {
        // Students can only see their own attendance
        if (auth()->user()->role === 'stagiaire' && auth()->id() !== $userId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $attendance = Attendance::where('user_id', $userId)
            ->with('classModel')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $attendance->items(),
            'pagination' => [
                'current_page' => $attendance->currentPage(),
                'per_page' => $attendance->perPage(),
                'total' => $attendance->total(),
                'last_page' => $attendance->lastPage(),
            ]
        ]);
    }

    /**
     * Get student's own attendance record.
     */
    public function studentAttendance(Request $request)
    {
        $userId = auth()->id();
        $attendance = Attendance::where('user_id', $userId)
            ->with('classModel')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $attendance->items(),
            'pagination' => [
                'current_page' => $attendance->currentPage(),
                'per_page' => $attendance->perPage(),
                'total' => $attendance->total(),
                'last_page' => $attendance->lastPage(),
            ]
        ]);
    }

    /**
     * Get attendance rate for a class.
     */
    public function classRate($classId)
    {
        // Formateurs can only view rates for their own classes
        if (auth()->user()->role === 'formateur') {
            $class = \App\Models\ClassModel::find($classId);
            if (!$class || $class->instructor_id !== auth()->id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
        }

        $totalRecords = Attendance::where('class_id', $classId)->count();
        $presentCount = Attendance::where('class_id', $classId)
            ->where('status', 'present')
            ->count();

        $rate = $totalRecords > 0 ? round(($presentCount / $totalRecords) * 100, 2) : 0;

        return response()->json([
            'data' => [
                'class_id' => $classId,
                'attendance_rate' => $rate,
                'rate' => $rate,
                'present' => $presentCount,
                'absent' => max($totalRecords - $presentCount, 0),
                'total_records' => $totalRecords,
                'total' => $totalRecords,
            ]
        ]);
    }
}
