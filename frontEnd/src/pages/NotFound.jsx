import { Link } from 'react-router-dom';
import { Button } from '../components/common';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
            <div className="text-center max-w-md animate-fadeIn">
                <div className="text-primary mb-8">
                    <span className="material-symbols-outlined text-[120px]">search_off</span>
                </div>
                <h1 className="text-7xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">404</h1>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Page Not Found</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button as={Link} to="/" variant="primary" icon="home">
                        Go Home
                    </Button>
                    <Button as={Link} to="/login" variant="secondary">
                        Back to Login
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
