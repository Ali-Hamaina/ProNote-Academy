<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreModuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'class_id' => 'required|exists:classes,id',
            'name' => 'required|string|max:255',
            'block_number' => 'required|integer|min:1',
            'hours' => 'required|integer|min:1',
            'description' => 'nullable|string|max:1000',
            'instructor_id' => 'required|exists:users,id',
            'status' => 'nullable|in:draft,published,archived',
        ];
    }
}
