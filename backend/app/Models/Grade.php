<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'module_id',
        'grade_value',
        'feedback',
        'graded_by',
        'graded_at',
    ];

    protected function casts(): array
    {
        return [
            'grade_value' => 'decimal:2',
            'graded_at' => 'datetime',
        ];
    }

    /**
     * Get the student for this grade.
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the module for this grade.
     */
    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the grader (instructor) for this grade.
     */
    public function grader()
    {
        return $this->belongsTo(User::class, 'graded_by');
    }

    /**
     * Scope: Get grades for a specific student.
     */
    public function scopeForStudent($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
