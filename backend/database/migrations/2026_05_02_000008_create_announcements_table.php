<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('type', ['grade', 'schedule', 'general', 'workshop'])->default('general');
            $table->foreignId('posted_by')->constrained('users')->onDelete('restrict');
            $table->foreignId('class_id')->nullable()->constrained('classes')->onDelete('cascade');
            $table->enum('target_role', ['all', 'admin', 'formateur', 'stagiaire'])->default('all');
            $table->timestamps();

            $table->index('posted_by');
            $table->index('class_id');
            $table->index('type');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
