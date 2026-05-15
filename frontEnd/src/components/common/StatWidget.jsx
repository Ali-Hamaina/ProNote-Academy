const StatWidget = ({
    icon: Icon,
    label,
    value,
    change,
    positive = true,
    color = 'blue',
    className = '',
}) => {
    const iconColorClasses = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
        red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        gray: 'bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400',
    };

    const barColors = {
        blue: 'bg-blue-100 dark:bg-blue-900/30',
        purple: 'bg-purple-100 dark:bg-purple-900/30',
        amber: 'bg-amber-100 dark:bg-amber-900/30',
        emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
        red: 'bg-red-100 dark:bg-red-900/30',
        orange: 'bg-orange-100 dark:bg-orange-900/30',
        gray: 'bg-slate-100 dark:bg-slate-800/30',
    };

    const barActiveColors = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        amber: 'bg-amber-500',
        emerald: 'bg-emerald-500',
        red: 'bg-red-500',
        orange: 'bg-orange-500',
        gray: 'bg-slate-500',
    };

    return (
        <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 ${className}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${iconColorClasses[color] || iconColorClasses.blue}`}>
                    {Icon && <Icon className="w-6 h-6" strokeWidth={2} />}
                </div>
                {change && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${positive
                        ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                        {change}
                    </span>
                )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{label}</p>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</h3>

            <div className="mt-4 h-10 w-full flex items-end gap-1">
                {[35, 50, 70, 100, 55].map((h, i) => (
                    <div
                        key={i}
                        className={`w-full rounded-t transition-all duration-300 ${i === 3 ? barActiveColors[color] : barColors[color]
                            }`}
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>
        </div>
    );
};

export default StatWidget;
