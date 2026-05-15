<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8|regex:/[A-Z]/|regex:/[0-9]/',
            'role' => 'required|in:admin,formateur,stagiaire',
            'status' => 'nullable|in:active,inactive',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'password.regex' => 'Password must contain at least one uppercase letter and one number.',
            'role.in' => 'Role must be admin, formateur, or stagiaire.',
        ];
    }
}
