<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'formateur';
    }

    public function rules(): array
    {
        return [
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
        ];
    }

    public function messages(): array
    {
        return [
            'end_time.after' => 'End time must be after start time.',
        ];
    }
}
