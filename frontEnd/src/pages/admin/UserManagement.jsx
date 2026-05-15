import { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Input, PageHeader } from '../../components/common';
import { Breadcrumbs } from '../../components/layout';
import { Filter, Shield, User, Pencil, Trash2, ChevronLeft, ChevronRight, UserPlus, Loader2 } from 'lucide-react';
import userService from '../../services/userService';

const UserManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState({ role: 'all', status: 'all' });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', role: '', class_id: '' });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const params = { page };
            if (filter.role !== 'all') params.role = filter.role;
            if (filter.status !== 'all') params.status = filter.status;
            const res = await userService.getAll(params);
            const d = res.data || res;
            setUsers(Array.isArray(d) ? d : d.data || []);
            if (d.current_page) setPagination({ current_page: d.current_page, last_page: d.last_page, total: d.total });
        } catch { setUsers([]); }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, [filter]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError('');
        try {
            await userService.create({ name: `${formData.first_name} ${formData.last_name}`, email: formData.email, role: formData.role.toLowerCase(), password: 'password123', password_confirmation: 'password123' });
            setShowModal(false);
            setFormData({ first_name: '', last_name: '', email: '', role: '', class_id: '' });
            fetchUsers(pagination.current_page);
        } catch (err) {
            const msg = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : 'Failed to create user.';
            setFormError(msg);
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try { await userService.delete(id); fetchUsers(pagination.current_page); } catch { /* silent */ }
    };

    const roleColors = { admin: 'warning', Admin: 'warning', formateur: 'primary', Formateur: 'primary', stagiaire: 'purple', Stagiaire: 'purple' };

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'User Management' }]} />
            <PageHeader title="User Management" subtitle="Manage and organize trainers, students, and administrative staff.">
                <Button icon={UserPlus} onClick={() => setShowModal(true)}>Add New User</Button>
            </PageHeader>

            <Card padding="none">
                <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" strokeWidth={2} />
                            <select className="pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary min-w-[140px] outline-none transition-all" value={filter.role} onChange={(e) => setFilter({ ...filter, role: e.target.value })}>
                                <option value="all">All Roles</option><option value="admin">Admin</option><option value="formateur">Formateur</option><option value="stagiaire">Stagiaire</option>
                            </select>
                        </div>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" strokeWidth={2} />
                            <select className="pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary min-w-[140px] outline-none transition-all" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                                <option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="text-slate-500 text-sm">Showing <span className="font-semibold text-slate-900 dark:text-white">{users.length}</span> of <span className="font-semibold text-slate-900 dark:text-white">{pagination.total || users.length}</span> users</div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead><tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">User Details</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Class/Department</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                            </tr></thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {users.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No users found</td></tr>}
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><User className="w-5 h-5" strokeWidth={2} /></div><div><p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div></div></td>
                                        <td className="px-6 py-4"><Badge variant={roleColors[user.role] || 'primary'}>{user.role}</Badge></td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.class?.name || user.department || '—'}</td>
                                        <td className="px-6 py-4"><div className={`flex items-center gap-2 ${user.status === 'active' || user.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}><div className={`size-2 rounded-full ${user.status === 'active' || user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} /><span className="text-xs font-medium capitalize">{user.status || 'active'}</span></div></td>
                                        <td className="px-6 py-4 text-right"><div className="flex justify-end gap-1"><button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Pencil className="w-5 h-5" strokeWidth={2} /></button><button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-5 h-5" strokeWidth={2} /></button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <button onClick={() => fetchUsers(pagination.current_page - 1)} disabled={pagination.current_page <= 1} className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 transition-colors"><ChevronLeft className="w-[18px] h-[18px]" strokeWidth={2} /> Previous</button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: pagination.last_page }, (_, i) => (
                            <button key={i} onClick={() => fetchUsers(i + 1)} className={`size-9 rounded-lg text-sm font-medium transition-colors ${pagination.current_page === i + 1 ? 'bg-primary text-white font-semibold' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{i + 1}</button>
                        ))}
                    </div>
                    <button onClick={() => fetchUsers(pagination.current_page + 1)} disabled={pagination.current_page >= pagination.last_page} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 transition-colors">Next <ChevronRight className="w-[18px] h-[18px]" strokeWidth={2} /></button>
                </div>
            </Card>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New User">
                <form className="space-y-4" onSubmit={handleCreate}>
                    {formError && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-red-600 text-sm">{formError}</div>}
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="First Name" placeholder="e.g. Jean" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} required />
                        <Input label="Last Name" placeholder="e.g. Dupont" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} required />
                    </div>
                    <Input label="Email Address" type="email" placeholder="jean.dupont@protonate.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">User Role</label>
                        <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required>
                            <option value="">Select Role</option><option value="admin">Admin</option><option value="formateur">Formateur</option><option value="stagiaire">Stagiaire</option>
                        </select>
                    </div>
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-6">
                        <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" loading={submitting}>Create User</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserManagement;
