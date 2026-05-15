<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'formateur';
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'module_id' => 'required|exists:modules,id',
            'grade_value' => 'required|numeric|min:0|max:20',
            'feedback' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'grade_value.numeric' => 'Grade must be a number.',
            'grade_value.min' => 'Grade must be at least 0.',
            'grade_value.max' => 'Grade cannot exceed 20.',
        ];
    }
}
