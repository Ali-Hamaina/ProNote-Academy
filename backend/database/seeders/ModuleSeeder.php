<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            // Class 1: Développement Full Stack (instructor 3)
            ['class_id' => 1, 'name' => 'HTML5 & CSS3 Fondamentaux', 'block_number' => 1, 'hours' => 40, 'description' => 'Structure web et mise en page moderne.', 'instructor_id' => 3, 'status' => 'published', 'order_position' => 1],
            ['class_id' => 1, 'name' => 'JavaScript ES6+', 'block_number' => 2, 'hours' => 50, 'description' => 'Programmation JavaScript avancée.', 'instructor_id' => 3, 'status' => 'published', 'order_position' => 2],
            ['class_id' => 1, 'name' => 'React.js Avancé', 'block_number' => 3, 'hours' => 60, 'description' => 'Hooks, Context, Router et state management.', 'instructor_id' => 3, 'status' => 'published', 'order_position' => 3],
            ['class_id' => 1, 'name' => 'Node.js & Express', 'block_number' => 4, 'hours' => 50, 'description' => 'Backend avec Node.js, API REST.', 'instructor_id' => 3, 'status' => 'draft', 'order_position' => 4],

            // Class 2: UX/UI Design (instructor 4)
            ['class_id' => 2, 'name' => 'Principes du Design', 'block_number' => 1, 'hours' => 30, 'description' => 'Théorie des couleurs, typographie et grilles.', 'instructor_id' => 4, 'status' => 'published', 'order_position' => 1],
            ['class_id' => 2, 'name' => 'Wireframing & Prototypage', 'block_number' => 2, 'hours' => 35, 'description' => 'Création de maquettes avec Figma.', 'instructor_id' => 4, 'status' => 'published', 'order_position' => 2],
            ['class_id' => 2, 'name' => 'Design System', 'block_number' => 3, 'hours' => 40, 'description' => 'Composants réutilisables et guides de style.', 'instructor_id' => 4, 'status' => 'draft', 'order_position' => 3],

            // Class 3: DevOps (instructor 5)
            ['class_id' => 3, 'name' => 'Linux Administration', 'block_number' => 1, 'hours' => 45, 'description' => 'Administration système Linux.', 'instructor_id' => 5, 'status' => 'published', 'order_position' => 1],
            ['class_id' => 3, 'name' => 'Docker & Conteneurs', 'block_number' => 2, 'hours' => 40, 'description' => 'Conteneurisation et orchestration.', 'instructor_id' => 5, 'status' => 'published', 'order_position' => 2],
            ['class_id' => 3, 'name' => 'CI/CD Pipelines', 'block_number' => 3, 'hours' => 35, 'description' => 'Jenkins, GitHub Actions, GitLab CI.', 'instructor_id' => 5, 'status' => 'published', 'order_position' => 3],

            // Class 4: Data Science (instructor 6)
            ['class_id' => 4, 'name' => 'Python pour Data Science', 'block_number' => 1, 'hours' => 50, 'description' => 'NumPy, Pandas, Matplotlib.', 'instructor_id' => 6, 'status' => 'published', 'order_position' => 1],
            ['class_id' => 4, 'name' => 'Machine Learning Bases', 'block_number' => 2, 'hours' => 55, 'description' => 'Scikit-learn, régression, classification.', 'instructor_id' => 6, 'status' => 'published', 'order_position' => 2],

            // Class 5: Mobile Dev (instructor 7)
            ['class_id' => 5, 'name' => 'React Native Fondamentaux', 'block_number' => 1, 'hours' => 45, 'description' => 'Développement cross-platform.', 'instructor_id' => 7, 'status' => 'published', 'order_position' => 1],
            ['class_id' => 5, 'name' => 'Flutter & Dart', 'block_number' => 2, 'hours' => 50, 'description' => 'Développement avec Flutter framework.', 'instructor_id' => 7, 'status' => 'draft', 'order_position' => 2],

            // Class 10: React Masterclass (instructor 3)
            ['class_id' => 10, 'name' => 'React Hooks Deep Dive', 'block_number' => 1, 'hours' => 40, 'description' => 'useState, useEffect, useReducer, custom hooks.', 'instructor_id' => 3, 'status' => 'published', 'order_position' => 1],
            ['class_id' => 10, 'name' => 'State Management', 'block_number' => 2, 'hours' => 35, 'description' => 'Redux Toolkit, Zustand, Jotai.', 'instructor_id' => 3, 'status' => 'published', 'order_position' => 2],

            // Class 11: Laravel (instructor 3)
            ['class_id' => 11, 'name' => 'Laravel Fondamentaux', 'block_number' => 1, 'hours' => 45, 'description' => 'Routing, Controllers, Eloquent ORM.', 'instructor_id' => 3, 'status' => 'published', 'order_position' => 1],
            ['class_id' => 11, 'name' => 'API REST Laravel', 'block_number' => 2, 'hours' => 40, 'description' => 'Sanctum, Resources, Middleware.', 'instructor_id' => 3, 'status' => 'published', 'order_position' => 2],

            // Class 15: Python (instructor 6)
            ['class_id' => 15, 'name' => 'Python Fondamental', 'block_number' => 1, 'hours' => 50, 'description' => 'Syntaxe, types, structures de contrôle.', 'instructor_id' => 6, 'status' => 'published', 'order_position' => 1],
            ['class_id' => 15, 'name' => 'Python Avancé', 'block_number' => 2, 'hours' => 45, 'description' => 'POO, décorateurs, générateurs, asyncio.', 'instructor_id' => 6, 'status' => 'published', 'order_position' => 2],
        ];

        foreach ($modules as $module) {
            Module::create($module);
        }
    }
}
