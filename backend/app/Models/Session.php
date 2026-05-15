<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $table = 'class_sessions';

    protected $fillable = [
        'class_id',
        'module_id',
        'title',
        'description',
        'start_time',
        'end_time',
        'location',
        'room',
        'is_online',
        'meeting_link',
        'instructor_id',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'is_online' => 'boolean',
        ];
    }

    /**
     * Get the class for this session.
     */
    public function classModel()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    /**
     * Get the module for this session.
     */
    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the instructor for this session.
     */
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
