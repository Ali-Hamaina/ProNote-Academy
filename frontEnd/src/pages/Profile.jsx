import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, PageHeader } from '../components/common';
import { Breadcrumbs } from '../components/layout';
import profileService from '../services/profileService';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', bio: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await profileService.get();
                const d = res.data || res;
                setFormData({ name: d.name || '', email: d.email || '', phone: d.phone || '', bio: d.bio || '' });
            } catch {
                setFormData({ name: user?.name || '', email: user?.email || '', phone: '', bio: '' });
            }
        };
        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        setLoading(true); setError(''); setSuccess('');
        try {
            const res = await profileService.update(formData);
            const updated = res.data || res;
            setUser(prev => ({ ...prev, ...updated }));
            localStorage.setItem('pronote_user', JSON.stringify({ ...user, ...updated }));
            setEditing(false);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Breadcrumbs items={[{ label: 'Profile' }]} />
            <PageHeader title="My Profile">
                <Button variant={editing ? 'primary' : 'secondary'} icon={editing ? 'save' : 'edit'} onClick={() => editing ? handleSave() : setEditing(true)} loading={loading}>
                    {editing ? 'Save Changes' : 'Edit Profile'}
                </Button>
                {editing && <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>}
            </PageHeader>

            {success && <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl text-emerald-600 text-sm font-medium">{success}</div>}
            {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-xl text-red-600 text-sm font-medium">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="text-center">
                    <div className="size-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 ring-4 ring-primary/5"><span className="material-symbols-outlined text-5xl">person</span></div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || 'User'}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm capitalize mt-1">{user?.role || 'Guest'}</p>
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800"><p className="text-xs text-slate-400 font-medium">Member since</p><p className="font-semibold text-slate-900 dark:text-white mt-0.5">{user?.created_at || 'N/A'}</p></div>
                </Card>

                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold mb-6">Personal Information</h3>
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={!editing} />
                            <Input label="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!editing} />
                        </div>
                        <Input label="Phone Number" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!editing} placeholder="+33 6 12 34 56 78" />
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bio</label>
                            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} disabled={!editing} placeholder="Tell us a little about yourself..." rows={4} className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed resize-none" />
                        </div>
                    </div>
                </Card>

                <Card className="lg:col-span-3">
                    <h3 className="text-lg font-bold mb-6">Security</h3>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="secondary" icon="lock">Change Password</Button>
                        <Button variant="secondary" icon="security">Two-Factor Authentication</Button>
                        <Button variant="ghost" icon="history">View Login History</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
