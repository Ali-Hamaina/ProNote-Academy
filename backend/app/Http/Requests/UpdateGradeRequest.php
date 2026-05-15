<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'formateur';
    }

    public function rules(): array
    {
        return [
            'grade_value' => 'sometimes|required|numeric|min:0|max:20',
            'feedback' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'grade_value.numeric' => 'Grade must be a number.',
            'grade_value.max' => 'Grade cannot exceed 20.',
        ];
    }
}
