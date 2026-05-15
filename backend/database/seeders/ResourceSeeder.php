<?php

namespace Database\Seeders;

use App\Models\Resource;
use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    public function run(): void
    {
        $resources = [
            ['title'=>'Cheat Sheet HTML5','description'=>'Référence rapide des balises HTML5.','type'=>'cheat_sheet','file_url'=>null,'external_url'=>'https://htmlcheatsheet.com','created_by'=>3],
            ['title'=>'Guide CSS Flexbox','description'=>'Guide complet sur CSS Flexbox.','type'=>'cheat_sheet','file_url'=>null,'external_url'=>'https://css-tricks.com/snippets/css/a-guide-to-flexbox/','created_by'=>3],
            ['title'=>'JavaScript ES6 PDF','description'=>'Document PDF sur les nouvelles fonctionnalités ES6.','type'=>'pdf','file_url'=>'/storage/resources/js-es6-guide.pdf','external_url'=>null,'created_by'=>3],
            ['title'=>'React Documentation','description'=>'Documentation officielle React.','type'=>'article','file_url'=>null,'external_url'=>'https://react.dev','created_by'=>3],
            ['title'=>'Node.js Best Practices','description'=>'Meilleures pratiques Node.js.','type'=>'article','file_url'=>null,'external_url'=>'https://github.com/goldbergyoni/nodebestpractices','created_by'=>3],
            ['title'=>'Cours Figma vidéo','description'=>'Tutoriel vidéo complet Figma.','type'=>'video','file_url'=>null,'external_url'=>'https://youtube.com/figma-tutorial','created_by'=>4],
            ['title'=>'Design Patterns UI','description'=>'Patterns de design d\'interface.','type'=>'pdf','file_url'=>'/storage/resources/ui-patterns.pdf','external_url'=>null,'created_by'=>4],
            ['title'=>'Color Theory Guide','description'=>'Guide théorie des couleurs pour le web.','type'=>'article','file_url'=>null,'external_url'=>'https://color.adobe.com/create/color-wheel','created_by'=>4],
            ['title'=>'Docker Cheat Sheet','description'=>'Commandes Docker essentielles.','type'=>'cheat_sheet','file_url'=>null,'external_url'=>'https://docs.docker.com/get-started/docker_cheatsheet.pdf','created_by'=>5],
            ['title'=>'Kubernetes Intro','description'=>'Introduction à Kubernetes.','type'=>'video','file_url'=>null,'external_url'=>'https://kubernetes.io/docs/tutorials/','created_by'=>5],
            ['title'=>'GitHub Actions Guide','description'=>'Guide CI/CD avec GitHub Actions.','type'=>'article','file_url'=>null,'external_url'=>'https://docs.github.com/en/actions','created_by'=>5],
            ['title'=>'Python Pandas Cheat Sheet','description'=>'Référence rapide Pandas.','type'=>'cheat_sheet','file_url'=>null,'external_url'=>'https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf','created_by'=>6],
            ['title'=>'Scikit-learn Tutorial','description'=>'Tutoriel Machine Learning.','type'=>'article','file_url'=>null,'external_url'=>'https://scikit-learn.org/stable/tutorial/','created_by'=>6],
            ['title'=>'SQL Cheat Sheet','description'=>'Référence SQL complète.','type'=>'cheat_sheet','file_url'=>null,'external_url'=>'https://www.sqltutorial.org/sql-cheat-sheet/','created_by'=>6],
            ['title'=>'React Native Expo Guide','description'=>'Démarrer avec Expo.','type'=>'article','file_url'=>null,'external_url'=>'https://docs.expo.dev','created_by'=>7],
            ['title'=>'Flutter Cookbook','description'=>'Recettes Flutter essentielles.','type'=>'article','file_url'=>null,'external_url'=>'https://docs.flutter.dev/cookbook','created_by'=>7],
            ['title'=>'Laravel API Tutorial','description'=>'Construire une API REST avec Laravel.','type'=>'video','file_url'=>null,'external_url'=>'https://laravel.com/docs/sanctum','created_by'=>3],
            ['title'=>'Git Workflow','description'=>'Guide Git Flow pour équipes.','type'=>'pdf','file_url'=>'/storage/resources/git-workflow.pdf','external_url'=>null,'created_by'=>5],
            ['title'=>'Clean Code Principles','description'=>'Principes de code propre.','type'=>'article','file_url'=>null,'external_url'=>'https://www.cleancoders.com','created_by'=>3],
            ['title'=>'Algorithmes & Structures','description'=>'Introduction aux algorithmes.','type'=>'pdf','file_url'=>'/storage/resources/algo-intro.pdf','external_url'=>null,'created_by'=>6],
        ];

        foreach ($resources as $resource) {
            Resource::create($resource);
        }
    }
}
