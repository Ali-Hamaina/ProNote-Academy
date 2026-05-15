<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'formateur';
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'class_id' => 'required|exists:classes,id',
            'session_date' => 'required|date',
            'status' => 'required|in:present,absent,excused',
            'notes' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Status must be present, absent, or excused.',
        ];
    }
}
