import { useState, useEffect } from 'react';
import { Card, Badge, PageHeader } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { BarChart3, Trophy, GraduationCap, Download, Loader2 } from 'lucide-react';
import gradeService from '../../services/gradeService';

const MyGrades = () => {
    const [grades, setGrades] = useState([]);
    const [stats, setStats] = useState({ average: 0, highest: 0, count: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gradesRes, statsRes] = await Promise.all([
                    gradeService.getStudentGrades(),
                    gradeService.getStudentStatistics(),
                ]);
                const g = gradesRes.data || gradesRes;
                setGrades(Array.isArray(g) ? g : g.data || []);
                setStats(statsRes.data || statsRes);
            } catch { /* silent */ }
            setLoading(false);
        };
        fetchData();
    }, []);

    const getGradeColor = (grade) => { if (grade >= 16) return 'text-emerald-600'; if (grade >= 12) return 'text-amber-600'; return 'text-red-600'; };
    const getStatusVariant = (grade) => { if (grade >= 16) return 'success'; if (grade >= 12) return 'primary'; return 'warning'; };
    const getStatusLabel = (grade) => { if (grade >= 16) return 'Excellent'; if (grade >= 12) return 'Good'; return 'Average'; };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Breadcrumbs items={[{ label: 'My Grades' }]} />
            <PageHeader title="My Grades" subtitle="View your academic performance across all modules." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card hover className="text-center">
                    <div className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 size-14 rounded-2xl flex items-center justify-center mx-auto mb-4"><BarChart3 className="w-7 h-7" strokeWidth={2} /></div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Overall Average</p>
                    <p className="text-3xl font-bold mt-1 tracking-tight">{stats.average || 0}<span className="text-slate-400 text-lg">/ 20</span></p>
                </Card>
                <Card hover className="text-center">
                    <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 size-14 rounded-2xl flex items-center justify-center mx-auto mb-4"><Trophy className="w-7 h-7" strokeWidth={2} /></div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Highest Grade</p>
                    <p className="text-3xl font-bold mt-1 tracking-tight text-emerald-600">{stats.highest || 0}<span className="text-slate-400 text-lg">/ 20</span></p>
                </Card>
                <Card hover className="text-center">
                    <div className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 size-14 rounded-2xl flex items-center justify-center mx-auto mb-4"><GraduationCap className="w-7 h-7" strokeWidth={2} /></div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Modules Graded</p>
                    <p className="text-3xl font-bold mt-1 tracking-tight">{stats.count || grades.length}</p>
                </Card>
            </div>

            <Card padding="none">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Grade History</h2>
                    <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1.5"><Download className="w-[18px] h-[18px]" strokeWidth={2} /> Export</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Module</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Formateur</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Grade</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {grades.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No grades yet</td></tr>}
                            {grades.map((grade, index) => {
                                const val = grade.grade || grade.value || 0;
                                return (
                                    <tr key={grade.id || index} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4"><p className="text-sm font-semibold text-slate-900 dark:text-white">{grade.module?.name || grade.module || ''}</p></td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{grade.formateur?.name || grade.formateur || ''}</td>
                                        <td className="px-6 py-4"><span className={`text-lg font-bold ${getGradeColor(val)}`}>{val}</span><span className="text-slate-400 text-sm">/ {grade.max || 20}</span></td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{grade.date || grade.created_at || ''}</td>
                                        <td className="px-6 py-4"><Badge variant={getStatusVariant(val)} size="sm">{grade.status || getStatusLabel(val)}</Badge></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default MyGrades;
