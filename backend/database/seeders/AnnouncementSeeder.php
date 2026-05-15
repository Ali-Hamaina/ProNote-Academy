<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $announcements = [
            ['title'=>'Bienvenue à ProNote Academy','description'=>'Bienvenue à tous les nouveaux stagiaires ! Consultez votre emploi du temps.','type'=>'general','posted_by'=>1,'class_id'=>null,'target_role'=>'all'],
            ['title'=>'Mise à jour du planning','description'=>'Le planning de la semaine prochaine a été mis à jour.','type'=>'schedule','posted_by'=>1,'class_id'=>null,'target_role'=>'all'],
            ['title'=>'Notes du Module HTML/CSS','description'=>'Les notes du premier module sont disponibles.','type'=>'grade','posted_by'=>3,'class_id'=>1,'target_role'=>'stagiaire'],
            ['title'=>'Workshop React avancé','description'=>'Un workshop React aura lieu vendredi de 14h à 17h.','type'=>'workshop','posted_by'=>3,'class_id'=>1,'target_role'=>'stagiaire'],
            ['title'=>'Examen de mi-parcours','description'=>'L\'examen de mi-parcours aura lieu le 20 mai.','type'=>'general','posted_by'=>3,'class_id'=>1,'target_role'=>'stagiaire'],
            ['title'=>'Projet Design Final','description'=>'Le projet final de design est à rendre le 30 mai.','type'=>'general','posted_by'=>4,'class_id'=>2,'target_role'=>'stagiaire'],
            ['title'=>'Certification Docker','description'=>'Inscription à la certification Docker ouverte.','type'=>'workshop','posted_by'=>5,'class_id'=>3,'target_role'=>'stagiaire'],
            ['title'=>'Hackathon Data Science','description'=>'Participez au hackathon Data Science ce weekend !','type'=>'workshop','posted_by'=>6,'class_id'=>4,'target_role'=>'all'],
            ['title'=>'Réunion formateurs','description'=>'Réunion pédagogique mardi à 16h.','type'=>'general','posted_by'=>1,'class_id'=>null,'target_role'=>'formateur'],
            ['title'=>'Maintenance serveur','description'=>'Maintenance prévue samedi de 2h à 6h.','type'=>'general','posted_by'=>1,'class_id'=>null,'target_role'=>'all'],
            ['title'=>'Notes Module Design','description'=>'Notes du module Principes du Design publiées.','type'=>'grade','posted_by'=>4,'class_id'=>2,'target_role'=>'stagiaire'],
            ['title'=>'Nouveau cours Mobile','description'=>'Nouveau module Flutter disponible.','type'=>'general','posted_by'=>7,'class_id'=>5,'target_role'=>'stagiaire'],
            ['title'=>'Vacances de printemps','description'=>'Les vacances de printemps sont du 1 au 7 juin.','type'=>'schedule','posted_by'=>1,'class_id'=>null,'target_role'=>'all'],
            ['title'=>'Stage en entreprise','description'=>'Les stages commencent en juillet, préparez vos CV.','type'=>'general','posted_by'=>1,'class_id'=>null,'target_role'=>'stagiaire'],
            ['title'=>'Résultats DevOps','description'=>'Notes du module Linux Administration publiées.','type'=>'grade','posted_by'=>5,'class_id'=>3,'target_role'=>'stagiaire'],
            ['title'=>'Conférence IA','description'=>'Conférence sur l\'IA le 25 mai à 10h.','type'=>'workshop','posted_by'=>6,'class_id'=>null,'target_role'=>'all'],
            ['title'=>'Mise à jour bibliothèque','description'=>'Nouvelles ressources ajoutées à la bibliothèque.','type'=>'general','posted_by'=>1,'class_id'=>null,'target_role'=>'all'],
            ['title'=>'Rappel présence','description'=>'La présence est obligatoire pour tous les modules.','type'=>'general','posted_by'=>1,'class_id'=>null,'target_role'=>'stagiaire'],
            ['title'=>'Notes Python','description'=>'Notes du module Python fondamental publiées.','type'=>'grade','posted_by'=>6,'class_id'=>15,'target_role'=>'stagiaire'],
            ['title'=>'Journée portes ouvertes','description'=>'Journée portes ouvertes le 28 mai.','type'=>'general','posted_by'=>1,'class_id'=>null,'target_role'=>'all'],
        ];

        foreach ($announcements as $a) {
            Announcement::create($a);
        }
    }
}
