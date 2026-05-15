<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ── Fixed test accounts (known credentials for login testing) ──

        // Admin accounts (2)
        User::create([
            'name' => 'Admin ProNote',
            'email' => 'admin@pronote.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
            'phone' => '+212 600-000001',
            'bio' => 'System administrator for ProNote Academy.',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@pronote.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
            'phone' => '+212 600-000020',
            'bio' => 'Senior system administrator.',
            'email_verified_at' => now(),
        ]);

        // Formateur accounts (5 instructors with known credentials)
        User::create([
            'name' => 'Prof. Ahmed Benali',
            'email' => 'formateur@pronote.com',
            'password' => Hash::make('password'),
            'role' => 'formateur',
            'status' => 'active',
            'phone' => '+212 600-000002',
            'bio' => 'Senior Instructor — Web Development & Software Engineering.',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Prof. Sara Idrissi',
            'email' => 'sara.idrissi@pronote.com',
            'password' => Hash::make('password'),
            'role' => 'formateur',
            'status' => 'active',
            'phone' => '+212 600-000003',
            'bio' => 'Instructor — UX/UI Design and Digital Arts.',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Prof. Youssef El Amrani',
            'email' => 'youssef.amrani@pronote.com',
            'password' => Hash::make('password'),
            'role' => 'formateur',
            'status' => 'active',
            'phone' => '+212 600-000004',
            'bio' => 'Instructor — DevOps, Cloud & Infrastructure.',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Prof. Fatima Zahra Bennani',
            'email' => 'fatima.bennani@pronote.com',
            'password' => Hash::make('password'),
            'role' => 'formateur',
            'status' => 'active',
            'phone' => '+212 600-000006',
            'bio' => 'Instructor — Database Administration & Data Science.',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Prof. Rachid Moussaoui',
            'email' => 'rachid.moussaoui@pronote.com',
            'password' => Hash::make('password'),
            'role' => 'formateur',
            'status' => 'active',
            'phone' => '+212 600-000007',
            'bio' => 'Instructor — Mobile Development & IoT.',
            'email_verified_at' => now(),
        ]);

        // Stagiaire accounts (13 students — total = 20 users)
        User::create([
            'name' => 'Karim Tazi',
            'email' => 'stagiaire@pronote.com',
            'password' => Hash::make('password'),
            'role' => 'stagiaire',
            'status' => 'active',
            'phone' => '+212 600-000005',
            'bio' => 'Second year student, Full Stack Development.',
            'email_verified_at' => now(),
        ]);

        $stagiaires = [
            ['name' => 'Amina Kabbaj', 'email' => 'amina.kabbaj@pronote.com', 'phone' => '+212 600-000008'],
            ['name' => 'Omar Fassi', 'email' => 'omar.fassi@pronote.com', 'phone' => '+212 600-000009'],
            ['name' => 'Layla Chraibi', 'email' => 'layla.chraibi@pronote.com', 'phone' => '+212 600-000010'],
            ['name' => 'Hassan Berrada', 'email' => 'hassan.berrada@pronote.com', 'phone' => '+212 600-000011'],
            ['name' => 'Nadia Hajji', 'email' => 'nadia.hajji@pronote.com', 'phone' => '+212 600-000012'],
            ['name' => 'Yassine Lahlou', 'email' => 'yassine.lahlou@pronote.com', 'phone' => '+212 600-000013'],
            ['name' => 'Salma Ouazzani', 'email' => 'salma.ouazzani@pronote.com', 'phone' => '+212 600-000014'],
            ['name' => 'Mehdi Alaoui', 'email' => 'mehdi.alaoui@pronote.com', 'phone' => '+212 600-000015'],
            ['name' => 'Zineb Tahiri', 'email' => 'zineb.tahiri@pronote.com', 'phone' => '+212 600-000016'],
            ['name' => 'Anas Bouzid', 'email' => 'anas.bouzid@pronote.com', 'phone' => '+212 600-000017'],
            ['name' => 'Khadija El Mansouri', 'email' => 'khadija.mansouri@pronote.com', 'phone' => '+212 600-000018'],
            ['name' => 'Reda Cherkaoui', 'email' => 'reda.cherkaoui@pronote.com', 'phone' => '+212 600-000019'],
        ];

        foreach ($stagiaires as $stagiaire) {
            User::create([
                'name' => $stagiaire['name'],
                'email' => $stagiaire['email'],
                'password' => Hash::make('password'),
                'role' => 'stagiaire',
                'status' => 'active',
                'phone' => $stagiaire['phone'],
                'bio' => 'Student at ProNote Academy.',
                'email_verified_at' => now(),
            ]);
        }
    }
}
