import { useState, useEffect } from 'react';
import { Card, Badge, Button, PageHeader, Modal } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { Loader2, Check } from 'lucide-react';
import classService from '../../services/classService';
import attendanceService from '../../services/attendanceService';

const getRows = (r) => Array.isArray(r) ? r : (r?.data?.data ? r.data.data : r?.data || []);

const Attendance = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [records, setRecords] = useState([]);
    const [rate, setRate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recordsLoading, setRecordsLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [attendanceForm, setAttendanceForm] = useState({ user_id: '', session_date: new Date().toISOString().slice(0, 10), status: 'present', notes: '' });
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try { const r = await classService.getFormateurClasses(); const d = getRows(r); setClasses(d); } catch {}
            setLoading(false);
        };
        fetch();
    }, []);

    useEffect(() => {
        if (!selectedClass) return;
        const fetch = async () => {
            setRecordsLoading(true);
            try {
                const [recRes, rateRes] = await Promise.all([attendanceService.getAll({ class_id: selectedClass, per_page: 100 }), attendanceService.getClassRate(selectedClass)]);
                setRecords(getRows(recRes));
                const rd = rateRes.data || rateRes;
                setRate({
                    rate: rd.rate ?? rd.attendance_rate ?? 0,
                    present: rd.present || 0,
                    absent: rd.absent ?? Math.max((rd.total_records ?? rd.total ?? 0) - (rd.present || 0), 0),
                });
                const cls = classes.find(c => c.id === selectedClass);
                setStudents(cls?.enrollments?.map(e => e.user || e) || []);
            } catch { setRecords([]); }
            setRecordsLoading(false);
        };
        fetch();
    }, [selectedClass, classes]);

    const openMark = () => {
        setAttendanceForm({ user_id: students[0]?.id || '', session_date: new Date().toISOString().slice(0, 10), status: 'present', notes: '' });
        setFormError('');
        setModal(true);
    };

    const handleMark = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError('');
        try {
            await attendanceService.mark({
                user_id: Number(attendanceForm.user_id),
                class_id: selectedClass,
                session_date: attendanceForm.session_date,
                status: attendanceForm.status,
                notes: attendanceForm.notes,
            });
            setModal(false);
            const [recRes, rateRes] = await Promise.all([attendanceService.getAll({ class_id: selectedClass, per_page: 100 }), attendanceService.getClassRate(selectedClass)]);
            setRecords(getRows(recRes));
            const rd = rateRes.data || rateRes;
            setRate({
                rate: rd.rate ?? rd.attendance_rate ?? 0,
                present: rd.present || 0,
                absent: rd.absent ?? Math.max((rd.total_records ?? rd.total ?? 0) - (rd.present || 0), 0),
            });
        } catch (err) {
            setFormError(err.response?.data?.error || err.response?.data?.message || 'Failed to mark attendance.');
        }
        setSubmitting(false);
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Formateur', to: '/formateur/dashboard' }, { label: 'Attendance' }]} />
            <PageHeader title="Attendance Management" subtitle="Mark and track student attendance for your classes.">
                <Button icon={Check} onClick={openMark} disabled={!selectedClass || !students.length}>Mark Attendance</Button>
            </PageHeader>
            <div className="flex gap-3 flex-wrap">
                {classes.map(c => (<button key={c.id} onClick={() => setSelectedClass(c.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedClass === c.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'}`}>{c.name}</button>))}
            </div>
            {rate && <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card hover className="text-center"><p className="text-slate-500 text-sm">Overall Rate</p><p className="text-3xl font-bold text-primary mt-1">{rate.rate || 0}%</p></Card>
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

            <Modal isOpen={modal} onClose={() => setModal(false)} title="Mark Attendance" size="sm">
                <form className="space-y-4" onSubmit={handleMark}>
                    {formError && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-red-600 text-sm">{formError}</div>}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Student</label>
                        <select value={attendanceForm.user_id} onChange={(e) => setAttendanceForm({...attendanceForm, user_id: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                            <option value="">Select student</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</label>
                        <input type="date" value={attendanceForm.session_date} onChange={(e) => setAttendanceForm({...attendanceForm, session_date: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
                        <select value={attendanceForm.status} onChange={(e) => setAttendanceForm({...attendanceForm, status: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="excused">Excused</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notes</label>
                        <textarea value={attendanceForm.notes} onChange={(e) => setAttendanceForm({...attendanceForm, notes: e.target.value})} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
                    </div>
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
                        <Button type="submit" loading={submitting}>Mark Attendance</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Attendance;
