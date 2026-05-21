import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Modal, PageHeader } from '../components/common';
import { Breadcrumbs } from '../components/layout';
import profileService from '../services/profileService';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', bio: '' });
    const [passwordModal, setPasswordModal] = useState(false);
    const [historyModal, setHistoryModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current_password: '', password: '', password_confirmation: '' });
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await profileService.get();
                const d = res.data || res;
                setProfileData(d);
                setFormData({ name: d.name || '', email: d.email || '', phone: d.phone || '', bio: d.bio || '' });
            } catch {
                setProfileData(user);
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

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordSubmitting(true);
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordForm.password !== passwordForm.password_confirmation) {
            setPasswordError('Passwords do not match');
            setPasswordSubmitting(false);
            return;
        }

        if (passwordForm.password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            setPasswordSubmitting(false);
            return;
        }

        try {
            await profileService.changePassword(
                passwordForm.current_password,
                passwordForm.password,
                passwordForm.password_confirmation
            );
            setPasswordSuccess('Password changed successfully!');
            setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
            setTimeout(() => {
                setPasswordModal(false);
                setPasswordSuccess('');
            }, 1500);
        } catch (err) {
            setPasswordError(err.response?.data?.error || err.response?.data?.message || 'Failed to change password.');
        }
        setPasswordSubmitting(false);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
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
                        <Button variant="secondary" icon="lock" onClick={() => { setPasswordError(''); setPasswordSuccess(''); setPasswordForm({ current_password: '', password: '', password_confirmation: '' }); setPasswordModal(true); }}>Change Password</Button>
                        <Button variant="ghost" icon="history" onClick={() => setHistoryModal(true)}>View Login History</Button>
                    </div>
                </Card>

                {/* Change Password Modal */}
                <Modal isOpen={passwordModal} onClose={() => { setPasswordModal(false); setPasswordError(''); setPasswordSuccess(''); }} title="Change Password" size="sm">
                    <form className="space-y-4" onSubmit={handlePasswordChange}>
                        {passwordError && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-red-600 text-sm">{passwordError}</div>}
                        {passwordSuccess && <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 rounded-lg text-emerald-600 text-sm">{passwordSuccess}</div>}
                        <Input label="Current Password" type="password" icon="lock" value={passwordForm.current_password} onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })} required />
                        <Input label="New Password" type="password" icon="lock" value={passwordForm.password} onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })} required />
                        <Input label="Confirm New Password" type="password" icon="lock" value={passwordForm.password_confirmation} onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })} required />
                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                            <Button type="button" variant="ghost" onClick={() => { setPasswordModal(false); setPasswordError(''); setPasswordSuccess(''); }}>Cancel</Button>
                            <Button type="submit" loading={passwordSubmitting}>Change Password</Button>
                        </div>
                    </form>
                </Modal>

                {/* Login History Modal */}
                <Modal isOpen={historyModal} onClose={() => setHistoryModal(false)} title="Login History" size="sm">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">login</span></div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Last Login</p>
                                <p className="text-sm text-slate-500">{formatDate(profileData?.last_login_at)}</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">Login history tracking shows your most recent session activity.</p>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Profile;
