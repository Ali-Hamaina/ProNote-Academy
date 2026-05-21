import { useState, useEffect } from 'react';
import { Card, Button, Badge, PageHeader, Modal, Input } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { Loader2, Plus, Calendar, Pencil, Trash2 } from 'lucide-react';
import sessionService from '../../services/sessionService';

const emptyForm = { title: '', class_id: '', module_id: '', start_time: '', end_time: '', location: '', room: '', description: '' };

const getRows = (r) => Array.isArray(r) ? r : (r?.data?.data ? r.data.data : r?.data || []);

const Schedule = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ open: false, item: null });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const fetch = async () => {
        try { const r = await sessionService.getAll(); setSessions(getRows(r)); } catch { setSessions([]); }
        setLoading(false);
    };

    useEffect(() => { fetch(); }, []);

    const openCreate = () => { setForm(emptyForm); setFormError(''); setModal({ open: true, item: null }); };
    const openEdit = (item) => {
        setForm({
            title: item.title || '',
            class_id: item.class_id || item.classModel?.id || '',
            module_id: item.module_id || item.module?.id || '',
            start_time: item.start_time ? item.start_time.slice(0, 16) : '',
            end_time: item.end_time ? item.end_time.slice(0, 16) : '',
            location: item.location || '',
            room: item.room || '',
            description: item.description || '',
        });
        setFormError('');
        setModal({ open: true, item });
    };
    const closeModals = () => { setModal({ open: false, item: null }); setDeleteTarget(null); setFormError(''); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError('');
        try {
            const payload = {
                ...form,
                start_time: form.start_time ? form.start_time.replace('T', ' ') + ':00' : null,
                end_time: form.end_time ? form.end_time.replace('T', ' ') + ':00' : null,
            };
            if (modal.item) {
                await sessionService.update(modal.item.id, payload);
            } else {
                await sessionService.create(payload);
            }
            closeModals();
            await fetch();
        } catch (err) {
            setFormError(err.response?.data?.message || err.response?.data?.error || 'Failed to save session.');
        }
        setSubmitting(false);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try { await sessionService.delete(deleteTarget.id); setDeleteTarget(null); await fetch(); } catch {}
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Formateur', to: '/formateur/dashboard' }, { label: 'Schedule' }]} />
            <PageHeader title="Schedule Management" subtitle="Manage your teaching sessions and timetable.">
                <Button icon={Plus} onClick={openCreate}>New Session</Button>
            </PageHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.length === 0 && <Card className="col-span-full text-center"><Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-400">No sessions scheduled</p></Card>}
                {sessions.map((s, i) => (
                    <Card key={s.id || i} hover className="group">
                        <div className="flex justify-between items-start mb-3">
                            <Badge variant={s.status === 'completed' ? 'success' : s.status === 'cancelled' ? 'danger' : 'primary'} size="sm">{s.status || 'Scheduled'}</Badge>
                            <div className="flex gap-1">
                                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <h3 className="font-bold text-base mb-1">{s.title || s.module?.name || 'Session'}</h3>
                        <p className="text-sm text-slate-500 mb-3">{s.classModel?.name || s.class?.name || ''}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>{s.start_time ? new Date(s.start_time).toLocaleString() : ''}</span>
                            <span>{s.room || s.location || ''}</span>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={modal.open} onClose={closeModals} title={modal.item ? 'Edit Session' : 'New Session'} size="lg">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {formError && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-red-600 text-sm">{formError}</div>}
                    <Input label="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Start Time" type="datetime-local" value={form.start_time} onChange={(e) => setForm({...form, start_time: e.target.value})} required />
                        <Input label="End Time" type="datetime-local" value={form.end_time} onChange={(e) => setForm({...form, end_time: e.target.value})} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Room" value={form.room} onChange={(e) => setForm({...form, room: e.target.value})} />
                        <Input label="Location" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
                    </div>
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="ghost" onClick={closeModals}>Cancel</Button>
                        <Button type="submit" loading={submitting}>{modal.item ? 'Save Changes' : 'Create Session'}</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Session" size="sm">
                <div className="space-y-5">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Delete <span className="font-semibold text-slate-900 dark:text-white">{deleteTarget?.title}</span>?</p>
                    <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button type="button" variant="danger" onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Schedule;
