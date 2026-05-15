const PageHeader = ({ title, subtitle, children, className = '' }) => {
    return (
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${className}`}>
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        {subtitle}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-3">
                    {children}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
