import { forwardRef } from 'react';

const Card = forwardRef(({
    children,
    className = '',
    padding = 'md',
    hover = false,
    shadow = 'sm',
    variant = 'default',
    ...props
}, ref) => {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const shadows = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
    };

    const variants = {
        default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
        elevated: 'bg-white dark:bg-slate-900',
        ghost: 'bg-transparent',
        primary: 'bg-primary text-white border-none',
    };

    return (
        <div
            ref={ref}
            className={`
                ${variants[variant]}
                rounded-xl
                ${shadows[shadow]}
                ${hover ? 'hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''}
                ${paddings[padding]}
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';

export default Card;
