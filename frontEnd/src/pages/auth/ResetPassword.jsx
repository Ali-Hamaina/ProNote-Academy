import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input } from '../../components/common';
import authService from '../../services/authService';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const token = searchParams.get('token');
            const email = searchParams.get('email');
            await authService.resetPassword(token, email, formData.password, formData.confirmPassword);
            navigate('/login?reset=success');
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.errors?.password?.[0];
            setError(message || 'Failed to reset password. The link may have expired.');
            setLoading(false);
            return;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f6f6f8] dark:bg-[#101622] px-6 py-12">
            <div className="w-full max-w-[420px]">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10 justify-center">
                    <div className="bg-[#135bec] p-2 rounded-lg">
                        <svg className="size-6 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor" />
                        </svg>
                    </div>
                    <h2 className="text-[#111318] dark:text-white text-xl font-bold">ProNote Academy</h2>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
                    <div className="text-center mb-8">
                        <div className="size-16 bg-[#135bec]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-[#135bec] text-3xl">password</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[#111318] dark:text-white mb-2">Set New Password</h3>
                        <p className="text-[#616f89]">Your password must be at least 8 characters.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg flex items-center gap-3">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">error</span>
                            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="New Password"
                            type="password"
                            icon="lock"
                            placeholder="Enter new password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            icon="lock"
                            placeholder="Confirm new password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                        >
                            Reset Password
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm text-[#616f89] hover:text-[#135bec] transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
