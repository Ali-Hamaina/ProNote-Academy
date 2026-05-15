<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin' || auth()->user()->role === 'formateur';
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'type' => 'required|in:cheat_sheet,article,video,pdf,code',
            'file' => 'nullable|file|max:10240',
            'external_url' => 'nullable|url',
        ];
    }

    public function messages(): array
    {
        return [
            'file.max' => 'File size cannot exceed 10MB.',
            'type.in' => 'Resource type must be a valid option.',
        ];
    }
}
