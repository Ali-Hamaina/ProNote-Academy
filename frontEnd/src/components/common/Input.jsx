import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    type = 'text',
    icon: Icon,
    error,
    helperText,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    return (
        <div className={`flex flex-col gap-2 ${containerClassName}`}>
            {label && (
                <label className="text-sm font-semibold text-slate-900 dark:text-white">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" strokeWidth={2} />
                )}
                <input
                    ref={ref}
                    type={type}
                    className={`
            w-full py-3 rounded-xl border bg-white dark:bg-slate-800 
            text-slate-900 dark:text-white 
            focus:ring-2 focus:ring-primary/20 focus:border-primary 
            outline-none transition-all 
            placeholder:text-slate-400
            ${Icon ? 'pl-12 pr-4' : 'px-4'}
            ${error
                            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                            : 'border-slate-200 dark:border-slate-700'
                        }
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-xs text-slate-500">{helperText}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
