<?php

namespace Database\Seeders;

use App\Models\Attendance;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $records = [
            ['user_id'=>8,'class_id'=>1,'session_date'=>'2026-05-05','status'=>'present','marked_by'=>3,'notes'=>null],
            ['user_id'=>9,'class_id'=>1,'session_date'=>'2026-05-05','status'=>'present','marked_by'=>3,'notes'=>null],
            ['user_id'=>11,'class_id'=>1,'session_date'=>'2026-05-05','status'=>'absent','marked_by'=>3,'notes'=>'Non justifié'],
            ['user_id'=>20,'class_id'=>1,'session_date'=>'2026-05-05','status'=>'present','marked_by'=>3,'notes'=>null],
            ['user_id'=>8,'class_id'=>1,'session_date'=>'2026-05-07','status'=>'present','marked_by'=>3,'notes'=>null],
            ['user_id'=>9,'class_id'=>1,'session_date'=>'2026-05-07','status'=>'excused','marked_by'=>3,'notes'=>'Rendez-vous médical'],
            ['user_id'=>11,'class_id'=>1,'session_date'=>'2026-05-07','status'=>'present','marked_by'=>3,'notes'=>null],
            ['user_id'=>10,'class_id'=>2,'session_date'=>'2026-05-06','status'=>'present','marked_by'=>4,'notes'=>null],
            ['user_id'=>9,'class_id'=>2,'session_date'=>'2026-05-06','status'=>'present','marked_by'=>4,'notes'=>null],
            ['user_id'=>18,'class_id'=>2,'session_date'=>'2026-05-06','status'=>'absent','marked_by'=>4,'notes'=>null],
            ['user_id'=>8,'class_id'=>3,'session_date'=>'2026-05-05','status'=>'present','marked_by'=>5,'notes'=>null],
            ['user_id'=>12,'class_id'=>3,'session_date'=>'2026-05-05','status'=>'present','marked_by'=>5,'notes'=>null],
            ['user_id'=>12,'class_id'=>3,'session_date'=>'2026-05-08','status'=>'present','marked_by'=>5,'notes'=>null],
            ['user_id'=>11,'class_id'=>4,'session_date'=>'2026-05-06','status'=>'present','marked_by'=>6,'notes'=>null],
            ['user_id'=>13,'class_id'=>4,'session_date'=>'2026-05-06','status'=>'present','marked_by'=>6,'notes'=>null],
            ['user_id'=>14,'class_id'=>5,'session_date'=>'2026-05-07','status'=>'present','marked_by'=>7,'notes'=>null],
            ['user_id'=>10,'class_id'=>5,'session_date'=>'2026-05-07','status'=>'excused','marked_by'=>7,'notes'=>'Justifié'],
            ['user_id'=>12,'class_id'=>10,'session_date'=>'2026-05-08','status'=>'present','marked_by'=>3,'notes'=>null],
            ['user_id'=>19,'class_id'=>10,'session_date'=>'2026-05-08','status'=>'absent','marked_by'=>3,'notes'=>null],
            ['user_id'=>17,'class_id'=>15,'session_date'=>'2026-05-09','status'=>'present','marked_by'=>6,'notes'=>null],
        ];

        foreach ($records as $record) {
            Attendance::create($record);
        }
    }
}
