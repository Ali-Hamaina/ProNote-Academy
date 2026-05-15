import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, Search, Bell, MessageCircle, Sun, Moon, User } from 'lucide-react';

const Navbar = ({ onMenuClick, title = 'Overview' }) => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" strokeWidth={2} />
                </button>

                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl justify-center px-4">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2} />
                    <input
                        type="text"
                        placeholder="Search students, grades, courses..."
                        className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 flex-1 justify-end">
                <button className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" strokeWidth={2} />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" strokeWidth={2} />
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                    </button>

                    {showNotifications && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowNotifications(false)}
                            />
                            <div className="absolute right-0 top-14 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-scaleIn overflow-hidden">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                    <h3 className="font-bold text-sm">Notifications</h3>
                                    <Link to="/notifications" className="text-xs text-primary font-semibold hover:underline">View All</Link>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex gap-3">
                                            <div className="size-2 bg-primary rounded-full mt-2 shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">New grade posted</p>
                                                <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                        <div className="flex gap-3">
                                            <div className="size-2 bg-slate-300 dark:bg-slate-600 rounded-full mt-2 shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">Class rescheduled</p>
                                                <p className="text-xs text-slate-500 mt-1">Yesterday</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>


                <button className="hidden lg:flex p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <MessageCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" strokeWidth={2} />
                </button>

                <div className="hidden lg:block h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

                <Link to="/profile" className="flex items-center gap-3 cursor-pointer group p-1.5 -mr-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="hidden lg:block text-right">
                        <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white">{user?.name || 'User'}</p>
                        <p className="text-[11px] text-slate-500 mt-1 capitalize">{user?.role || 'Guest'}</p>
                    </div>
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                        <User className="w-5 h-5" strokeWidth={2} />
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
