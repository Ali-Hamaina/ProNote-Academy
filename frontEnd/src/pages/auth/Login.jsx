import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/common';
import { Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg] = useState(() => {
        if (searchParams.get('reset') === 'success') return 'Password reset successfully. Please sign in.';
        if (searchParams.get('session_expired')) return 'Session expired. Please sign in again.';
        return '';
    });
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please enter your email and password.');
            setLoading(false);
            return;
        }

        try {
            const userData = await login(formData.email, formData.password);

            const routes = {
                admin: '/admin/dashboard',
                formateur: '/formateur/dashboard',
                stagiaire: '/stagiaire/dashboard',
            };
            navigate(routes[userData?.role] || '/');
        } catch (err) {
            const status = err.response?.status;
            if (status === 422) {
                const messages = err.response?.data?.errors;
                if (messages) {
                    setError(Object.values(messages).flat().join(' '));
                } else {
                    setError(err.response?.data?.message || 'Validation error.');
                }
            } else if (status === 401) {
                setError('Invalid email or password. Please try again.');
            } else {
                setError('Server error. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex items-stretch">
            <div className="hidden lg:flex w-1/2 bg-geometric relative overflow-hidden flex-col justify-center items-center p-12 text-white">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col items-start max-w-lg">
                    <div className="mb-10 flex items-center gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
                            <svg className="size-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">ProNote Academy</h1>
                    </div>

                    <h2 className="text-4xl font-extrabold leading-tight mb-6">Elevate your pedagogical management experience.</h2>
                    <p className="text-lg text-white/90 font-light mb-10 leading-relaxed">
                        A comprehensive platform tailored for Administrators, Formateurs, and Stagiaires to manage learning journeys with precision and ease.
                    </p>



                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 bg-slate-50 dark:bg-slate-950">
                <div className="w-full max-w-[420px] flex flex-col">
                    <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
                        <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/25">
                            <svg className="size-6 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor" />
                            </svg>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-xl font-bold">ProNote Academy</h2>
                    </div>

                    <div className="text-center lg:text-left mb-8">
                        <h3 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h3>
                        <p className="text-slate-500 dark:text-slate-400">Please enter your details to sign in.</p>
                    </div>

                    {successMsg && (
                        <div className="mb-6 animate-scaleIn">
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl flex items-center gap-3">
                                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">{successMsg}</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 animate-scaleIn">
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center gap-3">
                                <span className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email address"

                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <br />
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" strokeWidth={2} />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" strokeWidth={2} />
                                    ) : (
                                        <Eye className="w-5 h-5" strokeWidth={2} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px' }} className=" flex items-center justify-between py-1">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/30 bg-white dark:bg-slate-800"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline underline-offset-4">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                            style={{ color: 'black' }}
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Having trouble logging in?{' '}
                            <a href="#" className="text-primary font-semibold hover:underline">Contact Support</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
