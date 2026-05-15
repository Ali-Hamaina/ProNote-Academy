import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../../components/common';
import authService from '../../services/authService';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setSubmitted(true);
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.errors?.email?.[0];
            setError(message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
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
                    {!submitted ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="size-16 bg-[#135bec]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-[#135bec] text-3xl">lock_reset</span>
                                </div>
                                <h3 className="text-2xl font-bold text-[#111318] dark:text-white mb-2">Forgot Password?</h3>
                                <p className="text-[#616f89]">No worries, we'll send you reset instructions.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    icon="mail"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    loading={loading}
                                    style={{ color: 'black' }}
                                >
                                    Reset Password
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="size-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                            </div>
                            <h3 className="text-2xl font-bold text-[#111318] dark:text-white mb-2">Check your email</h3>
                            <p className="text-[#616f89] mb-6">
                                We've sent a password reset link to<br />
                                <span className="font-medium text-[#111318] dark:text-white">{email}</span>
                            </p>
                            <p className="text-sm text-[#616f89]">
                                Didn't receive the email?{' '}
                                <button
                                    style={{ color: 'black' }}
                                    onClick={() => setSubmitted(false)}
                                    className="text-[#135bec] font-semibold hover:underline"
                                >
                                    Click to resend
                                </button>
                            </p>
                        </div>
                    )}

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

export default ForgotPassword;
