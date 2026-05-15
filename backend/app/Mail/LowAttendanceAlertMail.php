<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LowAttendanceAlertMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public string $studentName;
    public float $attendanceRate;
    public string $className;

    public function __construct(string $studentName, float $attendanceRate, string $className)
    {
        $this->studentName = $studentName;
        $this->attendanceRate = $attendanceRate;
        $this->className = $className;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Attendance Alert - ' . $this->className,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.low-attendance-alert',
            with: [
                'student_name' => $this->studentName,
                'attendance_rate' => $this->attendanceRate,
                'class_name' => $this->className,
            ],
        );
    }
}
