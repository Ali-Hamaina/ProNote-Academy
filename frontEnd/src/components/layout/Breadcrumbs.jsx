import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items = [] }) => {
    return (
        <nav className="flex items-center gap-2 text-sm">
            <Link
                to="/"
                className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
            >
                <Home className="w-4 h-4" strokeWidth={2} />
                <span>Home</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700" strokeWidth={2} />
                    {item.to ? (
                        <Link
                            to={item.to}
                            className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors font-medium"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-900 dark:text-white font-semibold">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
