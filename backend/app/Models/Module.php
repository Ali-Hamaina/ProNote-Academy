<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'name',
        'block_number',
        'hours',
        'description',
        'instructor_id',
        'status',
        'order_position',
    ];

    /**
     * Get the class for this module.
     */
    public function classModel()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    /**
     * Get the instructor for this module.
     */
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Get the grades for this module.
     */
    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    /**
     * Get the sessions for this module.
     */
    public function sessions()
    {
        return $this->hasMany(Session::class);
    }
}
