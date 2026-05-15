<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Module;
use App\Models\Grade;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GradeManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $formateur;
    protected User $student;
    protected Module $module;

    protected function setUp(): void
    {
        parent::setUp();
        $this->formateur = User::factory()->create(['role' => 'formateur']);
        $this->student = User::factory()->create(['role' => 'stagiaire']);
        $this->module = Module::factory()->create(['instructor_id' => $this->formateur->id]);
    }

    public function test_formateur_can_post_grade()
    {
        $response = $this->actingAs($this->formateur)
            ->postJson('/api/grades', [
                'user_id' => $this->student->id,
                'module_id' => $this->module->id,
                'grade_value' => 16.5,
                'feedback' => 'Excellent work!',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'data']);

        $this->assertDatabaseHas('grades', [
            'user_id' => $this->student->id,
            'module_id' => $this->module->id,
            'grade_value' => 16.5,
        ]);
    }

    public function test_grade_must_be_between_0_and_20()
    {
        $response = $this->actingAs($this->formateur)
            ->postJson('/api/grades', [
                'user_id' => $this->student->id,
                'module_id' => $this->module->id,
                'grade_value' => 25,
            ]);

        $response->assertStatus(422);
    }

    public function test_student_can_view_own_grades()
    {
        Grade::factory()->create([
            'user_id' => $this->student->id,
            'module_id' => $this->module->id,
        ]);

        $response = $this->actingAs($this->student)
            ->getJson('/api/stagiaire/grades');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'pagination']);
    }

    public function test_student_can_view_grade_statistics()
    {
        Grade::factory()->count(3)->create(['user_id' => $this->student->id]);

        $response = $this->actingAs($this->student)
            ->getJson('/api/grades/statistics');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['average', 'highest', 'lowest', 'modules_graded']]);
    }

    public function test_non_formateur_cannot_post_grade()
    {
        $response = $this->actingAs($this->student)
            ->postJson('/api/grades', [
                'user_id' => $this->student->id,
                'module_id' => $this->module->id,
                'grade_value' => 16.5,
            ]);

        $response->assertStatus(403);
    }
}
