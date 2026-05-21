import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Modal, Input, PageHeader } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import classService from '../../services/classService';
import moduleService from '../../services/moduleService';
import userService from '../../services/userService';
import enrollmentService from '../../services/enrollmentService';

const emptyClassForm = {
    name: '',
    code: '',
    description: '',
    instructor_id: '',
    max_students: 30,
    status: 'active',
};

const emptyModuleForm = {
    name: '',
    block_number: 1,
    hours: 30,
    description: '',
    instructor_id: '',
    status: 'draft',
};

const getRows = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
};

const getErrorMessage = (error, fallback) => {
    if (error?.response?.data?.errors) {
        return Object.values(error.response.data.errors).flat().join(' ');
    }

    return error?.response?.data?.message || error?.response?.data?.error || fallback;
};

const AcademicSetup = () => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [classes, setClasses] = useState([]);
    const [modules, setModules] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modulesLoading, setModulesLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('modules');
    const [enrollments, setEnrollments] = useState([]);
    const [stagiaires, setStagiaires] = useState([]);
    const [enrollmentModal, setEnrollmentModal] = useState(false);
    const [enrollmentForm, setEnrollmentForm] = useState({ user_id: '' });
    const [enrollmentSubmitting, setEnrollmentSubmitting] = useState(false);
    const [enrollmentError, setEnrollmentError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [classModal, setClassModal] = useState({ open: false, item: null });
    const [moduleModal, setModuleModal] = useState({ open: false, item: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, type: null, item: null });
    const [classForm, setClassForm] = useState(emptyClassForm);
    const [moduleForm, setModuleForm] = useState(emptyModuleForm);
    const [formError, setFormError] = useState('');
    const [actionError, setActionError] = useState('');

    const selectedClassObj = classes.find((item) => item.id === selectedClass);

    const filteredClasses = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return classes;

        return classes.filter((item) =>
            item.name?.toLowerCase().includes(term) ||
            item.code?.toLowerCase().includes(term)
        );
    }, [classes, searchTerm]);

    const fetchClasses = async (preferredClassId) => {
        const response = await classService.getAll({ per_page: 100 });
        const rows = getRows(response);
        setClasses(rows);

        const nextSelected = rows.find((item) => item.id === preferredClassId)?.id || rows[0]?.id || null;
        setSelectedClass(nextSelected);
        return nextSelected;
    };

    const fetchModules = async (classId = selectedClass) => {
        if (!classId) {
            setModules([]);
            return;
        }

        setModulesLoading(true);
        try {
            const response = await classService.getModules(classId);
            setModules(getRows(response));
        } catch {
            setModules([]);
        } finally {
            setModulesLoading(false);
        }
    };

    const fetchFormateurs = async () => {
        const response = await userService.getAll({ role: 'formateur', status: 'active', per_page: 100 });
        setFormateurs(getRows(response));
    };

    const fetchStagiaires = async () => {
        const response = await userService.getAll({ role: 'stagiaire', status: 'active', per_page: 200 });
        setStagiaires(getRows(response));
    };

    const fetchEnrollments = async (classId) => {
        if (!classId) { setEnrollments([]); return; }
        try {
            const response = await enrollmentService.getAll({ class_id: classId, per_page: 200 });
            setEnrollments(getRows(response));
        } catch { setEnrollments([]); }
    };

    useEffect(() => {
        const bootstrap = async () => {
            setLoading(true);
            try {
                const [classId] = await Promise.all([
                    fetchClasses(),
                    fetchFormateurs(),
                    fetchStagiaires(),
                ]);

                if (classId) {
                    await Promise.all([
                        fetchModules(classId),
                        fetchEnrollments(classId),
                    ]);
                }
            } catch {
                setClasses([]);
                setModules([]);
                setFormateurs([]);
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
    }, []);

    useEffect(() => {
        fetchModules(selectedClass);
        fetchEnrollments(selectedClass);
    }, [selectedClass]);

    const openCreateClass = () => {
        setClassForm({
            ...emptyClassForm,
            instructor_id: formateurs[0]?.id || '',
        });
        setFormError('');
        setClassModal({ open: true, item: null });
    };

    const openEditClass = (item) => {
        setClassForm({
            name: item.name || '',
            code: item.code || '',
            description: item.description || '',
            instructor_id: item.instructor_id || item.instructor?.id || '',
            max_students: item.max_students || 30,
            status: item.status || 'active',
        });
        setFormError('');
        setClassModal({ open: true, item });
    };

    const openCreateModule = () => {
        setModuleForm({
            ...emptyModuleForm,
            block_number: modules.length + 1,
            instructor_id: selectedClassObj?.instructor_id || formateurs[0]?.id || '',
        });
        setFormError('');
        setModuleModal({ open: true, item: null });
    };

    const openEditModule = (item) => {
        setModuleForm({
            name: item.name || '',
            block_number: item.block_number || modules.findIndex((module) => module.id === item.id) + 1 || 1,
            hours: item.hours || 30,
            description: item.description || '',
            instructor_id: item.instructor_id || item.instructor?.id || '',
            status: item.status || 'draft',
        });
        setFormError('');
        setModuleModal({ open: true, item });
    };

    const closeModals = () => {
        setClassModal({ open: false, item: null });
        setModuleModal({ open: false, item: null });
        setDeleteModal({ open: false, type: null, item: null });
        setFormError('');
        setActionError('');
    };

    const handleClassSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setFormError('');
        setActionError('');

        try {
            const payload = {
                ...classForm,
                instructor_id: Number(classForm.instructor_id),
                max_students: Number(classForm.max_students),
            };

            let savedClassId = classModal.item?.id || selectedClass;

            if (classModal.item) {
                await classService.update(classModal.item.id, payload);
            } else {
                const response = await classService.create(payload);
                savedClassId = response?.data?.id || savedClassId;
            }

            const classId = await fetchClasses(savedClassId);
            await fetchModules(classId);
            closeModals();
        } catch (error) {
            setFormError(getErrorMessage(error, 'Failed to save class.'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleModuleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedClass) return;

        setSubmitting(true);
        setFormError('');
        setActionError('');

        try {
            const payload = {
                ...moduleForm,
                class_id: selectedClass,
                block_number: Number(moduleForm.block_number),
                hours: Number(moduleForm.hours),
                instructor_id: Number(moduleForm.instructor_id),
            };

            if (moduleModal.item) {
                await moduleService.update(moduleModal.item.id, payload);
            } else {
                await moduleService.create(payload);
            }

            await fetchModules(selectedClass);
            closeModals();
        } catch (error) {
            setFormError(getErrorMessage(error, 'Failed to save module.'));
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteModal.item) return;

        setDeleting(true);
        setActionError('');

        try {
            if (deleteModal.type === 'class') {
                await classService.delete(deleteModal.item.id);
                const classId = await fetchClasses(selectedClass === deleteModal.item.id ? null : selectedClass);
                await fetchModules(classId);
            } else {
                await moduleService.delete(deleteModal.item.id);
                await fetchModules(selectedClass);
            }

            closeModals();
        } catch (error) {
            setActionError(getErrorMessage(error, `Failed to delete ${deleteModal.type}.`));
        } finally {
            setDeleting(false);
        }
    };

    const openEnrollStudent = () => {
        setEnrollmentForm({ user_id: stagiaires[0]?.id || '' });
        setEnrollmentError('');
        setEnrollmentModal(true);
    };

    const handleEnrollSubmit = async (e) => {
        e.preventDefault();
        setEnrollmentSubmitting(true);
        setEnrollmentError('');
        try {
            await enrollmentService.create({ user_id: Number(enrollmentForm.user_id), class_id: selectedClass });
            setEnrollmentModal(false);
            await fetchEnrollments(selectedClass);
        } catch (err) {
            setEnrollmentError(err.response?.data?.error || err.response?.data?.message || 'Failed to enroll student.');
        }
        setEnrollmentSubmitting(false);
    };

    const removeEnrollment = async (enrollmentId) => {
        try {
            await enrollmentService.delete(enrollmentId);
            await fetchEnrollments(selectedClass);
        } catch {}
    };

    const renderFormateurOptions = () => (
        <>
            <option value="">Select formateur</option>
            {formateurs.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
            ))}
        </>
    );

    if (loading) {
        return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Class & Module Setup' }]} />
            <PageHeader title="Class & Module Setup" subtitle="Create, edit, and organize classes with their curriculum modules.">
                <Button icon="add" onClick={openCreateClass}>Create Class</Button>
            </PageHeader>

            {actionError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                    {actionError}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-280px)]">
                <Card padding="none" className="lg:w-1/3 flex flex-col">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                        <div className="flex justify-between items-center gap-3">
                            <h3 className="font-bold text-lg">Classes</h3>
                            <span className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg text-slate-500">{classes.length} Total</span>
                        </div>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                            <input type="text" placeholder="Filter classes..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary py-2.5 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {filteredClasses.length === 0 && (
                            <div className="px-4 py-10 text-center text-sm text-slate-400">No classes found</div>
                        )}

                        {filteredClasses.map((item) => {
                            const studentCount = item.students_count || item.student_count || item.enrollments?.length || 0;

                            return (
                                <button key={item.id} type="button" onClick={() => setSelectedClass(item.id)} className={`w-full p-4 rounded-xl flex justify-between items-center text-left cursor-pointer transition-all ${selectedClass === item.id ? 'bg-primary/5 dark:bg-primary/10 border-2 border-primary/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-2 border-transparent'}`}>
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className={`font-bold text-sm ${selectedClass === item.id ? 'text-primary' : 'text-slate-400'}`}>{item.code || item.id}</span>
                                        <span className="text-slate-900 dark:text-white font-medium text-sm truncate">{item.name}</span>
                                        <span className="text-xs text-slate-500 truncate">{item.instructor?.name || 'No formateur assigned'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${selectedClass === item.id ? 'bg-white dark:bg-slate-800 border border-primary/20 shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                            <span className={`material-symbols-outlined text-[14px] ${selectedClass === item.id ? 'text-primary' : 'text-slate-400'}`}>groups</span>
                                            <span className={`text-xs font-bold ${selectedClass === item.id ? 'text-primary' : 'text-slate-500'}`}>{studentCount}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </Card>

                <Card padding="none" className="flex-1 flex flex-col">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-800/30 md:flex-row md:justify-between md:items-center">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-[28px]">terminal</span></div>
                            <div className="min-w-0">
                                <h2 className="text-lg font-bold leading-none mb-1 truncate">{selectedClassObj?.name || '...'}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Manage class details, modules, and students.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="secondary" icon={Pencil} disabled={!selectedClassObj} onClick={() => openEditClass(selectedClassObj)}>Edit Class</Button>
                            <Button variant="danger" icon={Trash2} disabled={!selectedClassObj} onClick={() => setDeleteModal({ open: true, type: 'class', item: selectedClassObj })}>Delete Class</Button>
                        </div>
                    </div>

                    {/* Tabs */}
                    {selectedClassObj && (
                        <div className="flex border-b border-slate-100 dark:border-slate-800 px-5">
                            <button onClick={() => setActiveTab('modules')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'modules' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Modules</button>
                            <button onClick={() => setActiveTab('students')} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === 'students' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Students ({enrollments.length})</button>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-5">
                        {!selectedClassObj && <p className="text-center text-slate-400 py-8">Create or select a class first</p>}

                        {activeTab === 'modules' && (
                            modulesLoading ? (
                                <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {modules.length === 0 && <p className="text-center text-slate-400 py-8">No modules assigned to this class</p>}

                                    {modules.map((item, index) => (
                                        <div key={item.id || index} className="group relative flex items-center gap-4 p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md transition-all">
                                            <div className="text-slate-300 dark:text-slate-600 flex items-center"><span className="material-symbols-outlined text-[22px]">drag_indicator</span></div>
                                            <div className="flex-1 flex flex-col gap-2 min-w-0">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-lg">Block {item.block_number || item.order_position || index + 1}</span>
                                                    <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">{item.name}</h4>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">schedule</span> {item.hours || 0} Hours</span>
                                                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">person</span> {item.instructor?.name || 'No formateur'}</span>
                                                    <span className="flex items-center gap-1.5"><span className={`material-symbols-outlined text-[14px] ${item.status === 'published' ? 'text-emerald-500' : 'text-orange-500'}`}>{item.status === 'published' ? 'check_circle' : 'pending'}</span><span className={item.status === 'published' ? 'text-emerald-600' : 'text-orange-600'}>{item.status || 'draft'}</span></span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button type="button" onClick={() => openEditModule(item)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 transition-colors" aria-label={`Edit ${item.name}`}>
                                                    <Pencil className="w-5 h-5" strokeWidth={2} />
                                                </button>
                                                <button type="button" onClick={() => setDeleteModal({ open: true, type: 'module', item })} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors" aria-label={`Delete ${item.name}`}>
                                                    <Trash2 className="w-5 h-5" strokeWidth={2} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button type="button" onClick={openCreateModule} className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary/50 cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-800/20 group">
                                        <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">post_add</span>
                                        <span className="font-medium">Add Next Curriculum Module</span>
                                    </button>
                                </div>
                            )
                        )}

                        {activeTab === 'students' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-slate-500">{enrollments.length} student{enrollments.length !== 1 ? 's' : ''} enrolled</p>
                                    <Button icon="person_add" onClick={openEnrollStudent}>Add Student</Button>
                                </div>
                                {enrollments.length === 0 && <p className="text-center text-slate-400 py-8">No students enrolled in this class</p>}
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {enrollments.map((e, i) => (
                                        <div key={e.id || i} className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[18px]">person</span></div>
                                                <div>
                                                    <p className="text-sm font-semibold">{e.user?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-500">{e.user?.email || ''}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${e.status === 'active' ? 'bg-emerald-50 text-emerald-600' : e.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>{e.status}</span>
                                                <button onClick={() => removeEnrollment(e.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><span className="material-symbols-outlined text-[18px]">remove_circle</span></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <Modal isOpen={classModal.open} onClose={closeModals} title={classModal.item ? 'Edit Class' : 'Create Class'} size="lg">
                <form className="space-y-4" onSubmit={handleClassSubmit}>
                    {formError && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-red-600 text-sm">{formError}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Class Name" value={classForm.name} onChange={(event) => setClassForm({ ...classForm, name: event.target.value })} required />
                        <Input label="Code" value={classForm.code} onChange={(event) => setClassForm({ ...classForm, code: event.target.value })} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Max Students" type="number" min="1" max="500" value={classForm.max_students} onChange={(event) => setClassForm({ ...classForm, max_students: event.target.value })} required />
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Formateur</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={classForm.instructor_id} onChange={(event) => setClassForm({ ...classForm, instructor_id: event.target.value })} required>
                                {renderFormateurOptions()}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Status</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={classForm.status} onChange={(event) => setClassForm({ ...classForm, status: event.target.value })}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Description</label>
                        <textarea value={classForm.description} onChange={(event) => setClassForm({ ...classForm, description: event.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
                    </div>
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="ghost" onClick={closeModals}>Cancel</Button>
                        <Button type="submit" loading={submitting}>{classModal.item ? 'Save Class' : 'Create Class'}</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={moduleModal.open} onClose={closeModals} title={moduleModal.item ? 'Edit Module' : 'Add Module'} size="lg">
                <form className="space-y-4" onSubmit={handleModuleSubmit}>
                    {formError && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-red-600 text-sm">{formError}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Module Name" value={moduleForm.name} onChange={(event) => setModuleForm({ ...moduleForm, name: event.target.value })} required />
                        <Input label="Block Number" type="number" min="1" value={moduleForm.block_number} onChange={(event) => setModuleForm({ ...moduleForm, block_number: event.target.value })} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Hours" type="number" min="1" value={moduleForm.hours} onChange={(event) => setModuleForm({ ...moduleForm, hours: event.target.value })} required />
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-white">Formateur</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={moduleForm.instructor_id} onChange={(event) => setModuleForm({ ...moduleForm, instructor_id: event.target.value })} required>
                                {renderFormateurOptions()}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Status</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={moduleForm.status} onChange={(event) => setModuleForm({ ...moduleForm, status: event.target.value })}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-white">Description</label>
                        <textarea value={moduleForm.description} onChange={(event) => setModuleForm({ ...moduleForm, description: event.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
                    </div>
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="ghost" onClick={closeModals}>Cancel</Button>
                        <Button type="submit" loading={submitting}>{moduleModal.item ? 'Save Module' : 'Add Module'}</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={enrollmentModal} onClose={() => setEnrollmentModal(false)} title="Add Student to Class" size="sm">
                <form className="space-y-4" onSubmit={handleEnrollSubmit}>
                    {enrollmentError && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-red-600 text-sm">{enrollmentError}</div>}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Student</label>
                        <select value={enrollmentForm.user_id} onChange={(e) => setEnrollmentForm({ ...enrollmentForm, user_id: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                            <option value="">Select a student</option>
                            {stagiaires.filter(s => !enrollments.find(e => e.user_id === s.id)).map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                        </select>
                    </div>
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="ghost" onClick={() => setEnrollmentModal(false)}>Cancel</Button>
                        <Button type="submit" loading={enrollmentSubmitting}>Enroll Student</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={deleteModal.open} onClose={closeModals} title={`Delete ${deleteModal.type === 'class' ? 'Class' : 'Module'}`} size="sm">
                <div className="space-y-5">
                    {actionError && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-red-600 text-sm">{actionError}</div>}
                    <div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Delete <span className="font-semibold text-slate-900 dark:text-white">{deleteModal.item?.name}</span>?</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {deleteModal.type === 'class' ? 'This will also remove modules attached to this class.' : 'This action cannot be undone.'}
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                        <Button type="button" variant="ghost" onClick={closeModals}>Cancel</Button>
                        <Button type="button" variant="danger" loading={deleting} onClick={confirmDelete}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AcademicSetup;
