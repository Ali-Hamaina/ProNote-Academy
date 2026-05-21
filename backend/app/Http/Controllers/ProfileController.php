<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Display the authenticated user's profile.
     */
    public function show()
    {
        $user = auth()->user();

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
                'status' => $user->status,
                'phone' => $user->phone,
                'bio' => $user->bio,
                'last_login_at' => $user->last_login_at,
                'created_at' => $user->created_at,
            ]
        ]);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id . '|max:255',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:1000',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    }

    /**
     * Upload user avatar.
     */
    public function uploadAvatar(Request $request)
    {
        $validated = $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = auth()->user();

        // Delete old avatar if exists
        if ($user->avatar_url && \Storage::exists('public/' . $user->avatar_url)) {
            \Storage::delete('public/' . $user->avatar_url);
        }

        // Store new avatar
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar_url' => $path]);

        return response()->json([
            'message' => 'Avatar uploaded successfully',
            'data' => [
                'avatar_url' => $path,
            ]
        ]);
    }

    /**
     * Change password.
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|regex:/[A-Z]/|regex:/[0-9]/',
            'password_confirmation' => 'required|same:password',
        ]);

        $user = auth()->user();

        // Verify current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'error' => 'Current password is incorrect'
            ], 422);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        return response()->json([
            'message' => 'Password changed successfully'
        ]);
    }
}
