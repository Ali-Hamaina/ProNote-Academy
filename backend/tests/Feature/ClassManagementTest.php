<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ClassModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClassManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_create_class()
    {
        $instructor = User::factory()->create(['role' => 'formateur']);

        $response = $this->actingAs($this->admin)
            ->postJson('/api/classes', [
                'name' => 'Web Development 101',
                'code' => 'WEB-101',
                'instructor_id' => $instructor->id,
                'description' => 'Learn web development',
                'max_students' => 30,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'data']);

        $this->assertDatabaseHas('classes', [
            'code' => 'WEB-101',
        ]);
    }

    public function test_admin_can_list_classes()
    {
        ClassModel::factory()->count(5)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/classes');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'pagination']);
    }

    public function test_admin_can_update_class()
    {
        $class = ClassModel::factory()->create();

        $response = $this->actingAs($this->admin)
            ->putJson("/api/classes/{$class->id}", [
                'name' => 'Updated Class Name',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('classes', [
            'id' => $class->id,
            'name' => 'Updated Class Name',
        ]);
    }

    public function test_admin_can_delete_class()
    {
        $class = ClassModel::factory()->create();

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/classes/{$class->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('classes', ['id' => $class->id]);
    }

    public function test_non_admin_cannot_create_class()
    {
        $formateur = User::factory()->create(['role' => 'formateur']);

        $response = $this->actingAs($formateur)
            ->postJson('/api/classes', [
                'name' => 'Test Class',
                'code' => 'TEST-101',
                'instructor_id' => $formateur->id,
            ]);

        $response->assertStatus(403);
    }
}
