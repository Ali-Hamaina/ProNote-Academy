<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->onDelete('cascade');
            $table->string('name');
            $table->integer('block_number');
            $table->integer('hours');
            $table->text('description')->nullable();
            $table->foreignId('instructor_id')->constrained('users')->onDelete('restrict');
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->integer('order_position')->default(0);
            $table->timestamps();

            $table->index('class_id');
            $table->index('status');
            $table->unique(['class_id', 'block_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
