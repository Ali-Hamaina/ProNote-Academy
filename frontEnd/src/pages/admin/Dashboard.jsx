import { useState, useEffect } from 'react';
import { Card, Badge } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { User, School, Calendar, TrendingUp, BookOpen, Users, FileText, Filter, Download, MoreVertical, Loader2 } from 'lucide-react';
import dashboardService from '../../services/dashboardService';

const AdminDashboard = () => {
    const [stats, setStats] = useState([]);
    const [extraStats, setExtraStats] = useState([]);
    const [classes, setClasses] = useState([]);
    const [trends, setTrends] = useState({ total: 0, change: '', months: [] });
    const [loading, setLoading] = useState(true);

    const iconColorClasses = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
        rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
        cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, trendsRes, classesRes] = await Promise.all([
                    dashboardService.getAdminStatistics(),
                    dashboardService.getEnrollmentTrends(),
                    dashboardService.getAdminClasses(),
                ]);
                const d = statsRes.data || statsRes;
                setStats([
                    { icon: User, label: 'Total Students', value: d.students?.toLocaleString() || '0', change: d.students_change || '+0%', positive: !String(d.students_change || '').startsWith('-'), color: 'blue' },
                    { icon: School, label: 'Total Formateurs', value: d.formateurs?.toLocaleString() || '0', change: d.formateurs_change || '+0%', positive: !String(d.formateurs_change || '').startsWith('-'), color: 'purple' },
                    { icon: Calendar, label: 'Active Classes', value: d.active_classes?.toLocaleString() || '0', change: d.classes_change || '+0%', positive: !String(d.classes_change || '').startsWith('-'), color: 'amber' },
                    { icon: TrendingUp, label: 'Avg. Performance', value: `${d.avg_performance || 0}%`, change: d.performance_change || '+0%', positive: !String(d.performance_change || '').startsWith('-'), color: 'emerald' },
                ]);
                setExtraStats([
                    { icon: BookOpen, label: 'Total Modules', value: d.total_modules?.toLocaleString() || '0', color: 'rose' },
                    { icon: Users, label: 'Total Enrollments', value: d.total_enrollments?.toLocaleString() || '0', color: 'cyan' },
                    { icon: FileText, label: 'Total Resources', value: d.total_resources?.toLocaleString() || '0', color: 'purple' },
                    { icon: User, label: 'Total Users', value: d.total_users?.toLocaleString() || '0', color: 'blue' },
                ]);
                setTrends(trendsRes.data || trendsRes);
                setClasses(Array.isArray(classesRes.data || classesRes) ? (classesRes.data || classesRes) : []);
            } catch { /* silent */ }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8">
            <Breadcrumbs items={[{ label: 'Dashboard' }]} />
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((stat, index) => (
                    <Card key={index} hover className="group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 rounded-xl ${iconColorClasses[stat.color]}`}><stat.icon className="w-6 h-6" strokeWidth={2} /></div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stat.positive ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'}`}>{stat.change}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                        <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                        <div className="mt-4 h-10 w-full flex items-end gap-1">
                            {[35, 55, 75, 100, 55].map((h, i) => (<div key={i} className={`w-full rounded-t transition-all duration-300 ${i === 3 ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'}`} style={{ height: `${h}%` }} />))}
                        </div>
                    </Card>
                ))}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card padding="md" className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div><h2 className="text-lg font-bold">Enrollment Trends</h2><p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Monthly student intake (last 7 months)</p></div>
                    </div>
                    <div className="flex items-baseline gap-3 mb-8">
                        <p className="text-3xl font-bold tracking-tight">{trends.total?.toLocaleString?.() || '0'}</p>
                        {trends.change && <p className="text-emerald-600 text-sm font-semibold flex items-center gap-1"><TrendingUp className="w-4 h-4" strokeWidth={2} /> {trends.change}</p>}
                    </div>
                    <div className="grid grid-cols-7 gap-3 items-end h-[180px] relative">
                        {(trends.months?.length ? trends.months : []).map((m, i) => (
                            <div key={i} className="flex flex-col items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-400">{m.count || 0}</span>
                                <div className={`w-full rounded-lg transition-all duration-300 ${m.count && m.count === Math.max(...trends.months.map(x => x.count || 0)) ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 hover:bg-primary/30'}`} style={{height:`${m.height || 5}%`}} />
                                <span className="text-xs font-semibold text-slate-500">{m.label}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    {extraStats.map((stat, index) => (
                        <Card key={index} padding="md" className="flex flex-col items-center justify-center text-center">
                            <div className={`p-2.5 rounded-xl mb-3 ${iconColorClasses[stat.color]}`}><stat.icon className="w-5 h-5" strokeWidth={2} /></div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none mb-1">{stat.value}</p>
                            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                        </Card>
                    ))}
                </div>
            </section>

            <Card padding="none" className="overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center bg-slate-50/80 dark:bg-slate-800/30 gap-4">
                    <h2 className="text-base font-bold">Class Performance Overview</h2>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Filter className="w-4 h-4" strokeWidth={2} /> Filter</button>
                        <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Download className="w-4 h-4" strokeWidth={2} /> Export</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                            <tr><th className="px-6 py-4 font-semibold">Class Name</th><th className="px-6 py-4 font-semibold">Formateur</th><th className="px-6 py-4 font-semibold">Student Count</th><th className="px-6 py-4 font-semibold">Completion Rate</th><th className="px-6 py-4 font-semibold">Status</th><th className="px-6 py-4 text-right font-semibold">Action</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {classes.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No classes found</td></tr>}
                            {classes.map((cls, i) => (
                                <tr key={cls.id || i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-primary">{cls.name}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{cls.formateur?.name || cls.formateur || '—'}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{cls.students_count || cls.students || 0} Students</td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-28 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden"><div className="bg-primary h-full rounded-full transition-all" style={{width:`${cls.completion||0}%`}} /></div><span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{cls.completion||0}%</span></div></td>
                                    <td className="px-6 py-4"><Badge variant={cls.status==='Active'||cls.status==='active'?'success':'primary'} size="sm">{cls.status||'Active'}</Badge></td>
                                    <td className="px-6 py-4 text-right"><button className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"><MoreVertical className="w-5 h-5" strokeWidth={2} /></button></td>
                                </tr>))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
