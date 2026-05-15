<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:classes,code|max:50',
            'description' => 'nullable|string|max:1000',
            'instructor_id' => 'required|exists:users,id',
            'max_students' => 'nullable|integer|min:1|max:500',
            'status' => 'nullable|in:active,inactive,archived',
        ];
    }
}
