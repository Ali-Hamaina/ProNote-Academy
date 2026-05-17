import { forwardRef } from 'react';

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg border font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    const variants = {
        primary: 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:border-blue-700 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/25',
        secondary: 'border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
        outline: 'border-slate-300 bg-transparent text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800',
        ghost: 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
        danger: 'border-red-500 bg-red-500 text-white shadow-sm shadow-red-500/20 hover:border-red-600 hover:bg-red-600 hover:shadow-md hover:shadow-red-500/25',
        success: 'border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 hover:border-emerald-600 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-500/25',
    };

    const sizes = {
        sm: 'text-sm px-3 py-2 min-h-9',
        md: 'text-sm px-4 py-2.5 min-h-10',
        lg: 'text-base px-5 py-3 min-h-12',
        icon: 'size-10 p-0',
    };

    const renderIcon = () => {
        if (!Icon) return null;

        if (typeof Icon === 'string') {
            return <span className="material-symbols-outlined text-[20px] leading-none">{Icon}</span>;
        }

        return <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />;
    };

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            {...props}
        >
            {loading && (
                <span className="custom-spinner" />
            )}
            {!loading && Icon && iconPosition === 'left' && renderIcon()}
            {children}
            {!loading && Icon && iconPosition === 'right' && renderIcon()}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
