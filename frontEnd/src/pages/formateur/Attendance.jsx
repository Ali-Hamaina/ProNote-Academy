import { useState, useEffect } from 'react';
import { Card, Badge, Button, PageHeader } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { Loader2, Check, X } from 'lucide-react';
import classService from '../../services/classService';
import attendanceService from '../../services/attendanceService';

const Attendance = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [records, setRecords] = useState([]);
    const [rate, setRate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recordsLoading, setRecordsLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try { const r = await classService.getFormateurClasses(); const d = r.data || r; setClasses(Array.isArray(d) ? d : d.data || []); } catch {}
            setLoading(false);
        };
        fetch();
    }, []);

    useEffect(() => {
        if (!selectedClass) return;
        const fetch = async () => {
            setRecordsLoading(true);
            try {
                const [recRes, rateRes] = await Promise.all([attendanceService.getAll({ class_id: selectedClass }), attendanceService.getClassRate(selectedClass)]);
                const d = recRes.data || recRes; setRecords(Array.isArray(d) ? d : d.data || []);
                const rateData = rateRes.data || rateRes;
                setRate({
                    ...rateData,
                    rate: rateData.rate ?? rateData.attendance_rate ?? 0,
                    absent: rateData.absent ?? Math.max((rateData.total_records ?? rateData.total ?? 0) - (rateData.present ?? 0), 0),
                });
            } catch { setRecords([]); }
            setRecordsLoading(false);
        };
        fetch();
    }, [selectedClass]);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Formateur', to: '/formateur/dashboard' }, { label: 'Attendance' }]} />
            <PageHeader title="Attendance Management" subtitle="Mark and track student attendance for your classes.">
                <Button icon={Check}>Mark Attendance</Button>
            </PageHeader>
            <div className="flex gap-3 flex-wrap">
                {classes.map(c => (<button key={c.id} onClick={() => setSelectedClass(c.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedClass === c.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'}`}>{c.name}</button>))}
            </div>
            {rate && <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card hover className="text-center"><p className="text-slate-500 text-sm">Overall Rate</p><p className="text-3xl font-bold text-primary mt-1">{rate.rate || rate.overall || 0}%</p></Card>
                <Card hover className="text-center"><p className="text-slate-500 text-sm">Present</p><p className="text-3xl font-bold text-emerald-600 mt-1">{rate.present || 0}</p></Card>
                <Card hover className="text-center"><p className="text-slate-500 text-sm">Absent</p><p className="text-3xl font-bold text-red-600 mt-1">{rate.absent || 0}</p></Card>
            </div>}
            <Card padding="none">
                {recordsLoading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
                    <div className="overflow-x-auto"><table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800"><tr><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Student</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Date</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Status</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Notes</th></tr></thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {records.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">{selectedClass ? 'No attendance records' : 'Select a class'}</td></tr>}
                            {records.map((r, i) => (<tr key={r.id||i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50"><td className="px-6 py-4 font-semibold">{r.user?.name || r.student?.name || ''}</td><td className="px-6 py-4 text-slate-500">{r.session_date || r.date || r.created_at || ''}</td><td className="px-6 py-4"><Badge variant={r.status==='present'?'success':r.status==='late'?'warning':'danger'} size="sm">{r.status||'—'}</Badge></td><td className="px-6 py-4 text-slate-500 text-sm">{r.notes||'—'}</td></tr>))}
                        </tbody>
                    </table></div>
                )}
            </Card>
        </div>
    );
};

export default Attendance;
