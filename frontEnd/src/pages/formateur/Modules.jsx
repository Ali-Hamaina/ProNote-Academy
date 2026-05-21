import { useState, useEffect } from 'react';
import { Card, Badge, PageHeader } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { BookOpen, Loader2 } from 'lucide-react';
import classService from '../../services/classService';

const getRows = (r) => Array.isArray(r) ? r : (r?.data?.data ? r.data.data : r?.data || []);

const Modules = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const r = await classService.getFormateurClasses();
                const data = getRows(r);
                setClasses(data);
                if (!data.length) setError('No classes assigned to you yet.');
            } catch (err) {
                setError('Failed to load data. Please try again.');
            }
            setLoading(false);
        };
        fetch();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Formateur', to: '/formateur/dashboard' }, { label: 'My Modules' }]} />
            <PageHeader title="My Modules" subtitle="View modules assigned to your classes." />
            {error && !classes.length && (
                <Card className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400">{error}</p>
                </Card>
            )}
            {classes.map(cls => (
                <Card key={cls.id} padding="none">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <h3 className="font-bold text-lg text-primary">{cls.name}</h3>
                        <p className="text-xs text-slate-500">{cls.code || ''} &middot; {cls.enrollments?.length || 0} students</p>
                    </div>
                    {(!cls.modules || cls.modules.length === 0) && (
                        <div className="px-6 py-8 text-center text-sm text-slate-400">No modules assigned to this class.</div>
                    )}
                    {cls.modules?.map((m, i) => (
                        <div key={m.id || i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <BookOpen className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold">{m.name}</span>
                                    <Badge variant={m.status === 'published' ? 'success' : 'warning'} size="sm">{m.status || 'draft'}</Badge>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">Block {m.block_number || m.order_position || i + 1} &middot; {m.hours || 0} hours</p>
                            </div>
                            {m.description && (
                                <p className="text-xs text-slate-400 hidden lg:block max-w-xs truncate">{m.description}</p>
                            )}
                        </div>
                    ))}
                </Card>
            ))}
        </div>
    );
};

export default Modules;
