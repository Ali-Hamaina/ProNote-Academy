<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Announcement;
use App\Models\AnnouncementRead;

class NotificationService
{
    /**
     * Create a notification.
     */
    public function create(int $userId, array $data): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'announcement_id' => $data['announcement_id'] ?? null,
            'title' => $data['title'],
            'message' => $data['message'],
            'type' => $data['type'] ?? 'system',
        ]);
    }

    /**
     * Create notifications for multiple users.
     */
    public function createBatch(array $userIds, array $data): void
    {
        foreach ($userIds as $userId) {
            $this->create($userId, $data);
        }
    }

    /**
     * Get unread count for user.
     */
    public function getUnreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(int $notificationId): Notification
    {
        $notification = Notification::find($notificationId);
        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return $notification;
    }

    /**
     * Mark all notifications as read for user.
     */
    public function markAllAsRead(int $userId): void
    {
        Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * Create announcement notification.
     */
    public function notifyAnnouncement(Announcement $announcement): void
    {
        // Determine target users based on role
        $userIds = match($announcement->target_role) {
            'admin' => \App\Models\User::where('role', 'admin')->pluck('id'),
            'formateur' => \App\Models\User::where('role', 'formateur')->pluck('id'),
            'stagiaire' => \App\Models\User::where('role', 'stagiaire')->pluck('id'),
            default => \App\Models\User::pluck('id'),
        };

        $this->createBatch($userIds->toArray(), [
            'announcement_id' => $announcement->id,
            'title' => $announcement->title,
            'message' => $announcement->description,
            'type' => 'announcement',
        ]);
    }

    /**
     * Get recent notifications for user.
     */
    public function getRecent(int $userId, int $limit = 10): array
    {
        return Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }
}
