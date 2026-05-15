import { useState, useEffect } from 'react';
import { Card, Badge, PageHeader } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { Loader2, Download, FileText } from 'lucide-react';
import resourceService from '../../services/resourceService';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try { const r = await resourceService.getAll(); const d = r.data || r; setResources(Array.isArray(d) ? d : d.data || []); } catch { setResources([]); }
            setLoading(false);
        };
        fetch();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Breadcrumbs items={[{ label: 'Resources' }]} />
            <PageHeader title="Course Resources" subtitle="Access and download learning materials shared by your formateurs." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {resources.length === 0 && <Card className="col-span-full text-center"><FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-400">No resources available</p></Card>}
                {resources.map((r, i) => (
                    <Card key={r.id || i} hover className="group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="bg-primary/10 p-2.5 rounded-xl"><FileText className="w-6 h-6 text-primary" /></div>
                            <Badge variant="primary" size="sm">{r.type || 'File'}</Badge>
                        </div>
                        <h3 className="font-bold text-base mb-1">{r.title || r.name}</h3>
                        <p className="text-sm text-slate-500 mb-3">{r.module?.name || ''}</p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>{r.size || ''}</span>
                            <button className="flex items-center gap-1 text-primary font-semibold hover:underline"><Download className="w-4 h-4" /> Download</button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Resources;
