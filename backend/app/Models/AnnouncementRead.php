<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnouncementRead extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'announcement_id',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    /**
     * Get the user for this read record.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the announcement for this read record.
     */
    public function announcement()
    {
        return $this->belongsTo(Announcement::class);
    }
}
