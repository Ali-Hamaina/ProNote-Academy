<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'posted_by',
        'class_id',
        'target_role',
    ];

    /**
     * Get the user who posted this announcement.
     */
    public function postedBy()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    /**
     * Get the class for this announcement.
     */
    public function classModel()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    /**
     * Get the read records for this announcement.
     */
    public function reads()
    {
        return $this->hasMany(AnnouncementRead::class);
    }

    /**
     * Check if announcement is read by a user.
     */
    public function isReadBy($userId)
    {
        return $this->reads()->where('user_id', $userId)->exists();
    }
}
