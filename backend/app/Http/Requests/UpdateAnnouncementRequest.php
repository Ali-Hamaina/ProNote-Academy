<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin' || auth()->user()->role === 'formateur';
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:5000',
            'type' => 'sometimes|required|in:grade,schedule,general,workshop',
            'target_role' => 'sometimes|required|in:all,admin,formateur,stagiaire',
        ];
    }
}
