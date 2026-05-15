<?php

namespace Database\Seeders;

use App\Models\Notification as NotificationModel;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $notifications = [
            ['user_id'=>8,'announcement_id'=>1,'title'=>'Bienvenue','message'=>'Bienvenue à ProNote Academy !','type'=>'announcement','is_read'=>true,'read_at'=>'2026-05-01 09:15:00'],
            ['user_id'=>9,'announcement_id'=>1,'title'=>'Bienvenue','message'=>'Bienvenue à ProNote Academy !','type'=>'announcement','is_read'=>true,'read_at'=>'2026-05-01 09:20:00'],
            ['user_id'=>10,'announcement_id'=>1,'title'=>'Bienvenue','message'=>'Bienvenue à ProNote Academy !','type'=>'announcement','is_read'=>true,'read_at'=>'2026-05-01 10:00:00'],
            ['user_id'=>8,'announcement_id'=>3,'title'=>'Notes publiées','message'=>'Notes du Module HTML/CSS disponibles.','type'=>'grade','is_read'=>true,'read_at'=>'2026-05-05 14:30:00'],
            ['user_id'=>9,'announcement_id'=>3,'title'=>'Notes publiées','message'=>'Notes du Module HTML/CSS disponibles.','type'=>'grade','is_read'=>true,'read_at'=>'2026-05-05 15:00:00'],
            ['user_id'=>11,'announcement_id'=>3,'title'=>'Notes publiées','message'=>'Notes du Module HTML/CSS disponibles.','type'=>'grade','is_read'=>false,'read_at'=>null],
            ['user_id'=>8,'announcement_id'=>4,'title'=>'Workshop React','message'=>'Un workshop React aura lieu vendredi.','type'=>'announcement','is_read'=>true,'read_at'=>'2026-05-06 09:00:00'],
            ['user_id'=>10,'announcement_id'=>6,'title'=>'Projet Design','message'=>'Projet final à rendre le 30 mai.','type'=>'announcement','is_read'=>true,'read_at'=>'2026-05-07 10:00:00'],
            ['user_id'=>12,'announcement_id'=>7,'title'=>'Certification Docker','message'=>'Inscription ouverte.','type'=>'announcement','is_read'=>false,'read_at'=>null],
            ['user_id'=>8,'announcement_id'=>null,'title'=>'Emploi du temps modifié','message'=>'Votre emploi du temps a été mis à jour.','type'=>'schedule','is_read'=>false,'read_at'=>null],
            ['user_id'=>13,'announcement_id'=>8,'title'=>'Hackathon','message'=>'Hackathon Data Science ce weekend.','type'=>'announcement','is_read'=>true,'read_at'=>'2026-05-09 09:00:00'],
            ['user_id'=>14,'announcement_id'=>null,'title'=>'Nouvelle note','message'=>'Vous avez reçu une nouvelle note en React Native.','type'=>'grade','is_read'=>false,'read_at'=>null],
            ['user_id'=>15,'announcement_id'=>null,'title'=>'Rappel devoir','message'=>'Devoir Laravel à rendre demain.','type'=>'system','is_read'=>false,'read_at'=>null],
            ['user_id'=>16,'announcement_id'=>null,'title'=>'Nouvelle note','message'=>'Vous avez reçu 16.75 en Laravel.','type'=>'grade','is_read'=>false,'read_at'=>null],
            ['user_id'=>17,'announcement_id'=>19,'title'=>'Notes Python','message'=>'Notes Python fondamental publiées.','type'=>'grade','is_read'=>true,'read_at'=>'2026-05-11 10:00:00'],
            ['user_id'=>19,'announcement_id'=>null,'title'=>'Nouvelle note','message'=>'Note hooks React disponible.','type'=>'grade','is_read'=>false,'read_at'=>null],
            ['user_id'=>3,'announcement_id'=>9,'title'=>'Réunion','message'=>'Réunion pédagogique mardi.','type'=>'announcement','is_read'=>true,'read_at'=>'2026-05-08 16:30:00'],
            ['user_id'=>4,'announcement_id'=>9,'title'=>'Réunion','message'=>'Réunion pédagogique mardi.','type'=>'announcement','is_read'=>true,'read_at'=>'2026-05-08 16:45:00'],
            ['user_id'=>8,'announcement_id'=>10,'title'=>'Maintenance','message'=>'Maintenance serveur samedi.','type'=>'system','is_read'=>true,'read_at'=>'2026-05-09 08:00:00'],
            ['user_id'=>20,'announcement_id'=>null,'title'=>'Bienvenue','message'=>'Bienvenue dans le cours Full Stack.','type'=>'system','is_read'=>false,'read_at'=>null],
        ];

        foreach ($notifications as $n) {
            NotificationModel::create($n);
        }
    }
}
