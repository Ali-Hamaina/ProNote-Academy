import { useState, useEffect } from 'react';
import { Card, Badge, PageHeader } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { Loader2, CheckCircle } from 'lucide-react';
import attendanceService from '../../services/attendanceService';

const MyAttendance = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try { const r = await attendanceService.getStudentAttendance(); const d = r.data || r; setRecords(Array.isArray(d) ? d : d.data || []); } catch { setRecords([]); }
            setLoading(false);
        };
        fetch();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const present = records.filter(r => r.status === 'present').length;
    const rate = records.length > 0 ? Math.round((present / records.length) * 100) : 0;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Breadcrumbs items={[{ label: 'My Attendance' }]} />
            <PageHeader title="My Attendance" subtitle="Track your attendance across all sessions." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card hover className="text-center"><div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 size-14 rounded-2xl flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-7 h-7" /></div><p className="text-slate-500 text-sm">Attendance Rate</p><p className="text-3xl font-bold text-emerald-600 mt-1">{rate}%</p></Card>
                <Card hover className="text-center"><p className="text-slate-500 text-sm">Sessions Attended</p><p className="text-3xl font-bold mt-1">{present}</p></Card>
                <Card hover className="text-center"><p className="text-slate-500 text-sm">Total Sessions</p><p className="text-3xl font-bold mt-1">{records.length}</p></Card>
            </div>
            <Card padding="none">
                <div className="overflow-x-auto"><table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800"><tr><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Module</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Date</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {records.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">No attendance records</td></tr>}
                        {records.map((r, i) => (<tr key={r.id||i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50"><td className="px-6 py-4 font-semibold">{r.class_model?.name || r.class?.name || r.session?.module?.name || r.module || '—'}</td><td className="px-6 py-4 text-slate-500">{r.session_date || r.date || r.created_at || ''}</td><td className="px-6 py-4"><Badge variant={r.status==='present'?'success':r.status==='late'?'warning':'danger'} size="sm">{r.status||'—'}</Badge></td></tr>))}
                    </tbody>
                </table></div>
            </Card>
        </div>
    );
};

export default MyAttendance;
