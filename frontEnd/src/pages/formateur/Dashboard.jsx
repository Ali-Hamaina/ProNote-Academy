import { useState, useEffect } from 'react';
import { Card, Button, Badge, PageHeader } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { Layers, Clock, User, Info, CalendarCheck, Plus, Loader2 } from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import sessionService from '../../services/sessionService';
import taskService from '../../services/taskService';

const FormateurDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, schedRes, taskRes] = await Promise.all([
                    dashboardService.getFormateurDashboard(),
                    sessionService.getUserSchedule(),
                    taskService.getAll(),
                ]);
                setDashboard(dashRes.data || dashRes);
                const s = schedRes.data || schedRes;
                setSchedule(Array.isArray(s) ? s : s.data || []);
                const t = taskRes.data || taskRes;
                setTasks(Array.isArray(t) ? t : t.data || []);
            } catch { /* silent */ }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const d = dashboard || {};

    return (
        <div className="space-y-8">
            <Breadcrumbs items={[{ label: 'Dashboard' }]} />
            <PageHeader title={`Hello, Formateur ${d.name || ''}`} subtitle="Here's a summary of your pedagogical activity for today.">
                <Button variant="secondary" icon={Plus}>Upload Course Material</Button>
                <Button icon={Plus}>New Assessment</Button>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Card hover>
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 p-2.5 rounded-xl"><Layers className="w-6 h-6" strokeWidth={2} /></div>
                            <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full">{d.modules_change || '+0 this week'}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Modules</p>
                        <p className="text-3xl font-bold mt-1 tracking-tight">{d.active_modules || 0}</p>
                        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" strokeWidth={2} /> {d.module_names || 'No modules'}</p>
                    </Card>

                    <Card hover>
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 p-2.5 rounded-xl"><Clock className="w-6 h-6" strokeWidth={2} /></div>
                            <span className="text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 text-xs font-semibold px-2.5 py-1 rounded-full">{d.ungraded_count > 0 ? 'Urgent' : 'Up to date'}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ungraded Assessments</p>
                        <p className="text-3xl font-bold text-orange-600 mt-1 tracking-tight">{d.ungraded_count || 0}</p>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-4"><div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${d.grading_progress || 0}%` }} /></div>
                        <p className="text-xs text-slate-400 mt-2">Average delay: {d.avg_delay || 'N/A'}</p>
                    </Card>

                    <Card className="md:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <div><h3 className="text-lg font-bold">Class Success Rate</h3><p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Performance across all active modules</p></div>
                            <div className="text-right"><p className="text-2xl font-bold tracking-tight">{d.success_rate || 0}%</p><p className="text-emerald-600 text-xs font-semibold">{d.success_change || '+0% vs last semester'}</p></div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative size-36 shrink-0">
                                <svg className="size-full -rotate-90" viewBox="0 0 36 36"><circle className="stroke-slate-100 dark:stroke-slate-800" cx="18" cy="18" fill="none" r="16" strokeWidth="3" /><circle className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray={`${d.success_rate || 0}, 100`} strokeWidth="3" strokeLinecap="round" /></svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col"><span className="text-xl font-bold">{d.success_rate || 0}%</span><span className="text-[10px] text-slate-400 uppercase font-bold">Avg</span></div>
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                                {[
                                    { label: 'Passing', count: `${d.passing || 0} Students`, color: 'bg-primary' },
                                    { label: 'At Risk', count: `${d.at_risk || 0} Students`, color: 'bg-amber-500' },
                                    { label: 'Failing', count: `${d.failing || 0} Students`, color: 'bg-red-500' },
                                    { label: 'Inactive', count: `${d.inactive || 0} Students`, color: 'bg-slate-400' },
                                ].map((item) => (
                                    <div key={item.label} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                                        <div className="flex items-center gap-2"><span className={`size-2 rounded-full ${item.color}`} /><span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</span></div>
                                        <p className="text-sm font-bold">{item.count}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                <Card padding="none" className="flex flex-col">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center"><h3 className="text-lg font-bold">Daily Schedule</h3><button className="text-primary text-sm font-semibold hover:underline">View Week</button></div>
                    <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Today</p>
                        {schedule.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No sessions today</p>}
                        {schedule.map((item, index) => (
                            <div key={item.id || index} className={`flex gap-4 p-3 rounded-xl transition-all ${item.active ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary' : 'border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                <div className={`text-xs font-bold w-16 pt-0.5 shrink-0 ${item.active ? 'text-primary' : 'text-slate-400'}`}>{item.start_time || item.time}</div>
                                <div className="flex flex-col gap-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{item.title || item.module?.name || 'Session'}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.location || item.room || ''}</p>
                                    {item.attendance && <div className="flex items-center gap-1.5 mt-1"><User className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} /><span className="text-[10px] font-medium text-slate-500">{item.attendance}</span></div>}
                                </div>
                            </div>
                        ))}
                        <div className="mt-3 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                            <CalendarCheck className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" strokeWidth={2} />
                            <p className="text-xs font-medium text-slate-400">No more classes today.</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-3">
                    <h3 className="text-lg font-bold mb-6">Current Week Overview</h3>
                    <div className="grid grid-cols-5 gap-3 h-36">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                            <div key={day} className="flex flex-col gap-2">
                                <div className="bg-primary/10 rounded-lg flex-1 border border-primary/20" style={{ height: `${[50, 60, 70, 40, 30][i]}%` }} />
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg" style={{ height: `${[30, 20, 0, 40, 30][i]}%` }} />
                                <p className="text-center text-[10px] font-bold text-slate-400 mt-1 uppercase">{day}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-bold mb-4">Quick Tasks</h3>
                    <div className="flex flex-col gap-2.5">
                        {tasks.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No tasks</p>}
                        {tasks.map((task, index) => (
                            <label key={task.id || index} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                                <input type="checkbox" defaultChecked={task.done || task.completed} className="rounded-md text-primary focus:ring-primary/30 size-4 border-slate-300" />
                                <span className="text-sm font-medium">{task.title || task.label}</span>
                            </label>
                        ))}
                        <button className="mt-3 text-primary text-xs font-bold flex items-center gap-1.5 hover:underline"><Plus className="w-4 h-4" strokeWidth={2} /> ADD TASK</button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FormateurDashboard;
