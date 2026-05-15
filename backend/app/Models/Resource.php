<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'file_url',
        'external_url',
        'created_by',
    ];

    /**
     * Get the user who created this resource.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
