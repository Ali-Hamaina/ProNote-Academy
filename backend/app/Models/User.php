<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar_url',
        'status',
        'phone',
        'bio',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get the classes taught by this user (if instructor).
     */
    public function classes()
    {
        return $this->hasMany(ClassModel::class, 'instructor_id');
    }

    /**
     * Get the modules taught by this user (if instructor).
     */
    public function modulesTeaching()
    {
        return $this->hasMany(Module::class, 'instructor_id');
    }

    /**
     * Get the enrollments for this user (if student).
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get the classes enrolled by this student.
     */
    public function enrolledClasses()
    {
        return $this->hasManyThrough(ClassModel::class, Enrollment::class, 'user_id', 'id', 'id', 'class_id');
    }

    /**
     * Get the grades for this user.
     */
    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    /**
     * Get the grades given by this user (if instructor).
     */
    public function gradesGiven()
    {
        return $this->hasMany(Grade::class, 'graded_by');
    }

    /**
     * Get the attendance records for this user.
     */
    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Get the attendance records marked by this user.
     */
    public function attendanceMarked()
    {
        return $this->hasMany(Attendance::class, 'marked_by');
    }

    /**
     * Get the tasks for this user.
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get the announcements posted by this user.
     */
    public function announcementsPosts()
    {
        return $this->hasMany(Announcement::class, 'posted_by');
    }

    /**
     * Get the custom notifications for this user (not Laravel's built-in).
     */
    public function userNotifications()
    {
        return $this->hasMany(\App\Models\Notification::class);
    }

    /**
     * Get resources created by this user.
     */
    public function resources()
    {
        return $this->hasMany(Resource::class, 'created_by');
    }

    /**
     * Get sessions taught by this user.
     */
    public function sessions()
    {
        return $this->hasMany(Session::class, 'instructor_id');
    }

    /**
     * Scope: Filter by role.
     */
    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope: Filter by status.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
