import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ role = 'admin', pageTitle = 'Dashboard' }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/20">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                role={role}
            />

            <main className="flex-1 flex flex-col min-w-0 lg:ml-0">
                <Navbar
                    onMenuClick={() => setSidebarOpen(true)}
                    title={pageTitle}
                />

                <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                    <div className="max-w-[1600px] mx-auto w-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
