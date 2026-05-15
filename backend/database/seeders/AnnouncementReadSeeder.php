<?php

namespace Database\Seeders;

use App\Models\AnnouncementRead;
use Illuminate\Database\Seeder;

class AnnouncementReadSeeder extends Seeder
{
    public function run(): void
    {
        $reads = [
            ['user_id'=>8,'announcement_id'=>1,'read_at'=>'2026-05-01 09:15:00'],
            ['user_id'=>9,'announcement_id'=>1,'read_at'=>'2026-05-01 09:20:00'],
            ['user_id'=>10,'announcement_id'=>1,'read_at'=>'2026-05-01 10:00:00'],
            ['user_id'=>11,'announcement_id'=>1,'read_at'=>'2026-05-01 11:00:00'],
            ['user_id'=>8,'announcement_id'=>3,'read_at'=>'2026-05-05 14:30:00'],
            ['user_id'=>9,'announcement_id'=>3,'read_at'=>'2026-05-05 15:00:00'],
            ['user_id'=>11,'announcement_id'=>3,'read_at'=>'2026-05-06 08:00:00'],
            ['user_id'=>8,'announcement_id'=>4,'read_at'=>'2026-05-06 09:00:00'],
            ['user_id'=>10,'announcement_id'=>6,'read_at'=>'2026-05-07 10:00:00'],
            ['user_id'=>12,'announcement_id'=>7,'read_at'=>'2026-05-07 11:00:00'],
            ['user_id'=>3,'announcement_id'=>9,'read_at'=>'2026-05-08 16:30:00'],
            ['user_id'=>4,'announcement_id'=>9,'read_at'=>'2026-05-08 16:45:00'],
            ['user_id'=>5,'announcement_id'=>9,'read_at'=>'2026-05-08 17:00:00'],
            ['user_id'=>8,'announcement_id'=>10,'read_at'=>'2026-05-09 08:00:00'],
            ['user_id'=>13,'announcement_id'=>8,'read_at'=>'2026-05-09 09:00:00'],
            ['user_id'=>14,'announcement_id'=>12,'read_at'=>'2026-05-09 10:00:00'],
            ['user_id'=>15,'announcement_id'=>13,'read_at'=>'2026-05-10 08:00:00'],
            ['user_id'=>16,'announcement_id'=>14,'read_at'=>'2026-05-10 09:00:00'],
            ['user_id'=>17,'announcement_id'=>19,'read_at'=>'2026-05-11 10:00:00'],
            ['user_id'=>8,'announcement_id'=>2,'read_at'=>'2026-05-02 08:30:00'],
        ];

        foreach ($reads as $read) {
            AnnouncementRead::create($read);
        }
    }
}
