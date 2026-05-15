import { useState, useEffect } from 'react';
import { Card, Badge, PageHeader, Button } from '../components/common';
import { Breadcrumbs } from '../components/layout';
import { Loader2 } from 'lucide-react';
import announcementService from '../services/announcementService';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await announcementService.getAll();
                const d = res.data || res;
                setNotifications(Array.isArray(d) ? d : d.data || []);
            } catch { setNotifications([]); }
            setLoading(false);
        };
        fetchNotifications();
    }, []);

    const getTypeIcon = (type) => ({ grade: 'grade', schedule: 'calendar_today', announcement: 'campaign', system: 'settings' }[type] || 'notifications');
    const getTypeColorClass = (type) => ({ grade: 'stat-icon-emerald', schedule: 'stat-icon-amber', announcement: 'stat-icon-blue', system: 'stat-icon-gray' }[type] || 'stat-icon-blue');

    const handleMarkRead = async (id) => {
        try {
            await announcementService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch { /* silent */ }
    };

    const handleMarkAllRead = async () => {
        try {
            await announcementService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch { /* silent */ }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Breadcrumbs items={[{ label: 'Notifications' }]} />
            <PageHeader title="Notifications" subtitle="Stay updated with your latest alerts and announcements.">
                <Button variant="ghost" icon="done_all" onClick={handleMarkAllRead}>Mark All Read</Button>
            </PageHeader>

            <div className="flex gap-4 flex-wrap">
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                    <span className="size-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">{unreadCount}</span> Unread
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-4 py-2 rounded-xl text-sm font-semibold">{notifications.length} Total</div>
            </div>

            <Card padding="none">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No notifications</p>}
                    {notifications.map((notification) => (
                        <div key={notification.id} onClick={() => !notification.read && handleMarkRead(notification.id)} className={`p-5 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
                            <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${getTypeColorClass(notification.type)}`}>
                                <span className="material-symbols-outlined text-[24px]">{getTypeIcon(notification.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className={`text-sm font-semibold ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{notification.title}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{notification.content || notification.desc || notification.description}</p>
                                    </div>
                                    {!notification.read && <span className="size-2.5 rounded-full bg-primary shrink-0 mt-1.5" />}
                                </div>
                                <p className="text-xs text-slate-400 mt-2 font-medium">{notification.created_at || notification.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Notifications;
