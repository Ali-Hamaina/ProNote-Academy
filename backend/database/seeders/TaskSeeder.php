<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $tasks = [
            ['user_id'=>3,'title'=>'Préparer examen JS','description'=>'Rédiger les questions pour l\'examen JavaScript.','status'=>'pending','priority'=>'high','due_date'=>'2026-05-20'],
            ['user_id'=>3,'title'=>'Corriger TP React','description'=>'Corriger les travaux pratiques React du groupe 1.','status'=>'pending','priority'=>'high','due_date'=>'2026-05-18'],
            ['user_id'=>3,'title'=>'Mettre à jour le cours Node.js','description'=>'Ajouter Express.js middleware section.','status'=>'completed','priority'=>'medium','due_date'=>'2026-05-10'],
            ['user_id'=>4,'title'=>'Évaluer projets design','description'=>'Évaluer les maquettes Figma des étudiants.','status'=>'pending','priority'=>'high','due_date'=>'2026-05-22'],
            ['user_id'=>4,'title'=>'Préparer workshop couleurs','description'=>'Créer support pour le workshop théorie des couleurs.','status'=>'completed','priority'=>'medium','due_date'=>'2026-05-08'],
            ['user_id'=>5,'title'=>'Configurer lab Docker','description'=>'Préparer les machines pour le TP Docker.','status'=>'completed','priority'=>'high','due_date'=>'2026-05-12'],
            ['user_id'=>5,'title'=>'Rédiger quiz CI/CD','description'=>'Quiz sur GitHub Actions.','status'=>'pending','priority'=>'medium','due_date'=>'2026-05-25'],
            ['user_id'=>6,'title'=>'Préparer dataset ML','description'=>'Nettoyer le dataset pour le TP Machine Learning.','status'=>'pending','priority'=>'high','due_date'=>'2026-05-19'],
            ['user_id'=>6,'title'=>'Corriger examens Python','description'=>'Corriger les copies de l\'examen Python.','status'=>'pending','priority'=>'high','due_date'=>'2026-05-17'],
            ['user_id'=>7,'title'=>'Tester apps Flutter','description'=>'Tester les applications Flutter des étudiants.','status'=>'pending','priority'=>'medium','due_date'=>'2026-05-23'],
            ['user_id'=>1,'title'=>'Planifier réunion','description'=>'Organiser la réunion pédagogique mensuelle.','status'=>'completed','priority'=>'medium','due_date'=>'2026-05-08'],
            ['user_id'=>1,'title'=>'Rapport statistiques','description'=>'Générer rapport de présence mensuel.','status'=>'pending','priority'=>'low','due_date'=>'2026-05-30'],
            ['user_id'=>8,'title'=>'TP JavaScript','description'=>'Compléter le TP sur les Promises et async/await.','status'=>'pending','priority'=>'high','due_date'=>'2026-05-16'],
            ['user_id'=>9,'title'=>'Projet React','description'=>'Développer le dashboard React pour le projet final.','status'=>'pending','priority'=>'high','due_date'=>'2026-05-28'],
            ['user_id'=>10,'title'=>'Maquette Figma','description'=>'Finaliser la maquette mobile pour le projet design.','status'=>'pending','priority'=>'high','due_date'=>'2026-05-25'],
            ['user_id'=>11,'title'=>'Exercices Pandas','description'=>'Compléter les exercices sur les DataFrames.','status'=>'pending','priority'=>'medium','due_date'=>'2026-05-20'],
            ['user_id'=>12,'title'=>'TP Docker','description'=>'Créer un Dockerfile multi-stage.','status'=>'completed','priority'=>'medium','due_date'=>'2026-05-12'],
            ['user_id'=>13,'title'=>'Notebook ML','description'=>'Soumettre le Jupyter notebook du TP classification.','status'=>'pending','priority'=>'high','due_date'=>'2026-05-21'],
            ['user_id'=>14,'title'=>'App React Native','description'=>'Développer l\'écran d\'accueil de l\'app mobile.','status'=>'pending','priority'=>'medium','due_date'=>'2026-05-24'],
            ['user_id'=>15,'title'=>'API Laravel','description'=>'Créer les endpoints CRUD pour le projet.','status'=>'pending','priority'=>'high','due_date'=>'2026-05-26'],
        ];

        foreach ($tasks as $task) {
            Task::create($task);
        }
    }
}
