import { Link } from 'react-router-dom';
import { Button } from '../components/common';

const Maintenance = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
            <div className="text-center max-w-md animate-fadeIn">
                <div className="text-primary mb-8">
                    <span className="material-symbols-outlined text-[120px]">construction</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Under Maintenance</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
                    We're currently performing scheduled maintenance. Please check back soon.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button as={Link} to="/" variant="primary" icon="refresh">
                        Refresh
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
