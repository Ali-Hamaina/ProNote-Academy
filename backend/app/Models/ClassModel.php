<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassModel extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'name',
        'code',
        'description',
        'instructor_id',
        'max_students',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the instructor for this class.
     */
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Get the modules for this class.
     */
    public function modules()
    {
        return $this->hasMany(Module::class, 'class_id', 'id')->orderBy('order_position');
    }

    /**
     * Get the enrollments for this class.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'class_id', 'id');
    }

    /**
     * Get the students enrolled in this class.
     */
    public function students()
    {
        return $this->hasManyThrough(User::class, Enrollment::class, 'class_id', 'id', 'id', 'user_id');
    }

    /**
     * Get the sessions for this class.
     */
    public function sessions()
    {
        return $this->hasMany(Session::class, 'class_id', 'id');
    }

    /**
     * Get the announcements for this class.
     */
    public function announcements()
    {
        return $this->hasMany(Announcement::class, 'class_id', 'id');
    }

    /**
     * Get the attendance records for this class.
     */
    public function attendance()
    {
        return $this->hasMany(Attendance::class, 'class_id', 'id');
    }

    /**
     * Get count of enrolled students.
     */
    public function getStudentCountAttribute()
    {
        return $this->enrollments()->where('status', 'active')->count();
    }
}
