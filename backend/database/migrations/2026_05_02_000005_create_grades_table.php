<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->decimal('grade_value', 4, 2);
            $table->text('feedback')->nullable();
            $table->foreignId('graded_by')->constrained('users')->onDelete('restrict');
            $table->timestamp('graded_at')->useCurrent();
            $table->timestamps();

            $table->unique(['user_id', 'module_id']);
            $table->index('user_id');
            $table->index('module_id');
            $table->index('graded_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
