<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     * Each seeder inserts ~20 rows into its respective table.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,           // 20 users (2 admins, 5 formateurs, 13 stagiaires)
            ClassSeeder::class,          // 20 classes
            ModuleSeeder::class,         // 20 modules
            EnrollmentSeeder::class,     // 20 enrollments
            GradeSeeder::class,          // 20 grades
            AttendanceSeeder::class,     // 20 attendance records
            SessionSeeder::class,        // 20 class sessions
            AnnouncementSeeder::class,   // 20 announcements
            AnnouncementReadSeeder::class, // 20 announcement reads
            NotificationSeeder::class,   // 20 notifications
            TaskSeeder::class,           // 20 tasks
            ResourceSeeder::class,       // 20 resources
        ]);
    }
}
