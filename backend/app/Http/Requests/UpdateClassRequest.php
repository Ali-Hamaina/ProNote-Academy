<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClassRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin';
    }

    public function rules(): array
    {
        $classId = $this->route('class')->id;

        return [
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|unique:classes,code,' . $classId . '|max:50',
            'description' => 'nullable|string|max:1000',
            'instructor_id' => 'sometimes|required|exists:users,id',
            'max_students' => 'nullable|integer|min:1|max:500',
            'status' => 'sometimes|in:active,inactive,archived',
        ];
    }
}
