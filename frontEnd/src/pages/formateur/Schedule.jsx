import { useState, useEffect } from 'react';
import { Card, Button, Badge, PageHeader } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { Loader2, Plus, Calendar } from 'lucide-react';
import sessionService from '../../services/sessionService';

const Schedule = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try { const r = await sessionService.getAll(); const d = r.data || r; setSessions(Array.isArray(d) ? d : d.data || []); } catch { setSessions([]); }
            setLoading(false);
        };
        fetch();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Formateur', to: '/formateur/dashboard' }, { label: 'Schedule' }]} />
            <PageHeader title="Schedule Management" subtitle="Manage your teaching sessions and timetable."><Button icon={Plus}>New Session</Button></PageHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.length === 0 && <Card className="col-span-full text-center"><Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-400">No sessions scheduled</p></Card>}
                {sessions.map((s, i) => (
                    <Card key={s.id || i} hover className="group">
                        <div className="flex justify-between items-start mb-3">
                            <Badge variant={s.status === 'completed' ? 'success' : s.status === 'cancelled' ? 'danger' : 'primary'} size="sm">{s.status || 'Scheduled'}</Badge>
                            <span className="text-xs text-slate-400 font-medium">{s.date || ''}</span>
                        </div>
                        <h3 className="font-bold text-base mb-1">{s.title || s.module?.name || 'Session'}</h3>
                        <p className="text-sm text-slate-500 mb-3">{s.class_model?.name || s.class?.name || ''}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>{s.start_time || ''} - {s.end_time || ''}</span>
                            <span>{s.room || s.location || ''}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Schedule;
