<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEnrollmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'status' => 'sometimes|required|in:active,completed,dropped',
            'progress' => 'sometimes|required|integer|min:0|max:100',
        ];
    }
}
