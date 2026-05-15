<?php

namespace App\Mail;

use App\Models\Grade;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GradePostedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Grade $grade;

    public function __construct(Grade $grade)
    {
        $this->grade = $grade;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Grade Posted - ' . $this->grade->module->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.grade-posted',
            with: [
                'student_name' => $this->grade->student->name,
                'module_name' => $this->grade->module->name,
                'grade_value' => $this->grade->grade_value,
                'feedback' => $this->grade->feedback,
                'grader_name' => $this->grade->grader->name,
            ],
        );
    }
}
