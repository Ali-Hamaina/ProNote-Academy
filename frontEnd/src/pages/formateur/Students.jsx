import { useState, useEffect } from 'react';
import { Card, Badge, PageHeader } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { User, Loader2 } from 'lucide-react';
import dashboardService from '../../services/dashboardService';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try { const r = await dashboardService.getFormateurStudents(); const d = r.data || r; setStudents(Array.isArray(d) ? d : d.data || []); } catch { setStudents([]); }
            setLoading(false);
        };
        fetch();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Formateur', to: '/formateur/dashboard' }, { label: 'Students' }]} />
            <PageHeader title="My Students" subtitle="View students enrolled in your classes." />
            <Card padding="none">
                <div className="overflow-x-auto"><table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800"><tr><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Student</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Class</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Average</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Attendance</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Status</th></tr></thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {students.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No students found</td></tr>}
                        {students.map((s, i) => (<tr key={s.id||i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                            <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><User className="w-5 h-5" /></div><div><p className="font-semibold">{s.name}</p><p className="text-xs text-slate-500">{s.email}</p></div></div></td>
                            <td className="px-6 py-4 text-slate-500">{s.class?.name || '—'}</td>
                            <td className="px-6 py-4 font-bold">{s.average || '—'}</td>
                            <td className="px-6 py-4">{s.attendance_rate || '—'}</td>
                            <td className="px-6 py-4"><Badge variant={s.status === 'active' ? 'success' : 'warning'} size="sm">{s.status || 'Active'}</Badge></td>
                        </tr>))}
                    </tbody>
                </table></div>
            </Card>
        </div>
    );
};

export default Students;
