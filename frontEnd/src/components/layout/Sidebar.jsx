import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    School,
    BookOpen,
    BarChart3,
    Calendar,
    UserCircle,
    GraduationCap,
    FileText,
    Settings,
    LogOut,
    Plus,
    FolderOpen
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, role = 'admin' }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = {
        admin: [
            { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
            { icon: Users, label: 'Users', to: '/admin/users' },
            { icon: School, label: 'Classes', to: '/admin/classes' },
            { icon: BookOpen, label: 'Modules', to: '/admin/modules' },
            { icon: BarChart3, label: 'Statistics', to: '/admin/statistics' },
        ],
        formateur: [
            { icon: LayoutDashboard, label: 'Dashboard', to: '/formateur/dashboard' },
            { icon: BookOpen, label: 'My Modules', to: '/formateur/modules' },
            { icon: Calendar, label: 'Schedule', to: '/formateur/schedule' },
            { icon: Users, label: 'Students', to: '/formateur/students' },
            { icon: GraduationCap, label: 'Gradebook', to: '/formateur/grades' },
            { icon: UserCircle, label: 'Attendance', to: '/formateur/attendance' },
            { icon: FileText, label: 'Reports', to: '/formateur/reports' },
        ],
        stagiaire: [
            { icon: LayoutDashboard, label: 'My Dashboard', to: '/stagiaire/dashboard' },
            { icon: GraduationCap, label: 'My Grades', to: '/stagiaire/grades' },
            { icon: Calendar, label: 'Attendance', to: '/stagiaire/attendance' },
            { icon: FolderOpen, label: 'Resources', to: '/stagiaire/resources' },
        ],
    };

    const roleLabels = {
        admin: 'Admin Portal',
        formateur: 'Formateur Workspace',
        stagiaire: 'Stagiaire Portal',
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed lg:sticky top-0 left-0 z-40 h-screen
                    w-[280px] bg-white dark:bg-slate-900 
                    border-r border-slate-200 dark:border-slate-800 
                    flex flex-col
                    transform transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="bg-primary size-11 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/25">
                            <School className="w-6 h-6" strokeWidth={2} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">ProNote Academy</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5">{roleLabels[role]}</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-1.5 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2">
                            Main Menu
                        </p>
                        {navItems[role]?.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={onClose}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                                    ${isActive
                                        ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }
                                `}
                            >
                                <item.icon className="w-5 h-5" strokeWidth={2} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                        {role === 'admin' && (
                            <button className="w-full bg-primary text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-[0.98]">
                                <Plus className="w-5 h-5" strokeWidth={2} />
                                <span>New Instance</span>
                            </button>
                        )}

                        <NavLink
                            to={`/${role}/settings`}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                                ${isActive
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }
                            `}
                        >
                            <Settings className="w-5 h-5" strokeWidth={2} />
                            <span className="text-sm font-medium">Settings</span>
                        </NavLink>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all w-full text-left"
                        >
                            <LogOut className="w-5 h-5" strokeWidth={2} />
                            <span className="text-sm font-medium">Logout</span>
                        </button>

                        <div className="flex items-center gap-3 p-3 mt-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-2 ring-primary/20">
                                <UserCircle className="w-6 h-6" strokeWidth={2} />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
