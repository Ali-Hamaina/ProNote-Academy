import { useState, useEffect } from 'react';
import { Card, Badge, Button, PageHeader, Input, Modal } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { Loader2, Plus, Pencil } from 'lucide-react';
import classService from '../../services/classService';
import gradeService from '../../services/gradeService';

const emptyForm = { user_id: '', module_id: '', grade_value: '', feedback: '' };

const getRows = (r) => Array.isArray(r) ? r : (r?.data?.data ? r.data.data : r?.data || []);
const getErr = (err) => err?.response?.data?.error || err?.response?.data?.message || 'Operation failed.';

const Grades = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gradesLoading, setGradesLoading] = useState(false);
    const [modal, setModal] = useState({ open: false, item: null });
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [students, setStudents] = useState([]);
    const [modules, setModules] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try { const r = await classService.getFormateurClasses(); setClasses(getRows(r)); } catch {}
            setLoading(false);
        };
        fetch();
    }, []);

    useEffect(() => {
        if (!selectedClass) return;
        const cls = classes.find(c => c.id === selectedClass);
        setModules(cls?.modules || []);
        setStudents(cls?.enrollments?.map(e => e.user || e) || []);
        const fetch = async () => {
            setGradesLoading(true);
            try {
                const gRes = await gradeService.getAll({ class_id: selectedClass, per_page: 100 });
                setGrades(getRows(gRes));
            } catch { setGrades([]); }
            setGradesLoading(false);
        };
        fetch();
    }, [selectedClass, classes]);

    const openCreate = () => {
        setForm({ ...emptyForm, module_id: modules[0]?.id || '', user_id: students[0]?.id || '' });
        setFormError('');
        setModal({ open: true, item: null });
    };

    const openEdit = (item) => {
        setForm({
            user_id: item.user_id || item.student?.id || '',
            module_id: item.module_id || item.module?.id || '',
            grade_value: item.grade_value ?? item.grade ?? '',
            feedback: item.feedback || '',
        });
        setFormError('');
        setModal({ open: true, item });
    };

    const closeModals = () => { setModal({ open: false, item: null }); setFormError(''); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError('');
        const gv = parseFloat(form.grade_value);
        if (isNaN(gv) || gv < 0 || gv > 20) {
            setFormError('Grade must be between 0 and 20');
            setSubmitting(false);
            return;
        }
        try {
            const payload = { grade_value: gv, feedback: form.feedback };
            if (modal.item) {
                await gradeService.update(modal.item.id, payload);
            } else {
                payload.user_id = Number(form.user_id);
                payload.module_id = Number(form.module_id);
                await gradeService.create(payload);
            }
            closeModals();
            const gRes = await gradeService.getAll({ class_id: selectedClass, per_page: 100 });
            setGrades(getRows(gRes));
        } catch (err) {
            const msg = getErr(err);
            const details = err.response?.data?.errors ? ' ' + Object.values(err.response.data.errors).flat().join(' ') : '';
            setFormError(msg + details);
        }
        setSubmitting(false);
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Formateur', to: '/formateur/dashboard' }, { label: 'Grades' }]} />
            <PageHeader title="Grade Management" subtitle="Enter and manage student grades across your modules.">
                <Button icon={Plus} onClick={openCreate} disabled={!selectedClass || !students.length}>Enter New Grade</Button>
            </PageHeader>
            <div className="flex gap-3 flex-wrap">
                {classes.map(c => (<button key={c.id} onClick={() => setSelectedClass(c.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedClass === c.id ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'}`}>{c.name}</button>))}
            </div>
            <Card padding="none">
                {gradesLoading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Student</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Module</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Grade</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">Date</th><th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 text-right">Actions</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {grades.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">{selectedClass ? 'No grades for this class' : 'Select a class to view grades'}</td></tr>}
                                {grades.map((g, i) => {
                                    const value = Number(g.grade_value ?? g.grade ?? 0);
                                    return (<tr key={g.id || i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"><td className="px-6 py-4 font-semibold">{g.student?.name || ''}</td><td className="px-6 py-4 text-slate-500">{g.module?.name || ''}</td><td className="px-6 py-4"><span className={`text-lg font-bold ${value>=16?'text-emerald-600':value>=12?'text-amber-600':'text-red-600'}`}>{value}</span><span className="text-slate-400 text-sm">/ 20</span></td><td className="px-6 py-4 text-slate-500">{g.graded_at || g.created_at || ''}</td><td className="px-6 py-4 text-right"><button onClick={() => openEdit(g)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Pencil className="w-5 h-5" /></button></td></tr>);
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <Modal isOpen={modal.open} onClose={closeModals} title={modal.item ? 'Edit Grade' : 'Enter New Grade'} size="md">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {formError && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-red-600 text-sm">{formError}</div>}
                    {!modal.item && (
                        <>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Student</label>
                                <select value={form.user_id} onChange={(e) => setForm({...form, user_id: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                    <option value="">Select student</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Module</label>
                                <select value={form.module_id} onChange={(e) => setForm({...form, module_id: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                                    <option value="">Select module</option>
                                    {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                            </div>
                        </>
                    )}
                    <Input label="Grade (0-20)" type="number" min="0" max="20" step="0.01" value={form.grade_value} onChange={(e) => setForm({...form, grade_value: e.target.value})} required />
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Feedback</label>
                        <textarea value={form.feedback} onChange={(e) => setForm({...form, feedback: e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
                    </div>
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="ghost" onClick={closeModals}>Cancel</Button>
                        <Button type="submit" loading={submitting}>{modal.item ? 'Save Changes' : 'Post Grade'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Grades;
