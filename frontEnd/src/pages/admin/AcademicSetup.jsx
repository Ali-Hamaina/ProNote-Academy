import { useState, useEffect } from 'react';
import { Card, Button, Badge, PageHeader } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { Loader2 } from 'lucide-react';
import classService from '../../services/classService';

const AcademicSetup = () => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [classes, setClasses] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modulesLoading, setModulesLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await classService.getAll();
                const data = Array.isArray(res.data || res) ? (res.data || res) : (res.data?.data || []);
                setClasses(data);
                if (data.length > 0) setSelectedClass(data[0].id);
            } catch { setClasses([]); }
            setLoading(false);
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        if (!selectedClass) return;
        const fetchModules = async () => {
            setModulesLoading(true);
            try {
                const res = await classService.getModules(selectedClass);
                setModules(Array.isArray(res.data || res) ? (res.data || res) : []);
            } catch { setModules([]); }
            setModulesLoading(false);
        };
        fetchModules();
    }, [selectedClass]);

    const filteredClasses = classes.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.code?.toLowerCase().includes(searchTerm.toLowerCase()));
    const selectedClassObj = classes.find(c => c.id === selectedClass);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Academic Setup' }]} />
            <PageHeader title="Class & Module Setup" subtitle="Organize academic structures and assign modules to classes.">
                <Button icon="add">Create New Class</Button>
            </PageHeader>

            <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-280px)]">
                <Card padding="none" className="lg:w-1/3 flex flex-col">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">Classes</h3>
                            <span className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg text-slate-500">{classes.length} Total</span>
                        </div>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                            <input type="text" placeholder="Filter classes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary py-2.5 outline-none transition-all" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {filteredClasses.map((cls) => (
                            <div key={cls.id} onClick={() => setSelectedClass(cls.id)} className={`p-4 rounded-xl flex justify-between items-center cursor-pointer transition-all ${selectedClass === cls.id ? 'bg-primary/5 dark:bg-primary/10 border-2 border-primary/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-2 border-transparent'}`}>
                                <div className="flex flex-col gap-0.5">
                                    <span className={`font-bold text-sm ${selectedClass === cls.id ? 'text-primary' : 'text-slate-400'}`}>{cls.code || cls.id}</span>
                                    <span className="text-slate-900 dark:text-white font-medium text-sm">{cls.name}</span>
                                </div>
                                <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${selectedClass === cls.id ? 'bg-white dark:bg-slate-800 border border-primary/20 shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                    <span className={`material-symbols-outlined text-[14px] ${selectedClass === cls.id ? 'text-primary' : 'text-slate-400'}`}>groups</span>
                                    <span className={`text-xs font-bold ${selectedClass === cls.id ? 'text-primary' : 'text-slate-500'}`}>{cls.students_count || cls.students || 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card padding="none" className="flex-1 flex flex-col">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[28px]">terminal</span></div>
                            <div><h2 className="text-lg font-bold leading-none mb-1">Modules for {selectedClassObj?.name || '...'}</h2><p className="text-sm text-slate-500 dark:text-slate-400">Manage curriculum sequence and content blocks</p></div>
                        </div>
                        <Button variant="secondary" icon="add_circle">Assign Module</Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5">
                        {modulesLoading ? (
                            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {modules.length === 0 && <p className="text-center text-slate-400 py-8">No modules assigned to this class</p>}
                                {modules.map((module, i) => (
                                    <div key={module.id || i} className="group relative flex items-center gap-4 p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 hover:shadow-md transition-all">
                                        <div className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 flex items-center"><span className="material-symbols-outlined text-[22px]">drag_indicator</span></div>
                                        <div className="flex-1 flex flex-col gap-2">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-lg">Block {module.order || i + 1}</span>
                                                <h4 className="font-bold text-base text-slate-900 dark:text-white">{module.name}</h4>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">schedule</span> {module.hours || 0} Hours</span>
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">person</span> {module.instructor?.name || module.instructor || '—'}</span>
                                                <span className="flex items-center gap-1.5"><span className={`material-symbols-outlined text-[14px] ${module.status === 'published' || module.status === 'Published' ? 'text-emerald-500' : 'text-orange-500'}`}>{module.status === 'published' || module.status === 'Published' ? 'check_circle' : 'pending'}</span><span className={module.status === 'published' || module.status === 'Published' ? 'text-emerald-600' : 'text-orange-600'}>{module.status || 'Draft'}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                                            <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                                        </div>
                                    </div>
                                ))}
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary/50 cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-800/20 group">
                                    <span className="material-symbols-outlined text-4xl mb-2 group-hover:scale-110 transition-transform">post_add</span>
                                    <span className="font-medium">Add Next Curriculum Module</span>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AcademicSetup;
