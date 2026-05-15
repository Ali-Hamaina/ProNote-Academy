<?php

namespace App\Mail;

use App\Models\Enrollment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EnrollmentConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Enrollment $enrollment;

    public function __construct(Enrollment $enrollment)
    {
        $this->enrollment = $enrollment;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Enrollment Confirmation - ' . $this->enrollment->class->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.enrollment-confirmation',
            with: [
                'student_name' => $this->enrollment->user->name,
                'class_name' => $this->enrollment->class->name,
                'class_code' => $this->enrollment->class->code,
                'instructor_name' => $this->enrollment->class->instructor->name,
                'enrollment_date' => $this->enrollment->created_at->format('M d, Y'),
            ],
        );
    }
}
