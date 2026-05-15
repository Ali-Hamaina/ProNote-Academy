<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin' || auth()->user()->role === 'formateur';
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'type' => 'required|in:grade,schedule,general,workshop',
            'class_id' => 'nullable|exists:classes,id',
            'target_role' => 'required|in:all,admin,formateur,stagiaire',
        ];
    }
}
