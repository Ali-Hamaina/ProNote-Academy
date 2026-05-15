import { useState, useEffect } from 'react';
import { Card, Badge, Button, PageHeader, Input } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { Loader2, Plus, Check } from 'lucide-react';
import classService from '../../services/classService';
import gradeService from '../../services/gradeService';

const Grades = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gradesLoading, setGradesLoading] = useState(false);

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
            setGradesLoading(true);
            try { const r = await gradeService.getModuleGrades(selectedClass); const d = r.data || r; setGrades(Array.isArray(d) ? d : d.data || []); } catch { setGrades([]); }
            setGradesLoading(false);
        };
        fetch();
    }, [selectedClass]);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Formateur', to: '/formateur/dashboard' }, { label: 'Grades' }]} />
            <PageHeader title="Grade Management" subtitle="Enter and manage student grades across your modules.">
                <Button icon={Plus}>Enter New Grade</Button>
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
                                {grades.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">{selectedClass ? 'No grades for this module' : 'Select a class to view grades'}</td></tr>}
                                {grades.map((g, i) => (<tr key={g.id || i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"><td className="px-6 py-4 font-semibold">{g.student?.name || ''}</td><td className="px-6 py-4 text-slate-500">{g.module?.name || ''}</td><td className="px-6 py-4"><span className={`text-lg font-bold ${(g.grade||0)>=16?'text-emerald-600':(g.grade||0)>=12?'text-amber-600':'text-red-600'}`}>{g.grade||0}</span><span className="text-slate-400 text-sm">/ 20</span></td><td className="px-6 py-4 text-slate-500">{g.date || g.created_at || ''}</td><td className="px-6 py-4 text-right"><button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button></td></tr>))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Grades;
