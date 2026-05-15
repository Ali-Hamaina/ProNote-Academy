import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button, PageHeader } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { TrendingUp, CheckCircle, BookOpen, FileText, CheckSquare, Code, Palette, Terminal, BookMarked, Loader2 } from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import announcementService from '../../services/announcementService';

const StagiaireDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [modules, setModules] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const iconColorClasses = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, modRes, annRes] = await Promise.all([
                    dashboardService.getStudentDashboard(),
                    dashboardService.getStudentModules(),
                    announcementService.getAll(),
                ]);
                setDashboard(dashRes.data || dashRes);
                const m = modRes.data || modRes;
                setModules(Array.isArray(m) ? m : m.data || []);
                const a = annRes.data || annRes;
                setAnnouncements(Array.isArray(a) ? a : a.data || []);
            } catch { /* silent */ }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const d = dashboard || {};

    const resources = [
        { icon: Code, title: 'Tailwind CSS v3 Guide', type: 'Cheat Sheet', bgClass: 'bg-primary/10', iconClass: 'text-primary/50', labelClass: 'text-primary' },
        { icon: Palette, title: 'Color Theory for UI', type: 'Article', bgClass: 'bg-amber-100/60 dark:bg-amber-900/20', iconClass: 'text-amber-500/50', labelClass: 'text-amber-600' },
        { icon: Terminal, title: 'Git Workflow Pro', type: 'Video', bgClass: 'bg-emerald-100/60 dark:bg-emerald-900/20', iconClass: 'text-emerald-500/50', labelClass: 'text-emerald-600' },
        { icon: BookMarked, title: 'Software Architecture', type: 'PDF', bgClass: 'bg-slate-100 dark:bg-slate-800', iconClass: 'text-slate-400/50', labelClass: 'text-slate-500' },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <Breadcrumbs items={[{ label: 'Dashboard' }]} />
            <div><h1 className="text-4xl font-extrabold tracking-tight">Hello, {d.name || 'Student'}!</h1><p className="text-slate-500 dark:text-slate-400 text-lg mt-2">Here is your academic overview.</p></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <Card hover className="flex items-center gap-5 group">
                    <div className={`size-16 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform ${iconColorClasses.blue}`}><TrendingUp className="w-8 h-8" strokeWidth={2} /></div>
                    <div><p className="text-sm font-medium text-slate-500 dark:text-slate-400">Semester Average</p><div className="flex items-baseline gap-2 mt-0.5"><h3 className="text-3xl font-bold tracking-tight">{d.average || '0'}</h3><span className="text-slate-400">/ 20</span></div></div>
                </Card>
                <Card hover className="flex items-center gap-5 group">
                    <div className={`size-16 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform ${iconColorClasses.emerald}`}><CheckCircle className="w-8 h-8" strokeWidth={2} /></div>
                    <div><p className="text-sm font-medium text-slate-500 dark:text-slate-400">Attendance Rate</p><div className="flex items-baseline gap-2 mt-0.5"><h3 className="text-3xl font-bold tracking-tight">{d.attendance_rate || '0%'}</h3>{d.attendance_change && <span className="text-emerald-500 text-sm font-bold">{d.attendance_change} ↑</span>}</div></div>
                </Card>
                <Card hover className="flex items-center gap-5 group bg-primary text-white border-none">
                    <div className="size-16 rounded-2xl flex items-center justify-center bg-white/20 group-hover:scale-105 transition-transform"><BookOpen className="w-8 h-8 text-white" strokeWidth={2} /></div>
                    <div><p className="text-sm font-medium text-white/70">Modules Completed</p><div className="flex items-baseline gap-2 mt-0.5"><h3 className="text-3xl font-bold tracking-tight text-white">{d.modules_completed || 0} / {d.modules_total || 0}</h3></div></div>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <Card padding="none">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center"><h2 className="text-lg font-bold">Module Completion Progress</h2><Link to="/stagiaire/grades" className="text-primary text-sm font-semibold hover:underline">View All</Link></div>
                        <div className="p-5 space-y-5">
                            {modules.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No modules enrolled</p>}
                            {modules.map((module, index) => (
                                <div key={module.id || index} className="space-y-2.5">
                                    <div className="flex justify-between items-center"><p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{module.name}</p><p className="text-sm font-bold text-primary">{module.progress || 0}%</p></div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${(module.progress || 0) === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${module.progress || 0}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Card>
                            <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Upcoming Assignment</h4>
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${iconColorClasses.amber}`}><FileText className="w-6 h-6" strokeWidth={2} /></div>
                                <div><p className="font-bold leading-tight text-slate-900 dark:text-white">{d.upcoming_title || 'No upcoming assignments'}</p><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{d.upcoming_due || ''}</p></div>
                            </div>
                        </Card>
                        <Card>
                            <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Latest Grade</h4>
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${iconColorClasses.emerald}`}><CheckSquare className="w-6 h-6" strokeWidth={2} /></div>
                                <div><p className="font-bold leading-tight text-slate-900 dark:text-white">{d.latest_grade_title || 'No grades yet'}</p><p className="text-emerald-600 font-bold mt-1 text-sm">{d.latest_grade_value || ''}</p></div>
                            </div>
                        </Card>
                    </div>
                </div>

                <Card padding="none" className="flex flex-col h-fit">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800"><h2 className="text-lg font-bold">Announcements</h2></div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {announcements.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No announcements</p>}
                        {announcements.slice(0, 5).map((item, index) => (
                            <div key={item.id || index} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                <div className="flex gap-3">
                                    <div className={`size-2 mt-2 rounded-full shrink-0 group-hover:scale-125 transition-transform ${item.read ? 'bg-slate-400' : 'bg-primary'}`} />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold leading-snug truncate">{item.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.content || item.desc || item.description}</p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight">{item.created_at || item.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 text-center border-t border-slate-100 dark:border-slate-800">
                        <button onClick={() => announcementService.markAllAsRead()} className="text-xs font-bold text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">Mark all as read</button>
                    </div>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight">Recommended Resources</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {resources.map((resource, index) => (
                        <Card key={index} padding="none" hover className="overflow-hidden group">
                            <div className={`h-28 relative overflow-hidden ${resource.bgClass}`}><div className={`absolute inset-0 flex items-center justify-center ${resource.iconClass}`}><resource.icon className="w-12 h-12 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} /></div></div>
                            <div className="p-4"><p className={`text-[10px] font-bold uppercase tracking-wider ${resource.labelClass}`}>{resource.type}</p><h5 className="text-sm font-bold mt-1 text-slate-900 dark:text-white">{resource.title}</h5></div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StagiaireDashboard;
