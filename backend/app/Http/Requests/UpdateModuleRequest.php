<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateModuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'block_number' => 'sometimes|required|integer|min:1',
            'hours' => 'sometimes|required|integer|min:1',
            'description' => 'nullable|string|max:1000',
            'instructor_id' => 'sometimes|required|exists:users,id',
            'status' => 'sometimes|in:draft,published,archived',
        ];
    }
}
