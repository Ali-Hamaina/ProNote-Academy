<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        // user_id 8-20 are stagiaires, class_id 1-20
        $enrollments = [
            ['user_id' => 8,  'class_id' => 1,  'status' => 'active',    'progress' => 65, 'enrolled_at' => '2026-01-15 09:00:00'],
            ['user_id' => 8,  'class_id' => 3,  'status' => 'active',    'progress' => 30, 'enrolled_at' => '2026-02-01 09:00:00'],
            ['user_id' => 9,  'class_id' => 1,  'status' => 'active',    'progress' => 72, 'enrolled_at' => '2026-01-15 09:00:00'],
            ['user_id' => 9,  'class_id' => 2,  'status' => 'active',    'progress' => 45, 'enrolled_at' => '2026-01-20 09:00:00'],
            ['user_id' => 10, 'class_id' => 2,  'status' => 'active',    'progress' => 80, 'enrolled_at' => '2026-01-10 09:00:00'],
            ['user_id' => 10, 'class_id' => 5,  'status' => 'active',    'progress' => 20, 'enrolled_at' => '2026-03-01 09:00:00'],
            ['user_id' => 11, 'class_id' => 1,  'status' => 'active',    'progress' => 55, 'enrolled_at' => '2026-01-15 09:00:00'],
            ['user_id' => 11, 'class_id' => 4,  'status' => 'active',    'progress' => 40, 'enrolled_at' => '2026-02-10 09:00:00'],
            ['user_id' => 12, 'class_id' => 3,  'status' => 'active',    'progress' => 60, 'enrolled_at' => '2026-01-20 09:00:00'],
            ['user_id' => 12, 'class_id' => 10, 'status' => 'active',    'progress' => 35, 'enrolled_at' => '2026-03-05 09:00:00'],
            ['user_id' => 13, 'class_id' => 4,  'status' => 'active',    'progress' => 50, 'enrolled_at' => '2026-02-01 09:00:00'],
            ['user_id' => 14, 'class_id' => 5,  'status' => 'active',    'progress' => 70, 'enrolled_at' => '2026-01-25 09:00:00'],
            ['user_id' => 15, 'class_id' => 1,  'status' => 'completed', 'progress' => 100, 'enrolled_at' => '2025-09-01 09:00:00', 'completed_at' => '2026-01-15 17:00:00'],
            ['user_id' => 15, 'class_id' => 11, 'status' => 'active',    'progress' => 25, 'enrolled_at' => '2026-02-15 09:00:00'],
            ['user_id' => 16, 'class_id' => 11, 'status' => 'active',    'progress' => 45, 'enrolled_at' => '2026-02-15 09:00:00'],
            ['user_id' => 17, 'class_id' => 15, 'status' => 'active',    'progress' => 60, 'enrolled_at' => '2026-01-10 09:00:00'],
            ['user_id' => 18, 'class_id' => 2,  'status' => 'active',    'progress' => 30, 'enrolled_at' => '2026-03-01 09:00:00'],
            ['user_id' => 19, 'class_id' => 10, 'status' => 'active',    'progress' => 55, 'enrolled_at' => '2026-02-01 09:00:00'],
            ['user_id' => 19, 'class_id' => 3,  'status' => 'dropped',   'progress' => 15, 'enrolled_at' => '2026-01-15 09:00:00'],
            ['user_id' => 20, 'class_id' => 1,  'status' => 'active',    'progress' => 40, 'enrolled_at' => '2026-02-20 09:00:00'],
        ];

        foreach ($enrollments as $enrollment) {
            Enrollment::create($enrollment);
        }
    }
}
