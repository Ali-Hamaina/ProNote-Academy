<?php

namespace Database\Seeders;

use App\Models\Grade;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    public function run(): void
    {
        $grades = [
            ['user_id'=>8,'module_id'=>1,'grade_value'=>15.50,'feedback'=>'Excellent travail HTML/CSS.','graded_by'=>3,'graded_at'=>'2026-03-10 14:00:00'],
            ['user_id'=>8,'module_id'=>2,'grade_value'=>14.00,'feedback'=>'Bonne compréhension JS.','graded_by'=>3,'graded_at'=>'2026-04-05 14:00:00'],
            ['user_id'=>9,'module_id'=>1,'grade_value'=>17.25,'feedback'=>'Travail remarquable.','graded_by'=>3,'graded_at'=>'2026-03-10 14:30:00'],
            ['user_id'=>9,'module_id'=>2,'grade_value'=>16.00,'feedback'=>'Très bon niveau en JS.','graded_by'=>3,'graded_at'=>'2026-04-05 14:30:00'],
            ['user_id'=>11,'module_id'=>1,'grade_value'=>12.75,'feedback'=>'Peut mieux faire.','graded_by'=>3,'graded_at'=>'2026-03-10 15:00:00'],
            ['user_id'=>11,'module_id'=>2,'grade_value'=>13.50,'feedback'=>'En progrès.','graded_by'=>3,'graded_at'=>'2026-04-05 15:00:00'],
            ['user_id'=>10,'module_id'=>5,'grade_value'=>18.00,'feedback'=>'Sens artistique exceptionnel.','graded_by'=>4,'graded_at'=>'2026-03-15 10:00:00'],
            ['user_id'=>10,'module_id'=>6,'grade_value'=>16.50,'feedback'=>'Prototypes de haute qualité.','graded_by'=>4,'graded_at'=>'2026-04-10 10:00:00'],
            ['user_id'=>9,'module_id'=>5,'grade_value'=>14.25,'feedback'=>'Bon début en design.','graded_by'=>4,'graded_at'=>'2026-03-15 10:30:00'],
            ['user_id'=>8,'module_id'=>8,'grade_value'=>13.00,'feedback'=>'Linux à améliorer.','graded_by'=>5,'graded_at'=>'2026-03-20 11:00:00'],
            ['user_id'=>12,'module_id'=>8,'grade_value'=>15.75,'feedback'=>'Bonne maîtrise Linux.','graded_by'=>5,'graded_at'=>'2026-03-20 11:30:00'],
            ['user_id'=>12,'module_id'=>9,'grade_value'=>14.50,'feedback'=>'Docker bien compris.','graded_by'=>5,'graded_at'=>'2026-04-15 11:00:00'],
            ['user_id'=>11,'module_id'=>11,'grade_value'=>16.25,'feedback'=>'Excellent en Python.','graded_by'=>6,'graded_at'=>'2026-04-01 09:00:00'],
            ['user_id'=>13,'module_id'=>11,'grade_value'=>14.75,'feedback'=>'Revoir DataFrames.','graded_by'=>6,'graded_at'=>'2026-04-01 09:30:00'],
            ['user_id'=>14,'module_id'=>13,'grade_value'=>17.00,'feedback'=>'Très bonne prise en main React Native.','graded_by'=>7,'graded_at'=>'2026-04-05 16:00:00'],
            ['user_id'=>12,'module_id'=>15,'grade_value'=>15.00,'feedback'=>'Hooks bien maîtrisés.','graded_by'=>3,'graded_at'=>'2026-04-20 14:00:00'],
            ['user_id'=>19,'module_id'=>15,'grade_value'=>13.75,'feedback'=>'Continuer la pratique.','graded_by'=>3,'graded_at'=>'2026-04-20 14:30:00'],
            ['user_id'=>15,'module_id'=>17,'grade_value'=>11.50,'feedback'=>'Revoir les bases Laravel.','graded_by'=>3,'graded_at'=>'2026-04-25 10:00:00'],
            ['user_id'=>16,'module_id'=>17,'grade_value'=>16.75,'feedback'=>'Excellente compréhension Eloquent.','graded_by'=>3,'graded_at'=>'2026-04-25 10:30:00'],
            ['user_id'=>17,'module_id'=>19,'grade_value'=>15.25,'feedback'=>'Bon niveau Python.','graded_by'=>6,'graded_at'=>'2026-04-10 15:00:00'],
        ];

        foreach ($grades as $grade) {
            Grade::create($grade);
        }
    }
}
