<?php

namespace Database\Seeders;

use App\Models\ClassModel;
use Illuminate\Database\Seeder;

class ClassSeeder extends Seeder
{
    public function run(): void
    {
        $classes = [
            ['name' => 'Développement Full Stack', 'code' => 'DEV-FS-2026', 'description' => 'Formation complète en développement web Full Stack avec React, Node.js et bases de données.', 'instructor_id' => 3, 'max_students' => 25, 'status' => 'active'],
            ['name' => 'UX/UI Design Avancé', 'code' => 'DES-UX-2026', 'description' => 'Conception d\'interfaces utilisateur modernes avec Figma, Adobe XD et prototypage avancé.', 'instructor_id' => 4, 'max_students' => 20, 'status' => 'active'],
            ['name' => 'DevOps & Cloud Computing', 'code' => 'DEV-OPS-2026', 'description' => 'Infrastructure as Code, CI/CD, Docker, Kubernetes et services cloud AWS/Azure.', 'instructor_id' => 5, 'max_students' => 20, 'status' => 'active'],
            ['name' => 'Data Science & Analytics', 'code' => 'DAT-SCI-2026', 'description' => 'Analyse de données, machine learning, Python, pandas, et visualisation.', 'instructor_id' => 6, 'max_students' => 22, 'status' => 'active'],
            ['name' => 'Développement Mobile', 'code' => 'DEV-MOB-2026', 'description' => 'Applications mobiles natives et cross-platform avec React Native et Flutter.', 'instructor_id' => 7, 'max_students' => 20, 'status' => 'active'],
            ['name' => 'Cybersécurité', 'code' => 'SEC-CYB-2026', 'description' => 'Sécurité des systèmes, tests de pénétration, et protection des données.', 'instructor_id' => 3, 'max_students' => 18, 'status' => 'active'],
            ['name' => 'Intelligence Artificielle', 'code' => 'IA-ML-2026', 'description' => 'Deep learning, réseaux de neurones, NLP et vision par ordinateur.', 'instructor_id' => 6, 'max_students' => 20, 'status' => 'active'],
            ['name' => 'Gestion de Projet Agile', 'code' => 'MGT-AGI-2026', 'description' => 'Méthodologies Scrum, Kanban, et gestion de projets informatiques.', 'instructor_id' => 4, 'max_students' => 30, 'status' => 'active'],
            ['name' => 'Bases de Données Avancées', 'code' => 'BDD-ADV-2026', 'description' => 'SQL avancé, NoSQL, optimisation, réplication et administration.', 'instructor_id' => 6, 'max_students' => 25, 'status' => 'active'],
            ['name' => 'Frontend React Masterclass', 'code' => 'FE-REA-2026', 'description' => 'React 19, hooks avancés, state management, SSR avec Next.js.', 'instructor_id' => 3, 'max_students' => 25, 'status' => 'active'],
            ['name' => 'Backend Laravel', 'code' => 'BE-LAR-2026', 'description' => 'API REST avec Laravel, Eloquent, middleware, queues et tests.', 'instructor_id' => 3, 'max_students' => 25, 'status' => 'active'],
            ['name' => 'Réseaux & Systèmes', 'code' => 'RES-SYS-2026', 'description' => 'Administration réseau, Linux, protocoles TCP/IP et virtualisation.', 'instructor_id' => 5, 'max_students' => 20, 'status' => 'active'],
            ['name' => 'Design Graphique', 'code' => 'DES-GRA-2026', 'description' => 'Création visuelle avec Photoshop, Illustrator et InDesign.', 'instructor_id' => 4, 'max_students' => 20, 'status' => 'active'],
            ['name' => 'E-Commerce & Marketing Digital', 'code' => 'ECO-MKT-2026', 'description' => 'Création de boutiques en ligne, SEO, publicité digitale et analytics.', 'instructor_id' => 7, 'max_students' => 25, 'status' => 'active'],
            ['name' => 'Programmation Python', 'code' => 'PRG-PYT-2026', 'description' => 'Python fondamental et avancé, scripting, automatisation et frameworks.', 'instructor_id' => 6, 'max_students' => 28, 'status' => 'active'],
            ['name' => 'IoT & Systèmes Embarqués', 'code' => 'IOT-EMB-2026', 'description' => 'Arduino, Raspberry Pi, capteurs et protocoles IoT.', 'instructor_id' => 7, 'max_students' => 15, 'status' => 'active'],
            ['name' => 'Angular & TypeScript', 'code' => 'FE-ANG-2026', 'description' => 'Angular 17+, TypeScript avancé, RxJS et NgRx.', 'instructor_id' => 3, 'max_students' => 22, 'status' => 'active'],
            ['name' => 'Tests & Qualité Logicielle', 'code' => 'QA-TST-2026', 'description' => 'Tests unitaires, intégration, E2E, TDD et CI/CD testing.', 'instructor_id' => 5, 'max_students' => 20, 'status' => 'active'],
            ['name' => 'Blockchain & Web3', 'code' => 'BLK-WEB-2026', 'description' => 'Solidity, smart contracts, DApps et technologies décentralisées.', 'instructor_id' => 5, 'max_students' => 18, 'status' => 'inactive'],
            ['name' => 'Communication Professionnelle', 'code' => 'COM-PRO-2026', 'description' => 'Soft skills, présentation, rédaction technique et travail d\'équipe.', 'instructor_id' => 4, 'max_students' => 35, 'status' => 'active'],
        ];

        foreach ($classes as $class) {
            ClassModel::create($class);
        }
    }
}
