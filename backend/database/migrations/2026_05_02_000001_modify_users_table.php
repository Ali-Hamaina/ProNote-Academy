<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('stagiaire')->after('password');
            $table->string('avatar_url')->nullable()->after('role');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('avatar_url');
            $table->string('phone')->nullable()->after('status');
            $table->text('bio')->nullable()->after('phone');
            $table->timestamp('last_login_at')->nullable()->after('bio');
            $table->index('role');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['status']);
            $table->dropColumn('role', 'avatar_url', 'status', 'phone', 'bio', 'last_login_at');
        });
    }
};
