<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ClassModel;
use App\Models\Attendance;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $formateur;
    protected User $student;
    protected ClassModel $class;

    protected function setUp(): void
    {
        parent::setUp();
        $this->formateur = User::factory()->create(['role' => 'formateur']);
        $this->student = User::factory()->create(['role' => 'stagiaire']);
        $this->class = ClassModel::factory()->create(['instructor_id' => $this->formateur->id]);
    }

    public function test_formateur_can_mark_attendance()
    {
        $response = $this->actingAs($this->formateur)
            ->postJson('/api/attendance', [
                'user_id' => $this->student->id,
                'class_id' => $this->class->id,
                'session_date' => now()->toDateString(),
                'status' => 'present',
                'notes' => 'Attended class',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('attendance', [
            'user_id' => $this->student->id,
            'status' => 'present',
        ]);
    }

    public function test_formateur_can_update_attendance()
    {
        $attendance = Attendance::factory()->create([
            'user_id' => $this->student->id,
            'class_id' => $this->class->id,
            'status' => 'absent',
        ]);

        $response = $this->actingAs($this->formateur)
            ->postJson('/api/attendance', [
                'user_id' => $this->student->id,
                'class_id' => $this->class->id,
                'session_date' => $attendance->session_date,
                'status' => 'present',
            ]);

        $response->assertStatus(200);
    }

    public function test_student_can_view_own_attendance()
    {
        Attendance::factory()->create(['user_id' => $this->student->id]);

        $response = $this->actingAs($this->student)
            ->getJson('/api/stagiaire/attendance');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'pagination']);
    }

    public function test_formateur_can_get_class_attendance_rate()
    {
        Attendance::factory()->count(5)->create(['class_id' => $this->class->id, 'status' => 'present']);
        Attendance::factory()->count(2)->create(['class_id' => $this->class->id, 'status' => 'absent']);

        $response = $this->actingAs($this->formateur)
            ->getJson("/api/attendance/class/{$this->class->id}/rate");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['present', 'absent', 'total', 'rate']]);
    }
}
