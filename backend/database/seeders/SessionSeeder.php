<?php

namespace Database\Seeders;

use App\Models\Session;
use Illuminate\Database\Seeder;

class SessionSeeder extends Seeder
{
    public function run(): void
    {
        $sessions = [
            ['class_id'=>1,'module_id'=>1,'title'=>'Introduction HTML5','description'=>'Balises sémantiques et structure.','start_time'=>'2026-05-12 08:30:00','end_time'=>'2026-05-12 12:30:00','location'=>'Campus A','room'=>'Salle 101','is_online'=>false,'meeting_link'=>null,'instructor_id'=>3],
            ['class_id'=>1,'module_id'=>2,'title'=>'Variables & Fonctions JS','description'=>'ES6 let/const, arrow functions.','start_time'=>'2026-05-13 08:30:00','end_time'=>'2026-05-13 12:30:00','location'=>'Campus A','room'=>'Salle 101','is_online'=>false,'meeting_link'=>null,'instructor_id'=>3],
            ['class_id'=>1,'module_id'=>3,'title'=>'React Hooks','description'=>'useState et useEffect en pratique.','start_time'=>'2026-05-14 08:30:00','end_time'=>'2026-05-14 12:30:00','location'=>'Campus A','room'=>'Salle 101','is_online'=>false,'meeting_link'=>null,'instructor_id'=>3],
            ['class_id'=>1,'module_id'=>3,'title'=>'React Router & Context','description'=>'Navigation et state global.','start_time'=>'2026-05-15 08:30:00','end_time'=>'2026-05-15 12:30:00','location'=>null,'room'=>null,'is_online'=>true,'meeting_link'=>'https://meet.pronote.com/react-adv','instructor_id'=>3],
            ['class_id'=>2,'module_id'=>5,'title'=>'Théorie des couleurs','description'=>'Palettes et harmonie.','start_time'=>'2026-05-12 14:00:00','end_time'=>'2026-05-12 17:00:00','location'=>'Campus B','room'=>'Atelier Design','is_online'=>false,'meeting_link'=>null,'instructor_id'=>4],
            ['class_id'=>2,'module_id'=>6,'title'=>'Figma Workshop','description'=>'Prototypage interactif.','start_time'=>'2026-05-14 14:00:00','end_time'=>'2026-05-14 17:00:00','location'=>'Campus B','room'=>'Atelier Design','is_online'=>false,'meeting_link'=>null,'instructor_id'=>4],
            ['class_id'=>3,'module_id'=>8,'title'=>'Linux CLI Basics','description'=>'Terminal, fichiers, permissions.','start_time'=>'2026-05-12 08:30:00','end_time'=>'2026-05-12 12:30:00','location'=>'Campus A','room'=>'Lab 201','is_online'=>false,'meeting_link'=>null,'instructor_id'=>5],
            ['class_id'=>3,'module_id'=>9,'title'=>'Docker Compose','description'=>'Multi-conteneurs et réseaux.','start_time'=>'2026-05-13 14:00:00','end_time'=>'2026-05-13 17:00:00','location'=>null,'room'=>null,'is_online'=>true,'meeting_link'=>'https://meet.pronote.com/docker','instructor_id'=>5],
            ['class_id'=>3,'module_id'=>10,'title'=>'GitHub Actions CI','description'=>'Workflows automatisés.','start_time'=>'2026-05-15 08:30:00','end_time'=>'2026-05-15 12:30:00','location'=>'Campus A','room'=>'Lab 201','is_online'=>false,'meeting_link'=>null,'instructor_id'=>5],
            ['class_id'=>4,'module_id'=>11,'title'=>'Pandas DataFrames','description'=>'Manipulation de données.','start_time'=>'2026-05-12 14:00:00','end_time'=>'2026-05-12 17:00:00','location'=>'Campus A','room'=>'Salle 301','is_online'=>false,'meeting_link'=>null,'instructor_id'=>6],
            ['class_id'=>4,'module_id'=>12,'title'=>'Régression linéaire','description'=>'Premier modèle ML.','start_time'=>'2026-05-14 08:30:00','end_time'=>'2026-05-14 12:30:00','location'=>'Campus A','room'=>'Salle 301','is_online'=>false,'meeting_link'=>null,'instructor_id'=>6],
            ['class_id'=>5,'module_id'=>13,'title'=>'React Native Setup','description'=>'Env de développement mobile.','start_time'=>'2026-05-13 08:30:00','end_time'=>'2026-05-13 12:30:00','location'=>'Campus B','room'=>'Lab Mobile','is_online'=>false,'meeting_link'=>null,'instructor_id'=>7],
            ['class_id'=>5,'module_id'=>14,'title'=>'Flutter Widgets','description'=>'Arbre de widgets et layout.','start_time'=>'2026-05-15 14:00:00','end_time'=>'2026-05-15 17:00:00','location'=>null,'room'=>null,'is_online'=>true,'meeting_link'=>'https://meet.pronote.com/flutter','instructor_id'=>7],
            ['class_id'=>10,'module_id'=>15,'title'=>'Custom Hooks','description'=>'Créer ses propres hooks.','start_time'=>'2026-05-16 08:30:00','end_time'=>'2026-05-16 12:30:00','location'=>'Campus A','room'=>'Salle 101','is_online'=>false,'meeting_link'=>null,'instructor_id'=>3],
            ['class_id'=>10,'module_id'=>16,'title'=>'Redux Toolkit','description'=>'Store, slices et thunks.','start_time'=>'2026-05-17 08:30:00','end_time'=>'2026-05-17 12:30:00','location'=>'Campus A','room'=>'Salle 101','is_online'=>false,'meeting_link'=>null,'instructor_id'=>3],
            ['class_id'=>11,'module_id'=>17,'title'=>'Routes & Controllers','description'=>'Laravel routing system.','start_time'=>'2026-05-16 14:00:00','end_time'=>'2026-05-16 17:00:00','location'=>'Campus A','room'=>'Salle 102','is_online'=>false,'meeting_link'=>null,'instructor_id'=>3],
            ['class_id'=>11,'module_id'=>18,'title'=>'Sanctum Auth','description'=>'API authentication.','start_time'=>'2026-05-17 14:00:00','end_time'=>'2026-05-17 17:00:00','location'=>null,'room'=>null,'is_online'=>true,'meeting_link'=>'https://meet.pronote.com/laravel','instructor_id'=>3],
            ['class_id'=>15,'module_id'=>19,'title'=>'Python Types & Loops','description'=>'Structures de base.','start_time'=>'2026-05-12 08:30:00','end_time'=>'2026-05-12 12:30:00','location'=>'Campus A','room'=>'Salle 301','is_online'=>false,'meeting_link'=>null,'instructor_id'=>6],
            ['class_id'=>15,'module_id'=>20,'title'=>'Python OOP','description'=>'Classes et héritage.','start_time'=>'2026-05-14 14:00:00','end_time'=>'2026-05-14 17:00:00','location'=>'Campus A','room'=>'Salle 301','is_online'=>false,'meeting_link'=>null,'instructor_id'=>6],
            ['class_id'=>1,'module_id'=>4,'title'=>'Express.js APIs','description'=>'Créer une API REST.','start_time'=>'2026-05-19 08:30:00','end_time'=>'2026-05-19 12:30:00','location'=>'Campus A','room'=>'Salle 101','is_online'=>false,'meeting_link'=>null,'instructor_id'=>3],
        ];

        foreach ($sessions as $session) {
            Session::create($session);
        }
    }
}
